import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db/db.service';
import { UserType } from '../dto/usertype.dto';

@Injectable()
export class UserTypeService {
    constructor(private readonly dbService: DbService) { }
    // find all query
    async findAll() {
        try {
            const [users] = await this.dbService.callStoredProcedure('getUserTypes', ['getall', null]);
            return users;
        } catch (error) {
            throw error;
        }
    }

    async createUserTypes(usertypeDto: UserType) {
        try {
            const { user_type_name } = usertypeDto;
            await this.dbService.callStoredProcedure('createUserTypes', [user_type_name]);
            return { message: `User-type ${user_type_name} added successfully`}

        } catch(error){
            throw error;
        }
    }
}
