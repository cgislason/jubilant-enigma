import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';

export class AccountConflictError extends Error {}

// Store accounts indexed by id
type AccountStorage = Record<string, Account>;

// In-memory storage for Accounts
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
  createAccount(account: Account) {
    // Save an immutable copy to prevent unexpected modifications to the datastore.
    // A shallow freeze is sufficient for accounts.
    const newAccount = Object.freeze({ ...account });
    accounts[account.id] = newAccount;
    return newAccount;
  }

  findById(id: string): Account {
    return accounts[id];
  }

  findAll(): Account[] {
    return Object.values(accounts);
  }
}
