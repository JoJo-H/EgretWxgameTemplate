
module core {

    //实现观察者模式
    export class Observer implements IObserver{

        private _notifyMethod : Function = null;
        private _context : any = null;
        private _priority : number = 0;

        constructor(notifyMethod:Function,notifyContext:any,priority:number = 0){
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
            this.setPriority(priority);
        }

        getNotifyMethod():Function
        {
            return this._notifyMethod;
        }

        setNotifyMethod( notifyMethod:Function ):void
        {
            this._notifyMethod = notifyMethod;
        }
        
        getNotifyContext():any
        {
            return this._context;
        }
            
        setNotifyContext( notifyContext:any ):void
        {
            this._context = notifyContext;
        }

        getPriority():number{
            return this._priority;
        }
        setPriority(val:number):void{
            this._priority = val;
        }

        notifyObserver(notification:INotification):void{
            if(notification.isArrFromat()){
                this.getNotifyMethod().call(this._context,notification,...notification.getArr());
            }else{
                this.getNotifyMethod().call(this._context,notification);
            }
        }

        compareNotifyContext(object:any):boolean {
            return this._context == object;
        }
    }

    export interface IObserver
    {
        getNotifyMethod():void;
        setNotifyMethod( notifyMethod:Function ):void;
        getNotifyContext():void;
        setNotifyContext( notifyContext:any ):void;
        getPriority():number;
        setPriority( val : number):void;
        notifyObserver( notification:INotification ):void;
        compareNotifyContext( object:any ):boolean;
    }
}