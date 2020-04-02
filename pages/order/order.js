const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    shop: [],
    page: 1,
    list: []
  },

  onLoad: function(options) {
    this.setData({
      shop: wx.getStorageSync('shop')
    })
    this.getList()
  },

  // 我的列表
  getList: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/order/index'
    let data = {
      token: wx.getStorageSync('token'),
      page: that.data.page,
      length: 10
    }
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data.data
          that.setData({
            list: res.data.data.data
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
  },

  // 继续支付
  toPay: function(e) {
    let that = this
    wx.showActionSheet({
      itemList: ['微信支付', '余额支付'],
      itemColor: '#666',
      success: function(res) {
        let index = res.tapIndex
        console.log(index)
        if (index == 0) {
          console.log('微信')
          that.wxPay(e)
        } else {
          console.log('余额')
          that.usPay(e)
        }
      }
    })
  },

  // 微信支付
  wxPay: function(e) {
    let that = this
    let data = {
      order_id: e.currentTarget.dataset.item.order_id,
      token: wx.getStorageSync('token')
    }
    console.log(data)
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
        this.setData({
          page: 1
        })
        setTimeout(function() {
          this.getList()
        }, 1000)
      },
      fail: function(res) {
        modals.showToast('支付失败', 'none')
      }
    })
  },

  // 余额支付
  usPay: function(e) {
    let that = this
    let data = {
      order_id: e.currentTarget.dataset.item.order_id,
      token: wx.getStorageSync('token')
    }
    console.log(data)
    let url = app.globalData.api + '?s=wxapi/Pay/do_buy_balance'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      // console.log(res.data.code)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          modals.showToast('支付成功', 'success')
          setTimeout(function() {
            that.getList()
          }, 1000)
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 再买一次
  buyAgagin: function(e) {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      order_id: e.currentTarget.dataset.item.order_id
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
  },

  // 详情
  toDetails: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/order/order-detail/order-detail?item=' + JSON.stringify(item),
    })
  },

  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.setData({
      page: 1
    })
    this.getList()
  },


  onReachBottom: function() {
    let that = this
    let old = that.data.list
    let page = that.data.page + 1
    let data = {
      token: wx.getStorageSync('token'),
      page: page,
      length: 10
    }
    let url = app.globalData.api + '?s=wxapi/order/index'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data.data
          if (list.length > 0) {
            that.setData({
              page: page,
              list: old.concat(list)
            })
          } else {
            modals.showToast('我也是有底线的', 'none')
          }
        } else {
          modals.showToast(res.data.msg, 'none');
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  }





})