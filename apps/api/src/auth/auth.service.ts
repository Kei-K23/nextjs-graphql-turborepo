import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from './interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './models/refresh-token.model';
import { RegisterDto } from './dtos/register.dto';
import { TokenResponse } from './dtos/token-response.dto';
import { UpdateAuthUserProfileDto } from './dtos/update-auth-user-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async validateUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async register(registerDto: RegisterDto): Promise<TokenResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create(registerDto);
    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: savedUser,
    };
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
    };

    // Revoke all previous refresh token here
    await this.revokeAllUserTokens(user.id);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(refreshTokenString: string): Promise<TokenResponse> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString, isRevoked: false },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.expiresAt < new Date()) {
      // Revoke the refresh token
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);

      throw new UnauthorizedException(
        'Expired refresh token! Please login again',
      );
    }

    // Check user is actually exist
    const user = await this.userRepository.findOne({
      where: { id: refreshToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const payload: JwtPayload = {
      sub: refreshToken.user.id,
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user,
    };
  }

  async logout(refreshTokenString: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString, isRevoked: false },
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
      return true;
    }

    return false; // Return false if token not found
  }

  async revokeAllUserTokens(userId: number) {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ),
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
    return token;
  }

  async updateAuthUserProfile(
    id: number,
    updateUserDto: UpdateAuthUserProfileDto,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found with id : ${id}`);
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });

    return updatedUser;
  }

  async deleteAuthUserProfile(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }
}
