/**
 * 解释wx的h5sdk
 */
class ParseH5jssdk {

  api = "https://h5sdk.game.qq.com/api2/H5SDKApi.php";
  report = "";
  apptype = 4;
  wxappid = "";
  networkType = "";
  h5channel = 10030414;
  h5sdkVersion = "1.7.0";
  gameVersion = "";
  reportCount = 9;
  requestCount = 0;
  maxRequestCount = 1;
  tempUserLoginInfo = {};
  tempReportData = [];
  tempDate = "";

  setLog(e) {
    var t, n = new Date,
      i = n.getFullYear() + "/" + (n.getMonth() + 1) + "/" + n.getSeconds() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds();
    this.tempReportData.push((t = {}, o(t, e + "_endTime", i), o(t, "" + e, (new Date).getTime() - this.tempDate), t))
  }
  serialize(e) {
    return JSON.stringify(e);
  }

  getSystem() {
    var e = this.getSystemInfoSync(),
      t = e.system;
    return t.indexOf("Android") > -1 ? "android" : t.indexOf("iOS") > -1 ? "ios" : "pc"
  }
  getH5SDKVersion() {
    return this.h5sdkVersion;
  }
  getWXsdkVersion() {
    var e = this.getSystemInfoSync(),
      t = e.SDKVersion;
    return t = t.replace(/\./g, ""), t = t.substring(0, 3)
  }
  checkSession() {
    return new Promise(function (e, t) {
      wx.checkSession({
        success: function (t) {
          e(t)
        },
        fail: function (e) {
          t(e)
        }
      })
    })
  }

  getNetworkType() {
    wx.getNetworkType({
      success: (e) => {
        this.networkType = e.networkType;
      }
    })
  }

  /**
   * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
   * @param key 
   * @param value 
   * @param time 多久过期，有则设置过期时间
   */
  setStorage(key, value, time) {
    //设置过期时间
    if (void 0 !== time && null !== time) {
      time = Math.abs(time);
      var o = Date.now(),
        i = o + 1e3 * time
    }
    try {
      wx.setStorageSync(key, value);
      if (void 0 !== time && null !== time) {
        wx.setStorageSync(key + "_expiresIn", i)
      }
    } catch (e) {
      return !1;
    }
    return !0;
  }

  /**获取缓冲数据，过期则返回null */
  getStorage(key) {
    var t = Date.now(),
      n = wx.getStorageSync(key + "_expiresIn");
    if ("" == n) try {
      return wx.getStorageSync(key)
    } catch (e) {
      return null
    } else {
      if (n < t) {
        return this.removeStorage(key)
      } else {
        return null;
      };
      try {
        return wx.getStorageSync(key)
      } catch (e) {
        return null
      }
    }
  }
  removeStorage(key) {
    try {
      wx.removeStorageSync(key), wx.removeStorageSync(key + "_expiresIn")
    } catch (e) {
      return !1
    }
    return !0
  }

  /** 检测登录 
   * callbackData : {success,fail}
   * 第一次登录获取 code 显示登录按钮
   * 
  */
  checkLogin(callbackData) {
    var t = this;
    this.tempDate = (new Date).getTime();
    //已登录过，有缓存登录信息  openid  sdkKey
    if (null == this.getStorage("openid") || null == this.getStorage("sdkKey") || this.getStorage("openid").length < 8 || this.getStorage("sdkKey").length < 8) {
      this.login(callbackData);
    } else {
      if (this.getStorage("scopeUserInfo") || r.default.getWXsdkVersion() < 206) {
        this.getUserinfoLowVersionByStorage(callbackData)
      } else {
        t.checkUserLoginStatus(callbackData);
      }
    }
  }
  checkUserLoginStatus(e) {
    var t = this;
    t.getLoginUserInfo({}).then(()=> {
      var t = {
        userInfo: {
          h5game_openid: this.getStorage("openid"),
          h5sdk_sessionid: this.getStorage("sdkKey")
        }
      };
      null != this.getStorage("unionid") && (t.userInfo.unionid = this.getStorage("unionid"));
      t.needCreateUserInfoBtn = !0, "function" == typeof e.success && e.success(t)
    }).catch(function(n) {
      "object" == (void 0 === n ? "undefined" : i(n)) && "object" == i(n.data) && "-9201" == n.data.iRet ? t.login(e) : "function" == typeof e.fail && e.fail(n)
    })
  }

