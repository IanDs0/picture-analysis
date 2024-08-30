import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';
import { ListMeasureDto } from './dto/list-measure.dto';

@Controller('')
export class MeasuresController {
  constructor(private readonly measuresService: MeasuresService) {}

  @Post('/upload')
  create(@Body() createMeasureDto: CreateMeasureDto) {
    return this.measuresService.create(createMeasureDto);
  }

  @Get('/:customer_code/list')
  listCustomer(@Param('customer_code') customer_code: string, @Query() listMeasureDto: ListMeasureDto) {
    return this.measuresService.listCustomer(customer_code, listMeasureDto);
  }

  @Get(':image_url')
  findOne(@Param('image_url') image_url: string) {
    return this.measuresService.findImage(image_url);
  }

  @Patch('/confirm')
  update(@Body() updateMeasureDto: UpdateMeasureDto) {
    return this.measuresService.update(updateMeasureDto);
  }
}
