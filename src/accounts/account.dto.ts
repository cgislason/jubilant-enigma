import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export enum Direction {
  'debit' = 'debit',
  'credit' = 'credit',
}
export class AccountDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsEnum(Direction)
  @IsNotEmpty()
  direction: Direction;
}
