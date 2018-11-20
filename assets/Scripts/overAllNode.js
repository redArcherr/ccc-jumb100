import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       audio:{
           default:null,
           type:cc.AudioClip
       },
       success:{
        default:null,
        type:cc.AudioClip
       },
       fail:{
           default:null,
           type:cc.AudioClip
       },
    },

   onLoad:function(){
       cc.game.addPersistRootNode(this.node);
       this.bgm=cc.audioEngine.play(this.audio,true,1);
       global.event.on("success",this.successAudio.bind(this));
       global.event.on("fail",this.failAudio.bind(this));
      
   },
   //成功音效
   successAudio:function(){
        this.bgm=cc.audioEngine.play(this.success,false,1);
   },
   //失败音效
   failAudio:function(){
        this.bgm=cc.audioEngine.play(this.fail,false,1);
   }
});
