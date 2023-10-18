import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptorDecorator } from 'src/utils/decorator/file-interceptor-decorator';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthDto } from '../auth/dto/auth-dto';
import { CreateUserDto } from './dto/create-user-dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('find')
  getUsersByEmail(@Body() authDto: AuthDto) {
    return this.userService.findByEmail(authDto.email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('find/all')
  getUsers() {
    return this.userService.findAll();
  }

  @ApiConsumes('multipart/form-data')
  @FileInterceptorDecorator('file')
  @Post('create')
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, file);
  }
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @FileInterceptorDecorator('file')
  @UseGuards(AuthGuard)
  @Post('update/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.update(id, updateUserDto, file);
  }
}
