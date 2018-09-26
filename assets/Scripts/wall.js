cc.Class({
    extends: cc.Component,

    properties: {
       type:"right"
    },
    onLoad:function(){
        let winSize=cc.winSize;
        if(this.type==="right"){
            this.node.x=winSize.width;
        }
        if(this.type==="top"){
            this.node.y=winSize.height;
        }
    },
  
});
