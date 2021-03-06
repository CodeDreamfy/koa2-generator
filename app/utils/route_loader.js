/**
 * 路由加载器
 * @param app
 */

const fs = require('fs');
const path = require('path');

module.exports = function (app) {
    
    //获取系统配置信息
    
    const routes_dir = process.cwd() + '/app/routes';
    
    //加载路由文件
    fs.readdirSync(routes_dir).forEach(name => {
        let stat = fs.lstatSync(path.join(routes_dir, name)); // 获取文件状态
        if (!stat.isDirectory() && name.endsWith('.js')) {
            console.log('load route：', path.join(routes_dir, name));
            const route = new (require(path.join(routes_dir, name)))().init(); // 对引入的每个js文件执行初始化
            app.use(route.routes(), route.allowedMethods());
        }
    });
};