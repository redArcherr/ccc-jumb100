cc.Class({
    extends: cc.Component,

    properties: {
       audio:{
           default:null,
           type:cc.AudioClip
       }
    },

   onLoad:function(){
       cc.game.addPersistRootNode(this.node);
       this.bgm=cc.audioEngine.play(this.audio,true,1);
      
   }
   //获取jssdk票据第二种方式,第一种方式封装在global里了
    // getjssdkPhp:function(){
    //     var url="http://wx.bjhci.cn/jssdk/getJssdkData.php";
    //     var xhr = new XMLHttpRequest();
    //     var getData;
    //     xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
    //         getData = JSON.parse(xhr.responseText);
    //         //cc.log(getData.appId);
    //         }
    //     };
    //     xhr.open("GET", url, true);
    //     xhr.send();   
    // },
});
