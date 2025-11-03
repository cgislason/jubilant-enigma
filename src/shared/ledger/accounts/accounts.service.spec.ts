import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { __test_accounts__ } from './accounts.repo';
import { LedgerModule } from '../ledger.module';
import { Direction } from '../../enum/direction.enum';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LedgerModule],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  describe('addEntryToAccount', () => {
    const subject = (entry) => service.addEntryToAccount(entry);

    afterEach(() => {
      __test_accounts__.clearAccounts();
    });

    it.each([
      [50, Direction.debit, Direction.debit, 50],
      [60, Direction.credit, Direction.debit, -60],
      [70, Direction.credit, Direction.credit, 70],
      [80, Direction.debit, Direction.credit, -80],
    ])(
      'should update the account balance with a $%s %s to a %s account',
      (amount, txDirection, accountDirection, expected) => {
        const account = service.createAccount({
          id: crypto.randomUUID(),
          direction: accountDirection,
          name: `test-${accountDirection}`,
          balance: 0,
        });

        const entry = {
          account_id: account.id,
          direction: txDirection,
          amount,
        };
        subject(entry);

        const updatedAccount = service.findById(account.id);
        expect(updatedAccount?.balance).toEqual(expected);
      },
    );
  });
});
