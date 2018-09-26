import EventListener from './event-listener'
const global=global||{};
global.event=EventListener({});
global.gameState="start";//状态机
global.stones=[];//存放吃到的宝石
global.stonePrefab=[];//存放宝石预制体
global.deep=10;
global.isSuccess=false;//是否通关
global.share=function(score,name){
    var share_title="吉宝地心探险"+score;
    var share_desc="吉宝吉宝"+name;
    var share_link="http://wx.bjhci.cn/jibao/index.html";
    var share_imgUrl="https://mmbiz.qpic.cn/mmbiz_png/9KS2eSQTq2GAoptefZeaF0bgBK5vEs4WibrvmicyWjHI5ibmbZ9qAZQ4DHmicuSMdN6XW3JkHcIWz2nlkvYtiayJOiag/0?wx_fmt=png";
    wx.ready(function () {
        // 在这里调用 API
        wx.onMenuShareAppMessage({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            trigger: function () {
                //alert('用户点击发送给朋友');
            },
            success: function () {
                //用户确认分享后执行的回调函数
            },
            cancel: function () {
                //用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareTimeline({
            title: share_title, // 分享标题
            desc: share_desc,
            link: share_link, // 分享链接
            imgUrl: share_imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
}
export default global;