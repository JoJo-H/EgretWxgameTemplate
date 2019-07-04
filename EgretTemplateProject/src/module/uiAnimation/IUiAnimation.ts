

class UiAnimation implements core.IUiAnimation {

    protected _component : egret.DisplayObjectContainer;
    constructor(component:egret.DisplayObjectContainer) {
        this._component = component;
    }

    open():Promise<void> {
        return Promise.resolve();
    }

    close():Promise<void> {
        return Promise.resolve();
    }
}