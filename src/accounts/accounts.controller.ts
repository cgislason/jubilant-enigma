import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AccountDto } from './account.dto';

@Controller('accounts')
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);

  constructor() {}

  @Get()
  getAccounts() {
    return [];
  }

  @Post()
  createAppointment(@Body() body: AccountDto) {
    return {};
  }
}
