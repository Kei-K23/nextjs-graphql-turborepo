import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { TokenResponse } from './dtos/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../users/models/user.model';
import { UpdateAuthUserProfileDto } from './dtos/update-auth-user-profile.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
  ): Promise<TokenResponse> {
    return this.authService.register(registerDto);
  }

  @Mutation(() => TokenResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<TokenResponse> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => TokenResponse)
  async refreshToken(
    @Args('refreshTokenDto') refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Args('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async profile(@Context() context: any): Promise<User> {
    return context.req.user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('updateUserDto') updateUserDto: UpdateAuthUserProfileDto,
    @Context() context: any,
  ): Promise<User | null> {
    return this.authService.updateAuthUserProfile(
      context.req.user.id,
      updateUserDto,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Context() context: any): Promise<boolean> {
    return this.authService.deleteAuthUserProfile(context.req.user.id);
  }
}
