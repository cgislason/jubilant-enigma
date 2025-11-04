import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LedgerService } from '../../shared/ledger/ledger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IdempotencyInterceptor } from '../../shared/interceptors/idempotency.interceptor';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  create(@Body() body: CreateTransactionDto) {
    this.logger.log('Creating new Transaction', { body });
    return this.ledgerService.postTransaction(body);
  }

  @Get()
  findAll() {
    return this.ledgerService.findAllTransactions();
  }

  @Get(':id')
  find(@Param() params: { id: string }) {
    const transaction = this.ledgerService.findTransactionById(params.id);
    if (!transaction) {
      throw new NotFoundException(`Account ${params.id} not found`);
    }
    return transaction;
  }
}
