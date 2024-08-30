// create-measure.dto.ts
import { UserTypeEnum } from "../enums/user_type.enum";
import { IsDateString, IsEnum, IsString, Validate } from 'class-validator';
import { IsBase64Image } from '../../shared/is_base_64_image.util';

export class CreateMeasureDto {

  @IsDateString()
  measure_datetime: string;

  @IsEnum(UserTypeEnum, { message: 'measure_type must be a valid enum value' })
  measure_type: UserTypeEnum;

  @IsString({ message: 'customer_code must be a string' })
  customer_code: string;

  @IsString()
  @Validate(IsBase64Image)
  image: string;

  constructor(partial: Partial<CreateMeasureDto>) {
    Object.assign(this, partial);
  }
}