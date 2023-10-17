import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserDto } from './dto/user-dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Get('find')
  getUsersByEmail(@Body() userDto: UserDto) {
    return this.userService.findByEmail(userDto.email);
  }

  // @UseGuards(AuthGuard)
  @Get('find/all')
  getUsers() {
    return this.userService.findAll();
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('create')
  createUser(
    @Body() userDto: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.create(userDto, file);
  }

  // @UseGuards(AuthGuard)
  @Post('update/:id')
  updateUser(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.update(id, user);
  }
}
