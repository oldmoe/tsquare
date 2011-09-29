var FlashingHandler = Class.create({
  initialize : function(scene){
    this.scene = scene
    this.div = $('beatFlash')
    this.flash()
  },
  flash : function(){
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
    
  }
})
