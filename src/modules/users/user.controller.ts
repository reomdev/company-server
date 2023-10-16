import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserDto } from './dto/user-dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('find')
  getUsersByEmail(@Body() userDto: UserDto) {
    console.log(userDto);
    return this.userService.findByEmail(userDto.email);
  }

  @UseGuards(AuthGuard)
  @Get('find/all')
  getUsers() {
    return this.userService.findAll();
  }

  @Post('create')
  createUser(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @UseGuards(AuthGuard)
  @Post('update/:id')
  updateUser(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.update(id, user);
  }
}
