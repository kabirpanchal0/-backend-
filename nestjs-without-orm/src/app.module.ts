import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db/db.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/user/user.module';
import { AgencyModule } from './agency/agency.module';
import { UserTypeModule } from './users/user_type/user-type.module';

@Module({
  imports: [DatabaseModule, DbModule, UserModule, AgencyModule, UserTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
