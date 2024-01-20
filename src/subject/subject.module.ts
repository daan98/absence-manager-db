import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subject as SubjectModel, SubjectSchema } from './entities/subject.entity';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: SubjectModel.name, schema: SubjectSchema }])
  ],
  exports: [
    SubjectService
  ]
})
export class SubjectModule {}
