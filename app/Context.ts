import connection from './db/connection';
import { initializeSequelizeModels } from './models';
import { getLogger } from './logger/logger';
const logger = getLogger(__filename);

export default class Context {

  public static async init(): Promise<void> {
    try {
      await initializeSequelizeModels(connection);
    } catch (err) {
      logger.error('Error while initialization: ' + err);
      throw err;
    }
  }

}