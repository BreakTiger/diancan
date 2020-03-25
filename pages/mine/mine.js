const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    users: {}
  },

  onLoad: function(options) {
    this.getUser()
  },

  // 用户信息
  getUser: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Person/info'
    let data = {
      token: wx.getStorageSync('token')
    }
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.data.code == 200) {
        that.setData({
          users: res.data.data
        })
      } else {
        modals.showToast(res.data.msg, 'none')
      }
    })
  },

  // 绑定手机
  setPhone: function(e) {
    console.log(e)
    console.log(e.detail)
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    let url = app.globalData.api + '?s=wxapi/Person/bind_phone'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res)
    })


  },

  // 我的订单
  toOrder: function() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  //我的预定
  toReserve: function() {
    // wx.navigateTo({
    //   url: '/pages/reserve/reserve',
    // })
  }
})