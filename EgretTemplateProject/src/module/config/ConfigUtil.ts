// TypeScript file

class ConfigUtil {

    /**
     * 通过经验判断计算角色等级
     */
    static getPalyerLevelByExp(exp): number {
        let level;
        let expList = RES.getRes("GameConfigPlayerLevel_json")["root"];
        let length = expList.length;
        for (let i = 0; i < length; i++) {
            if (exp < expList[i].exp) {
                return level;
            }
            else {
                level = expList[i].level;
            }
        }
        return level;
    }

    /**
     * 通过经验判断计算职员等级
     */
    static getWorkerLevelByExp(exp): Object {
        let result;
        let expList = RES.getRes('GameConfigWorkerLevel_json')["root"];
        let length = expList.length;
        for (let i = length - 1; i >= 0; i--) {
            if (exp >= expList[i].exp) {
                return expList[i];
            } else {
                result = expList[i];
            }
        }
        return result;
    }

    /**
     * 根据职员id获取配置的职员信息
     */
    static getWorkerConfigById(workerId: number): any {
        let item = ConfigCenter.getConfigItem("GameConfigWorker_json", workerId, 'id');
        return item;
    }

    /**
    * 根据病人id获取配置的病人信息
    */
    static getPatientConfigById(patientId: number): any {
        let item = ConfigCenter.getConfigItem("GameConfigPatient_json", patientId, 'id');
        return item;
    }

    static getGameConfigValue(key: string): any {
        let value = ConfigCenter.getValue("GameConfigValues_json", key, 'value', 'key');
        return value;
    }

    //动态加载json
    static async loadJson(...cfgNames): Promise<any> {
        let list: Promise<any>[] = [];
        for (let name of cfgNames) {
            list.push(RES.getResAsync(name));
        }
        await Promise.all(list);
    }
    //动态加载json，需要加载中遮罩
    static async loadJsonWithMask(...cfgNames): Promise<any> {
        core.showSimpleLoading();
        let list: Promise<any>[] = [];
        for (let name of cfgNames) {
            list.push(RES.getResAsync(name));
        }
        await Promise.all(list);
        core.hideSimpleLoading();
    }

}