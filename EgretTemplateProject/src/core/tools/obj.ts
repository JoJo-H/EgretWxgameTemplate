
module core {


    export class obj {

        //利用递归来实现深拷贝，如果对象属性的值是引用类型（Array,Object），那么对该属性进行深拷贝，直到遍历到属性的值是基本类型为止。  
        static deepClone(obj): any {
            if (!obj && typeof obj !== 'object') {
                return null;
            }
            var newObj = Array.isArray(obj) ? [] : {};
            for (var key in obj) {
                if (obj[key]) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        newObj[key] = Array.isArray(obj[key]) ? [] : {};
                        //递归
                        newObj[key] = this.deepClone(obj[key]);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }

        static deepClone2(obj): any {
            return JSON.parse(JSON.stringify(obj));
        }

        /**
         * @desc 深拷贝，支持常见类型
         * @param {Any} values
         */
        static deepCloneCommon(values) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (null == values || "object" != typeof values) return values;

            // Handle Date
            if (values instanceof Date) {
                copy = new Date();
                copy.setTime(values.getTime());
                return copy;
            }

            // Handle Array
            if (values instanceof Array) {
                copy = [];
                for (var i = 0, len = values.length; i < len; i++) {
                    copy[i] = this.deepCloneCommon(values[i]);
                }
                return copy;
            }

            // Handle Object
            if (values instanceof Object) {
                copy = {};
                for (var attr in values) {
                    if (values.hasOwnProperty(attr)) copy[attr] = this.deepCloneCommon(values[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy values! Its type isn't supported.");
        }

        static simpleClone(obj) {
            if (typeof obj !== 'object') return null;
            let newObj = Array.isArray(obj) ? [] : {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
            // Object.assign(newObj,obj);
            return newObj;
        }

        static getValue(data: any, key: any, defVal: any = null): any {
            if (is.falsy(data)) {
                return defVal;
            }
            key = key + "";
            var keyArr = key.split('.');
            var curObj = data;
            for (var i = 0; i < keyArr.length; i++) {
                var key = keyArr[i];
                if (is.array(curObj)) {
                    curObj = curObj[parseInt(key)];
                } else {
                    if (key == '') {
                        curObj = curObj;
                    } else {
                        curObj = curObj[key];
                    }
                }
                if (!is.existy(curObj)) {
                    break;
                }
            }

            if (!is.existy(curObj)) {
                return defVal;
            }
            return curObj;
        }

        static hasValue(data: any, key: any): boolean {
            if (!data) {
                return false;
            }
            key = key + "";
            var keyArr = key.split('.');
            var obj = data;
            while (keyArr.length > 0 && obj) {
                var k = keyArr.shift();
                if (!obj.hasOwnProperty(k)) {
                    return false;
                }
                obj = obj[k];
            }
            return true;
        }
    }
}