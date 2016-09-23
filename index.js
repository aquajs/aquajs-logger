/**
 * Aqua JS Logger Framework
 * The logger is a wrapper around the winston logger and supports multiple logging
 * the looger will be initialzied in the bootstrap.js using the initlogger()
 * logger config is the configuration file where developer can specify the multiple transporter configuration
 * Some of the Types of loggers supported are console file file rolling appender email cassendra and mongodb loggers
 *
 General usage :

 var loggerConfig = require('./log_config.json');

 AquaJsLogger = require('aquajs-logger');

 AquaJsLogger.init(loggerConfig);

 logger = AquaJsLogger.getLogger();
 logger.info("get my Details");

 logger =require('aquajs-logger').getLogger();

 logger.info("get my Details");

 */

var winston = require('winston');
var path = require('path'),
    util = require('util');
//appId is used specifically for identifying the application
//use previous defined $appid
global.$appid = global.$appid || "";

/**
 * AquaLogger framework Constructor
 * @api public
 */



var AquaJsLogger = function () {

    //console.log("Logger created");
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
 * *
 */

AquaJsLogger.prototype.init = function (configArgs, appId) {
    var logConfig = configArgs.logConfig,
        logger = new winston.Logger(),
        fileCfg;

    Object.keys(logConfig).forEach(function (key) {
        var transCfg = logConfig[key];
        switch (key) {
            case "console":
                logger.add(winston.transports.Console, {
                    colorize: transCfg.colorize || true,
                    timestamp: transCfg.timestamp || true,
                    level: transCfg.level || "debug",
                    //handleExceptions: false, enable this flag if you want winston logger to handle uncaught exception.
                    timestamp: transCfg.timestamp || getCustomTimeStamp,
                    formatter: function (options) {
                        // Return string will be passed to logger.
                        return options.timestamp() + ' ' + $appid + ' '
                            + getLevel(options.level.toUpperCase()) + ' '
                            + (undefined !== options.message ? options.message : '')
                            + (options.meta && Object.keys(options.meta).length ? '\n\t'
                            + JSON.stringify(options.meta) : '');
                    }
                });
                break;
            case "file":
                fileCfg = {
                    filename: process.env.LOG_CONFIG_PATH || transCfg.filename || "application.log",
                    json: false,
                    level: transCfg.level || "info",
                    timestamp: transCfg.timestamp || getCustomTimeStamp,
                    maxsize: transCfg.maxsize,
                    maxFiles:  transCfg.maxFiles,
                    zippedArchive: transCfg.zippedArchive,
                    tailable:  transCfg.tailable,
                    formatter: function (options) {
                        // Return string will be passed to logger.
                        return options.timestamp() + ' ' + $appid + ' '
                            + getLevel(options.level.toUpperCase()) + ' '
                            + (undefined !== options.message ? options.message : '')
                            + (options.meta && Object.keys(options.meta).length ? '\n\t'
                            + JSON.stringify(options.meta) : '');
                    }
                };
                logger.add(winston.transports.File, fileCfg);
                break;
            case "rollingFile":
                fileCfg = {
                    filename: process.env.LOG_CONFIG_PATH || transCfg.filename || "application.log",
                    name: transCfg.name || "rollingFileAppender",
                    // handleExceptions: false,
                    //exitOnError: false,
                    level: transCfg.level || "info",
                    json: false,
                    datePattern: transCfg.datePattern || '.yyyy-MM-ddTHH',
                    timestamp: transCfg.timestamp || getCustomTimeStamp,
                    maxsize: transCfg.maxsize,
                    maxFiles:  transCfg.maxFiles,
                    zippedArchive: transCfg.zippedArchive,
                    tailable:  transCfg.tailable,
                    formatter: function (options) {
                        // Return string will be passed to logger.
                        return options.timestamp() + ' ' + $appid + ' '
                            + getLevel(options.level.toUpperCase()) + ' '
                            + (undefined !== options.message ? options.message : '')
                            + (options.meta && Object.keys(options.meta).length ? '\n\t'
                            + JSON.stringify(options.meta) : '');
                    }
                };
                logger.add(winston.transports.DailyRotateFile, fileCfg);
                break;
            case "email":
                var Mail = require('winston-mail').Mail,
                    emailCfg = {
                        host: transCfg.host,
                        port: transCfg.port,
                        to: transCfg.to,
                        from: transCfg.from,
                        username: transCfg.username,
                        password: transCfg.password,
                        ssl: transCfg.ssl,
                        level: transCfg.level || "error"
                    };
                logger.add(Mail, emailCfg);
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
            case "cassandra":
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
            case "logIo":
                var LogIo = require('winston-logio');
                logger.add(LogIo.Logio, {
                    level: 'info',
                    port: transCfg.port || 28777,
                    node_name: transCfg.node_name,
                    host: transCfg.host
                });
                break;
            default:
        }
    });
    this.winston = winston;
    this.logger = logger;

};

/**
 * Get the logger handler from the logger object
 * @api public
 * @param
 * @see
 * @return
 */

AquaJsLogger.prototype.getWinston = function () {
    // will be undefined if init not called first
    return this.winston;
};

AquaJsLogger.prototype.getLogger = function () {
    // will be undefined if init not called first
    return this.logger;
};
//Use toLocaleString, to avoid calculations
function getCustomTimeStamp() {
    var dateFormat = {
        day: '2-digit',
        year: 'numeric',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    var date = new Date();
    var dateString = date.toLocaleString(undefined, dateFormat); //first argument(locale) is mandatory
    return dateString.replace(/[\/,\s]+/g, '-') + ":" + date.getMilliseconds();
};

function getLevel(level) {
    if (!level) {
        level = "info";
    } else if (level.length < 5) {
        level =  level + " ";
    }
    return level;
}

//Export the singleton AquaJSLogger Instance which will be used through require('AquaJSLogger')
module.exports = new AquaJsLogger();
