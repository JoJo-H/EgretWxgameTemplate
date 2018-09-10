
module core {
    var _type_id_ = 1;
    var _type_key_name = "__meru_type_id__";

    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    export function getTypeId(type:any):any {
        if (!type.hasOwnProperty(_type_key_name)) {
            type[_type_key_name] = _type_id_ ++;
        }
        return type[_type_key_name];
    }

    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    export function hasTypeId(type:any):boolean {
    return is.truthy(type) &&
                type.hasOwnProperty(_type_key_name);
    }
}