

class TipAnimation extends UiAnimation{
    constructor(component:egret.DisplayObjectContainer) {
        super(component);
    }

    open():Promise<void> {
        return new Promise((resolve,reject)=>{
            this._component.visible = true;
            this._component.scaleX = this._component.scaleY = 2;
            egret.Tween.get(this._component).to({scaleX: 1, scaleY: 1},300).wait(150).call(() => {
                egret.Tween.removeTweens(this._component);
                resolve();
            }, this);
        });
    }
}