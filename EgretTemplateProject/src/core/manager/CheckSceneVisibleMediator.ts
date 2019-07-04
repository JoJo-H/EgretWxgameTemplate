
module core {


    /**
     * 检测场景的可视化控制器
     */
    export class CheckSceneVisibleMediator extends core.Mediator implements core.IMediator {

        public static CheckTickKey: string = "CheckSceneVisibleController_check";
        static NAME: string = 'CheckSceneVisibleMediator';
        constructor() {
            super(CheckSceneVisibleMediator.NAME);
        }

        onRegister(): void {
          
        }

        onRemove(): void {
            
        }

        listNotificationInterests(): string[] {
            let arr = [];
            if (core.Config.checkSceneVisible) {
                arr.push(CoreNotificationDef.UI_ADD,CoreNotificationDef.UI_REMOVE);
            }
            return arr.concat(super.listNotificationInterests());
        }

        handleNotification(notification: core.INotification): void {
            let compName : string;
            switch (notification.getName()) {
                case CoreNotificationDef.UI_ADD:
                    compName = notification.getArr()[0];
                    this.check(compName,true);
                    break;
                case CoreNotificationDef.UI_REMOVE:
                    compName = notification.getArr()[0];
                    this.check(compName,false);
                    break;
            }
        }

        /** 打开时需要隐藏主场景的组件名称集合 */
        private _includeNameArr: string[] = ['JumpingMap', 'EmployeMain', 'RecruitMain',
            'PatientPokedexComponent', 'ShopBox'];
        /** 当前打开的组件名称集合，包含在includeNameArr里 */
        private _curNameList: string[] = [];
        /**
         * 检测打开或者移除BaseComponent时是否需要隐藏或者显示场景
         * @param comp 组件
         * @param open 为true表示打开ui的时候,false表示移除ui的时候
         */
        private check(compName: string, open: boolean): void {
            let include: boolean = this._includeNameArr.indexOf(compName) != -1;
            if (include) {
                if (open) {
                    let exist = core.UI.isExistCompByName(compName);
                    open = !exist ? false : true;
                }
                if (open) {
                    this.sceneVisible(false);
                    if (this._curNameList.indexOf(compName) == -1) {
                        this._curNameList.push(compName);
                    }
                } else {
                    let index = this._curNameList.indexOf(compName);
                    if (index != -1) {
                        this._curNameList.splice(index, 1);
                    } else {
                        //点击太快时,添加界面还没push进curNameList时就被移除了
                        console.log(`点击太快发出警告，这个界面'${compName}'已经被移除啦`);
                    }
                    if (this._curNameList.length == 0) {
                        this.sceneVisible(true);
                    }
                }
            }
        }

        /** 设置主场景的是否可视 */
        private sceneVisible(vis: boolean): void {
            let scene = core.UI.getScene();
            if (scene) {
                scene.visible = vis;
            }
            if (vis) {
                TimerManager.instance.removeTicks(this);
            } else {
                TimerManager.instance.addKeyTick(CheckSceneVisibleMediator.CheckTickKey, this.checkVisible, this, 100, 0);
            }
        }

        private checkVisible(): void {
            if (this._curNameList.length == 0) {
                this.sceneVisible(true);
                TimerManager.instance.removeTicks(this);
                return;
            }
            let exist: boolean = false;
            let noExistList = [];
            for (let cname of this._curNameList) {
                if (core.UI.isExistCompByName(cname)) {
                    exist = true;
                } else {
                    noExistList.push(cname);
                }
            }
            for (let cname of noExistList) {
                let index = this._curNameList.indexOf(cname);
                if (index != -1) {
                    this._curNameList.splice(index, 1);
                }
            }
        }

    }
}