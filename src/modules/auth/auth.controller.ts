import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { AuthDto } from './dto/auth-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async auth(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
