import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ResetPsswordDto, ResetPsswordConfirmationDto } from './dto';
import { Tokens } from './type';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { create } from 'domain';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.logout(user['sub']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPsswordDto) {
    return this.authService.resetPassword(resetPasswordDto.email);
  }

  @Put('/resetPassword-confirmation')
  async resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPsswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto.newPassword,
      resetPasswordConfirmationDto.otp,
      resetPasswordConfirmationDto.email,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/ban/:id')
  @HttpCode(HttpStatus.OK)
  async banUser(@Param('id') userId: string, @Req() req: Request) {
    console.log(`admin + ${req.user}`);
    console.log(`ID + ${userId}`);

    const adminEmail = req.user;
    return this.authService.banUser(userId, adminEmail['email']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-user')
  @HttpCode(HttpStatus.OK)
  createUser(@Req() req: Request, @Body() dto: AuthDto) {
    const adminEmail = req.user;
    return this.authService.createUser(adminEmail['email'], dto);
  }
}
