class WxRank {
    static open_score:string = "score";
    static open_likeCount:string = "likeCount";
    static open_donate:string = "donate";
    static open_honor:string = "honor";
    private _isDisplay:boolean = false;
    private _bitmap:egret.Bitmap;

    /** 向微信平台推数据 */
    pushRankData():void {
        let requestCacheData = RequestCacheData.instance;
        var score: number = core.singleton(UserData).getHospitalScore();
        let keyArr: Array<Object> = [
            { "key": "score", "value": score.toString() },
            {"key":"level", "value": `${5}`},
        ];
        let secondrequesthandler = core.singleton(SecondRequestHandler);
        if(secondrequesthandler.isCached(ExtendType.type_common)) {
            keyArr.push({ "key": "likeCount", "value": '55'})
        }
        if(secondrequesthandler.isCached(ExtendType.type_farmland)) {
            keyArr.push({"key":"donate", "value": `10`})
        }
        if(secondrequesthandler.isCached(ExtendType.type_international_rescue)) {
            keyArr.push({"key":"honor", "value": `${20}`})
        }
        platform.setUserCloudStorage(keyArr);
    }

    /** 加载数据 */
    loadUserData():void {
        if(!PlatformUtil.isNamePlatform(PlatformUtil.WX_PLATFORM)) return;
        let platform:any = window.platform;
        platform.openDataContext.postMessage({
            year: (new Date()).getFullYear(),
            command: "userData"
        });
    } 

    /** 加载开放域资 */
    loadAsset() {
        if(!PlatformUtil.isNamePlatform(PlatformUtil.WX_PLATFORM)) return;
        let platform:any = window.platform;
        if(platform.name != "wxgame") return;
        if(platform.openDataContext) {
            platform.openDataContext.postMessage({
                command:'loadRes'
            });
        }
    }

    showRank(type:string) {
        if(!PlatformUtil.isNamePlatform(PlatformUtil.WX_PLATFORM)) return;
        if(this._isDisplay) {
            this.closeRank();
        }
        let platform:any = window.platform;
        //主要示例代码开始
        //主域向子域发送自定义消息
        let text = ConfigCenter.getLanguageName('scoreboard');
        if(type == WxRank.open_likeCount) {
            text = ConfigCenter.getLanguageName('point_list');
        } else if(type == WxRank.open_donate) {
            text = ConfigCenter.getLanguageName('honor_list');
        }
        let stage = egret.MainContext.instance.stage;
        this._bitmap = platform.openDataContext.createDisplayObject(null,stage.stageWidth, stage.stageHeight);
        this._bitmap.touchEnabled = true;
        //主要示例代码结束            
        this._isDisplay = true;
        platform.openDataContext.postMessage({
            text: text,
            type: type,
            year: (new Date()).getFullYear(),
            command: "open"
        });
        return this._bitmap;
    }

    closeRank():void {
        if(!PlatformUtil.isNamePlatform(PlatformUtil.WX_PLATFORM)) return;
        if(!this._isDisplay) return;
        let platform:any = window.platform;
        platform.openDataContext.postMessage({
            year: (new Date()).getFullYear(),
            command: "close"
        });
        core.display.removeFromParent(this._bitmap);
        this._bitmap = null;
        this._isDisplay = false;
    }
}