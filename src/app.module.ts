import { Module } from '@nestjs/common';
import { AccountsModule } from './api/accounts/accounts.module';
import { TransactionsModule } from './api/transactions/transactions.module';
import { LedgerModule } from './shared/ledger/ledger.module';

@Module({
  imports: [AccountsModule, TransactionsModule, LedgerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
