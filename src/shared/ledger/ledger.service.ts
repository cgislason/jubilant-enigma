import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from './transactions/transaction.entity';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor() {}

  postTransaction(transaction: Transaction) {
    this.logger.log('Posting a transaction', transaction);
  }
}
