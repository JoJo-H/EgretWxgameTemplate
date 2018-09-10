
module core {
    export class Notification implements INotification {

        private _name: string = null;
        private _body: any = null;
        private _type: string = null;

        private _arrFormat : boolean = false;

        constructor(name: string, body: any = null, type: string = null) {
            this._name = name;
            this._body = body;
            this._type = type;
        }

        getName(): string {
            return this._name;
        }

        setBody(body: any): void {
            this._body = body;
        }

        getBody(): any {
            return this._body;
        }

        setType(type: string): void {
            this._type = type;
        }

        getType(): string {
            return this._type;
        }

        setArrFormat(flag:boolean):void {
            this._arrFormat = flag;
        }

        isArrFromat():boolean {
            return this._arrFormat;
        }
        getArr():any[]{
            if(!this._body){
                this._body = [];
            }
            return this._body;
        }

        toString(): string {
            var msg: string = "Notification Name: " + this.getName();
            msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
            msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
            return msg;
        }
    }


    export interface INotification {

        getName(): string;
        setBody(body: any): void;
        getBody(): any;
        setType(type: string): void;
        getType(): string;

        toString(): string;
        isArrFromat?:()=>boolean;
        setArrFormat?:(flag:boolean)=>void;
        getArr?:()=>any[];
    }
}