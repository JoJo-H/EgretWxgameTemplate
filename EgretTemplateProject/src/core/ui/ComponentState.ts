

module core {
    /**
     * 事件监听参数接口
     */
    export interface IListenerOption {
        component : egret.DisplayObject;
        type : string;
        context : any;
        callback : Function;
        priority ?: number;
        useCapture ?: boolean;
    }
    /** 组件状态 */
    export class ComponentState {
        private _component:IComponent;
        private _args:any[] = [];
        private _listeners:IListenerOption[] = [];

        constructor(component:IComponent) {
            this._component = component;
            this.initEventListener();
        }
        initEventListener():void{
            if(!this._component.hasEventListener(egret.Event.ADDED_TO_STAGE)){
                this._component.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            }
            if(!this._component.hasEventListener(egret.Event.REMOVED_FROM_STAGE)){
                this._component.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            }
            this.onInitChildrenEventListener(this);
        }
        //在开启ui缓存后,再次打开ui,其子BaseComponent的初始化事件都已被销毁，需要重新注册
        private onInitChildrenEventListener(container:any):void {
            let children = container.numChildren;
            for (let i = 0; i < children; i ++) {
                let item = container.getChildAt(i);
                if (item instanceof BaseComponent) {
                    item.initEventListener();
                }else if (item instanceof core.ItemRenderer) {
                    this.onInitChildrenEventListener(item);
                }else if (item instanceof eui.ItemRenderer) {
                    this.onInitChildrenEventListener(item);
                }else if (item instanceof core.Button) {
                    this.onInitChildrenEventListener(item);
                }else if (item instanceof eui.Group) {
                    this.onInitChildrenEventListener(item);
                }else if (item instanceof eui.Scroller) {
                    this.onInitChildrenEventListener(item);
                }
            }
        }

        onAddToStage(e):void {
            this._component.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this._component.onEnter(...this._args);
            invokeHook(hooks.ui, 'onAdd', this._component);
        }
        onRemovedFromStage():void {
            this._component.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if(this._isFull){
                core.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            }
            this.clearLiteners();
            this._component.onExit();
            invokeHook(hooks.ui, 'onRemove', this._component);
        }

        listener(component:egret.DisplayObject,type:string,func:(e:egret.Event) => void,context:any):void {
            if (!component || !func) {
                return;
            }
            if(component.hasEventListener(type)) {
                return;
            }
            let option : IListenerOption = {component,type,context,callback:func};
            this._listeners.push(option);
            component.addEventListener(type, func, context);
        }
        clearLiteners():void {
            while (this._listeners.length > 0) {
                let listItem = this._listeners.shift();
                listItem.component.removeEventListener(listItem.type, listItem.callback, listItem.context);
            }
            this._listeners = [];
        }

        dispose():void {
            this.clearLiteners();
            this._args = [];
            this._isFull = false;
            this._component = null;
        }

        getArgs():any[] {
            return this._args ? this._args : [];
        }
        setArgs(args):void {
            this._args = args;
        }

        private _isFull:boolean = false;
        public get isFull(): boolean  {
            return this._isFull;
        }
        /**
         * 设置全屏
         */
        setFull():void {
            this._isFull = true;
            this.full()
        }
        private full(): this {
            this._component.width = core.stage.stageWidth;
            this._component.height = core.stage.stageHeight;
            core.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            core.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            return this;
        }
        private onResize():void {
            this._component.width = core.stage.stageWidth;
            this._component.height = core.stage.stageHeight;
        }

        private _type:UiType;
        isType(type:UiType):boolean {
            return this._type == type;
        }
        setUiType(type:UiType):void {
            this._type = type;
        }
        getUiType():UiType{
            return this._type;
        }
    }
}