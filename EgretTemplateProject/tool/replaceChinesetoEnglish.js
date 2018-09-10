/**
 * 搜索出exeml的中文生成csv
 * 在线编辑：https://www.bejson.com/jsoneditoronline/
 */

var fs = require('fs');
var path = require('path');

var targetPath=["./resource/skin"];
var chinaJson = "./resource/config/chineseCsv.json";
//过略文件名
var passList = ["CheatSkin.exml"];
var loadList = [];
var csv = {};

csv =  JSON.parse(fs.readFileSync(chinaJson,'utf8'));

readDirSync(targetPath[0]);
load();
function load(){
	if(loadList.length){
		var mcJson = loadList.shift();
		var targetJson = replaceExml(fs.readFileSync(mcJson,'utf8'));
		fs.unlink(mcJson,()=>{
			fs.writeFile(mcJson, targetJson, {flag: 'a'}, (err)=> {
				if(err) {
					console.error("aaaa",err);
				} else {
					load();
				}
			});
		});
	}
	else{
		console.log("替换完成");
	}
}

function doPass(str){
	return passList.indexOf(str) == -1?true:false;
}

function readDirSync(path){
	var pa = fs.readdirSync(path);
	pa.forEach((ele,index)=>{
		var info = fs.statSync(path+"/"+ele)
		if(info.isDirectory()){  
			readDirSync(path+"/"+ele);  
		}else{  
			if(ele.indexOf(".exml") != -1 && doPass(ele)){
				var mcJson = path+"/"+ele;
				loadList.push(mcJson);
			}
		}     
	})
}

function replaceExml(str){
	var regs;
	for(key in csv){
		key = key.replace("{","\{");
		key = key.replace("}","\}");
		regs = new RegExp("\""+key+"\"","g");
		str = str.replace(regs,'"'+csv[key]+'"');
	}
	return str;
}