import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guards';
import { AuthenticationGuard } from './guards/authentication.guards';
import { Role } from './decorators/roles.decorator';

@Role('admin')
@UseGuards(AuthGuard)
// @UseGuards(AuthenticationGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(@Req() req) {
    return { message: 'Accessed Resource', userId: req.userId };
  }
}
