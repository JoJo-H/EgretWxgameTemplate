
enum ExtendType {
    type_farmland = 2,
    type_friends = 3,
    type_assist = 5,
    type_recruit = 7,
    type_patient_remain = 41,
    type_common = -1,
    type_patient_list = 6,
    type_welfare = 1,
    type_hospital = 4,
    type_jump = 8,
    type_international_rescue = 0,
    type_friends2 = 31
}

class SecondRequestHandler {
    private _typeList = {};
    constructor() {
    }

    /** 请求数据 */
    afterLoginHanler(): void {
        GameInitHandler.instance.initGame();
        //上报交互组件数据
        if(PlatformUtil.isWxPlatform()){
            // mgplugin.enterReport(platform.appId,GameHttp.gpId);
        }

        //请求
        // this.getFriendInfo();
    }

    /** 是否缓存了 */
    isCached(type: number): boolean {
        return this._typeList[type];
    }

    delCacheType(type: number): void {
        if (this._typeList.hasOwnProperty(type)) {
            this._typeList[type] = null;
            delete this._typeList[type];
        }
    }

    /** 好友相关数据 */
    getFriendInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._typeList[ExtendType.type_friends]) {
                resolve();
            } else {
                return Promise.all([this.requestFriendInfo()]).then(()=>{
                    resolve();
                }).catch(()=>{
                    console.log("请求失败，请稍后重试。");
                    reject();
                });
            }
        });
    }

    requestFriendInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('请求好友数据');
            GameHttp.request(PUser.getInfoSecond(ExtendType.type_friends))
            .then((res)=>{
                this._typeList[ExtendType.type_friends] = true;
                resolve();
            }).catch((err)=>{
                console.log("请求失败，请稍后重试。");
                reject();
            });
        });
    }

}