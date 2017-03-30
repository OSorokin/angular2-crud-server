import { USERS_CRUD_APP_Configuration } from '../../typings';

const SERVER: USERS_CRUD_APP_Configuration.ServerConfig = {
  port: '3000',
  url: 'http://localhost:3000'
};

const DATABASE: USERS_CRUD_APP_Configuration.DatabaseConfig = {
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
const LOG: USERS_CRUD_APP_Configuration.LogConfig = {
  transports: [{
    type: 'console',
    level: 'silly'
  }]
};

export default <USERS_CRUD_APP_Configuration.EnvConfig> {
  server: SERVER,
  database: DATABASE,
  log: LOG
};