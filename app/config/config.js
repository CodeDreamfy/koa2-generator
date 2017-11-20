const mongoose = require('mongoose');
const log4js = require('log4js');

/**
 * 系统日志
 */
log4js.configure({
    appenders: {
        error: { type: 'file', filename: 'logs/error.log' },
        app: { type: 'stdout' }
    },
    categories: {
        default: { appenders: ['app'], level: 'info' },
        error: { appenders: ['error', 'app'], level: 'error' }
    }
});

const config = {
    logger:log4js.getLogger('app'),
    error_logger:log4js.getLogger('error'),
};


// mongo连接配置
const mongo_url = 'mongodb://localhost:27017/airh5';
mongoose.Promise = require('bluebird');
mongoose.connect(mongo_url, {useMongoClient:true});

const db = mongoose.connection;
db.on('error', function (err) {
    config.error_logger.error("mongo Error:" + err.toString());
});
db.once('open', function() {
    config.logger.info('mongo connected to', mongo_url);
});
config.mongoose = mongoose;

module.exports = config;
