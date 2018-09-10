
module core {
    export interface IComponent extends egret.DisplayObject {
        onEnter(...args):void;
        onExit():void;
        listener(component:eui.Component,type:string,sender:(e:egret.Event) => void,context:any):void;
        setArgs?: (args:any[])=>void ;
        getArgs?: ()=>any[];
        setData?: (data:any, type?:any)=>void;
        setFull?: ()=>void;
        getView?: (name)=>egret.DisplayObject;
        setUiType?: (type:UiType)=>void;
        getUiType?: ()=>UiType;
        getAnimation?: ()=>IUiAnimation;
        setAnimation?: (anim:IUiAnimation)=>void;

    }

    export class BaseComponent extends eui.Component implements IComponent{
        public _data : any;
        public btnClose : core.Button
        public imgClose : eui.Image;
        public removeing:boolean = false;

        private _compState:ComponentState;
        protected _animation : IUiAnimation;
        constructor() {
            super();
            this._compState = new ComponentState(this);
        }

        public onExit():void {
            this._compState.dispose();
            this._animation = null;
            this._data = null;
        }

        public onEnter(...args):void {
            if(this.btnClose) 
            {
                this.listener(this.btnClose,egret.TouchEvent.TOUCH_TAP, this.onClose,this);
                this.btnClose.name = "btnClose";
            }
            if(this.imgClose){
                this.listener(this.imgClose,egret.TouchEvent.TOUCH_TAP, this.onClose,this);
            }
            if(this._animation){
                this._animation.open();
            }
        }

        setData(data:any):void {
            this.data = data;
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
        }
        public set data(data:any) {
            this._data = data;
            this.dataChange(data);
        }
        public get data():any {
            return this._data;
        }
        dataChange(data?:any):void {
    
        }

        public onClose():void {
            if(this._animation){
                this._animation.close()
                .then(()=>{
                    UI.remove(this);
                })
            }else{
                UI.remove(this);
            }
        }

        listener(component:egret.DisplayObject,type:string,func:(e:egret.Event) => void,context:any):void {
            this._compState.listener(component,type,func,context)
        }
    
        initEventListener():void{
            this._compState.initEventListener();
        }
    
        setFull():void {
            this._compState.setFull();
        }
    
        getArgs():any[] {
            return this._compState.getArgs();
        }
        setArgs(args):void {
            this._compState.setArgs(args);
        }
        public setUiType(type:number) {
            this._compState.setUiType(type);
        }
        getUiType():number {
            return this._compState.getUiType();
        }
        getAnimation():IUiAnimation {
            return this._animation;
        }
        setAnimation(anim:IUiAnimation):void {
            this._animation = anim;
        }
    
        getChildView(name):egret.DisplayObject {
            if (this[name]) {
                return this[name];
            }
            return core.display.getChildByName(name, this);
        }

        destoryData():void {
            display.destoryChildren(this);
        }
    }
    window["BaseComponent"]=BaseComponent;
}