

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var list=[
,101
,102
,25001
,25002
,25003
,25004
,25005
,25006
,25007
,25008
,42001
,42002
,42003
,43001
,43002
,43003
,43004
,43005
,43006
,43007
,43008
,43009
,43010
,100003
,241101
,241102
,241103
,241104
,241105
,241201
,241202
,241203
,241204
,241205
,241301
,241302
,241303
,241304
,241305
,241401
,241402
,241403
,241404
,241405
];



var targetPath="E:/pocket_hospital_svn/project/resource/assets/package/pic";

 
 //拷贝简单的文件

list.forEach( function (file){
        fs.readFile(targetPath+"/21001.png",function(err,originBuffer){            //读取图片位置（路径）
            if(!fs.exists(targetPath+"/"+file+".png"))
            {
                 fs.writeFile(targetPath+"/"+file+".png",originBuffer,function(err){      //生成图片2(把buffer写入到图片文件)
                if (err) {
                    console.log(err)
                }
                });
            }
        });
});

