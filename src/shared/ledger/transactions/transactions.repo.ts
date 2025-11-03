import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';

export class TransactionConflictError extends Error {}

// Store transactions in an array for simplicity
type TransactionStorage = Transaction[];

// In-memory storage for Transactions
const transactions: TransactionStorage = [];

// ! Expose a test function because it's in memory storage.
// In a real implementation storage would be something mockable or
// otherwise testable.
export const __test_transactions__ = {
  clearTransactions: () => {
    // Empty the array
    transactions.splice(0, transactions.length);
  },
};

@Injectable()
export class TransactionsRepo {
  createTransaction(transaction: Transaction): Transaction {
    // Save an immutable copy to prevent unexpected modifications to the datastore.
    // Freeze the entries as well to ensure the whole thing is immutable.
    const newTransaction = Object.freeze({
      ...transaction,
      entries: transaction.entries.map((e) => Object.freeze(e)),
    });
    transactions.push(newTransaction);
    return newTransaction;
  }

  findById(id: string): Transaction | undefined {
    return transactions.find((transaction) => transaction.id === id);
  }

  findAll(): Transaction[] {
    // Not super efficient, but works for small sample sizes.
    return [...transactions];
  }
}
