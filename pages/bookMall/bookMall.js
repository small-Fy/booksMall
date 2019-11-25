const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类与排行的切换，默认true为分类
    chooseFlag:true,
    // 获取到的书籍
    book:{},
    // 获取到的排行
    rank:{}

  },
  // 选择显示分类或排行
  choose(e){
      this.setData({
        chooseFlag: e.currentTarget.dataset.item
      })
  },
  // 获取书籍信息
  getBook() {
    app.globalData.fly.get("/cats/lv2/statistics").then(res => {
      this.setData({
        book:res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取排行信息
  getRank() {
    app.globalData.fly.get("/ranking/gender").then(res => {
      this.setData({
        rank: res.data
      })
      console.log(this.data.rank,666)
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBook();
    this.getRank()
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