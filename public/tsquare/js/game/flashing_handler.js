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
    var ticks = this.scene.audioManager.nextLoopTicks()
    this.scene.reactor.push(ticks,this.repeatFlash,this)
  },
  createObservers : function(){
  },
  addObserver : function(direction){
      var self = this
      this.scene.observe(direction,function(){
        self[direction]()
      })
  }
})
