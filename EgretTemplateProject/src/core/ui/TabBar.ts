module core {
    export class TabBar extends eui.TabBar {
        constructor() {
            super();
        }

        childrenCreated():void {
            super.childrenCreated();
        }

        //是否添加音效
        private _sound : boolean = true;
        get sound():boolean {
            return this._sound;
        }
        set sound(value){
            this._sound = value;
        }

        onRendererTouchEnd(event):void {
            if(this._sound) {
                AudioManager.playerSoundMusic("button_mp3");
            }
            if (this._verifyCallback) {
                let flag = this._verifyCallback.call(this._context,...this._args);
                if (flag) {
                    super.onRendererTouchEnd(event);
                }
            } else {
                super.onRendererTouchEnd(event);
            }
        }

        private _verifyCallback:()=>boolean;
        private _context:any;
        private _args : any[];
        /**
         * 检测是否可以选择该选项卡
         * @param callback 回调函数，用来判断
         * @param context 作用域
         * @param args  参数
         */
        onVerifyCallback<Z>(callback:()=>boolean, context:Z,...args):void {
            this._verifyCallback = callback;
            this._context = context;
            this._args = args;
        }
    }
    window["TabBar"]=TabBar;
}