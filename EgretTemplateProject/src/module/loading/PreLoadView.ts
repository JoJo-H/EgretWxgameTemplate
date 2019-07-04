
class PreLoadView extends egret.Sprite implements RES.PromiseTaskReporter {
    private textField: egret.TextField;
    private progressBar: CustomProgress;
    private bg: ImageC;
    private group: egret.Sprite;
    private rect: egret.Shape;
    private _pretipstr:string;
    private _backFun:Function;
    public constructor() {
        super();
        this._pretipstr="初次加载费水费电";

        let stage = egret.MainContext.instance.stage;
        this.group = new egret.Sprite();
        this.addChild(this.group);
        this.bg = new ImageC("loading_bg");
        this.bg.x = stage.stageWidth / 2 - 50;
        this.bg.y = stage.stageHeight / 2 - 200;
        this.group.addChild(this.bg);
        //
        this.textField = this.createTxt(this._pretipstr, 110, 970, 0x034b45, 24);
        this.textField.width=500;
        // var t1 = this.createTxt("注意自我保护，谨防受骗上当。合理安排时间，享受健康生活。", 164, 1222, 0xb3f7f3, 14);
        // var t2 = this.createTxt("抵制不良游戏，拒绝盗版游戏。适度游戏益脑，沉迷游戏伤身。", 162, 1202, 0xb3f7f3, 14);
        // var t3 = this.createTxt("闽网文〔2018〕0702-036号   文网游备字〔2018〕Ｍ-CSG 0873 号", 120, 1242, 0x1d7e78, 16);
        // var t4 = this.createTxt("著作权人：厦门本捷网络股份有限公司", 220, 1260, 0x1d7e78, 16);
        // var t5:egret.TextField = this.createTxt("", 164, 1222, 0xb3f7f3, 14);
        // t5.textFlow = new egret.HtmlTextParser().parse("如果游戏加载失败,请 <font size=24 color=0xffa800 stroke=1 strokeColor=0xffa800>点我刷新</font>");
        //
            
        this.progressBar = new CustomProgress(500, 20);
        this.progressBar.y = 950;
        this.progressBar.x = stage.stageWidth / 2 - 250;
        this.group.addChild(this.progressBar);
        core.addNotification("updateloadingtip", this.updatetip, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public onAddToStage(): void {
        let stageWidth = egret.MainContext.instance.stage.stageWidth;
        let stageHeight = egret.MainContext.instance.stage.stageHeight;
        var self = this;
        self.rect = new egret.Shape();
        self.rect.graphics.beginFill(0x61bfbf, 1);
        self.rect.graphics.drawRect(0,0,stageWidth,stageHeight);
        self.rect.graphics.endFill();
        self.addChildAt(this.rect,0);
        setTimeout(function () { // 手动处理适配的问题
            var diff = (stageHeight - 1280);
            if (diff < 0) {
                diff = 0;
            }
            self.group.y = diff / 2;
        }, 50);
    }
    //创建文本
    private createTxt(txt: string, x: number, y: number, color: number, size: number): egret.TextField {
        var lbl: egret.TextField = new egret.TextField();
        lbl.touchEnabled = true;
        lbl.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(this._backFun){
                this._backFun();
            }
        },this);
        lbl.text = txt;
        lbl.x = x;
        lbl.y = y;
        lbl.textColor = color;
        lbl.textAlign = "center";
        lbl.size = size;
        this.group.addChild(lbl);
        return lbl;
    }

    public updatetip(str: string,backF = null): void {
        this._backFun = backF;
        this.textField.textFlow = new egret.HtmlTextParser().parse(str);
    }

    //设置加载类型提示
    public setPreTip(str:string):void
    {
       this._pretipstr=str;
    }


    public onProgress(current: number, total: number): void {
        this.textField.text = this._pretipstr+"(" + Math.floor((current / total) * 100) + "%)";
        this.progressBar.setProgress(current, total);
    }

    /**
     * 取消回调
     */
    public onCancel(): void { }
}
window["PreLoadView"] = PreLoadView;