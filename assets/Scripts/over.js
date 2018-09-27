import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        bagScroll:{
            default:null,
            type:cc.Node
        },
        bagBtn:{
            default:null,
            type:cc.Node
        },
        bagLinePrefab:{
            default:null,
            type:cc.Prefab
        },
        bagItemPrefab:{
            default:null,
            type:cc.Prefab
        },
        textScroll:{
            default:null,
            type:cc.Node
        },
        kpPage:{
            default:null,
            type:cc.Node
        },
        shareNode:{
            default:null,
            type:cc.Node
        }
    },

    onLoad:function(){
        cc.loader.loadRes("./stonConfig",(err,result)=>{
            if(err){
                cc.log("load config:"+err);
            }else{
                this.stonText=result.json; 
                //cc.log(this.stonText.config[0].text);
            }
        });
        cc.director.preloadScene("game");
        this.bagData = global.stones;
        this.bagScroll.position = this.bagBtn.position;
        this.bagScroll.scale=0.01;
        this.bagItemCreat();
        this.closeText(); 
        this.closeShowKpPage();

        let background=cc.find("Canvas/background");//背景节点
        let stateSprite=cc.find("Canvas/background/stateSprite");//通关状态节点
        if(background!=null&&stateSprite!=null){
            if(global.isSuccess){
                cc.loader.loadRes("./success", cc.SpriteFrame, function (err, spFrame) {
                    background.getComponent(cc.Sprite).spriteFrame = spFrame;
                    background.width=cc.winSize.width;
                    background.height=cc.winSize.height;          
                });
                cc.loader.loadRes("./success_t", cc.SpriteFrame, function (err, spFrame) {
                    stateSprite.getComponent(cc.Sprite).spriteFrame = spFrame;           
                });
            }else{
                cc.loader.loadRes("./fail", cc.SpriteFrame, function (err, spFrame) {
                    background.getComponent(cc.Sprite).spriteFrame = spFrame;
                    background.width=cc.winSize.width;
                    background.height=cc.winSize.height;          
                });
                cc.loader.loadRes("./fail_t", cc.SpriteFrame, function (err, spFrame) {
                    stateSprite.getComponent(cc.Sprite).spriteFrame = spFrame;           
                });
            } 
        }
        
    },
    //重玩
    buttonClick:function(){
        global.gameState="start";
        if(global.gameState=="start"){
            cc.director.loadScene("game");
        }  
    },
    //打开背包
    bagButtonClick:function(){
        let move = cc.moveTo(0.2,cc.v2(0,100));
        let scale = cc.scaleTo(0.2,1);
        let spawn = cc.spawn(move,scale);
        this.bagScroll.runAction(spawn);
    },
    //关闭背包
    closeButtonClick:function(){
        let move = cc.moveTo(0.2,this.bagBtn.position);
        let scale = cc.scaleTo(0.2,0.01);
        let spawn = cc.spawn(move,scale);
        this.bagScroll.runAction(spawn);
    },
    //背包物品生成
    bagItemCreat:function(){
        let contentNode=cc.find("Canvas/background/bagScroll/view/content");
        for(let i=0;i<Math.ceil(this.bagData.length/4);i++){
            let bagline=cc.instantiate(this.bagLinePrefab);
            bagline.parent=contentNode;
            for(let j=0;j<4;j++){ 
                if(this.bagData[i*4+j]){
                    let bagItem=cc.instantiate(this.bagItemPrefab);
                    bagItem.parent=bagline;
                    let ston=cc.instantiate(global.stonePrefab);
                    ston.parent=bagItem;
                    ston.idx=this.bagData[i*4+j][0];
                    ston.count=this.bagData[i*4+j][1];
                    ston.getComponent('ston').createSton(ston.idx);
                    this.bagStonTouchEvent(ston);
                }
            }
        }
    },
    //点击背包物品
    bagStonTouchEvent:function(node){
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            cc.log("种类："+node.idx+" 数量："+node.count);
            this.showText(node.idx);
        });
    },
    //物品详情
    showText:function(idx){
        this.textScroll.position=cc.v2(0,-112);
        //内容
        let textNode=cc.find("Canvas/background/textMask/view/content/textLable");
        let text=textNode.getComponent(cc.Label);
        text.string=this.stonText.config[idx].text;
        //名字
        let nameNode=cc.find("Canvas/background/textMask/nameLable");
        let name=nameNode.getComponent(cc.Label);
        name.string=this.stonText.config[idx].name;
         //图片
        let stonNode=cc.find("Canvas/background/textMask/stonSprite");
        cc.loader.loadRes("./stons/"+name.string, cc.SpriteFrame, function (err, spFrame) {
            stonNode.getComponent(cc.Sprite).spriteFrame = spFrame;           
        });
    },
    //关闭背包
    closeText:function(){
        this.textScroll.position=cc.v2(-1000,-1000);
    },
    //打开科普
    showKpPage:function(){
        this.kpPage.active = true;
    },
    //关闭科普
    closeShowKpPage:function(){
        this.kpPage.active = false;
    },
    //打开分享
    showShare:function(){
        //global.share();
        this.shareNode.active=true;
    },
    //关闭分享
    closeShare(){
        this.shareNode.active=false;
    }
});
