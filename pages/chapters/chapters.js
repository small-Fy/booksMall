const Fly = require("../../lib/fly/wx.js")
const fly = new Fly()
const app = new getApp()
let WxParse = require('../../lib/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 书籍名
    title: "",
    // 书源id
    id: "",
    // 书id
    _id: "",
    // 章节link
    link: "",
    // 阅读的第几章
    chapterNum: 0,
    // 章节信息
    chapter: {},
    // 章节名
    chapterTitle: "",
    wxParseData: '',
    // 总章节数
    chapters: 0,
    // 加入到书架的书
    library: []
  },
  // 获取书籍详情
  getBook() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/mix-atoc/${this.data._id}?view=chapters`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      console.log(res, 123456)
      this.setData({
        link: res.data.mixToc.chapters[this.data.chapterNum].link,
        chapterTitle: res.data.mixToc.chapters[this.data.chapterNum].title,
        chapters: res.data.mixToc.chapters.length

      })
      fly.get(`https://chapter2.zhuishushenqi.com/chapter/${this.data.link}`).then(res => {
        if (res) {
          wx.hideLoading()
        }
        this.setData({
          chapter: res.data.chapter
        })
        WxParse.wxParse('article', 'md', this.data.chapter.body, this, 5);
        console.log(this.data.chapter, 444)
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  comeChapter() {
    fly.get(`https://chapter2.zhuishushenqi.com/chapter/${this.data.link}`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      this.setData({
        chapter: res.data.chapter
      })
      WxParse.wxParse('article', 'md', this.data.chapter.body, this, 5);
      console.log(this.data.chapter, 444)
    }).catch(err => {
      console.log(err)
    })
  },
  // 下一章
  next() {
    if (this.data.chapters > this.data.chapterNum) {
      this.setData({
        chapterNum: this.data.chapterNum + 1
      })
      this.getBook()
      let aaa = Date.now()
      this.data.library.map(item => {
        if (item.title === this.data.title) {
          item.nowChapter = this.data.chapterNum
          item.readTime = aaa
        }
      })
      console.log(this.data.library, 444555)
      wx.setStorage({
        key: 'books',
        data: this.data.library,
      })
    } else {
      wx.showToast({
        title: '后面没有了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 上一章
  last() {
    if (this.data.chapterNum > 1) {
      this.setData({
        chapterNum: this.data.chapterNum - 1
      })
      this.getBook()
      let aaa = Date.now()
      this.data.library.map(item => {
        if (item.title === this.data.title) {
          item.nowChapterNum = this.data.chapterNum
          item.readTime = aaa
        }
      })
      wx.setStorage({
        key: 'books',
        data: this.data.library,
      })
    } else {
      wx.showToast({
        title: '前面没有了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 获取书架中的书籍
  getLibrary() {
    this.setData({
      library: wx.getStorageSync("books")
    })
    this.data.library.map(item => {
      if (item.title === this.data.title) {
        console.log(999)
        this.setData({
          chapterNum: item.nowChapter
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.details) {
      let aaa = JSON.parse(options.details)
      this.setData({
        title: aaa.title,
        _id: aaa._id,
        chapterNum: aaa.nowChapter
      })
      wx.setNavigationBarTitle({
        title: this.data.title
      })
      this.getBook()
      this.getLibrary()
    } else {
      if (options.title) {
        this.setData({
          title: options.title,
          id: options.id,
          _id: options._id
        })
        wx.setNavigationBarTitle({
          title: this.data.title
        })
        this.getBook()
        this.getLibrary()
      } else {
        wx.getStorage({
          key: 'chapters',
          success: res => {
            this.setData({
              title: res.data.chapterTitle,
              id: res.data.id,
              _id: res.data._id,
              link: res.data.link,
              chapterTitle: res.data.title,
              chapterNum: res.data.index
            })
            wx.setNavigationBarTitle({
              title: this.data.title
            })
            this.getBook()
            this.getLibrary()
          },
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})