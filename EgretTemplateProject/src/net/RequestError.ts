class RequestError {
	public constructor() {
	}

	//处理请求错误
	static catchError(response: any): void {
		if (!response) {
			return;
		}
		var type = response.sc;
	}

}