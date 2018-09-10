

class DoubleKeyConfig {
    
    private _configData : any = {};
    /**
     * 获取配置表下root转换成的object,双key
     * @param cfgName 配置文件名称
     * @param keyName1 配置表中每项的标识符
     * @param keyName2 配置表中每项的第二个标识符
     */
    private getConfigRoot(cfgName:string, keyName1:string,keyName2:string):any {
        if(!this._configData.hasOwnProperty(cfgName)) {
            let l : any[] = RES.getRes(cfgName).root;
            let json = {};
            l.forEach((item)=>{
                let id = item[keyName1] + '_' + item[keyName2];
                json[id] = item;
            });
            this._configData[cfgName] = json;
        }
        return  this._configData[cfgName];
    }

    public getConfigItem(cfgName:string, keyName1:string,keyV1:any,keyName2:string,keyV2:any):any{
        let json = this.getConfigRoot(cfgName,keyName1,keyName2);
        let key = keyV1 + '_' +keyV2;
        return json[key];
    }

    public static getConfig(cfgName:string, keyName1:string,keyName2:string):any{
        return core.singleton(DoubleKeyConfig).getConfigRoot(cfgName,keyName1,keyName2);
    }

    public static getConfigItem(cfgName:string, keyName1:string,keyV1:any,keyName2:string,keyV2:any):any{
        return core.singleton(DoubleKeyConfig).getConfigItem(cfgName,keyName1,keyV1,keyName2,keyV2);
    }
    //病人图鉴
    public static getPatientIllustrationConfigItem(patientId,star):any{
        return core.singleton(DoubleKeyConfig).getConfigItem('GameConfigPatientIllustration_json','patientId',patientId,'star',star);
    }

    //签到
    public static getSigninConfigItem(day,weekGroup):any{
        return core.singleton(DoubleKeyConfig).getConfigItem('GameConfigSignIn_json','day',day,'weekGroup',weekGroup);
    }

}