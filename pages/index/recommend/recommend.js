const app = getApp()

Page({


  data: {
    list: []
  },


  onLoad: function(options) {
    console.log(JSON.parse(options.list))
    this.setData({
      list: JSON.parse(options.list)
    })
  },

  toRecommend: function(e) {
    let item = e.currentTarget.dataset.item
    app.globalData.item = item
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },

  onPullDownRefresh: function() {

  },


  onReachBottom: function() {

  }
})