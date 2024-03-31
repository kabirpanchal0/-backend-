import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DbService {
    private conn;

    constructor() {
        this.initConnection();
    }

    private async initConnection() {
        this.conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Kabir@2241',
            database: 'firstdb'
        });
    }

    async callStoredProcedure(procedureName: string, params: any[]): Promise<any> {
        return this.conn.execute(`CALL ${procedureName}(${params.map(() => '?').join(',')})`, params);
    }
}
