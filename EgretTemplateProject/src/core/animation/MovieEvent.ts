module core {

    export class MovieEvent extends egret.Event {
        static FRAME_LABEL: string = "Frame_Label";
        static LOOP_COMPLETE: string = "Loop_Complete";
        static COMPLETE: string = "Complete";

        constructor(name: string, label: string = null) {
            super(name);
            this._frameLabel = label;
        }

        private _frameLabel: string;
        get frameLabel(): string {
            return this._frameLabel;
        }
    }
}