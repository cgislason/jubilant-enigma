import { Injectable } from '@nestjs/common';
import { AccountDto } from './account.dto';

export class AccountConflictError extends Error {}

// Store accounts indexed by id
type AccountStorage = Record<string, AccountDto>;

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
  createAccount(account: AccountDto) {
    // Save an immutable copy to prevent unexpected modifications to the datastore.
    // A shallow freeze is sufficient for accounts.
    const newAccount = Object.freeze({ ...account });
    accounts[account.id] = newAccount;
    return newAccount;
  }

  getAccount(id: string): AccountDto {
    return accounts[id];
  }

  getAccounts(): AccountDto[] {
    return Object.values(accounts);
  }
}
