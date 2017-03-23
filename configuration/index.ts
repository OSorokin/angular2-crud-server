import {TTS4T_Configuration} from '../typings';
import {MODE} from './env';
import ConfigMigrations from './config-migrations';
import ConfigLocal from './config-local';

const config: TTS4T_Configuration.FullConfiguration = {
  env: function (): TTS4T_Configuration.EnvConfig {
    if (process.env.mode == null) {
      console.error('Error! process.env.mode not specified!');
      process.exit(1);
    }

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
