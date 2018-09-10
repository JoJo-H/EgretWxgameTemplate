

module core {


    export class AsyncServerTime {

        private _serverTime: number; //单位毫秒
        private _clientTime: number; //单位毫秒 得到服务端时间戳时的客户端时间戳（用来判断时间间隔）
        constructor() {

        }

        //毫秒
        get serverTime(): number {
            let nowTime = new Date().getTime();
            if (!this._serverTime) {
                return nowTime;
            }
            return (this._serverTime * 1000 + nowTime - this._clientTime);
        }

        //更新服务器数据
        set serverTime(time: number) {
            if(!this._serverTime) {
                //定时更新服务器时间，每隔固定时间
                TimerManager.instance.addKeyTick('AsyncServerTime',this.requestSeverTime,this,30000,0);
            }
            this._serverTime = time;
            this._clientTime = new Date().getTime();
        }

        private requestSeverTime(): void {
            //todo 同步服务器时间
            // core.request()
            // GameHttp.request({ command: NetCode.SYNC_TIME, 'tc': Math.floor(this.serverTime / 1000) });
        }
    }

    export function getServerTime():number {
        return core.singleton(AsyncServerTime).serverTime;
    }
    export function setServerTime(time: number):void {
        core.singleton(AsyncServerTime).serverTime = time;
    }
}