  /**
   * 微信登录授权 获取code ，然后再去获取微信 h5sdk_sessionid openid unionid
   * @param {*} callbackData 
   */
  login(callbackData) {
    this.getLogin().then((loginData) => {
      if (loginData.code) {
        this.setLog("login_success");
        this.tempDate = new Date();
        //低版本用getUserinfoLowVersion方法获取登录数据
        if (this.getStorage("scopeUserInfo") || this.getWXsdkVersion() < 206) {
          this.getUserinfoLowVersion(callbackData, loginData);
        } else {
          this.getLoginState(loginData, callbackData);
        }
      } else {
        this.setLog("getLoginCode_fail");
        if ("function" == typeof callbackData.fail) {
          callbackData.fail(t);
        }
      }
    }).catch((t) => {
      this.setLog("login_fail");
      if ("function" == typeof callbackData.fail) {
        callbackData.fail(t);
      }
    });
  }

  /**
   * 获取微信登录的code
   */
  getLogin() {
    return new Promise((t, n) => {
      wx.login({
        success: (e) => {
          t(e)
        },
        fail: (t) => {
          n(t), this.reportLoginFail(1, t.errMsg)
        }
      })
    })
  }
  getLoginKey(code, userInfo) {
    return new Promise((resolve, reject) => {
      var that = this;
      function run() {
        that.getLoginKeyDefault(code, userInfo).then(() => {
          that.requestCount = 0;
          resolve();
        }).catch((err) => {
          var t = void 0 == err.errMsg ? err.sMsg : err.errMsg;
          that.reportLoginFail(1, t);
          t = JSON.stringify(err);
          if (/timed\sout/.test(t) || /time\sout/.test(t) || /timedout/.test(t) || /timeout/.test(t) || /failed\sto\sconnect\sto/.test(t) || /请求超时/.test(t)) {
            if (that.requestCount >= that.maxRequestCount) {
              if ("object" == (void 0 === err ? "undefined" : typeof err)) {
                err.errfrom = "h5sdk getLoginKey";
                err.requestCount = that.requestCount;
                reject(err);
              }
            } else {
              run();
              that.requestCount++;
            }
          } else {
            if ("object" == (void 0 === err ? "undefined" : typeof err)) {
              err.errfrom = "h5sdk getLoginKey";
              reject(err);
            }
          }
        })
      }
      run();
    })
  }

