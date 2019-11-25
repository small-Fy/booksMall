const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 书籍名称
    title: "",
    // 书籍id
    id: "",
    // 书籍详情
    details: {},
    // 开始阅读或加入书架的标志
    flag: 0,
    // 详情与评价的切换，默认true为详情
    chooseFlag: true,
    // 评分
    score: 0,
    // 评价数
    evaluationNum: 0,
    // 评价详情
    docs: [],
    // 相关推荐
    relatedBooks: [],
    showBook: [],
    // 是否显示遮罩层
    maskFlag: false,
    // 加入到书架的书
    library:[]

  },
  // 获取书籍详情
  getBook() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/book/${this.data.id}`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      console.log(res,4444555)
      this.setData({
        details: res.data,
        score: Math.floor(res.data.rating.score / 2)
      })
      console.log(this.data.details, 444)
    }).catch(err => {
      console.log(err)
    })
  },
  // 选择开始阅读
  startRead(e) {
    this.setData({
      flag: e.currentTarget.dataset.flag
    })
    wx.navigateTo({
      url: `/pages/chapters/chapters?title=${e.currentTarget.dataset.title}&id=${this.data.id}&_id=${this.data.details._id}`,
    })
    console.log(this.data.details._id, 4)
  },
  // 选择加入书架
  addMall(e) {
    let aaa=this.data.library.every(item=>{
      return item.title !== this.data.details.title
    })
    if(aaa){
      this.setData({
        flag: e.currentTarget.dataset.flag
      })
      this.data.details.nowChapter = 0
      this.data.details.readTime = Date.now()
      this.data.library.push(this.data.details)
      wx.setStorage({
        key: 'books',
        data: this.data.library,
      })
      wx.showToast({
        title: '加入书架成功',
      })
    }else{
      wx.showToast({
        title: '该书已在书架中',
      })
    }
    
  },
  // 从书架中移除该书
  deleteMall(e){
    this.setData({
      flag: e.currentTarget.dataset.flag
    })
    wx.showModal({
      title: '提示',
      content: '确认将该书从书架中删除',
      success: res => {
        this.data.library.map((item, index) => {
          if (item.title === this.data.details.title) {
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
        this.getMall()
      }
    })
  },
  // 选择详情或者评价
  choose(e) {
    this.setData({
      chooseFlag: e.currentTarget.dataset.item
    })
  },
  // 获取评论
  getShortReview() {
    app.globalData.fly.get(`/post/short-review?book=${this.data.id}&total=true&sortType=newest`).then(res => {
      console.log(res, 999)
      this.setData({
        evaluationNum: res.data.total,
        docs: res.data.docs
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取书籍相关推荐
  relatedRecommendedBooks() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/book/${this.data.id}/recommend`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      this.setData({
        relatedBooks: res.data.books
      })
      this.update()
    }).catch(err => {
      console.log(err)
    })
  },
  // 换一换
  update() {
    let aaa = []
    let bbb = Math.floor(Math.random() * this.data.relatedBooks.length)
    if (bbb > this.data.relatedBooks.length - 3) {
      bbb -= 3
    }
    aaa = this.data.relatedBooks.splice(bbb, 3)
    this.setData({
      showBook: aaa,
      relatedBooks: this.data.relatedBooks.concat(aaa)
    })
  },
  // 是否显示遮罩层
  showMask() {
    this.setData({
      maskFlag: !this.data.maskFlag
    })
  },
  // 长按事件
  commit() {
    wx.showActionSheet({
      itemList: ["保存图片到手机"],
      success: (res) => {
        var imgSrc = `https://statics.zhuishushenqi.com${this.data.details.cover}`
        wx.downloadFile({
          url: imgSrc,
          success: function(res) {
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(data) {
                console.log(data, 666);
              },
              fail: function(err) {
                console.log(err);
              }
            })
          }
        })
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },
  // 去目录
  toDirectory(e) {
    wx.navigateTo({
      url: `/pages/directory/directory?title=${e.currentTarget.dataset.title}&id=${this.data.id}&_id=${this.data.details._id}`,
    })
  },
  // 获取书架里的书
  getMall() {
    this.setData({
      flag: 0
    })
    this.setData({
      library: wx.getStorageSync('books')
    })
    console.log(this.data.title, 444)
    this.data.library.map(item=>{
      console.log(item.title, 555)
    })
    let aaa = this.data.library.some(item => {
      return item.title === this.data.title
    })
    if(aaa){
      this.setData({
        flag: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      title: options.title,
    })
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.getBook()
    this.getShortReview()
    this.relatedRecommendedBooks()
    wx.getStorage({
      key: 'books',
      success:res=> {
        console.log(res,666)
        this.setData({
          library: res.data
        })
      },
    })
    this.getMall()
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
    this.getMall()
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