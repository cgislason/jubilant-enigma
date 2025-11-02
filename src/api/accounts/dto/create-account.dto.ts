import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Direction } from '../../../shared/enum/direction.enum';

export class CreateAccountDto {
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
