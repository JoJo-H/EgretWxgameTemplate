class RequestCacheData implements IRequestCacheData {
    public wxInfo: any;
    private _cacheData: any = {};
    //页面参数数据
    public pageQuery: Object;
    private _serverTime: number; //单位毫秒
    private _clientTime: number; //单位毫秒 得到服务端时间戳时的客户端时间戳（用来判断时间间隔）

    private static _instance: RequestCacheData;
    static get instance(): RequestCacheData {
        if (!this._instance) {
            this._instance = new RequestCacheData();
        }
        return this._instance;
    }
    constructor() {
    }

    setCache(data: any): void {
        this.updataAnyAway(data);//任意接口都有可能发送的数据
        switch (data.command) {
            case NetCode.CLEAR_DAILY_INFO:
                this.updateDailyInfo(data);
                break;
            case NetCode.GET_USER_INFO_BY_ID:
                var gpInfo: Object = data.gpInfo;
                this._cacheData = gpInfo
                this.setUserCloudStorage();
                console.log("获得服务端数据时间:", new Date().getTime());
                break;
            case NetCode.FINISH_GUIDE_TASK:
                this._cacheData.guideStep = data.guideStep;
                this._cacheData.weakGuideSteps = data.weakGuideSteps ? data.weakGuideSteps : [];
                break;
        }
    }
    //毫秒
    get serverTime(): number {
        let nowTime = new Date().getTime();
        return (this._serverTime * 1000 + nowTime - this._clientTime);
    }
    private _severTimeId: number;  //服务器时间更新的定时id
    private _dailyDataTimeId: number; //每日一清数据请求的定时id
    //更新服务器数据
    set serverTime(num: number) {
        this._serverTime = num;
        this._clientTime = new Date().getTime();

        //设置明日的00:00:00点的时间戳，单位毫秒
        let date = new Date(this._serverTime * 1000);
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let endDate = new Date(year, month, day, 23, 59, 59);

        //定时更新服务器时间，每隔固定时间（比如30s）
        egret.clearInterval(this._severTimeId);
        this._severTimeId = egret.setInterval(this.requestSeverTime, this, 30000);

        //定时器，每日一清数据更新
        egret.clearInterval(this._dailyDataTimeId);
        this._dailyDataTimeId = egret.setInterval(this.requestDailyData, this, 5000);
    }
    private requestSeverTime(): void {
        if (GameHttp.gpId == "") //还没登录成功
        {
            return;
        }
        //同步服务器时间
        // console.log('同步服务器时间');
        GameHttp.request(PUser.syncTime(Math.floor(this.serverTime / 1000)));
        //同步微信共享数据
        this.setUserCloudStorage();
    }
    private requestDailyData(time): void {
        if (this.serverTime >= this._cacheData.nextResetTime * 1000) {
            // console.log('同步每日一清数据');
            GameHttp.request({ command: NetCode.CLEAR_DAILY_INFO });
        }
    }

    /**
     * 任意接口更新数据
     */
    private updataAnyAway(data) {
        // this.updateOperateTaskInfo(data);
        // this.bagUpdate(data);
        //抽奖机的奖励和消耗自己处理，因为有延迟
        if (data.command != 1) {
            let arr = [];
            if (data.costInfo) {
                data.costInfo.forEach(element => {
                    element.iscost = true;  //设置消耗还是获得
                });
                arr = arr.concat(data.costInfo);
            }
            arr = data.rewardInfo ? arr.concat(data.rewardInfo) : arr;
            // GameEffect.showQueueReward(arr);
        }
    }
    //更新每日一清的数据
    private updateDailyInfo(data): void {
        let ignoreKeys = ['command', 'opId', 'sc'];
        for (let key in data) {
            if (ignoreKeys.indexOf(key) != -1) {
                continue;
            }
            //每日一清的荣誉榜数据需要重新赋值
            if (key == 'lastHonorRankRewardInfo') {
                this._cacheData.lastHonorRankInfo = {//上周荣誉榜
                    "list": [],
                    "myRank": data.lastHonorRankRewardInfo.myRank,
                    "rankRewardRecv": data.lastHonorRankRewardInfo.rankRewardRecv
                };
                continue;
            }
            this._cacheData[key] = data[key];
            switch (key) {
                case 'dailyTaskInfo':
                    // ebe.singleton(TaskData).updateDailyTaskList();
                    break;
            }
        }
    }

    //上次同步微信交互数据时间
    private lastSetUsrCloundTime = 0;
    /**
     * 设置微信交互数据
     * 医院评分 score
     * 点赞数 likeCount
     * 捐赠数 donate
     * 荣誉值 honor
     */
    private async setUserCloudStorage() {
        let platform = window["platform"];
        if (platform.name != "wxgmae") return;
        var nowT = new Date().getTime();
        var likeCount = this._cacheData["likeCount"];
        if (nowT - this.lastSetUsrCloundTime > 60 * 1000) {
            var score: number = core.singleton(UserData).getHospitalScore();
            let keyArr: Array<Object> = [
                { "key": "score", "value": score.toString() },
                { "key": "likeCount", "value": likeCount.toString() },
                // {"key":"donate", "value": `${PlantModel.getHonor()}`}
                // {"key":"honor", "value": `${PlantModel.getHonor()}`}
            ];
            platform.setUserCloudStorage(keyArr).then(() => {
                this.lastSetUsrCloundTime = nowT;
            })
        }
    }

    upateAdInfo(data):void {
        
    }

    getCache() {
        return this._cacheData || null;
    }

    getCacheByKey(key: any): any {
        return this._cacheData ? this._cacheData[key] : null;
    }
}