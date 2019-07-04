var fs = require('fs');
var path = require('path');

var targetPath=["./resource/assets/animation/"];
//过略文件名
var passList = [];
var loadList = [];
var csv = {};

readDirSync(targetPath[0]);
// console.log(loadList);
load();
function load(){
	if(loadList.length){
		var mcJson = loadList.shift();
        var tempMarkJson = JSON.parse(fs.readFileSync(mcJson,'utf8'));
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
        fs.unlink(mcJson,()=>{
            fs.writeFile(mcJson, JSON.stringify(tempMarkJson), {flag: 'a'}, (err)=> {
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

function readDirSync(path){
	var pa = fs.readdirSync(path);
	pa.forEach((ele,index)=>{
		var info = fs.statSync(path+"/"+ele)
		if(info.isDirectory()){  
			readDirSync(path+"/"+ele);  
		}else{  
			if(ele.indexOf(".json") != -1){
				var mcJson = path+"/"+ele;
				loadList.push(mcJson);
			}
		}     
	})
}