  /**
   * 无登录信息时：请求获取 h5sdk_sessionid openid unionid
   * @param {*} code 
   * @param {*} userInfo 
   */
  getLoginKeyDefault(code, userInfo) {
    var n = wx.getSystemInfoSync(),
      o = Math.random(),
      i = wx.getLaunchOptionsSync(),
      r = {
        h5game_code: code,
        methodCmd: 1034,
        apptype: this.apptype,
        h5game_os: this.getSystem(),
        appid: this.wxappid,
        h5channel: void 0 == i.query.scene ? i.scene : i.query.scene,
        gender: void 0 == userInfo.gender ? -1 : userInfo.gender,
        country: void 0 == userInfo.country ? -1 : userInfo.country,
        province: void 0 == userInfo.province ? -1 : userInfo.province,
        city: void 0 == userInfo.city ? -1 : userInfo.city,
        regChannel: this.h5channel,
        version: void 0 == this.gameVersion ? "" : this.gameVersion,
        h5sdkVersion: this.h5sdkVersion,
        user_agent: {
          channelversion: n.version,
          system: n.system,
          model: n.model,
          networkType: this.networkType
        },
        random: o
      },
      u = new Date,
      c = u.getFullYear() + "/" + (u.getMonth() + 1) + "/" + u.getSeconds() + " " + u.getHours() + ":" + u.getMinutes() + ":" + u.getSeconds();
    this.tempReportData.push({
      getLoginKey_random: o,
      getLoginKey_start: c
    });
    if (void 0 == i.query.openid || "" == i.query.openid || 1007 != i.query.scene && 1008 != i.query.scene || (r.shareOpenid = i.query.openid, r.shareStatus = 13 == i.query.shareStatus ? 13 : -1)) {
      return new Promise(function (e, t) {
        if (r.appid.length < 3) {
          t({
            data: {
              iRet: "-9999",
              sMsg: "param error, appid illegal"
            }
          });
        } else {
          //todo 请求获取 h5sdk_sessionid openid unionid
          (0, f.get)(a.default.api, r).then(function (n) {
            if ("-9201" == n.data.iRet || "40029" == n.data.iRet || "-9999" == n.data.iRet) t(n);
            else {
              var o = n.data;
              d.default.setStorage("sdkKey", o.list.h5sdk_sessionid, 86400);
              d.default.setStorage("openid", o.list.openid, 86400); 
              o.list.unionid && d.default.setStorage("unionid", o.list.unionid, 86400);
              e(o);
            }
          }).catch(function (e) {
            t(e)
          })
        }
      })
    } else {
      return Promise.resolve();
    }
  }

  getUserinfoLowVersion(callbackData, loginData) {
    var n = this;
    this.getUserInfo(callbackData).then((obj) => {
      this.setLog("getUserInfo_success");
      this.setStorage("scopeUserInfo", !0);
      this.tempDate = new Date();
      this.getLoginKey(loginData.code, obj.userInfo).then(() => {
        var t = {
          encryptedData: obj.encryptedData,
          errMsg: obj.errMsg,
          iv: obj.iv,
          rawData: obj.rawData,
          signature: obj.signature,
          userInfo: {
            avatarUrl: obj.userInfo.avatarUrl,
            city: obj.userInfo.city,
            country: obj.userInfo.country,
            gender: obj.userInfo.gender,
            h5game_openid: this.getStorage("openid"),
            h5sdk_sessionid: this.getStorage("sdkKey"),
            language: obj.userInfo.language,
            nickName: obj.userInfo.nickName,
            province: obj.userInfo.province
          }
        };
        if (null != this.getStorage("unionid")) {
          t.userInfo.unionid = this.getStorage("unionid");
        }
        if ("function" == typeof callbackData.success) {
          callbackData.success(t);
        }
      }).catch((t) => {
        this.setLog("getLoginKey_fail");
        if ("function" == typeof callbackData.fail) {
          callbackData.fail(t);
        }
      })
    }).catch((o) => {
      this.setLog("getUserInfo_fail");
      this.tempDate = new Date();
      this.getLoginKey(loginData.code, {}).then(() => {
        var t = {
          userInfo: {
            h5game_openid: this.getStorage("openid"),
            h5sdk_sessionid: this.getStorage("sdkKey")
          }
        };
        if (null != this.getStorage("unionid")) {
          t.userInfo.unionid = this.getStorage("unionid");
        }
        this.setLog("getLoginKey_success");
        if (!0 === callbackData.canUserInfoPlay) {
          this.reportLoginFail(2, o.errMsg);
          if ("function" == typeof callbackData.fail) {
            callbackData.fail(t);
          }
        } else {
          if (/auth\sdeny/.test(o.errMsg)) {
            if ("function" == typeof callbackData.success) {
              callbackData.success(t);
            }
          } else {
            this.reportLoginFail(2, o.errMsg);
            if ("function" == typeof callbackData.fail) {
              callbackData.fail(t);
            }
          }
        }
      }).catch((t) => {
        this.setLog("getLoginKey_fail");
        if ("function" == typeof callbackData.fail) {
          callbackData.fail(t);
        }
      });
    });
  }

