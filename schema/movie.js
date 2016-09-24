var mongoose = require('mongoose');
var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }

});

MovieSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt =this.meta.updateAt =Date.now()
    }else{
        this.meta.updateAt =Date.now()
    }
    next()
});
MovieSchema.statics={
    //查询多条数据
    fetch:function(cb){
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    // 查询单条数据
    findById:function (id,cd) {
        return this.findOne({_id:id})
            .exec(cb)
    }

}

module.exports =MovieSchema