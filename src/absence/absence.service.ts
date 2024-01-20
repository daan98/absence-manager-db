import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Date, Model, ObjectId } from 'mongoose';
// import { ObjectId } from "mongodb";

import { Absence } from './entities/absence.entity';
import { CreateAbsenceDto, GetAbsenceDateDto, UpdateAbsenceDto } from './dto';
import { FounIdsEnum } from './enum';
import { ProofEnum, ProofInterface } from 'src/proof/interface';
import { ProofService } from 'src/proof/proof.service';
import { Subject as SubjectModel } from '../subject/entities/subject.entity';
import { SubjectService } from 'src/subject/subject.service';
import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AbsenceService {

  private foundProof       : ProofInterface | null = null;

  constructor(
    @InjectModel(Absence.name)
    private absenceModel : Model<Absence>,
    private proofService : ProofService,
    private subjectService : SubjectService,
    private userService : UserService,
  ) {}

  async create(createAbsenceDto: CreateAbsenceDto) {
    try {
      const { proof, subject, user, absenceDate } = createAbsenceDto;

      
      // Search ID's
      const foundIdErrorMessage = await this.IsFoundIds(proof, subject, user);
      if(foundIdErrorMessage) {
        throw new BadRequestException(foundIdErrorMessage);
      }
      
      if(this.foundProof.proof === ProofEnum.other && !createAbsenceDto.absenceDescription) {
        throw new BadRequestException('Por favor. para esta justificación escriba una descripción de la falta.');
      }

      
      if(await this.isAbsenceCreated(absenceDate, proof, subject, user)) {
        throw new BadRequestException('Está falta ya existe');
      }
      
      const createdAbsence = new this.absenceModel({
        proof,
        subject,
        user,
        ...createAbsenceDto
      });
      
      createdAbsence.save();

      this.foundProof.proof = null;

      return createdAbsence;
    } catch (error) {
      if(error.code === 11000) {
        throw new Error(error)
        return error.response;
      }
      return error.response;
    }
  }

  async findAll() {
    try {
      const foundAbsences = await this.absenceModel.find({});

      if(foundAbsences) {
        return foundAbsences;
      }
      
      throw new BadRequestException('No se encontraron faltas.');
    } catch (error) {
      return error.response;
    }
  }

  async findOne(id: string) {
    try {
      const foundAbsence = await this.absenceModel.findById(id);

      if(foundAbsence) {
        return foundAbsence;
      }

      throw new BadRequestException('No se encontro esta falta.');
    } catch (error) {
      return error.response;
    }
  }

  async findExtraInformation() {
    try {
      const extraInfo = await this.absenceModel.find().populate(['proof', 'subject', 'user']).exec();

      if(extraInfo) {
        return extraInfo
      }

      throw new BadRequestException('No se encontro información de las faltas.');
    } catch (error) {
      return error.response;
    }
  }

  async findByDate(getAbsenceDateDto : GetAbsenceDateDto) {
    try {
      const foundAbsence = await this.absenceModel.find({ absenceDate: getAbsenceDateDto.absenceDate  });

      if(foundAbsence.length > 0) {
         return foundAbsence;
      }

      throw new BadRequestException('No se encontraron faltas para esta fecha.');
    } catch (error) {
      return error.response;
    }
  }

  async update(id: string, updateAbsenceDto: UpdateAbsenceDto) {
    try {
      const { proof, subject, user } = updateAbsenceDto;

      // Search ID's
      const foundIdErrorMessage = await this.IsFoundIds(proof, subject, user);
      if(foundIdErrorMessage) {
        throw new BadRequestException(foundIdErrorMessage);
      }

      if(this.foundProof.proof === ProofEnum.other && !updateAbsenceDto.absenceDescription) {
        throw new BadRequestException('Por favor. para esta justificación escriba una descripción de la falta.');
      }

      // PASAR ESTO A UNA FUNCIÓN APARTE --- INICIO ---
      const foundAbsence = await this.absenceModel.findById(id);
      if(
        proof && subject && user &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, proof, subject, user) ||
        proof && subject &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, proof, subject, foundAbsence.user) ||
        proof && user &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, proof, foundAbsence.subject, user) ||
        subject && user &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, foundAbsence.proof, subject, user) ||
        proof &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, proof, foundAbsence.subject, foundAbsence.user) ||
        subject &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, foundAbsence.proof, subject, foundAbsence.user) ||
        user &&
        await this.isAbsenceCreated(foundAbsence.absenceDate, foundAbsence.proof, foundAbsence.subject, user)
        ) {
          throw new BadRequestException('Está falta ya existe');
        }
        // PASAR ESTO A UNA FUNCIÓN APARTE --- FIN ---

      const updatedAbsence = await this.absenceModel.findByIdAndUpdate(id, updateAbsenceDto, {
        new: true,
      });

      return updatedAbsence;
    } catch (error) {
      return error.response;
    }
  }

  async remove(id: string) {
    try {
      await this.absenceModel.findByIdAndDelete(id);
      const message = `La falta con id ${id} ha sido eliminada.`;

      return message;
    } catch (error) {
      return error.response
    }
  }

  getCurrentISODate() {
    const currentDate = new Date().toISOString();
    return currentDate;
  }

  private async IsFoundIds(proofId : any, subjectId : any, userId : any,) : Promise<String> {
    try {
      if(proofId) {
        this.foundProof = await this.proofService.findOne(proofId);

        if(!this.foundProof) {
          return FounIdsEnum.PROOF_NOT_FOUND;
        }
      }

      if(subjectId) {
        const foundSubject = await this.subjectService.findOne(subjectId);
        
        if(!foundSubject) {
          return FounIdsEnum.SUBJECT_NOT_FOUND;
        }
      }

      if(userId){
        const foundUser = await this.userService.findOne(userId);

        if(!foundUser) {
          return FounIdsEnum.USER_NOT_FOUND;
        }
      }
      
      return FounIdsEnum.ALL_FOUND;
    } catch (error) {
      return error.response;
    }
  }

  private async isAbsenceCreated(absenceDate : string | Date, proof : ObjectId, subject : ObjectId, user : ObjectId) : Promise<Boolean> {
    try {
      const foundAbsence = await this.absenceModel.find({absenceDate, proof, subject, user});

      if(foundAbsence.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      return error.response;
    }
  }
}