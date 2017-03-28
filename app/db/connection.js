"use strict";
const dbUtils = require('./DbUtils');
const index_1 = require('../configuration/index');
const logger_1 = require('../logger/logger');
const logger = logger_1.getLogger(__filename);
const connection = dbUtils.initializeConnection(logger, index_1.default.env().database);
connection.authenticate().then(function () {
    console.log('Connect to DB created!');
}).catch(function (err) {
    console.log('Connection error: ' + err);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connection;
//# sourceMappingURL=connection.js.map