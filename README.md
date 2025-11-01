## Description

Ledger backend that supports creating accounts and posting transactions to them.

See [Conduit - Ledger Take Home Challennge](/docs/take-home-challenge.md) for requirements.

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

This API provides 3 endpoints:

| Endpoint             | Description              |
| -------------------- | ------------------------ |
| `POST /accounts`.    | Create a new account     |
| `GET /accounts/:id`  | Fetch an account by id   |
| `POST /transactions` | Create a new transaction |

### Yaak

This project contains a workspace for the [Yaak](https://yaak.app/) API Client app. You can open `./yaak` in the app to test API requests
