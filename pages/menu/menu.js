const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
const app = getApp()

Page({

  data: {
    detail: {}, //推荐商品
    tid: null, //推荐ID

    navList: [], //分类列表
    choice_nav: null, //分类ID（选择的）

    menuList: [], //菜单列表

    goods: {}, //单个商品信息
    goods_spec: [], //单个商品的规格
    goods_spec_money: [], //单个商品的规格价格
    choice_sk_name: '', //所选的规格
    choice_sk_price: '0.00', //所选规格的对应价位

    //显示控制

    sk: false, //规格显示

    car: false
  },

  onLoad: function(options) {
    let detail = app.globalData.item
    this.setData({
      detail: detail
    })
    this.getKind()
  },

  // 获取分类
  getKind: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Classify/get_class'
    request.sendRequest(url, 'post', {}, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.data.code == 200) {
        let list = res.data.data
        // console.log(list)
        that.setData({
          navList: list
        })
        // 判断是否存在推荐
        let item = that.data.detail
        // console.log('推荐：', item)
        if (item.category_id) {
          let c_id = item.category_id
          let t_id = item.goods_id
          console.log("推荐")
          // console.log('分类ID：', c_id)
          // console.log('推荐ID：', t_id)
          that.setData({
            choice_nav: c_id,
            tid: t_id
          })
        } else {
          let c_id = list[0].category_id
          let t_id = that.data.tid
          console.log('默认')
          // console.log('分类ID:', c_id)
          // console.log('推荐ID：', t_id)
          that.setData({
            choice_nav: c_id,
            tid: t_id
          })
        }
        that.getKlist()
      } else {
        modals.showToast(res.data.msg, 'none')
      }
    })
  },

  // 分类对应的列表
  getKlist: function() {
    let that = this
    let data = {
      category_id: that.data.choice_nav,
      goods_id: that.data.tid
    }
    // console.log('参数：', data)
    let url = app.globalData.api + '?s=wxapi/Classify/get_goods'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.data.code == 200) {
        let list = res.data.data
        for (let i = 0; i < list.length; i++) {
          list[i].file_name = 'https://canyin.dt5555.cn/uploads/' + list[i].file_name
          list[i].num = 0
        }
        // console.log(list)
        that.setData({
          menuList: list
        })
      } else {
        modals.showToast(res.data.msg, 'none')
      }
    })

  },

  // 搜索
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/menu/search/search',
    })
  },

  // 规格弹窗 : 设置默认选择
  toAddGoods: function(e) {
    let item = e.currentTarget.dataset.item
    let spec = item.spec
    let s_monry = item.spec_money

    // 增加属性，用于判断是否选择
    spec.forEach(function(one) {
      let ones = one.item
      ones.forEach(function(two, index) {
        if (index == 0) {
          two.active = ones[0].id
        } else {
          two.active = null;
        }
      })
    })

    this.setData({
      sk: true,
      goods: item,
      goods_spec: spec,
      goods_spec_money: s_monry
    })

    this.setChoice(s_monry)
  },

  // 已选规格 + 价格
  setChoice: function(e) {
    let nums = ''
    let choice_sk = ''
    let choice_price = ''
    let spec = this.data.goods_spec
    spec.forEach(function(item) {
      let one = item.item
      one.forEach(function(items) {
        if (items.id == items.active) {
          let id = String(items.id)
          nums += id
          let name = items.name
          choice_sk += '/' + name
        }
      })
    })
    e.forEach(function(item) {
      if (nums == item.spec_sku_id) {
        choice_price = item.goods_price
      }
    })
    this.setData({
      choice_sk_name: choice_sk,
      choice_sk_price: choice_price
    })
    console.log(nums)
    console.log(choice_sk)
    console.log(choice_price)
  },

  // 选择规格
  select: function(e) {
    let all = e.currentTarget.dataset.all
    let item = e.currentTarget.dataset.item
    // 获取外部Index
    let out = null;
    all.forEach(function(one, index) {
      let list = one.item
      list.forEach(function(two) {
        if (two.id == item.id) {
          out = index
        }
      })
    })
    // console.log('外部Index:', out)
    let labindex = e.currentTarget.dataset.laberIndex
    // console.log('内部Index:', labindex)
    all.forEach(function(one, index) {
      if (index == out) {
        let two = one.item
        two.forEach(function(twice, index) {
          if (labindex == index) {
            twice.active = twice.id
          } else {
            twice.active = null
          }
        })
      }
    })
    this.setData({
      goods_spec: all
    })
    this.setChoice(this.data.goods_spec_money)
  },

  // 选好
  finsh: function() {

  },






  //关闭规格窗口
  toClose: function() {
    this.setData({
      sk: false
    })
  },




})