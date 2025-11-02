import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { randomUUID } from 'crypto';
import { AccountsModule } from './accounts.module';
import { __test_accounts__ } from './accounts.repo';
import { AccountDto, Direction } from './account.dto';

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
      controllers: [],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /accounts', () => {
    const subject = (body) => controller.create(body);

    afterEach(() => {
      __test_accounts__.clearAccounts();
    });

    it('should create an account', () => {
      const body = {
        id: crypto.randomUUID(),
        name: 'test account',
        balance: 0,
        direction: 'debit',
      };
      const result = subject(body);
      expect(result).toMatchObject(body);
    });
  });

  describe('GET /accounts', () => {
    const subject = () => controller.findAll();
    const testAccounts: AccountDto[] = [
      {
        id: crypto.randomUUID(),
        name: 'test debit account',
        balance: 0,
        direction: Direction.debit,
      },
      {
        id: crypto.randomUUID(),
        name: 'test credit account',
        balance: 100,
        direction: Direction.credit,
      },
    ];

    beforeAll(() => {
      testAccounts.forEach((account) => controller.create(account));
    });
    afterAll(() => {
      __test_accounts__.clearAccounts();
    });

    it('should fetch previously created accounts', () => {
      const result = subject();
      expect(result).toMatchObject(testAccounts);
    });
  });

  describe('GET /accounts/:id', () => {
    const subject = (id: string) => controller.find({ id });
    const testAccount: AccountDto = {
      id: crypto.randomUUID(),
      name: 'test debit account',
      balance: 0,
      direction: Direction.debit,
    };

    beforeEach(() => {
      controller.create(testAccount);
    });
    afterEach(() => {
      __test_accounts__.clearAccounts();
    });

    it('should fetch previously created accounts', () => {
      const result = subject(testAccount.id);
      expect(result).toMatchObject(testAccount);
    });
  });
});
