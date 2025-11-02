import { Module } from '@nestjs/common';
import { AccountsModule } from './api/accounts/accounts.module';
import { LedgerModule } from './shared/ledger/ledger.module';

@Module({
  imports: [AccountsModule, LedgerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
