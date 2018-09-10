
class CommonPanel extends core.BaseComponent {
    constructor() {
        super();
        this.name = 'CommonPanel';
        this.skinName = 'CommonPanelSkin';
    }

    onEnter():void {
        super.onEnter();
         
    }

    onExit():void {
        super.onExit();
         
    }

}
window['CommonPanel'] = CommonPanel;