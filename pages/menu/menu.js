const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
let template = require('../../templates/tabline/tabline.js')
const app = getApp()

Page({

  data: {
    detail: {}, //推荐商品
    tid: null, //推荐ID

    navList: [], //分类列表
    choice_nav: null, //分类ID（选择的）

    menuList: [], //菜单列表
    carList: [], //购物车列表

    //多规格
    goods: {}, //选择的商品信息
    goods_spec: [], //选择的商品规格
    goods_spec_money: [], //选择的商品规格价格
    goods_index: null, //所选的最外层下标

    //多，单共用
    choice_sk_name: '', //所选的规格
    choice_sk_price: '0.00', //所选规格的对应价位
    choice_sk_id: null, //所选规格ID

    sk: false, //规格弹窗显示

    cars: false, //购物车内容显示

    total_price: '0.00', //总价

    shop: false
  },

  onLoad: function(options) {
    template.tabbar("tabBar", 0, this)
    let detail = app.globalData.item
    this.setData({
      detail: detail,
      tid: detail.goods_id
    })
  },

  onShow: function() {
    this.getKind() //分类导航
  },

  // 分类导航
  getKind: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Classify/get_class'
    modals.loading()
    request.sendRequest(url, 'post', {}, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data
          that.setData({
            navList: list
          })
          // 判断是否存在推荐
          if (that.data.tid) {
            console.log("推荐")
            that.setData({
              choice_nav: that.data.detail.category_id
            })
          } else {
            console.log('默认')
            that.setData({
              choice_nav: list[0].category_id,
              tid: that.data.tid
            })
          }
          that.getKlist()
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 分类菜单
  getKlist: function() {
    let that = this
    let data = {
      category_id: that.data.choice_nav,
      goods_id: that.data.tid
    }
    modals.loading()
    let url = app.globalData.api + '?s=wxapi/Classify/get_goods'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          let list = res.data.data
          for (let i = 0; i < list.length; i++) {
            list[i].file_name = 'https://canyin.dt5555.cn/uploads/' + list[i].file_name
            list[i].num = 0
          }
          that.setData({
            menuList: list
          })
          that.getCar()
        } else {
          modals.showToast(res.data.msg, 'none')
          that.setData({
            menuList: []
          })
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  //购物车
  getCar: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    let url = app.globalData.api + '?s=wxapi/Cart/index'
    modals.loading()
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            carList: res.data.data
          })
          that.jugeList()
          that.calculate()
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  //单规格商品专用:同步购物车所选菜品数量，及菜单中被选中的菜品的数量
  jugeList: function() {
    let mlist = this.data.menuList
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
      menuList: mlist
    })
  },

  // 计算总价
  calculate: function() {
    let that = this
    let clist = that.data.carList
    let total = 0
    clist.forEach(function(item) {
      let price = item.goods_price * item.total_num
      total += price
    })
    this.setData({
      total_price: total.toFixed(2)
    })
  },

  // 切换分类
  switchNav: function(e) {
    let select = e.currentTarget.dataset.item.category_id
    let cid = this.data.choice_nav
    if (select != cid) {
      this.setData({
        choice_nav: select,
        tid: null
      })
      this.getKlist()
    }
  },

  // 单规格
  singlesk: function(e) {
    let indexs = e.currentTarget.dataset.index
    let list = this.data.menuList
    // 数量增加1
    list.forEach(function(item, index) {
      if (index == indexs) {
        item.num = item.num + 1
      }
    })
    this.setData({
      menuList: list
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

  // 多规格
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
    let list = that.data.menuList
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
    modals.loading()
    request.sendRequest(url, 'post', param, {
      'content-type': 'application/json'
    }).then(function(res) {
      modals.loaded()
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            sk: false
          })
          that.getCar()
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 展示购物车内容 
  showCar: function() {
    let cars = this.data.cars
    console.log(cars)
    if (cars) {
      this.setData({
        cars: false
      })
    } else {
      this.setData({
        cars: true
      })
    }

  },

  // 关闭购物车内容
  closeCar: function() {
    this.setData({
      cars: false
    })
  },

  // 清空购物车
  cleanCar: function() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      all: 1
    }
    let url = app.globalData.api + '?s=wxapi/Cart/delete'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            cars: false
          })
          that.getKlist()
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
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

  // 单规格 (购物车)
  // 减少
  edu_min: function(e) {
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    if (item.total_num > 1) {
      let data = {
        token: wx.getStorageSync('token'),
        id: index,
        total_num: parseInt(item.total_num) - 1
      }
      this.editor(data)
    } else {
      let data = {
        token: wx.getStorageSync('token'),
        id: index
      }
      this.delLog(data)
      let clist = this.data.carList
      if (clist.length == 1) {
        this.setData({
          cars: false
        })
      }
    }
  },

  // 增加
  edu_add: function(e) {
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let data = {
      token: wx.getStorageSync('token'),
      id: index,
      total_num: parseInt(item.total_num) + 1
    }
    this.editor(data)
  },

  // 菜单
  // 增加
  toAdd: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let clist = this.data.carList
    clist.forEach(function(items, index) {
      if (items.goods_id == item.goods_id) {
        let data = {
          token: wx.getStorageSync('token'),
          id: index,
          total_num: parseInt(items.total_num) + 1
        }
        console.log(data)
        that.editor(data)
      }
    })
  },

  // 减少
  toMinus: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let clist = this.data.carList
    clist.forEach(function(items, index) {
      if (items.goods_id == item.goods_id) {
        if (items.total_num > 1) {
          let data = {
            token: wx.getStorageSync('token'),
            id: index,
            total_num: parseInt(items.total_num) - 1
          }
          that.editor(data)
        } else {
          let data = {
            token: wx.getStorageSync('token'),
            id: index
          }
          that.delLog(data)
          that.getKlist()
        }
      }
    })
  },

  // 编辑商品数量 增加/减少
  editor: function(data) {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Cart/eidt'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
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

  // 删除菜品
  delLog: function(data) {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Cart/delete'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
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

  // 去结算
  toOrder: function() {
    let car = JSON.stringify(this.data.carList)
    wx.navigateTo({
      url: '/pages/menu/toOrder/toOrder?arr=' + car,
    })
  },

  // 搜索
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/menu/search/search',
    })
  },

  toShop: function() {
    let shop = this.data.shop
    if (shop) {
      this.setData({
        shop: false
      })
    } else {
      this.setData({
        shop: true
      })
    }
  }
})