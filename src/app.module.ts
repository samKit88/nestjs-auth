import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    AuthModule,
    InventoryModule,
    PrismaModule,

    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
