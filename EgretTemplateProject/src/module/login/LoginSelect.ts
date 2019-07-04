
class LoginSelect extends core.BaseComponent {
    static testLoginData: any;
    private callback: any;
    public btn_other: any;
    public btn_wechat: any;
    public txt_account: any;
    public group_login: any;

    public static otherData: any = { "loginId": "", "nickName": "xx", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" };
    private loginList: any = {

        "0": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLptg19", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "1": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt20", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL2lacyvOiaSu9ldaUNM5w380pj4YpmCqibruFVaVzNCAYfiafzhbm4TibyqTmaFsVsNYQxibjxsVpLEQ/0" },
        "2": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpP21", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL2lacyvOiaSu9ldaUNM5w380pj4YpmCqibruFVaVzNCAYfiafzhbm4TibyqTmaFsVsNYQxibjxsVpLEQ/0" },
        "3": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt22", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "4": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt23", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "5": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt24", "nickName": "测试1", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep8AJ219RRenvjYHRfx6T1U34Jo0dy6Q8S7nkLnj7q3SqoHnQicR4tDrOjmU2vHtoLPWtOJHGxesLQ/0" }
    };
    private loginList2: any = {
        "0": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLptg25", "nickName": "扁", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "1": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt126", "nickName": "Enger", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL2lacyvOiaSu9ldaUNM5w380pj4YpmCqibruFVaVzNCAYfiafzhbm4TibyqTmaFsVsNYQxibjxsVpLEQ/0" },
        "2": { "loginId": "o-y7T5C72rpdZdgR1U_JzfvxK2rs", "nickName": "PP", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL2lacyvOiaSu9ldaUNM5w380pj4YpmCqibruFVaVzNCAYfiafzhbm4TibyqTmaFsVsNYQxibjxsVpLEQ/0" },
        "3": { "loginId": "o-y7T5Neq91RrT1Xo3StKwky1_6c", "nickName": "木头", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "4": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt929", "nickName": "无名氏", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRdf2Hldvia5jLKibLtbsVW45b9ocVs59GjUEjDBK58kPDARF8ESvUGkrdk2xzMwnMUXm54OE4f6SA/0" },
        "5": { "loginId": "oSPUC0eS0RqEKawF5QjF2byuLpt131", "nickName": "goon", "sex": 1, "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep8AJ219RRenvjYHRfx6T1U34Jo0dy6Q8S7nkLnj7q3SqoHnQicR4tDrOjmU2vHtoLPWtOJHGxesLQ/0" }
    };
    constructor() {
        super()
        this.skinName = "LoginSelectSkin";
    }


    onEnter(callback: Function, test: boolean): void {
        if (!DEBUG && !test) {
            this.group_login.visible = false;
        }
        super.onEnter();
        this.callback = callback;
        let account = localStorage.getItem('hospital_input_account');
        this.txt_account.text = account ? account : "";
        this.listener(this["enger"],egret.TouchEvent.TOUCH_TAP, this.onEngerLogin.bind(this),this);
        this.listener(this["pp"],egret.TouchEvent.TOUCH_TAP, this.onPpLogin.bind(this),this);
        this.listener(this["bian"],egret.TouchEvent.TOUCH_TAP, this.onBianLogin.bind(this),this);
        this.listener(this["mutou"],egret.TouchEvent.TOUCH_TAP, this.onMutouLogin.bind(this),this);
        this.listener(this["test"],egret.TouchEvent.TOUCH_TAP, this.onTestLogin.bind(this),this);
        this.listener(this["goon"],egret.TouchEvent.TOUCH_TAP, this.onGoonLogin.bind(this),this);
        this.listener(this.btn_other,egret.TouchEvent.TOUCH_TAP, this.onOther.bind(this),this);
        this.listener(this.btn_wechat,egret.TouchEvent.TOUCH_TAP, this.onWeiChat.bind(this),this);

        if (DEBUG) { //内部账号
            this["enger"].label = 'enger';
            this["pp"].label = 'pp';
            this["bian"].label = 'bian';
            this["mutou"].label = 'mutou';
            this["test"].label = 'test';
            this["goon"].label = 'goon';
            this.loginList = this.loginList2;
        }
        // this.testac();
    }

    private onEngerLogin(): void {
        LoginSelect.testLoginData = this.loginList[1];
        this.doCallback();
    }

    private onPpLogin(): void {
        LoginSelect.testLoginData = this.loginList[2];
        if (DEBUG) console.log("选择账号：", LoginSelect.testLoginData);
        this.doCallback();
    }
    private onBianLogin(): void {
        LoginSelect.testLoginData = this.loginList[0];
        this.doCallback();
    }
    private onMutouLogin(): void {
        LoginSelect.testLoginData = this.loginList[3];
        this.doCallback();
    }

    private onTestLogin(): void {
        LoginSelect.testLoginData = this.loginList[4];
        this.doCallback();
    }

    private onGoonLogin(): void {
        LoginSelect.testLoginData = this.loginList[5];
        this.doCallback();
    }
    private onOther(): void {
        var test_account: string = this.txt_account.text;
        if (test_account == "") {
            test_account = "test" + egret.getTimer();
        } else {
            localStorage.setItem('hospital_input_account', test_account);
        }
        LoginSelect.otherData.loginId = test_account;
        LoginSelect.otherData.nickName = test_account;
        LoginSelect.testLoginData = LoginSelect.otherData;
        this.doCallback();
    }

    doCallback(): void {
        if (this.callback) {
            this.callback();
            this.callback = null;
        }
    }

    //跳转微信登录
    private onWeiChat(): void {
        // AudioManager.playerBgMusic("loading_mp3");
        window.location.href = "https://www.lotiyo.cn/sso?return_url=" + encodeURIComponent(window.location.href);
    }
}
window["LoginSelect"] = LoginSelect;