const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    lunbo: [],
    nav: [{
        icon: '/icon/nav-1.png',
        text: '自助下单',
        path: '/pages/menu/menu',
      },
      {
        icon: '/icon/nav-3.png',
        text: '订单',
        path: '/pages/order/order',
      }, {
        icon: '/icon/nav-4.png',
        text: '个人中心',
        path: '/pages/mine/mine',
      }
    ],
    block: [{
        icon: '/icon/draw.png',
        text: '幸运大转盘'
      },
      {
        icon: '/icon/scratch.png',
        text: '抽奖刮刮乐'
      },
      {
        icon: '/icon/group.png',
        text: '商品拼团'
      }
    ],
    r_list: []
  },

  onLoad: function(options) {
    // 获取扫码参数 - 座位
    let scene = decodeURIComponent(options.scene) //参数二维码传递过来的参数
    console.log(scene)
    // let query = options.query.dentistId // 参数二维码传递过来的场景参数
    // console.log(query)
    //设置
    let seat = 1
    wx.setStorageSync('seat', seat)
    this.getBanner()
  },

  // 轮播图
  getBanner: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/index/get_baner'
    modals.loading()
    request.sendRequest(url, 'post', {}, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            lunbo: res.data.data
          })
          that.getTui()
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }

    })
  },

  // 推荐商品
  getTui: function() {
    let that = this
    let url = app.globalData.api + '`?s=wxapi/index/recommend_goods'
    request.sendRequest(url, 'post', {}, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data
          for (let i = 0; i < list.length; i++) {
            list[i].file_name = 'https://canyin.dt5555.cn/uploads/' + list[i].file_name
          }
          that.setData({
            r_list: list
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 导航跳转
  toNav: function(e) {
    let item = e.currentTarget.dataset.item
    let path = item.path + '?id='
    console.log(path)
    if (item.text == '自助下单') {
      app.globalData.item = {}
    }
    wx.navigateTo({
      url: path + 1,
    })
  },

  // 获取
  toRecommend: function(e) {
    let item = e.currentTarget.dataset.item
    app.globalData.item = item
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },

  // 判断登录
  onShow: function() {
    let token = wx.getStorageSync('token') || ''
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 推荐
  toTui: function() {
    let list = this.data.r_list
    wx.navigateTo({
      url: '/pages/index/recommend/recommend?list=' + JSON.stringify(list),
    })
  },

  // 门店
  toShop: function() {
    wx.navigateTo({
      url: '/pages/index/shop/shop',
    })
  },

  toMenu: function() {
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },

  toLocation: function() {
    wx.navigateTo({
      url: '/pages/index/location/location',
    })
  },

  onShareAppMessage: function(options) {

  }
})