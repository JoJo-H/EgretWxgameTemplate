/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */
const fileutil = require('./library/file-util');

class WxgamePlatform {

    name = 'wxgame'
  appId = "wx3de7a1f450fdca66";
    videoAd;
    share() {
        //回到前台
        wx.onShow(function () {
            if (window.bgaudio) {
                window.bgaudio.play();
            }
            if (window.wxOnshow) {
                window.wxOnshow();
            }
        })
        //接到电话、闹钟响起、系统提友的语音/视频通话请求。被中断之后重新播放
        wx.onAudioInterruptionEnd(function () {
            console.log("恢复接到电话等操作");
            if (window.bgaudio) {
                window.bgaudio.play();
            }
            if (window.wxOnshow) {
                window.wxOnshow();
            }
        })

        wx.onAudioInterruptionBegin(function () {
            console.log("中断接到电话等操作");
            if (window.wxOnHide) {
                window.wxOnHide();
            }
        })

        //退到后台
        wx.onHide(function () {
            if (window.wxOnHide) {
                window.wxOnHide();
            }
        })
        // console.log("基础库版本："+wx.version.version);
        H5SDK.share(function () {
            let num = Math.floor(Math.random() * 2);
            return {
                shareInfo: {
                    title: num == 0 ? "我还能再抢救一下！真的" : "我再也不来你们医院抢人了，求放过！",
                    imageUrl: "openDataContext/assets/shareImg_" + num + ".jpg"
                },
                success: function (res) {
                    console.log("success: ", res);
                },
                fail: function (res) {
                    console.log("failure: ", res);
                }
            };
        });
    }

    getRecommendUI(openid) {
        if (!window.recommendUI) {
            window.recommendUI = new Recommender({
                appid: window.platform.appId,
                openid: openid,
                env: "prod",
                debug: false
            });
        }
        return window.recommendUI;
    }

    enterReport(openid) {
        //this.getRecommendUI(openid).enterReport(openid);
    }

    /**
     * 重载界面
     */
    reloadPage() {
        wx.exitMiniProgram({});
        //   window.location.href = window.location.href;
    }

    /**
     * 打开游戏圈
     */
    createGameClubButton() {
        let button = wx.createGameClubButton({
            style: {
                left: (window.innerWidth - 40) * 0.5 + (145 * window.innerWidth / 720),
                top: (window.innerHeight) * 0.5 + (55 * window.innerHeight / 1280),
                width: 40,
                height: 40
            }
        });
        return button;
    }

    /**
     * 跳转其他小游戏
     */
    navigateToMiniProgram(appId, path) {
        return new Promise((resolve, reject) => {
            wx.navigateToMiniProgram({
                appId: appId,
                path: path,
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'develop',
                success(res) {
                    resolve(res);
                }
            })
        });
    }

    /**
     * 获取getSessionInfo
     */
    getSessionInfo() {
        return H5SDK.getSessionInfo();
    }

