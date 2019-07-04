class AudioManager {
	public constructor() {
	}

	//config 分组列表
	static configList: Object = {};

	//播放背景音效
	static playerBgMusic(url: string): void {
		platform.playerBgMusic(url);
	}

	//播放音效
	static playerSoundMusic(url: string): void {
		let efurl = AudioManager.getItemPath(url, "loading");
		platform.playerSound(efurl);
	}

	static subcontextBgUrl(): Object {
		var obj:Object = {};
		obj["subcontextBgUrl"] = AudioManager.getItemPath("panel_shop_01_jpg", "opendata");
		obj["subcontextLevelBgUrl"] = AudioManager.getItemPath("openDataLevelBg_jpg", "opendata");
		return obj;
	}

	//根据nanme获取url
	static getItemPath(resname: string, group: string): string {
		if (!AudioManager.configList[group]) {
			AudioManager.configList[group] = RES.getGroupByName(group);
		}
		let item = AudioManager.configList[group].find(item => {
			return resname == item.name;
		});
		let itempath = item.root + item.url;
		return itempath;
	}
}