if(typeof Worker != 'undefined'  && typeof inWorker == 'undefined'){
	var Box2dWorld = Class.create({
		initialize : function(reactor, delay){
			this.worker = new Worker('js/nezal/box2d_worker.js')
			this.worker.postMessage(['bootstrap', Prototype.Browser])
			var me = this
			this.worker.onmessage = function(event){me.processMessage(event)}
			this.state = {}
		},
		
		createGround : function(x, y, w, h){
			this.worker.postMessage(['createGround', [x, y, w, h]])
		},
		
		createBall : function(id, x, y, r){
			this.worker.postMessage(['createBall', [id, x, y, r]])
		},
		
		createBox : function(id, x, y, w, h, fixed){
			this.worker.postMessage(['createBox', [id, x, y, w, h, fixed]])
		},
		
		applyForce : function(id, fx, fy, dx, dy){
			this.worker.postMessage(['applyForce', [id, fx, fy, dx, dy]])
		},
		
		eval : function(text){
			this.worker.postMessage(['eval', [text]])
		},
		
		step : function(delay){
			this.worker.postMessage(['step', [delay]])
		},
		
		getState : function(){
			return this.state
		},
		
		setState : function(state){
			this.state = state
		},
		
		log : function(msg){
			console.log(msg)
		},
		
		processMessage : function(event){
			var method = event.data[0]
			var args = event.data[1]
			if(args.constructor == Array){
				this[method].apply(this, args)
			}else{
				this[method].call(this, args)
			}
		}
	})
}else{
	// this code runs in a client that does not support web workers 
	// or (and that's a little mind boggling) in the web worker itself!
	var Box2dWorld = Class.create({
		initialize : function(){
			this.objects = {}
			this.ground = null
			this.world = createWorld()
			this.state = {}
			var me  = this
			if(typeof inWorker != 'undefined' && inWorker){
				this.inWorker = true
				self.onmessage = function(event){me.processMessage(event)}
			}
		},
		
		createGround : function(x, y, w, h){
			this.ground = createBox(this.world, x, y, w, h, true)
		},
		
		createBall : function(id, x, y, r){
			this.objects[id] = createBall(this.world, x, y, r, id)
		},
		
		createBox : function(id, x, y, w, h, fixed){
			this.objects[id] = createBox(this.world, x, y, w, h, fixed, id)
		},
		
		applyForce : function(id, fx, fy, dx, dy){
			var obj = this.objects[id]
			dx = dx || 0
			dy = dy || 0
			obj.ApplyForce(new b2Vec2(fx, fy), new b2Vec2(obj.m_position.x + dx, obj.m_position.y + dy))
		},
		
		step : function(delay){
			this.world.Step(delay, 1)
			if(this.inWorker){
				self.postMessage(['setState', [this.update()]])
			}else{
				this.update();
			}
		},
		
		eval : function(text){
			eval(text)
		},
		
		update : function(){
			var state = {}
			for(var id in this.objects){
				state[id] = {}
				state[id].x = this.objects[id].m_position.x
				state[id].y = this.objects[id].m_position.y
				state[id].rotation = this.objects[id].m_rotation
			}
			this.state = state
			return this.state
		},
		getState : function(){
			return this.state
		},
		
		processMessage : function(event){
			var method = event.data[0]
			var args = event.data[1]
			if(args.constructor == Array){
				this[method].apply(this, args)
			}else{
				this[method].call(this, args)
			}
		}
	})
}