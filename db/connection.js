"use strict";
const dbUtils = require('./DbUtils');
const logger_1 = require('../logger/logger');
const configuration_1 = require('../configuration');
const logger = logger_1.getLogger(__filename);
const connection = dbUtils.initializeConnection(logger, configuration_1.default.env().database);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connection;
//# sourceMappingURL=connection.js.map