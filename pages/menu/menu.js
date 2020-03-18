const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{
        text: 'one'
      },
      {
        text: 'two'
      },
      {
        text: 'three'
      },
      {
        text: 'four'
      },
      {
        text: 'five'
      },
      {
        text: 'one'
      },
      {
        text: 'two'
      },
      {
        text: 'three'
      },
      {
        text: 'four'
      },
      {
        text: 'five'
      },
      {
        text: 'one'
      },
      {
        text: 'two'
      },
      {
        text: 'three'
      },
      {
        text: 'four'
      },
      {
        text: 'five'
      }
    ],
    choice_nav: 0,
    num:100,
    car:false
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