import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProofDto } from './dto/create-proof.dto';
import { Proof } from './entities/proof.entity';
import { UpdateProofDto } from './dto/update-proof.dto';
import { ProofEnum } from './interface';

@Injectable()
export class ProofService {

  constructor(
    @InjectModel(Proof.name)
    private proofModel : Model<Proof>
  ) {}

  get proofGetter() {
    return Object.values(ProofEnum);
  }

  async create(createProofDto: CreateProofDto) {
    try {
      // CHECK IF PROOF IF POSSIBLE
      if(!this.isProofPossible(createProofDto.proof)) {
        throw new BadRequestException("Esta justificación no es posible.");
      }

      // CHECK IF PROOF HAS BEEN CREATED
      if(await this.isProofCreated(createProofDto.proof)) {
        throw new BadRequestException("Esta justificación ya ha sido creada.");
      }
      
      const newProof = new this.proofModel({ ...createProofDto });

      newProof.save();

      return newProof;
    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${createProofDto.proof} ya ha sido creado.`);
      }

      return error.response;
    }
  }

  async findAll() {
    try {
      const foundProof = await this.proofModel.find();

      if(foundProof.length > 0) {
        return foundProof;
      }

      throw new BadRequestException(`No hay justificaciones, por favor agregue una.`);
    } catch (error) {
      return error.response;
    }
  }

  async findOne(id: string) {
    try {
      const foundProof = await this.proofModel.findById(id);

      if(foundProof) {
        return foundProof;
      }

      throw new Error('No se pudo encontrar la justificación. Probablemente no existe.');
    } catch (error) {
      return error.response;
    }
  }

  async update(id: string, updateProofDto: UpdateProofDto) {
    try {
      if(!updateProofDto.proof) {
        throw new BadRequestException('La justificación no puede estar vacia.');
      }
      
      // CHECK IF PROOF IF POSSIBLE
      if(!this.isProofPossible(updateProofDto.proof)) {
        throw new BadRequestException("Esta justificación no es posible.");
      }

      // CHECK IF PROOF HAS BEEN CREATED
      if(await this.isProofCreated(updateProofDto.proof)) {
        throw new BadRequestException("Esta justificación ya ha sido creada.");
      }

      const updatedProof = await this.proofModel.findByIdAndUpdate(id, updateProofDto, {
        new: true
      });

      return updatedProof;
    } catch (error) {
      return error.response;
    }
  }

  async remove(id: string) {
    try {
      await this.proofModel.findByIdAndDelete(id);

      const message = `La justificación con id: ${id}. Ha sido eliminada.`;

      return message;
    } catch (error) {
      return error.response;
    }
  }

  private async isProofCreated(actualProof : string) : Promise<Boolean> {
    const proofRegex = new RegExp(`${actualProof}`, 'i');
    const foundProof = await this.proofModel.find({ proof: { $regex: proofRegex }}).exec();

    if(foundProof.length > 0) {
      return true;
    }

    return false;
  }

  private isProofPossible(proof : ProofEnum) : Boolean {
    let result : Array<number> = [];

    this.proofGetter.forEach(( actualProof ) => {
      switch (proof) {
        case actualProof:
          result.push(1);
          break;
        default:
          result.push(0);
      }
    });

    if(result.find((value) => value === 1)) {
      return true;
    }

    return false;
  }
}
