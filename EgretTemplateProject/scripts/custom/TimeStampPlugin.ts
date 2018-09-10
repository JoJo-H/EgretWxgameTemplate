
/** 自定义插件
 * 编译后 js 文件名添加这次编译的时间戳，以便达到对 js 文件版本控制
 * http://developer.egret.com/cn/github/egret-docs/Engine2D/cmdExtensionPlugin/plugin/index.html
 */
class TimeStampPlugin implements plugins.Command {

    private timeStamp: number; //时间戳
    private modifyInitial: Array<string> = []; //保存修改过的库文件 js 文件名字
    private modifyGame: Array<string> = []; //保存修改过的 main 文件 js 文件名字
    private manifestPath: string; //保存 manifest 路径
    constructor() {
        this.timeStamp = Date.now();
        this.manifestPath = "";
    }

    /**
     * 先判断类型为 js 的文件，使用 file.extname 来判断，如果为 js 文件将生成好的时间戳加到 js 文件的名字上，
     * 我们还将所有修改的 js 文件重新放到 manifest.json 中，
     * 所以要将 manifest 路径和修改过的 js 文件名字保存起来以便我们后续修改，最后返回这个文件。
     * @param file 
     */
    async onFile(file: plugins.File) {
        const extName = file.extname;
        if (extName == ".js") {
            const pos = file.path.lastIndexOf(".");
            const prefix = file.path.slice(0, pos);
            const nowName = prefix + this.timeStamp + extName;
            file.path = nowName;
            if (file.basename.indexOf("main.min") >= 0) {
                this.modifyGame.push(file.relative);
            } else {
                this.modifyInitial.push(file.relative);
            }
        }
        if (file.basename.indexOf("manifest.json") >= 0) {
            this.manifestPath = file.relative;
        }
        return file;
    }

    /**
     * 我们还需在 onFinish 方法中处理 manifest.json 文件，先将所有保存好的 js 文件名字放到一个对象中，
     * 然后将这个对象转换为一个 JSON 字符串，最后保利用 createFile 方法修改 manifest 文件。
     * @param commandContext 
     */
    async onFinish(commandContext: plugins.CommandContext) {
        let obj = {
            initial: this.modifyInitial,
            game: this.modifyGame
        };
        const serialize = JSON.stringify(obj);
        commandContext.createFile(this.manifestPath, new Buffer(serialize));
    }
}