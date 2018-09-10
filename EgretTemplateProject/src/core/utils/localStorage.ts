module core {
	export interface ILocalStorage {
		getInt(key:string, def?:number):number;
		getString(key:string, def?:string):string;
		getBool(key:string, def?:boolean):boolean;
		getFloat(key:string, def?:number):number;

		setInt(key:string, val:number):boolean;
		setString(key:string, val:string):boolean;
		setBool(key:string, val:boolean):boolean;
		setFloat(key:string, val:number):boolean;

		setPrefix(prefix: string): void;

		removeItem(key:string):void;

		setProvider(provider: ILocalStorageProvider): void;

		begin():void;
		commit(typeName?: string):void;
	}

	export interface ILocalStorageProvider {
		get(key: string): any;
		save(storageData: {[key:string]: any}, typeName?: string):boolean;
	}

	class EgretLocalStorageProvider {
		get(key: string) {
			return egret.localStorage.getItem(key);
		}

		save(data: {[key: string]: any}, typeName?: string) {
			let ret = true;
			for (let key in data) {
				let r = egret.localStorage.setItem(key, data[key]);
				if (!r) {
					ret = false;
				}
			}
			return ret;
		}
	}

	class LocalStorage implements ILocalStorage{
		private _transactioning: boolean = false;
		private _provider: ILocalStorageProvider = new EgretLocalStorageProvider();

		private _transData: {[key: string]: any} = {};

		setProvider(provider: ILocalStorageProvider) {
			this._provider = provider;
		}

		begin() {
			this._transactioning = true;
		}

		private _prefix: string = "";
		setPrefix(prefix: string) {
			this._prefix = prefix;
		}

		commit(typeName?:string) {
			if (Object.keys(this._transData).length > 0) {
				this._provider.save(this._transData, typeName);
			}
			this._transData = {};
			this._transactioning = false;
		}

		private getKey(key:string):string {
			if (this._prefix == "") {
				return key;
			}
			return this._prefix + "-" + key;
		}

		private getItem(key:string):string {
			var r = this._provider.get(this.getKey(key));
			return r || null;
		}

		getInt(key:string, def:number = 0):number {
			var item = this.getItem(key);
			if (!item) {
				return def;
			}
			var num = parseInt(item);
			if (isNaN(num)) {
				return def;
			}
			return def;
		}

		getString(key:string, def:string = ""):string {
			var item = this.getItem(key);
			if (!item) {
				return def;
			}
			return item;
		}

		getBool(key:string, def:boolean = false):boolean {
			var item = this.getItem(key);
			if (!item) {
				return def;
			}
			return item === 'true';
		}

		getFloat(key:string, def:number = 0.0):number {
			var item = this.getItem(key);
			if (!item) {
				return def;
			}
			var num = parseFloat(item);
			if (isNaN(num)) {
				return def;
			}
			return num;
		}

		private setItem(key:string, val:any):boolean {
			if (this._transactioning) {
				this._transData[this.getKey(key)] = val;
				return true;
			} else {
				return this._provider.save({
					[key]: val
				})
			}
		}

		setInt(key:string, def:number):boolean {
			if (isNaN(def)) {
				def = 0;
			}
			return this.setItem(key, def + '');
		}

		setString(key:string, def:string):boolean {
			return this.setItem(key, def);
		}

		setBool(key:string, def:boolean):boolean {
			return this.setItem(key, def === true ? 'true' : 'false');
		}

		setFloat(key:string, def:number):boolean {
			if (isNaN(def)) {
				def = 0.0;
			}
			return this.setItem(key, def + '');
		}

		removeItem(key:string):void {
			egret.localStorage.removeItem(key);
		}
	}

	export var localStorage:ILocalStorage = new LocalStorage();
}
