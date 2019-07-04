 /**
  * 后端请求统一处理类
 */
class GameHttp  {
    public static readonly IsGet = false;
    static gpId="";
    static p : number = 0;
    static _uniqueID = "";
    static debughttp:any;
    static httpEnable=true;

    static addRequestDefaultParams():void {
        if(this._uniqueID == ""){
            this._uniqueID = core.network.generateUUID();
        }
        core.network.addGlobalParams("mac",this._uniqueID);
        core.network.addGlobalParams("gpId",GameHttp.gpId);
        core.network.addGlobalParams("p",GameVo.getP());
        core.network.addGlobalParams("versionCode",NetCode.versionCode);
        core.Config.httpBase64 = true;
        core.Config.httpRequestMethod = egret.HttpMethod.POST;
    }

    private static ingoreList = [NetCode.GET_USER_INFO_BY_ID,NetCode.BACK_PAY];
    static request(info:core.IRequestInfo):Promise<any> {
        // if( !GameHttp.httpEnable && GameHttp.ingoreList.indexOf(info.command) == -1 &&  RequestCacheData.instance.wxInfo){
        //     return Promise.reject();
        // }
        let requestCacheData:RequestCacheData = RequestCacheData.instance;
        let nowTime:number = requestCacheData.serverTime+0;
        nowTime  = nowTime ? nowTime : new Date().getTime();
        if(egret.localStorage.getItem("request_mac") == "") {
            egret.localStorage.setItem("request_mac", nowTime + "") 
        }
        let params = info.params;
        info.params = {};
        info.params['root'] = params; 
        if(!info.params.hasOwnProperty("tc")){
            info.params['tc'] = Math.floor(nowTime/1000);
        }
        info.params['opId'] = core.network.generateUUID();
        info.params['sign'] = core.network.getSign(info.params['root']);
        console.log('GameHttp.request::',info);
        return core.request(info);
    }
  
}