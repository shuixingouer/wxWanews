const config = require("config.js");

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间显示的判断条件
function formatDate(time){
            var ts=new Date().getTime()-time;
            if(ts<900000){
                return '剛剛';
            }else if(ts<3600000){
                return parseInt(ts/60000)+'分鐘前';
            }else if(ts<86400000){
                return parseInt(ts/3600000)+'小時前';
            }else if(ts<172800000){
                return '昨天';
            }else if(ts<604800000){
                return parseInt(ts/86400000)+'天前';
            }else{
                return getFormatDateByLong(time, "yyyy-MM-dd");
            }
        }

//网络请求
function request(parameters = "",success, method = "GET", header = {}) {
  wx.request({
    url: config.BaseURL + (method == "GET" ? "/" : "")+ parameters,
    data: {},
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header ? header : "application/json", // 设置请求的 header
    success: function(res){
      console.log(res);
      success(res);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}
//HUD 
//成功提示
function showSuccess(title = "成功啦", duration = 2500){
  wx.showToast({
      title: title ,
      icon: 'success',
      duration:(duration <= 0) ? 2500 : duration
  });
}
//loading提示
function showLoading(title = "请稍后", duration = 5000) {
  wx.showToast({
      title: title ,
      icon: 'loading',
      duration:(duration <= 0) ? 5000 : duration
  });
}
//隐藏提示框
function hideToast(){
  wx.hideToast();
}
//图片no found情况下指引
function errImgFun(e, that){  
  var _errImg=e.target.dataset.errImg;
  console.log(_errImg);
  var _errObj={};  
  _errObj[_errImg]="../../images/index/onerror.jpg";
  console.log("调试" +  e.detail.errMsg+"----" + "----" +_errImg );
  that.setData(_errObj);
} 
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  request: request,
  showSuccess: showSuccess,
  showLoading: showLoading,
  hideToast: hideToast,
  errImgFun: errImgFun,
}