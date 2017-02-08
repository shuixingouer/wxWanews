//index.js
//获取应用实例

const util = require("../../utils/util.js");
//播放的视频或者音频的ID
var playingID = -1;
var page = 1;//页码
var since = 0;
Page({
  data: {
    topTabItems:[],
    allDataList:[],
    currentTopItem: "0",
    swiperHeight:"0",
    testImg:"../../images/index/onerror.jpg",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.channelNewData();
    this.refreshNewData();
  },
  //生命周期函数-监听页面初次渲染完毕
  onReady:function(){
    var that = this;
     wx.getSystemInfo({
       success: function(res) {
         that.setData({
            swiperHeight: (res.windowHeight-37)
         });
       }
     })
  },
  //切换顶部标签
  switchTab:function(e){
    this.setData({
      currentTopItem:e.currentTarget.dataset.channelid
    });
    //如果需要加载数据
      this.refreshNewData();
  },
  //swiperChange
  // bindChange:function(e){
  //   var that = this;
  //   that.setData({
  //     currentTopItem:e.detail.current
  //   });

  //   //如果需要加载数据
  //   if (this.needLoadNewDataAfterSwiper()) {
  //     this.refreshNewData();
  //   }
  // },
  //频道数据获取
  channelNewData:function(){
    var that = this;
    var parameters = 'wap/wap2/channel/list';
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      that.setData({
          topTabItems: res.data.data
        });
      });
  },
  //刷新数据
  refreshNewData:function(){
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'wap/wap2/channel/'+this.data.currentTopItem;
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      page = 1;
      that.setNewDataWithRes(res,that);
      setTimeout(function(){
          util.hideToast();
          wx.stopPullDownRefresh();
        },1000);
      });
  },
  //监听用户下拉动作
  onPullDownRefresh:function(){
    this.refreshNewData();
  },
  //滚动后需不要加载数据
  needLoadNewDataAfterSwiper:function(){
    this.data.allDataList.length > 0 ? false : true;
  },
  //设置新数据
  setNewDataWithRes:function(res,target){
    since = res.data.data.since;
    for(var i = 0; i < res.data.data.list.length; i++) {
      res.data.data.list[i].createdAt = util.formatDate(new Date(res.data.data.list[i].createdAt));
    }
    target.setData({
      allDataList: res.data.data.list
    });
  },
  //加载更多操作
  loadMoreData:function(){
    console.log("加载更多");
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'wap/wap2/channel/'+this.data.currentTopItem+"?since="+this.getSince();
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      page += 1;
      that.setMoreDataWithRes(res,that);
      setTimeout(function(){
          util.hideToast();
          wx.stopPullDownRefresh();
        },1000);
      });
  },
  //设置加载更多的数据
  setMoreDataWithRes(res,target) {
    since = res.data.data.since;
    for(var i = 0; i < res.data.data.list.length; i++) {
      res.data.data.list[i].createdAt = util.formatDate(new Date(res.data.data.list[i].createdAt));
    }
        target.setData({
          allDataList: target.data.allDataList.concat(res.data.data.list)
        });
  },
  //获取since
  getSince:function(){
        return since ;
  },
  //图片no found情况下
  errImg: function(e){
    var that=this;  
    util.errImgFun(e, that);
  },  
})
