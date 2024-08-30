
import { IsNumber, IsUrl, IsUUID } from 'class-validator';

export class CreatedMeasureDto {

  @IsUUID()
  measure_uuid: string;

  @IsNumber()
  measure_value: number;

  @IsUrl()
  image_url: string;

  constructor(partial: Partial<CreatedMeasureDto>) {
    Object.assign(this, partial);
  }
}