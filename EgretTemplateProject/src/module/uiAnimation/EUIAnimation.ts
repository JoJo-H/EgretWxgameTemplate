
interface IAnimationProps {
	groupName: string;
	startPlay?: boolean;
	loop?: boolean;
	completeFun?: Function;
	offsetX?: number;
	offsetY?: number;
	x?: number;
	y?: number;
	bottom?: number;

	specailLoop?: boolean;	//特殊循环 -- 需要等一次循环之后再执行循环，因为有些TweenItem不能直接设置loop为true,可能会出现卡顿现象
}
class EUIAnimation extends core.BaseComponent {
	private lineList: Array<any>;
	private current: number = 0;
	private dirList = [[-1, 1], [1, 1], [1, 1], [-1, 1]];
	private _props: IAnimationProps;
	public constructor(skinName: string, props?: IAnimationProps) {
		super();
		this.touchEnabled = false;
		this.touchChildren = false;
		this._props = props ? props : { 'groupName': 'ac' };
		if (this._props.startPlay === void 0) {
			this._props.startPlay = true;
		}
		if (this._props.loop === void 0) {
			this._props.loop = false;
		}
		if (this._props.specailLoop === void 0) {
			this._props.specailLoop = false;
		}
		this.skinName = skinName;
	}

	onEnter(): void {
		super.onEnter();
		this.anchorOffsetX = this.width >> 1;
		this.anchorOffsetY = this.height >> 1;
		if (this._props.startPlay) {
			this.startPlay();
		}
	}

	//播放tween
	public startPlay(tweenName: string = null): void {
		let groupName = tweenName ? tweenName : this._props.groupName;
		this.playAnimation(this[groupName], this._props.loop, this._props.specailLoop);
	}

	//停止tween
	public stopPlay(tweenName: string = null): void {
		let groupName = tweenName ? tweenName : this._props.groupName;
		this.stopAnimation(this[groupName]);
	}

	private playAnimation(target: egret.tween.TweenGroup, isLoop: boolean, specailLoop: boolean = false): void {
		if (!target) return;
		if (isLoop && !specailLoop) {
			for (var key in target.items) {
				target.items[key].props = { loop: true };
			}
		}
		target.play(0);
		if (!target.hasEventListener(egret.Event.COMPLETE)) {
			target.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
		}
	}

	private stopAnimation(target: egret.tween.TweenGroup): void {
		if (target) {
			target.stop();
		}
	}

	private onComplete(event: egret.Event): void {
		if (this._props.specailLoop) {
			this.startPlay();
		}
		if (!this._props.loop && !this._props.specailLoop && this._props.completeFun) {
			this._props.completeFun.apply(null, this);
		}
	}

	startMove(lineList: any[] = null) {
		if (this.lineList) {
			if (this.current == 0) {
				this.current = 1;
			}
			else if (this.current == this.lineList.length - 1) {
				this.current = this.lineList.length - 2;
			}
			else {
				this.current = Math.random() > 0.5 ? this.current + 1 : this.current - 1;
			}
			var tx = this.lineList[this.current][0][0];
			var ty = this.lineList[this.current][0][1];
			this.disDirection(this.x, this.y, tx, ty);
			this.moveTo(tx, ty, this.startMove);
		}
	}

	disDirection(x: number, y: number, tx: number, ty: number) {
		var num: number = 0;
		num += ty >= y ? 1 : 0;
		num += tx >= x ? 2 : 0;
		this.scaleX = this.dirList[num][0];
		this.scaleY = this.dirList[num][1];
	}

	moveTo(tx, ty, fun = null) {
		var toTime = MathUtils.pointDistance(this.x, this.y, tx, ty);
		egret.Tween.get(this).to({ x: tx, y: ty }, toTime * 15).call(() => {
			egret.Tween.removeTweens(this);
			this.startMove();
		}, this);
	}

	onExit(): void {
		if (this[this._props.groupName]) {
			this[this._props.groupName].removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
		}
		egret.Tween.removeTweens(this);
		super.onExit();
	}
}
window['EUIAnimation'] = EUIAnimation;