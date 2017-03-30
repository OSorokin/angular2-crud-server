import { USERS_CRUD_APP_Configuration } from '../../typings';
import { MODE } from './env';
import ConfigMigrations from './config-migrations';
import ConfigLocal from './config-local';

const config: USERS_CRUD_APP_Configuration.FullConfiguration = {
  env: function (): USERS_CRUD_APP_Configuration.EnvConfig {
    if (process.env.mode == null) {
      console.error('Error! process.env.mode not specified!');
      process.exit(1);
    }
    console.info('Mymode: ' + process.env.mymode);
    return config[process.env.mode];
  },
  isLocal: function (): boolean {
    return process.env.mode == MODE.local;
  },
  isTest: function (): boolean {
    return process.env.mode == MODE.test;
  },
  getMode: function () {
    return process.env.mode;
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm',
  DATE_TIME_HM_FORMAT: 'HH:mm',
  migrations: ConfigMigrations,
  local: ConfigLocal
};

export default config;
