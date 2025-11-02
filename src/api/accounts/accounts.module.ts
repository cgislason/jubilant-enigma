import { Module } from '@nestjs/common';
import { LedgerModule } from '../../shared/ledger/ledger.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [LedgerModule],
  controllers: [AccountsController],
  providers: [],
})
export class AccountsModule {}
