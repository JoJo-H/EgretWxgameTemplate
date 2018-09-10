var fs = require("fs");
//path模块，可以生产相对和绝对路径
var path = require("path");
var os = require("os");
var processC = require('child_process');

COMPRESSOR = './pngquant';
if(os.platform() != 'darwin'){
    COMPRESSOR = 'pngquant.exe'
}

//获取后缀名
function getsuffix(url){
    var arr = url.split('.');
    var len = arr.length;
    return arr[len-1];
}

var numOfFiles = 0;
var numOfFolders = 0;

function wirteMetaFile(filepath,data){
    var content = JSON.stringify(data);
    fs.writeFileSync(filepath,content);
}

function wirteLines(filepath,lines){
    var content = '';
    for(var i = 0; i < lines.length; ++i){
        content += lines[i] + '\n';
    }
    fs.writeFileSync(filepath,content);
}

var pngs = [];
function getPNGs(parent){
    var files = fs.readdirSync(parent);
    for(var k in files){
        var file = files[k];
        file = path.join(parent,file);

        var suffix = getsuffix(file);
        if(suffix == 'png'){
            pngs.push(file);
        }

        var stats = fs.statSync(file);
        if(!stats.isFile()){
            getPNGs(file);
        }
    }
}
var arguments = process.argv.slice(2);
console.log(arguments);
getPNGs(arguments[0]);
for(var i = 0; i < pngs.length; ++i){
    var url = pngs[i];
    var cmd = COMPRESSOR + ' ' + url + ' --ext=.png --force';
    console.log(cmd,(i+1) + '/' + pngs.length);
    processC.execSync(cmd);
}

console.log('finished.');

