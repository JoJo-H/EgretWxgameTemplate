'use strict';
const http = require('http');
const util = require('util');
const process_shell = require('child_process');
const fs = require("fs");
var server = new http.Server();
server.on('request', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if(this.currentState==true)
        {
            res.end('someone publish ing...');
            return;
        }
        res.write('start publish_dev ...');
        var startime=new Date().getTime();
        this.currentState=true;
        var self=this;
        process_shell.exec('svn up & sh publish_web.sh 1 2',{maxBuffer:10000*1024,cwd:'/home/projects/pocket_hospital_svn/project'}, (error, stdout)=> {
             if (error) {
                res.end('exec error:'+error);
                return;
            }
        //fs.appendFileSync('./log.log', '[' + new Date().toLocaleString() + ']' +'\r\n');
        var constime="<br>build const:"+(new Date().getTime()-startime)+"ms";
        res.end('<br>publish successed:'+new Date().toLocaleString()+constime); //http响应
        console.log('<br>publish successed:'+new Date().toLocaleString()); //nohup输出
        self.currentState=false;
    });
});
console.log("listen:10086");
server.listen(10086);
