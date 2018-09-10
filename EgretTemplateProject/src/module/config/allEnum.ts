enum LanguageType {
    zh = 0,
    en = 1
}

enum ShareRewardType {
    Random = 0,         //随机

    PutPatient = 1,     //投放病人
    AppointSuccess = 2, //约会成功
    AppointFail = 3,    //约会失败
    BuildingUp = 4,     //科室升阶
    HospitalUp = 5,     //医院评级
    Ransom = 6,         //赎金

    PutCattle = 14,     //投放黄牛
    BePutCattle = 15,   //被投放黄牛
    NewPatient = 16     //解锁新病人
}