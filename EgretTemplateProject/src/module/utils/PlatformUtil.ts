class PlatformUtil {
    /** 微信 */
    static WX_PLATFORM:string = "wxgame";
    /** 是哪个平台 */
    static isNamePlatform(name:string):boolean {
        let platformName = window.platform.name;
        return platformName == name;
    }

    static isWxPlatform():boolean {
        return window.platform.name == PlatformUtil.WX_PLATFORM;
    }

    /** 获取平台 */
    static getPlatform() {
        return window.platform;
    }

    /** 是否支持分享 */
    static isSupportShare(tip:boolean=false):boolean {
        let support:boolean = false;
        if(!DEBUG) {
            let name = window.platform.name;
            if(name == this.WX_PLATFORM) {
                support = true;
            }
        }
        if(tip && !support) {
            let tipStr = ConfigCenter.getLanguageName('share_is_unSupport');
            core.UI.tooltip(tipStr);
        }
        return support;
    }

    /** 是否支持广告 */
    static isSupportAdvertisement(tip:boolean=false):boolean {
        let support:boolean = false;
        if(!DEBUG) {
            let name = window.platform.name;
            if(name == this.WX_PLATFORM) {
                support = true;
            }
        } 
        if(tip && !support) {
            let tipStr = ConfigCenter.getLanguageName('vedio_is_unSupport');
            core.UI.tooltip(tipStr);
        }
        return support;
    }
    
    /** 是否支持外部排行榜 */
    static isSupportRank():boolean {
        if(!DEBUG) {
            let name = window.platform.name;
            if(name == this.WX_PLATFORM) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    /** 向平台发关排行榜数据 */
    static pushRankData():void {
        if(!this.isSupportRank()) return;
        let platform = this.getPlatform();
        if(platform.name == this.WX_PLATFORM) {
            core.singleton(WxRank).pushRankData();
        }
    }
}