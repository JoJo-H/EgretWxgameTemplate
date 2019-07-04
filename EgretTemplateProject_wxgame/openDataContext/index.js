/**
 * 微信开放数据域
 * 使用 Canvas2DAPI 在 SharedCanvas 渲染一个排行榜，
 * 并在主域中渲染此 SharedCanvas
 */


/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
const assets = {
  icon: "openDataContext/assets/icon.png",
  box: "openDataContext/assets/box.png",
  box0: "openDataContext/assets/box0.png",
  box1: "openDataContext/assets/box1.png",
  box2: "openDataContext/assets/box2.png",
  donate: "openDataContext/assets/donate.png",
  likeCount: "openDataContext/assets/praise.png",
  score: "openDataContext/assets/score.png",
  head: "openDataContext/assets/head.png",
  honor: "openDataContext/assets/honor.png",
  level: "openDataContext/assets/level.png",
  last: "openDataContext/assets/last.png",
  next: "openDataContext/assets/next.png",
  lastD:"openDataContext/assets/lastD.png",
  nextD: "openDataContext/assets/nextD.png",
};
/**
 * canvas 大小
 * 这里暂时写死
 * 需要从主域传入
 */
let canvasWidth;
let canvasHeight;



//获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";


/**
 * 所有头像数据
 * 包括姓名，头像图片，得分
 * 排位序号i会根据parge*perPageNum+i+1进行计算
 */
let totalGroup = [
]

/**
 * 创建排行榜
 */
function drawRankPanel() {
  let start = perPageMaxNum * page;
  currentGroup = totalGroup.slice(start, start + perPageMaxNum);
  drawRankByGroup();
  drawButton();
}
/**
 * 根据屏幕大小初始化所有绘制数据
 */
let ratio;
function init() {
  rankItemWidth = Math.ceil(stageWidth*0.9);
  rankItemDistance = Math.ceil(stageHeight * 0.085);
  rankItemHieght = Math.ceil(stageHeight * 0.08)
  startX = Math.ceil(stageWidth*0.05);
  iconWidth = Math.ceil(stageHeight * 0.055);
  iconHeight = Math.ceil(stageHeight * 0.055);
  iconRectWidth = Math.ceil(stageHeight * 0.06);
  iconRectHeight = Math.ceil(stageHeight * 0.06);
  fontSize1 = Math.ceil(rankItemHieght*0.3);
  fontSizeOffsetY1 = Math.ceil(0.5*(rankItemHieght+fontSize1));
  fontSize2 = Math.ceil(rankItemHieght*0.25);
  fontSizeOffsetY2 = Math.ceil(0.5*(rankItemHieght+fontSize2));
  fontSize3 = Math.ceil(rankItemHieght*0.2);

  offsetXLevel1 =  Math.ceil(stageWidth*0.328);
  offsetXLevel2 =  Math.ceil(stageWidth*0.32);
  offsetYLevel = Math.ceil(rankItemHieght*0.78);

  iconOffsetX = Math.ceil(stageWidth*0.235);
  iconOffsetY = Math.ceil((rankItemHieght-iconHeight)*0.5);

  nameWidth = Math.ceil(rankItemWidth*1/3);
  headOffsetX = Math.ceil(stageWidth*0.23);
  headOffsetY = Math.ceil((rankItemHieght-iconRectHeight)*0.5);

  nameOffsetX = Math.ceil(stageWidth*0.38);

  offsetRank1 = Math.ceil(0.09*stageWidth);
  offsetRank2 = Math.ceil(0.11*stageWidth);
  offsetRank3 = Math.ceil(0.095*stageWidth);

  typeIconH = Math.ceil(rankItemHieght*0.5);
  typeOffsetX = Math.ceil(stageWidth*0.7);
  typeOffsetY = Math.ceil((rankItemHieght-typeIconH)*0.5);

  levelOffsetX = Math.ceil(stageWidth*0.3);
  levelOffsetY = Math.ceil(rankItemHieght*0.45);

  valueOffsetX = Math.ceil(stageWidth*0.71+typeIconH);

  perPageMaxNum = Math.floor(stageHeight*0.82/rankItemDistance) - 1;

  buttonWidth = Math.floor(stageWidth * 0.25);
  buttonHeight = Math.floor(stageHeight * 0.06);
  lastButtonOffsetX = startX*3;
  lastButtonOffsetY = Math.floor(perPageMaxNum*rankItemDistance + stageHeight*0.005);
  nextButtonOffsetX = stageWidth - startX*3 - buttonWidth;
  nextButtonOffsetY = lastButtonOffsetY;

  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;

  nextEnabled = totalGroup.length > perPageMaxNum ? 1 : 0;
}

