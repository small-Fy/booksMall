const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 大类
    name: "",
    //获取分类书籍
    all: {},
    // 排行类型序号
    typeListIndex: 0,
    // 小类序号
    minorIndex: 0,
    // 小类名称
    mins: ["全部"],
    // 板块名称
    plateName: "",
    // 每页限定数据量
    limit: 20,
    // 起始位置
    start: 0,
    // 显示数据
    showData:[],
    // 是否触底标志
    bottomFlag:false,
    typeList: [{
        id: 'hot',
        name: '热门'
      },
      {
        id: 'new',
        name: '新书'
      },
      {
        id: 'reputation',
        name: '好评'
      },
      {
        id: 'over',
        name: '完结'
      },
      {
        id: 'monthly',
        name: 'VIP'
      }
    ]
  },
  //获取分类书籍
  getBook() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get("/cats/lv2").then(res => {
      if(res){
        wx.hideLoading()
      }
      this.setData({
        all: res.data
      })
      console.log(this.data.all, 456)
      let bigClass = []
      for (let i in this.data.all) {
        if (this.data.plateName === i) {
          bigClass = this.data.all[i]
        }
      }
      console.log(bigClass)
      bigClass.map(item => {
        if (item.major === this.data.name) {
          this.setData({
            mins: this.data.mins.concat(item.mins)
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 改变排行类型的序号并获取数据
  chooseIndex(e) {
    this.setData({
      typeListIndex: e.currentTarget.dataset.index,
      start:0,
      showData: [],
      minorIndex:0
    })
    this.getCatsBooks(this.data.typeList[this.data.typeListIndex].id, '')
  },
  // 改变小类类型的序号并获取数据
  chooseMinorIndex(e) {
    this.setData({
      minorIndex: e.currentTarget.dataset.index,
      start: 0,
      showData: []
    })
    if (this.data.minorIndex===0){
      this.data.mins[this.data.minorIndex]=''
    }
    this.getCatsBooks(this.data.typeList[this.data.typeListIndex].id, this.data.mins[this.data.minorIndex])
  },
  getCatsBooks(type,minor) {
    wx.showLoading({
      title: '加载中',
    })
    if (minor) {
      app.globalData.fly.get(`/book/by-categories?gender=${this.data.plateName}&type=${type}&major=${this.data.name}&minor=${minor}&start=${this.data.start}&limit=${this.data.limit}`).then(res => {
        if (res) {
          wx.hideLoading()
        }
        this.setData({
          showData: res.data.books
        })
      }).catch(err => {
        console.log(err)
      })
    }else{
      app.globalData.fly.get(`/book/by-categories?gender=${this.data.plateName}&type=${type}&major=${this.data.name}&start=${this.data.start}&limit=${this.data.limit}`).then(res => {
        if (res) {
          wx.hideLoading()
        }
        this.setData({
          showData: this.data.showData.concat(res.data.books)
        })
      }).catch(err => {
        console.log(err)
      })
    }
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
      name: options.name,
      plateName: options.plateName
    })
    wx.setNavigationBarTitle({
      title: this.data.name,
    })
    this.getBook()
    this.getCatsBooks("hot", "")
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
      this.setData({
        start: this.data.start*1 + this.data.limit*1
      })
    if (this.data.minorIndex === 0) {
      this.data.mins[this.data.minorIndex] = ''
    }
    this.getCatsBooks(this.data.typeList[this.data.typeListIndex].id, this.data.mins[this.data.minorIndex])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})