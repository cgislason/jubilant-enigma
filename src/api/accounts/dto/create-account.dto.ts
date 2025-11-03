import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Direction } from '../../../shared/enum/direction.enum';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  balance!: number;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction!: Direction;
}
