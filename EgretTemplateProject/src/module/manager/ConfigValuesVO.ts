
/**
 * GameConfigValues_json 配置表vo
 */
class ConfigValuesVO {

    constructor() {
        this.initValue();
    }
    private static _instance: ConfigValuesVO;
    static get instance(): ConfigValuesVO {
        if (!this._instance) {
            this._instance = new ConfigValuesVO();
        }
        return this._instance;
    }

    /** 开始次数恢复上限 */
    public maxJumpGameCount:number;
    /** 开始次数恢复的单位时间（秒） */
    public jumpGameCountRecoverUnit:number;
    /** 开始次数单位时间内恢复的次数 */
    public jumpGameCountRecoverSpeed:number; 
    
    private initValue():void {
        let json = ConfigCenter.getConfigRoot('GameConfigValues_json','key');
        //跳一跳配置数据
        this.maxJumpGameCount = parseInt(ConfigUtil.getGameConfigValue('maxJumpGameCount'));
        this.jumpGameCountRecoverUnit = parseInt(ConfigUtil.getGameConfigValue('jumpGameCountRecoverUnit'));
        this.jumpGameCountRecoverSpeed = parseInt(ConfigUtil.getGameConfigValue('jumpGameCountRecoverSpeed'));
    }

    
}