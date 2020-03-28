const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    carList: [],
    word: '',
    page: 1,
    searchList: [],

    searchs: false
  },


  onLoad: function(options) {
    this.getCar()
  },

  //购物车
  getCar: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Cart/index'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      // console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            carList: res.data.data
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 搜索词
  word: function(e) {
    this.setData({
      word: e.detail.value
    })
  },

  // 搜索
  search: function() {
    let that = this
    let data = {
      goods_name: that.data.word,
      page: that.data.page,
      length: 10
    }
    let url = app.globalData.api + '?s=wxapi/Classify/search'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data.data
          for (let i = 0; i < list.length; i++) {
            list[i].file_name = 'https://canyin.dt5555.cn/uploads/' + list[i].file_name
            list[i].num = 0
          }
          that.setData({
            searchList: list,
            searchs: true
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

  },


  onShareAppMessage: function() {

  }
})