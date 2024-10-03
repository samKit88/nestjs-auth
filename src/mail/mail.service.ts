import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
// import { hostname } from 'os';
// import { from, Subject } from 'rxjs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'mikayla.flatley@ethereal.email',
        pass: 'ntX34rZeNstTF4qftF',
      },
    });
  }

  async sendPasswordResetEmail(to: string, otp: number) {
    // const resetLink = `http://yourapp.com/resetPassword-confirmation?`;
    const mailoptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'otp',
      html: `<p> Here is your one time reset password code</p>
            <p>OTP: ${otp}</p>`,
    };

    await this.transporter.sendMail(mailoptions);
    // return {
    //   message: `MSemail + ${to}`,
    // };
    return true;
  }
}
