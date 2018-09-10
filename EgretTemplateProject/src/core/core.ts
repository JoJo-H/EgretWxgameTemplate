

module core {

    export class Config {

        static httpRequestUrl : string = '';
        static httpRequestMethod : string = egret.HttpMethod.GET;
        static requestKey : string = "sc";
        static httpTimeout : number = 600000;
        static httpBase64 : boolean = false;

        static uiCache : boolean = true;
        static checkSceneVisible : boolean = true;
        static uiRemoveCheck : boolean = true;
        static uiCheckTime : number = 2000;
        static uiCleanTime : number = 300000;   //300秒
        constructor() {
            
        }
    }

    export var stage : egret.Stage;
    /**
     * 框架入口类，本类应在程序主入口调用run方法进行初始化
     */
    export function run(estage: egret.Stage): void {
        stage = estage;
        stage.addChild(UI.instance);
        egret.ImageLoader.crossOrigin = 'anonymous';
        RES.setMaxLoadingThread(8);
        core.registerMediator(new CoreMediator());
        core.registerMediator(new ClearExpireUICacheMediator());
        core.registerMediator(new CheckSceneVisibleMediator());
        core.hooks.network.register(new HttpListenerHook());        
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {

        }
    }


    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    export function getDefinitionType(name,defaultType):any{
        if (is.truthy(name)) {
            var t = egret.getDefinitionByName(name);
            if (is.truthy(t)) {
                return t;
            }
        }
        return defaultType;
    }
    /**
     * 获取指定类的实例 -- 微信小游戏环境下必须定义类在window
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    export function getDefinitionInstance<T>(name:string, defaultType:any = null, ...args):T {
        var define = core.getDefinitionType(name, defaultType);
        if( is.truthy(define)) {
            return new define(...args);
        }
        return null;
    }
    
    /** 数据变更 */
    export function propertyChange(obj,...arg):void {
        for (var i = 0; i < arg.length; i++) {
            eui.PropertyEvent.dispatchPropertyEvent(obj, eui.PropertyEvent.PROPERTY_CHANGE, arg[i]);
        }
    }

    /** 是否实例 */
    export function isInstance<T>(type: T): boolean {
        if (type.constructor != Object.constructor) {
            return true;
        }
        return false;
    }

    /** 是否类 */
    export function isType<T>(type: T): boolean {
        if (type.constructor == Object.constructor) {
            return true;
        }
        return false;
    }

    /** 获取预加载列表 */
    export function getPreloadList(info:IUIPreloadInfo):Promise<any>[] {
        let list : Promise<any>[] = [];
        if(info.group){
            for(let group of info.group) {
                list.push(RES.loadGroup(group));
            }
        }
        if(info.assets){
            for(let json of info.assets) {
                list.push(RES.getResAsync(json));
            }
        }
        if(info.promise){
            for(let promise of info.promise) {
                list.push(promise);
            }
        }
        return list;
    }

}
window["core"]=core;

