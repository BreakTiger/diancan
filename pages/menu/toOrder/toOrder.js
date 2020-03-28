const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    carList: [],
    seat: null,
    note: '',
    total_price: '0.00'
  },


  onLoad: function(options) {
    let carList = JSON.parse(options.arr)
    console.log(carList)
    this.setData({
      carList: carList,
      seat: wx.getStorageSync('seat')
    })
    this.calculate(carList)
  },

  // 计算总价
  calculate: function(list) {
    let price = 0
    list.forEach(function(item, index) {
      price += (item.total_num * item.goods_price)
    })
    this.setData({
      total_price: price.toFixed(2)
    })
  },

  // 输入备注
  note: function(e) {
    let note = e.detail.value
    this.setData({
      note: note
    })
  },

  // 输入桌号
  seats: function(e) {
    let num = e.detail.value
    this.setData({
      seat: num
    })
  },

  // 确定下单
  upOrder: function() {
    let that = this
    let car = that.data.carList
    // console.log(car)
    let arr = []
    car.forEach(function(item) {
      let param = {
        goods_id: item.goods_id,
        goods_spec_id: item.goods_spec_id,
        number: item.total_num
      }
      arr.push(param)
    })
    // console.log(arr)
    let data = {
      token: wx.getStorageSync('token'),
      goods: arr,
      total_price: that.data.total_price,
      desk_id: that.data.seat,
      remark: that.data.note
    }
    console.log(data)
    let url = app.globalData.api + '?s=wxapi/order/do_order'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.toPay(res.data.data.order_id)
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 支付
  toPay: function(e) {
    let that = this
    let data = {
      order_id: e,
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Pay/do_pay'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res.data)
      if (res.statusCode == 200) {
        that.payMemnt(res.data.data)
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  payMemnt: function(e) {
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: function(res) {
        modals.showToast('支付成功', 'success')
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      },
      fail: function(res) {
        modals.showToast('支付失败', 'loading')
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/order/order',
          })
        }, 2000)
      }
    })
  }

})