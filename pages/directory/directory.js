const Fly = require("../../lib/fly/wx.js")
const fly = new Fly()
const app = new getApp()
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
    // 章节内容
    chapters:[],
    // 显示章节内容
    showChapters:[],
    // 每页数
    pages:15,
    // 当前页
    currentPages:1
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
      this.setData({
        chapters: res.data.mixToc.chapters
      })
      console.log(this.data.chapters, 666)
    }).catch(err => {
      console.log(err)
    })
  },
  // 查看章节内容
  toChapters(e){
    wx.setStorage({
      key: 'chapters',
      data: { title: e.currentTarget.dataset.title, link: e.currentTarget.dataset.link, id: this.data.id, _id: this.data._id, chapterTitle: this.data.title, index: e.currentTarget.dataset.index},
    })
    wx.navigateTo({
      url: `/pages/chapters/chapters`,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      id: options.id,
      _id: options._id
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.getBook()
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

  }
})