import { Module } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';
import { AccountsRepo } from './accounts/accounts.repo';
import { LedgerService } from './ledger.service';
import { TransactionsRepo } from './transactions/transactions.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [AccountsService, AccountsRepo, TransactionsRepo, LedgerService],
  exports: [AccountsService, LedgerService],
})
export class LedgerModule {}
