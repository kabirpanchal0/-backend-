import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db/db.service';
import { CreateUsersDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly dbService: DbService) { }

    async create(createUsersDto: CreateUsersDto) {
        try {
            const { user_name, user_contact, user_age, user_gender } = createUsersDto;
            await this.dbService.callStoredProcedure('create_users', [user_name, user_contact, user_age, user_gender]);
            return { message: `User ${user_name} created successfully` };
        } catch (error) {
            // throw new Error('Failed to create users');
            throw error
        }
    }

    // find all query
    async findAll() {
        try {
            const [users] = await this.dbService.callStoredProcedure('getUsers', ['getall', null]);
            return users;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number) {
        const [users] = await this.dbService.callStoredProcedure('getUsers', ['getbyid', id]);
        return users[0][0];
    }

    async remove(id: number) {
        try {
            await this.dbService.callStoredProcedure('deleteById', [id]);
            return `User with ID:${id} deleted successfully`;
        } catch (error) {
            throw new Error(`Failed to delete users with ID:${id}`);
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const { user_name, user_contact, user_age, user_gender } = updateUserDto;
            await this.dbService.callStoredProcedure('updatedById', [id, user_name, user_contact, user_age, user_gender ]);
            return `User with ID:${id} updated successfully`;
        } catch (error) {
            throw new Error(`Failed to update users with ID:${id}`);
        }
    }


}
