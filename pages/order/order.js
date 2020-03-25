const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({


  data: {
    page: 1,
    list: []
  },

  onLoad: function(options) {
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
      if (res.data.code == 200) {
        let list = res.data.data.data 
        that.setData({
          list: res.data.data.data
        })
      } else {
        modals.showToast(res.data.msg, 'none')
      }
    })
  },

  // 继续支付
  toPay: function(e) {

  },

  // 再买一次
  buyAgagin: function(e) {

  },

  // 详情
  toDetails: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/order/order-detail/order-detail?item=' + JSON.stringify(item),
    })
  },



})