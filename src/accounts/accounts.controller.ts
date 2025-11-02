import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AccountDto } from './account.dto';
import { AccountsRepo } from './accounts.repo';

@Controller('accounts')
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);

  constructor(private readonly accountsRepo: AccountsRepo) {}

  @Get()
  findAll() {
    return this.accountsRepo.getAccounts();
  }

  @Get(':id')
  find(@Param() params: any) {
    return this.accountsRepo.getAccount(params.id);
  }

  @Post()
  create(@Body() body: AccountDto) {
    this.logger.log('Creating new Account', { body });
    return this.accountsRepo.createAccount(body);
  }
}
