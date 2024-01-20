import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User as UserModel, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: {expiresIn: '1h'}
    })
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
