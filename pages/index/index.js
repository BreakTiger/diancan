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
        icon: '/icon/nav-2.png',
        text: '预约',
        path: '/pages/reserve/reserve',
      }, {
        icon: '/icon/nav-3.png',
        text: '订单',
        path: '/pages/order/order',
      }, {
        icon: '/icon/nav-4.png',
        text: '个人中心',
        path: '/pages/mine/mine',
      }
    ],
    r_list: []
  },

  onLoad: function(options) {
    // let seat = options
    console.log(options)
    //设置座位
    let seat = 1
    wx.setStorageSync('seat', seat)
    this.getBanner()
  },

  // 轮播图
  getBanner: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/index/get_baner'
    request.sendRequest(url, 'post', {}, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.data.code == 200) {
        that.setData({
          lunbo: res.data.data
        })
        that.getTui()
      } else {
        modals.showToast(res.data.msg, 'none')
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
    })
  },

  // 导航跳转
  toNav: function(e) {
    let item = e.currentTarget.dataset.item
    let path = item.path
    if (item.text == '自助下单') {
      app.globalData.item = {}
    }
    wx.navigateTo({
      url: path,
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
  }
})