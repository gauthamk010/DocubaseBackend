import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import  * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BookService } from './book/book.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/DOCUBASE',
      {dbName: 'DOCUBASE',
      }
    ),
    MulterModule.register({dest: './uploads'}),
    AuthModule,
    BookModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
