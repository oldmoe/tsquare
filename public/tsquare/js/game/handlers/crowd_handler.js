var CrowdHandler = Class.create(UnitHandler, {

   type : "left",   
   initialPositions : null,
   crowdMembersPerColumn : 2,
   marchingStates: ["normal", "walk", "jog", "run", "sprint"],//display
   commands: ["circle", "hold", "march", "retreat", "hit", "push"],
   currentId : 0,
   arrestedCrowds : null,
   
   initialize: function($super,scene){
       this.initialPositions = [{x:250,y:30},{x:250,y:80},{x:250,y:200}]
       $super(scene)
       this.arrestedCrowds = []
       this.addCommandObservers();
       this.addMarchingStates();
       var self = this;
       this.scene.observe("increaseFollowers", function(num){self.increaseFollowers(num)});
       this.scene.observe("decreaseFollowers", function(num){self.decreaseFollowers(num)});
       this.scene.observe("clashUnit", function(){self.crowdStepAhead()})
       this.scene.observe("clashWin", function(){self.crowdStepBack()})
       this.scene.observe("clashLose", function(){self.ArrestCrowd()})
       
       this.scene.observe("increaesHealth", function(effect){self.increaesHealth(effect)});
       this.scene.observe("increaesHydration", function(effect){self.increaesHydration(effect)});
       
       this.hetafVolume = 15;
   },
   
   increaesHydration: function(effect){
     for (var i=0; i < this.objects[1].length; i++) {
       this.objects[1][i].water += this.objects[1][i].water * effect/100 
     };
   },
   
   increaesHealth: function(effect){
     for (var i=0; i < this.objects[1].length; i++) {
       this.objects[1][i].hp += this.objects[1][i].hp * effect/100
     };
   },
      
   addMarchingStates: function(){
       var self = this
       this.marchingStates.each(function(event){
          self.scene.observe(event,function(){
           for(var i=0;i<self.objects.length;i++){
             for(var j=0;j<self.objects[i].length;j++){
                 if(self.objects[i][j])self.objects[i][j].fire(event);
             }
           }          
          }); 
       });
    },
          
    tick : function($super){
      if (this.pushing) {
        this.scene.direction = 0
        this.pushMove();
      }
      else 
        $super()
    },
    
    getUserCrowds : function(){
       this.userCrowds = []
       var userCrowds = userData['crowd_members'];
       var noOfCrowds = 0;
       for(var crowdType in userCrowds){
           for(var crowd in userCrowds[crowdType]){
               var crowdMember = userCrowds[crowdType][crowd]
               if( crowdMember.health >= 40 ){
                 var level = crowdMember.level
                 var category = gameData.crowd_members.category[crowdType]['type'];
                 if(category == "special" || category == "limited_edition") category = crowdType
                 if(category.indexOf("ultras")!=-1) category = "ultras";
                 var specs = gameData.crowd_members.specs[category][level]
                 this.addCrowdMember(crowdType,specs)
                 noOfCrowds++
               }
           }
       }
       //creating flag man
       var defaultSpecs = {attack:0,defense:0,hp:1,water:100};
       defaultSpecs.x = 250
       defaultSpecs.y = 1
       this.flagMan = this.addCrowdMember("flag_man",defaultSpecs);
       //flag man is removed from crowd handler objects and added as a general object because
       //its behavior is different 
       this.objects[this.scene.activeLane].remove(this.flagMan);
       this.scene.objects.push(this.flagMan);
       
    },
    
    start : function(){
      this.getUserCrowds();  
    },
    
   addCrowdMember : function(name, specs){
     var klassName = name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(specs,{
     	handler : this,
     	scene : this.scene,
     	id : this.currentId++,
     	laneIndex : this.objects[this.scene.activeLane].length,
     	name : name
     	})
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     this.objects[this.scene.activeLane].push(obj)
     if (!obj.noDisplay) {
       this.scene.pushToRenderLoop('characters', objDisplay)
     }
     return obj
   },
   
   calcPosition : function(lane, index){
     var i = Math.floor(index / 3);
     var j = index % 3;
     var pos = {x: 0, y: 0};
     pos.x = this.initialPositions[lane].x - 75 * i - 15 * j;
     pos.y = this.initialPositions[lane].y + 20 * j;
     return pos;
   },
   
   updateObjectsAfterDeath : function(crowdMember) {
   	 var lane = crowdMember.lane;
   	 var index = crowdMember.laneIndex;
     for (var i = 0; i < this.objects[lane].length; i++) {
       if (this.objects[lane][i].laneIndex > index) {
         this.objects[lane][i].laneIndex--;
         this.objects[lane][i].posChanged = true
       }
     }
   },

   addFollower : function(name, x, y, lane, crowd){
     var klassName = name.formClassName()
     var klass = eval(klassName)
     var obj = new klass({hp:1, water: 20}, {x:x, y:y, handler : this, scene: this.scene, crowd:crowd})
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     if (!obj.noDisplay) {
       this.scene.pushToRenderLoop('characters', objDisplay)
     }
     return obj
   },  

   getLargestXCrowd:function(lane){
     var maxX = 0
     var target = null
     for(var i=0;i<this.objects[lane].length;i++){
       if(this.objects[lane][i].coords.x > maxX){
         maxX = this.objects[lane][i].coords.x
         target = this.objects[lane][i] 
       }
     }
     return target
   },

   addCommandObservers : function(){
       var self = this
       this.commands.each(function(event){
          self.scene.observe(event,function(){self[event]()}); 
       });
   },
   
   //1 : march
   //2 : circle
   //3 : hold
   //4 : retreat
   //5 : hit
   //6 : push
   march: function(){
     this.scene.direction = 1
     this.scene.currentCommand = 1;
     return this.executeCommand("march");
   },
  
   push : function(){
     this.pushing = true
     this.pushMove()
   },
   
  circle: function(){
    this.executeCommand("circle");
    this.scene.currentCommand = 2;
  },
   
   hold: function(){
     var enemy = this.scene.handlers.enemy.objects[this.scene.activeLane][0]; 
     if( enemy && enemy.type == "charging_amn_markazy"){
       
        var averagePoint = {x: 0, y: 0};
        var count = 0;
        for(var i=0;i<this.objects.length;i++){
            for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
              if(this.objects[i][j]){
                count++;
                averagePoint.x += this.objects[i][j].coords.x;
                averagePoint.y += this.objects[i][j].coords.y; 
              }
            }
        }
        
        if(count > 0){
          averagePoint.x /= count;
          averagePoint.y /= count;
        }
  
        var distance = 0;
        var minDistance = 100000;
  
        for(var i=0;i<this.objects.length;i++){
            for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
              if(this.objects[i][j]){
                this.objects[i][j].moveToTarget({x:averagePoint.x+Math.random()*50, y:averagePoint.y});
                distance = Util.distance(enemy.coords.x,enemy.coords.y,this.objects[i][j].coords.x,this.objects[i][j].coords.y);
                if(distance < minDistance)
                  minDistance = distance;
              }
            }
        }
        
        var holdingLevel = 1;
        if(minDistance < enemy.getWidth()*2)
          holdingLevel = 2;
          
        this.executeCommand("hold", {holdingLevel: holdingLevel});
        this.scene.currentCommand = 3;
     }else{
       this.scene.energy.current -= this.scene.energy.rate;
     }
     
   },
   
  retreat: function(){
    this.scene.direction = -1
    this.executeCommand("retreat");
    this.scene.currentCommand = 4;
  },

  hit: function(){
    this.executeCommand("hit");
    this.scene.currentCommand = 5;
  },

	playHetafLoop : function(){
	 this.playHetaf()
	 this.scene.reactor.push(Math.random() * 100 + 50, this.playHetafLoop, this)
	},
	
  playHetaf : function(){
    var id = Math.round(Math.random()*15) + 1
    if(id <= 11)Loader.sounds['hetaf.130'][id+'.mp3'].play({volume : 0})
  },
   
  increaseFollowers: function(num){
    if(!this.scene.followersEnabled) return;
   	var increased = false;
   	for(var i=0;i<this.objects[this.scene.activeLane].length;i++){
   		if(this.objects[this.scene.activeLane][i]) 
   			if(this.objects[this.scene.activeLane][i].increaseFollowers(num)) {increased = true; break;}
   	} 
	   if(increased && this.hetafVolume < 30) this.hetafVolume += 5;    
  },

  decreaseFollowers: function(num){
    if(!this.scene.followersEnabled) return;
   	var decreased = false;
   	for(var i=0;i<this.objects[this.scene.activeLane].length;i++){
   		if(this.objects[this.scene.activeLane][i]) 
   			if(this.objects[this.scene.activeLane][i].decreaseFollowers(num)) {decreased = true; break;}
   	} 
   	if(decreased && this.hetafVolume > 10) this.hetafVolume -= 5;
  },
   
  pushMove : function(){
    if(!this.target || this.target.chargeTolerance <= 0){
      this.target = null
      return
    }
    var closestIndex = -1;
    var maxX = 0
    for (var j = 0; j < this.objects[this.target.lane].length; j++) {
      if(this.objects[this.target.lane][j].coords.x > maxX){
        closestIndex = j
        maxX = this.objects[this.target.lane][j].coords.x
      }
    }
    var reverseDirection = false
    for (var j = 0; j < this.objects[this.target.lane].length; j++) {
      var ret = this.objects[this.target.lane][j].pushMove(this.target)
      if(j == closestIndex && ret == true){
        reverseDirection = true;
        if (this.objects[this.target.lane][j].pushDirection == this.objects[this.target.lane][j].pushDirections.forward) {
        }
        else 
          if (this.objects[this.target.lane][j].pushDirection == this.objects[this.target.lane][j].pushDirections.backward) {
            this.pushing = false;
            this.target.takePush();
          }
      }
    }
    if (reverseDirection) {
      for (var j = 0; j < this.objects[this.target.lane].length; j++) {
        this.objects[this.target.lane][j].nextPushState();
      }
    }
  },
   
  executeCommand : function(event, options){
     for(var i=0;i<this.objects.length;i++){
       for(var j=0;j<this.objects[i].length;j++){
          this.objects[i][j][event](options);
       }
     }          
  },
 
  end : function(){
     this.ended = true
  },
       
  marchOut : function(callback){
    var self = this;
    this.finishedCrowds = 0;
    var noOfCrowds = 0;
    for(var i=0;i<this.objects.length;i++){
      noOfCrowds += this.objects[i].length;
      for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
        if(this.objects[i][j]){
          this.objects[i][j].endMove(function(){
            self.finishedCrowds++;
            if(self.finishedCrowds == noOfCrowds && callback) callback();
          });
        }
      }
    }
    this.flagMan.endMove(function(){})
  },

  detectCollisions : function($super,others){
    var res = $super(others); 
    if(res){
       this.scene.direction = 0
    }
    return res;
  }, 
   
  getCrowdsCount: function(){
    var count = 0;
    for(var i=0;i<this.objects.length;i++){
      for(var j=0;j<this.objects[i].length;j++){
        if(this.objects[i][j])count++;
      }
    }
    return count;
  },
  
  crowdStepAhead : function(){
    var moveSpeed = 4
    var self = this
    var crowd = this.objects[this.scene.activeLane][0] 
    var y = this.scene.view.laneMiddle*2*crowd.lane+this.scene.view.laneMiddle;
    var x = 150
    crowd.fire('walk')
    crowd.fixedPlace = false
    crowd.moveToTarget({x:x - 32,y: y + 18}, function(){
      self.scene.clashDirectionsGenerator.setCrowd(self.objects[self.scene.activeLane][0])
    },moveSpeed)
    this.moveCrowdsBack(1,moveSpeed);
  },
  
  moveCrowdsBack : function(startIndex,speed){
    var crowd = this.objects[this.scene.activeLane][startIndex]
    crowd.fixedPlace = false
    crowd.fire('walk')
    var self = this
    crowd.moveToTarget({x:-crowd.getWidth(), y:crowd.coords.y},function(){
      self.objects[this.scene.activeLane][startIndex].fire('normal')
      self.scene.fire('clashCrowdsBack')
    }, speed)
    for(var i = startIndex+1;i<this.objects[this.scene.activeLane].length;i++){
      var crowd = this.objects[this.scene.activeLane][i]
      crowd.fixedPlace = false
      crowd.fire('walk')
      this.setCrowdAfterMove(crowd,-crowd.getWidth(),crowd.coords.y,'normal', speed)
    }
  },
  
  setCrowdAfterMove : function(crowd,x,y,state, speed){
    crowd.moveToTarget({x:x,y:y}, function(){
      crowd.fire(state)
    }, speed)
  },
  
  crowdStepBack : function(){
    for (var i = 1; i < this.objects[this.scene.activeLane].length; i++) {
      this.objects[this.scene.activeLane][i].fixedPlace = true
    }
    var crowd = this.objects[this.scene.activeLane][0]
    crowd.fire('reverseWalk')
    crowd.stopClash()
    var self = this
    crowd.moveToTarget(crowd.originalPosition, function(){
      self.scene.fire('clashEnd')
      crowd.fire('normal')
      crowd.fixedPlace = true
    })
  },
  
  ArrestCrowd : function(){
    for (var i = 1; i < this.objects[this.scene.activeLane].length; i++) {
      this.objects[this.scene.activeLane][i].fixedPlace = true
    }
    this.scene.fire('clashEnd')
   },
   
  gatherTriangle : function(x){
    for (var i = 0; i < this.objects[this.scene.activeLane].length; i++) {
      this.objects[this.scene.activeLane][i].fixedPlace = false;
    }
    new CrowdAction(this.scene).gatherTriangle(this.objects[this.scene.activeLane], x, -1)
  },
  
  takeHit : function(power){
    for (var i = 0; i < this.objects[this.scene.activeLane].length; i++) {
      this.objects[this.scene.activeLane][i].takeHit(power)
    }
  }
});
