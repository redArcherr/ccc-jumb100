import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,
        type:"normal"
    },

    
    onLoad: function () {
        this._direction = 1;
        this._movedDiff = 0;
        //碰撞检测，主要作用在平台的状态
        cc.director.getCollisionManager().enabled = true;
    },
    //碰撞判定
    onCollisionEnter:function(other, self){
        //cc.log("被踩");
    },
    onCollisionStay:function(other, self){},
    onCollisionExit:function(other){
        //cc.log("离开");
    },

    
    update: function (dt) {
        if(global.gameState!="over"){
            var d = this.speed * this._direction * dt;
            this._movedDistance += Math.abs(d); 
            this.node.y += d;
            this._movedDiff = d;
            if(this.node.y > cc.winSize.height+this.node.height){
                this.node.destroy();
                let gameNode=cc.find("root");
                gameNode.getComponent("game").spanPlat();
            }
        }
    },
});