    /**
     * 支付
     */
    requestMidasPayment(num, areaId) {
        return new Promise((resolve, reject) => {
            wx.requestMidasPayment({
                "mode": "game",
                "env": 0,
                "platform": "android",
                "offerId": "1450016057",
                "currencyType": "CNY",
                "buyQuantity": num,
                "zoneId": areaId,
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                    console.log(res);
                },
                complete: function (res) {
                    console.log(res);
                }
            })
        });
    }

    /**
     * 播放广告
     */
    createRewardedVideoAd(adUnitId = 'adunit-8c683833fc42bf03') {
        if (!window.videoAd) {
            console.log("创建广告组件");
            window.videoAd = wx.createRewardedVideoAd({
                adUnitId: adUnitId
            })
        }
        return new Promise((resolve, reject) => {
            window.videoAd.load()
                .then(() => videoAd.show())
                .catch(err => createRewardedVideoAd())
            window.videoAd.onClose(res => {
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    resolve(true);
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    resolve(false);
                }
            })
        });
    }

    login() {
        console.log("login----------------");
        try {
            var res = wx.getSystemInfoSync();
            console.log("微信版本：", res.version);
            if (res.version == "6.6.6") {
                wx.showModal({
                    title: '提示',
                    content: '您的微信版本过低，请升级！',
                    showCancel: false,
                    success: function (res) {
                    }
                })
                return;
            }
        } catch (e) {
            // Do something when catch error
        }
        return new Promise((resolve, reject) => {
            H5SDK.checkLogin({
                success: function (res) {
                    console.log("检测登陆情况返回：", res);
                    window.tpp = res.userInfo["h5game_openid"];
                    window.spp = res.userInfo["h5sdk_sessionid"];
                    //需要创建用户信息按钮，通过onTap事件获取用户信息
                    let needCreateUserInfoBtn = false;
                    if (res.hasOwnProperty('needCreateUserInfoBtn')) {
                        needCreateUserInfoBtn = res.needCreateUserInfoBtn;
                    } else {
                        console.log('没有needCreateUserInfoBtn属性');
                        if (!res.userInfo.hasOwnProperty('avatarUrl')) {
                            needCreateUserInfoBtn = true;
                        } else {
                            needCreateUserInfoBtn = false;
                        }
                    }
                    if (needCreateUserInfoBtn) {
                        console.log('创建按钮')
                        let bob = window.innerWidth / window.innerHeight < 0.5;
                        let userinfoBtn = H5SDK.createUserInfoButton({
                            type: 'image',
                            image: 'openDataContext/assets/login.png',
                            style: {
                                left: (window.innerWidth - 129) * 0.5,
                                top: (window.innerHeight * 0.5 + 230 * window.innerHeight / 720 - (bob ? (window.innerHeight - 720) / 2 : 0)),
                                width: 129,
                                height: 50,
                                lineHeight: 40,
                                backgroundColor: '#00ff00',
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4
                            }
                        });
                        userinfoBtn.onTap(function (res1) {
                            // console.log("aaa",window.tpp);
                            if (res1.userInfo) {
                                userinfoBtn.hide();
                                res1.userInfo.h5game_openid = window.tpp;
                                res1.userInfo.h5sdk_sessionid = window.spp;
                                resolve(res1.userInfo);
                                window.tpp = "";
                                window.spp = "";
                            }
                            else {
                                // resolve(res);
                            }
                        })
                    } else {
                        console.log("登陆成功返回：", res);
                        if (res.userInfo) {
                            resolve(res.userInfo);
                        }
                        else {
                            resolve(res);
                        }
                    }
                },
                fail: function (e) {
                    console.log("检测登陆情况fail", e);
                }
            })
        })
    }

    getUserInfo() {
        console.log("getUserInfo---------------");
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * 上报统计数据
     * 查询平台：http://logx.ied.com
     */
    report(type, reportData, objs) {
        H5SDK.report(type, reportData, objs);
    }

    shareAppMessage(shareData) {
        console.log('分享信息：', shareData);
        return new Promise((resolve, reject) => {
            if (shareData.clipScreen) {
                let scaleX = canvas.width / shareData.stageW;
                let scaleY = canvas.height / shareData.stageH;
                let rWidth = shareData.hasOwnProperty('width') ? shareData.width : 500;
                let rHeight = shareData.hasOwnProperty('height') ? shareData.height : 400;
                let tempFilePath = canvas.toTempFilePathSync({
                    x: shareData.x * scaleX,
                    y: shareData.y * scaleY,
                    width: rWidth * scaleX,
                    height: rHeight * scaleY,
                    destWidth: 500,
                    destHeight: 400
                })
                this.updateShareMenu(true).then((res) => {
                    if (res) {
                        // console.log('updateShareMenu',res);
                        return new Promise((resolve2, reject2) => {
                            wx.shareAppMessage({
                                title: shareData.title,
                                imageUrl: shareData.imageUrl,
                                query: shareData.queryStr,
                                success: resp => {
                                    console.log(resp);
                                    console.log('-------success')
                                    resolve(true);
                                },
                                fail: resp => {
                                    console.log(resp);
                                    console.log('-----fail')
                                    resolve(false);
                                }
                            })
                        });
                    }
                });
            } else {
                this.updateShareMenu(true).then((res) => {
                    if (res) {
                        // console.log('updateShareMenu',res);
                        return new Promise((resolve2, reject2) => {
                            wx.shareAppMessage({
                                title: shareData.title,
                                imageUrl: shareData.imageUrl,
                                query: shareData.queryStr,
                                success: resp => {
                                    console.log(resp);
                                    console.log('-------success')
                                    resolve(true);
                                },
                                fail: resp => {
                                    console.log(resp);
                                    console.log('-----fail')
                                    resolve(false);
                                }
                            })
                        });
                    }
                });
            }
        });
    }

    //检查是否有小程序更新
    checkviserion() {
        return new Promise((resolve, reject) => {
            if (typeof wx.getUpdateManager === 'function') {
                console.log('检查是否有小程序更新1');
                const updateManager = wx.getUpdateManager();
                console.log('检查是否有小程序更新2', updateManager);
                var tt = setTimeout(() => {
                    resolve({
                        result: -1,
                        data: false
                    })
                }, 1000);
                updateManager.onCheckForUpdate(function (res) {
                    clearTimeout(tt);
                    // 请求完新版本信息的回调
                    console.log("请求完新版本信息的回调", res.hasUpdate)
                    // if(res.hasUpdate)
                    // {
                    //   clearnFileCache()
                    // }
                    resolve({
                        result: 0,
                        data: res.hasUpdate
                    })
                })

                updateManager.onUpdateReady(function () {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    console.log("新的版本已经下载好")
                    updateManager.applyUpdate()
                    resolve({
                        result: 1,
                        data: undefined
                    })
                })

                updateManager.onUpdateFailed(function () {
                    // 新的版本下载失败
                    console.log("新的版本下载失败")
                    resolve({
                        result: -1,
                        data: undefined
                    })
                })
            } else {
                console.log("不支持版本更新")
                resolve({
                    result: 2,
                    data: undefined
                })
            }
        });
    }

    //catch wx error
    wxCatchError(callback) {
        wx.onError(callback);
    }

    //调用垃圾回收
    wxGC() {
        wx.triggerGC();
    }
    //清理文件缓存
    clearnFileCache() {
        const tempImageDir = `temp_image`;//下载总目录
        const tempTextDir = `temp_text/`;//下载总目录
        fileutil.fs.remove(tempImageDir);
        //
        fileutil.fs.remove(tempTextDir);
    }

    //播放背景音效
    playerBgMusic(url) {
        if (!window.bgaudio) {
            window.bgaudio = wx.createInnerAudioContext();
        }
        window.bgaudio.autoplay = true;
        window.bgaudio.loop = true;
        window.bgaudio.src = url;
        window.bgaudio.obeyMuteSwitch = true;
        window.bgaudio.play();
    }


    //播放音效
    playerSound(url) {
        if (!window.saudio) {
            window.saudio = wx.createInnerAudioContext();
        }
        saudio.src = url; // src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
        if (window.bgaudio) {
            window.bgaudio.obeyMuteSwitch = true;
        }
        saudio.play();
    }
    getShareInfo() {
        return new Promise((resolve, reject) => {
            wx.getShareInfo({
                success: (res) => {
                    resolve(res);
                }
            })
        })
    }

    sendOpenData(data) {
        let openDataContext = wx.getOpenDataContext();
        console.log(openDataContext);
        openDataContext.postMessage(data);
    }

    setUserCloudStorage(data) {
        return new Promise((resolve, reject) => {
            wx.setUserCloudStorage({
                KVDataList: data,
                success: (res) => {
                    resolve(res)
                }
            })
        })
    }

    getLaunchOptionsSync() {
        return wx.getLaunchOptionsSync();
    }

    updateShareMenu(withShareTicket) {
        return new Promise((resolve, reject) => {
            wx.updateShareMenu({
                withShareTicket: withShareTicket,
                success: res => {
                    resolve(true);
                },
                fail: res => {
                    resolve(false);
                }
            });
        })
    }

    getSystemInfoSync() {
        return wx.getSystemInfoSync();
    }

    openDataContext = new WxgameOpenDataContext();
}


class WxgameOpenDataContext {

    createDisplayObject(type, width, height) {
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
        const context = renderContext.context;
        ////需要用到最新的微信版本
        ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
        ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
        if (!context.wxBindCanvasTexture) {
            egret.startTick((timeStarmp) => {
                egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                bitmapdata.webGLTexture = null;
                return false;
            }, this);
        }
        return bitmap;
    }

    postMessage(data) {
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }


}
window.platform = new WxgamePlatform();