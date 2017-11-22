/**
 *  设备置顶模型
 *  Create by yuz on 2017-10-19
 */

const config = require('../config/config');

const mongoose = config.mongoose;

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const AirSchema = new Schema({
    uid: Number,          // 用户ID
    did: ObjectId,       // 设备ID
    name:String,         // 名称
    dataType: Number,     // 空调类型
    created_time: Number, // 更新事件
});

const AirModel = mongoose.model('AirModel', AirSchema);

module.exports = AirModel;
