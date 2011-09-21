var TsquareScene = Class.create(Scene,{
    
    handlers: null,
    skyline: null,
    currentSpeed : 0,
    
    speeds : [
      {state :'normal' , value : 0 ,energy : 0},
      {state :'walk' , value : 3 ,energy : 1},
      {state :'jog' ,  value : 10,energy : 10},
      {state :'run' ,  value : 15,energy : 20}
    ],
    speedIndex : 0,
    direction : 1,
    holdPowerDepression: 0.2,
    energy : {current:0, rate: 3,max:30},
    view: {width: 950, height: 460, xPos: 0, tileWidth: 500, laneMiddle : 25},
    observer: null,
    activeLane: 1,
    win : false,
    commands : ["circle","march","wrongHold","rightHold","retreat"],
    
    initialize: function($super){
        $super();
        this.observer = new Observer();
        
        this.createRenderLoop('skyline',1);
        this.createRenderLoop('characters',2);
        this.physicsHandler = new PhysicsHandler(this)
        this.movementManager = new MovementManager(this)
        this.addMovementObservers()
        this.handlers = {
            "crowd" : new CrowdHandler(this),
            "protection_unit" : new ProtectionUnitHandler(this),  
            "enemy" : new EnemyHandler(this)  
        };  
        this.data = missionData.data;
        this.noOfLanes = this.data.length;
        for(var i =0;i<this.data.length;i++){
            for(var j=0;j<this.data[i].length;j++){
                var elem = this.data[i][j]
                if(this.handlers[elem.category])
                    this.handlers[elem.category].add(elem);
            }
        }
    },
    
    init: function(){
        this.skyLine = new SkyLine(this)
        for(var handler in this.handlers){
            this.handlers[handler].start()
        }
        this.audioManager = new AudioManager(this.reactor)
        this.audioManager.run()
        //this.physicsHandler.step()
    },
    
    observe: function(event, callback){
        this.observer.addObserver(event, callback);
    },
    
    fire: function(event){
        this.observer.fire(event);
    },
    
    addMovementObservers : function(){
        var self = this
        this.observe('wrongMove',function(){self.decreaseEnergy()})
        this.observe('comboSuccess',function(){self.increaseEnergy()})
        var addMovementObserver = function(command){
            self.observe(command,function(){                
                self[command]()
            })
        }
        for(var i=0;i<this.commands.length;i++){
            addMovementObserver(this.commands[i])   
        }
    },
    
    march : function(){
      console.log('marching')  
      this.direction = 1  
    },
    
    retreat : function(){
      this.direction = -1  
    },
    
    circle: function(){
    },

    wrongHold: function(){
        this.energy.current -= this.energy.rate;
    },

    rightHold: function(){
        console.log("scene right hold");
    },
    
    tick: function($super){
        $super()
        this.detectCollisions();
        this.view.xPos += this.currentSpeed* this.direction
        for(var handler in this.handlers){
            this.handlers[handler].tick();
        }
    },
  end : function(win){
//    this.reactor.stop()
    this.win = win
    this.fire('end')
    //send to the server
  },
  addObject : function(objHash){
     var klassName = objHash.name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(this,objHash.x * this.view.tileWidth - this.view.xPos,objHash.lane,objHash.options)
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     if (!obj.noDisplay) {
       this.pushToRenderLoop('characters', objDisplay)
     }
     return obj
  },
  
  tickObjects : function(objects){
    try{
            var remainingObjects = []
            var self = this
            objects.each(function(object){
                if(!object.finished){
                    object.tick()
                    remainingObjects.push(object)
                }
            })
            objects = remainingObjects
        }catch(x){//console.log(x)
            alert(x)
        }
        return this
  },
  
  detectCollisions : function(){
   var pairs = [['left','right'],['left','middle'],['middle','right']]  
   for(var h1 in this.handlers){
     for (var h2 in this.handlers) {
         var handler1 = this.handlers[h1]; 
         var handler2 = this.handlers[h2]; 
        for(var i=0;i<pairs.length;i++){
         if(handler1.type==pairs[i][0] && handler2.type==pairs[i][1]){
           var collision = handler1.detectCollisions(handler2.objects)
         }
       } 
     }
   } 
  },
  
  handleCollision : function(collision){
      this.direction = 0;
  },
    
  increaseEnergy : function(){
    if(this.energy.current < this.energy.max)this.energy.current+= this.energy.rate
    console.log(this.energy)
    var next = this.speeds[this.speedIndex+1]
    if(next){
        if(this.energy.current>=next.energy){
            this.speedIndex++
            this.currentSpeed = this.speeds[this.speedIndex].value
            this.fire(next.state)
        } 
    }
   },
   
   decreaseEnergy : function(){
      this.energy.current= Math.max(this.energy.current-this.energy.rate, 0)
      if(this.speedIndex >0 && this.energy.current < this.speeds[this.speedIndex].energy){
          this.speedIndex--
          this.currentSpeed = this.speeds[this.speedIndex].value
          this.fire(this.speeds[this.speedIndex].state)
      } 
   }
  
});