let offsetLevel;
let rankItemWidth;
let rankItemHieght;
let startX;
let startY;
let iconWidth;
let iconHeight;
let preOffsetY;
let fontSize1;
let fontSizeOffsetY1;
let fontSize2;
let fontSizeOffsetY2;
let fontSize3;
let fontSizeOffsetY3;
let iconRectWidth;
let iconRectHeight;
let offsetRank1;
let offsetRank2;
let offsetRank3;

let iconOffsetX;
let iconOffsetY;

let nameWidth;
let headOffsetX;
let headOffsetY;
let nameOffsetX;

let typeIconH;
let typeOffsetX;
let typeOffsetY;

let offsetXLevel1;
let offsetXLevel2;
let offsetYLevel;

let levelOffsetX;
let levelOffsetY;

let valueOffsetX;
let rankItemDistance;

let lastButtonOffsetX;
let lastButtonOffsetY;

let nextButtonOffsetX;
let nextButtonOffsetY;

let buttonWidth;
let buttonHeight;

/**
 * 根据当前绘制组绘制排行榜
 */
function drawRankByGroup() {
  for (let i = 0; i < currentGroup.length; i++) {
    const data = currentGroup[i];
    drawByData(data, i);
  }
}

/**
 * 根据绘制信息以及当前i绘制元素
 */
let rankList = {
  "0" : "1st",
  "1" : "2nd",
  "2" : "3rd"
}
function drawByData(data, i) {
  // let x = startX;
  let rank = page*perPageMaxNum + i + 1;
  //绘制底框
  let bg = rank < 4 ? assets["box"+i] : assets["box"];
  context.drawImage(bg, startX, rankItemDistance*i, rankItemWidth, rankItemHieght);
  //设置字体
  context.lineWidth=5;
  context.font ="bold " + fontSize1 + "px Arial";
  // 绘制序号
  if(rank < 4) {
    rank = rankList[i]
  }
  let offsetRank = offsetRank1;
  if(rank >= 4 &&  rank < 10) {
    offsetRank = offsetRank2;
  } else if(rank >= 10){
    offsetRank = offsetRank3;
  }
  context.strokeStyle="#D37926"
  context.strokeText(rank, offsetRank, rankItemDistance*i+fontSizeOffsetY1,iconWidth)
  context.fillStyle = '#ffffff';
  context.fillText(rank, offsetRank, rankItemDistance*i+fontSizeOffsetY1, iconWidth*0.8);
  //绘制头
  context.drawImage(assets[data.openid], iconOffsetX,rankItemDistance*i+iconOffsetY, iconWidth, iconHeight);
  context.drawImage(assets.head, headOffsetX,rankItemDistance*i+headOffsetY, iconRectWidth, iconRectHeight);
  //绘制图标
  let typeIcon = assets[rankType];
  context.drawImage(typeIcon, typeOffsetX,rankItemDistance*i+typeOffsetY, typeIconH, typeIconH);
  // context.drawImage(assets.level, levelOffsetX,rankItemDistance*i+levelOffsetY, typeIconH, typeIconH);
  //绘制名字
  context.lineWidth=1;
  context.fillStyle="#D37926";
  context.fillText(data.nickname, nameOffsetX, rankItemDistance*i+fontSizeOffsetY2, nameWidth);
  // context.strokeText();
  // context.fillText();
  // 设置字体
  context.font = fontSize2 + "px Arial";
  //绘制分数
  let valueList = data.KVDataList;
  let value = 0;
  let level = 0;
  for(let k in valueList) {
    let valueItem = valueList[k];
    if(valueItem.key == "level") {
      level = valueItem.value
    }
    if(valueItem.key == rankType) {
      if(valueItem.value == "undefined") {
        value = 0;
      } else {
        value = valueItem.value;
      }
    }
  }
  context.fillStyle="#4C4C4C";
  context.fillText(value + "", valueOffsetX, rankItemDistance*i+fontSizeOffsetY2, typeIconH);
  // 设置字体
  // context.font = fontSize3 + "px Arial";
  // let offsetLevel =  offsetXLevel1;
  // if(level > 9) {
  //   offsetLevel =  offsetXLevel2;
  // }
  // context.fillStyle="#84440F";
  // context.fillText(level + "", offsetLevel, rankItemDistance*i+offsetYLevel, typeIconH);
}

