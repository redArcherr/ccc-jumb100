cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode:{
            default:null,
            type:cc.Sprite
        },
        spriteImgs:{
            default:[],
            type:cc.SpriteFrame
        }
    },
    onLoad:function(){
        
    },
    createSton:function(idx){
        this.stonIdx=idx;
        this.spriteNode.spriteFrame=this.spriteImgs[this.stonIdx];
    },
    backIdx:function(){
        return this.stonIdx;
    }

    
});
