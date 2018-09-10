///<reference path="../tools/singleton.ts" />
module core {

     /**
      * 注册Mediator
      */
    export function mediator() {
        return (constructor) => {
            core.registerMediator(new constructor());
            return constructor;
        }
    }

    /**
     * 注册监听
     * @param name 
     */
    export function notice(name:string) {
        /**
         * 1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
         * 2、成员的名字。
         * 3、成员的属性描述符。
         */
        return (target:any, methodName:string, descriptor:PropertyDescriptor) => {
            core.addNotification(name,descriptor.value,target);
            return descriptor.value;
        }
    }

    export class MVCSystem {
        private _observerMap:Object = null ;
        private _mediatorMap:Object = null;
        private _modelMap:Object = null;

        private _instance:MVCSystem;
        constructor(){
            if( this._instance ){
                throw Error( "MVCSystem singleton already constructed!" );
            }
            this._instance = this;
            this._observerMap = {};
            this._mediatorMap = {};
            this._modelMap = {};
        }
        
        /**
         * 注册Mediator
         * @param mediator 
         */
        registerMediator(mediator:IMediator):void {
            let name = mediator.getMediatorName();
            if(this._mediatorMap[name]){
                console.warn('该Mediator已经注册啦：',name);
                return;
            }
            this._mediatorMap[name] = mediator;

            let interests:string[] = mediator.listNotificationInterests();
            let len = interests.length;
            if(len > 0) {
                let observer : IObserver = new Observer(mediator.handleNotification,mediator);
                for(let i = 0 ; i < len ; i++) {
                    this.registerObserver(interests[i],observer)
                }
            }
            mediator.onRegister();
        }

        /**
         * 获取Mediator
         * @param mediatorName 
         */
        retrieveMediator( mediatorName:string ):IMediator
		{
			return this._mediatorMap[ mediatorName ] || null;
        }

        removeMediator( mediatorName:string ):IMediator
		{
			let mediator:IMediator = this._mediatorMap[ mediatorName ];
			if( !mediator )
				return null;
            let interests:string[] = mediator.listNotificationInterests();
            let i:number = interests.length;
			while( i-- )
				this.removeObserver( interests[i], mediator );

			delete this._mediatorMap[ mediatorName ];
			mediator.onRemove();
			return mediator;
		}
        
        hasMediator( mediatorName:string ):boolean
		{
			return this._mediatorMap[ mediatorName ] != null;
        }

        registerModel( model:IModel ):void
		{
            let name = model.getProxyName();
            if(this._modelMap[name]){
                return;
            }
			this._modelMap[name] = model;
			model.onRegister();
        }
        
        removeModel( modelName:string ):IModel
		{
			var model:IModel = this._modelMap[ modelName ];
			if( model )
			{
				delete this._modelMap[ modelName ];
				model.onRemove();
			}
			
			return model;
        }
        
        retrieveModel( modelName:string ):IModel
		{
				//Return a strict null when the model doesn't exist
				return this._modelMap[modelName] || null;
        }
        
        hasModel( modelName:string ):boolean
		{
			return this._modelMap[ modelName ] != null;
		}

        registerObserver(notifyName:string,observer:IObserver):void {
            let observers : IObserver[] = this._observerMap[notifyName];
            if( observers && observers.length > 0 ){
                if(!this.checkObserver(notifyName,observer.getNotifyContext())){
                    observers.push(observer);
                    observers.sort((a:IObserver,b:IObserver)=>{
                        return b.getPriority() - a.getPriority();
                    });
                }else{
                    console.warn('registerObserver重复注册:',notifyName)
                }
            }else{
                this._observerMap[notifyName] = [observer];
            }
        }
        checkObserver(notifyName:string,context:any):boolean {
            let observers : IObserver[] = this._observerMap[notifyName];
            let len = observers.length;
            for( let i = 0 ; i < len ; i++ ) {
                let observer = observers[i];
                if(observer.compareNotifyContext(context)){
                    return true;
                }
            }
            return false;
        }
    
        notifyObservers(notification:INotification):void {
            let notifyName : string = notification.getName();
            let observers : IObserver[] = this._observerMap[notifyName];
            if(observers){
                //copy
                let observersRef = observers.slice(0);
                let len = observersRef.length;
                for( let i = 0 ; i < len ; i++ ) {
                    let observer = observersRef[i];
                    observer.notifyObserver(notification);
                }
            }
        }
    
        removeObserver(notifyName:string,context:any):void{
            let observers : IObserver[] = this._observerMap[notifyName];
            if(observers){
                let i = observers.length;
                while(i --){
                    let observer = observers[i];
                    if(observer.compareNotifyContext(context)){
                        observers.splice(i,1);
                        break;
                    }
                }
            }
        }
    
        removeObserverByName(notifyName:string):void{
            this._observerMap[notifyName] = [];
        }
        
        removeObserverByContext(context:any):void{
            for(let notifyName in this._observerMap){
                this.removeObserver(notifyName,context);
            }
        }
    }



    export function registerMediator(mediator:IMediator):void {
        singleton(MVCSystem).registerMediator(mediator);
    }

    export function retrieveMediator(mediatorName:string):void {
        singleton(MVCSystem).retrieveMediator(mediatorName);
    }

    export function hasMediator(mediatorName:string):void {
        singleton(MVCSystem).hasMediator(mediatorName);
    }

    export function removeMediator(mediatorName:string):void {
        singleton(MVCSystem).removeMediator(mediatorName);
    }

    export function registerModel(proxy:IModel):void {
        singleton(MVCSystem).registerModel(proxy);
    }

    export function retrieveModel(proxyName:string):void {
        singleton(MVCSystem).retrieveModel(proxyName);
    }

    export function hasModel(proxyName:string):void {
        singleton(MVCSystem).hasModel(proxyName);
    }

    export function removeModel(proxyName:string):void {
        singleton(MVCSystem).removeModel(proxyName);
    }

    export function addNotification(notifyName:string,method:Function,context:any,priority:number=0):void {
        singleton(MVCSystem).registerObserver(notifyName,new Observer(method,context,priority));
    }

    export function sendNotification(notifyName:string,body:any=null,type:any=null):void{
        singleton(MVCSystem).notifyObservers(new Notification(notifyName,body,type));
    }

    export function postNotification(notifyName:string,...parms):void{
        let notice = new Notification(notifyName,parms,null);
        notice.setArrFormat(true);
        singleton(MVCSystem).notifyObservers(notice);
    }

    export function removeNotification(notifyName:string,context:any):void{
        singleton(MVCSystem).removeObserver(notifyName,context);
    }

    export function removeNotificationByName(notifyName:string):void{
        singleton(MVCSystem).removeObserverByName(notifyName);
    }

    export function removeNotificationByContext(context:any):void{
        singleton(MVCSystem).removeObserverByContext(context);
    }

    export function hasNotification(notifyName:string,context:any):boolean{
        return singleton(MVCSystem).checkObserver(notifyName,context);
    }
}