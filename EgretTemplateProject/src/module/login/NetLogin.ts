/**
 * 登录流程
 * 拿到登录用户的信息：区别本地登录或者微信登录：
 * 请求区分列表
 */
class NetLogin {

    private callback: any;
    private wxInfo: Object;
    private bl_gpid: string = "";
    private _areaId:number;
    constructor(callback) {
        this.callback = callback;
        GameHttp.addRequestDefaultParams();
        GameVo.wxInfo ? this.wxInit() : this.localhostLogin();
    }

    localhostLogin() {
        var testObj = LoginSelect.testLoginData;
        this.wxInfo = { "h5game_openid": testObj["loginId"], "user": testObj };
        this.startServerList();
        core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_start'));
    }

    async wxInit() {
        this.wxInfo = {};
        this.wxInfo["user"] = GameVo.wxInfo;
        this.wxInfo["h5game_openid"] = GameVo.wxInfo["h5game_openid"];
        if (this.wxInfo.hasOwnProperty("h5game_openid")) {
            this.startServerList();
        }

        // let res_user: Object = await platform.getUserInfo();
        // var params = "code=" + GameVo.code;
        // var request = new egret.HttpRequest();
        // request.responseType = egret.HttpResponseType.TEXT;
        // request.open(NetCode.WXAPI_PATH + params, egret.HttpMethod.GET);
        // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // request.addEventListener(egret.Event.COMPLETE, () => {
        //     var response = request.response;
        //     if (is.string(response)) this.wxInfo = JSON.parse(response);
        //     this.wxInfo["user"] = res_user;
        //     core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_1'));
        //     if (this.wxInfo.hasOwnProperty("openid")) {
        //         this.startServerList();
        //     }
        //     else {
        //         console.log("获取openId:", this.wxInfo);
        //     }
        // }, this);
        // request.addEventListener(egret.IOErrorEvent.IO_ERROR, (event) => {
        //     var request = <egret.HttpRequest>event.currentTarget;
        //     console.log("获取微信信息失败重新获取 : " + request);
        //     core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_2'));
        // }, this);
        // core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_1'));
        // request.send();
    }

    //请求服务器列表
    startServerList(): void {
        // gpId , openId,areaInfo:[{areaId:2,serverUrl:"http://bj.appcup.com:10038/s2/socket_command_route.ac",status:0}]
        core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_8'));
        GameHttp.request(PLogin.getServerPath(this.wxInfo["h5game_openid"],NetCode.LB_PATH))
        .then((response) => {
            this.bl_gpid = response["gpId"];
            var areaInfo = response["areaInfo"] ? response["areaInfo"][0] : null;
            if (areaInfo) {
                    var state = areaInfo["status"]?areaInfo["status"]:0;
                    if(state == 1){
                        GameHttp.httpEnable=false;
                        let prompt : core.IPromptInfo = {
                            title : "游戏维护中",
                            text: "游戏维护中,稍后重试",
                            yes: '重试',
                            type: core.PromptState.confirm,
                            no: ''
                        };
                        core.UI.addBox(core.PromptBox,prompt)
                        .then((box:core.PromptBox)=>{
                            box.show().then(()=>{
                                this.startServerList();
                            })
                        });
                        return;
                    }
                    NetCode.HTTP_SERVER = areaInfo.serverUrl;
                    this._areaId=parseInt(areaInfo.areaId);
                    core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_6'));
                    this.startLogin();
            }
            else {
                core.UI.tooltip(ConfigCenter.getLanguageName('login_notice_4'));
                core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_5'));;
            }
        }).catch((err) => {
            core.UI.tooltip('请求区服失败');
        });;
    }

    /** 开始登录 */
    startLogin(): void {
        core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_notice_9'));
        GameHttp.request(PLogin.getUserId(this.wxInfo["h5game_openid"],this._areaId))
        .then((response)=>{
            this.loginSuccess(response);
        }).catch((error)=>{
            this.loginFail(error);
        });
    }

    /** 登录成功
     * exist ：0表示新用户需要注册
     * gpId ： 该用户的gpId
     */
    private loginSuccess(data: any) {
        let query: Object = GameVo.pageQueue;
        let targetGpId : string = "";
        let p : number = 0;
        if (query && query["query"] && query["query"]["gpId"]) {
            targetGpId = query["query"]["gpId"];
            p = query["query"]["p"];
            if(!isNaN(p)) {
                p = parseInt(p+"");
            }
        }
        let fromGpId = p == GameVo.getP() ? targetGpId : "";
        if (data.exist == 0) {
            /** 注册玩家信息 */
            let root: any = {
                "command": NetCode.CREAT_USER,
                "areaId": this._areaId,
                "loginId": this.wxInfo["h5game_openid"],
                "name": this.wxInfo["user"]["nickName"],
                "sex": this.wxInfo["user"]["sex"],
                "icon": this.wxInfo["user"]["avatarUrl"],
                "fromGpId": fromGpId ? fromGpId : "",
                "useGpId": this.bl_gpid
            }
            GameHttp.request(PUser.createUser(this._areaId,this.wxInfo["h5game_openid"], this.bl_gpid,
            this.wxInfo["user"]["nickName"],this.wxInfo["user"]["sex"],this.wxInfo["user"]["avatarUrl"],
            fromGpId)).then(()=>{
                this.getUserInfoSuccess();
            }).catch(()=>{
                this.getUserInfoFail();
            });
        } else {
            /** 获取玩家信息 */
            GameHttp.gpId = data.gpId;
            core.network.addGlobalParams('gpId',data.gpId);
            GameHttp.request(PUser.getInfo()).then(()=>{
                this.getUserInfoSuccess();
            }).catch(()=>{
                this.getUserInfoFail();
            });
        }
    }

    private getUserInfoSuccess(): void {
        core.postNotification("updateloadingtip", ConfigCenter.getLanguageName('login_success'));
        if(this.callback){
            this.callback();
            this.callback = null;
        }
    }

    private getUserInfoFail(): void {
        core.UI.tooltip(ConfigCenter.getLanguageName('login_player_info_fail'));
    }

    private loginFail(data): void {
        if (!data) core.UI.tooltip(ConfigCenter.getLanguageName('login_register_fail'));
    }

    private registerFail(data): void {
        core.UI.tooltip(ConfigCenter.getLanguageName('login_fail'));
    }
}