
module core {

    class str {

        static replaceFromObject(text:string, obj:any):string {
            if (is.object(obj)) {
                for (var key in obj) {
                    text = str.replaceAll(text, "\\{" + key + "\\}", obj[key]);
                }
            }
            return text;
        }

        static replaceAll(str:string, search:string, replacement:string):string {
            var s = str.replace(new RegExp(search, 'g'), replacement);
            return s;
        }

        static replaceFromArr(text:string, ...arg):string {
            if (is.array(arg)) {
                for (let key in arg) {
                    text = str.replaceAll(text, "\\{" + key + "\\}", (arg[parseInt(key)]).toString());
                }
            }
            return text;
        }
    }
}