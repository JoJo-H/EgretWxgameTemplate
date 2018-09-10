/**
 * 序列帧图集转化成MoiveClip
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var targetPath="./resource/assets/animation/patient";
var templeJson = JSON.parse(fs.readFileSync('./tool/mc_temp.json','utf8'));
var tempReg = /31024/g;

var root = path.join(targetPath)

readDirSync(root)
function readDirSync(path){
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
		var info = fs.statSync(path+"/"+ele)	
		if(info.isDirectory()){
			var mcJson = path+"/"+ele+"/mc_"+ele+".json";
			fs.access(mcJson,function(err){
				if(!err){
					var targetJson = JSON.parse(fs.readFileSync(mcJson,'utf8'));
					if(!targetJson.hasOwnProperty("mc")){
						//console.log("需要修改："+mcJson);
						var tempMarkJson = JSON.parse(JSON.stringify(templeJson).replace(tempReg, ele));
						tempMarkJson["res"] = targetJson["frames"];
						var arr = tempMarkJson["mc"]["run"]["frames"];
						for(var element of arr){
							if(tempMarkJson["res"][element.res] && tempMarkJson["res"][element.res].hasOwnProperty("offX")){
								element.x = tempMarkJson["res"][element.res]["offX"];
								element.y = tempMarkJson["res"][element.res]["offY"];
							}
							else{
								// console.log(mcJson,"格式不对");
							}
						}
						fs.unlink(mcJson);
						fs.writeFile(mcJson, JSON.stringify(tempMarkJson), {flag: 'a'}, function (err) {
							if(err) {
								console.error(err);
							} else {
								console.log('转化成功:'+"mc_"+ele+".json");
							}
						});
					}
					else{
						//console.log("不需要修改："+mcJson);
					}
					return;
				}
			})
			//console.log("dir: "+ele)
			readDirSync(path+"/"+ele);
		}
	})
}

