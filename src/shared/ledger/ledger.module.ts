import { Module } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';
import { AccountsRepo } from './accounts/accounts.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [AccountsService, AccountsRepo],
  exports: [AccountsService],
})
export class LedgerModule {}
