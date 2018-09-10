
module core {

    export class SimpleLoading extends BaseComponent {

        constructor(){
            super();
            this.skinName = 'SimpleLoadingSkin';
        }

        onEnter():void {
            super.onEnter();
        }

        onExit():void{
            super.onExit();
        }

        private _showCount:number = 0;

        show():void {
            if (this._showCount == 0) {
                this.visible = true;
                this.runAnimation(()=>{
                    
                });
            }
            this._showCount ++;
        }

        hide():void {
            this._showCount--;
            if (this._showCount == 0) {
                this.stopAnimation(() => {
                    this.visible = false;
                });
            }
        }

        forceHide():void {
            this._showCount = 0;
            this.stopAnimation(() => {
                this.visible = false;
            });
        }

        getShowCount():number {
            return this._showCount;
        }

        private runAnimation(callback:Function):void{
            var mask = this.getChildView("mask");
            var loadingShape = this.getChildView("loadingShape");
            if (mask) {
                egret.Tween.removeTweens(mask);
                mask.alpha = 0;
                egret.Tween.get(mask).to({alpha:1},200).call(callback);
            }
            if (loadingShape) {
                egret.Tween.removeTweens(loadingShape);
                loadingShape.alpha = 0;
                loadingShape.rotation = 0;
                egret.Tween.get(loadingShape).to({alpha:1},100).call(()=>{
                    egret.Tween.get(loadingShape,{loop:true}).to({rotation: 360},1000);
                });
            }
        }
        private stopAnimation(callback:Function):void{
            var mask = this.getChildView("maskRect");
            var loadingShape = this.getChildView("loadingShape");
            if (mask) {
                egret.Tween.get(mask).to({alpha:0},100).call(()=>{
                    egret.Tween.removeTweens(mask);
                });
            }
            if (loadingShape) {
                egret.Tween.get(loadingShape).to( {alpha:0},100).call(() => {
                    egret.Tween.removeTweens(loadingShape);
                    if (callback) {
                        callback();
                    }
                });
            }
        }
    }
    window['SimpleLoading'] = SimpleLoading;

    var _loading : SimpleLoading;
    function getSimpleLoading():SimpleLoading{
        if(!_loading){
            _loading = new SimpleLoading();
            _loading = <SimpleLoading>UI.addTooltipSync(_loading);
        }
        return _loading;
    }
    /**
     * 显示简单载入条
     */
    export function showSimpleLoading():void {
        let loading = getSimpleLoading();
        loading.show();
    }

    /**
     * 隐藏简单载入条
     */
    export function hideSimpleLoading():void {
        var loading = getSimpleLoading();
        if(loading.getShowCount() == 0) {
            return;
        }
        loading.hide();
    }

    /**
     * 强制隐藏载入条
     */
    export function forceHideSimpleLoading():void {
        var loading = getSimpleLoading();
        loading.forceHide();
    }
}