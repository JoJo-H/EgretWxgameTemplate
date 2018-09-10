
module core {
    export enum UiType {
        None = 0,
        Scene = 1,
        Common = 2,
        Panel = 3,
        Box = 4,
        Guide = 5,
        TOP = 6,
        Tooltip = 7
    }

    export class UI extends eui.UILayer {

        static NameKey: string = "__class__";

        private _sceneLayer: eui.UILayer;
        private _commonLayer: eui.UILayer;
        private _boxLayer: eui.UILayer;
        private _panelLayer: eui.UILayer;
        private _guideLayer: eui.UILayer;
        private _tooltipLayer: eui.UILayer;
        private _topLayer: eui.UILayer;
        private _containerList: eui.UILayer[] = [];

        private _preloadMap: Map<string, IUIPreloadInfo> = new Map();
        private _boxMaps: Map<string, BaseComponent> = new Map();
        constructor() {
            super();
            if (UI._instance) {
                throw Error("UILayer singleton already constructed!");
            }
            this.touchEnabled = false;
            this._sceneLayer = new eui.UILayer();
            this._sceneLayer.touchEnabled = false;
            this.addChild(this._sceneLayer);

            this._commonLayer = new eui.UILayer();
            this._commonLayer.touchEnabled = false;
            this.addChild(this._commonLayer);

            this._boxLayer = new eui.UILayer();
            this._boxLayer.touchEnabled = false;
            this.addChild(this._boxLayer);

            this._panelLayer = new eui.UILayer();
            this._panelLayer.touchEnabled = false;
            this.addChild(this._panelLayer);

            this._guideLayer = new eui.UILayer();
            this._guideLayer.touchEnabled = false;
            this.addChild(this._guideLayer);

            this._tooltipLayer = new eui.UILayer();
            this._tooltipLayer.touchEnabled = false;
            this.addChild(this._tooltipLayer);

            this._topLayer = new eui.UILayer();
            this._topLayer.touchEnabled = false
            this.addChild(this._topLayer);
            core.display.setFullDisplay(this);
            this._containerList = [this._panelLayer, this._boxLayer, this._topLayer, this._guideLayer, this._commonLayer, this._sceneLayer, this._tooltipLayer];
        }

        private static _instance: UI;
        public static get instance(): UI {
            if (!this._instance) {
                this._instance = new UI();
            }
            return this._instance;
        }

        /** 添加scene */
        private _curScene: BaseComponent;
        runScene(scene: any, ...args): BaseComponent {
            if (this._curScene) {
                this.remove(this._curScene);
                this._curScene = null;
            }
            let newScene: BaseComponent = new scene();
            newScene.setArgs(args);
            newScene.setUiType(UiType.Scene);
            this._curScene = newScene;
            core.display.setFullDisplay(newScene);
            this._curScene.removeing = false;
            this._sceneLayer.addChild(newScene);
            if (core.uiAnimation.scene) {
                core.uiAnimation.scene.open().then(() => {

                });
            }
            return this._curScene;
        }
        getScene(): BaseComponent {
            return this._curScene;
        }

        /** 异步添加弹框 */
        async addBox(comp: { new(); }, ...args): Promise<BaseComponent> {
            return this.addUICompAsync(comp, UiType.Box, args);
        }
        /** 同步添加弹框 */
        public addBoxSync(comp: { new(); }, ...args): BaseComponent {
            return this.addUICompSync(comp, UiType.Box, args);
        }

        /** 异步添加公用模块 */
        async addCommon(comp: { new(); }, ...args): Promise<BaseComponent> {
            return this.addUICompAsync(comp, UiType.Common, args);
        }
        /** 同步添加公用模块 */
        public addCommonSync(comp: { new(); }, ...args): BaseComponent {
            return this.addUICompSync(comp, UiType.Common, args);
        }

        /** 异步添加最上层界面 */
        async addTop(comp: { new(); }, args = []): Promise<BaseComponent> {
            return this.addUICompAsync(comp, UiType.TOP, args);
        }
        /** 同步添加最上层界面 */
        public addTopSync(comp: { new(); }, args = []): BaseComponent {
            return this.addUICompSync(comp, UiType.TOP, args);
        }

        /** 异步添加tip */
        async addTooltip(comp: any, ...args): Promise<BaseComponent> {
            return this.addUICompAsync(comp, UiType.Tooltip, args);
        }
        /** 同步添加tip */
        public addTooltipSync(comp: any, ...args): BaseComponent {
            return this.addUICompSync(comp, UiType.Tooltip, args);
        }
        /** 异步添加引导界面 */
        async addGuide(comp: { new(); }, ...args): Promise<BaseComponent> {
            return this.addUICompAsync(comp, UiType.Guide, args);
        }
        /** 同步添加引导界面 */
        public addGuideSync(comp: { new(); }, ...args): BaseComponent {
            return this.addUICompSync(comp, UiType.Guide, args);
        }

