module core {
    export interface IQueueBoxInfo {
        clzName : string;
        callback : core.Callback;
        args ?: any[];
    }
}