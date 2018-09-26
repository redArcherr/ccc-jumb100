import global from './global'
const playerState={
    normal:0,//正常
    death:1,//死亡，这里等价地刺
    elastic:2,//弹簧
    ice:3,//冰
    thorn:4,//地刺，暂时使用死亡
    glod:5//宝物
}
cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        drag: 1000,
        direction: 0,
        jumpSpeed: 300,
        touchControl:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        //碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //键盘事件注册
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
        //碰撞
        this.collisionX = 0;
        this.collisionY = 0;

        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        this.touchingNumber = 0;

        this.addTouchEvent(this.touchControl);
    },
    //触摸控制
    addTouchEvent:function(node){
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let viewSize=cc.view.getVisibleSize();
            event.touch._point.x > viewSize.width/2 ?  this.direction = 1 : this.direction = -1;
        });
        node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.direction = 0;
        });
    },

   
    //键盘控制
    onKeyPressed: function (event) {
        let keyCode = event.keyCode;
        switch(keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.direction = -1;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.direction = 1;
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                if (!this.jumping) {
                    this.jumping = true;
                    this.speed.y = this.jumpSpeed;    
                }
                break;
        }
    },
    
    onKeyReleased: function (event) {
        let keyCode = event.keyCode;
        switch(keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.direction = 0;
                break;
        }
    },
    
    onCollisionEnter: function (other, self) {
        this.node.color = cc.Color.RED;
        this.touchingNumber ++;   
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)&&other.tag!=playerState.glod) {
            if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            other.touchingX = true;
            return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;
        if(other.tag==playerState.normal){
            //正常
            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                    this.node.y = otherPreAabb.yMax - this.node.parent.y;
                    this.jumping = false;
                    this.collisionY = -1;
                }
                else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                    this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                    this.collisionY = 1;
                }
                
                this.speed.y = 0;
                other.touchingY = true;
            }   
        }else if(other.tag==playerState.death){
            //死亡、未通关
            global.isSuccess=false;
            global.event.fire("die");  
        }else if(other.tag==playerState.elastic){
            //弹簧平台
            this.speed.y=this.jumpSpeed;
            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
                if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                    this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                    this.collisionY = 0;
                }
            } 
        }else if(other.tag==playerState.ice){
            //冰,易碎
            other.node.opacity=0;
        }else if(other.tag==playerState.glod){
            //碰到宝石
            let stonNode=other.node;
            let idx=stonNode.getComponent('ston').backIdx();
            if(this.cheakStones(idx)!=true){
                global.stones.push([idx,+1]);
                stonNode.destroy();
            }else{
                stonNode.destroy();
            }  
        }
    },
    
    onCollisionStay: function (other, self) {
        if (this.collisionY === -1) {
            if (other.node.group === 'Platform') {
                var motion = other.node.getComponent('plat');
                if (motion) {
                    this.node.y += motion._movedDiff;
                }
            }
        }
    },
    
    onCollisionExit: function (other) {
        this.touchingNumber --;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }
    },
    //检查数组里的宝石
    cheakStones:function(idx){
        let stones=global.stones;  
        for(let i=0;i<stones.length;i++){
            if(stones[i][0]==idx){
                stones[i][1]=stones[i][1]+1;
                return true;
            }
        }
        return false;
    },
    
    update: function (dt) {
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        }
        else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }
        
        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;
        
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;

      
    },
});
