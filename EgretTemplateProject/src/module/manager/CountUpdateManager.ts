/*
 * @Author: HuangGuoYong 
 * @Date: 2018-07-09 17:30:53 
 * @Last Modified by: HuangGuoYong
 * @Last Modified time: 2018-07-09 18:15:11
 */

/**
 * 计数更新管理器
 * 1、跳一跳次数更新
 */
class CountUpdateManager {
    constructor() {
        
    }
    private static _instance:CountUpdateManager;
    static get instance():CountUpdateManager {
        if(!this._instance) {
            this._instance = new CountUpdateManager();
        }
        return this._instance;
	}

    startTick():void {
        //定时器
        // TimerManager.instance.addKeyTick('CountUpdateManager_startTick',this.updateCountTick,this,1000,0);
    }

    private updateCountTick():void {
        this.updateJumpCount();
    }

    //*********************************跳一跳计数更新*****************************************
    private updateJumpCount():void {
        // let maxCnt = ConfigValuesVO.instance.maxJumpGameCount;
        // let unit = ConfigValuesVO.instance.jumpGameCountRecoverUnit;
        // let speed = ConfigValuesVO.instance.jumpGameCountRecoverSpeed;

        // let jumpGameInfo = RequestCacheData.getInstance().jumpGameInfo;
        // if(jumpGameInfo.remainJumpGameCount >= maxCnt) return;
        // let nowTime = Math.floor(RequestCacheData.getInstance().serverTime / 1000);
        // let deltaTime = nowTime - jumpGameInfo.lastRecoverCountTime;
        // if(deltaTime >= unit){
        //     //每秒增长
        //     jumpGameInfo.remainJumpGameCount += Math.floor(deltaTime / unit * speed);
        //     jumpGameInfo.remainJumpGameCount = Math.min(jumpGameInfo.remainJumpGameCount,maxCnt);
        //     //重置上次恢复时间
        //     jumpGameInfo.lastRecoverCountTime = nowTime - deltaTime % unit;
        //     core.sendNotification(GlobalDefine.Update_Jumping_Count);
        // }
    }
    //*********************************跳一跳计数更新*****************************************
}