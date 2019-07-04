var fs = require('fs');
var path = require('path');

var _version=process.argv[2]; //发布版本

var sourcePath="./resource/default.res.json";
var manifest="../EgretTemplateProject_wxgame/manifest.js";
var groupPath="../EgretTemplateProject_wxgame/resource/default.res.json";

var sheetPath="../EgretTemplateProject_wxgame_remote/"+_version+"/resource/default.res.json";
var sheetpngs="../EgretTemplateProject_wxgame_remote/"+_version+"/resource/assets";
var sheetpngs2="../EgretTemplateProject_wxgame_remote/"+_version+"/resource/assets/preload";
// var sheetpngs3="../EgretTemplateProject_wxgame_remote/"+_version+"/resource/assets/region";
 //替换分组
 replaceGroups();
 console.log("-------------------------");
  //替换图集节点
 replaceSheets();
console.log("-------------------------");
 //替换图集md5名字
 copySheetNames(sheetpngs);
 copySheetNames(sheetpngs2);
//  copySheetNames(sheetpngs3);
 console.log("-------------------------");
//替换manifest
 replaceManifest();
console.log("-------------------------");


 //替换图集
 function replaceSheets(){

    // 异步读取1
    var data=fs.readFileSync(sourcePath);
     var sheetCache={};
    var sourceObj=JSON.parse(data.toString());
    //把有图集的提取出来
    var sheets=sourceObj.resources;
    sheets.forEach(item=>{
        if(item.type=="sheet") //图集
        {
            sheetCache[item.name]=item;
            console.log("发现图集项: " + item.name);
        }
    });
    console.log("-------------------------");
    // 异步读取2
    var data2=fs.readFileSync(sheetPath);
    var targetObj=JSON.parse(data2.toString()); 
    var targetsheets=targetObj.resources;
    targetsheets.forEach(item=>{
        var matchItem=sheetCache[item.name]; //查找图集
        if(matchItem)
        {
            item.type="sheet";
            item.subkeys=matchItem.subkeys;
            console.log("替换图集项: " + item.name);
        }
    });
    fs.writeFileSync(sheetPath, JSON.stringify(targetObj));
    console.log("替换图集数据写入成功！");
 }

 //替换分组
 function replaceGroups(){
    // 读取1
    var data=fs.readFileSync(sourcePath);
    var sourceObj=JSON.parse(data.toString());
    // 读取2
    var data=fs.readFileSync(groupPath);
    var targetObj=JSON.parse(data.toString());
    targetObj.groups=sourceObj.groups;
    fs.writeFileSync(groupPath, JSON.stringify(targetObj));
    console.log("替换分组数据写入成功！");
 }


 //替换图集md5名字
 function copySheetNames(sheetpngsstr){
     //替换图集md5名字
    var files=fs.readdirSync(sheetpngsstr);
    var pngsCache={};
    files.forEach( function (file){
        if(file.indexOf(".png")!=-1)
        {
            pngsCache[file.substring(0,file.lastIndexOf("_"))]=file;
        }
    });
    var files2=fs.readdirSync(sheetpngsstr);
    var jsonCache={};
    files2.forEach( function (file){
        if(file.indexOf(".json")!=-1)
        {
            replaceFile(sheetpngsstr+"/"+file,pngsCache[file.substring(0,file.lastIndexOf("_"))]); //替换json中png没有对应Md5
        }
    });
 }


//替换文件名
 function replaceFile(path,newfile){
    var data=fs.readFileSync(path);
    var targetObj=JSON.parse(data.toString());
    targetObj.file=newfile;
    fs.writeFileSync(path, JSON.stringify(targetObj));
    console.log("md5数据写入成功！",newfile);
 }
  
//替换manifest
 function replaceManifest()
 {
      var data=fs.readFileSync(manifest).toString();
      data=data.replace('require("js/PathFinding.min.js")',"var pathf=require('js/PathFinding.min.js');pathf['DiagonalMovement']=window.PF.DiagonalMovement;pathf['Option']=window.PF.Option;window.PF=pathf;");
      data=data.replace('require("js/jszip.min.js")','window.JSZip = require("js/jszip.min.js")')
      fs.writeFileSync(manifest, data); 
       console.log("替换manifest成功！",manifest);
};
