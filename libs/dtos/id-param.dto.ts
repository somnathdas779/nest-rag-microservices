import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParamDto {
  @Type(() => Number) // transforms string to number
  @IsInt({ message: 'ID must be a valid integer' })
  id: number;
}
