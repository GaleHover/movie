var express = require('express');
var path =require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie.js');
var _ = require('underscore')
var bodyParser = require('body-parser');
var port = process.env.Port||3000;
var app = express();
mongoose.connect('mongodb://localhost/hys');

//设置模版引擎
app.set('views','./views/pages');
app.set('view engine','jade');

//中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'bower_components')));

//设置端口
app.listen(port);

console.log("start");

//首页
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            consoel.log(err);
        }
        res.render('index.jade',{
            title:'movie 首页',
            movie:movies
        })
    });

});

/**
 * 查询具体某个电影
 */
app.get('/movie/:id',function(req,res){
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'Movie'+movie.title,
            movie:movie
        })
    });

});

/**
 * 管理页面实现添加功能
 */
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'movie ',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''

        }
    })
});

// 更新数据
app.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
    if(id){

        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'Movie 后台更新',
                movie:movie
            })
        })
    }
})

/**
 * 电影数据的存储 表单提交的
 */
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if(id !=='undefined'){
        Movie.findById(id,function(err,movie)
        {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash

        })
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            res.redirect('/movie'+movie._id);
        })
    }
})

app.get('/admin/list',function(req,res){
    res.render('list',{
        title:'movie 列表页',movie:[{
            title:'机械战警',
            _id:1,
            doctor:'hys',
            country:'中国',
            year:2014,
            poster:'http://image.189mv.cn/images/vedio/366336ac1ac33598b57d62fb9eeb6141_PIC_4665.jpg',
            language:'英语',
            flash:'http://tb-video.bdstatic.com/tieba-smallvideo/785452_e7176b1a18928f0173b83b93ed2ec7ac.mp4',
            summary:'哈哈'
        }]
    })
});