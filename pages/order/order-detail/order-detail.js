const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    detail: {},
    goods: []
  },

  onLoad: function(options) {
    let data = JSON.parse(options.item)
    let goods = data.goods_info
    for (let i = 0; i < goods.length; i++) {
      goods[i].file_name = 'https://canyin.dt5555.cn/uploads/' + goods[i].file_name
    }
    this.setData({
      detail: data,
      goods: goods
    })
  },

  //继续支付
  toPay: function() {

  },

  //再买一单
  buyAgain: function() {

  },
})