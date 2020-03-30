const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
let template = require('../../templates/tabline/tabline.js')
const app = getApp()

Page({


  data: {

  },


  onLoad: function(options) {
    template.tabbar("tabBar", 1, this)
  },

  toOrder: function() {
    wx.navigateTo({
      url: '/pages/menu/menu',
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