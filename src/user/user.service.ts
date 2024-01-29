import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcryptjs from "bcryptjs";

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import JwtPayload from './interface/jwt-payload.interface';
import { LoginResponseInterface, RoleEnum } from './interface';

@Injectable()
export class UserService {

  private roles = RoleEnum;

  
  constructor(
    @InjectModel(User.name)
    private userModel : Model<User>,
    private jwtService : JwtService
  ) {}
    
  get rolesArray() : RoleEnum[] {
    return Object.values(RoleEnum);
  }

  async create(createUserDto: CreateUserDto) : Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      if(await this.isUserCreated(createUserDto)) {
        throw new BadRequestException(`el usuario ${userData.name} ${userData.lastName} ya ha sido creado.`);
      }

      if(!this.isRolePossible(userData.role)) {
        throw new BadRequestException("Rol no valido.");
      }

      if(userData.role === RoleEnum.admin && !password) {
        throw new BadRequestException(`Usuarios con este rol deben tener contraseña.`);
      }


      // GENERATING A RANDOM DNI
      userData.dni = Number((Math.random() * 100000000).toFixed(0));
      
      let newUser;

      if(userData.role === RoleEnum.admin) {
        newUser = new this.userModel({
          password: bcryptjs.hashSync(password, 10),
          ...userData
        });
      }

      if(userData.role !== RoleEnum.admin) {
        newUser = new this.userModel({
          ...userData
        });
      }

      await newUser.save();

      const { password: _, ...user } = newUser.toJSON();

      return user
    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${createUserDto.name} ya existe.`);
      }

      return error.response;
    }
  }

  async login(loginUserDto : LoginUserDto) : Promise<LoginResponseInterface> {
    const { password, dni } = loginUserDto;
    const user = await this.userModel.findOne({ dni });
    if(!user) {
      throw new UnauthorizedException('Usuario no valido.');
    }

    if(user.role !== this.roles.admin) {
      throw new UnauthorizedException('Este usuario no tiene acceso al servicio.');
    }

    if(!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Contraseña no valida.');
    }

    const { password: _, ...loggedUser } = user.toJSON();

    return {
      user: loggedUser,
      token: this.getJWT({ id: user.id })
    };
  }

  async findAll() {
    try {
      const foundUser : User[] = await this.userModel.find().select('-password');

      if(foundUser.length > 0) {
        return foundUser;
      }

      throw new Error('No hay usuarios, por favor agregue uno.');
    } catch (error) {
      return error.response;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id).select('-password');

      const { password, ...rest } = user.toJSON();

      return rest;
    } catch (error) {
      return error.response;
    }
  }

  async findSuggestedUser(queryName : string, limit : string) {
    try {
      const nameRegex          = new RegExp(`${queryName}`, 'i');
      const foundUser : User[] = await this.userModel.find({ name: { $regex: nameRegex } }, undefined, {
        limit: +limit
      }).select('-password');

      if(foundUser.length > 0) {
        return foundUser;
      }

      throw new Error('No hay usuarios que concuerden con la busqueda');
    } catch (error) {
      return error.response
    }
  }

  async findRole(role : RoleEnum) {
    try {
      const roleRegex = new RegExp(`${role}`, 'i');
      if(!this.isRolePossible(role)) {
        throw new BadRequestException("Rol no valido.");
      }

      const foundUser : User[] = await this.userModel.find({ role: { $regex: roleRegex }}).select('-password');

      if(foundUser.length > 0) {
        return foundUser;
      }

      throw new Error('No hay usuarios con este ');
    } catch (error) {
      return error.response;
    }
  }

  async findByDni(dni : number, role ?: string) {
    try {
      const foundUser : User[] = await this.userModel.find({ dni }).select('-password');

      console.log('foundUser: ', foundUser);
      if(role === 'administrador') {
        return foundUser;
      }

      if(foundUser.length > 0 && foundUser[0].role !== RoleEnum.admin) {
        return foundUser;
      }

      throw new BadRequestException('No hay usuarios con este dni');
    } catch (error) {
      return error.response;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if(updateUserDto?.name && !updateUserDto?.lastName || updateUserDto?.lastName && !updateUserDto?.name){
        throw new BadRequestException('Por favor especifique el nombre y apellido del usuario');
      }

      if(updateUserDto.name !== undefined && await this.isUserCreated(updateUserDto)) {
        throw new BadRequestException(`El usuario ya ha sido creado.`);
      }
      
      if(updateUserDto.role !== undefined) {
        if(!this.isRolePossible(updateUserDto.role)) {
          throw new BadRequestException("Rol no valido.");
        }

        if(updateUserDto.role === RoleEnum.admin && !updateUserDto.password) {
          throw new BadRequestException(`Usuarios con este rol deben tener contraseña.`);
        }
      }


      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true
      });
      
      return updatedUser;
    } catch (error) {
      return error.response;
    }
  }

  async remove(id: string) {
    try {
      await this.userModel.findByIdAndDelete(id);

      const message = `user with id ${id} was successfully deleted.`;
      return message;
    } catch (error) {
      return error.response;
    }
  }

  getJWT(payload : JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private isRolePossible(userRole : string) : Boolean {
    let result : Number[] = [];
    
    this.rolesArray.forEach((actualRole) => {
      switch (userRole) {
        case actualRole:
          result.push(1);
          break;
        default:
          result.push(0);
      }
    });

    if (result.find((value) => value === 1)) {
      return true;
    }

    return false;
  }

  private async isUserCreated(user : UpdateUserDto | CreateUserDto) : Promise<Boolean> {
    const nameRegex     = new RegExp(`${user.name}`, 'i');
    const lastnameRegex = new RegExp(`${user.lastName}`, 'i');
    const foundUser     = await this.userModel.find({ name: { $regex: nameRegex }, lastName: { $regex: lastnameRegex }}).exec();

    if(foundUser.length > 0) {
      return true;
    }

    return false;
  }
}
