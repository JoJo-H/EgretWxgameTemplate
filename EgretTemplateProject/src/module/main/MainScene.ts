
class MainScene extends core.BaseComponent {
    public btnRank: core.Button;
    constructor() {
        super();
        this.name = 'MainScene';
        this.skinName = 'MainSceneSkin';
    }

    onEnter(): void {
        super.onEnter();
        this.listener(this.btnRank, egret.TouchEvent.TOUCH_TAP, this.openRank, this);
    }

    onExit(): void {
        super.onExit();

    }

    private openRank(): void {

    }

}
window['MainScene'] = MainScene;