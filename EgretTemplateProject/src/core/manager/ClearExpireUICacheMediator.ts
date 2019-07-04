/*
* @Author: HuangGuoYong 
* @Date: 2018-08-19 00:21:05 
 * @Last Modified by: HuangGuoYong
 * @Last Modified time: 2018-08-19 00:52:11
*/
module core {

    /**
     * 清除过期的ui缓存 控制器
     */
    export class ClearExpireUICacheMediator extends core.Mediator implements core.IMediator {
        static NAME: string = 'ClearExpireUICacheMediator';
        constructor() {
            super(ClearExpireUICacheMediator.NAME);
        }

        onRegister(): void {
            if (core.Config.uiRemoveCheck) {
                TimerManager.instance.addKeyTick('UI_checkRemoveBox', this.checkBoxRemove, this, core.Config.uiCheckTime, 0);
            }
        }

        onRemove(): void {
            
        }

        listNotificationInterests(): string[] {
            let arr = [];
            if (core.Config.uiRemoveCheck) {
                arr.push(CoreNotificationDef.UI_REMOVE);
            }
            return arr.concat(super.listNotificationInterests());
        }

        handleNotification(notification: core.INotification): void {
            switch (notification.getName()) {
                case CoreNotificationDef.UI_REMOVE:
                    this.refreshRemoveTime(...notification.getArr());
                    break;
            }
        }
        /**
         * 添加需要过滤的ui
         */
        addExcludeName(compName:string):void {
            if(this._excludeNameArr.indexOf(compName) == -1){
                this._excludeNameArr.push(compName);
            }
        }

        //过滤的ui缓存名称列表
        private _excludeNameArr: string[] = ['MainScene', 'JumpingMap'];
        //存储ui的移除时间
        private _boxRemoveTimeMap: Map<string, number> = new Map();

        /**
         * 检测Component是否可以移除，超过时间
         */
        private checkBoxRemove(): void {
            for (let boxName of this._boxRemoveTimeMap.keys()) {
                if (this._excludeNameArr.indexOf(boxName) != -1) continue;
                let time: number = this._boxRemoveTimeMap.get(boxName);
                let curTime = new Date().getTime();
                if ((curTime - time) >= core.Config.uiCleanTime) {
                    this._boxRemoveTimeMap.delete(boxName);
                    let boxMap = core.UI.getBoxMap();
                    if (boxMap.has(boxName) && !boxMap.get(boxName).parent) {
                        boxMap.delete(boxName);
                        console.log('移除了UI缓存：', boxName);
                    }
                }
            }
        }
        /**
         * 刷新Component的移除时间
         * @param comp 
         */
        private refreshRemoveTime(boxName ?: any): void {
            if (core.UI.isUiCache(boxName)) {
                let time = new Date().getTime();
                this._boxRemoveTimeMap.set(boxName, time);
            }
        }
    }
}