// miniprogram/pages/birthupdate/birthupdate.js
var app = getApp()
const util = require('../../utils/commonConf.js')
const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: util.relateArray,
    _id: '',
    openid: '',
    info: {},
    date: '',
    index: '',
    imgpath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('user').openid
    console.log(options)
    this.setData({
      _id: options.id,
      openid: openid
    })
    $Toast({
      content: '正在加载',
      type: 'loading',
      duration: 0,
      mask: false
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        dbName: 'birthday',
        findData: {
          openid: openid,
          _id: options.id
        }
      },
      success: (res) => {
        const resultData = res.result.data[0]
        
        this.setData({
          info: resultData,
          date: resultData.birthday,
          index: resultData.relation*1,
          imgpath: resultData.imgpath
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit(e) {
    const value = e.detail.value
    console.log(value)
    if (!value.name) {
      $Toast({
        content: '您还没有填写昵称呢',
        type: 'warning'
      })
      return
    }
    if (!value.birthday) {
      $Toast({
        content: '您还没有填写生日呢',
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
        dbName: 'birthday',
        updateData: {
          _id: this.data._id,
          ...value,
          relation: value.relation * 1,
          imgpath: this.data.imgpath
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
      app.globalData.currentTab = 1
      },
      fail: res => {
        console.log(res)
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
        dbName: 'birthday',
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
      app.globalData.currentTab = 1
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
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  gotoShow () {
    const that =this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = that.data._id + filePath.match(/\.[^.]+?$/)[0]
        console.log(cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            that.setData({
              imgpath: filePath
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})