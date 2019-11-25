Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取收藏的书籍
    library: [],
    deleteFlag: false,
    // 更新标志
    // updateFlag:false
  },
  // 去帮助
  goHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  // 查看章节
  toChapters(e) {
    wx.navigateTo({
      url: `/pages/chapters/chapters?details=${JSON.stringify(e.currentTarget.dataset.details)}`,
    })
  },
  // 获取书架里的书
  getBooks() {
    this.setData({
      library: wx.getStorageSync('books')
    })
    this.data.library.map(item=>{
      if (new Date(item.updated).getTime() >item.readTime){
        this.data.library.updateFlag=true
      }
    })
  },
  // 管理书架
  edit() {
    this.setData({
      deleteFlag: !this.data.deleteFlag
    })
  },
  // 从书架删除书籍
  deleteMall(e) {
    wx.showModal({
      title: '提示',
      content: '确认将该书从书架中删除',
      success: res => {
        let bbb = e.currentTarget.dataset.item
        this.data.library.map((item, index) => {
          let aaa = item
          if (JSON.stringify(aaa) === JSON.stringify(bbb)) {
            this.data.library.splice(index, 1)
          }
        })
        this.setData({
          library: this.data.library
        })
        wx.setStorage({
          key: 'books',
          data: this.data.library,
        })
        this.getBooks()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBooks()
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
    this.getBooks()
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