const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 传过来的数据
    rank: {},
    // 显示数据
    books: [],
    // 榜单标志，默认0为周榜
    listFlag: 0
  },
  // 获取书籍信息
  rankInfo(id) {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/ranking/${id}`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      this.setData({
        books: res.data.ranking.books
      })
      console.log(this.data.books,666)
    }).catch(err => {
      console.log(err)
    })
  },
  // 选择显示的榜单
  chooseList(e) {
    this.setData({
      listFlag: e.currentTarget.dataset.index
    })
    let id = ""
    if (this.data.listFlag === 0) {
      id = this.data.rank._id
    } else if (this.data.listFlag === 1) {
      id = this.data.rank.monthRank
    } else {
      id = this.data.rank.totalRank
    }
    this.rankInfo(id)
  },
  // 跳转到书籍详情
  toDetails(e) {
    wx.navigateTo({
      url: `/pages/details/details?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      rank: JSON.parse(options.rank),
    })
    // wx.setNavigationBarTitle({
    //   title: this.data.rank.title,
    // })
    this.rankInfo(this.data.rank._id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.rank.title,
    })
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