import { Injectable, Logger } from '@nestjs/common';
import { Account } from './account.entity';
import { AccountsRepo } from './accounts.repo';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(private readonly accountsRepo: AccountsRepo) {}

  findAll() {
    return this.accountsRepo.findAll();
  }

  findById(id: string) {
    return this.accountsRepo.findById(id);
  }

  createAccount(account: Account) {
    return this.accountsRepo.createAccount(account);
  }
}
