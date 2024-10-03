import { IsEmail } from 'class-validator';

export class ResetPsswordDto {
  @IsEmail()
  email: string;
}