/////////////////////////////////////////////////////////////////// 相关缓存数据

///////////////////////////////////数据相关/////////////////////////////////////

/**
 * 渲染标脏量
 * 会在被标脏（true）后重新渲染
 */
let renderDirty = true;

/**
 * 当前绘制组
 */
let currentGroup = [];
/**
 * 每页最多显示个数
 */
let perPageMaxNum;
/**
 * 当前页数,默认0为第一页
 */
let page = 0;
///////////////////////////////////绘制相关///////////////////////////////
/**
 * 舞台大小
 */
let stageWidth;
let stageHeight;

//////////////////////////////////////////////////////////

/**
 * 是否加载过资源的标记量
 */
let hasLoadRes;

/**
 * 资源加载
 */
function preloadAssets() {
  let preloaded = 0;
  let count = 0;
  for (let asset in assets) {
    count++;
    const img = wx.createImage();
    img.onload = function () {
      preloaded++;
      if (preloaded == count) {
        // console.log("加载完成");
        hasLoadRes = true;
      }
    }
    img.src = assets[asset];
    assets[asset] = img;
  }
}

function preloadAvater() {
  for(let cg in totalGroup) {
    let userItem = totalGroup[cg];
    if(!assets[userItem.openid]) {
      let image = wx.createImage();
      image.onload = function(event) {
        assets[userItem.openid] = image;
      } 
      image.onerror = function() {
        assets[userItem.openid] = assets.icon;
      }
      image.src = userItem.avatarUrl;
    } 
  }
}


/**
 * 绘制屏幕
 * 这个函数会在加载完所有资源之后被调用
 */
function createScene() {
  if (sharedCanvas.width && sharedCanvas.height && hasLoadRes) {
    // console.log('初始化完成')
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;
    init();
    return true;
  } else {
    console.log('创建开放数据域失败，请检查是否加载开放数据域资源');
    return false;
  }
}


//记录requestAnimationFrame的ID
let requestAnimationFrameID;
let hasCreateScene;
let hasGetFriendsData;
let rankType;
/**
 * 增加来自主域的监听函数
 */
function addOpenDataContextListener() {
  console.log('增加监听函数')
  wx.onMessage((data) => {
    console.log(data);
    if (data.command == 'open') {
      if(rankType != data.type) {
        totalGroup = totalGroup.sort((item1, item2) => {
          let valueItem2 = item2.KVDataList.find((d2) => {
            return d2["key"] == data.type;
          })
          let valueItem1 = item1.KVDataList.find((d1) => {
            return d1["key"] == data.type;
          })
          if(!valueItem1 && valueItem2) return 1;
          if(valueItem1 && !valueItem2) return -1;
          if(!valueItem1 && !valueItem2) return -1;
          return parseInt(valueItem2.value) > parseInt(valueItem1.value) ? 1 : -1;
        });
        page = 0;
        lastEnabled = 0;
        nextEnabled = totalGroup.length > perPageMaxNum;
      }
      rankType = data.type;       
      renderDirty = true; 
      if (!hasCreateScene) {
        //创建并初始化
        hasCreateScene = createScene();
      }
      requestAnimationFrameID = requestAnimationFrame(loop);
    } else if (data.command == 'close' && requestAnimationFrameID) {
      cancelAnimationFrame(requestAnimationFrameID);
      requestAnimationFrameID = null
      hasCreateScene = false;
      renderDirty = false;
    } else if (data.command == 'loadRes' && !hasLoadRes) {
      /**
       * 加载资源函数
       * 只需要加载一次
       */
      // console.log('加载资源')
      preloadAssets();
      // getFriendData();
    } else if(data.command == "userData" && !hasGetFriendsData){
      getFriendData(); 
    } else if(data.command == "rander") {
      if(data.long) {
        sharedCanvas.height = data.long;
      }
    }
  });
}

