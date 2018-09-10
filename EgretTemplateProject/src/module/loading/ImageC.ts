class ImageC extends egret.Bitmap {
	loader:egret.ImageLoader;
	private md5List:any;
	public constructor(url:string = "") {
		super();
		this.md5List = {"loading_bg":"fe420392","loading_di":"38229d3b","loading_ding":"e4c304d9"}
		if(url != ""){
			if(window.platform.name == "wxgame" || !DEBUG) {
				url = "resource/assets/loading/"+url+ "_"+this.md5List[url]+".jpg";
			}
			else{
				url = "resource/assets/loading/"+url+".jpg";
			}
			this.setUrl(url);
		}
	}


	setUrl(url:string){
		this.loader = new egret.ImageLoader();
		//添加加载完成侦听
		this.loader.addEventListener(egret.Event.COMPLETE, this.onImgLoadEnd, this);
		this.loader.load(url);
	}

	onImgLoadEnd(e){
		//获取加载到的纹理对象
		var bitmapData  = this.loader.data;
		console.log(bitmapData);
		//创建纹理对象
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		//创建 Bitmap 进行显示
		this.texture = texture;
		this.loader.removeEventListener(egret.Event.COMPLETE, this.onImgLoadEnd, this);
	}
}