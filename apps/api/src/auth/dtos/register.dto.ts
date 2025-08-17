import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  username: string;

  @IsString()
  @Field(() => String, { nullable: true, defaultValue: '' })
  displayName?: string = '';

  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
