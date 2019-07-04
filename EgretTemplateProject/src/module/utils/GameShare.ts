
interface IShareInfo {
    shareType ?: number;    //分享类型 ShareRewardType
    patientId ?: number;    //新病种及投放病人
    level ?: number;      //建筑等级、医院等级
    queryData ?: any;       //参数数据
    
    clipScreen ?: boolean;       //是否截屏
    x ?: number;
    y ?: number;
    width ?: number;
    height ?: number;
}

class GameShare {

    static shareBackArg:any[];

    constructor() {
    }

    /** 获取分享参数 */
    static getQueryStr(queryData:any=null):string {
        let queryStr = `gpId=${RequestCacheData.instance.getCacheByKey("gpId")}&p=${GameVo.getP()}`;
        if(queryData){
            for(let key in queryData){
                queryStr += `&${key}=${queryData[key]}`;
            }
        }
        return queryStr;
    }

    /** 获取分享信息 */
    static getShareInfo(shareInfo : IShareInfo = {}):any {
        if(!shareInfo.hasOwnProperty('shareType')){
            shareInfo.shareType = ShareRewardType.Random;
        }
        let result : any = {};
        let title : string = "";
        let imageUrl : string = "";
        let shareTitleRandom : string[] = JSON.parse(ConfigUtil.getGameConfigValue(`shareTitleRandom_${shareInfo.shareType}`));
        let len : number = shareTitleRandom ? shareTitleRandom.length : 0;
        switch (shareInfo.shareType) {
            case ShareRewardType.NewPatient:    //新病种出现分享
                let cfg = ConfigUtil.getPatientConfigById(shareInfo.patientId);
                if(cfg){
                    len = cfg.talkRand.length;
                    title = ConfigCenter.getLanguageName(`patient_talk_${cfg.talkRand[Math.floor(Math.random()*len)]}`);
                    imageUrl = `${NetCode.RES_ROOT_PATH}share/patient/${shareInfo.patientId}.jpg?v=${new Date().getTime()}`;
                }
                break;
            case ShareRewardType.PutPatient:    //投放病人分享
            case ShareRewardType.PutCattle:     //投放黄牛分享 黄牛1200
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                imageUrl = `${NetCode.RES_ROOT_PATH}share/put/${shareInfo.patientId}.jpg?v=${new Date().getTime()}`;
                break;
            case ShareRewardType.AppointSuccess:    //约会成功分享
            case ShareRewardType.AppointFail:       //约会失败分享
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                break;
            case ShareRewardType.BuildingUp:        //建筑升阶分享
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                imageUrl = `${NetCode.RES_ROOT_PATH}share/building/building_${shareInfo.level}.jpg?v=${new Date().getTime()}`;
                break;
            case ShareRewardType.HospitalUp:        //医院升级分享
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                imageUrl = `${NetCode.RES_ROOT_PATH}share/hospital/hospital_${shareInfo.level}.jpg?v=${new Date().getTime()}`;
                break;
            case ShareRewardType.Ransom:            //赎金分享
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                imageUrl = `${NetCode.RES_ROOT_PATH}share/other/ransom.jpg?v=${new Date().getTime()}`;
                break;
            default :   //默认分享
                len = RequestCacheData.instance.getCacheByKey('maxRandomShareCount');
                len = len ? len : 0;
                let random = Math.floor(Math.random()*len);
                imageUrl = `${NetCode.RES_ROOT_PATH}share/random/shareImg_${random}.jpg?v=${new Date().getTime()}`;
                let key = `shareTitleRandom_0_${random}`;
                shareTitleRandom = JSON.parse(ConfigUtil.getGameConfigValue(key));
                len = shareTitleRandom.length;
                title = ConfigCenter.getLanguageName(shareTitleRandom[Math.floor(Math.random()*len)]);
                break;
        }

        result['title'] = title;
        result['imageUrl'] = imageUrl;
        result['queryStr'] = GameShare.getQueryStr( shareInfo.queryData );
        result['clipScreen'] = shareInfo.clipScreen ? true : false;
        if(result['clipScreen']){
            result['x'] = shareInfo.x + core.UI.instance.x;
            result['y'] = shareInfo.y + core.UI.instance.y;
            result['stageW'] = egret.MainContext.instance.stage.stageWidth;
            result['stageH'] = egret.MainContext.instance.stage.stageHeight;
            result['width'] = shareInfo.hasOwnProperty("width") ? shareInfo.width : 500;
            result['height'] = shareInfo.hasOwnProperty("height") ? shareInfo.height : 400;
        }
        // console.log('分享信息：',result);
        return result;
    }

    /** 分享游戏 */
    static onShareGame(type = 0,cmdData = null,backFun=null,shareInfo : IShareInfo = {}) {
        if (GameShare.getAdTodayLeftTime(type) < GameShare.getAdTodayLeftTime(type, true)) {
            if (window.platform.name == "wxgame") {
                console.log('wxgame share');
                GameShare.shareBackArg = [type,cmdData,backFun];
                platform.shareAppMessage(GameShare.getShareInfo(shareInfo)).then((rpData) => {
                    GameShare.shareAdvSend(type,cmdData,backFun);
                });
            }
            else{
                GameShare.shareAdvSend(type,cmdData,backFun);
            }
        } else {
            console.log('今日分享次数已用完，没有奖励');
            platform.shareAppMessage(GameShare.getShareInfo(shareInfo));
        }
    }

