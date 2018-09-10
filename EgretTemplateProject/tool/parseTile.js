var fs = require("fs");
var tileJsonPath = "../../tile/json/";
var files = fs.readdirSync(tileJsonPath);
let regionLine = {};
for(var k in files) {
	let file = files[k];
	console.log(file);
	if(file.indexOf("map") != -1) {
		let region_foum = file.split("map")[1];
		let region = parseInt(region_foum.split("_")[0]);
		let foum = parseInt(region_foum.split("_")[1]);
		let fileSteam = fs.readFileSync(tileJsonPath + file, 'utf8');
		let fileJson = JSON.parse(fileSteam);
		if(!regionLine[region]) regionLine[region] = {};
		if(!regionLine[region][foum]) regionLine[region][foum] = {};
		let typeList = [2,0,1,4];	
		let layers = fileJson["layers"];
		for(let j in layers) {
			let layer = layers[j];
			if(layer.name == "block") {
				let height = layer["height"];
				let width = layer["width"];
				regionLine[region][foum]["offsetx"] = layer["offsetx"];
				console.log("layer[offsetx]",layer["offsetx"]);
				regionLine[region][foum]["offsety"] = layer["offsety"];
				console.log("layer[offsety]",layer["offsety"]);
				regionLine[region][foum]["height"] = height;
				regionLine[region][foum]["width"] = width;
				let datas = layer["data"];
				let data = [];
				let len = datas.length;
				let dataItem = [];
				for(let i = 0; i < len; i++) {
					let index = datas[i];
					if(dataItem.length < width) {
						dataItem.push(typeList[index - 1]);
					} 
					if(dataItem.length >= width) {
						data.push(dataItem);
						dataItem = [];
					}
				}
				// console.log(JSON.stringify(data));
				regionLine[region][foum]["data"] = data;
			}			
		}
	}
}
fs.writeFileSync("../resource/config/regionLine.json", JSON.stringify(regionLine));
