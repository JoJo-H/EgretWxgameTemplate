var fs = require("fs");
var http = require("http");
var https = require("https");

var  publis_type=process.argv[2];
getConfigList();
function getConfigList() {
  var t = new Date().getTime();
   var downloadUrl ="";
   if(publis_type==1)
   {
        console.log("下载正式配置");
        downloadUrl='https://mqyy-s.hyinteractive.com/qa/socket_command_route.ac?data=eyJtYWMiOiI4YmIzMzAyOC1mYzBmLTQxMTktOTM3NC0xNjViYmIyOGIwOTkiLCJncElkIjoiIiwicCI6MSwidmVyc2lvbkNvZGUiOjEwOSwibGFuZyI6InpoIiwib3BJZCI6ImUyMjM2ZjA4LWNmMmYtNDQzMS05YWI2LTcyYTZjNmVkOTg3MiIsInJvb3QiOnsiY29tbWFuZCI6MjAwMDYsInRjIjoxNTMyNTA2ODI3fSwic2lnbiI6ImM2MzVlNWZmOWFiMjBhNjAxZjAyM2I2Y2UwNjY0MzU0In0=' + "&v=" + t;
   }
    else{
        console.log("下载最新配置");
        downloadUrl = 'http://bj.appcup.com:10039/s1/socket_command_route.ac?data=eyJtYWMiOiI4YmIzMzAyOC1mYzBmLTQxMTktOTM3NC0xNjViYmIyOGIwOTkiLCJncElkIjoiIiwicCI6MSwidmVyc2lvbkNvZGUiOjEwOSwibGFuZyI6InpoIiwib3BJZCI6ImUyMjM2ZjA4LWNmMmYtNDQzMS05YWI2LTcyYTZjNmVkOTg3MiIsInJvb3QiOnsiY29tbWFuZCI6MjAwMDYsInRjIjoxNTMyNTA2ODI3fSwic2lnbiI6ImM2MzVlNWZmOWFiMjBhNjAxZjAyM2I2Y2UwNjY0MzU0In0=' + "&v=" + t;
    } 
    getHttpContent(downloadUrl, (res1) => {
      var data = JSON.parse(res1);
      console.log("开始下载配置列表：", data);
      var url = data.downloadUrl;
      var list = data.configs;
      list.forEach(element => {
        if(element.configId.indexOf("_en") == -1){ //因为微信小游戏没有英文所以为了节省可以先去掉英文配置
          downloadFile(data.downloadUrl + element.configId + ".json?v="+element.configMD5, element.configId + ".json");
        }
      });
    }); 
}

/*
  * url 网络文件地址
  * filename 文件名
  * callback 回调函数
  */
function downloadFile(uri, filename) {
  getHttpContent(uri, (data) => {
    fs.writeFile("./resource/config/" + filename, data,{encoding:'UTF-8'}, (err) => {
      if (err) throw err;
      console.log(filename + "下载完毕");
    });
  });
}


function getHttpContent(url, callback) {
  let _hp;
  
  if(publis_type==1){_hp=https}else{_hp=http};
  _hp.get(url, function (req, res) {
    let uData = Buffer.allocUnsafe(0);
    req.on('data', function (chunk) {
      uData = Buffer.concat([uData, chunk], uData.length + chunk.length);
    });
    req.on('end', function () {
      callback(uData.toString());
    });
  });
}