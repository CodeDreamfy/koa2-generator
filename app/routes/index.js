const lodash = require('lodash');
const base_router = require('../utils/base_router');
const AirModel = require('../models/air_model');
const config = require('../config/config');

class index extends base_router {
    actions() {
        this.router.get('/', async(ctx, next) => {
            await ctx.render('index', {title: 'Koa2'});
        });
    
        this.router.get('/airs', async(ctx, next) => {
            const airs = await AirModel.find({}).exec().catch(err => {
                config.error_logger.error(err.stack);
                return null;
            });
            
            if (!airs) {
                ctx.body = {code:500};
                return;
            }
            
            ctx.body = airs.map(air => {
                return {id:air._id, uid:air.uid, did:air.did, name:air.name};
            });
        });
    
        this.router.post('/air', async(ctx, next) => {
            
            const body = ctx.request.body;
            config.logger.info(body);
            
            if (lodash.isEmpty(body.uid)) {
                ctx.body = {code:500, msg:'用户ID不能为空'};
                return;
            }
    
            if (lodash.isEmpty(body.did)) {
                ctx.body = {code:500, msg:'设备ID不能为空'};
                return;
            }
            
            const airModel = new AirModel({uid:body.uid, did:body.did, name:body.name});
            const save_ret = await airModel.save().catch(err => {
                config.error_logger.error(err.stack);
                return null;
            });
            if (!save_ret) {
                ctx.body = {code:500, msg:'保存失败'};
                return;
            }
        
            ctx.body = {code:0};
        });
    
        this.router.post('/air/name', async(ctx, next) => {
        
            const body = ctx.request.body;
            config.logger.info(body);
    
            if (lodash.isEmpty(body.id)) {
                ctx.body = {code:500, msg:'ID不能为空'};
                return;
            }
            if (lodash.isEmpty(body.name)) {
                ctx.body = {code:500, msg:'名称不能为空'};
                return;
            }
    
            const update_ret = await AirModel.update({_id:body.id}, {'$set':{name:body.name}}).catch(err => {
                config.error_logger.error(err.stack);
                return null;
            });
            if (!update_ret) {
                ctx.body = {code:500, msg:'修改失败'};
                return;
            }
        
            ctx.body = {code:0};
        });
    
        this.router.delete('/air', async(ctx, next) => {
        
            const query = ctx.request.query;
            config.logger.info(query);
    
            if (lodash.isEmpty(query.id)) {
                ctx.body = {code:500, msg:'ID不能为空'};
                return;
            }
    
            const rm_ret = await AirModel.remove({_id:query.id}).catch(err => {
                config.error_logger.error(err.stack);
                return null;
            });
            if (!rm_ret) {
                ctx.body = {code:500, msg:'删除失败'};
                return;
            }
        
            ctx.body = {code:0};
        });
    }
}

module.exports = index;
