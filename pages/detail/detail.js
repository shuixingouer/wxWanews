//detail.js
//获取应用实例

const util = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
var data_id = 0;//帖子的ID
Page({
  data: {
    dataList: [],
    topic: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    data_id = options.id;
    //页面初始化 options为页面跳转所带来的参数
    this.refreshNewDataList();
    this.refreshNewTopic();
  },
  //生命周期函数-监听页面初次渲染完毕
  onReady:function(){
    var that = this;
     wx.getSystemInfo({
       success: function(res) {
           
       }
     })
  },
  //刷新详情页面数据
  refreshNewDataList:function(){
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'wap/wap2/static/detail/'+data_id;
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      that.setNewDataList(res,that);
      });
  },
  //刷新话题数据
  refreshNewTopic:function(){
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'wap/wap2/topic/list/'+data_id;
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      that.setNewTopic(res,that);
      });
  },
  //设置新详情数据
  setNewDataList:function(res,target){
        target.setData({
          dataList: res.data.data
        });
        var type=res.data.data.type;
        console.log(type);
      if(type==0){
        target.setwxParse(res,target);
      }
  },
  //设置新话题数据
  setNewTopic:function(res,target){
        target.setData({
          topic: res.data.data.simpleObjectVoList
        });
  },
  //设置转换的html标签
  setwxParse:function(res,target){
        var images=res.data.data.images;
        var body=res.data.data.body;
        if (images.length > 0) {
                    for (var t = images.length - 1; t >= 0; t--) {
                        if(images[t]){
                            if(!images[t].imageUrl){//大图
                                images[t].imageUrl=images[t].squareImageUrl;
                            }
                            if(!images[t].middleImageUrl){//中图
                                images[t].middleImageUrl=images[t].imageUrl;
                            }
                            if(!images[t].smallImageUrl){//小图
                                images[t].smallImageUrl=images[t].middleImageUrl;
                            }
                            body = body.replace('tdnews://img' + t, images[t]?('<p class="image" width="'+ images[t]['width'] +'" height="'+ images[t]['height'] +'" src_path="'+ images[t].middleImageUrl +'" thumb_path="'+  images[t].smallImageUrl +'"><img src="'+  images[t].smallImageUrl +'"></p>'):'');
                        }else{body = body.replace('tdnews://img' + t, images[t] ? '':'');}
                    }
                }
        var infoFlg = "<!--SPINFO#0-->";  
        var article= body;
        console.log(article);
        WxParse.wxParse("article", 'html', article, target, 5);
  }
})
