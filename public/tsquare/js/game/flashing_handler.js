var FlashingHandler = Class.create({
  counter : 0,
  initialize : function(scene){
    this.scene = scene
    this.div = $('beatFlash')
    this.createObservers()
    this.repeatFlash()
//    this.flash()
  },
  flash : function(){
    if (this.counter == 4) {
      console.log('flash end')
      this.counter = 0
      return
    }
    this.counter++
    var ticks = this.scene.audioManager.nextBeatTicks()
    this.div.show()
    var fadeDuration = (ticks - 4)*this.scene.reactor.delay / 1000
    var self = this
    this.scene.reactor.push(0,function(){
      new Effect.Fade(self.div, {
        duration: fadeDuration 
      })
    }) 
    this.scene.reactor.push(ticks,this.flash,this)
  },
  repeatFlash : function(){
    this.flash()    
    console.log('repeat')
    var ticks = this.scene.audioManager.nextLoopTicks()
    this.scene.reactor.push(ticks,this.repeatFlash,this)
  },
  createObservers : function(){
    var directions = ['leftCorrect','rightCorrect','leftWrong','rightWrong']
    for(var i=0;i<directions.length;i++){
      this.addObserver(directions[i])
    }
  },
  addObserver : function(direction){
      var self = this
      this.scene.observe(direction,function(){
        self[direction]()
      })
  },
  leftCorrect : function(){
    new Animation(this.scene,{x:0,y:-Math.random()* 200},Loader.images.effects['good_blue.png'],9, {width:100,height:100})
  },
  leftWrong : function(){
    new Animation(this.scene,{x:0,y:-Math.random()* 200},Loader.images.effects['bad_red.png'],9,{width:100,height:100})
  },
  rightCorrect : function(){
    var imgWidth = Loader.images.effects['good_blue.png'].width
    new Animation(this.scene,{x:this.scene.view.width - imgWidth,y:-Math.random()* 200},Loader.images.effects['good_blue.png'],9,{width:100,height:100})
  },
  rightWrong : function(){
    var imgWidth = Loader.images.effects['bad_red.png'].width
    new Animation(this.scene,{x:this.scene.view.width - imgWidth,y:-Math.random()* 200},Loader.images.effects['bad_red.png'],9,{width:100,height:100})
  }
})
