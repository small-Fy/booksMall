const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键词
    keyWord: '',
    //搜索热词
    hotWords: [],
    // 用于显示的搜索热词
    showHotWords: [],
    // 书籍起始位置
    start: 0,
    // 每页拿limit条数据
    limit: 50,
    // 显示搜索图标或者删除图标，默认搜索图标
    iptDel: true,
    // 显示书籍信息或者搜索历史，默认搜索历史
    bkSh: true,
    // 显示的书籍信息
    books: [],
    // 搜索历史记录
    history: []
  },
  // 点击回车后触发
  confirm(e) {
    console.log(e.detail.value, 33)
    if (this.data.history.indexOf(e.detail.value)<0){
      this.data.history.push(e.detail.value)
      this.setData({
        history: this.data.history
      })
      wx.setStorage({
        key: 'searchHistory',
        data: this.data.history,
      })
      wx.getStorage({
        key: 'searchHistory',
        success: res => {
          this.setData({
            history: res.data
          })
        },
      })
    }
    if (e.detail.value.trim() !== '') {
      this.setData({
        keyWord: e.detail.value.trim(),
        bkSh: false
      })
      this.bookSearch(this.data.keyWord)
    } else {
      this.setData({
        bkSh: true
      })
    }
  },
  // 输入框有内容时触发
  input(e) {
    if (e.detail.value.trim() !== '') {
      this.setData({
        iptDel: false
      })
    } else {
      this.setData({
        iptDel: true
      })
    }
  },
  // 删除搜索框的内容
  delete() {
    this.setData({
      keyWord: '',
      bkSh: true
    })
  },
  // 点击搜索热词
  setValue(e) {
    this.setData({
      keyWord: e.currentTarget.dataset.word,
      iptDel: false
    })
  },
  // 清空搜索历史
  empty(){
    wx.setStorage({
      key: 'searchHistory',
      data: [],
    })
    this.setData({
      history:[]
    })
  },
  // 获取搜索热词
  getHotWord() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get('/book/hot-word').then(res => {
      if (res) {
        wx.hideLoading()
      }
      this.setData({
        hotWords: res.data.newHotWords
      })
      this.update()
    }).catch(err => {
      console.log(err)
    })
  },
  // 书籍搜索
  bookSearch(keyWord) {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/book/fuzzy-search?start=${this.data.start}&limit=${this.data.limit}&v=1&query=${keyWord}`).then(res => {
      if (res) {
        wx.hideLoading()
      }
      this.setData({
        books: res.data.books
      })
      this.update()
    }).catch(err => {
      console.log(err)
    })
  },
  // 换一换
  update() {
    let aaa = []
    let bbb = Math.floor(Math.random() * this.data.hotWords.length)
    if (bbb > this.data.hotWords.length - 6) {
      bbb -= 6
    }
    aaa = this.data.hotWords.splice(bbb, 6)
    this.setData({
      showHotWords: aaa,
      hotWords: this.data.hotWords.concat(aaa)
    })
    // 随机6个颜色
    this.data.showHotWords.map(item => {
      item.bgcolor = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
    })
    this.setData({
      showHotWords: this.data.showHotWords
    })
    console.log(this.data.showHotWords)
  },
  toDetails(e) {
    wx.navigateTo({
      url: `/pages/details/details?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHotWord()
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