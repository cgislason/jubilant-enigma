import { Test, TestingModule } from '@nestjs/testing';
import { LedgerModule } from './ledger.module';
import { LedgerService } from './ledger.service';
import {
  Transaction,
  TransactionEntry,
} from './transactions/transaction.entity';
import { AccountsService } from './accounts/accounts.service';
import { Account } from './accounts/account.entity';
import { __test_accounts__ } from './accounts/accounts.repo';
import { Direction } from '../enum/direction.enum';

describe('LedgerService', () => {
  let service: LedgerService;
  let accountsService: AccountsService;

  let credit_account1;
  let credit_account2;
  let debit_account1;
  let debit_account2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LedgerModule, Account],
    }).compile();

    service = module.get<LedgerService>(LedgerService);
    accountsService = module.get<AccountsService>(AccountsService);

    credit_account1 = accountsService.createAccount({
      id: 'credit_account1',
      direction: Direction.credit,
      balance: 0,
      name: 'credit_account1',
    });
    credit_account2 = accountsService.createAccount({
      id: 'credit_account2',
      direction: Direction.credit,
      balance: 0,
      name: 'credit_account2',
    });
    debit_account1 = accountsService.createAccount({
      id: 'debit_account1',
      direction: Direction.debit,
      balance: 0,
      name: 'debit_account1',
    });
    debit_account2 = accountsService.createAccount({
      id: 'debit_account2',
      direction: Direction.debit,
      balance: 0,
      name: 'debit_account2',
    });
  });

  afterEach(() => {
    // When using a real repo, I'd mock it here but for simplicity I'll just use the store
    __test_accounts__.clearAccounts();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAccounts', () => {
    const subject = (transaction: Transaction) =>
      service.postTransaction(transaction);

    it('should update the account balances correctly', () => {
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        entries: [
          {
            direction: Direction.credit,
            amount: 50,
            account_id: credit_account1.id,
          },
          {
            direction: Direction.debit,
            amount: 100,
            account_id: credit_account2.id,
          },
          {
            direction: Direction.credit,
            amount: 100,
            account_id: debit_account1.id,
          },
          {
            direction: Direction.debit,
            amount: 50,
            account_id: debit_account2.id,
          },
        ],
      };
      subject(transaction);

      // Look up the accounts again because account objects are immutable.
      const account1 = accountsService.findById(credit_account1.id);
      expect(account1?.balance).toEqual(50);
      const account2 = accountsService.findById(credit_account2.id);
      expect(account2?.balance).toEqual(-100);
      const account3 = accountsService.findById(debit_account1.id);
      expect(account3?.balance).toEqual(-100);
      const account4 = accountsService.findById(debit_account2.id);
      expect(account4?.balance).toEqual(50);
    });
  });

  describe('fetchAccounts', () => {
    const subject = (transaction: Transaction) =>
      service['fetchAccounts'](transaction);

    it('should build a map of account id to account', () => {
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        entries: [
          {
            direction: Direction.credit,
            amount: 100,
            account_id: credit_account1.id,
          },
          {
            direction: Direction.debit,
            amount: 100,
            account_id: credit_account2.id,
          },
        ],
      };
      const result = subject(transaction);
      expect(result).toMatchObject({
        [credit_account1.id]: credit_account1,
        [credit_account2.id]: credit_account2,
      });
    });

    it('should throw when an account is missing', () => {
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        entries: [
          {
            direction: Direction.credit,
            amount: 100,
            account_id: credit_account1.id,
          },
          {
            direction: Direction.debit,
            amount: 100,
            account_id: 'fake_account',
          },
        ],
      };

      expect(() => subject(transaction)).toThrow(
        'Account fake_account not found',
      );
    });
  });

  describe('calculateTransactionBalance', () => {
    const subject = (transactionEntries: TransactionEntry[]) =>
      service['calculateTransactionBalance'](transactionEntries);

    it('should return 0 when credits balance, no debits', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account1.id,
        },
        {
          direction: Direction.credit,
          amount: -50,
          account_id: credit_account2.id,
        },
        {
          direction: Direction.credit,
          amount: -50,
          account_id: debit_account1.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(0);
    });
    it('should return 0 when debits balance, no credits', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.debit,
          amount: 100,
          account_id: debit_account1.id,
        },
        {
          direction: Direction.debit,
          amount: -75,
          account_id: debit_account2.id,
        },
        {
          direction: Direction.debit,
          amount: -25,
          account_id: credit_account1.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(0);
    });

    it('should return 0 for matching credit + debit', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account1.id,
        },
        {
          direction: Direction.debit,
          amount: 100,
          account_id: debit_account2.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(0);
    });

    it('should return 0 when credit + debit sum match', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account1.id,
        },
        {
          direction: Direction.credit,
          amount: 150,
          account_id: credit_account2.id,
        },
        {
          direction: Direction.debit,
          amount: 175,
          account_id: debit_account1.id,
        },
        {
          direction: Direction.debit,
          amount: 75,
          account_id: debit_account2.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(0);
    });

    it('should return double balance for credit + debit with opposite signs', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account1.id,
        },
        {
          direction: Direction.debit,
          amount: -100,
          account_id: debit_account2.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(200);
    });

    it('should return balance for credit + credit with same signs', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account1.id,
        },
        {
          direction: Direction.credit,
          amount: 100,
          account_id: credit_account2.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(200);
    });

    it('should return balance for debit + debit with same signs', () => {
      const entries: TransactionEntry[] = [
        {
          direction: Direction.debit,
          amount: 100,
          account_id: debit_account1.id,
        },
        {
          direction: Direction.debit,
          amount: 100,
          account_id: debit_account2.id,
        },
      ];
      const result = subject(entries);
      expect(result).toBe(-200);
    });
  });
});
