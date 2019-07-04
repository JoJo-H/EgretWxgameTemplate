module core {
    /**
     * 回调数据结构，提供this绑定功能
     * extends egret.HashObject
     */
    export class Callback  {

        callback: Function;

        thisObj ?: any;

        bindCallback ?: Function;

        /**
         * @param  {Function} callback
         * @param  {any} thisObj
         */
        constructor(callback: Function, thisObj: any) {
            // super();
            this.bindCallback = callback.bind(thisObj);
            this.callback = callback;
            this.thisObj = thisObj;
        }
    }
}