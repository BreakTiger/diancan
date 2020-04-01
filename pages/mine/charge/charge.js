const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    detail: {},
    choice_index: null
  },


  onLoad: function(options) {
    this.getCharge()
  },

  // 充值套餐
  getCharge: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Payment/balance_menu'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let detail = res.data.data
          let list = detail.meal
          list.forEach(function(item) {
            item.choice = null;
          })
          that.setData({
            detail: detail
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 选择套餐
  toChoice: function(e) {
    let detail = this.data.detail
    let list = detail.meal
    let indexs = e.currentTarget.dataset.index
    list.forEach(function(item, index) {
      if (index == indexs) {
        item.choice = indexs
      }
    })
    this.setData({
      detail: detail,
      choice_index: indexs
    })
  },

  // 现在支付
  toPay: function() {
    let that = this
    let detail = that.data.detail
    console.log(detail)
    let choice = that.data.choice_index
    console.log(choice)
    if (choice != null) {
      if (detail.type == 0) {
        console.log('固定')
        let menoy = detail.meal[choice].name
        let sent = detail.meal[choice].value
        let data = {
          token: wx.getStorageSync('token'),
          money: menoy,
          total_price: parseFloat(menoy) + parseFloat(sent),
          type: detail.type
        }
        that.charge(data)
      } else {
        let percent = detail.percent / 100
        let menoy = detail.meal[choice].name
        let sent = percent * menoy
        let data = {
          token: wx.getStorageSync('token'),
          money: menoy,
          total_price: parseFloat(menoy) + parseFloat(sent),
          type: detail.type
        }
        that.charge(data)
      }
    } else {
      modals.showToast('请选择充值套餐', 'none')
    }
  },

  charge: function(data) {
    console.log('参数：', data)
    let that = this
    let url = app.globalData.api + '?s=wxapi/Payment/do_order'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let oid = res.data.data
          console.log('订单ID：', oid)
          that.wxPay(oid)
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 微信支付
  wxPay: function(oid) {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      order_id: oid
    }
    let url = app.globalData.api + '?s=wxapi/Pay/do_pay'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.payMemnt(res.data.data)
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 支付
  payMemnt: function(e) {
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: function(res) {
        modals.showToast('支付成功', 'loading')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      fail: function(res) {
        modals.showToast('支付失败', 'loading')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  }
})