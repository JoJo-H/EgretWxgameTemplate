/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin,RenamePlugin,ResSplitPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin} from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { CustomPlugin, ManifestEditPlugin,EditResConfigPlugin } from './myplugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

   
    buildConfig: (params) => {
        console.log('buildConfig:',params);
        const _version:string="1.0.01";
        const { target, command, projectName, version } = params;
        let outputDir = `../${projectName}_wxgame`;
        let outputRemoteDir = `../${projectName}_wxgame_remote/`+_version;
        if (command == 'build') { //构建压缩的
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin('commonjs2'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new ManifestPlugin({ output: 'manifest.js',verbose:true})
                ]
            }
        }
        else if (command == 'publish') { //发布
            return {
                outputDir,
                commands: [
                    //清理，用来重置清空文件夹
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    //根据参数选择不同的编译方式
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    //使用不同的策略来发布 EXML 文件
                    //commonjs2:将EXML合并为一个含有解析方法default.thm.js和皮肤定义的文件gameEui.json，且皮肤抽离为一份配置
                    new ExmlPlugin('commonjs2'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }
                    ]),
                     //hash重命名房子文件缓存
                    new RenamePlugin({verbose:true,hash:"crc32",
                        matchers:[{from:"resource/**/**",to:"[path][name]_[hash].[ext]"}]}),

                    //图片迁移到远程文件夹（通过这个方式来减少包体积）
                    //预加载资源放在包体内,可以命名成jpg
                    new ResSplitPlugin({verbose:true,
                        matchers:[{from:"resource/**/**.png",to:outputRemoteDir},
                        {from:"resource/assets/audio/**.mp3",to:outputRemoteDir},
                        //配置打成zip放包体中
                        // {from:"resource/config/**.json",to:outputRemoteDir},
                        {from:"resource/assets/**.json",to:outputRemoteDir},
                        {from:"resource/assets/**/**.json",to:outputRemoteDir}
                        ]}),
                    //单独生成default.res.json
                    new EmitResConfigFilePlugin({
                        output:"resource/default.res.json",
                        typeSelector:config.typeSelector,
                        nameSelector:p=>path.basename(p).replace(/\./gi,"_"),
                        groupSelector:p=>null
                    }),
                    new EditResConfigPlugin(),
                    //生成 manifest 文件，这个文件会被用于记录 JavaScript 文件的版本号。
                    new ManifestPlugin({ output: 'manifest.js',verbose:true}),
                    new ManifestEditPlugin()
                    // new TextureMergerPlugin()
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
