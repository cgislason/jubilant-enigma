import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Direction } from '../../../shared/enum/direction.enum';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class CreateTransactionEntryDto {
  @IsEnum(Direction)
  @IsNotEmpty()
  direction!: Direction;

  @IsInt()
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
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionEntryDto)
  entries!: CreateTransactionEntryDto[];
}
