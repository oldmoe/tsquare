var TsquareScene = Class.create(Scene,{
    
    handlers: null,
    skyline: null,
    currentSpeed : 0,
    speeds : [
      {state :'crowd_member_animation_normal' , value : 0 ,energy : 0},
      {state :'crowd_member_animation_walk' , value : 3 ,energy : 1},
      {state :'crowd_member_animation_jog' ,  value : 10,energy : 10},
      {state :'crowd_member_animation_run' ,  value : 15,energy : 20}
    ],
    speedIndex : 0,
    direction : 1,
    holdPowerDepression: 0.2,
    energy : {current:0, rate: 3,max:30},
    view: {width: 950, height: 460, xPos: 0, tileWidth: 500, laneMiddle : 25},
    activeLane: 1,
    win : false,
    scoreCalculator: null,
    
    initialize: function($super){
        $super();
        this.scoreCalculator = new ScoreCalculator(this);
        this.createRenderLoop('skyline',1);
        this.createRenderLoop('characters',2);
        this.physicsHandler = new PhysicsHandler(this);
        this.movementManager = new MovementManager(this);
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
        
        var self = this;
        this.observe("start", function(){self.scoreCalculator.start();})
        this.observe("end", function(){self.scoreCalculator.end();})
        this.observe('wrongMove',function(){self.wrongMove()})
        this.observe('correctMove',function(){self.correctMove()})
        this.observe('wrongCommand',function(){self.wrongCommand()})
        this.observe('correctCommand',function(){self.correctCommand()})
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
    
    observe: function(event, callback, scope){
        this.reactor.observe(event, callback, scope);
    },
    
    fire: function(event){
        this.reactor.fire(event);
    },

    wrongMove: function(){
      this.scoreCalculator.wrongMovesCount++;
      this.scoreCalculator.totalMovesCount++;
      this.decreaseEnergy();
      // console.log("scene wrong move");
    },

    correctMove: function(){
      this.scoreCalculator.correctMovesCount++;
      this.scoreCalculator.totalMovesCount++;
      this.increaseEnergy();
      console.log("scene correct moved");
    },
    
    wrongCommand: function(){
      this.scoreCalculator.correctCommandsCount++;
      this.scoreCalculator.totalCommandsCount++;
      console.log("scene wrong command");
    },

    correctCommand: function(){
      this.scoreCalculator.correctCommandsCount++;
      this.scoreCalculator.totalCommandsCount++;
      console.log("scene correct command");
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
//  this.reactor.stop()
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
    this.audioManager.levelUp()
    if(this.energy.current < this.energy.max)this.energy.current+= this.energy.rate
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
      this.audioManager.levelDown()
      this.energy.current= Math.max(this.energy.current-this.energy.rate, 0)
      if(this.speedIndex >0 && this.energy.current < this.speeds[this.speedIndex].energy){
          this.speedIndex--
          this.currentSpeed = this.speeds[this.speedIndex].value
          this.fire(this.speeds[this.speedIndex].state)
      } 
   }
  
});
