/*
 * @Author: HuangGuoYong 
 * @Date: 2018-07-07 17:23:42 
 * @Last Modified by: HuangGuoYong
 * @Last Modified time: 2018-07-07 17:30:41
 */

/**
 * 镜头聚焦控制器 -- 处理静态的聚焦
 */
class FocusController {
    constructor() {
        
    }

    private static _instance:FocusController;
    static get instance():FocusController {
        if(!this._instance) {
            this._instance = new FocusController();
        }
        return this._instance;
    }
    //*********************************聚焦处理*****************************************
    test(displayObj:egret.DisplayObject,zoomTimes:number=2):void {
        this._touchType = 1;
        let viewPort = core.UI.getScene()['scroller']['viewport'];
        // if(viewPort.scaleX > 1){
        //     this.stopDynamicFocus(displayObj,3000);
        // }else{
        //     this.startDynamicFocus(displayObj,2);
        // }
    }
    
    public static Touch_Type_All : number = 0;      //全程禁止 -- 开始聚焦禁止触摸，结束聚焦后才开始解锁
    public static Touch_Type_Start : number = 1;    //前段禁止 -- 开始聚焦时禁止触摸，聚焦完成后开始解锁
    private _touchType : number = 0;
    /**
     * 设置触摸类型
     * @param type 
     */
    public setTouchType(type:number):void {
        this._touchType = type;
    }
    
    public static Pos_Type_
    /**
     * 设置层级数量,0为根层的直接子层,1为直接子层的子层，以此类推...
     */
    private _childLayerCount : number = 0;
    setChildCount(count:number):void {
        this._childLayerCount = count;
    }
    setType(touchType:number,childCount:number):void {
        this._touchType = touchType;
        this._childLayerCount = childCount;
    }
    
    /**
     * 聚焦
     * @param displayObj 显示对象
     * @param zoomTimes 缩放对象
     * @param duration 缓动时间
     */
    startFocus(displayObj:egret.DisplayObject,zoomTimes:number=2,duration:number=2000):Promise<any> {
        return new Promise<any>((resolve)=>{
            let point = this.getScrollZoomHV(displayObj,zoomTimes,0,this._childLayerCount);
            let viewPort = core.UI.getScene()['scroller']['viewport'];
            this.setStageTouchEnabled(false);
            egret.Tween.get(viewPort).to({scrollH:point.x, scrollV:point.y, scaleX:zoomTimes, scaleY:zoomTimes}, duration).call(()=>{
                egret.Tween.removeTweens(viewPort);
                if(this._touchType == FocusController.Touch_Type_Start) {
                    this.setStageTouchEnabled(true);
                }
                resolve();
            });
        });
    }
    public setStageTouchEnabled(touch:boolean):void
	{
		egret.MainContext.instance.stage.touchChildren = touch;
	}

