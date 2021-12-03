// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

	



cc.Class({
    extends: cc.Component,

    properties: {

        sprite: cc.Sprite,
        layout: cc.Node,
        scrollView: cc.ScrollView,
        prefab:cc.Prefab,
        m_btnFishList:cc.Button,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        atlases: null,
        animation:null
    },

    // use this for initialization
    onLoad () {
        this.animation = this.sprite.getComponent(cc.Animation);
        
        cc.log("load fish dir")
        cc.resources.loadDir("fish",cc.SpriteAtlas,(err, atlases) => {
            this.atlases = atlases
            this.createFishList()
        });


        this.m_btnFishList.node.on('click', this.onClickFishList, this);
    },


    onClickFishList (  ) {
        this.scrollView.node.active = !this.scrollView.node.active;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setAnimation (  atlas) {
        //this.animation
        var spriteFrames = atlas.getSpriteFrames();
        

        let sortSpriteFrames = []
        for(var j = 0,jlen = spriteFrames.length; j < jlen ; j++)
        {
            let f, id;
        
            let fishName = spriteFrames[j].name
            let arr = fishName.match(/\d+(.\d+)?/g);
            id = parseInt(arr[1]) ;
            sortSpriteFrames[id-1]=spriteFrames[j]
        }


        var clip = cc.AnimationClip.createWithSpriteFrames(sortSpriteFrames,16);
        clip.name = 'run';
        clip.wrapMode = cc.WrapMode.Loop;

        this.animation.addClip(clip);
        this.animation.play('run');
    },
    createFishList () {
        for (var i = 0, len = this.atlases.length; i < len; i++) {
            let node = cc.instantiate(this.prefab);
            let ani = node.getComponent(cc.Animation);
            let atlas = this.atlases[i];
            let spriteFrames = atlas.getSpriteFrames();
            let sortSpriteFrames = []
            for(var j = 0,jlen = spriteFrames.length; j < jlen ; j++)
            {
                let f, id;
            
                let fishName = spriteFrames[j].name
                let arr = fishName.match(/\d+(.\d+)?/g);
                id = parseInt(arr[1]) ;
                sortSpriteFrames[id-1]=spriteFrames[j]
            }
   
    
            //this.atlases[i] = sortSpriteFrames;
            let clip = cc.AnimationClip.createWithSpriteFrames(sortSpriteFrames,16);
            clip.name = 'run';
            clip.wrapMode = cc.WrapMode.Loop;
            //clip.sample = 60

            ani.addClip(clip);
            ani.play('run');
            this.layout.addChild(node);

            let fish = node.getComponent("Fish");
            fish.setAtlas(atlas)

        }
        let ly = this.layout.getComponent(cc.Layout)
        ly.updateLayout()
        this.scrollView.content.setContentSize(this.layout.getContentSize())
    },


    onDestroy () {
        //this.atlas.decRef();
        //this.atlas = null;
    }

    // update (dt) {},
});
