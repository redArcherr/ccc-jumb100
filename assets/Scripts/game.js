import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       platPrefabs:{
           default:[],
           type:cc.Prefab
       },
       platSpace:100,
       platCount:0,
       bgSpeed:10,
       bgNode:{
           default:null,
           type:cc.Node
       },
       gameProgress:{
           default:null,
           type:cc.ProgressBar
       },
       titleSign:{
           default:[],
           type:cc.SpriteFrame
       },
       stonPrefab:{
           default:null,
           type:cc.Prefab
       },
       defplayer:{
           default:null,
           type:cc.SpriteFrame
       }
    },

    onLoad:function(){
        this.platCount=0;//平台数量控制平台出现规律
        this.stonChange=10;//控制宝石出现规律每5个一组
        this.titleSprite=cc.find("Canvas/UI/titleSprite");//标题
        this.bg1=cc.find("root/bg/bg1");
        this.bg2=cc.find("root/bg/bg2");
        this.bg3=cc.find("root/bg/bg3");
        this.bg4=cc.find("root/bg/bg4");
        this.bg1.width=this.bg2.width=this.bg3.width=this.bg4.width=cc.winSize.width;
        this.bg1.x=this.bg2.x=this.bg3.x=this.bg4.x=cc.winSize.width/2;
        this.bgNodeMaxY=this.bg1.height*4;
        global.stones=[];//初始化获得宝石
        global.stonePrefab=this.stonPrefab;//把宝石预制体给global
        global.event.on("die",this.gameOver.bind(this));
        //创建首批plat
        for(let i=0;i<8;i++){
            this.spanPlat();
            if(i===7){
                this.updatePlat=true;
            }
        }
        cc.director.preloadScene("over",(err)=>{
            if(err){
                cc.log("load scene"+err);
            }
        });
        //用来加保护罩
        this.playerNode=cc.find("root/player");
        
    },

    spanPlat:function(){
        let plat=undefined,rand=Math.random();
        this.platCount++;
        if(this.bgNode.y>this.bgNodeMaxY/2-this.bg1.height/2){
            if(this.platCount%2==0){
                plat = cc.instantiate(this.platPrefabs[3]);
            }else{
                plat = cc.instantiate(this.platPrefabs[2]);
                if(rand>0.6){
                    if(this.stonChange!=-1){
                        let ston=cc.instantiate(this.stonPrefab);
                        ston.getComponent('ston').createSton(Math.floor(Math.random()*9)+this.stonChange);
                        ston.parent=plat;
                        ston.y=plat.height/2+ston.height/2;
                    }    
                }
            }
        }else{
            if(this.platCount%3==0){
                plat = cc.instantiate(this.platPrefabs[1]);
            }else{
                plat = cc.instantiate(this.platPrefabs[0]);
                if(rand>0.6){
                    if(this.stonChange!=-1){
                        let ston=cc.instantiate(this.stonPrefab);
                        ston.getComponent('ston').createSton(Math.floor(Math.random()*9)+this.stonChange);
                        ston.parent=plat;
                        ston.y=plat.height/2+ston.height/2;
                    }    
                } 
            }
        } 
        plat.parent = cc.find("root/platforms");
        plat.position = this.spanPlatPos(plat);
    },

    spanPlatPos:function(plat){
        let x,y,winSize=cc.winSize;
        //x = Math.floor(Math.random()*(winSize.width-240))+120;
        this.platCount == 1 ? x = 155 : x = Math.floor(Math.random()*(winSize.width-240))+120;
        this.platCount <= 8 ? y=(winSize.height)-(this.platSpace*this.platCount)-this.platSpace : y=(winSize.height)-this.platSpace*8;
        return cc.v2(x,y);
    },
    gameOver:function(){
        global.gameState="over";
        cc.director.loadScene("over");
    },
    update:function(dt){
        if(global.gameState=="start"){
            if(this.bgNode){
                if(this.bgNode.y<this.bgNodeMaxY-this.bg1.height/2-110){
                    this.bgNode.y +=dt*this.bgSpeed*1;
                    //进度和标题
                    this.gameProgress.progress=this.bgNode.y/(this.bgNodeMaxY-this.bg1.height/2-110);
                    if(this.bgNode.y<840){
                        //地壳
                        this.stonChange=10;
                        this.titleSprite.getComponent(cc.Sprite).spriteFrame=this.titleSign[0];
                    }else if(this.bgNode.y>840 && this.bgNode.y<this.bg1.height*2){
                        //上地幔
                        this.stonChange=0;                     
                        this.titleSprite.getComponent(cc.Sprite).spriteFrame=this.titleSign[1];
                    }else if(this.bgNode.y>this.bg1.height*2 && this.bgNode.y<this.bg1.height*3){
                        //下地幔
                        //this.stonChange=10;
                        this.playerNode.getComponent(cc.Sprite).spriteFrame=this.defplayer;//防火服
                        this.titleSprite.getComponent(cc.Sprite).spriteFrame=this.titleSign[2];
                    }else if(this.bgNode.y>this.bg1.height*3){
                        //地核
                        this.stonChange=-1;//无
                        this.titleSprite.getComponent(cc.Sprite).spriteFrame=this.titleSign[3];
                    }
                }else{
                    //已通关
                    global.isSuccess=true;
                    this.gameOver();
                }
            }
        }  
    }

    
});
