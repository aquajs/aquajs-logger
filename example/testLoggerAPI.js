var loggerConfig = require('./log_config.json');

AquaJsLogger =require('aquajs-logger');

AquaJsLogger.init(loggerConfig);

logger = AquaJsLogger.getLogger();
logger.info("get my Details");

logger =require('aquajs-logger').getLogger();

logger.info("get my Details");