        /** 采用异步的方式添加组件界面 */
        private async addUICompAsync(comp: any, type: UiType, args: any = []): Promise<BaseComponent> {
            let newComp: BaseComponent = this.getUIComponent(comp);
            let compName = core.display.getComponentName(newComp);
            //需要预加载
            if (this._preloadMap.has(compName)) {
                core.showSimpleLoading();
                //并发
                let list = core.getPreloadList(this._preloadMap.get(compName));
                await Promise.all(list);
                core.hideSimpleLoading();
            }
            this.addUIComp(newComp, type, args);
            return newComp;
        }
        /** 采用同步的方式添加组件界面 */
        private addUICompSync(comp: any, type: UiType, args: any = []): BaseComponent {
            let newComp: BaseComponent = this.getUIComponent(comp);
            this.addUIComp(newComp, type, args);
            return newComp;
        }

        /** 获取实例 */
        private getUIComponent(comp: any): BaseComponent {
            let newComp: BaseComponent;
            let compName = core.display.getComponentName(comp);
            newComp = this._boxMaps.get(compName);
            if (!newComp) {
                //是否类类型，否则实例类
                if (core.isType(comp)) {
                    newComp = new comp();
                } else {
                    newComp = comp;
                }
                console.log("newComp:", compName);
            }
            if (core.Config.uiCache) {
                this._boxMaps.set(compName, newComp);
            }
            return newComp;
        }
        /** 添加组件 */
        private addUIComp(newComp: BaseComponent, type: UiType, args: any = []): BaseComponent {
            let compName = core.display.getComponentName(newComp);
            newComp.initEventListener();
            newComp.setArgs(args);
            newComp.setUiType(type);
            newComp.removeing = false;
            let layer = this.getLayer(type);
            layer.addChild(newComp);
            let animation = this.getUiAnimation(type);
            if (animation) {
                animation.open().then(() => {
                    core.postNotification(CoreNotificationDef.UI_ADD, compName, true)
                });
            } else {
                core.postNotification(CoreNotificationDef.UI_ADD, compName, true)
            }
            return newComp;
        }


        addPreload(compName: string, info: core.IUIPreloadInfo): void {
            if (!this._preloadMap.has(compName)) {
                this._preloadMap.set(compName, info);
            }
        }
        isUiCache(compName: string): boolean {
            return this._boxMaps.has(compName)
        }
        getBoxMap(): Map<string, BaseComponent> {
            return this._boxMaps;
        }

        /**
         * 获取弹框界面
         * @param skinName 
         */
        getBox(skinName: string): egret.DisplayObject {
            return this.getUICompByType(skinName, UiType.Box);
        }
        getUICompByType(skinName: string, type: UiType): egret.DisplayObject {
            let layer = this.getLayer(type);
            return layer ? layer.getChildByName(skinName) : null;
        }


        /** 移除界面 */
        remove(comp: BaseComponent): void {
            if (!comp || comp.removeing === true) {
                return;
            }
            comp.removeing = true;
            let uiType = comp.getUiType();
            AudioManager.playerSoundMusic("close_mp3");
            let animation = this.getUiAnimation(uiType);
            if (animation) {
                animation.close().then(() => {
                    this.forceRemove(comp);
                });
            } else {
                this.forceRemove(comp);
            }
        }

        private forceRemove(comp: BaseComponent): void {
            comp.destoryData();
            core.display.removeFromParent(comp);
            let compName = core.display.getComponentName(comp);
            if (!this._isCleaning) {
                core.postNotification(CoreNotificationDef.UI_NORMAL_REMOVE, compName);
            }
            core.postNotification(CoreNotificationDef.UI_REMOVE, compName);
        }

        /** 移除弹框 */
        clearBox(): void {
            this.clearComps(UiType.Box);
        }
        clearPanel(): void {
            this.clearComps(UiType.Panel);
        }
        clearTop(): void {
            this.clearComps(UiType.TOP);
        }
        clearUiByType(...types): void {
            for (let type of types) {
                this.clearComps(type);
            }
        }

        private _isCleaning: boolean = false;
        /** 移除ui */
        private clearComps(type: UiType): void {
            this._isCleaning = true;
            let layer = this.getLayer(type);
            if (layer) {
                let counts = layer.numChildren;
                while (counts > 0) {
                    this.remove(<BaseComponent>layer.getChildAt(0));
                    counts--;
                }
            }
            this._isCleaning = false;
            core.postNotification(CoreNotificationDef.UI_CLEAR, type);
        }

        isExistComp(comp: BaseComponent): boolean {
            let exist: boolean = false;
            for (let layer of this._containerList) {
                exist = (layer.$children.find((child) => { return child == comp; }) ? true : false);
                if (exist) {
                    break;
                }
            }
            return exist;
        }

