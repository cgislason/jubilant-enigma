import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Direction } from '../../../shared/enum/direction.enum';
import { Optional } from '@nestjs/common';

export class CreateTransactionEntryDto {
  @IsEnum(Direction)
  @IsNotEmpty()
  direction!: Direction;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  account_id!: string;
}

export class CreateTransactionDto {
  @IsString()
  @Optional()
  id: string = crypto.randomUUID();

  @IsArray()
  entries!: CreateTransactionEntryDto[];
}
