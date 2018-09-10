echo "-----参数： 0不推送，1推送： $0 $1 $2";

_version=$2;
if [ $# != 2 ] ; then 
echo '发布参数错误～'
read -p "按键继续" 
exit 1; 
fi

rm -rf ../EgretTemplateProject_wxgame/js
rm -rf ../EgretTemplateProject_wxgame/resource

rm -rf ../EgretTemplateProject_wxgame_remote/$_version/resource
echo '-----1.clear files finished'

#echo '-----download config'
#node ./tool/downConfig.js 1

egret publish --target wxgame

echo '-----2.publis wxgame finished'
node ./tool/publish/copy_defaultresjson_wx.js $_version

echo '-----3.modify default.res.js finished'

# gitPath=../;
# if [ $1x == "1"x ]; then
#    echo '-----4.git push'
#    cd $gitPath;
#    git add .
#    git commit -am 'build h5web'
#    git push
#    git pull
#    echo '-----5.git push finished'
# else
#    echo ''
# fi
echo "----------over!!!------------"
date +%Y-%m-%d-%r