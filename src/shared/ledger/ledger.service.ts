import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor() {}

  postTransaction() {
    this.logger.log('Posting a transaction');
  }
}
