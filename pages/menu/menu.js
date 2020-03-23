const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    navList: [],
    choice_nav: null,
    detail: {},

    num: 100,
    car: false
  },

  onLoad: function(options) {
    // let item = app.globalData.item || ''
    // console.log('推荐：', item)
    // if (item.category_id) {
    //   this.setData({
    //     detail: item,
    //     choice_nav: item.category_id
    //   })
    // }
    this.getKind()
  },

  // 获取分类
  getKind: function() {
    let that = this
    let data = {
      category_id: '',
      goods_id: ''
    }
    let url = app.globalData.api + '?s=wxapi/Classify/get_class'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res.data)
      if (res.data.code == 200) {
        let list = res.data.data
        that.setData({
          navList: list
        })
      } else {
        modals.showToast(res.data.msg, 'none')
      }
    })
  },

  // 列表
  getKlist: function(e) {
    // let that = this


  },

  // 搜索
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/menu/search/search',
    })
  },
})