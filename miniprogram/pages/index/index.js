var app = getApp()
const util = require('../../utils/commonConf.js')
const dateFn = require('../../utils/util.js')
const { $Toast } = require('../../dist/base/index');

Page({
  data: {
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    birthdayArray: [],
    memorialArray: [],
    array: util.relateArray,
    openid: ''
  },
  onLoad: function (page) {
    this.setData({
      openid: wx.getStorageSync('user').openid
    })
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  }, 
  getBirthData: function () {
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
          openid: this.data.openid
        }
      },
      success: (res) => {
        let resultData = res.result.data.map(obj => {
          const CalendarConverter =  dateFn.CalendarConverter
          const calendarConverter = new CalendarConverter()
          const birthday = obj.birthday.split('-').join(',')
          const date = new Date()
          const myDate = date.getFullYear() + '-' + (date.getMonth() * 1 + 1) + '-' + date.getDate()
          const nextYearToNow = dateFn.timeDiff(myDate, `${date.getFullYear() + 1}-1-1`)
          let infos = {
            id: obj._id,
            imgpath: obj.imgpath,
            name: obj.name,
            birthday: '',
            sex: obj.sex,
            relation: obj.relation,
            nextBirthinday: '', //距离下次生日的天数
            nextBirthinAge: '', //下一次生日多少岁
            nextBirthinDate: '' // 下一次生日的时间
          }
          if (obj.calendar*1 === 0) {
            const transInfo = calendarConverter.solar2lunar(new Date(birthday))
            infos.birthday = `${transInfo.lunarYear}/${transInfo.astro}/阴历${transInfo.sMonth}-${transInfo.sDay}`
            infos.nextBirthinDate = `阴历${transInfo.sMonth}-${transInfo.sDay}`
            const diff1 = dateFn.timeDiff(`${date.getFullYear() * 1}-${transInfo.sMonth}-${transInfo.sDay}`, myDate)
            const diff2 = dateFn.timeDiff(`${date.getFullYear() * 1 + 1}-${transInfo.sMonth}-${transInfo.sDay}`, myDate)
            if (diff1 < 0) {
              infos.nextBirthinday = Math.abs(diff1)
              infos.nextBirthinAge = date.getFullYear() * 1 - transInfo.sYear
            } else {
              infos.nextBirthinday = Math.abs(diff2)
              infos.nextBirthinAge = date.getFullYear() * 1 + 1 - transInfo.sYear
            }
          } else {
            const transInfo = calendarConverter.lunar2solar(new Date(birthday))
            infos.birthday = `${transInfo.lunarYear}/${transInfo.astro}/阳历${transInfo.lMonth}-${transInfo.lDay}`
            // if ()
            const transInfo1 = calendarConverter.lunar2solar(new Date(date.getFullYear()*1 + ',' + transInfo.lMonth+ ',' +transInfo.lDay))
            const transInfo2 = calendarConverter.lunar2solar(new Date((date.getFullYear()*1 + 1)+ ',' +transInfo.lMonth+ ',' +transInfo.lDay))
            const diff1 = dateFn.timeDiff(`${transInfo1.sYear}-${transInfo1.sMonth}-${transInfo1.sDay}`, myDate)
            if (diff1 > 0) {
              const diff2 = dateFn.timeDiff(`${transInfo2.sYear}-${transInfo2.sMonth}-${transInfo2.sDay}`, myDate)
              infos.nextBirthinday = Math.abs(diff2)
              infos.nextBirthinAge = transInfo2.sYear - transInfo.sYear
              infos.nextBirthinDate = `阴历${transInfo2.sMonth}-${transInfo2.sDay}周${transInfo2.week}`
            } else {
              infos.nextBirthinday = Math.abs(diff1)
              infos.nextBirthinAge = transInfo1.sYear - transInfo.sYear
              infos.nextBirthinDate = `阴历${transInfo1.sMonth}-${transInfo1.sDay}周${transInfo1.week}`
            }
          }
          return infos
        })
        this.setData({
          birthdayArray: resultData
        });
        $Toast.hide();
        wx.switchTab({
          url: '../index/index'
        })
        app.globalData.currentTab = 1
      },
      fail: res => {
      }
    })
  },

  getmemorialData: function() {
    $Toast({
      content: '正在加载',
      type: 'loading',
      duration: 0,
      mask: false
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        dbName: 'memorial',
        findData: {
          openid: this.data.openid
        }
      },
      success: (res) => {
        const data = res.result.data
        const date = new Date()
        const myDate = date.getFullYear() + '-' + (date.getMonth() * 1 + 1) + '-' + date.getDate()
        let resultData = data.map(obj => {
          let infos = {
            id: obj._id,
            name: obj.name,
            memorial: '',
            nextMemorialDay: '', //距离下次生日的天数
            nextMemorialAge: '', //下一次生日多少岁
            nextMemorialDate: dateFn.day2ymrStr2(obj.memorial, myDate) // 下一次生日的时间
          }
          const memorial = obj.memorial.split('-')
          const memorialToNow = dateFn.timeDiff(obj.memorial, myDate)
          const diff1 = dateFn.timeDiff(`${date.getFullYear()}-${memorial[1]}-${memorial[2]}`, myDate)
          infos.memorial = `阴历${memorial[1]}-${memorial[2]}(至今${Math.abs(memorialToNow)}天)`
          if (diff1 > 0) {
            const diff2 = dateFn.timeDiff(`${date.getFullYear() + 1}-${memorial[1]}-${memorial[2]}`, myDate)
            infos.nextMemorialDay = Math.abs(diff2)
            infos.nextMemorialAge = date.getFullYear() + 1 - memorial[0]
          } else {
            infos.nextMemorialDay = Math.abs(diff1)
            infos.nextMemorialAge = date.getFullYear() - memorial[0]
          }
          return infos
        })
        this.setData({
          memorialArray: resultData
        });
        $Toast.hide();
        wx.switchTab({
          url: '../index/index'
        })
        app.globalData.currentTab = 1
      },
      fail: res => {
      }
    })
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    if (e.detail.current === 1) {
      this.getBirthData(this.data.openid)
    } else if (e.detail.current === 2) {
      this.getmemorialData()
    }
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    console.log(e)
    var that = this;
    const currentIndex = e.detail.key*1
    if (this.data.currentTab === currentIndex) {
      return false;
    } else {
      if (currentIndex === 1){
        this.getBirthData()
      } else if (currentIndex === 2) {
        this.getmemorialData()
      }
      that.setData({
        currentTab: currentIndex
      })
    }
  },
  onShow: function () {
    console.log(app.globalData)
    
    if (!app.globalData.currentTab){
      return
    }
    this.setData({
      currentTab: app.globalData.currentTab
    })
    if (app.globalData.currentTab === 1) {
      this.getBirthData()
    } else if (app.globalData.currentTab === 2) {
      this.getmemorialData()
    }
  },
  addBirthday: function(e){
    wx.navigateTo({
      url:'../birthday/birthday'
    })
  },
  addMemorial: function(){
    wx.navigateTo({
      url: '../memorial/memorial'
    })
  },
  birthChange: function(e) {
    console.log(e)
    const data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../birthupdate/birthupdate?id=' + data.id
    })
  },
  memoChange: function(e) {
    console.log(e)
    const data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../memoupdate/memoupdate?id=' + data.id
    })
  }
})