import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RegisterDto, RegisterDtoType } from './dto/register.dto';
import { LoginDto, LoginDtoType } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDto))
  async register(@Body() registerDto: RegisterDtoType) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(@Body() loginDto: LoginDtoType) {
    return this.authService.login(loginDto);
  }
}
