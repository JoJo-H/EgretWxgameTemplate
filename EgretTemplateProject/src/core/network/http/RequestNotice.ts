module core {

    export class RequestNotice {
 
        /**
         * 请求失败,请求异常
         */
        public static REQUEST_FAIL:string = "net_request_fail";
        /**
         * 响应结果成功
         */
        public static RESPONSE_SUCCEED:string = "net_response_succeed";
        /**
         * 响应结果失败
         */
        public static RESPONSE_ERROR:string = "net_response_error";

        /**
         * 请求超时
         */
        public static TIME_OUT:string = "net_timeout";
    }

}