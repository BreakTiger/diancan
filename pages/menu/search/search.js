const request = require('../../../utils/http.js')
import modals from '../../../utils/modal.js'
const app = getApp()

Page({


  data: {
    carList: [],
    word: '',
    page: 1,
    searchList: [],

    //多规格
    goods: {}, //选择的商品信息
    goods_spec: [], //选择的商品规格
    goods_spec_money: [], //选择的商品规格价格
    goods_index: null, //所选的最外层下标,

    //多，单共用
    choice_sk_name: '', //所选的规格
    choice_sk_price: '0.00', //所选规格的对应价位
    choice_sk_id: null, //所选规格ID

    sk: false,

    searchs: false,
  },


  onLoad: function(options) {
    this.getCar()
  },

  //购物车
  getCar: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Cart/index'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      // console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            carList: res.data.data
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 搜索词
  word: function(e) {
    this.setData({
      word: e.detail.value
    })
  },

  // 搜索
  search: function() {
    let that = this
    let data = {
      goods_name: that.data.word,
      page: that.data.page,
      length: 10
    }
    let url = app.globalData.api + '?s=wxapi/Classify/search'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data.data
          for (let i = 0; i < list.length; i++) {
            list[i].file_name = 'https://canyin.dt5555.cn/uploads/' + list[i].file_name
            list[i].num = 0
          }
          that.setData({
            searchList: list,
            searchs: true
          })
          that.contrast()
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 单规格 同步购物车和列表中的数据
  contrast: function() {
    let mlist = this.data.searchList
    let clist = this.data.carList
    mlist.forEach(function(one, index) {
      if (one.spec_type == 10) {
        clist.forEach(function(two, index) {
          if (one.goods_id == two.goods_id) {
            one.num = two.total_num
          }
        })
      }
    })
    this.setData({
      searchList: mlist
    })
  },

  // 单规格
  singlesk: function(e) {
    let indexs = e.currentTarget.dataset.index
    let list = this.data.searchList
    // 数量增加1
    list.forEach(function(item, index) {
      if (index == indexs) {
        item.num = item.num + 1
      }
    })
    this.setData({
      searchList: list
    })
    let item = list[indexs]
    let data = {
      token: wx.getStorageSync('token'),
      goods_id: item.goods_id,
      goods_name: item.goods_name,
      image: item.file_name,
      total_num: item.num,
      goods_price: item.spec_money[0].goods_price,
      goods_attr: '',
      goods_spec_id: item.spec_money[0].goods_spec_id
    }
    console.log('单规格：', data)
    this.joinCar(data)
  },

  // 多规格 设置默认
  movesk: function(e) {
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let spec = item.spec
    let s_monry = item.spec_money
    // 增加active属性
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
    console.log(spec)
    this.setData({
      sk: true,
      goods: item,
      goods_spec: spec,
      goods_spec_money: s_monry,
      goods_index: index
    })
    this.setChoice(s_monry)
  },

  // 已选规格 + 规格价位
  setChoice: function(e) {
    let nums = ''
    let choice_sk = ''
    let choice_price = ''
    let choice_id = null
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
        choice_id = item.goods_spec_id
      }
    })
    this.setData({
      choice_sk_name: choice_sk,
      choice_sk_price: choice_price,
      choice_sk_id: choice_id
    })
  },

  // 选择规格
  select: function(e) {
    let item = e.currentTarget.dataset.item
    let all = e.currentTarget.dataset.all
    let inside = e.currentTarget.dataset.laberIndex
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
    all.forEach(function(one, index) {
      if (index == out) {
        let two = one.item
        two.forEach(function(twice, index) {
          if (inside == index) {
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
    let that = this
    let list = that.data.searchList
    let indexs = that.data.goods_index
    // 增加1
    list.forEach(function(item, index) {
      if (index == indexs) {
        item.num = 1
      }
    })
    let item = list[indexs]
    let data = {
      token: wx.getStorageSync('token'),
      goods_id: item.goods_id,
      goods_name: item.goods_name,
      image: item.file_name,
      total_num: item.num,
      goods_price: that.data.choice_sk_price,
      goods_attr: that.data.choice_sk_name,
      goods_spec_id: that.data.choice_sk_id
    }
    console.log('多规格：', data)
    this.setData({
      sk: false,
      menuList: list
    })
    this.joinCar(data)
  },

  // 加入购物车
  joinCar: function(param) {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Cart/add';
    request.sendRequest(url, 'post', param, {
      'content-type': 'application/json'
    }).then(function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.getCar()
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  //关闭规格窗口
  toClose: function() {
    this.setData({
      sk: false
    })
  },


  onPullDownRefresh: function() {

  },


  onReachBottom: function() {

  }
})