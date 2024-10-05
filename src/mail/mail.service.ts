import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'rupert37@ethereal.email',
        pass: 'VmX9XaUFFpYmgTPg5M',
      },
    });
  }

  async sendPasswordResetEmail(to: string, otp: number) {
    const mailoptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'otp',
      html: `<p> Here is your one time reset password code</p>
            <p>OTP: ${otp}</p>`,
    };

    await this.transporter.sendMail(mailoptions);
    return true;
  }
}
