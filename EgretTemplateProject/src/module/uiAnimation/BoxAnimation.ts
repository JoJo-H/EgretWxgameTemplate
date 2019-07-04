class BoxAnimation extends UiAnimation{

    constructor(component:egret.DisplayObjectContainer) {
        super(component);
    }

    open():Promise<void> {
        return new Promise((resolve,reject)=>{
            let boxGroup:eui.Group =  <eui.Group>this._component.getChildByName("boxGroup");
            let maskBg:eui.Image = this._component["maskBg"];
            if(maskBg) {
                maskBg.alpha = 0;
                maskBg.scaleX = maskBg.scaleY = 0;    
                egret.Tween.get(maskBg).to({scaleX:1, scaleY:1, alpha:1}, 150).call(() => {
                    egret.Tween.removeTweens(maskBg);
                }, this);
            }
            if(boxGroup) {
                boxGroup.alpha = 0;
                boxGroup.scaleX = boxGroup.scaleY = 0;
                egret.Tween.get(boxGroup).to({scaleX:1, scaleY:1, alpha:1}, 150).call(() => {
                    egret.Tween.removeTweens(boxGroup);
                    resolve();
                }, this);
            } else {
                resolve();
            }
        });
    }

    close():Promise<void> {
        return new Promise((resolve,reject)=>{
            let boxGroup:eui.Group =  <eui.Group>this._component.getChildByName("boxGroup");
            let maskBg:eui.Image = this._component["maskBg"];
            if(maskBg) {
                egret.Tween.get(maskBg).to({scaleX:0, scaleY:0, alpha:0}, 150).call(() => {
                    egret.Tween.removeTweens(maskBg);
                }, this);
            }
            if(boxGroup) {
                egret.Tween.get(boxGroup).to({scaleX:0, scaleY:0, alpha:0}, 150).call(() => {
                    egret.Tween.removeTweens(boxGroup);
                    resolve();
                }, this);
            } else {
                resolve();
            }
        });
    }
}