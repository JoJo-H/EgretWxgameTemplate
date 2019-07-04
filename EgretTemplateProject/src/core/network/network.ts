
module core {

    export enum ProxyErrorCode {
        ERROR_DATA = -10000,
        TIME_OUT = -10001,
        ERROR_REQUEST = -10002,

        illegalJson = -20001,
        badRequest = -20002,
    }

    export interface IRequestInfo {
        command: number;
        params?: object,

        requestUrl?: string;
        method?: string;        //egret.HttpMethod
        mask?: boolean,
        cache?: boolean,
        reload?: boolean;
    }

    export class network {
        constructor() { }

        //默认的全局请求参数
        public static _globalParams: any = {};
        public static addGlobalParams(key: string, params: any): void {
            this._globalParams[key] = params;
        }

        public static getGlobalParam(key: string): any {
            return this._globalParams[key];
        }

        public static removeGlobalParams(key: string): void {
            delete this._globalParams[key];
        }


        public static paramsToQueryString(...args): string {
            let params: Array<string> = [];
            for (let i: number = 0; i < args.length; i++) {
                let item: Object = args[i];
                for (let key in item) {
                    params.push(key + "=" + item[key]);
                }
            }
            return params.join("&");
        }
        public static paramsToObject(...args):object {
            let obj = {};
            for (let i: number = 0; i < args.length; i++) {
                let item: Object = args[i];
                if(item) {
                    for (let key in item) {
                        obj[key] = item[key];
                    }
                }
            }
            return obj;
        }

        public static formatReqInfo(requestInfo: IRequestInfo): IRequestInfo {
            if (!requestInfo.hasOwnProperty('requestUrl')) {
                requestInfo.requestUrl = core.Config.httpRequestUrl;
            }
            if (!requestInfo.hasOwnProperty('method')) {
                requestInfo.method = core.Config.httpRequestMethod;
            }
            if (!requestInfo.hasOwnProperty('params')) {
                requestInfo.params = {};
            }
            if (!requestInfo.hasOwnProperty('mask')) {
                requestInfo.mask = false;
            }
            if (!requestInfo.hasOwnProperty('cache')) {
                requestInfo.cache = false;
            }
            if (!requestInfo.hasOwnProperty('reload')) {
                requestInfo.reload = true;
            }
            return requestInfo;
        }

        public static tranObjToArrBuffer(contentObj): string {
            let originalStr: string = JSON.stringify(contentObj);
            let bytes: egret.ByteArray = new egret.ByteArray();
            bytes.writeUTFBytes(originalStr);
            let out: string = egret.Base64Util.encode(bytes.buffer);
            return out;
        }
        public static tranArrBufferToObj(out) {
            let arrayBuffer: ArrayBuffer = egret.Base64Util.decode(out);
            let messageBytes: egret.ByteArray = new egret.ByteArray(arrayBuffer);
            messageBytes.position = 0;
            let jsonStr = messageBytes.readUTFBytes(messageBytes.length);
            return JSON.parse(jsonStr);
        }
        public static getSign(root):String{
            let sign : String = JSON.stringify(root)+NetCode.SecretKey;
            sign = this.md5(sign);
            return sign;
        }
        public static md5(obj):String{
             let mdf = new md5();
             return mdf.hex_md5(obj);
        }
        public static generateUUID() : string {
            let s = [];
            let hexDigits = "0123456789yiyuan";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
        
            let uuid : string = s.join("");
            //return "3efb226e119623c6cce32048feffc485";
            return uuid;
        }
    }

    /**
     * 发送网络请求
     * @param type 接口信息对象
     * @returns {PromiseInterface<any>} 异步对象
     */
    export function request(info: IRequestInfo): Promise<any> {
        network.formatReqInfo(info);
        let promise = new Promise((resolve, reject) => {
            let proxy = new NetworkRequest(info);
            proxy.addEventListener(RequestEvent.RESPONSE_SUCCEED, (evt: RequestEvent) => {
                resolve(evt.responseData);
            }, this);

            proxy.addEventListener(RequestEvent.REQUEST_FAIL, (evt: RequestEvent) => {
                reject(evt.responseData);
            }, this);
            proxy.load();
        });
        return promise;
    }


}