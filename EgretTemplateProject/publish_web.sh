echo "-----参数： $0 $1  $2";
echo "-----发布正式，不推送 sh publish_web 0 1 ";
echo "-----发布正式，推送 sh publish_web 1 1 ";
echo "-----发布测试，不推送 sh publish_web 0 2 ";
echo "-----发布测试，推送 sh publish_web 1 2 ";


webPath=./bin-release/web/;
gitPath=../../pocket_hospital_git;
targetPath=../../pocket_hospital_git/h5web;
# targetPath2=/Users/enger/Documents/www/h5web;

rm -rf $webPath;
# rm -rf $targetPath2;

if [ $2x == "1"x ]; then
  echo "----------------------"
  echo "-----publis remote-----"
  echo "----------------------"
  echo  "targetpath:"$targetPath
elif [ $2x == "2"x ]; then
  echo "----------------------"
  echo "-----publis remote test-----"
  echo "----------------------"
  targetPath=../../pocket_hospital_git/h5webtest;
  echo  "targetpath:"$targetPath
else
  echo "----------------------"
  echo "-----publis local-----"
  echo "----------------------"
fi

rm -rf $targetPath;

echo '-----1.clear files finished'

#echo '-----download config'
#node ./tool/downConfig.js 0

egret publish --target web

echo '-----2.publis web finished'

#获取新发布的文件名 
temp_file='';
cd ./bin-release/;
for file in $(ls *)
do
  temp_file=$file;
done
cd ..
mkdir $targetPath;
# mkdir $targetPath2;
cp -r ./bin-release/web/${temp_file}/* ${targetPath}
cp -r ./template/web/*.ico ${targetPath}

echo '-----3.copy file finished'
node ./tool/publish/copy_defaultresjson_h5.js $targetPath

# cp -r ${targetPath}/* ${targetPath2}
echo '-----copy_defaultresjson_mac'


if [ $1x == "1"x ]; then
   echo '-----4.git push'
   cd $gitPath;
   git add .
   git commit -am 'build h5web'
   git push
   git pull
   echo '5.git push finished'
else
   echo ''
fi
echo "----------over!!!------------"
date +%Y-%m-%d-%r