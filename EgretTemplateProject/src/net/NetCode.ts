class NetCode{

    static versionCode : number = 118;
    //负载均衡请求地址
    static get LB_PATH():string
    {
        if(window.platform.name == "wxgame"){
            if(GameVo.isIos){
                return "https://h5yy167.hyinteractive.com/socket_command_route.ac";
            }
            else{
                return "https://mqyy.hyinteractive.com/socket_command_route.ac";
            }
        }
        else{
            return "http://bj.appcup.com:10040/socket_command_route.ac";
        }
    }

    static get RES_ROOT_PATH():string {
        // ios 客户端 资源 https://h5yycdn.hyinteractive.com 
        // android 客户端 资源 https://kdyycdn.hyinteractive.com   
        // "https://kdyycdn.hy-game.com/res/";
        // let url:string = GameVo.isIos?"https://h5yycdn.hyinteractive.com/res/":"https://kdyycdn.hyinteractive.com/res/";
        let url = "http://127.0.0.1:3333/EgretWxgameTemplate/EgretTemplateProject_wxgame_remote/";
        return url;
    }

    //加载资源地址
    static get RES_PATH():string {
        return `${NetCode.RES_ROOT_PATH}${GameVo.resourceVersion}/resource`;
    }

    /** 游戏服地址 */
    static HTTP_SERVER:string="";
    /** 区服id */
    static areaId : number = 0;




    //获取服务器地址   
    static GET_SERVERPATH=300;
    /**
     * 添加物品 
     * command:2000
     */
    static TEST_REWARD = 20000;
    /**
     * 登陆流程
     */
    static  SecretKey = "abc@@&&&sdfseeeeeiuiu";
    //加载所有配置
    static  LOAD_CONFIG = 20006;

    //根据loginId以及areaId查询玩家角色ID
    static GET_USER_ID = 20001;

    //根据玩家角色ID获取玩家详情
    static GET_USER_INFO_BY_ID = 20002;
    /** login后请求异步数据 20012 */
    static SECOND_USER_DATA = 20012;

    //同步服务端时间戳
    static SYNC_TIME = 20007;
    //每日一清数据
    static CLEAR_DAILY_INFO = 20009;
    /**
     * 创建玩家角色
     */
    static CREAT_USER = 20003;
    /** 上报错误 */
    static PUSH_ERROE = 20011;
    static GAME_SHARE = 66666;

    //完成引导步骤任务
    static FINISH_GUIDE_TASK = 20010;

    //充值后物品获得
    static UPDATE_RECHARGE_INFO = 20008;
    //获取商品列表接口
    static GET_SHOP_GOODS_LIST = 400;
    //支付
    static GET_PAY_LIST = 400;
    static ADD_PAY = 410;
    static BACK_PAY = 420;
}