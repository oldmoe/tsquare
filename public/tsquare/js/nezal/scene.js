var Scene = Class.create({
  
	//initializes the delay of the reactor
	initialize : function(game){
    this.game = game;
    this.fpsCounter = 0
    this.fps = 0
    this.fpsTime = 0
		this.reactor = new Reactor();
		this.objects = [];
		this.renderStores = {};
	},

	init : function(){
	},
	
	//runs the reactor , starts _tick function and then render the start
	start : function(){
		this.init()
		this.reactor.run()
		this.reactor.push(0, this._tick, this)
		return this
	},
	
	push : function(object){
		var self = this
		this.reactor.push(0, function(){self.objects.push(object)})
	},
	
	remove : function(object){
		var self = this
		this.reactor.push(0, function(){self.objects.remove(object)})
	},
	
	tick : function(){
			var remainingObjects = []
			var self = this
			this.objects.each(function(object){
				if(!object.finished){
					object.tick()
					remainingObjects.push(object)
				}
			})
			this.objects = remainingObjects
		return this
	},
	//moves objects in the scene 
	_tick : function(){
    var t1 = new Date().getTime()
		this.tick()
		this.render()
		var self = this
		this.reactor.push(0, function(){self._tick()})
    this.fpsCounter++
    this.fpsTime+= new Date().getTime() - t1
    if(this.fpsCounter == 50){
        this.fps = Math.round(this.fpsCounter * 1000/ this.fpsTime) 
        $('fps').innerHTML = this.fps
        this.fpsCounter = 0
        this.fpsTime = 0
    }
	},

	createRenderLoop : function(name, delay){
		this.renderStores[name] = {delay : delay, tick: this.reactor.ticks, objects : []}
		this.renderStores[name].working = true
	},
	
  clearRenderLoop : function(name){
    this.renderStores[name].objects = [];
  },
  
	pushPeriodicalRenderLoop : function(tickDelay,runningTicks,everySeconds,func){
		this.reactor.pushPeriodical(tickDelay,runningTicks,this.reactor.everySeconds(everySeconds),func)
	},

	pushToRenderLoop : function(name, object){
		var self = this
    if(object.owner)object.owner.renderLoop = name
		this.reactor.push(0, function(){self.renderStores[name].objects.push(object)})
	},
	
	removeFromRenderLoop : function(name, object){
		var self = this
		this.reactor.push(0, function(){self.renderStores[name].objects.remove(object);})
	},

	render : function(){
			for (var storeIndex in this.renderStores) {
        var store = this.renderStores[storeIndex]
        if (this.reactor.ticks >= store.tick + store.delay && store.working) {
          store.tick = this.reactor.ticks
          var remainedDisplays = []
          for (var i = 0; i < store.objects.length; i++) {
            if (store.objects[i].owner) {
              if (!store.objects[i].owner.removed) {
                store.objects[i].render()
                remainedDisplays.push(store.objects[i])
              }
            }else{
                store.objects[i].render()
                remainedDisplays.push(store.objects[i])
            }
          }
          store.objects = remainedDisplays
        }
      }      
	}
	
})
