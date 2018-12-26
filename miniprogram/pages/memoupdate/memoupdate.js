// miniprogram/pages/memoupdate/memoupdate.js
var app = getApp()
const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    _id: '',
    date: '',
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Toast({
      content: '正在加载',
      type: 'loading',
      duration: 0,
      mask: false
    })
    const openid = wx.getStorageSync('user').openid
    console.log(options)
    this.setData({
      _id: options.id,
      openid: openid
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        dbName: 'memorial',
        findData: {
          openid: openid,
          _id: options.id
        }
      },
      success: (res) => {
        this.setData({
          info: res.result.data[0],
          date: res.result.data[0].memorial,
        })
        $Toast.hide();
      },
      fail: res => {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  formSubmit(e){
    console.log(e.detail.value)
    const data = e.detail.value
    if (!data.name) {
      $Toast({
        content: '您还没有填写纪念日名称呢',
        type: 'warning'
      })
      return
    }
    if (!data.memorial) {
      $Toast({
        content: '您还没有填写纪念日日期呢',
        type: 'warning'
      })
      return
    }
    $Toast({
      content: '正在保存',
      type: 'loading'
  })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        dbName: 'memorial',
        updateData: {
          _id: this.data._id,
          ...data
        }
      },
      success: (res) => {
        $Toast({
          content: '保存成功',
          type: 'success'
        })
        wx.switchTab({
          url: '../index/index'
        })
        app.globalData.currentTab = 2
      },
      fail: res => {
        $Toast({
          content: '保存失败',
          type: 'error'
        })
      }
    })
  },
  formDelete (e) {
    console.log('formDelete')
    $Toast({
      content: '正在删除',
      type: 'loading'
    })
    wx.cloud.callFunction({
      name: 'delete',
      data: {
        dbName: 'memorial',
        deleteData: {
          _id: this.data._id
        }
      },
      success: (res) => {
        console.log(res)
        $Toast({
          content: '删除成功',
          type: 'success'
      })
      wx.switchTab({
        url: '../index/index'
      })
      app.globalData.currentTab = 2
      },
      fail: res => {
        $Toast({
          content: '删除失败',
          type: 'error'
        })
      }
    })
  },
  bindTimeChange(e){
    // this.data.date = e.detail.value
    console.log(e.detail)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})