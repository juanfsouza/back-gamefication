import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  password?: string;
}
