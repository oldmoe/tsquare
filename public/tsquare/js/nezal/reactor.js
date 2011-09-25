var Reactor = Class.create({
	
	initialize : function(delay){
		this.delay = delay || 33
		this.events = []
		this.observers = {}
		this.ticks = 0
		this.running = false
	},
	
	currentTime : function(){
		return this.ticks * this.delay
	},
	
	pause : function(){
		this.running = false;
	},
  
	resume : function(){
		this.running = true;
		this.tick();
	},
	
	stop : function(){
		this.running = false;
		this.events = [];
	},
	
	run : function(callback){
		this.running = true;
		if(callback) callback();
		this.tick();
	},
	
	tick : function(){
		if(!this.running) return
		var self = this	
		var toFire = []
		try{
			var event = this.events.last();
			while(event && event[0] <= this.ticks){
				var length = this.events.length - 1
				toFire.push(this.events.pop())
				event = this.events[this.events.length - 1]
			}
			toFire.each(function(event){
				if(event[2]){
					event[1].apply(event[2])
				}else{
					event[1]()
				}
			})
		}catch(e){
//			console.log(e)
			//alert('inside reactor : '+ e)
		}
		this.ticks++
		setTimeout(function(){self.tick()}, this.delay)
	},

	_eventIndex : function(ticks, insert){
		var h = this.events.length, l = -1, m;
		while(h - l > 1)
			if(this.events[m = (h + l) >> 1][0] > ticks) l = m;
			else h = m;
		return this.events[h] && this.events[h][0] != ticks ? insert ? h : -1 : h;
	},
  
  pushPeriodical : function(tickDelay,numberOfTicks, everyTicks, func){
		var totalNoOfTicks = numberOfTicks;
		var self = this;
    var newFunc = function(){
			if(numberOfTicks == 0){
				self.pushPeriodical(tickDelay,totalNoOfTicks, everyTicks, func);
				return;
			} 
      if(!self.running) return
      func();
      self.push(tickDelay, newFunc);
			numberOfTicks --;
    };
    self.push(everyTicks, newFunc);
  },
	
	
	pushPeriodicalWithCondition : function(everyNoOfTicks , func, condition,callback){
		if(!condition()){
			func()
			var self = this
			this.push(everyNoOfTicks,function(){
				self.pushPeriodicalWithCondition(everyNoOfTicks , func, condition,callback)
			})
		}else if(callback){
			callback()
		}
	},
	
	push : function(ticks, func, scope){
		var delay = this.ticks + ticks
		this.events.splice(this._eventIndex(delay, true), 0, [delay, func, scope])
	},
	
	pushEvery : function(ticks, everyTicks, func, scope){
		var wrapper = function(){
			scope = scope || this
			var	result = func.apply(scope)
			if(!(result === false)){
				this.push(everyTicks, wrapper, this)
			}
		}
		this.push(ticks, wrapper, this)
	},
	
	observe : function(event, func, scope){
	  if(!this.observers[event]) this.observers[event] = []
	  var observer = [func, scope]
	  this.observers[event].push(observer)
	  return observer
	},
		
  fire : function(event){
    if(this.observers[event]){
      var observers = Nezal.clone_obj(this.observers[event]);
      var toRemove = []
      for(var i=0;i<observers.length;i++){
        var scope = observers[i][1] || this
        if(observers[i][0].apply(scope) === false){
          toRemove.push(observers[i])
        }
      }
      toRemove.each(function(observer){
        this.observers.splice(this.observers.indexOf(observer),1)
      })
    }
  },
	
	timeToTicks : function(time){
		return Math.round(time / this.delay);		
	},
	
	everySeconds : function(seconds){
		return Math.round(seconds * 1000 / this.delay);
	}
	
})