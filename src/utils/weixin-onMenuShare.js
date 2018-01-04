import config from './../config';

const onMenuShare = (title, desc, link) => new Promise((resolve, reject) => {
  fetch(`${config.URLversion}/api/signature.do`, {
    method: 'GET',
    contentType: "application/json; charset=utf-8"
  }).then(
    response => response.json(),
    error => ({'result': '1', 'message': error})
  ).then(val => {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: val.data.appId, // 必填，公众号的唯一标识
        timestamp: val.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: val.data.nonceStr, // 必填，生成签名的随机串
        signature: val.data.signature,// 必填，签名，见附录1
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: title || '潜游时光', // 分享标题
        link: link || window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.divingtime.asia/dist/img/logo.jpg', // 分享图标
      });
      wx.onMenuShareAppMessage({
        title: title || '潜游时光', // 分享标题
        desc: desc || '欢迎来到潜游时光!', // 分享描述
        link: link || window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.divingtime.asia/dist/img/logo.jpg', // 分享图标
      });
      resolve();
    })
    wx.error((res) => {
      reject(`验证signature失败 ${res}`);
    });
  }).catch(error => reject(`请求signature失败 ${error}`));
});

export default onMenuShare
