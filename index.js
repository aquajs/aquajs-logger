"use strict";

/**
 * Aqua JS Logger Framework
 * The logger is a wrapper around the winston logger and supports multiple logging
 * the looger will be initialzied in the bootstrap.js using the initlogger()
 * logger config is the configuration file where developer can specify the multiple transporter configuration
 * Some of the Types of loggers supported are console file file rolling appender email cassendra and mongodb loggers
 *
General usage :

 var loggerConfig = require('./log_config.json');

 AquaJsLogger =require('aquajs-logger');

 AquaJsLogger.init(loggerConfig);

 logger = AquaJsLogger.getLogger();
 logger.info("get my Details");

 logger =require('aquajs-logger').getLogger();

 logger.info("get my Details");

 */

var winston = require('winston');
var path = require('path'),
    util = require('util');

/**
 * AquaLogger framework Constructor
 * @api public
 */

var AquaJsLogger = function () {
    console.log("constructor of AquaJS Logger..");
};

/**
 * AquaLogger init which initialize the winston wrapped logger for AquaJSLogger
 * Example of config args
 * {
    "logConfig": {
        "console": {
            "level": "info",
            "colorize": true
        },
        "file": {
            "level": "info",
            "filename": "application.log"
        }
    }
}
 * @api public
 * @param configArgs
 *
 */


AquaJsLogger.prototype.init = function (configArgs) {
    var logConfig = configArgs.logConfig,
        logger = new winston.Logger(),
        fileCfg;
    Object.keys(logConfig).forEach(function (key) {
        var transCfg = logConfig[key];
        switch (key) {
            case "console":
                logger.add(winston.transports.Console, {
                    colorize: transCfg.colorize || "true",
                    timestamp: transCfg.timestamp || "true",
                    level: transCfg.level || "info",
                    handleExceptions: true
                });
                break;
            case "file":
                fileCfg = {
                    filename: transCfg.filename || "application.log",
                    handleExceptions: transCfg.handleExceptions || true,
                    exitOnError: transCfg.exitOnError || false,
                    level: transCfg.level || "info"
                };
                logger.add(winston.transports.File, fileCfg);
                winston.handleExceptions(new winston.transports.File(fileCfg));
                break;
            case "rollingFile":
                fileCfg = {
                    filename: transCfg.filename || "application.log",
                    name: transCfg.name || "rollingFileAppender",
                    handleExceptions: transCfg.handleExceptions || true,
                    exitOnError: transCfg.exitOnError || false,
                    level: transCfg.level || "info",
                    datePattern: transCfg.datePattern || '.yyyy-MM-ddTHH'
                };
                logger.add(new winston.transports.DailyRotateFile(fileCfg));
                winston.handleExceptions(new winston.transports.DailyRotateFile(fileCfg));
                break;
            case "email":
                var Mail = require('winston-mail').Mail,
                    emailCfg = {
                        to: transCfg.to || "aqaujsadmin@equninix.com",
                        from: transCfg.from || "aqaujsadmin@equninix.com",
                        host: transCfg.host,
                        port: transCfg.port,
                        username: transCfg.username,
                        password: transCfg.password,
                        ssl: transCfg.ssl,
                        tls: transCfg.tls,
                        level: transCfg.level || "error",
                        silent: transCfg.silent || true
                    };
                winston.add(Mail, emailCfg);
                winston.handleExceptions(new winston.transports.File(emailCfg));
                break;
            case "mongodb":
                var MongoDB = require('winston-mongodb').MongoDB;
                winston.add(MongoDB, {
                    level: transCfg.level || "info",
                    silent: transCfg.silent || true,
                    db: transCfg.db,
                    collection: transCfg.collection,
                    safe: transCfg.safe,
                    host: transCfg.host,
                    port: transCfg.port
                });
                break;
            case "Cassandra":
                var Cassandra = require('winston-cassandra').Cassandra;
                winston.add(Cassandra, {
                    level: transCfg.level,
                    table: transCfg.table,
                    partitionBy: transCfg.partitionBy,
                    consistency: transCfg.consistency,
                    hosts: transCfg.hosts,
                    keyspace: transCfg.keyspace
                });
                break;
            case "precog":
                winston.add(winston.transports.PregogLogging, {
                    to: transCfg.to || "aqaujsadmin@equninix.com",
                    from: transCfg.from || "aqaujsadmin@equninix.com",
                    host: transCfg.host,
                    port: transCfg.port,
                    username: transCfg.username,
                    password: transCfg.password,
                    ssl: transCfg.ssl,
                    tls: transCfg.tls,
                    level: transCfg.level || "info",
                    silent: transCfg.silent || true
                });
                break;
            default:
                logger.add(winston.transports.Console, {
                    colorize: true,
                    timestamp: true,
                    level: 'info'
                });
                break;
        }
    });
    this.logger = logger;
};

/**
 * Get the logger handler from the logger object
 * @api public
 * @param
 * @see
 * @return
 */

AquaJsLogger.prototype.getLogger = function () {
    if (undefined !== this.logger) {
        return this.logger;
    } else {
        return null;
    }
};

/**
 * Define your own custom logger instance by extending the winston logger
 * The PREGOG Logging is specific  to equinix which uses the BEET client and logs the response using
 * the behaviour tracking apis
 * @api public
 * @param options
 * @see
 * @return
 */

var PrecogLogging = winston.transports.PrecogLogging = function (options) {

    //
    // Precog Logging
    //
    this.name = 'precogLogging';
    this.level = options.level || 'info';
};

util.inherits(PrecogLogging, winston.Transport);

PrecogLogging.prototype.log = function (level, msg, meta, callback) {
    callback(null, true);
};

//Export the singleton AquaJSLogger Instance which will be used through require('AquaJSLogger')
module.exports = new AquaJsLogger();