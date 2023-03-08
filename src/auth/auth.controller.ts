import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/users.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  //INFO: Guard implementation to secure route
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    //INFO: implements decorator to get full or specific data
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hello World',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  //INFO: SetMetadata Decorator for passing data to guards
  //@SetMetadata('roles', ['admin', 'super-user'])
  //INFO: implementing guard
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  //INFO: implementing decorator composition
  @Auth(ValidRoles.admin, ValidRoles.user)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
