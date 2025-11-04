## Description

Ledger backend that supports creating accounts and posting transactions to the ledger, following double entry accounting rules. See [Conduit - Ledger Take Home Challennge](/docs/take-home-challenge.md) for requirements.

## Considerations

During implementation I made a few design decisions and assumptions for simplicity or time:

- `amount` is always treated as an integer to ensure accurate calculations, with the assumption that it should represent `cents`.
- Transaction `id` is assumed to be unique and treated as an idempotency key to prevent duplicate transaction posting. If a transaction is posted with a previously used `id` the previous response is returned.
  - See `src/shared/interceptors/idempotency.interceptor.ts` for implementation.
- Account `id` must also be unique, but will throw a 429 Conflict exception rather than returning the previous response because accounts are long lived.
- There are some additional API endpoints for debugging: `GET /accounts`, `GET /transactions` and `GET /transactions/:id`
- Unit tests cover the most important business logic and functionality. Some end-to-end tests cover the basic flow of creating an account and posting a transaction.

## Primary Dependencies

- [NestJS](https://nestjs.com/) - Node.js web server framework
- [Jest](https://jestjs.io/) - Testing framework
- [Prettier](https://prettier.io/) - Code Formatter
- [ESLint](https://eslint.org/) - Code Linter

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## API

This API provides several endpoints for Accounts and Transactions. For a guide of the main endpoints, see the [take home challenge](/docs/take-home-challenge.md#api-guide) doc.

When run locally, the API is available at http://localhost:3000

| Endpoint                | Description               |
| ----------------------- | ------------------------- |
| `POST /accounts`.       | Create a new account      |
| `GET /accounts/:id`     | Fetch an account by id    |
| `GET /accounts`         | List all acounts          |
| `POST /transactions`    | Create a new transaction  |
| `GET /transactions/:id` | Fetch a transaction by id |
| `GET /transactions`     | List all transactions     |

### Yaak API Client

This project contains a workspace for the [Yaak](https://yaak.app/) API Client app. Download it and open the `/yaak` folder as a workspace to test API requests using Yaak.
