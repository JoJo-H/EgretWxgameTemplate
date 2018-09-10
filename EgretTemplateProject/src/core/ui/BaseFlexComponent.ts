module core {

    export class BaseFlexComponent extends BaseComponent {
        static ROW = "row"; //左到右
        static COLUMN = "column"; //上到下
        static ROW_REVERSE = "row_reverse"; //右到左
        static COLUMN_REVERSE = "column_reverse"; //下到上
        private point: Array<Array<number>>;
        public direction: string = BaseFlexComponent.ROW;
        constructor() {
            super();
        }

        public onEnter(): void {
            super.onEnter();
            this.visible = false;
            this.setPoint();
            this.open();
        };

        public setPoint = function (): void {
            switch (this.direction) {
                case BaseFlexComponent.ROW:
                    this.point = [[-core.stage.stageWidth, 0], [0, 0]];
                    break;
                case BaseFlexComponent.ROW_REVERSE:
                    this.point = [[-core.stage.stageWidth, 0], [0, 0]];
                    break;
                case BaseFlexComponent.COLUMN:
                    this.point = [[0, -core.stage.stageHeight], [0, 0]];
                    break;
                case BaseFlexComponent.COLUMN_REVERSE:
                    this.point = [[0, -core.stage.stageHeight], [0, 0]];
                    break;
            }
        };

        public open(): void {
            this.visible = true;
            this.move(0);
        };

        public onClose(): void {
            super.onClose();
            this.move(1);
            AudioManager.playerSoundMusic("close_mp3");
        };

        private move(type = 0) {
            var boxGroup = this.getChildByName("boxContainer");
            if (boxGroup) {
                boxGroup.x = this.point[type][0];
                boxGroup.y = this.point[type][1];
                egret.Tween.get(boxGroup).to({ x: this.point[1 - type][0], y: this.point[1 - type][1] }, 150).call(function () {
                    egret.Tween.removeTweens(boxGroup);
                    this.visible = type == 0;
                }, this);
            }
            else {
                console.log("BaseFlexComponent伸缩组件不正确");
            }
        };

    }
    window["BaseFlexComponent"] = BaseFlexComponent;
}