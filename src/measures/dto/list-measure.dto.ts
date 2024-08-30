// create-measure.dto.ts
import { UserTypeEnum } from "../enums/user_type.enum";
import { IsEnum, IsOptional } from 'class-validator';

export class ListMeasureDto {

  @IsOptional()
  @IsEnum(UserTypeEnum, { message: 'measure_type must be a valid enum value' })
  measure_type: UserTypeEnum;

  constructor(props: {
    measure_type: UserTypeEnum,
  }
  ){
    Object.assign(this, props);
  }
}