const lodash = require('lodash');
const base_router = require('../utils/base_router');
const AirModel = require('../models/air_model');
const config = require('../config/config');
const mongoose = config.mongoose;

const ObjectId = mongoose.Types.ObjectId;
class index extends base_router {
    actions() {
        this.router.prefix('/api');
        this.router.get('/', async(ctx, next) => {
            await ctx.render('index', {title: 'Koa2'});
        });
    
        this.router.get('/devices', async(ctx, next) => {
            const devices = await AirModel.find({}).catch(err => {
                this.error_logger.error(err.stack);
                return null;
            });
            
            if (!devices) {
                ctx.body = {code:500};
                return;
            }
            
            ctx.body = devices.map(air => {
                return {id:air._id, uid:air.uid, did:air.did, name:air.name, dataType: air.dataType};
            });
        });
    
        this.router.post('/device', async(ctx, next) => {
            
            const body = ctx.request.body;
            console.log(lodash.isEmpty(body.uid), body.uid);
            if (!body.uid) {
                ctx.body = {code:500, msg:'用户ID不能为空'};
                return;
            }
    
            if (lodash.isEmpty(body.name)) {
                ctx.body = {code:500, msg:'设备名称不能为空'};
                return;
            }
            
            const airModel = new AirModel({
                uid:body.uid, 
                did:ObjectId(), 
                name:body.name, 
                dataType: body.dataType, 
                created_time: +new Date
            });
            const save_ret = await airModel.save().catch(err => {
                this.error_logger.error(err.stack);
                return null;
            });
            if (!save_ret) {
                ctx.body = {code:500, msg:'保存失败'};
                return;
            }
        
            ctx.body = {code:200, msg: '设备添加成功'};
            return true;
        });
    
        this.router.patch('/device', async(ctx, next) => {
        
            const body = ctx.request.body;
            this.logger.info(body);
    
            if (lodash.isEmpty(body.did)) {
                ctx.body = {code:500, msg:'ID不能为空'};
                return;
            }
            if (lodash.isEmpty(body.name)) {
                ctx.body = {code:500, msg:'名称不能为空'};
                return;
            }
    
            const update_ret = await AirModel.update({did:body.did}, {'$set':{name:body.name}}).catch(err => {
                this.error_logger.error(err.stack);
                return null;
            });
            if (!update_ret) {
                ctx.body = {code:500, msg:'修改失败'};
                return;
            }
        
            ctx.body = {code:0};
        });
    
        this.router.delete('/device', async(ctx, next) => {
        
            const body = ctx.request.body;
    
            if (lodash.isEmpty(body.did)) {
                ctx.body = {code:500, msg:'ID不能为空'};
                return;
            }
    
            const rm_ret = await AirModel.remove({did:body.did}).catch(err => {
                this.error_logger.error(err.stack);
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
