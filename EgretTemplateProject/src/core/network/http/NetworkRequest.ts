
module core {

    export class NetworkRequest extends egret.EventDispatcher  {

        private _requestInfo : IRequestInfo;
        private _isTimeout:boolean = false;
        private _timeoutId:number = null;
        public reloadTimes : number = 0;

        private 
        constructor(params:IRequestInfo) {
            super();
            this._customParams = {};    // 自定义参数,比如当前时间
            this._requestInfo = params;      //请求参数
        }

        private _request : egret.HttpRequest;
        load():void {
            let requestUrl = this._requestInfo.requestUrl;
            this._request = new egret.HttpRequest();
            this._request.responseType = egret.HttpResponseType.TEXT;
            //application/x-www-form-urlencoded 表示我们以key和value方式来格式化参数
            this._request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            this._request.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
            this._request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
            this._request.addEventListener(egret.ProgressEvent.PROGRESS,this.onProgress,this);

            egret.clearTimeout(this._timeoutId);
            this._timeoutId = egret.setTimeout(()=>{
                this._isTimeout = true;
                this._errorCode = ProxyErrorCode.TIME_OUT;
                this._errorMessage = "请求超时";
                this.clearEventListener();

                this.dispatchEvent(new RequestEvent(RequestEvent.TIME_OUT, this));
                core.postNotification(RequestNotice.TIME_OUT,this);
                invokeHook(hooks.network,'onTimeout',this);
            },this,core.Config.httpTimeout);

            invokeHook(hooks.network,'onRequest',this);
            //根据前后端制定的请求格式
            //1、包成一个data属性,value是json字符串，是否需要base64封装
            //2、默认参数直接是key,value形式；重要参数可以包成data属性,valie需要转换成json字符串
            if(core.Config.httpBase64) {
                let data = network.paramsToObject(this._requestInfo.params,this._customParams,network._globalParams);
                if(this._requestInfo.method == egret.HttpMethod.GET){
                    requestUrl = requestUrl + "?data=" + encodeURIComponent(network.tranObjToArrBuffer(data));
                    this._request.open(requestUrl,egret.HttpMethod.GET);
                    this._request.send();
                }else{
                    this._request.open(requestUrl,egret.HttpMethod.POST);
                    let posData = "data=" +encodeURIComponent(JSON.stringify(data));
                    this._request.send(posData);
                }
            }else{
                let queryString = network.paramsToQueryString(this._requestInfo.params,this._customParams,network._globalParams);
                if(this._requestInfo.method == egret.HttpMethod.GET){
                    let url : string = requestUrl.indexOf('?') == -1 ? requestUrl+'?' : requestUrl;
                    if( url[url.length - 1] != '?' && url[url.length - 1] != "&" ) {
                        url += '&';
                    }
                    url += queryString;
                    this._request.open(url,egret.HttpMethod.GET);
                    this._request.send();
                }else{
                    this._request.open(requestUrl,egret.HttpMethod.POST);
                    this._request.send(queryString);
                }
            }
        }

        private onComplete(event:egret.Event):void {
            let data:any = null;
            try {
                data = JSON.parse(event.target.response);
            } catch (e) { 
                //响应格式错误 解析json失败
                throw new Error(e);
            }
            this.onResponse(data);
            this.clearEventListener();
        }

        private onResponse(data:any):void {
            this._responseData = data;
            this._isResponseSucceed = false;
            //标识,0表示成功,其他表示错误码,可以进行解析弹tips提醒
            if (this._responseData && this._responseData.hasOwnProperty(core.Config.requestKey)) {
                this._isResponseSucceed = this._responseData[core.Config.requestKey] == 0;
            }
            this._errorCode = this._responseData ? this._responseData[core.Config.requestKey] : ProxyErrorCode.ERROR_DATA;
            this._isRequestSucceed = true;

            if (this._isResponseSucceed) {
                this.dispatchEvent(new RequestEvent(RequestEvent.RESPONSE_SUCCEED, this));
                core.postNotification(RequestNotice.RESPONSE_SUCCEED,data,this);
                invokeHook(hooks.network,'onResponseSuccess',this);
            } else {
                this.dispatchEvent(new RequestEvent(RequestEvent.RESPONSE_ERROR, this));
                core.postNotification(RequestNotice.RESPONSE_ERROR,data,this);
                invokeHook(hooks.network,'onResponseError',this);
            }
            invokeHook(hooks.network,'onReponse',this);
        }

        private onError(event:egret.IOErrorEvent):void {
            console.log("request error : " + event);
            this._isRequestSucceed = false;
            this._errorMessage = "请求失败";
            this._errorCode = ProxyErrorCode.ERROR_REQUEST;
            this.clearEventListener();

            this.dispatchEvent(new RequestEvent(RequestEvent.REQUEST_FAIL, this));
            core.postNotification(RequestNotice.REQUEST_FAIL,this);
            invokeHook(hooks.network,'onRequestError',this);
        }

        private onProgress(event:egret.ProgressEvent):void {
            // console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
        }

        public clearEventListener():void {
            egret.clearTimeout(this._timeoutId);
            this._request.removeEventListener(egret.Event.COMPLETE,this.onComplete,this);
            this._request.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
            this._request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onProgress,this);
            this._request.abort();
        }

        get needReload():boolean {
            return this._requestInfo.reload;
        }

        public get isTimeout():boolean {
            return this._isTimeout;
        }

        public get requestInfo():IRequestInfo {
            return this._requestInfo;
        }

        public get responseData():any {
            return this._responseData;
        }

        public get isResponseSucceed():boolean {
            return this._isResponseSucceed;
        }

        public get isRequestSucceed():boolean {
            return this._isRequestSucceed;
        }

        public get errorMessage():string {
            return this._errorMessage;
        }

        public get errorCode():number {
            return this._errorCode;
        }

        public addParam(key:string, value:any):void {
            this._customParams[key] = value;
        }

        public getParamByName(name:string):any {
            if (!this._requestInfo) {
                return null;
            }
            return this._requestInfo[name];
        }

        public hasParamByName(name:string):boolean {
            if (!this._requestInfo) {
                return false;
            }
            return this._requestInfo.hasOwnProperty(name);
        }

        private _responseData:any;
        private _errorCode:number;
        private _errorMessage:string = "";
        private _isResponseSucceed:boolean = false;
        private _isRequestSucceed:boolean = false;
        private _customParams:any;
    }
}