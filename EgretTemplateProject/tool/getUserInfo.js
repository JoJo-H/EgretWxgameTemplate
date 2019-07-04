var http = require('http');
var https = require('https');
var url = require('url');
var util = require('util');

var appId = "w.x.a.7.c.0.d.c.a.1.f.e.5.a.2.e.7.9"; // 字符之间都加了.点,把点去掉
var secretKey = "ce0e5ee338d3014b0489b9be5f180903";

function wxUserInfo(code){
    var apiUrl = "https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+secretKey+"&js_code="+code+"&grant_type=authorization_code";
    console.log(apiUrl);
    return new Promise((resolve, reject) => {
        getHttpContent(apiUrl,(data)=>{
            var apiData = JSON.parse(data);
            resolve(apiData);
        });
    });
}


function getHttpContent(url,callback){
    https.get(url,function(req,res){  
        var html='';  
        req.on('data',function(data){  
            html+=data;  
        });  
        req.on('end',function(){  
          callback(html);  
        });  
    });  
  }

http.createServer(function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    if(params && params["code"]){
        console.log("1111");
        wxUserInfo(params.code).then(data=>{
            console.log(data);
            res.write(JSON.stringify(data));
            res.end();
        });
    }
    else{
        res.write("没有参数");
        res.end();
    }
 
}).listen(9999);
console.log("启动端口9999");
