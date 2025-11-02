import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsRepo } from './accounts.repo';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsRepo],
})
export class AccountsModule {}
