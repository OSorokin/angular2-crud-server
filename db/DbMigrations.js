"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const logger = require('../logger/logger').getLogger(__filename);
const env_1 = require('../configuration/env');
const _ = require('lodash');
const childProcess = require('child_process');
const moment = require('moment');
const path = require('path');
const xml2js = require('xml2js');
const fs = require('fs');
const util = require('util');
const models_1 = require('../models');
const DbUtils_1 = require('./DbUtils');
const pgtools = require('pgtools');
class DbMigrations {
    constructor(_env, _appMode) {
        this._env = _env;
        this._appMode = _appMode;
        this._temporaryDbToSynchronizeSchemeBySequelize = this._env.database.temporaryDatabaseName;
    }
    static initialize(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Migrations logic initialized for mode: ${configuration.getMode()}`);
            return new DbMigrations(configuration.env(), configuration.getMode());
        });
    }
    generateNewChangelog() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._appMode != env_1.MODE.migrations) {
                throw new Error(`Invalid migrations usage. For generating changelogs you can use only mode: ${env_1.MODE.migrations}`);
            }
            yield this.synchronizeTempDbWithSequelizeModels();
            yield this.prepareCleanDb(this._env.database.name);
            yield this.applyMigrationsToDb(this._env.database.name);
            const changelogFile = path.join(DbMigrations.CONFIGURATION.migrationsDir, DbMigrations.CONFIGURATION.generatedChangelogOutput);
            yield this.generateChangelog(changelogFile);
        });
    }
    applyMigrations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.applyMigrationsToDb(this._env.database.name);
        });
    }
    syncSchemeWithModels() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.synchronizeSequelizeModels(this._env.database);
        });
    }
    validateScheme() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.synchronizeTempDbWithSequelizeModels();
            const changelogFile = path.join(DbMigrations.CONFIGURATION.migrationsDir, DbMigrations.CONFIGURATION.generatedChangelogOutput) + '.tmp.xml';
            yield this.generateChangelog(changelogFile);
            yield this.checkThatChangelogIsEmpty(changelogFile);
            yield this.deleteChangelog(changelogFile);
        });
    }
    synchronizeTempDbWithSequelizeModels() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepareCleanDb(this._temporaryDbToSynchronizeSchemeBySequelize);
            const specifiedSettings = _.cloneDeep(this._env.database);
            specifiedSettings.name = this._temporaryDbToSynchronizeSchemeBySequelize;
            yield this.synchronizeSequelizeModels(specifiedSettings);
        });
    }
    synchronizeSequelizeModels(databaseConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._appMode != env_1.MODE.test) {
                const isConnectionToMainDB = this._env.database.name == databaseConfig.name;
                if (isConnectionToMainDB) {
                    throw new Error('Invalid migrations usage. Sequelize cannot be synchronized with main db. Detected: '
                        + `mainDb=${this._env.database.name}, `
                        + `modelsSyncDb=${databaseConfig.name}`);
                }
            }
            logger.info(`Sequelize models synchronisation for db: ${databaseConfig.name}`);
            const connection = DbUtils_1.initializeConnection(logger, databaseConfig);
            models_1.initializeSequelizeModels(connection);
            yield connection.sync({
                force: true
            });
            connection.close();
            logger.info('Sequelize models synchronisation done');
        });
    }
    prepareCleanDb(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Preparing clean temporary database: ${databaseName} `);
            const config = {
                user: this._env.database.username,
                password: this._env.database.password,
                port: this._env.database.settings.port,
                host: this._env.database.settings.host
            };
            return pgtools.createdb(config, databaseName)
                .catch(() => {
                return pgtools.dropdb(config, databaseName)
                    .then(() => pgtools.createdb(config, databaseName));
            })
                .then(() => logger.info('Preparing clean temporary database done.'));
        });
    }
    applyMigrationsToDb(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Applying migrations to db: ${databaseName}`);
            logger.info(`liquibaseJar: ` + DbMigrations.CONFIGURATION.liquibaseJar);
            logger.info(`postgresqlJar: ` + DbMigrations.CONFIGURATION.postgresqlJar);
            logger.info(`mainChangelog: ` + DbMigrations.CONFIGURATION.mainChangelog);
            logger.info(`migrationsDir: ` + DbMigrations.CONFIGURATION.migrationsDir);
            return new Promise((resolve, reject) => {
                childProcess.exec(`java -jar ${DbMigrations.CONFIGURATION.liquibaseJar} ` +
                    `    --classpath=${DbMigrations.CONFIGURATION.postgresqlJar} ` +
                    `    --changeLogFile=${DbMigrations.CONFIGURATION.mainChangelog} ` +
                    `    --driver=org.postgresql.Driver ` +
                    `    --username=${this._env.database.username} ` +
                    `    --password=${this._env.database.password} ` +
                    `    --url=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${databaseName} ` +
                    `  update`, {
                    cwd: DbMigrations.CONFIGURATION.migrationsDir
                }, (error, stdout, stderr) => {
                    logger.info('Liquibase process stdout: ' + stdout);
                    logger.info('Liquibase process stderr: ' + stderr);
                    if (error == null) {
                        logger.info('Applying migrations done');
                        resolve();
                        return;
                    }
                    logger.error('Applying migrations done with error');
                    reject(error);
                });
            });
        });
    }
    generateChangelog(outputFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Generating changelog as difference ` +
                `between ${this._temporaryDbToSynchronizeSchemeBySequelize} ` +
                `and ${this._env.database.name}. `);
            return new Promise((resolve, reject) => {
                childProcess.exec(`java -jar ${DbMigrations.CONFIGURATION.liquibaseJar} ` +
                    `    --classpath=${DbMigrations.CONFIGURATION.postgresqlJar} ` +
                    `    --changeLogFile=${outputFileName} ` +
                    `    --driver=org.postgresql.Driver ` +
                    `    --username=${this._env.database.username} ` +
                    `    --password=${this._env.database.password} ` +
                    `    --url=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${this._env.database.name} ` +
                    `  diffChangeLog ` +
                    `    --referenceUrl=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${this._temporaryDbToSynchronizeSchemeBySequelize} ` +
                    `    --referenceUsername=${this._env.database.username} ` +
                    `    --referencePassword=${this._env.database.password}`, {
                    cwd: DbMigrations.CONFIGURATION.migrationsDir
                }, (error, stdout, stderr) => {
                    logger.info('Liquibase process stdout: ' + stdout);
                    logger.info('Liquibase process stderr: ' + stderr);
                    if (error == null) {
                        logger.info(`Generating changelog done: ${outputFileName}`);
                        resolve();
                        return;
                    }
                    logger.error('Generating changelog done with error');
                    reject(error);
                });
            });
        });
    }
    checkThatChangelogIsEmpty(changelogFile) {
        logger.info('Checking that changelog is empty');
        const xml = fs.readFileSync(changelogFile, { encoding: 'utf8' });
        const parser = new xml2js.Parser();
        return new Promise((resolve, reject) => {
            parser.parseString(xml, (err, json) => {
                if (err != null) {
                    reject(err);
                }
                else {
                    resolve(json);
                }
            });
        }).then(json => {
            const databaseChangelogSection = json['databaseChangeLog'];
            if (databaseChangelogSection == null) {
                throw new Error('Error while checking changelog emptiness. "databaseChangeLog" section missed');
            }
            if (databaseChangelogSection['$'] == null) {
                throw new Error('Error while checking changelog emptiness. "databaseChangeLog" section meta missed');
            }
            delete databaseChangelogSection['$'];
            const keys = _.keys(databaseChangelogSection);
            if (keys.length > 0) {
                throw new Error(`Error while checking changelog emptiness. "databaseChangeLog" section has something: ${keys}`);
            }
            logger.info('Checking done, changelog is empty');
        });
    }
    deleteChangelog(changelogFile) {
        return new Promise(resolve => {
            fs.unlink(changelogFile, err => {
                if (err == null) {
                    logger.info('Temporary changelog file deleted');
                    return resolve();
                }
                logger.error(`Temporary changelog file cannot be deleted ${util.inspect(err)}`);
                return resolve();
            });
        });
    }
}
DbMigrations.NOW_AS_STRING = moment().format('YYYYMMDD-HHmm');
DbMigrations.CONFIGURATION = {
    migrationsDir: path.join(__dirname, '..', 'migrations'),
    liquibaseJar: path.join('bin', 'liquibase.jar'),
    postgresqlJar: path.join('bin', 'postgresql-9.4.1212.jar'),
    generatedChangelogOutput: path.join('changelogs', `db.changelog-${DbMigrations.NOW_AS_STRING}.xml`),
    mainChangelog: 'db.changelog.xml'
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbMigrations;
//# sourceMappingURL=DbMigrations.js.map