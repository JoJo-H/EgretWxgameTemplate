
/**
 * 定时器管理器
 * 本类为setTimeout及setInterval和Timer的替代实现，主要是方便程序中Timer事件的生命周期管理，使用起来更为便利。
 * 程序中如用到setTimeout，setInterval及Timer的地方应尽量选择此方案。
 */
class TimerManager {

    private static s_instance: TimerManager;

    private m_tickList: TickData[];

    public constructor() {
        if (TimerManager.s_instance) {
            throw new Error('单例类不可实例化');
        }
        egret.startTick(this.onTick, this);
        this.m_tickList = [];
    }

    public static get instance(): TimerManager {
        if (TimerManager.s_instance == null) {
            TimerManager.s_instance = new TimerManager();
        }
        return TimerManager.s_instance;
    }

    private clearUnvalidData(): void {
        let len = this.m_tickList.length;
        for (let i = len - 1; i >= 0; i--) {
            let tick = this.m_tickList[i];
            if (!tick.isValid && !tick.endCallback) {
                this.m_tickList.splice(i, 1);
            }
        }
    }

    private onTick(timeStamp: number): boolean {
        let dataList: TickData[] = this.m_tickList.concat();
        let needRemove: boolean = false;
        for (let i: number = 0, iLen: number = dataList.length; i < iLen; i++) {
            let tickData: TickData = dataList[i];
            if ((timeStamp - tickData.timestamp) > tickData.delay) {
                if (tickData.isValid) {
                    tickData.timestamp = timeStamp;
                    tickData.count++;
                    if (tickData.callback) {
                        let t: number = egret.getTimer();
                        tickData.callback.call(tickData.thisObj, tickData);
                        let t1: number = egret.getTimer();
                        if (t1 - t > 2) {
                            // egret.log(`tick回调耗时:${t1 - t}`);
                        }
                    }
                    if (tickData.count == tickData.maxCount) {
                        tickData.isValid = false;
                    }
                } else {
                    if (tickData.count == tickData.maxCount) {
                        if (tickData.endCallback) {
                            tickData.endCallback.call(tickData.thisObj, tickData);
                            tickData.endCallback = null;
                        }
                        needRemove = true;
                    }
                }
            }
        }
        if (needRemove) {
            this.clearUnvalidData();
        }
        return false;
    }
    /**
     * 添加计时器
     * @param  {Function} callback  回调函数，每周期执行一次回调函数
     * @param  {any} thisObj        this绑定
     * @param  {number} delay       执行周期执行，延迟delay毫秒后执行。
     * @param  {number} replayCount 执行次数，当replayCount <= 0时为无限执行
     * @param  {} ...args           透传参数
     */
    public addTick(callback: Function, thisObj: any, delay: number, replayCount: number, ...args): TickData {
        let dataList: TickData[] = this.m_tickList;
        if (!dataList) {
            dataList = [];
            this.m_tickList = dataList;
        }
        let tick: TickData = new TickData(callback, thisObj);
        tick.delay = delay;
        tick.count = 0;
        tick.maxCount = replayCount <= 0 ? Number.MAX_VALUE : replayCount;
        tick.args = args;
        tick.timestamp = egret.getTimer();
        tick.isValid = true;
        dataList.push(tick);
        return tick;
    }
    /**
     * 添加计时器
     * @param  {string} tickKey     定时器的key
     * @param  {Function} callback  回调函数，每周期执行一次回调函数
     * @param  {any} thisObj        this绑定
     * @param  {number} delay       执行周期执行，延迟delay毫秒后执行。
     * @param  {number} replayCount 执行次数，当replayCount <= 0时为无限执行
     * @param  {} ...args           透传参数
     */
    public addKeyTick(tickKey: string, callback: Function, thisObj: any, delay: number, replayCount: number, ...args): TickData {
        let tick = this.getTickData(tickKey, thisObj);
        if (tick && !tick.isValid) {
            this.removeTicksByKeyAndContext(tickKey, thisObj);
        }
        if (!tick) {
            tick = this.addTick(callback, thisObj, delay, replayCount, ...args);
            tick.tickKey = tickKey;
        }
        return tick;
    }
    /**
     * 获取定时器数据
     * @param tickKey 
     * @param thisObj 
     */
    public getTickData(tickKey, thisObj): TickData {
        return this.m_tickList.find((tickData) => {
            return tickData.tickKey == tickKey && tickData.thisObj == thisObj;
        });
    }
    /**
     * 通过回调函数移除对应监听
     * @param  {Function} callback  回调函数
     * @param  {any} thisObj    this绑定
     */
    public removeTick(callback: Function, thisObj: any): void {
        let dataList: TickData[] = this.m_tickList;
        if (dataList) {
            for (let i: number = dataList.length; i > 0; i--) {
                let data: TickData = dataList[i - 1];
                if (!data.isValid || (data.callback == callback && data.thisObj == thisObj)) {
                    dataList.splice(i - 1, 1);
                }
            }
        }
    }
    /**
     * 移除this绑定相关的计时器
     * @param  {any} thisObj
     */
    public removeTicks(thisObj: any): void {
        let dataList: TickData[] = this.m_tickList;
        if (dataList) {
            for (let i: number = dataList.length; i > 0; i--) {
                let data: TickData = dataList[i - 1];
                if (!data.isValid || data.thisObj == thisObj) {
                    dataList.splice(i - 1, 1);
                }
            }
        }
    }
    /**
     * 移除tickKey绑定相关的计时器
     * @param  {string} tickKey
     */
    public removeTickByKey(tickKey: string): void {
        let dataList: TickData[] = this.m_tickList;
        if (dataList) {
            for (let i: number = dataList.length; i > 0; i--) {
                let data: TickData = dataList[i - 1];
                if (!data.isValid || data.tickKey == tickKey) {
                    dataList.splice(i - 1, 1);
                }
            }
        }
    }
    /**
     * 移除tickKey绑定相关的计时器
     * @param tickKey 
     * @param thisObj 
     */
    public removeTicksByKeyAndContext(tickKey: string, thisObj: any): void {
        let dataList: TickData[] = this.m_tickList;
        if (dataList) {
            for (let i: number = dataList.length; i > 0; i--) {
                let data: TickData = dataList[i - 1];
                if (!data.isValid || (data.tickKey == tickKey && data.thisObj == thisObj)) {
                    dataList.splice(i - 1, 1);
                }
            }
        }
    }
    /**
     * 获取当前的定时器
     * @param type 0：全部  1：有效的 2：无效的
     */
    public getTicks(type: number = 0): TickData[] {
        if (type == 0) return this.m_tickList;
        let list = this.m_tickList.filter((data: TickData) => {
            return (type == 1 && data.isValid) || (type == 2 && !data.isValid);
        });
        return list;
    }

    /**
     * 移除所有计时器
     */
    public removeAllTicks(): void {
        this.m_tickList.length = 0;
    }
}

class TickData extends core.Callback {

    public tickKey: string;

    public delay: number;

    public count: number;

    public maxCount: number;

    public args: any[];

    public timestamp: number;

    public isValid: boolean;

    public endCallback: Function;

    public constructor(callback: Function, thisObj: any) {
        super(callback, thisObj);
    }
}