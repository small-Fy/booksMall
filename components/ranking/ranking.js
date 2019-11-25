// components/ranking/ranking.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rank: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showRank(e) {
      wx.navigateTo({
        url: `/pages/specificRanking/specificRanking?rank=${JSON.stringify(e.currentTarget.dataset.rank)}`,
      })
    }
  }
})
