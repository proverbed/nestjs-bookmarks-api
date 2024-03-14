import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
    return this.userService.editUser(user, dto);
  }
}
