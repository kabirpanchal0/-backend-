import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbService } from 'src/db/db/db.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DbService],

})
export class UserModule {}
