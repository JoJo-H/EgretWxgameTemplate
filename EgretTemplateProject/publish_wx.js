'use strict';
const process_shell = require('child_process');
const fs = require("fs");
const os = require('os');
var rmStr = "rm -rf ../../pocket_hospital_git/project_wxgame/js/ & rm -rf ../../pocket_hospital_git/project_wxgame/resource/ & rm -rf ../../pocket_hospital_git/project_wxgame_remote/resource/";
if(os.type().indexOf("Windows") != -1){
    rmStr = "rmdir /s/q ..\\..\\pocket_hospital_git\\project_wxgame\\js\\ && rmdir /s/q ..\\..\\pocket_hospital_git\\project_wxgame\\resource\\ && rmdir /s/q ..\\..\\pocket_hospital_git\\project_wxgame_remote\\resource\\ ";
}
start();
function start(){
    execS(rmStr,()=>{
      console.log("-----------------RM DIR END--------------");
      execS("egret publish --target wxgame",()=>{
        console.log("--------------PUBLISH END----------------");
        execS("node ./tool/publish/copy_defaultresjson_wx.js",()=>{
            console.log("----------OVER!!!------------");
        })
      })
    })
}


function execS(cmd,backFun)
{
    process_shell.exec(cmd,{maxBuffer:10000*1024,cwd:'./'}, (error, stdout)=> {
      if (error) {
         console.log('exec error:'+error);
        return;
      }
      backFun();
    });
}
