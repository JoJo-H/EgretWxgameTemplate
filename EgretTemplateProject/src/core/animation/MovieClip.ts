module core {


    export class MovieClip extends egret.DisplayObjectContainer implements IMovie {

        private _dataPath: string;
        private _texturePath: string;
        private _filename: string;

        public isCache = false;
        private _atLast: boolean = false;
        private _mcScaleX: number = 1;
        get atLast(): boolean {
            return this._atLast;
        }
        set atLast(val: boolean) {
            this._atLast = val;
        }

        constructor() {
            super();
        }

        public setPath(path: string, texture: string) {
            this._dataPath = path;
            this._texturePath = texture;
            this._filename = BaseFactory.getFilenameWithoutExt(this._dataPath);
            this.clearMc();
        }

        private async prepareResource() {
            var factory = this.getFactory();
            if (factory) {
                return new Promise<void>((ok) => {
                    ok();
                });
            } else {
                await RES.getResAsync(this._dataPath);
                await RES.getResAsync(this._texturePath);
            }
        }

        play(name: string, playTimes: number = 0) {
            this.prepareResource().then(() => {
                this.getMC(name).play(playTimes);
            });
        }

        gotoAndStop(name: string, frame: any) {
            this.prepareResource().then(() => {
                this.getMC(name).gotoAndStop(frame);
            });
        }

        gotoAndPlay(name: string, frame: any, playTimes: number = 0) {
            this.prepareResource().then(() => {
                this.getMC(name).gotoAndPlay(frame, playTimes);
            })
        }

        private getMC(name: string) {
            if (this._mc) {
                this.initEvents();
                this._mc.anchorOffsetX = (this._mc.width - this._mc.x) * 0.5;
                this._mc.anchorOffsetY = this._mc.height - this._mc.y - 6;
                this._mc.visible = true;
                return this._mc;
            }
            var factory: egret.MovieClipDataFactory = this.getFactory();
            if (factory) {
                this._mc = new egret.MovieClip(factory.generateMovieClipData(name));
                this.initEvents();
                this._mc.anchorOffsetX = (this._mc.width - this._mc.x) * 0.5;
                this._mc.anchorOffsetY = this._mc.height - this._mc.y - 6;
                this._mc.scaleX = this._mcScaleX;
                this.addChild(this._mc);
                // this._mc.x = this._mc.width/2;
                // this._mc.y = this._mc.height;
            }
            this._mc.visible = true;
            return this._mc;
        }

        private getFactory(): egret.MovieClipDataFactory {
            var data = RES.getRes(this._dataPath);
            var txtr = RES.getRes(this._texturePath);
            if (data && txtr) {
                if (this._mc && this._frameRate)
                    this._mc.frameRate = this._frameRate;
                return new egret.MovieClipDataFactory(data, txtr);
            }

        }

        protected _frameRate: number = null;
        get frameRate(): number {
            return this._frameRate;
        }
        set frameRate(val: number) {
            this._frameRate = val;
        }

        private _hasEvent: boolean = false;

        private clearEvents(): void {
            if (!this._hasEvent) return;
            this._hasEvent = false;
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.clearMcEvent();
        }
        private clearMcEvent(): void {
            if (this._mc) {
                this._mc.removeEventListener(egret.MovieClipEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.removeEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete, this);
                this._mc.removeEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onFrameLabel, this);
            }
        }

        public initEvents(): void {
            if (this._hasEvent) return;
            this._hasEvent = true;
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            if (this._mc) {
                this._mc.addEventListener(egret.MovieClipEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete, this);
                this._mc.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onFrameLabel, this);
            }
        }
        protected onAddToStage(): void {

        }

        protected _mc: egret.MovieClip;

        private onLoopComplete(e: egret.MovieClipEvent): void {
            this.dispatchEvent(new MovieEvent(MovieEvent.LOOP_COMPLETE));
        }

        private onComplete(e: egret.MovieClipEvent): void {
            this.dispatchEvent(new MovieEvent(MovieEvent.COMPLETE));
            if (!this.atLast) {
                this.removeFromParent(this);
            }
        }

        private onFrameLabel(e: egret.MovieClipEvent): void {
            this.dispatchEvent(new MovieEvent(MovieEvent.FRAME_LABEL, e.frameLabel));
        }

        private onRemoved(e: egret.Event): void {
            this.dispose();
        }

        dispose(): void {
            this.clearEvents();
            this.removeFromParent(this);
        }

        clearMc(): void {
            if (this._mc) {
                this.removeFromParent(this._mc);
                this.clearMcEvent();
                this._mc = null;
            }
        }

        setMcScaleX(scaleX): void {
            this._mcScaleX = scaleX;
            if (this._mc) {
                this._mc.scaleX = scaleX;
            }
        }

        private removeFromParent(child: egret.DisplayObject | any): void {
            if (child && child.parent) {
                child.parent.removeChild(child);
            }
        }
    }
}