    /**
     * 停止聚焦
     * @param tween 是否缓动
     */
    stopFocus(displayObj:egret.DisplayObject,tween:boolean=false,duration:number=1000):Promise<any> {
        return new Promise<any>((resolve)=>{
            let viewPort = core.UI.getScene()['scroller']['viewport'];
            let point = this.getScrollZoomHV(displayObj,1,1,this._childLayerCount);
            let scrollH = point.x;
            let scrollV = point.y;
            if(tween){
                this.setStageTouchEnabled(false);
                egret.Tween.get(viewPort).to({scrollH:scrollH, scrollV:scrollV, scaleX:1, scaleY:1}, duration).call(()=>{
                    egret.Tween.removeTweens(viewPort);
                    this.revertData();
                    resolve();
                });
            }else{
                viewPort.scaleX = viewPort.scaleY = 1;
                viewPort.scrollH = scrollH;
                viewPort.scrollV = scrollV;
                this.revertData();
                resolve();
            }
        });
    }
    //还原默认数据
    private revertData():void {
        this.setStageTouchEnabled(true);
        this._touchType = 0;
        this._childLayerCount = 0;
    }
    /**
     * 聚焦到某个点
     * @param point 
     */
    public focusPoint(point:egret.Point,overZoom:number=0):void {
        let viewPort = core.UI.getScene()['scroller']['viewport'];
        let zoom = viewPort.scaleX;
        if(overZoom > 0){
            zoom = overZoom;
            viewPort.scaleX = viewPort.scaleY = overZoom;
        }
        let hvPoint = this.getScrollZoomHV(point,0,zoom);
        viewPort.scrollH = hvPoint.x;
        viewPort.scrollV = hvPoint.y;
    }
    /**
     * 缓动聚焦到某个点
     * @param point 
     * @param zoomTimes 
     */
    public focusPointTween(point:egret.Point,zoomTimes:number=1,duration:number=1000):Promise<any> {
        return new Promise<any>((resolve)=>{
            let viewPort = core.UI.getScene()['scroller']['viewport'];
            let hvPoint = this.getScrollZoomHV(point,0,zoomTimes);
            this.setStageTouchEnabled(false);
            egret.Tween.get(viewPort).to({scrollH:hvPoint.x, scrollV:hvPoint.y, scaleX:zoomTimes, scaleY:zoomTimes}, duration).call(()=>{
                egret.Tween.removeTweens(viewPort);
                this.setStageTouchEnabled(true);
                resolve();
            });
        })
    }
    //动态聚焦，测试中不可用
    // startDynamicFocus(displayObj:egret.DisplayObject,zoomTimes:number=2):Promise<any> {
    //     return new Promise<any>((resolve)=>{
    //         let viewPort = UI.instance.getScene()['scroller']['viewport'];
    //         viewPort.scaleX = viewPort.scaleY = 1;
    //         this.setTouchEnabled(false);
    //         //viewPort居中
    //         let scrollerPoint = this.getScrollZoomHV(displayObj,1,0,this._childLayerCount);
    //         viewPort.scrollH = scrollerPoint.x;
    //         viewPort.scrollV = scrollerPoint.y;
    //         let roleX = displayObj.x;
    //         let roleY = displayObj.y;
    //         TimerManager.instance.addKeyTick('FocusController_startDynamicFocus',()=>{
    //             let zoom = viewPort.scaleX;
    //             if(zoom < zoomTimes){
    //                 viewPort.scaleX = viewPort.scaleY = zoom + 0.01;
    //             }
    //             zoom = viewPort.scaleX;
    //             let scrollerPoint = this.getScrollZoomHV(displayObj,zoom,0,this._childLayerCount);
    //             viewPort.scrollH = scrollerPoint.x;
    //             viewPort.scrollV = scrollerPoint.y;
    //             console.log(viewPort.scrollH,viewPort.scrollV,(displayObj.x - roleX),(displayObj.y - roleY))
    //         },this,50,0);
    //     });
    // }
    // stopDynamicFocus(displayObj:egret.DisplayObject,duration:number=1000):Promise<any> {
    //     return new Promise<any>((resolve)=>{
    //         let viewPort = UI.instance.getScene()['scroller']['viewport'];
    //         this.setTouchEnabled(false);
    //         let point = this.getScrollZoomHV(displayObj,1,1,this._childLayerCount);
    //         viewPort.scrollH = point.x;
    //         viewPort.scrollV = point.y;
    //         egret.Tween.get(viewPort,{onChange:()=>{
    //             let zoom = viewPort.scaleX;
    //             let cpoint = this.getScrollZoomHV(displayObj,zoom,0,this._childLayerCount);
    //             viewPort.scrollH = cpoint.x;
    //             viewPort.scrollV = cpoint.y;
    //         },onChangeObj:this}).to({scaleX:1, scaleY:1}, duration).call(()=>{
    //             egret.Tween.removeTweens(viewPort);
    //             this.revertData();
    //             resolve();
    //         });
    //     });
    // }
    //*********************************聚焦处理*****************************************
    //*********************************获取滚动位置处理*****************************************

