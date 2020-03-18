const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    nav: [{
        icon: '/icon/nav-1.png',
        text: '自助下单'
      },
      {
        icon: '/icon/nav-2.png',
        text: '预约'
      }, {
        icon: '/icon/nav-3.png',
        text: '订单'
      }, {
        icon: '/icon/nav-4.png',
        text: '个人中心'
      }
    ]
  },


  onLoad: function(options) {

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