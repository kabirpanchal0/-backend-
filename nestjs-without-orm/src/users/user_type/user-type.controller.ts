import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { UserType } from '../dto/usertype.dto';

@Controller('user_type')
export class UserTypeController {
    updateUsersDto: any;
    constructor(private readonly userTypeService: UserTypeService) { }

    @Get()
    findAll() {
        return this.userTypeService.findAll();
    }
    @Post()
    createUserTypes(@Body() usertypeDto: UserType) {
        return this.userTypeService.createUserTypes(usertypeDto);
    }

}
