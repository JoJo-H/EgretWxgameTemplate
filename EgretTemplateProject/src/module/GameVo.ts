

class GameVo {

    /** 是否需要压缩 */
    public static needZip : boolean = false;

    /** 游戏启动参数 */
    static pageQueue : any;
    static isIos : boolean = false;
    static wxInfo : any;

    /** 是否激活，在前台 */
    public static IsActive: boolean = true;
    public static httpEnable : boolean = true;
    public static isDedeg : boolean = false;

    //版本信息
    public static assetVersion : string = "";
    public static resourceVersion : string = "1.0.01";
    public static configVersion : string = "";

    /** 远程资源地址 */
    public static RES_PATH : string = `http://127.0.0.1:3333/EgretWxgameTemplate/EgretTemplateProject_wxgame_remote/${GameVo.resourceVersion}/resource`;


    static getP():number {
        return GameVo.isIos ? 1 : 2;
    }
}