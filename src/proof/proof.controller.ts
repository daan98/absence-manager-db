import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProofService } from './proof.service';
import { CreateProofDto } from './dto/create-proof.dto';
import { UpdateProofDto } from './dto/update-proof.dto';

@Controller('proof')
export class ProofController {
  constructor(private readonly proofService: ProofService) {}

  @Post()
  create(@Body() createProofDto: CreateProofDto) {
    return this.proofService.create(createProofDto);
  }

  @Get()
  findAll() {
    return this.proofService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proofService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProofDto: UpdateProofDto) {
    return this.proofService.update(id, updateProofDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proofService.remove(id);
  }
}
