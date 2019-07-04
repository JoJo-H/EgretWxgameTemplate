
function _p_(command, p :any = {}, mask = true,requestUrl = NetCode.HTTP_SERVER, cache = false,reload=true):core.IRequestInfo {
    p.command = command;
	return {
		command: command,
		params: p,

		mask: mask,
		cache: cache,
		requestUrl: requestUrl,
        reload : reload
	}

}

var PLogin = {
    getServerPath : function (loginId:string,requestUrl?:string):core.IRequestInfo {
        return _p_(NetCode.GET_SERVERPATH,{loginId:loginId},false,requestUrl);
    },
    getUserId : function (loginId:string,areaId:number,mask?:boolean):core.IRequestInfo {
        return _p_(NetCode.GET_USER_ID,{loginId,areaId},mask);
    }
}

var PUser = {

	/** 获取用户信息 */
	getInfo: function(): core.IRequestInfo {
		return _p_(NetCode.GET_USER_INFO_BY_ID);
    },
    getInfoSecond: function(extendType:number): core.IRequestInfo {
		return _p_(NetCode.SECOND_USER_DATA);
    },
    /** 创建用户 并获取用户信息 */
    createUser: function(areaId:number,loginId:string,useGpId:string,name:string,sex:number,icon:string,fromGpId:string): core.IRequestInfo {
		return _p_(NetCode.CREAT_USER, {areaId,loginId,useGpId,name,sex,icon,fromGpId},);
    },
    pushError: function(log:string): core.IRequestInfo {
		return _p_(NetCode.PUSH_ERROE,{log});
    },
    syncTime: function(tc:number): core.IRequestInfo {
		return _p_(NetCode.SYNC_TIME);
    },
    gameShare: function(): core.IRequestInfo {
		return _p_(NetCode.SYNC_TIME);
    },

};