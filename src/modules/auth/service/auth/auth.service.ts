import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/service/user.service';
import { AuthDto } from '../../dto/auth-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<any> {
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) throw new UnauthorizedException();

    const payload = { sub: user.email, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
