# Aqua Js Logger

Aqua JS Logger framework:
Currently Aqua Js Logging Framework supports logging to Console, File, Rolling File, Email, PREGOG, MongoDB, Redis, Database Logging .

Configuration :

specify the logger config for the environment :

Simple example - a logger for console and file logging :

  - sample log_config.json is provided by the framework.
```javascript
var loggerConfig = require('./log_config.json');
AquaJsLogger = require('aquajs-logger');
AquaJsLogger.init(loggerConfig);

logger = AquaJsLogger.getLogger();
logger.info("get my Details");

logger = require('aquajs-logger').getLogger();
logger.info("get my Details");
```

Use the Logger :
```javascript
logger.info("Server Listing on the port:" + config.port);
logger.error ("Invalid Data Type");
```

Other Logger Configuration Attributes :

  - Console logging attributes:
               `colorize`, `timestamp`, `level`, `handleExceptions`;
  - File logging attributes:
             `filename`, `handleExceptions`, `exitOnError`, `level`;
  - RollingFile logging attributes:
             `filename`, `name`, `handleExceptions`, `exitOnError`, `level`, `datePattern`;
  - Email logging attributes:
             `to`, `from`, `host`, `port`, `username`, `password`, `ssl`, `tls`, `level`, `silent`;
  - Cassandra logging attributes:
           `level`, `table`, `partitionBy`, `consistency`, `hosts`, `keyspace`;
  - Mongo DB logging attributes:
         `level`, `silent`, `db`, `collection`, `safe`, `host`, `port`.

