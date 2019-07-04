/**
 * 数学工具类
 */
class MathUtils {
    /**
     * 向上取整
     * @param  {number} value
     * @return number
     */
    public static ceil(value: number): number {
        if (value % 1 == 0) {
            return value;
        }
        if (value > 0) {
            return (value + 1) << 0;
        } else {
            return value << 0;
        }
    }
    /**
     * [min,max)范围内随机一个整数
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @return number   随机值
     */
    public static random(min: number, max: number): number {
        return Math.random() * (max - min) + min << 0;
    }
    /**
     * (n,m]范围内随机一个整数
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @return number   随机值
     */
    public static randomintM(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min) + 1;
    }
    /**
     * (n,m)范围内随机一个整数
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @return number  随机值
     */
    public static randomInt(min: number, max: number): number {
        return Math.round(Math.random() * (max - min - 2) + min + 1);
    }
    /**
     * [n,m]范围内随机一个整数
     * @param  {number} min 最小值
     * @param  {number} max 最大值
     * @return number   随机值
     */
    public static randomIntNM(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * 数组内随机一个元素
     * @param  {T[]} arr    数组
     * @return T
     */
    public static getRandomElement<T>(arr: T[]): T {
        var key: number = Math.floor(Math.random() * arr.length);
        return arr[key];
    }
    /**
      * 计算两点距离
      * @param p1
      * @param p2
      * @return {number}
      */
    public static distance(p1: egret.Point, p2: egret.Point): number {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    /**
     * 计算两点距离
     */
    static pointDistance(x1: number, y1: number, x2: number, y2: number): number {
        var xdiff = x2 - x1;            // 计算两个点的横坐标之差
        var ydiff = y2 - y1;            // 计算两个点的纵坐标之差
        return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);   // 计算两点之间的距离，并将结果返回表单元素
    }
}