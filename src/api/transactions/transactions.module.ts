import { Module } from '@nestjs/common';
import { LedgerModule } from '../../shared/ledger/ledger.module';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [LedgerModule],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}
