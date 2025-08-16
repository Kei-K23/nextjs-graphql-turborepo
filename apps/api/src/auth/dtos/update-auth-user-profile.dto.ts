import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateAuthUserProfileDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  username: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  displayName?: string;

  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true })
  email: string;
}
