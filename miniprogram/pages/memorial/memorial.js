var app = getApp()
const { $Toast } = require('../../dist/base/index');

// pages/memorial/memorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(app.globalData.currentTab)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindTimeChange(e) {
    // this.data.date = e.detail.value
    this.setData({
      date: e.detail.value
    })
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
      name: 'add',
      data: {
        dbName: 'memorial',
        addData: {
          openid: wx.getStorageSync('user').openid,
          ...data
        }
      },
      success: (res) => {
        wx.switchTab({
          url: '../index/index'
        })
        app.globalData.currentTab = 2
      },
      fail: res => {
        $Toast({
          content: '保存失败！',
          type: 'error'
        })
      }
    })
    // wx.request({
    //   url: `${app.globalData.URL}/memorial/add`,
    //   method: 'POST',
    //   header: {
    //     authorization: app.globalData.token
    //   },
    //   data: { ...data },
    //   success: respo => {
    //     // console.log(respo)
    //     wx.switchTab({
    //       url: '../index/index'
    //     })
    //   }
    // })
  }
})