function getFriendData() {
  if(!hasGetFriendsData) {
    wx.getFriendCloudStorage({
      keyList: ["score", "likeCount", "donate","honor", "level"],
      success: function (res) {
          console.log(res);
          totalGroup = res.data;
          hasGetFriendsData = true;
          preloadAvater();
        //TODO:进行数据绑定更新
      }
    })
  }
}

addOpenDataContextListener();

wx.onTouchEnd((event) => {
  var l = event.changedTouches.length;
  for (var i = 0; i < l; i++) {
    onTouchEnd(event.changedTouches[i]);
  }
});

/**
 * 创建两个点击按钮
 */
function drawButton() {
  let lbg = lastEnabled == 1 ? assets.last : assets.lastD;
  context.drawImage(lbg, lastButtonOffsetX, lastButtonOffsetY, buttonWidth, buttonHeight);
  let nbg = nextEnabled == 1 ? assets.next : assets.nextD;
  context.drawImage(nbg, nextButtonOffsetX, nextButtonOffsetY, buttonWidth, buttonHeight);
}

let nextEnabled = 1;
let lastEnabled = 0;
function onTouchEnd(event) {
  let x = event.clientX * sharedCanvas.width / canvasWidth;
  let y = event.clientY * sharedCanvas.height / canvasHeight - Math.floor(stageHeight*0.12);
  if (x > lastButtonOffsetX && x < lastButtonOffsetX + buttonWidth && y > lastButtonOffsetY && y < lastButtonOffsetY + buttonHeight) {
    //在last按钮的范围内
    if(lastEnabled == 1) {
      if (page > 0) {
        if(page - 2 >= 0) {
          lastEnabled = 1;
        } else {
          lastEnabled = 0;
        }
        buttonClick(0);
      }
    }
  }
  if (x > nextButtonOffsetX && x < nextButtonOffsetX + buttonWidth && y > nextButtonOffsetY && y < nextButtonOffsetY + buttonHeight) {
    //在next按钮的范围内
    if(nextEnabled == 1) {
      if ((page + 1) * perPageMaxNum < totalGroup.length) {
        if((page + 2) * perPageMaxNum >= totalGroup.length) {
          nextEnabled = 0;
        } else {
          nextEnabled = 1;
        }
        buttonClick(1);
      }
    }
  }
}

/**
 * 根据传入的buttonKey 执行点击处理
 * 0 为上一页按钮
 * 1 为下一页按钮
 */
function buttonClick(buttonKey) {
  let old_buttonY;
  if (buttonKey == 0) {
    //上一页按钮
    old_buttonY = lastButtonOffsetY;
    lastButtonOffsetY += 10;
    page--;
    renderDirty = true;
    console.log('上一页');
    setTimeout(() => {
      lastButtonOffsetY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
    nextEnabled = 1;
  } else if (buttonKey == 1) {
    //下一页按钮
    old_buttonY = nextButtonOffsetY;
    nextButtonOffsetY += 10;
    page++;
    renderDirty = true;
    console.log('下一页');
    setTimeout(() => {
      nextButtonOffsetY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
    lastEnabled = 1;
  }
}

/**
 * 循环函数
 * 每帧判断一下是否需要渲染
 * 如果被标脏，则重新渲染
 */
function loop() {
  if (renderDirty) {
    // console.log(`stageWidth :${stageWidth}   stageHeight:${stageHeight}`)
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    renderDirty = false;
    drawRankPanel();
  }
  requestAnimationFrameID = requestAnimationFrame(loop);
}

