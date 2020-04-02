const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    page: 1,
    list: []
  },


  onLoad: function(options) {
    this.getLog()
  },

  // 充值记录
  getLog: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      page: that.data.page,
      length: 10
    }
    let url = app.globalData.api + '?s=wxapi/Payment/balance_log'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res.data.data)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data.data
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
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
    this.getLog()
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
    let url = app.globalData.api + '?s=wxapi/Payment/balance_log'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data.data
          if (list.length > 0) {
            that.setData({
              list: old.concat(list),
              page: page
            })
          } else {
            modals.showToast('我也是有底线的', 'none');
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