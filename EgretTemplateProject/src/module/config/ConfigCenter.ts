class ConfigCenter {
    
    public zipData : any;

    //语言类型,LanguageType枚举值
    public static LANGUAGE_TYPE : LanguageType = 0;
    private static _instance:ConfigCenter;
    constructor() {
    }

    public static get instance():ConfigCenter {
        if(this._instance == null) {
            this._instance = new ConfigCenter();
        }
        return this._instance;
    }

    private static _configData : any = {};
    /**
     * 获取配置表下root转换成的object
     * @param cfgName 配置文件名称
     * @param keyName 配置表中每项的标识符
     */
    static getConfigRoot(cfgName:string, keyName:string = 'id'):any {
        if(!this._configData.hasOwnProperty(cfgName)) {
            let l : any[] = RES.getRes(cfgName).root;
            let json = {};
            l.forEach((item)=>{
                let id = item[keyName];
                json[id] = item;
            });
            this._configData[cfgName] = json;
        }
        return  this._configData[cfgName];
    }

    /**
     * 获取配置表某项数据object 中 的某个字段值
     * @param name 配置文件名称
     * @param keyV 标识符的值
     * @param subkeyName 标识符
     * @param keyStr 配置表中每项的标识符字符串
     */
    static getValue(name:string,keyV:any=null,subkeyName:string=null, keyName:string = 'id'):any {
        let obj = ConfigCenter.getConfigItem(name,keyV,keyName);
        return obj ? obj[subkeyName] : null;
    }

    /**
     * 获取配置表某项数据object
     * @param cfgName 配置文件名称
     * @param keyV 标识符的值
     * @param keyName 配置表中每项的标识符字符串
     */
    static getConfigItem(cfgName:string, keyV:any, keyName:string = 'id'):any
    {
        let json = ConfigCenter.getConfigRoot(cfgName,keyName);
        return keyV != null ? json[keyV] : json;
    }
    
    static getLanguageNameObj(name:string):any {
        let json = this.loadGameConfigLanguage();
        let item = json[name]; 
        return item ? item : {"key":name, "name":name};
    }
    // 从GameConfigLanguage获取名字
    static getLanguageName(name:string):any {
        return ConfigCenter.getLanguageNameObj(name).name;
    }
    //语言表格式化下
    static loadGameConfigLanguage():any{
        if(!this._configData.hasOwnProperty('GameConfigLanguage_json')){
            let configNames = ConfigCenter.getLanguageConfigList();
            let json = {};
            configNames.forEach((cfgName)=>{
                let l : any[] = RES.getRes(cfgName).root;
                l.forEach((item)=>{
                    json[item.key] = item;
                });
            });
            this._configData['GameConfigLanguage_json'] = json;
        }
        return this._configData['GameConfigLanguage_json'];
    }
    //匹配语言表
    private static getLanguageConfigList():string[] {
        let config = RES.config.config;
        let preload : string[] = config.groups.preload;
        let list = [];
        let key = ConfigCenter.LANGUAGE_TYPE == LanguageType.zh ? 'GameConfigLanguage_zh' : 'GameConfigLanguage_en';
        list = preload.filter((name:string)=>{
            return name.indexOf(key) != -1;
        });
        console.log('语言表：',...list);
        return list;
    }

    //获取配置表的的项目总数
    static getConfigItemCount(cfgName):number {
        let l : any[] = RES.getRes(cfgName).root;
        return l.length;
    }

}