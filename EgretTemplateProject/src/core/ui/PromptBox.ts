
module core {

    export interface IPromptInfo {
        title:string;   //标题
        text: string    //内容
        type: number,    //状态
        yes: '重试',        //确定按钮文本
        no: ''              //关闭按钮文本
    }

    export enum PromptState {
        common = 1,     //有两个按钮
        confirm = 2     //只有一个确定按钮
    }

    export class PromptBox extends BaseComponent {
        
        public btnYes : core.Button;
        public btnNo : core.Button;
        public lbTitle : eui.Label;
        public lbContent : eui.Label;

        private _info : IPromptInfo;
        private _resolve : Function;
        constructor() {
            super();
            this.name = 'PromptBox';
            this.skinName = 'PromptBoxSkin';
        }

        onEnter(info):void {
            super.onEnter();
            this._info = info;
            this.btnYes.label = this._info.yes;
            this.btnNo.label = this._info.no;
            this.lbTitle.text = this._info.title;
            this.lbContent.text = this._info.text;
            if(!this._info.type){
                this._info.type = core.PromptState.confirm;
            }
            this.currentState = this._info.type == PromptState.confirm ? "confirm" : "common";
            this.listener(this.btnYes,egret.TouchEvent.TOUCH_TAP,this.onYes,this);
            this.listener(this.btnNo,egret.TouchEvent.TOUCH_TAP,this.onNo,this);
        }

        private onYes():void {
            if(this._resolve){
                this._resolve(true);
                this._resolve = null;
            }
            this.onClose();
        }

        private onNo():void {
            if(this._resolve){
                this._resolve(false);
                this._resolve = null;
            }
            this.onClose();
        }

        onExit():void {
            this._info = null;
            super.onExit();
        }

        show():Promise<any> {
            return new Promise<any>((resolve,reject)=>{
                this._resolve = resolve;
            });
        }

    }
    window['PromptBox'] = PromptBox;
}