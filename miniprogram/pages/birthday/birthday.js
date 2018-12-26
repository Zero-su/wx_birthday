var app = getApp()
const util = require('../../utils/commonConf.js')

Page({
  data: {
    array: util.relateArray,
    index: 0,
    loading: false,
    date: '',
    dialogData: {
      title: '',
      content: ''
    }
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  _cancelEvent () {
    this.dialog.hideDialog()
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit(e) {
    const value = e.detail.value
    if (!value.name) {
      this.setData({
        dialogData: {
          title: '提示',
          content: '您还没有填写昵称呢'
        }
      })
      this.dialog.showDialog()
      return
    }
    if (!value.birthday) {
      this.setData({
        dialogData: {
          title: '提示',
          content: '您还没有填写生日呢'
        }
      })
      this.dialog.showDialog()
      return
    }
    wx.showLoading({
      title: '正在保存',
    })
    wx.cloud.callFunction({
      name: 'add',
      data: {
        dbName: 'birthday',
        addData: {
          openid: wx.getStorageSync('user').openid,
          ...value,
          relation: value.relation * 1,
          imgpath: ''
          }
      },
      success: (res) => {
        wx.switchTab({
          url: '../index/index'
        })
        app.globalData.currentTab = 1
      },
      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '保存失败',
        })
      }
    })
  },
  bindTimeChange(e){
    // this.data.date = e.detail.value
    this.setData({
      date: e.detail.value
    })
  }
})