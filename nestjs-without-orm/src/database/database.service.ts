import * as mysql from 'mysql2';
import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

interface ConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const connectionOptions: ConnectionOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Kabir@2241',
  database: 'firstdb',
};

@Injectable()
export class DatabaseService {
  private connection: Connection;

  constructor() {
    this.connection = mysql.createConnection(connectionOptions);

    this.connection.connect((err) => {
      if (err) {
        console.error('Error', err);
        return;
      }
      console.log('Data base connected successfully');
    });
  }

  query(sql: string, args: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  close() {
    this.connection.end();
  }
}
