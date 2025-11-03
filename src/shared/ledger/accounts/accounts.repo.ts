import { ConflictException, Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { Direction } from '../../enum/direction.enum';

// In-memory storage for Accounts
// Store accounts indexed by id
type AccountStorage = Record<string, Account>;
const accounts: AccountStorage = {};

// ! Expose a test function because it's in memory storage.
// In a real implementation storage would be something mockable or
// otherwise testable.
export const __test_accounts__ = {
  clearAccounts: () => {
    for (const key in accounts) {
      delete accounts[key];
    }
  },
};

@Injectable()
export class AccountsRepo {
  createAccount(account: Account): Account {
    if (!!accounts[account.id]) {
      throw new ConflictException(`Account ${account.id} already exists`);
    }

    // Save an immutable copy to prevent unexpected modifications to the datastore.
    // A shallow freeze is sufficient for accounts.
    const newAccount = Object.freeze({ ...account });
    accounts[account.id] = newAccount;
    return newAccount;
  }

  findById(id: string): Account | undefined {
    const test = accounts[id];
    return test;
  }

  findAll(): Account[] {
    return Object.values(accounts);
  }

  updateBalance(account_id: string, amount: number, direction: Direction) {
    const account = this.findById(account_id);
    if (!account) {
      throw new Error(`Account ${account_id} not found`);
    }

    const matchedDirections = account.direction === direction;
    const change = matchedDirections ? amount : -amount;
    const newBalance = account.balance + change;

    const updatedAccount = Object.freeze({
      ...account,
      balance: newBalance,
    });
    accounts[account.id] = updatedAccount;
    return updatedAccount;
  }
}
