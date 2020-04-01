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

  onShow: function() {

  },




  onPullDownRefresh: function() {

  },


  onReachBottom: function() {

  }
})