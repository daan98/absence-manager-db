import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto, GetAbsenceDateDto, UpdateAbsenceDto } from './dto';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absenceService.create(createAbsenceDto);
  }

  @Get('extra-info')
  findExtraInfo() {
    return this.absenceService.findExtraInformation();
  }

  @Get('absence-date')
  findeByDate(@Query() q) {// @Body() getAbsenceDateDto : GetAbsenceDateDto
    const { absenceDate } = q;
    return this.absenceService.findByDate(absenceDate);
  }

  @Get()
  findAll() {
    return this.absenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absenceService.update(id, updateAbsenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}
