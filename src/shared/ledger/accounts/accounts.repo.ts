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

  updateAccount(account: Partial<Account> & { id: string }) {
    const updatedAccount = Object.freeze({
      ...accounts[account.id],
      ...account,
    });
    accounts[account.id] = updatedAccount;
    return updatedAccount;
  }
}
