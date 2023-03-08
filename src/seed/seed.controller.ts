import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //@Auth(ValidRoles.admin, ValidRoles.user)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
