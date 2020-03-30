const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    shop: []
  },
  onLoad: function() {
    this.setData({
      shop: wx.getStorageSync('shop')
    })
  },

  // 登录-1
  toGetUserInfo: function(e) {
    let that = this
    let code = wx.getStorageSync('code')
    let info = e.detail.userInfo
    let url = app.globalData.api + '?s=wxapi/login/getOpenid'
    modals.loading()
    request.sendRequest(url, 'post', {
      code: code
    }, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let token = res.data.data
          that.upUserinfo(info, token)
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  upUserinfo: function(info, token) {
    let that = this
    let url = app.globalData.api + '?s=wxapi/login/update_user'
    let param = {
      nickName: info.nickName,
      gender: info.gender,
      country: info.country,
      province: info.province,
      city: info.city,
      avatarUrl: info.avatarUrl,
      token: token
    }
    modals.loading()
    request.sendRequest(url, 'post', param, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          wx.setStorageSync('token', token)
          wx.navigateBack({
            delta: 1
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  }
})