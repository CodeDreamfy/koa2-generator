
const base_router = require('../utils/base_router');


class users extends base_router {
    actions() {
        this.router.prefix('/users');
        this.router.get('/', async(ctx, next) => {
            ctx.body = {
                version: '3.0',
                name: '设备云APP',
                PowerBy: '中移物联网'
            };
        });
        
    }
}

module.exports = users;
