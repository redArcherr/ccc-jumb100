import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       desNode:{
           default:null,
           type:cc.Node
       }
    },
    onLoad:function(){
        this.desCtrl("close");
        cc.director.preloadScene("game",(err)=>{
            if(err){
                cc.log("load"+err);
            }
        });
        global.gameState="start";
        //global.share();//微信分享
    },
    buttonClick:function(event,coustomData){
        if(coustomData==="start"){
            cc.director.loadScene("game");
        }
        if(coustomData==="des_show"){
            this.desCtrl("show");
        }
        if(coustomData==="des_close"){
            this.desCtrl("close");
        }
    },
    desCtrl:function(state){
        let scale;
        if(state==="show"){
            this.desNode.position=cc.v2(cc.winSize.width/2,585);
            scale = cc.scaleTo(0.2,1);   
            this.desNode.runAction(scale);
        }
        if(state==="close"){
            this.desNode.position=cc.v2(-999,-999);
            scale = cc.scaleTo(0.2,0.01);
            this.desNode.runAction(scale);
        }   
    }
});
