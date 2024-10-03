import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ResetPsswordConfirmationDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;

  @IsString()
  newPassword: string;
}
