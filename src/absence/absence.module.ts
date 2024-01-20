import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Absence as AbsenceModel, AbsenceSchema } from './entities/absence.entity';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { ProofModule } from 'src/proof/proof.module';
import { ProofService } from 'src/proof/proof.service';
import { SubjectModule } from 'src/subject/subject.module';
import { SubjectService } from 'src/subject/subject.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AbsenceController],
  providers: [AbsenceService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: AbsenceModel.name, schema: AbsenceSchema }]),
    ProofModule,
    SubjectModule,
    UserModule
  ]
})
export class AbsenceModule {}
