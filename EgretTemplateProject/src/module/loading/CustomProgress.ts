
class CustomProgress extends egret.Sprite {
    private _bar:ImageC;
    private _w:number;
    private _h:number;
    private _cur:number;
    private _max:number;

    public constructor(w:number = 0, h:number = 0) {
        super();
        let proBg: ImageC = new ImageC("loading_di");
        let proImg: ImageC = new ImageC("loading_ding");
        this.width=proBg.width = proImg.width=w;
        this._bar = proImg;
        this._w = w;
        this._h = h;

        this.addChild(proBg);
        this.addChild(this._bar);
        this._bar.scaleX=this._cur = 0;
        this._max = 100;
    } 
 

    /**
     * 设置进度
     * @param cur
     * @param max
     */
    public setProgress(cur:number, max:number):void {
        if (cur == 0 && max == 0) {
             this._bar.scaleX = 0;
            return;
        }
        this._cur = cur;
        this._max = max;
        var scale:number = cur / max;
        this._bar.scaleX = scale;
    }

    /**
     * 销毁
     */
    public destroy():void {
        this.removeChildren();
    }
}
window['CustomProgress'] = CustomProgress;