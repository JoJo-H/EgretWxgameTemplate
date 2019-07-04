var fs = require('fs');
var path = require('path');

var sourcePath="./resource/default.res.json";

var _targetPath=process.argv[2];
console.log("modify path:",_targetPath);
var groupPath=_targetPath+"/resource/default.res.json";
var sheetpngs=_targetPath+"/resource/assets";
var sheetpngs1=_targetPath+"/resource/assets/preload";
var sheetpngs2=_targetPath+"/resource/assets/region";
 //替换分组
 replaceGroups();
 console.log("-------------------------");
  //替换图集节点
 replaceSheets();
console.log("-------------------------");
 //替换图集md5名字
 copySheetNames(sheetpngs);
 copySheetNames(sheetpngs1);
 copySheetNames(sheetpngs2);
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
    var data2=fs.readFileSync(groupPath);
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
    fs.writeFileSync(groupPath, JSON.stringify(targetObj));
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

