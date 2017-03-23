import * as Sequelize from 'sequelize';
import * as dbUtils from './DbUtils';
import {getLogger} from '../logger/logger';
import config from '../configuration';

const logger = getLogger(__filename);
const connection: Sequelize.Sequelize = dbUtils.initializeConnection(logger, config.env().database);

export default connection;