import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { LedgerService } from '../../shared/ledger/ledger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  create(@Body() body: CreateTransactionDto) {
    this.logger.log('Creating new Transaction', { body });
    return this.ledgerService.postTransaction(body);
  }
}
