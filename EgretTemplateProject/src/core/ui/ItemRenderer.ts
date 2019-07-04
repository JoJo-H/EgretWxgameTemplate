module core {
    export class ItemRenderer extends eui.ItemRenderer implements IComponent{
        private _componentState:ComponentState;
        constructor() {
            super();
            this._componentState = new ComponentState(this);
        }

        listener(component:egret.DisplayObject,type:string,func:(e:egret.Event) => void,context:any):void {
            this._componentState.listener(component,type,func,context)
        }

        setData(val):void{
            this.data = val;
            this.dataChanged();
        }

        dataChanged():void {
            super.dataChanged();
        }

        private _notice:string;
        get notice():string {
            return this._notice;
        }
        set notice(notice:string) {
            this._notice = notice;
        }

        protected getCurrentState():string {
            if (this.enabled == false && this.skin.hasState('disabled')) {
                return 'disabled';
            }
            var state = this.skin.currentState;
            var s = super.getCurrentState();
            if (this.skin.hasState(s)) {
                return s;
            }
            return state;
        }

        private tap(e:egret.TouchEvent):void {
            if (e.target instanceof eui.Button || e.target instanceof core.Button) {
                e.stopPropagation();
                return;
            }
            if (is.truthy(this._notice)) {
                core.sendNotification(this._notice, this.data,this);
            }
        }

        onEnter():void {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
        }

        onExit():void {
            this._componentState.clearLiteners();
            this.data = null;
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
        }

        destoryData():void {
            
        }
    }
    window["ItemRenderer"]=ItemRenderer;
}
