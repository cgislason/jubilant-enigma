import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransactionEntry } from '../transactions/transaction.entity';
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

  addEntryToAccount(transactionEntry: TransactionEntry) {
    const account = this.accountsRepo.findById(transactionEntry.account_id);
    if (!account) {
      throw new NotFoundException(
        `Account ${transactionEntry.account_id} not found`,
      );
    }

    const matchedDirections = account.direction === transactionEntry.direction;
    const change = matchedDirections
      ? transactionEntry.amount
      : -transactionEntry.amount;
    const newBalance = account.balance + change;

    this.accountsRepo.updateAccount({
      id: transactionEntry.account_id,
      balance: newBalance,
    });
  }
}
