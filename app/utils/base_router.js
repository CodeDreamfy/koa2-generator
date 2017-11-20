/**
 * 路由公共基础类
 */
const config = require('../config/config');

class base_router {
    constructor() {
        this.router = require('koa-router')();
        this.logger = config.logger;
        this.error_logger = config.error_logger;
    }
    
    actions() {}
    
    //路由初始化
    init() {
        this.actions();
        return this.router
    }
    
    ok(data) {
        return {code:0, msg:'OK', data:data};
    }
    
    error(msg, data) {
        return {code:500, msg:msg, data:data};
    }
}

module.exports = base_router;
