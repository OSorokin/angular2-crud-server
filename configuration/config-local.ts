import {TTS4T_Configuration} from '../typings';
import * as path from 'path';

const SERVER: TTS4T_Configuration.ServerConfig = {
  port: '3000',
  url: 'http://localhost:3000'
};

const FILE_SYSTEM: TTS4T_Configuration.FileSystemConfig = {
  superAdminsFile: path.join(__dirname, '..', '..', 'superadmin.json'),
  webappStaticFolder: path.join(__dirname, '..', '..', '..', 'webapp', 'dist')
};

const DATABASE: TTS4T_Configuration.DatabaseConfig = {
  temporaryDatabaseName: 'users-crud-app-migrations-from-models',
  name: 'users-crud-app',
  username: 'postgres',
  password: 'postgres',
  settings: {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',

    pool: {
      max: 3,
      min: 1,
      idle: 5000
    }
  }
};


//noinspection TypeScriptValidateTypes
const LOG: TTS4T_Configuration.LogConfig = {
  transports: [{
    type: 'console',
    level: 'silly'
  }]
};

export default <TTS4T_Configuration.EnvConfig> {
  server: SERVER,
  database: DATABASE,
  log: LOG,
  fileSystem: FILE_SYSTEM,
};