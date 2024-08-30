import { Injectable } from '@nestjs/common';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';
import { Measure } from './entities/measure.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedMeasureDto } from './dto/created-measure.dto';
import { DoubleReportException } from './exceptions/double-report.exception';
import { DoubleConfirmationException } from './exceptions/double-confirmation.exception';
import { MeasureNotFoundException } from './exceptions/measure-not-fount.exception';
import { ListMeasureDto } from './dto/list-measure.dto';
import { MeasureNotFoundRegisterException } from './exceptions/measure-not-fount-registe.exception';
import geminiAiUtil from 'src/shared/gemini-ai.util';

@Injectable()
export class MeasuresService {
  constructor(
    @InjectRepository(Measure)
    private measureRepo: Repository<Measure>,
  ) {}
  async create(CreateMeasureDto: CreateMeasureDto) {
    const { measure_datetime, customer_code } = CreateMeasureDto;

    const measureDate = new Date(measure_datetime);
    const measureMonth = (measureDate.getMonth() + 1).toString().padStart(2, '0');
    const measureYear = measureDate.getFullYear().toString();

    const existingMeasure = await this.measureRepo.createQueryBuilder('measure')
  .where('measure.customer_code = :customer_code', { customer_code })
  .andWhere("to_char(measure.measure_datetime, 'MM') = :measureMonth", { measureMonth })
  .andWhere("to_char(measure.measure_datetime, 'YYYY') = :measureYear", { measureYear })
  .andWhere('measure.measure_type = :measure_type', { measure_type: CreateMeasureDto.measure_type })
  .getOne();

    if (existingMeasure) {
      throw new DoubleReportException();
    }

    const resultString = await geminiAiUtil.query(CreateMeasureDto.image, 'image/jpeg')

    const measure_value = parseInt(resultString,10);

    const measure = new Measure({
      measure_datetime: new Date(CreateMeasureDto.measure_datetime),
      measure_type: CreateMeasureDto.measure_type,
      image: CreateMeasureDto.image,
      customer_code: CreateMeasureDto.customer_code,
      measure_value: measure_value
    }
  );

    const savedMeasure = await this.measureRepo.save(measure);
    return new CreatedMeasureDto({
      measure_uuid: savedMeasure.id,
      measure_value: savedMeasure.measure_value,
      image_url: `${process.env.BASE_URL}/${savedMeasure.image_url}`,
    });

  }

  async listCustomer(customer_code: string,  ListMeasureDto: ListMeasureDto) {

    const existingMeasure = await this.measureRepo.find({
      where:{
        customer_code: customer_code,
        measure_type: ListMeasureDto.measure_type
      },
      order: { measure_datetime: 'DESC' },
    });
    if (existingMeasure.length === 0) {
      throw new MeasureNotFoundRegisterException();
    }

    return {
      customer_code: existingMeasure[0].customer_code,
      measures: existingMeasure.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed:measure.has_confirmed,
        measure_value: measure.measure_value,
        image_url: `${process.env.BASE_URL}/${measure.image_url}`,
      }))
    };
  }

  async findImage(image_url: string) {
    const existingMeasure = await this.measureRepo.findOneBy({image_url: image_url});
    if (!existingMeasure) {
      throw new MeasureNotFoundException();
    }
    return {image_url: existingMeasure.image}
  }


  async update(updateMeasureDto: UpdateMeasureDto) {
    const { measure_uuid } = updateMeasureDto;

    const existingMeasure = await this.measureRepo.findOneBy({id: measure_uuid});
    if (!existingMeasure) {
      throw new MeasureNotFoundException();
    }

    if(existingMeasure.has_confirmed) {
      throw new DoubleConfirmationException();
    }

    Object.assign(existingMeasure, {
      measure_uuid: updateMeasureDto.measure_uuid,
      measure_value: updateMeasureDto.measure_value,
      has_confirmed: true,
    });
    await this.measureRepo.save(existingMeasure);

    return {success: true}
  }
}
