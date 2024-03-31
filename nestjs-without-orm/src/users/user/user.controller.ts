import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CreateUsersDto } from '../dto/create-user.dto';
import { UserService } from './user.service';
import { NotFoundError } from 'rxjs';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
    updateUsersDto: any;
    constructor(private readonly userService: UserService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() createUsersDto: CreateUsersDto) {
        return this.userService.create(createUsersDto);;
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        const users = await this.userService.findById(id);
        if (!users) {
            throw new NotFoundException('User not found');
        }
        return users;
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }
}
