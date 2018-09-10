/*
 * @Author: HuangGuoYong 
 * @Date: 2018-08-16 01:14:29 
 * @Last Modified by: HuangGuoYong
 * @Last Modified time: 2018-08-16 01:40:10
*/
module core {
    
    /**
     * 弹窗队列
     */
    export class QueueBoxMediator extends core.Mediator implements core.IMediator {
        static END_QUEUE : string = "END_QUEUE";
        static ADD_QUEUE_BOX : string = "ADD_QUEUE_BOX";

        private _queueList: IQueueBoxInfo[] = [];
        private _curBoxName: string = '';
        static NAME: string = 'QueueBoxMediator';
        constructor() {
            super(QueueBoxMediator.NAME);
        }

        onRegister(): void {
         
        }

        onRemove(): void {

        }

        listNotificationInterests(): string[] {
            let arr = [core.CoreNotificationDef.UI_NORMAL_REMOVE, core.CoreNotificationDef.UI_CLEAR,QueueBoxMediator.ADD_QUEUE_BOX];
            return arr.concat(super.listNotificationInterests());
        }

        handleNotification(notification: core.INotification): void {
            switch (notification.getName()) {
                case CoreNotificationDef.UI_NORMAL_REMOVE:
                    this.excuteQueue(...notification.getArr())
                    break;
                case CoreNotificationDef.UI_CLEAR:
                    this.clear()
                    break;
                case QueueBoxMediator.ADD_QUEUE_BOX:
                    this.addQueueBoxByClassName(notification.getArr()[0],notification.getArr()[1]);
                    break;
            }
        }

        /**
         * 添加进队列 -- 需要是该类的类名称 __class__,才能在关闭的时候进行判断
         * @param clzName 类名称
         */
        addQueueBoxByClassName(clzName: string,callback:core.Callback): void {
            if(!clzName || !callback || core.UI.isExistCompByName(clzName)) return;
            if (!this.hasName(clzName) && this._curBoxName != clzName) {
                this._queueList.push({clzName,callback});
                console.log('添加进队列：', clzName);
            }
            if (!this._curBoxName || this._curBoxName == '') {
                this.openNextBox();
            }
        }

        private excuteQueue(boxName?: string): void {
            if (this._curBoxName !== boxName) return;
            this.openNextBox();
        }

        private openNextBox(): void {
            if (this._queueList.length <= 0) {
                this.clear();
                return;
            }
            let queueInfo = this._queueList.shift();
            let callbackInfo = queueInfo.callback;
            this._curBoxName = queueInfo.clzName;
            queueInfo.args = queueInfo.args ? queueInfo.args : [];
            callbackInfo.callback.call(callbackInfo.thisObj,...queueInfo.args);
            console.log('打开下一个队列弹窗', queueInfo.clzName);
        }

        private hasName(clzName:string):boolean {
            return this.getQueueInfoByName(clzName) ? true : false;
        }

        private getQueueInfoByName(clzName:string):IQueueBoxInfo {
            return this._queueList.find((info)=>{
                return info.clzName == clzName;
            });
        }

        clear(): void {
            this._queueList = [];
            this._curBoxName = '';
            console.log('清除所有队列');
            core.postNotification(QueueBoxMediator.END_QUEUE);
        }
    }
}