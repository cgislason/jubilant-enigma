import { Injectable, Logger } from '@nestjs/common';
import {
  Transaction,
  TransactionEntry,
} from './transactions/transaction.entity';
import { AccountsService } from './accounts/accounts.service';
import { Account } from './accounts/account.entity';
import { Direction } from '../enum/direction.enum';
import { TransactionsRepo } from './transactions/transactions.repo';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsRepo: TransactionsRepo,
  ) {}

  findTransactionById(id: string) {
    return this.transactionsRepo.findById(id);
  }

  findAllTransactions() {
    return this.transactionsRepo.findAll();
  }

  postTransaction(transaction: Transaction) {
    this.logger.log('Posting a transaction', { transaction });

    // Get affected accounts and check that they all exist
    const accounts_map = this.fetchAccounts(transaction);

    // Verify transaction credits + debits sum to 0
    const transactionBalance = this.calculateTransactionBalance(
      transaction.entries,
    );
    if (transactionBalance != 0) {
      throw new Error('Transaction credits + debits must balance');
    }

    // Save the transaction, now that we know it's valid
    const result = this.transactionsRepo.createTransaction(transaction);

    // TODO: update account balances and add lines to each account

    return result;
  }

  private fetchAccounts(transaction: Transaction): Record<string, Account> {
    return transaction.entries.reduce((prev, entry) => {
      const account = this.accountsService.findById(entry.account_id);
      if (!account) {
        throw new Error(`Account ${entry.account_id} not found`);
      }
      return {
        ...prev,
        [account.id]: account,
      };
    }, {});
  }

  private calculateTransactionBalance(entries: TransactionEntry[]) {
    const creditSum = entries
      .filter((entry) => entry.direction === Direction.credit)
      .reduce((sum, entry) => sum + entry.amount, 0);
    const debitSum = entries
      .filter((entry) => entry.direction === Direction.debit)
      .reduce((sum, entry) => sum + entry.amount, 0);
    return creditSum - debitSum;
  }
}