  getUserinfoLowVersionByStorage(e) {
    var t = this;
    this.getUserInfo(e).then((loginData) => {
      this.setLog("getUserInfo_success");
      this.tempDate = (new Date).getTime();
      this.setStorage("scopeUserInfo", !0);
      this.getLoginUserInfo(loginData.userInfo).then( ()=> {
        this.setLog("checkUserLoginStatus");
        var t = {
          encryptedData: loginData.encryptedData,
          errMsg: loginData.errMsg,
          iv: loginData.iv,
          rawData: loginData.rawData,
          signature: loginData.signature,
          userInfo: {
            avatarUrl: loginData.userInfo.avatarUrl,
            city: loginData.userInfo.city,
            country: loginData.userInfo.country,
            gender: loginData.userInfo.gender,
            h5game_openid: this.getStorage("openid"),
            h5sdk_sessionid: this.getStorage("sdkKey"),
            language: loginData.userInfo.language,
            nickName: loginData.userInfo.nickName,
            province: loginData.userInfo.province
          }
        };
        if(null != f.default.getStorage("unionid")){
          t.userInfo.unionid = f.default.getStorage("unionid");
        }
        if("function" == typeof e.success){
          e.success(t);
        }
      }).catch( (n)=> {
        this.setLog("checkLoginState");
        if("object" == (void 0 === n ? "undefined" : typeof n) && "object" == typeof(n.data) && "-9201" == n.data.iRet ){
          this.login(e);
        }else{
          "function" == typeof e.fail && e.fail(n);
        }
      })
    }).catch( (n)=> {
      if(!0 === e.canUserInfoPlay) {
        this.setLog("getUserInfo_fail");
        this.reportLoginFail(2, n.errMsg);
        "function" == typeof e.fail && e.fail(n);
      }else{
        if(/auth\sdeny/.test(n.errMsg)){
          this.setLog("checkLoginState_start");
          t.getLoginUserInfo({}).then( ()=> {
            this.setLog("checkLoginState_success");
            var t = {
              userInfo: {
                h5game_openid: this.getStorage("openid"),
                h5sdk_sessionid: this.getStorage("sdkKey")
              }
            };
            if(null != this.getStorage("unionid")){
              t.userInfo.unionid = this.getStorage("unionid");
            }
            "function" == typeof e.success && e.success(t);
          }).catch( (n)=> {
            this.setLog("checkLoginState_fail");
             this.tempDate = (new Date).getTime();
             if("object" == (void 0 === n ? "undefined" : typeof(n)) && "object" == typeof(n.data) && "-9201" == n.data.iRet){
              this.login(e);
             }else{
              "function" == typeof e.fail && e.fail(n);
             }
          });
        }else{
          this.setLog("getUserInfo_fail");
           this.reportLoginFail(1, n.errMsg);
          "function" == typeof e.fail && e.fail(n);
        }
      }
    })
  }

