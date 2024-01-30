import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

import { CreateUserDto, ForgotPasswordDto, LoginUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { UserService } from './user.service';
import LoginResponseInterface from './interface/login-response.interface';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @Post('/login')
  login(@Body() loginDto : LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req : Request) : LoginResponseInterface {
    const user = req['user'] as User;
    
    return {
      user,
      token: this.userService.getJWT({ id: user._id })
    }
  }

  @Get('/suggest')
  getSuggest(@Query() query) {
    const { name, limit } = query;

    return this.userService.findSuggestedUser(name, limit);
  }

  @Get('/role')
  getUersRole(@Query() query) {
    const { role } = query;

    return this.userService.findRole(role);
  }

  @Get('/dni')
  getUserDni(@Query() query) {
    const { dni, role } = query;

    return this.userService.findByDni(dni, role);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('change-password/:id')
  updatePassword(@Param('id') id : string, @Body() updateUserPasswordDto : UpdateUserPasswordDto) {
    return this.userService.changePassword(id, updateUserPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
