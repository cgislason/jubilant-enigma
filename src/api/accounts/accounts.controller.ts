import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AccountsService } from '../../shared/ledger/accounts/accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);

  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':accountId')
  find(@Param('accountId') accountId: string) {
    const account = this.accountsService.findById(accountId);
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }
    return account;
  }

  @Post()
  create(@Body() body: CreateAccountDto) {
    this.logger.log('Creating new Account', { body });
    return this.accountsService.createAccount(body);
  }
}
