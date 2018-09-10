

module core {
    
    export interface IUiAnimation {
        open(...params):Promise<void>;
        close(...params):Promise<void>;
        show?:(...params)=>Promise<void>;
        delay?:(delay,...params)=>Promise<void>;
    }

    export class UiAnimation  {
        public scene : IUiAnimation;
        public box : IUiAnimation;
        public common : IUiAnimation;
        public panel : IUiAnimation;
        public guide : IUiAnimation;
        public tooltip : IUiAnimation;
    }

    export var uiAnimation = new UiAnimation();
    
}