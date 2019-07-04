

class GameInitHandler {

    constructor() {
    }

    private static _instance: GameInitHandler;
    static get instance(): GameInitHandler {
        if (!this._instance) {
            this._instance = new GameInitHandler();
        }
        return this._instance;
    }

    initGame():void {
        CountUpdateManager.instance.startTick();
    }


    /** 刚开始进入游戏要打开的界面 */
    doAfterLogin() {
        //离线奖励
        console.log('判断是否打开离线收益：',RequestCacheData.instance.getCache()['offlineInfo']);
        let offlineInfo = RequestCacheData.instance.getCache()["offlineInfo"];
        if(offlineInfo && offlineInfo["totalRewardInfo"]){
            let callbck : core.Callback = {callback:()=>{}};
            core.postNotification(core.QueueBoxMediator.ADD_QUEUE_BOX,'OffLineIncome',callbck);
        }

        //每日签到
        if(true){
            let callbck : core.Callback = {callback:()=>{}};
            core.postNotification(core.QueueBoxMediator.ADD_QUEUE_BOX,'SigninComponent',callbck);
        }
        core.addNotification(core.QueueBoxMediator.END_QUEUE,this.endQueue,this);
    }

    private endQueue():void {
        core.removeNotification(core.QueueBoxMediator.END_QUEUE,this);
        // GuideManager.startGuide();
    }
}