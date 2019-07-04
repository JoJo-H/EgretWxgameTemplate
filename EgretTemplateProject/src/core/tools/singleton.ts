
module core {

    var _singletonMap:any = {};
    /**
     * 返回指定分类的类型单例
     * @param clz 单例化的类型
     * @returns {any} 单例对象
     */
    export function singleton<T>(clz:{new():T}):T {
        let compName = core.display.getComponentName(clz);
        //使用ecma6特性的symbol类型,Symbol.for(key),获取symbol类型，不存在则新建
        let symbol = Symbol.for(compName);
        if (!_singletonMap.hasOwnProperty(symbol)) {
            _singletonMap[symbol] = new (<any>clz)();
        }
        return <T>_singletonMap[symbol];
    }

    /**
     * 返回指定分类的类型单例
     * @param clz 单例化的类型
     * @param type 分类名称
     * @returns {any} 单例对象
     */
    export function typeSingleton<T>( clz:{ new(): T; },type:string):T {
        let compName = type + core.display.getComponentName(clz);
        let symbol = Symbol.for(compName);
        if (!_singletonMap.hasOwnProperty(symbol)) {
            _singletonMap[symbol] = new (<any>type)();
        }
        return <any>_singletonMap[symbol];
    }
    
    /**
     * 获取所有的单例模式
     */
    export function getAllSingleton():any {
        return <any>_singletonMap;
    }

    // /**
    //  * 返回指定类型的单例
    //  * @includeExample singleton.ts
    //  * @param type 需要单例化的类型
    //  * @returns {any} 类型的单例
    //  */
    // export function singleton<T>(type:{ new(): T ;}):T {
    //     var typeId = getTypeId(type);
    //     if (!_singletonMap.hasOwnProperty(typeId)) {
    //         _singletonMap[typeId] = new (<any>type)();
    //     }
    //     return <any>_singletonMap[typeId];
    // }

    // /**
    //  * 返回指定分类的类型单例
    //  * @param name 分类名称
    //  * @param type 单例化的类型
    //  * @includeExample typesingleton.ts
    //  * @returns {any} 单例对象
    //  */
    // export function typeSingleton<T>(name:string, type:{ new(): T; }):T {
    //     var typeId = name + getTypeId(type);
    //     if (!_singletonMap.hasOwnProperty(typeId)) {
    //         _singletonMap[typeId] = new (<any>type)();
    //     }
    //     return <any>_singletonMap[typeId];
    // }
}