        isExistCompByName(compName: string): boolean {
            let exist: boolean = false;
            for (let layer of this._containerList) {
                exist = (layer.$children.find((child) => { return core.display.getComponentName(child) == compName; }) ? true : false);
                if (exist) {
                    break;
                }
            }
            return exist;
        }
        private getLayer(type: UiType): eui.UILayer {
            let layer: eui.UILayer;
            switch (type) {
                case UiType.Box:
                    layer = this._boxLayer;
                    break;
                case UiType.Common:
                    layer = this._commonLayer;
                    break;
                case UiType.Panel:
                    layer = this._panelLayer;
                    break;
                case UiType.Guide:
                    layer = this._guideLayer;
                    break;
                case UiType.Tooltip:
                    layer = this._tooltipLayer;
                    break;
                case UiType.Scene:
                    layer = this._sceneLayer;
                    break;
                case UiType.TOP:
                    layer = this._topLayer;
                    break;
            }
            return layer;
        }
        private getUiAnimation(uiType: UiType): IUiAnimation {
            let animation: IUiAnimation;
            if (uiType == UiType.Scene) {
                animation = core.uiAnimation.scene;
            } else if (uiType == UiType.Box) {
                animation = core.uiAnimation.box;
            } else if (uiType == UiType.Common) {
                animation = core.uiAnimation.common;
            } else if (uiType == UiType.Panel) {
                animation = core.uiAnimation.panel;
            } else if (uiType == UiType.Guide) {
                animation = core.uiAnimation.guide;
            } else if (uiType == UiType.Tooltip) {
                animation = core.uiAnimation.tooltip;
            }
            return animation;
        }

        private _tooltip: Tooltip;
        getTooltip(): Tooltip {
            if (!this._tooltip) {
                this._tooltip = new Tooltip(this._tooltipLayer);
            }
            return this._tooltip;
        }
        /**
         * 显示浮动提示
         * @param info 浮动提示参数
         */
        tooltip(info: core.TooltipInfo | string, skinName?: string): void {
            let tip = this.getTooltip();
            if (tip) {
                tip.show(info, skinName);
            }
        }

        customTooltip(skinName: string, data: any, delay?: number): void {
            var tip = this.getTooltip();
            if (tip) {
                tip.customView(skinName, data, delay);
            }
        }



        //*********************************对外接口*****************************************
        static remove(comp: BaseComponent): void {
            UI.instance.remove(comp);
        }
        static tooltip(info: core.TooltipInfo | string, skinName?: string): void {
            UI.instance.tooltip(info, skinName);
        }
        static customTooltip(skinName: string, data: any, delay?: number): void {
            UI.instance.customTooltip(skinName, data, delay);
        }
        static isExistComp(comp: BaseComponent): boolean {
            return UI.instance.isExistComp(comp);
        }
        static isExistCompByName(compName: string): boolean {
            return UI.instance.isExistCompByName(compName);
        }
        static clearBox(): void {
            UI.instance.clearComps(UiType.Box);
        }
        static clearPanel(): void {
            UI.instance.clearComps(UiType.Panel);
        }
        static clearTop(): void {
            UI.instance.clearComps(UiType.TOP);
        }
        static clearUiByType(...types): void {
            for (let type of types) {
                UI.instance.clearComps(type);
            }
        }
        static getBox(skinName: string): egret.DisplayObject {
            return UI.instance.getUICompByType(skinName, UiType.Box);
        }
        static getUICompByType(skinName: string, type: UiType): egret.DisplayObject {
            return UI.instance.getUICompByType(skinName, type);
        }
        static runScene(scene: any, ...args): BaseComponent {
            return UI.instance.runScene(scene, ...args);
        }
        static getScene(): BaseComponent {
            return UI.instance.getScene();
        }
        /** 异步添加弹框 */
        static async addBox(comp: { new(); }, ...args): Promise<BaseComponent> {
            return UI.instance.addBox(comp, args);
        }
        /** 同步添加弹框 */
        static addBoxSync(comp: { new(); }, ...args): BaseComponent {
            return UI.instance.addBoxSync(comp, args);
        }
        /** 异步添加公用模块 */
        static async addCommon(comp: { new(); }, ...args): Promise<BaseComponent> {
            return UI.instance.addCommon(comp, args);
        }
        /** 同步添加公用模块 */
        static addCommonSync(comp: { new(); }, ...args): BaseComponent {
            return UI.instance.addCommonSync(comp, args);
        }
        /** 异步添加最上层界面 */
        static async addTop(comp: { new(); }, args = []): Promise<BaseComponent> {
            return UI.instance.addTop(comp, args);
        }
        /** 同步添加最上层界面 */
        static addTopSync(comp: { new(); }, args = []): BaseComponent {
            return UI.instance.addTopSync(comp, args);
        }
        /** 异步添加tip */
        static async addTooltip(comp: any, ...args): Promise<BaseComponent> {
            return UI.instance.addTooltip(comp, args);
        }
        /** 异步添加tip */
        static addTooltipSync(comp: any, ...args): BaseComponent {
            return UI.instance.addTooltipSync(comp, args);
        }
        /** 异步添加guide */
        static async addGuide(comp: { new(); }, ...args): Promise<BaseComponent> {
            return UI.instance.addGuide(comp, args);
        }
        /** 同步添加guide */
        static addGuideSync(comp: { new(); }, ...args): BaseComponent {
            return UI.instance.addGuideSync(comp, args);
        }
        /** 该ui是否有缓存 */
        static isUiCache(compName: string): boolean {
            return UI.instance.isUiCache(compName);
        }
        static getBoxMap(): Map<string, BaseComponent> {
            return UI.instance.getBoxMap();
        }
    }
    window["UI"] = UI;
}