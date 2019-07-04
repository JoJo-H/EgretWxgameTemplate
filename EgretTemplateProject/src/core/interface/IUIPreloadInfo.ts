

module core {

    /** ui预加载信息 */
    export interface IUIPreloadInfo {
        group ?: string[];
        assets ?: string[];
        promise ?: Promise<any>[];
    }
}