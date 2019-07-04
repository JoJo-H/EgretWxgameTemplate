

module core {


    export class HttpListenerHook implements core.INetworkHook {

        private _requestCount :number = 0;
        constructor() {
        }

        onRequest(proxy:NetworkRequest):void {
            if (proxy.requestInfo.mask) {
                if (this._requestCount == 0) {
                    core.showSimpleLoading();
                }
                this._requestCount++;
            }
        }

        onReponse(proxy:NetworkRequest):void {
            this.removeSimpleLoading(proxy);
        }

        onRequestError(proxy:NetworkRequest):void {
            this.checkReload(proxy);
        }
        
        onTimeout(proxy:NetworkRequest):void {
            //todo 转圈中
            console.warn('请求超时',proxy.requestInfo);
        }

        onReloadError(proxy:NetworkRequest):void {
            //todo 转圈中
            console.warn('重试3次失败没救了',proxy.requestInfo);
        }

        onReponseError(proxy:NetworkRequest):void {

        }

        onReponseSuccess(proxy:NetworkRequest):void {

        }

        private checkReload(proxy:NetworkRequest):void {
            if (proxy.requestInfo.reload == false) {
                this.removeSimpleLoading(proxy);
                return;
            }

            if(proxy.reloadTimes >= 3) {
                core.invokeHook(hooks.network,'onReloadError',proxy);
                return;
            }
            proxy.reloadTimes += 1;
            this.removeSimpleLoading(proxy);

            let prompt : core.IPromptInfo = {
                title : "重新请求",
                text: "网络环境不稳定\n请确保网络连接正常，然后重试\n错误码({code})",
                yes: '重试',
                type: core.PromptState.confirm,
                no: ''
            };
            core.UI.addBox(PromptBox,prompt)
            .then((box:PromptBox)=>{
                box.show().then(()=>{
                    proxy.load();
                })
            });
        }

        private removeSimpleLoading(proxy:NetworkRequest):void {
            if (proxy.requestInfo.mask) {
                if(this._requestCount == 0) {
                    return;
                }
                if (this._requestCount > 0) {
                    this._requestCount --;
                }
                if (this._requestCount == 0) {
                    core.hideSimpleLoading();
                }
            }
        }
    }
}