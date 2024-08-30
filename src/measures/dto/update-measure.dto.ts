import { IsInt, IsUUID } from "class-validator";


export class UpdateMeasureDto {
  @IsUUID()
  measure_uuid: string;

  @IsInt()
  measure_value: number;
}
