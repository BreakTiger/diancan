//初始化数据
function tabbarinit() {
  return [{
      "current": null,
      "pagePath": "/pages/menu/menu",
      "iconPath": "/tabber/icon-4.png",
      "selectedIconPath": "/tabber/icon-1.png",
      "text": "点餐"
    },
    {
      "current": null,
      "pagePath": "/pages/obtain/obtain",
      "iconPath": "/tabber/icon-5.png",
      "selectedIconPath": "/tabber/icon-2.png",
      "text": "取单"
    },
    {
      "current": null,
      "pagePath": "/pages/mine/mine",
      "iconPath": "/tabber/icon-6.png",
      "selectedIconPath": "/tabber/icon-3.png",
      "text": "我的"
    }
  ]
}

//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath'] //换当前的icon
  otabbar[id]['current'] = id;
  bindData[bindName] = otabbar
  that.setData({
    bindData
  });
  // console.log(bindData)
}

module.exports = {
  tabbar: tabbarmain
}