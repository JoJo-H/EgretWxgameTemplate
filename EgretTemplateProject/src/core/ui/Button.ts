
module core {
    export class Button extends eui.Button{
        static THROTTLE_TIME : number = 100;
        constructor(){
            super();
        }

        private _notice:string = '';
        get notice():string {
            return this._notice;
        }
        set notice(notice:string) {
            this._notice = notice;
        }

        private _data:any;
        get data():any {
            return this._data;
        }

        set data(value:any) {
            this._data = value;
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
        }

        private _throttleTime : number = 0;
        //为0时去全局节流时间，小于0时表示不节流返回0
        get throttleTime():number {
            if (this._throttleTime == 0) {
                return Button.THROTTLE_TIME;
            }
            return this._throttleTime < 0 ? 0 : this._throttleTime;
        }
        set throttleTime(val:number){
            this._throttleTime = val;
        }

        private _throttleFun:Function;
        public get throttleFun():Function {
            if (this._throttleFun == null) {
                this._throttleFun = fun.throttle(this.posNotification, this.throttleTime);
            }
            return this._throttleFun;
        }

        /**
         * 当在用户单击按钮之后处理 <code>egret.TouchEvent.TOUCH_END</code> 事件时，将调用此方法。
         * 仅当以按钮为目标，并且 <code>touchCaptured</code> 为 <code>true</code> 时，才会调用此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        protected buttonReleased():void {
            if( core.is.truthy(this.sound) && (this.name!="btnClose") ){
                AudioManager.playerSoundMusic("button_mp3");
            }
            if(this.throttleTime > 0){
                this.throttleFun();
            }else{
                this.posNotification();
            }
        }
        private posNotification():void {
            if (is.truthy(this._notice)) {
                var data = this.data;
                if (!data) {
                    var host = display.getHostComponent(this);
                    if (host) {
                        data = host.data;
                    }
                }
                core.postNotification(this._notice,data,host,this);
            }
            core.invokeHook(hooks.button, 'onClick', this);
        }


        //是否添加音效
        private _sound : boolean = true;
        get sound():boolean {
            return this._sound;
        }
        set sound(value){
            this._sound = value;
        }

        

        //*********************************动画*****************************************
        private _isShow : boolean = false;
        public showAnim():void {
            if(!this._isShow){
                this._isShow = true;
                egret.Tween.get(this,{loop:true}).to({scaleX:1.1,scaleY:1.1},1000).to({scaleX:1,scaleY:1},1000);
            }
        }
        public removeAnim():void {
            egret.Tween.removeTweens(this);
            this._isShow = false;
            this.scaleX = this.scaleY = 1;
        }
        //*********************************动画*****************************************

        destoryData():void {
            this.data = null;
            this._throttleFun = null;
            this.removeAnim();
        }
    }
    window['Button'] = Button;
}