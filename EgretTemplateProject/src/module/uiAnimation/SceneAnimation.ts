

class SceneAnimation extends UiAnimation {

    constructor(component:egret.DisplayObjectContainer) {
        super(component);
    }

    open():Promise<void> {
        return new Promise((resolve,reject)=>{
            var boxGroup:eui.Group =  <eui.Group>this._component.getChildByName("boxGroup");
            if(boxGroup) {
                boxGroup.alpha = 0;
                boxGroup.scaleX = boxGroup.scaleY = 0;
                egret.Tween.get(boxGroup).to({scaleX:1, scaleY:1, alpha:1}, 250).call(() => {
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
            if(boxGroup) {
                egret.Tween.get(boxGroup).to({scaleX:0, scaleY:0, alpha:0}, 250).call(() => {
                    egret.Tween.removeTweens(boxGroup);
                    resolve();
                }, this);
            } else {
                resolve();
            }
        });
    }

}