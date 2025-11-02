import { Direction } from '../../enum/direction.enum';

export class TransactionEntry {
  constructor(
    public readonly direction: Direction,
    public readonly account_id: string,
    public readonly amount: number,
  ) {}
}

export class Transaction {
  constructor(
    public readonly id: string,
    public entries: TransactionEntry[],
  ) {}
}
