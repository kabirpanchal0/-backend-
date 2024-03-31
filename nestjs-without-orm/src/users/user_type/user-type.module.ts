import { Module } from '@nestjs/common';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';
import { DbService } from 'src/db/db/db.service';

@Module({
  controllers: [UserTypeController],
  providers: [UserTypeService, DbService],

})
export class UserTypeModule {}
