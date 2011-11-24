var TsquareScene = Class.create(Scene,{
    
    handlers: null,
    skyline: null,
    currentSpeed : 0,
    speeds : [//the following states for the crowd members
      {state :'normal' , value : 0 ,energy : 0, followers: 1},
      {state :'walk' , value : 3, energy : 25, followers: 1},
      {state :'jog' ,  value : 10 ,energy : 50, followers: 1},
      {state :'run' ,  value : 25 ,energy : 75, followers: 1},
      {state :'sprint' ,  value : 50 ,energy : 100, followers: 1}
    ],
    currentCommand: 0,
    speedIndex : 0,
    direction : 1,
    holdPowerDepression: 0.2,
    energy : null,
    view: {width: 950, height: 460, xPos: 0, tileWidth: 500, laneMiddle : 25, length:0},
    activeLane: 1,
    win : false,
    comboMistakes : {current : 0, max : 2},
    scoreCalculator: null,
    collision: false,
    targetSpeedIndex: 0,
    targetEnergy: 0,
    flashingHandler: null,
    
    initialize: function($super){
        $super();
        this.collision = false;
        this.scoreCalculator = new ScoreCalculator(this);
        this.createRenderLoop('skyline',1);
        this.createRenderLoop('characters',2);
        this.createRenderLoop('meters',3);
        this.physicsHandler = new PhysicsHandler(this);
        this.handlers = {
            // "rescue" : new RescueUnitHandler(this),
            "crowd" : new CrowdHandler(this),
            "protection_unit" : new ProtectionUnitHandler(this),  
            "enemy" : new EnemyHandler(this),  
            "npc" : new NPCHandler(this),
            "clash_enemy" : new ClashEnemyHandler(this)
        };  
        this.view.xPos = 0
        this.initCounter = 3
        this.energy =  {current:0, rate: 10, max:100}
        this.comboMistakes = {current : 0, max : 2}
        
        Effect.Queues.create('global', this.reactor)
        
        this.audioManager = new AudioManager(this.reactor);
        this.flashingHandler = new FlashingHandler(this);
        this.movementManager = new MovementManager(this);
        
        this.data = missionData.data;
        this.noOfLanes = this.data.length;
        this.view.length = this.view.width;
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].length > 0) {
            this.view.length = Math.max(this.view.length, this.data[i][this.data[i].length - 1].x * this.view.tileWidth + this.view.width)
          }
        }
        var mapping = {'crowd':'npc', 'protection':'protection_unit',
         'enemy':'enemy', 'rescue':'rescue', 'clash_enemy':'clash_enemy'}

        for(var i =0;i<this.data.length;i++){
            for(var j=0;j<this.data[i].length;j++){
                var elem = this.data[i][j]
                if(this.handlers[mapping[elem.category]])
                    this.handlers[mapping[elem.category]].add(elem);
            }
        }
        var self = this;
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

       this.reactor.pushEvery(0,this.reactor.everySeconds(1),this.doInit,this)
    },
    
    doInit : function(){
      // take action
      $('initCounter').show()
      $('initCounter').update("");
      $('initCounter').appendChild(Loader.images.countDown[this.initCounter+".png"]);
      Effect.Puff('initCounter')
      this.initCounter--
      if (this.initCounter == 0) {
        this.reactor.push(this.reactor.everySeconds(1), function(){
          $('initCounter').show()
          $('initCounter').update("");
          $('initCounter').appendChild(Loader.images.countDown["go.png"]);
          Effect.Puff('initCounter', {transition: Effect.Transitions.sinoidal})

          this.audioManager = new AudioManager(this.reactor);
          this.clashDirectionsGenerator = new ClashDirectionsGenerator(this)
          this.push(this.clashDirectionsGenerator)
          this.movementManager = new MovementManager(this);
          this.audioManager.run()
          this.flashingHandler.run();
          this.handlers.crowd.playHetafLoop();
          var self = this;
          this.reactor.pushEvery(0,10, function(){return self.updateSpeed()})
                    
        }, this)
        return false
      }
    },
        
    observe: function(event, callback, scope){
        this.reactor.observe(event, callback, scope);
    },
    
    fire: function(event, params){
        this.reactor.fire(event, params);
    },

    wrongMove: function(){
     if (this.movementManager.currentMode == this.movementManager.modes.normal) {
       this.decreaseEnergy();
     }
    },

    correctMove: function(){
     if (this.movementManager.currentMode == this.movementManager.modes.normal) {
      this.increaseEnergy();
     }
    },
    
    wrongCommand: function(){
//      console.log("scene wrong command");
    },
    
    correctCommand: function(){
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
    var self = this;
    var afterMarchCallback = function(){
      self.fire('animationEnd');
      self.reactor.stop();
      self.audioManager.stop();
    }
    if (this.handlers.crowd.ended || (this.handlers.enemy.ended && this.handlers.protection_unit.ended
     && this.view.xPos > this.view.length && this.handlers.clash_enemy.ended)) {
      if(!this.stopped)
      {
        this.stopped = true;
        this.win = win;
        this.finish(afterMarchCallback);
        self.fire('end', [{
          score: self.scoreCalculator.score,
          objectives: self.scoreCalculator.getObjectivesRatio(),
          combos: self.scoreCalculator.getCombos(),
          win: self.win
        }]);
      }
    }
    //send to the server
  },
  finish : function(callback){
    this.fire(this.speeds[this.lastSpeedIndex].state)
    this.handlers.crowd.marchOut(callback);
  },
  addObject : function(objHash){
     var klassName = objHash.name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(this,objHash.x - this.view.xPos,objHash.lane,objHash.options)
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     if (!obj.noDisplay) {
       this.pushToRenderLoop('characters', objDisplay)
     }
     return obj
  },
  
  tickObjects : function(objects){
        var remainingObjects = []
        var self = this
        objects.each(function(object){
            if(!object.finished){
                object.tick()
                remainingObjects.push(object)
            }
        })
        objects = remainingObjects
        return this
  },
  
  detectCollisions : function(){
    this.collision = false;
     var pairs = [['left','right'],['left','middle'],['middle','right']]  
     for(var h1 in this.handlers){
       for (var h2 in this.handlers) {
           var handler1 = this.handlers[h1]; 
           var handler2 = this.handlers[h2]; 
          for(var i=0;i<pairs.length;i++){
           if(handler1.type==pairs[i][0] && handler2.type==pairs[i][1]){
             var res = handler1.detectCollisions(handler2.objects);
             this.collision = this.collision || res;
           }
         } 
       }
     } 
  },
  
  handleCollision : function(collision){
      this.direction = 0;
  },
    
  increaseEnergy : function(){
    if (this.movementManager.currentMode != this.movementManager.modes.normal) {
      this.direction = 0
    } 
    if(this.speedIndex != 0)
      this.lastSpeedIndex = this.speedIndex;
    if(this.stopped) return;
    this.audioManager.levelUp()
    this.fire("increaseFollowers",  [this.speeds[this.speedIndex].followers])
    this.targetEnergy = Math.min(this.targetEnergy + this.energy.rate, this.energy.max);
    if(this.speedIndex < (this.speeds.length-1) && this.targetEnergy > this.speeds[this.speedIndex].energy){
      this.targetSpeedIndex = this.speedIndex+1;
      if(this.targetSpeedIndex == 1){
        this.speedIndex = 1;
        this.targetEnergy = this.speeds[this.speedIndex].energy;
        this.currentSpeed = this.speeds[this.speedIndex].value;
        this.fire(this.speeds[this.speedIndex].state);
      }        
    }        
   },
   
  decreaseEnergy : function(){
    if(this.movementManager.currentMode != this.movementManager.modes.normal){
      this.direction = 0
    }
    if(this.speedIndex != 0)
      this.lastSpeedIndex = this.speedIndex;
    if(this.stopped) return;
     if (++this.comboMistakes.current == this.comboMistakes.max) {
        this.comboMistakes.current = 0
        this.audioManager.levelDown()
        this.targetEnergy = Math.max(this.targetEnergy - this.energy.rate, 0);
        this.fire("decreaseFollowers", [this.speeds[this.speedIndex].followers])
        if (this.speedIndex > 0 && this.targetEnergy < this.speeds[this.speedIndex].energy) {
            this.targetSpeedIndex = this.speedIndex-1;
            if(this.targetSpeedIndex == 0){
              this.speedIndex = 0;
              this.targetEnergy = this.speeds[this.speedIndex].energy;
              this.currentSpeed = this.speeds[this.speedIndex].value;
              this.fire(this.speeds[this.speedIndex].state);
            }
        }
      } 
   },

   updateSpeed: function(){
      // console.log(this.energy.current, this.targetEnergy)
      
      if(this.targetEnergy - this.energy.current > 1){
        this.energy.current += 2;
      }else if (this.targetEnergy - this.energy.current < -1){
        if(this.energy.current > 0)this.energy.current -= 2;        
      }
      
     if(this.speedIndex == this.targetSpeedIndex) return;
     
     for (var i=0; i < this.speeds.length; i++) {
        if(Math.abs(this.currentSpeed - this.speeds[i].value) < 1 && this.speedIndex != i){
          this.speedIndex = i
          this.fire(this.speeds[i].state)
          break;
        }
     }
      
      if(this.speedIndex < this.targetSpeedIndex){ 
        if(this.speeds[this.targetSpeedIndex].value > this.currentSpeed)this.currentSpeed += 1;
      }else if(this.speedIndex > this.targetSpeedIndex){
        if(this.currentSpeed > 0)this.currentSpeed -= 1;
      }else{
        // if(this.targetEnergy < this.energy.current){
          // if(this.energy.current > 0)this.energy.current -= 2;
        // }else if(this.targetEnergy > this.energy.current){
          // if(this.energy.max > this.energy.current)this.energy.current += 2;
        // }
      }
   }
  
});