  getLoginUserInfo(e) {
    var t = wx.getSystemInfoSync(),
      n = wx.getLaunchOptionsSync(),
      o = Math.random(),
      i = {
        methodCmd: 1039,
        apptype: this.apptype,
        h5game_openid: this.getStorage("openid"),
        h5sdk_sessionid: this.getStorage("sdkKey"),
        no_strong_check: 0,
        h5game_os: this.getSystem(),
        appid: this.wxappid,
        h5channel: void 0 == n.query.scene ? n.scene : n.query.scene,
        gender: void 0 == e.gender ? -1 : e.gender,
        country: void 0 == e.country ? -1 : e.country,
        province: void 0 == e.province ? -1 : e.province,
        city: void 0 == e.city ? -1 : e.city,
        regChannel: this.h5channel,
        version: void 0 == this.gameVersion ? "" : this.gameVersion,
        h5sdkVersion: this.h5sdkVersion,
        user_agent: {
          channelversion: t.version,
          system: t.system,
          model: t.model,
          networkType: this.networkType
        },
        random: o
      },
      r = new Date,
      u = r.getFullYear() + "/" + (r.getMonth() + 1) + "/" + r.getSeconds() + " " + r.getHours() + ":" + r.getMinutes() + ":" + r.getSeconds();
      this.tempReportData.push({
        checkUserLoginStatus_random: o,
        checkUserLoginStatus_start: u
      });
      if(void 0 == n.query.openid || "" == n.query.openid || 1007 != n.query.scene && 1008 != n.query.scene || (i.shareOpenid = n.query.openid, i.shareStatus = 13 == n.query.shareStatus ? 13 : -1)){
        return new Promise(function(resolve, reject) {
          if(i.appid.length < 3){
            reject({
              data: {
                iRet: "-9999",
                sMsg: "param error, appid illegal"
              }
            });
          }else{
            void 0 == i.h5game_openid || null == i.h5game_openid || "" == i.h5game_openid ? reject({
              data: {
                iRet: "-9999",
                sMsg: "h5game_openid is not empty"
              }
            }) : void 0 == i.h5sdk_sessionid || null == i.h5sdk_sessionid || "" == i.h5sdk_sessionid ? reject({
              data: {
                iRet: "-9999",
                sMsg: "h5sdk_sessionid is not empty"
              }
            }) : (0, f.get)(a.default.api, i).then(function(n) {
              "-9201" == n.data.iRet || "40029" == n.data.iRet || "-9999" == n.data.iRet ? reject(n) : resolve(n)
            }).catch(function(e) {
              reject(e)
            })
          }
        })
      }else{
        return Promise.resolve();
      }
  }

  /**
   * 使用code 获取微信小游戏 h5sdk_sessionid openid unionid
   * 第一次登录或者登录信息过期后 ， 需要登录按钮
   * @param {*} loginData 
   * @param {*} callbackData 
   */
  getLoginState(loginData, callbackData) {
    this.getLoginKey(loginData.code, {}).then(() => {
      var e = {
        userInfo: {
          h5game_openid: this.getStorage("openid"),
          h5sdk_sessionid: this.getStorage("sdkKey")
        }
      };
      if (null != this.getStorage("unionid")) {
        e.userInfo.unionid = f.default.getStorage("unionid");
      }
      e.needCreateUserInfoBtn = !0;
      this.setLog("getLoginKey_success");
      if ("function" == typeof callbackData.success) {
        callbackData.success(e);
      }
    }).catch((e) => {
      if ("function" == typeof callbackData.fail) {
        callbackData.fail(e);
      }
    })
  }

  getUserInfo(e) {
    return new Promise(function (t, n) {
      wx.getUserInfo({
        lang: void 0 == e.lang ? "zh_CN" : e.lang,
        success: function (r) {
          t(r)
        },
        fail: function (r) {
          n(r)
        }
      })
    })
  }

  reportLoginFail(e, t) {
    var n = wx.getLaunchOptionsSync(),
      obj = {
        reportType: "PlayerLogin_fail",
        isubZoneAreaID: -1,
        version: void 0 == this.gameVersion ? "" : this.gameVersion,
        regChannel: this.h5channel,
        h5channel: void 0 == n.query.scene ? n.scene : n.query.scene,
        iactionid: e,
        iresult: -1,
        extend: {
          sMsg: t
        }
      };
    if (void 0 == n.query.openid || "" == n.query.openid || 1007 != n.query.scene && 1008 != n.query.scene) {
      (obj.shareOpenid = n.query.openid, obj.shareStatus = 13 == n.query.shareStatus ? 13 : -1);
    }
    var i = [obj];
    //todo
  }
}
