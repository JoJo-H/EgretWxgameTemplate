
module core {

    export interface IHook<T> {
        register(type:T):void;
        remove(type:T):void;
        reset():void;
        items : T[];
    }

    export class Hook<T> implements IHook<T> {
        private _hookMap : T[] = [];
        constructor(){

        }
        register(type:T):void{
            this._hookMap.push(type);
        }
        remove(type:T):void{
            let index = this._hookMap.indexOf(type);
            if(index!=-1){
                this._hookMap.splice(index,1);
            }
        }
        reset():void{
            this._hookMap = [];
        }
        get items():T[]{
            return this._hookMap;
        }
    }

    export interface IHooks {
        ui : IHook<IUIHook>;
        button : IHook<IButtonHook>;
        network : IHook<INetworkHook>;
        socket : IHook<ISocketHook>;
    }

    export interface IUIHook{
        onAdd?(component:IComponent):void;
        onRemove?(component:IComponent):void;
    }

    export interface IButtonHook {
        onClick?(btn:core.Button):void;
    }

    export interface INetworkHook {
        onRequest?(proxy:core.NetworkRequest):void;
        onReponse?(proxy:core.NetworkRequest):void;
        onRequestError?(proxy:core.NetworkRequest):void;
        onReloadError?(proxy:core.NetworkRequest):void;

        onTimeout?(proxy:core.NetworkRequest):void;
        onReponseSuccess?(proxy:core.NetworkRequest):void;
        onReponseError?(proxy:core.NetworkRequest):void;
    }

    export interface ISocketHook {
        onMessage?(data: any): void;
        onBeforeMessage?(data: any):boolean|undefined;
        onAfterMessage?(data: any): void;
        onClose?(): void;
        onError?(error: any):void;
        onConnect?(data?: any): void;
        onSend?(route: string, params: any): void;
        // socket?: core.Socket;
        uniqueId?: any;
        type?: string;

    }

    export class Hooks implements IHooks {
        public ui = new Hook<IUIHook>();
        public button = new Hook<IButtonHook>();
        public network = new Hook<INetworkHook>();
        public socket = new Hook<ISocketHook>();
    }

    export var hooks = new Hooks();


    export function invokeHook<T>(hook: IHook<T>, funName: string, ...args): boolean {
        var items = hook.items;
        var r = true;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[funName]) {
                var r2 = item[funName](...args);
                if (r2 === false) {
                    r = false;
                }
            }
        }
        return r;
    }
}