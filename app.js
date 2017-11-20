const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koaNunjucks = require('koa-nunjucks-2');
const path = require('path');
const cors = require('@koa/cors');

const route_loader = require('./app/utils/route_loader');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/app/static'));

app.use(cors());

app.use(koaNunjucks({
    ext: 'nunjucks',
    path: path.join(__dirname, 'app/views'),
    nunjucksConfig: {
        trimBlocks: true,
        lstripBlocks: true,
        noCache: true
    }
}));

// logger
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//加载路由
route_loader(app);

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
