import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Proof as ProofModel, ProofSchema } from './entities/proof.entity';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';

@Module({
  controllers: [ProofController],
  providers: [ProofService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: ProofModel.name, schema: ProofSchema }])
  ],
  exports: [
    ProofService
  ]
})
export class ProofModule {}
