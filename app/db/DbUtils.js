"use strict";
const _ = require('lodash');
const Sequelize = require('sequelize');
const pg = require('pg');
pg.defaults.parseInt8 = true;
require('pg-parse-float')(pg);
function initializeConnection(logger, config) {
    const options = _.cloneDeep(config.settings);
    options.logging = logger.info;
    return new Sequelize(config.name, config.username, config.password, options);
}
exports.initializeConnection = initializeConnection;
//# sourceMappingURL=DbUtils.js.map