
module core {
    export class display {
    
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        static setAnchor(disObj:egret.DisplayObject, anchorX:number, anchorY:number = anchorX):void {
            disObj.anchorOffsetX = disObj.width * anchorX;
            disObj.anchorOffsetY = disObj.height * anchorY;
        }

        static addFliterGray(image:eui.Image):void {
            //颜色矩阵数组
            if(!image) return;
            if(image.filters) return;
            var colorMatrix = [
                0.3,0.6,0,0,0,
                0.3,0.6,0,0,0,
                0.3,0.6,0,0,0,
                0,0,0,1,0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            image.filters = [colorFlilter];
        }
    
        static removeFliterGray(image:eui.Image):void {
            if(image && image.filters) {
                image.filters = null;
            }
        }

        static getChildByName(name, display):egret.DisplayObject {
            var num = display.numChildren;
            for (var i = 0; i < num; i++) {
                var child = display.getChildAt(i);
                if (child instanceof egret.DisplayObjectContainer) {
                    if (child.name == name) {
                        return child;
                    }
                    else {
                        return this.getChildByName(name, child);
                    }
                }
                else if (child.name == name) {
                    return child;
                }
            }
            return null;
        };

         /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        static removeAllChildren(container:egret.DisplayObjectContainer):void {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
        }
    
        /**
         * 移除显示对象,可以是egret的显示对象,也可以是继承组件
         * @param child 子显示对象
         */
        static removeFromParent(child:egret.DisplayObject):void {
            if ( child && child.parent) {
                child.parent.removeChild(child);
            }
        }

        static setFullDisplay(displayObj) {
            displayObj.width = core.stage.stageWidth;
            displayObj.height = core.stage.stageHeight;
        }

        static destoryChildren(container:any):void {
            let children = container.numChildren;
            for (let i = 0; i < children; i ++) {
                let item = container.getChildAt(i);
                if (item instanceof core.BaseComponent) {
                    item.destoryData();
                } else if (item instanceof core.Button) {
                    item.destoryData();
                } else if (item instanceof eui.Group) {
                    this.destoryChildren(item);
                } else if (item instanceof eui.Scroller) {
                    this.destoryChildren(item);
                } else if (item instanceof core.ItemRenderer) {
                    item.destoryData();
                }
            }
        }

        static getHostComponent(display:egret.DisplayObject):core.BaseComponent {
            var host:any = display.parent;
            if (this.isHostComponentType(host)) {
                return host;
            }
            while (host && !(this.isHostComponentType(host))) {
                host = host.parent;
            }
            if (this.isHostComponentType(host)) {
                return host;
            }
            return null;
        }

        static isHostComponentType(host:any):boolean {
            return (host instanceof core.BaseComponent) || (host instanceof core.ItemRenderer);
        }

        /** 获取组件名称 */
        static getComponentName(type):string {
            let compName = "";
            // 是否类类型 否则 实例对象
            if (core.isType(type)) {
                compName = type.prototype[UI.NameKey];
            } else {
                //实例对象的__proto__属性==函数对象的prototype属性
                // compName = type['__proto__'][UI.NameKey];
                // compName = type.constructor.prototype[UI.NameKey];
                compName = type[UI.NameKey];
            }
            return compName;
        }
    }
}