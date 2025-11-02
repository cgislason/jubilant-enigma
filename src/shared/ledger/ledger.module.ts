import { Module } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';
import { AccountsRepo } from './accounts/accounts.repo';
import { LedgerService } from './ledger.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AccountsService, AccountsRepo, LedgerService],
  exports: [AccountsService, LedgerService],
})
export class LedgerModule {}
