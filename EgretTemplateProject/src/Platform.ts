/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 * 获取本次分享的群信息：wx.getShareInfo
 * 游戏数据托管在微信后台 wx.setUserCloudStorage()
 * 主动转发 wx.shareAppMessage
 */
declare interface IWX {
    previewImage(option): Promise<any>;
    getSystemInfo(option): Promise<any>;
    getNetworkType(option): Promise<any>;
    getLaunchOptionsSync(): any;
}

class WX implements IWX {
    async previewImage(option){};
    async getSystemInfo(option){};
    async getNetworkType(option){};
    getLaunchOptionsSync(){};
}
declare interface Platform {
    appId:string;
    getUserInfo(): Promise<any>;
    login(): Promise<any>;
    sendOpenData(data);
    getShareInfo(): Promise<any>;
    setUserCloudStorage(data): Promise<any>;
    shareAppMessage(shareInfo): Promise<any>;
    checkviserion(): Promise<any>;
    wxGC();
    wxCatchError(callback);
    report(type, reportData, objs);
    playerBgMusic(url);
    playerSound(url);
    pauseBgMusic();
    reloadPage();
    resumeBgMusic();
    updateShareMenu(data);
    createRewardedVideoAd(adUnitId);
    createGameClubButton():any;
    getLaunchOptionsSync(): any;
    getSessionInfo():any;
    getSystemInfoSync():any;
    requestMidasPayment(num,areaId):Promise<any>;
    navigateToMiniProgram(appId,path):Promise<any>;
    name;
}

class DebugPlatform implements Platform {
    async getUserInfo() {
        return { nickName: RequestCacheData.instance.getCache().name,gpid:GameHttp.gpId}
    }
    getSessionInfo(){}
    reloadPage(){
        window.location.href = window.location.href;
    }
    async login() { }
    async sendOpenData(data) { }
    async getShareInfo() { }
    async setUserCloudStorage(data) { }
    async shareAppMessage(shareInfo) { }
    async checkviserion() { }
    async updateShareMenu(data) { }
    async createGameClubButton() { }
    async createRewardedVideoAd(adUnitId){}
    async requestMidasPayment(num,areaId){}
    async navigateToMiniProgram(appId,path){}
    wxGC() { }
    getSystemInfoSync(){}
    wxCatchError(callback){};
    report(type, reportData, objs){}
    public appId:string;
    private _soundBg: any;
    private _changeBg:egret.SoundChannel;
    private _bgurl:any;
    private _soundEf: any;
    private _changeEf:egret.SoundChannel;
    //播放背景音乐
    playerBgMusic(url) {
        this._bgurl=url;
        if(is.ios())
        {
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.playerBgMusic2,this);
        }
        else
        {
            this.playerBgMusic2();
        }
    }

    private playerBgMusic2():void {
        if(this._changeBg){ //如果已经有背景音乐在播，那么要先停止
            this._changeBg.stop();
        }
        //close掉会报错
        // if(this._soundBg)
        // {
        //     this._soundBg.close();
        // }
        if(is.ios())
        {
          egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.playerBgMusic2,this);
        }
        this._soundBg= RES.getRes(this._bgurl);
        if(this._soundBg)
        {
            this._changeBg=this._soundBg.play();
        }
    }

     //停止背景音乐
    pauseBgMusic():void{
      if(this._changeBg)
      {
          this._changeBg.stop();
      }
    }

    //恢复背景音乐
    resumeBgMusic():void{
      if(this._soundBg)
      {
          this._changeBg=this._soundBg.play();
      }
    }
    
    //播放音效
    playerSound(url) {
        var self = this;
        //创建 Sound 对象
        if (!this._soundEf) {
            var onLoadComplete = function (event: egret.Event): void {
                //播放音乐
                self._soundEf.play(0, 1);
            }
            this._soundEf = new egret.Sound();
            this._soundEf.type=egret.Sound.EFFECT;
            //添加加载完成侦听
            this._soundEf.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
        }
        //开始加载
        this._soundEf.load(url);
    }

    //平台类型
    name() { return "window" };

    getLaunchOptionsSync():any {
        let query = {};
        if (window.location) {
            let search = location.search;
            if (search == "") {
                return null;
            }
            search = search.slice(1);
            let searchArr = search.split("&");
            let length = searchArr.length;
            for (let i = 0; i < length; i++) {
                let str = searchArr[i];
                let arr = str.split("=");
                query[arr[0]] = arr[1];
            }
        }
        return {query};
    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}



declare let platform: Platform;
declare let wx:WX;

declare interface Window {
    platform: Platform
    wx:WX
}

