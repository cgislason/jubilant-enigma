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

  @Get(':id')
  find(@Param() params: { id: string }) {
    const account = this.accountsService.findById(params.id);
    if (!account) {
      throw new NotFoundException(`Account ${params.id} not found`);
    }
    return account;
  }

  @Post()
  create(@Body() body: CreateAccountDto) {
    this.logger.log('Creating new Account', { body });
    return this.accountsService.createAccount(body);
  }
}
