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

/**
 * AquaLogger framework Constructor
 * @api public
 */



var ConsoleLogger = winston.transports.ConsoleLogger = function (options) {
    //
    // Name this logger
    //
    this.name = 'ConsoleLogger';

    //
    // Set the level from your options
    //
    this.level = options.level || 'info';

    //
    // Configure your storage backing as you see fit
    //
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//

util.inherits(ConsoleLogger, winston.Transport);

ConsoleLogger.prototype.log = function (level, msg, meta, callback) {
    callback(null, true);
};


var AquaJsLogger = function() {
    console.log("Logger created");
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


AquaJsLogger.prototype.init = function(configArgs) {
    var logConfig = configArgs.logConfig,
        logger = new winston.Logger(),
        fileCfg;
    Object.keys(logConfig).forEach(function(key) {
        var transCfg = logConfig[key];
        switch (key) {
            case "console":
                logger.add(ConsoleLogger,  {
                    colorize: transCfg.colorize || "true",
                    timestamp: transCfg.timestamp || "true",
                    level: transCfg.level || "info",
                    handleExceptions: true,
                    timestamp: function() {
                        now = new Date();
                        year = "" + now.getFullYear();
                        month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
                        day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
                        hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
                        minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
                        second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
                        milliseconds = "" + now.getMilliseconds(); if (milliseconds.length == 1) { milliseconds = "0" + milliseconds; }
                        return month + "-" + day + "-" + year + " " + hour + ":" + minute + ":" + second+ ":" + milliseconds;
                    }
                });
                break;
            case "file":
                fileCfg = {
                    filename: transCfg.filename || "application.log",
                    handleExceptions: transCfg.handleExceptions || true,
                    exitOnError: transCfg.exitOnError || false,
                    json: false,
                    level: transCfg.level || "info",
                    timestamp: transCfg.timestampFormat||function() {
                        now = new Date();
                        year = "" + now.getFullYear();
                        month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
                        day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
                        hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
                        minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
                        second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
                        milliseconds = "" + now.getMilliseconds(); if (milliseconds.length == 1) { milliseconds = "0" + milliseconds; }
                        return month + "-" + day + "-" + year + " " + hour + ":" + minute + ":" + second+ ":" + milliseconds;
                    }
                };
                logger.add(winston.transports.File, fileCfg);
                winston.handleExceptions( new winston.transports.File(fileCfg));
                break;
            case "rollingFile":
                fileCfg = {
                    filename: transCfg.filename || "application.log",
                    name: transCfg.name || "rollingFileAppender",
                    handleExceptions: transCfg.handleExceptions || true,
                    exitOnError: transCfg.exitOnError || false,
                    level: transCfg.level || "info",
                    json: false,
                    datePattern: transCfg.datePattern || '.yyyy-MM-ddTHH',
                    timestamp: transCfg.timestampFormat||function() {
                        now = new Date();
                        year = "" + now.getFullYear();
                        month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
                        day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
                        hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
                        minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
                        second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
                        milliseconds = "" + now.getMilliseconds(); if (milliseconds.length == 1) { milliseconds = "0" + milliseconds; }
                        return month + "-" + day + "-" + year + " " + hour + ":" + minute + ":" + second+ ":" + milliseconds;
                    }
                };
                logger.add(winston.transports.DailyRotateFile,fileCfg);
                winston.handleExceptions( new winston.transports.DailyRotateFile(fileCfg));
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
                winston.handleExceptions( new Mail(emailCfg));
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

AquaJsLogger.prototype.getWinston = function() {
    // will be undefined if init not called first
    return this.winston;
};

AquaJsLogger.prototype.getLogger = function() {
    // will be undefined if init not called first
    return this.logger;
};

//Export the singleton AquaJSLogger Instance which will be used through require('AquaJSLogger')
module.exports = new AquaJsLogger();
