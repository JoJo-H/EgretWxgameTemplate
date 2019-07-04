/**
 * 搜索出exeml的中文生成csv
 * 在线编辑：https://www.bejson.com/jsoneditoronline/
 */

var fs = require('fs');
var path = require('path');

var targetPath=["./resource/skin"];
var chinaJson = "./resource/config/chineseCsv.json";
var reg =  new RegExp("\".{0,1}([\u4e00-\u9fa5]+)(.*?)\"","g");
//过略文件名
var passList = ["CheatSkin.exml"];
var loadList = [];
var csv = {};
readDirSync(targetPath[0]);
load();
function load(){
	if(loadList.length){
		var mcJson = loadList.shift();
		var targetJson = fs.readFileSync(mcJson,'utf8');
		var result = targetJson.match(reg);
		if(result && result.length > 0){
			for(var element of result) {
				element = element.toString().replace(/^\"|\"$/g,'');
				element = element.toString().replace(/[\'\"\\\/\b\f\n\r\t]/g, ''); 
				csv[element] = "";
			}
		};
		load();
	}
	else{
		fs.unlink(chinaJson);
		fs.writeFile(chinaJson, JSON.stringify(csv), {flag: 'a'}, function (err) {
			if(err) {
				console.error(err);
			} else {
				console.log('转化成功:'+chinaJson);
			}
		});
	}
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

function doPass(str){
	return passList.indexOf(str) == -1?true:false;
}