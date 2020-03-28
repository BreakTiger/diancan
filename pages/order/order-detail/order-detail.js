const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    detail: {},
    goods: []
  },

  onLoad: function(options) {
    let data = JSON.parse(options.item)
    let goods = data.goods_info
    for (let i = 0; i < goods.length; i++) {
      goods[i].file_name = 'https://canyin.dt5555.cn/uploads/' + goods[i].file_name
    }
    this.setData({
      detail: data,
      goods: goods
    })
  },

  //继续支付
  toPay: function() {
    let that = this
    let data = {
      order_id: that.data.detail.order_id,
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Pay/do_pay'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.payMemnt(res.data.data)
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 调用支付
  payMemnt: function(e) {
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: function(res) {
        modals.showToast('支付成功', 'success')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      fail: function(res) {
        modals.showToast('支付失败', 'loading')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },

  //再买一单
  buyAgain: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      order_id: that.data.detail.order_id
    }
    let url = app.globalData.api + '?s=wxapi/Cart/repetition'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res.data)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/menu/menu',
          })
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  }
})