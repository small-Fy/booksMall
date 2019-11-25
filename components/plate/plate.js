Component({
  /**
   * 组件的属性列表
   */
  properties: {
    arr:{
      type:Array,
      default:()=>[]
    },
    plateName:{
      type: String,
      default: ""
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
    showRank(e){
      console.log(e,999)
      wx.navigateTo({
        url: `/pages/books/books?name=${e.currentTarget.dataset.name}&plateName=${e.currentTarget.dataset.platename}`,
      })
    }
  }
})
