/**
 * 示例自定义插件，您可以查阅 http://developer.egret.com/cn/2d/projectConfig/cmdExtensionPluginin/ 
 * 了解如何开发一个自定义插件
 */
import * as fs from 'fs';
import * as path from 'path';
export class CustomPlugin implements plugins.Command {

    constructor() {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {

    }
}

/** 合并配置文件 */
export class MergeJsonPlugin implements plugins.Command {

    private obj = {};
    constructor() {
    }

    async onFile(file: plugins.File) {
        //json文件参与合并 -- 只有resource/config/文件夹中的文件参与合并
        if (file.extname == '.json' && file.origin.indexOf('resource/config/') == 0) {
            let url = file.origin.replace("resource/", "");
            let content = file.contents.toString();
            this.obj[url] = JSON.parse(content);
        }
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        commandContext.createFile('resource/total.json', new Buffer(JSON.stringify(this.obj)));
    }
}
// RES.processor.map("json", new MergeJsonProcessor());
// class MergeJsonProcessor implements RES.processor.Processor {
//     private totalContent : any;
//     async onLoadStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
//         console.log('load json',resource.url);
//         if(resource.url.indexOf('config/') == -1){
//             return host.load(resource,RES.processor.JsonProcessor);
//         }else {
//             if(!this.totalContent){
//                 const name = 'total_json';
//                 if(!RES.hasRes(name)){
//                     const url = 'total_json';
//                     const type = 'json';
//                     const root = RES.config.config.resourceRoot;
//                     const resource = {name,url,type,root};
//                     RES.$addResourceData(resource);
//                     this.totalContent = await RES.getResAsync(name);
//                 }else {
//                     this.totalContent = await RES.getResAsync(name);
//                 }
//             }
//         }
//         return this.totalContent[resource.url];
//     }

//     onRemoveStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
//         return Promise.resolve();
//     }
// }

export class ManifestEditPlugin implements plugins.Command {
    constructor() {

    }
    async onFile(file: plugins.File) {

        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        //只能在shell脚本中执行，因为还没生成manifest.js
        //所以没有用
        const manifest = path.join(commandContext.outputDir, "manifest.js");
        if(!fs.existsSync(manifest)) {
            console.log(`${manifest}不存在`);
            return;
        }
        let content = fs.readFileSync(manifest, { encoding: "utf8" });
        console.log('内容改变前：',content)
        content = content.replace('require("js/PathFinding.min.js")', "var pathf=require('js/PathFinding.min.js');pathf['DiagonalMovement']=window.PF.DiagonalMovement;pathf['Option']=window.PF.Option;window.PF=pathf;");
        content = content.replace('require("js/jszip.min.js")', 'window.JSZip = require("js/jszip.min.js")')
        console.log('内容改变后：',content)
        fs.writeFileSync(manifest, content);
        console.log("替换manifest成功！", manifest);
    }
}

export class EditResConfigPlugin implements plugins.Command {
    constructor() {
        
    }
    async onFile(file: plugins.File) {
        
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        //只能在shell脚本中执行，因为还没生成resource/default.res.json
        //所以没有用
        let wxResCfgPath = path.join(commandContext.outputDir,'resource/default.res.json');
        if(!fs.existsSync(wxResCfgPath)) {
            console.log(`${wxResCfgPath}不存在`);
            return;
        }
        let localResCfgPath = path.join(commandContext.projectRoot,'resource/default.res.json');
        let localResJson = JSON.parse(fs.readFileSync(localResCfgPath, { encoding: "utf8" }));
        
        let wxResJson = JSON.parse(fs.readFileSync(wxResCfgPath, { encoding: "utf8" }));
        wxResJson.groups = localResJson.groups;
        fs.writeFileSync(wxResCfgPath, JSON.stringify(wxResJson));
    }
}