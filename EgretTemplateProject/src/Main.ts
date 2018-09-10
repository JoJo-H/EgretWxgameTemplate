//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    

    private inLoad: boolean = false;
    //加载错误统计
    private countGroupError: number = 0;
    private _activeTime: number;

    private preloadView: PreLoadView;
    protected createChildren(): void {
        super.createChildren();
        this.preloadView = new PreLoadView();
        egret.TextField.default_fontFamily = "Microsoft YaHei";
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            window.platform.pauseBgMusic();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            window.platform.resumeBgMusic();
        }
        GameVo.pageQueue = platform.getLaunchOptionsSync();

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onResourceLoadErr, this);

        let stage = egret.MainContext.instance.stage;
        //监听wx休眠事件
        if (PlatformUtil.isWxPlatform()) {
            window["wxOnshow"] = this.onActivate;
            window["wxOnHide"] = this.onDeactivate;
            window.platform.wxCatchError((msg, stack) => {
                Main.pushError(msg + "--" + stack);
            });
        }
        else {
            stage.addEventListener(egret.Event.ACTIVATE, this.onActivate, this);
            stage.addEventListener(egret.Event.DEACTIVATE, this.onDeactivate, this);
        }
        this.stage.addChild(this.preloadView);

        if(GameVo.needZip){
            RES.processor.map("json", new JSONProcessor());
        }
        if (PlatformUtil.isWxPlatform()) {
            let res = platform.getSystemInfoSync()
            console.log("微信系统信息：", res);
            GameVo.isIos = res.system.indexOf("iOS") == -1 ? false : true;
        } else {
            GameVo.isIos = is.ios();
        }
        this.runGame().catch(e => {
            console.log(e);
        });
    }

    private onActivate(): void {
        console.log("app 进入前台");
        let activeTime: number = new Date().getTime();
        let delta = activeTime - this._activeTime;
        //todo
        GameVo.IsActive = true;
        GameVo.httpEnable = true;
        // egret.ticker.resume();
        //分享回调
        GameShare.onShareBack();
    }

    private onDeactivate(): void {
        console.log("app 进入后台");
        this._activeTime = new Date().getTime();
        GameVo.IsActive = false;
        GameVo.httpEnable = false;
        // egret.ticker.pause();
    }

    /** 资源加载错误 */
    private onResourceLoadErr(event: RES.ResourceEvent): void {
        console.log(event.groupName, "event.groupName");
        if (++this.countGroupError < 3) {
            RES.loadGroup(event.groupName);
        } else {
            /// 弹出网络失去连接提示等
            this.inLoad = false;
            this.preloadView.updatetip("加载资源失败,请 <font size=24 color=0xffa800 stroke=1 strokeColor=0xffa800>点我刷新</font>", this.loadscene.bind(this));
        }
    }

    /** 资源加载完毕 */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {

    }


    private async runGame() {
        console.log(`当前版本信息 --  assetVer:${GameVo.assetVersion}, resourceVer:${GameVo.resourceVersion} configVer:${GameVo.configVersion}`);
        egret.ImageLoader.crossOrigin = 'anonymous';
        //设置语言版本
        ConfigCenter.LANGUAGE_TYPE = LanguageType.zh;
        await RES.loadConfig("default.res.json", "resource/");
        if(GameVo.needZip){
            await this.loadZip();
        }
        await this.loadscene();
    }

    /** 
     * 加载本地配置文件 -- zip压缩配置
     * 1、本地更新最新配置表：执行命令node tool/downConfig.js 0或1 更新配置后,需重新打包一份config.zip
     * 2、更改版本号：GameVo.resourceVersion需要与config.wxgame.ts的远程地址目录一致
     * 2、发布：sh publish_web.sh 1 1 或 sh publish_wx.sh 0 1.0.5发布；第二个参数版本号需要与第二点一致
     * 3、操作wx项目及远程资源目录：在发布好的微信项目，把config文件夹删掉，然后把config.zip解压得到没有md5的配置目录(包体不需要md5)，
     * 再把gameEUI.json及远程res.json拖进config文件夹去，放在包体减少请求量及保证不会加载到缓的res配置，
     * 最后赋值config_md5.zip的文件名（包含md5）,然后删除掉，打包config生成zip，重命名为config_md5.zip，然后把config目录删掉
     */
    async loadZip(): Promise<void> {
        return new Promise<void>((resolve) => {
            let files = RES.config.config.fileSystem;
            let zipinfo = files["fsData"]["config_zip"];
            RES.getResByUrl(zipinfo.root + zipinfo.url, (data) => {
                ConfigCenter.instance.zipData = new JSZip(data);
                resolve();
            }, this, RES.ResourceItem.TYPE_BIN);
        });
    }

    private async loadscene(): Promise<any> {
        //h5版本和本地调试不加载远程配置
        if (PlatformUtil.isWxPlatform()) {
            await RES.loadConfig("default.res.json?v=" + GameVo.assetVersion, GameVo.RES_PATH);
        }
        var loadResult = await this.loadResource();
        this.inLoad = false;
        console.log("完成游戏资源配置加载", new Date().getTime());
        //加载资源失败，或者有版本更新需要重启
        if (loadResult != 0) {
            if (loadResult == 1)
                this.preloadView.updatetip("客户端更新完毕，请重启");
            if (loadResult == 2)
                this.preloadView.updatetip("加载资源异常,请刷新");
            return;
        }
        this.checkLogin();
    }

    private async loadResource(): Promise<any> {
        this.preloadView.updatetip("正在检查版本更新");
        var resultObj = { result: -1, data: false };
        //微信环境才使用版本更新检测
        if (PlatformUtil.isWxPlatform()) {
            resultObj = await platform.checkviserion();
        }
        if (resultObj.result == 0 && resultObj.data) {
            let i = 0;
            setInterval(() => {
                i++;
                var str = "";
                if (i == 1) {
                    str = ".";
                }
                else if (i == 2) {
                    str = "..";
                }
                else {
                    str = "...";
                    i = 0;
                }
                this.preloadView.updatetip("正在更新新版本" + str);
            }, 500);
            return 1;
        }
        else {
            try {
                this.inLoad = true;
                this.preloadView.updatetip("准备加载资源");
                await this.loadTheme();
                this.preloadView.setPreTip("解析配置文件:");
                await RES.loadGroup("config", 0, this.preloadView);
                this.preloadView.setPreTip("加载资源文件:");
                await RES.loadGroup("preload", 0, this.preloadView);//预加载资源
                return 0;
            } catch (error) {
                console.error(error);
            }
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private async checkLogin():Promise<any> {
        core.run(this.stage);
        this.preloadView.updatetip("正在获取登录信息");
        let res_login = await platform.login();
        if (res_login && res_login.hasOwnProperty("nickName")) {//微信环境
            GameVo.wxInfo = res_login;
            console.log(`获取登录信息成功：${GameVo.wxInfo}`);
            this.preloadView.updatetip("开始登录");
            this.login();
        }
        else {
            GameVo.isDedeg = egret.getOption('isDebug') ? true : false;
            //地址栏传过来了账号信息 
            if (egret.getOption('user_id')) 
            {
                LoginSelect.otherData.loginId = egret.getOption('user_id') + "m";
                LoginSelect.otherData.nickName = egret.getOption('nick_name');
                LoginSelect.otherData.sex = egret.getOption("sex");
                LoginSelect.otherData.avatarUrl = egret.getOption("avatar_url");
                LoginSelect.testLoginData = LoginSelect.otherData;
                this.login();
            }
            else {
                core.UI.runScene(LoginSelect, this.login.bind(this), egret.getOption('isDebug'));
            }
        }
    }

    private login(): void {
        new NetLogin(this.createGameScene.bind(this));
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        if (this.preloadView.parent) {
            this.preloadView.parent.removeChild(this.preloadView);
        }
        core.singleton(WxRank).loadAsset();
        core.singleton(WxRank).loadUserData();
        core.singleton(SecondRequestHandler).afterLoginHanler();
        // core.UI.addCommon(CommonPanel);
        core.UI.runScene(MainScene);

    }

    //向服务器上报错误
    public static pushError(msg: string): void {
        msg += " t=" + new Date().getTime();
        console.log("catch error:", msg);
        let bytes: egret.ByteArray = new egret.ByteArray();
        bytes.writeUTFBytes(msg);
        GameHttp.request(PUser.pushError(egret.Base64Util.encode(bytes.buffer)));
    }
}

class JSONProcessor implements RES.processor.Processor {

    async onLoadStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
        //把主题和配置压缩在一起
        let url = resource.url;
        if (url.indexOf("default.res.json?v=") == -1 && url.indexOf("config/") == -1 && url.indexOf("gameEui") == -1) {
            return host.load(resource, RES.processor.JsonProcessor)
        }
        else {
            if (url.indexOf("gameEui") != -1) {
                url = "config/" + url;
            }//远程配置res
            else if (url.indexOf('default.res.json?v=') != -1) {
                url = "config/default.res.json";
            }
            else {
                url = "config/" + resource.name.replace("_json", ".json");
            }
            let zipdata = ConfigCenter.instance.zipData;
            let zipfile = zipdata.file(url);
            let content = zipfile.asText();
            var json = JSON.parse(content.toString());
            return json;
        }
    }

    onRemoveStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
        return Promise.resolve();
    }
}