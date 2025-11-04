import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { __test_accounts__ } from './../src/shared/ledger/accounts/accounts.repo';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    __test_accounts__.clearAccounts();
  });

  it('/accounts POST', async () => {
    const server = app.getHttpServer();

    const account = {
      id: crypto.randomUUID(),
      direction: 'credit',
      name: `test-account`,
      balance: 0,
    };

    await request(server).post('/accounts').send(account);

    return request(server)
      .get('/accounts')
      .expect(200)
      .expect(`[${JSON.stringify(account)}]`);
  });

  it('/transactions POST', async () => {
    const server = app.getHttpServer();

    const credit_account = {
      id: 'credit_account',
      direction: 'credit',
      balance: 0,
      name: 'credit_account',
    };
    const debit_account = {
      id: 'debit_account',
      direction: 'debit',
      balance: 0,
      name: 'debit_account',
    };
    const transaction = {
      id: crypto.randomUUID(),
      entries: [
        {
          direction: 'credit',
          amount: 100,
          account_id: credit_account.id,
        },
        {
          direction: 'debit',
          amount: 100,
          account_id: debit_account.id,
        },
      ],
    };

    const expectedAccounts = [
      {
        ...credit_account,
        balance: 100,
      },
      {
        ...debit_account,
        balance: 100,
      },
    ];

    await request(server).post('/accounts').send(credit_account);
    await request(server).post('/accounts').send(debit_account);
    await request(server).post('/transactions').send(transaction);

    return request(server)
      .get('/accounts')
      .expect(200)
      .expect(JSON.stringify(expectedAccounts));
  });
});
