module core {
    export interface TooltipInfo {
        text:string,
        size?:number;
        color?:number;
        delay?:number;
    }

    export class Tooltip{
        private _items:TooltipItem[];
        private _tooltipLayer : eui.UILayer;
        constructor(layer){
            this._tooltipLayer = layer;
            this._items = [];
            display.setFullDisplay(this);
        }

        show(arg:TooltipInfo|string, skinName:string = undefined):void {

            var info : TooltipInfo;
            if(is.string(arg)) {
                info = {text: <string>arg};
            }else {
                info = <any>arg;
            }
            if (!obj.hasValue(info,'color')) {
                info.color = 0;
            }
            if (!obj.hasValue(info,'size')) {
                info.size = 20;
            }
            if (!obj.hasValue(info,'delay')) {
                info.delay = 1500;
            }

            var item : TooltipItem = pool.getPool(TooltipItem).pop(info,skinName);
            this.createItem(item,info.delay);
        }

        private createItem(item:TooltipItem, delay):void {
            this._tooltipLayer.addChild(item);
            this._items.push(item);

            let animation = item.getAnimation();
            animation.show()
            .then(()=>{
                return animation.delay(delay);
            })
            .then(()=>{
                return animation.close();
            })
            .then(()=>{
                this.removeItem(item);
            });
            egret.callLater(() => {
                let layout = new TooltipLayout();
                layout.layout(this._items);
            }, this);
        }

        private removeItem(item:any):void {
            var idx = this._items.indexOf(item);
            if (idx >= 0) {
                this._items.splice(idx, 1);
                pool.getPool(TooltipItem).push(item);
                display.removeFromParent(item);
            }
        }

        customView(skinName:string, data:any, delay:number = 1500):void {
            var item:TooltipItem = pool.getPool(TooltipItem).pop(data, skinName)
            this.createItem(item, delay);
        }
    }

    export class TooltipItem extends core.BaseComponent {
        public data:TooltipInfo;
        constructor() {
            super();
            this.setAnimation(new TooltipAnimation(this))
        }

        public init(info:any, skinName:string):void {
            if (skinName) {
                this.skinName = skinName;
            } else {
                this.skinName = 'TooltipSkin';
            }
            this.data = info;
            this.onEnter();
        }

        public onEnter():void {
            if (this.label) {
                if (this.data.text.indexOf('<font') > -1) {
                    this.label.textFlow = new egret.HtmlTextParser().parser(this.data.text);
                } else {
                    this.label.text = this.data.text;
                }
            }
        }

        public onExit():void{
            
        }
        private label:eui.Label;
    }

    export class TooltipAnimation implements IUiAnimation {
        private _item:TooltipItem;
        constructor(item){
            this._item = item;
        }
        open():Promise<any>{
            return Promise.resolve();
        }

        show():Promise<any> {
            return new Promise<any>((resolve,reject)=>{
                egret.Tween.removeTweens(this._item);
                this._item.visible = true;
                this._item.scaleX = this._item.scaleY = 2;
                this._item.alpha = 1;
                egret.Tween.get(this._item).to({scaleX: 1, scaleY: 1},300).call(()=>{
                    resolve();
                });
            });
        }

        delay(delay):Promise<any> {
            return new Promise<any>((resolve,reject)=>{
                egret.Tween.get(this._item).wait(delay).call(()=>{
                    resolve();
                });
            });
        }

        close():Promise<any> {
            return new Promise<any>((resolve,reject)=>{
                egret.Tween.get(this._item).to({alpha: 0},200).call((()=>{
                    egret.Tween.removeTweens(this._item);
                    resolve();
                }));
            });
        }
    }

    export class TooltipLayout {
        getTotalHeight(items:BaseComponent[], offsetY:number = 0):number {
            return items.reduce((a,b) => {
                return a + b.height;
            }, 0) + items.length * offsetY;
        }

        layout(items:BaseComponent[]):void {
            if (items.length == 0) {
                return;
            }

            var offsetY:number = 5;

            var len = items.length;

            var w = core.stage.stageWidth;
            var h = core.stage.stageHeight;

            var minY = h / 2;
            var maxY = h * 0.8;

            var y = this.getTotalHeight(items, offsetY);

            if (y < minY) {
                y = minY;
            } else if (y > maxY) {
                y = maxY;
            }

            var totalH = 0;
            for (var i = len - 1; i >= 0; i --) {
                display.setAnchor(items[i], 0.5);
                items[i].y = y - totalH;
                totalH += items[i].height + offsetY;
                items[i].x = w / 2;
            }
        }
    }

    window['Tooltip'] = Tooltip;
}