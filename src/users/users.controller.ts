import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    console.log(`🔎 Buscando usuário com ID: ${id}`);
    return this.usersService.getUserStats(id);
  }

  @Get()
  async getAllUsers() {
    console.log(`📋 Buscando todos os usuários`);
    return this.usersService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
