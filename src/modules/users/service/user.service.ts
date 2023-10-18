import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user-schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dto/update-user-dto';
import { CreateUserDto } from '../dto/create-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto, file: any) {
    const user = {
      ...createUserDto,
      file: `http://localhost:3000/${file.filename}`,
    };

    try {
      const userModel = new this.userModel(user);
      const createdUser = await userModel.save();
      if (!createdUser)
        return { code: 500, msg: 'A problem ocurred when the user register' };
      return { code: 200, msg: 'User created', createdUser };
    } catch (error) {
      throw new BadRequestException('An error ocurred', {
        cause: new Error(error),
        description: error,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, file: any) {
    const user = {
      ...updateUserDto,
      file: file?.filename ? `http://localhost:3000/${file?.filename}` : '',
    };
    const updateUserModel = this.deleteFieldsEmpty(user);
    try {
      const updateUser = await this.userModel
        .findByIdAndUpdate(id, updateUserModel, { new: true })
        .exec();

      if (!updateUser) {
        throw new NotFoundException();
      }
      return { code: 200, msg: 'User updated' };
    } catch (error) {
      throw new BadRequestException('An error ocurred', {
        cause: new Error(error),
        description: error.message,
      });
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new NotFoundException('Could not find the user');

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  deleteFieldsEmpty(updateUserModel: any) {
    for (const key in updateUserModel) {
      if (
        updateUserModel[key] === null ||
        updateUserModel[key] === undefined ||
        updateUserModel[key] === ''
      ) {
        delete updateUserModel[key];
      }
    }
    return updateUserModel;
  }
}
