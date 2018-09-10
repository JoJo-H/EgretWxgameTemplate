
module core {

    export interface IModel{
        getProxyName():string;
        setData( data:any ):void;
        getData():any;
        onRegister( ):void;
        onRemove( ):void;
    }

    export class Model extends egret.EventDispatcher implements IModel{
        private _proxyName:string = null;
        private _data:any = null;
        constructor( proxyName:string=null, data:any=null )
		{
            super()
			this._proxyName = (proxyName != null) ? proxyName : Model.NAME;
			if( data != null )
				this.setData(data);
        }
        
        getProxyName():string
		{
			return this._proxyName;
        }
        
        setData( data:any ):void
		{
			this._data = data;
        }
        
        getData():any
		{
			return this._data;
        }
        
        onRegister():void
		{

        }
        
        onRemove():void
		{

        }
        
        static NAME:string = "Proxy";
    }
}