    /** 分享游戏 -- 无限制分享 */
    static onShareGameSimple(shareInfo : IShareInfo = {}):void {
        GameShare.onShareGame(0,null,null,shareInfo);
    }

    /**
     * 手动调用分享回调方法
     */
    static onShareBack():void
    {
        if(GameShare.shareBackArg){
            console.log("分享按钮：",GameShare.shareBackArg);
            GameShare.shareAdvSend.apply(GameShare,GameShare.shareBackArg);
            GameShare.shareBackArg = null;
        }
    }

    private static shareAdvSend(type, cmdData,backFun=null):void
    {
        console.log("分享游戏回调 --",type,cmdData,backFun);
        if(type){
            cmdData.command = type;
            GameHttp.request(PUser.gameShare()).then((data)=>{
                console.log("分享广告消息响应 --",data);
                RequestCacheData.instance.upateAdInfo(data);
                if (backFun) {
                    backFun(data);
                }
            });
        }else{
            if (backFun) {
                backFun();
            }
        }
        console.log("开始加载场景资源");
    }

    /**
       * 播放广告
       * type netcode 中定义
       */
      static inAdv:boolean = false;
      static createRewardedVideoAd(type=0,cmdData=null,backFun:Function=null,failBack:Function=null){
          if(this.isLookEnough()) {
            core.UI.tooltip("今日广告次数已用完,明天再来吧");
            return;
          }
          if (GameShare.getAdTodayLeftTime(type) < GameShare.getAdTodayLeftTime(type, true) ) {
              if(GameShare.inAdv) {
                  let tipStr = ConfigCenter.getLanguageName('radio_wait_to_load');
                  core.UI.tooltip(tipStr);
                  return;
              }
              let adUnitId = 'adunit-8c683833fc42bf03';
              if (PlatformUtil.isSupportAdvertisement()) {
                  GameShare.inAdv = true;
                  platform.createRewardedVideoAd(adUnitId).then((bob) => {
                      GameShare.inAdv = false;
                      if (bob) {
                          console.log("激励广告播放完成");
                          GameShare.shareAdvSend(type,cmdData,backFun);
                      } else {
                          console.log("中途推出广告");
                          if(failBack){
                              failBack();
                          }
                      }
                  });
              } else{
                  GameShare.shareAdvSend(type,cmdData,backFun);
              }
          } else {
              core.UI.tooltip("今日广告次数已用完,明天再来吧");
          }
      }

     /**
       * 获取已播放广告或分享次数
       * type netcode 中定义
       * isTotal true 每日总次数 false 已用次数
       */
    static getAdTodayLeftTime(type:number,isTotal:boolean = false):number{
        if(!type) type = 0;
        let keyObj = {
            "24054":"lookJumpGameAdCount",
            "24055":"lookAddMoneyAdCount",
            "24056":"lookSignInAdCount",
            "24071":"addCoinAfterAd",
            "24057":"lookPatientCountAdCount",
            "23001":"lookRefreshRecruitAdCount",
            "24036":"sharePayRansomCount"
        }
        let totalKeyObj = {
            "24054":"maxLookJumpGameAdCount",
            "24055":"maxLookAddMoneyAdCount",
            "24056":"maxLookSignInAdCount",
            "24071":"maxLookAddCoinAdCount",
            "24057":"maxLookPatientCountAdCount",
            "23001":"maxLookRefreshRecruitAdCount",
            "24036":"maxSharePayRansomCount"
        }
        let key:string;
        if(isTotal){
            if(type){
                 key = totalKeyObj[type.toString()];
                 let value = ConfigUtil.getGameConfigValue(key);
                return value ? parseInt(value) : 1;
            }
            return 1;
        }else{
            if(type){
                 key = keyObj[type.toString()];
                 let value = RequestCacheData.instance.getCacheByKey('adInfo')[key];
                return value ? value : 0;
            }
            else{
                return 0;
            }
        }      
    } 

    /** 已看的总广告次数 */
    static isLookEnough():boolean {
        let keyArr = ["lookJumpGameAdCount", "lookJumpGameRandomRewardAdCount", "lookAddMoneyAdCount", "lookAddCoinAdCount", "lookSignInAdCount", "lookPatientCountAdCount"];
        let totalTime:number = 0;
        keyArr.forEach(element => {
           totalTime += RequestCacheData.instance.getCacheByKey('adInfo')[element] || 0;
        });
        let enoughTimes = ConfigUtil.getGameConfigValue("maxAllAdCount") || "8";
        enoughTimes = parseInt(enoughTimes);
        return totalTime >= enoughTimes
    }
    /** 广告有次数可以看 */
    static isVedioCanSee(type:number):boolean {
        let totalTimes = GameShare.getAdTodayLeftTime(type, true);
        let seeTimes = GameShare.getAdTodayLeftTime(type);
        return seeTimes < totalTimes;
    }
}