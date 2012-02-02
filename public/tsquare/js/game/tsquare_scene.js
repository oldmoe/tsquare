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
    currentTile: 1,
    speedIndex : 0,
    lastSpeedIndex : 0,
    direction : 1,
    holdPowerDepression: 0.2,
    energy : null,
    view: {width: 950, height: 460, xPos: 0, tileWidth: 400, laneMiddle : 30, length:0},
    activeLane: 1,
    win : false,
    comboMistakes : {current : 0, max : 2},
    scoreCalculator: null,
    collision: false,
    targetSpeedIndex: 0,
    targetEnergy: 0,
    flashingHandler: null,
    speedFactor : 1,
    cinematicView: false,
    initialize: function($super, game){
        $super();
        this.game = game;
        this.collision = false;
        this.scoreCalculator = new ScoreCalculator(this);
        this.createRenderLoop('skyline',1);
        this.createRenderLoop('characters',2);
        this.createRenderLoop('meters',3);
        
        this.physicsHandler = new PhysicsHandler(this);
        this.handlers = {
            "rescue" : new RescueUnitHandler(this),
            "crowd" : new CrowdHandler(this),
            "protection_unit" : new ProtectionUnitHandler(this),  
            "enemy" : new EnemyHandler(this),  
            "npc" : new NPCHandler(this),
            "clash_enemy" : new ClashEnemyHandler(this),
            "message" : new MessagesHandler(this),
            "powerups" : new PowerupsHandler(this)
        };  
        this.view.xPos = 0
        this.energy =  {current:0, rate: 10, max:100}
        this.comboMistakes = {current : 0, max : 2}
        this.speedFactors = []
        
        // Effect.Queues.create('global', this.reactor)
        if(missionData.followers === false) this.followersEnabled = false;
        else this.followersEnabled = true;
        this.data = missionData.data;
        
        this.data.push(
          {"name":"Health_boost","category":"powerup","type":"1","attribute":"health","effect":"20","index":0,"lane":0,"x":0,"order":0}
        );
        
        this.noOfLanes = this.data.length;
        this.view.length = this.view.width;
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].length > 0) {
          	var xi = this.data[i][this.data[i].length - 1].x;
            this.view.length = Math.max(this.view.length, xi * this.view.tileWidth + this.view.width)
          }
        }
        
        var mapping = {
         'crowd' : 'npc', 
         'protection' : 'protection_unit',
         'enemy' : 'enemy', 
         'rescue' : 'rescue', 
         'clash_enemy' : 'clash_enemy',
         'advisor' : 'message',
         'objectives' : 'rescue'
       }
       
       //This loop is for inserting the rescue ambulances before looping on the main loop
       for(var j=0;j<this.data[1].length;j++){
         var elem = this.data[1][j];
         if( elem.targetTile ){
           this.fire('incrementObjectivesCount');
           this.data[0].push({
               category : "protection",
               lane : 0,
               name : "ambulance",
               x : elem.targetTile,
               noenemy : true
             });
         }
       }
       for(var i =0;i<this.data.length;i++){
         for(var j=0;j<this.data[i].length;j++){
             var elem = this.data[i][j]
             if(this.handlers[mapping[elem.category]]){
               this.handlers[mapping[elem.category]].add(elem);
             }
         }
       }
        
        var self = this;
        this.observe('wrongMove', function(){self.wrongMove()})
        this.observe('correctMove', function(command){self.correctMove(command)})
        this.observe('togglePause', function(){self.togglePause()});
        this.observe('tileChanged', function(){self.tileChanged()});
        this.observe('startConversation', function(){self.enterCinematicView()});
        this.observe('endConversation', function(){self.exitCinematicView()});
    },
    
    start : function(){
  		this.init();
  		return this;
  	},
    
    init: function() {
      this.audioManager = new AudioManager(this);
      this.flashingHandler = new FlashingHandler(this);
      this.movementManager = new MovementManager(this);

      this.initCinematicView();
  	  this.skyLine = new SkyLine(this)
  	  for(var handler in this.handlers){
  	    this.handlers[handler].start()
  	  }

      var self = this;
	    self.reactor.run();
	    self.reactor.push(0, this._tick, this);
	    self.reactor.pause();
  	  self.fire("start");
      this.countDown(function(){
      	self._doInit();
      	self.reactor.resume();
      });
    },
    
    countDown: function(callback) {
      this.initCounter = 3;
      this._doCountDown(callback);
    },
    
    togglePause: function() {
    	if (this.cinematicView) return;
    	if (this.reactor.isRunning()) {
    		this.reactor.pause();
    	} else {
    		var self = this;
    		this.countDown(function(){self.reactor.resume();});
    	}
    },
    
    _doCountDown: function(callback) {
      $('initCounter').show();
      $('initCounter').update("");
      $('initCounter').appendChild(Loader.images.countDown[this.initCounter+".png"]);
      Effect.Puff('initCounter');
      this.initCounter--;
      var self = this;
      if (this.initCounter == 0) {
        setTimeout(function(){
          $('initCounter').show();
          $('initCounter').update("");
          $('initCounter').appendChild(Loader.images.countDown["go.png"]);
          Effect.Puff('initCounter', {transition: Effect.Transitions.sinoidal});
          if (callback) callback();
        }, 1000);
      } else {
        setTimeout(function(){self._doCountDown(callback);}, 1000);
      }
    },
    
    _doInit : function() {
      this.clashDirectionsGenerator = new ClashDirectionsGenerator(this)
      this.push(this.clashDirectionsGenerator)
      this.audioManager.run();
      this.movementManager.run();
      this.flashingHandler.run();
      this.handlers.crowd.playHetafLoop();
      this.comboDisplay = new ComboDisplay(this);
      this.pushToRenderLoop('characters', this.comboDisplay)
      var self = this;
      this.reactor.pushEvery(0,10, function(){return self.updateSpeed()})
    },
    
    applySpeedFactor : function(factor){
       this.currentSpeed*=factor
       this.speedFactor*= factor
    },
    
    cancelSpeedFactor : function(factor){
      this.currentSpeed/=factor
      this.speedFactor/= factor
    },
        
    observe: function(event, callback, scope){
        this.reactor.observe(event, callback, scope);
    },
    
    fire: function(event, params){
        this.reactor.fire(event, params);
    },

    wrongMove: function(){
      this.decreaseEnergy();
    },
    
    correctMove: function(command){
      if (command == this.game.guidingIcon.currentCommand || command == "retreat") {
        this.increaseEnergy();
      }
    },
    
    tick: function($super){
      $super()
      this.detectCollisions();
      this.view.xPos = Math.max(this.currentSpeed * this.direction + this.view.xPos, 0); 
      var tile = Math.ceil( (this.view.xPos + this.view.tileWidth/4) / this.view.tileWidth );
      if( tile != this.currentTile ){
        this.currentTile = tile;
        this.fire("tileChanged");
      }
      for(var handler in this.handlers){
          this.handlers[handler].tick();
      }
      
      if(!this.stopped)this.end();
    },

    end : function(){
      var self = this;
      var afterMarchCallback = function(){
        self.fire('animationEnd');
        self.reactor.stop();
        self.audioManager.stop();
      }
      
      if (this.handlers.crowd.ended 
          || this.scoreCalculator.gameTime < 0
          || (this.handlers.enemy.ended && this.handlers.protection_unit.ended && this.handlers.clash_enemy.ended && this.view.xPos > this.view.length)) {
            
        this.stopped = true;
        
        var scoreData = {};
        var failingScoreData = {
            score: 0,
            objectives: this.scoreCalculator.getObjectivesRatio().toFixed(2),
            combos: this.scoreCalculator.getCombos(),
            win: false,
            superTime: 0,
            stars: 0
          };
        
        if(this.handlers.crowd.ended || this.scoreCalculator.gameTime < 0 ){
          scoreData = failingScoreData;
        }else{
          var superTime = false;
          if(this.scoreCalculator.gameTime > this.scoreCalculator.superTime) superTime = true;
          
          this.fire('correctObjective'); //Ending the mission alive is a correct objective
          
          if( this.scoreCalculator.getObjectivesRatio() < 0.3 ){
            scoreData = failingScoreData;
          } else {
            scoreData = {
              score: this.scoreCalculator.score,
              objectives: this.scoreCalculator.getObjectivesRatio().toFixed(2),
              combos: this.scoreCalculator.getCombos(),
              win: true,
              superTime: superTime,
              stars: 0
            };
          }
          
          if (scoreData.win) scoreData.stars += 1;
          if (this.scoreCalculator.getObjectivesRatio() == 1)scoreData.stars += 1;
          if (scoreData.superTime) scoreData.stars += 1;
        }
        
        this.fire('end', [scoreData]);
        
        if (this.handlers.crowd.ended) {
          afterMarchCallback();
        }else{
          this.finish(afterMarchCallback);
        }
        
      }
    },
    
    finish : function(callback){
      this.fire(this.speeds[this.lastSpeedIndex].state)
      this.handlers.crowd.marchOut(callback);
    },
    
    addObject : function(objHash){
       var klassName = objHash.name.formClassName()
       var klass = eval(klassName)
       var obj = new klass(this,objHash.x - this.view.xPos,objHash.lane,objHash.options);
       //The following name, tile and mission are used for escorting/retrieving a crowd member
       obj.name = objHash.name;
       obj.targetTile = objHash.targetTile;
       obj.helpMessage = objHash.helpMessage;
       obj.companyMessage = objHash.companyMessage;
       obj.leaveMessage = objHash.leaveMessage;
       obj.mission = objHash.mission;
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
       var pairs = [['left','right'],['left','middle'],['middle1','right1']]  
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
      var speedDelta = Math.round(20 / this.handlers.crowd.objects[this.activeLane].length)
      if(this.targetEnergy - this.energy.current > 0){
        this.energy.current += speedDelta;
      }else if (this.targetEnergy - this.energy.current < 0){
        if(this.energy.current > 0)this.energy.current -= speedDelta;
        if(this.energy.current < 0)this.energy.current = 0;        
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
   },
   
   tileChanged : function(){
     var self = this;
     if( this.rescuing && !this.rescuing.rescued && this.rescuing.targetTile == this.currentTile){
       this.rescuing.rescued = true;
       this.fire("correctObjective");
       this.rescuing.messageBubble.destroy();
       if( this.rescuing.mission == "retrieve" ){
         this.rescuing.fire("back");
       }
       this.handlers.crowd.removeObject( this.rescuing, this.rescuing.lane );
       this.push( this.rescuing );
     }
   },

   // Cinematic view for conversation mode e.g. advisors.
   initCinematicView : function() {
   	 this.cinematicView = false;
   	 $('topScope').style.top = "-80px";
   	 $('bottomScope').style.top = "615px";
   },
   enterCinematicView : function() {
   	 this.cinematicView = true;
     this.reactor.pause();
     new Effect.Move('topScope', {y:89});
     new Effect.Move('bottomScope', {y:-86});
   },
   exitCinematicView : function() {
   	 this.cinematicView = false;
     this.movementManager.reset();
     new Effect.Move('topScope', {y:-89});
     new Effect.Move('bottomScope', {y:86});
     this.reactor.resume();
   }  
});