    /**
     * 获取显示对象想显示在舞台中间的滚动距离ScrollH、ScrollV
     * 想法：以ScrollH=0、ScrollV=0时的中点,舞台中间位移到该显示对象的位置,就是滚动条需要滚动的距离
     * 再进行缩放时,位置需要乘以倍数来计算
     * 计算适配完后，由于是scroll滚动条,所以我们计算出的ScrollH、ScrollV还要除以缩放倍数
     * @param displayObj 当前针对角色对象
     * @param zoomTimes 缩放倍数 -- 在原来的基础倍数上进行缩放
     * @param overZoomTimes 强制缩放的倍数 -- 最终的缩放倍数
     */
    public getScrollZoomHV(displayObj:egret.DisplayObject | egret.Point, zoomTimes:number=2,overZoomTimes:number=0,childCount:number=0):egret.Point
    {
        let stage = egret.MainContext.instance.stage;
        let viewPort = core.UI.getScene()['scroller']['viewport'];
        zoomTimes = viewPort.scaleX * zoomTimes;    //需要在原始的倍数上去计算
        if(overZoomTimes > 0){
            zoomTimes = overZoomTimes;
        }
        
        let pos : egret.Point;
        if(displayObj instanceof egret.DisplayObject){
            // if(displayObj instanceof SceneRole) {
            //     pos = this.getSceneRolePostion(displayObj);
            // }else{
            //     pos = this.getDisplayObjectPositon(displayObj,childCount);
            // }
            pos = this.getDisplayObjectPositon(displayObj,childCount);
        }else{
            pos = displayObj;
        }
        let tx = pos.x * zoomTimes - (stage.stageWidth >> 1);
        let ty = pos.y * zoomTimes - (stage.stageHeight >> 1);;
        //适配
        tx = Math.min(tx, viewPort.contentWidth * zoomTimes - stage.stageWidth);
        tx = Math.max(tx, 0);
        ty = Math.min(ty, viewPort.contentHeight * zoomTimes - stage.stageHeight);
        ty = Math.max(ty, 0);
        //除以缩放倍数获得最终需要滚动的H、V
        return new egret.Point(tx/zoomTimes,ty/zoomTimes);
    }
    public getScenePoint(displayObj:egret.DisplayObject | egret.Point,container:egret.DisplayObjectContainer| egret.Point, zoomTimes:number=2,overZoomTimes:number=0,childCount:number=0):egret.Point{
        let stage = egret.MainContext.instance.stage;
        let pos : egret.Point;
        if(displayObj instanceof egret.DisplayObject){
            pos = this.getDisplayObjectPositon(displayObj,childCount);
        }else{
            pos = displayObj;
        }
        let containerPos : egret.Point;
        if(container instanceof egret.DisplayObjectContainer){
            containerPos = new egret.Point(container.x,container.y);
        }else{
            containerPos = containerPos;
        }

        let tx = (stage.stageWidth >> 1) - pos.x * zoomTimes ;
        let ty = (stage.stageHeight >> 1) - pos.y * zoomTimes;
        //适配
        tx = Math.max(tx, stage.stageWidth - containerPos.x * zoomTimes);
        tx = Math.min(tx, 0);
        ty = Math.max(ty, stage.stageHeight - containerPos.y * zoomTimes);
        ty = Math.min(ty, 0);
        return new egret.Point(tx,ty);
    }
    public getScroll
    /**
     * 获取显示对象的位置
     * @param displayObj 显示对象
     * @param childCount 层数（以场景层或与场景层的xy一致的为根层），0为根层的直接子层,1为直接子层的子层，以此类推...
     */
    public getDisplayObjectPositon(displayObj:egret.DisplayObject,childCount:number=0):egret.Point{
        let px : number = 0;
        let py : number = 0;
        let parent : egret.DisplayObjectContainer;
        for(let i = 0 ; i <= childCount ; i++){
            if(i == 0) {
                px = displayObj.x;
                py = displayObj.y;
                parent = displayObj.parent;
            }else{
                px += parent.x;
                py += parent.y;
                parent = parent.parent;
            }
        }
        return new egret.Point(px,py);
    }
    //*********************************获取滚动位置处理*****************************************
    //*********************************特殊处理*****************************************
    /**
     * 场景的全局位置,暂时场景层,科室，机器三种情况
     * @param role 场景角色
     */
    // getSceneRolePostion(role:SceneRole):egret.Point {
    //     let roleParent = role.parent;
    //     let point : egret.Point = new egret.Point();
    //     if(roleParent){
	// 		if(roleParent == SceneMoveController.instance._mapSceneLayer) {
    //             point = this.getDisplayObjectPositon(role,0);
	// 		}else{
	// 			//科室里面的职员位置
	// 			if(roleParent.name == 'roleLayer'){
    //                 point = this.getDisplayObjectPositon(role,2);
	// 			}else{
    //                 //是否在机器里面
	// 				let roleParentPar = roleParent.parent;
	// 				if(roleParentPar && roleParentPar.name.indexOf('workMachine')!=-1){
	// 					point = this.getDisplayObjectPositon(role,3);
	// 				}else{
    //                     point = this.getDisplayObjectPositon(role,0);
    //                 }
    //             }
	// 		}
    //     }
    //     return point;
    // }

}