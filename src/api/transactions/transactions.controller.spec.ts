import { Test, TestingModule } from '@nestjs/testing';
import { __test_accounts__ } from '../../shared/ledger/accounts/accounts.repo';
import { LedgerModule } from '../../shared/ledger/ledger.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsModule } from './transactions.module';

describe('AccountsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule, LedgerModule],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
