import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import SubjectInterface from './interfaces/subject.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subject as SubjectModel } from './entities/subject.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {

  constructor(
    @InjectModel(SubjectModel.name)
    private subjectModel : Model<SubjectModel>
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      if(!createSubjectDto.subjectName) {
        throw new BadRequestException('La materia debe tener un nombre');
      }

      const nameRegex = new RegExp(`${createSubjectDto.subjectName}`, 'i');
      const foundSubject = await this.subjectModel.find({ subjectName: { $regex: nameRegex}});
      
      if(foundSubject.length > 0 && foundSubject[0].subjectName.toLowerCase()  === createSubjectDto.subjectName.toLowerCase()) {
        throw new BadRequestException('Esta materia ya ha sido creada.');
      }

      const createdSubject = new this.subjectModel({ ...createSubjectDto });

      createdSubject.save();

      return createdSubject;
    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException('Esta materia ya ha sido creada.');
      }
      
      return error.response;
    }
  }

  async findAll() {
    try {
      const foundSubject = await this.subjectModel.find();

      if(foundSubject.length > 0) {
        return foundSubject;
      }

      throw new BadRequestException('No hay materias, Por favor agregue algunas.');
    } catch (error) {
      return error.response;
    }
  }

  async findOne(id: string) {
    try {
      const foundSubject = await this.subjectModel.findById(id);

      if(foundSubject) {
        return foundSubject;
      }

      throw new BadRequestException('No se encontro la materia al hacer la búsqueda.');
    } catch (error) {
      return error.response;
    }
  }

  async finByName(name : string, limit : number) {
    try {
      const nameRegex = new RegExp(`${name}`, 'i');
      const foundSubject = await this.subjectModel.find({subjectName: { $regex: nameRegex}}, undefined,  {
        limit
      });

      if(foundSubject.length > 0) {
        return foundSubject;
      }

      throw new  BadRequestException('No se encontro la materia al hacer la búsqueda.');
    } catch (error) {
      return error.response;
    }
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    try {
      if(!updateSubjectDto.subjectName) {
        throw new BadRequestException('La materia debe tener un nombre');
      }

      const foundSubjectId = await this.subjectModel.findById(id);

      if(!foundSubjectId) {
        throw new BadRequestException('Esta materia ha sido eliminada');
      }
      
      const nameRegex = new RegExp(`${updateSubjectDto.subjectName}`, 'i');
      const foundSubject = await this.subjectModel.find({ subjectName: { $regex: nameRegex }});
      
      // para evitar que se generen materías repetidas
      if(foundSubject.length > 0 && foundSubject[0].subjectName.toLowerCase()  === updateSubjectDto.subjectName.toLowerCase()) {
        throw new BadRequestException('Esta materia ya ha sido creada.');
      }

      const updatedSubject = await this.subjectModel.findByIdAndUpdate(id, updateSubjectDto, {
        new: true
      });

      return updatedSubject;

    } catch (error) {
      return error.response;
    }
  }

  async remove(id: string) {
    try {
      await this.subjectModel.findByIdAndDelete(id);

      const message = `Se ha eliminado la materia con id: ${id}`;

      return message;
    } catch (error) {
      return error.response;
    }
  }
}
