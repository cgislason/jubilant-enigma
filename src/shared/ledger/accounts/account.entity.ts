import { Direction } from '../../enum/direction.enum';

export class Account {
  constructor(
    public readonly id: string,
    public name: string,
    public balance: number = 0,
    public direction: Direction,
  ) {}
}
