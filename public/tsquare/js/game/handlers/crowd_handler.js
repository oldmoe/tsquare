var CrowdHandler = Class.create(UnitHandler, {

   type : "left",   
   initialPositions : null,
   crowdMembersPerColumn : 2,
   marchingStates: ["normal", "walk", "jog", "run", "sprint"],//display
   commands: ["circle", "hold", "march", "retreat"],
   currentId : 0,
   
   initialize: function($super,scene){
       this.initialPositions = [{x:250,y:30},{x:250,y:110},{x:250,y:200}]
       $super(scene)
       this.addCommandObservers();
       this.addMarchingStates();
       var self = this;
       this.scene.observe("increaseFollowers", function(num){self.increaseFollowers(num)});
       this.scene.observe("decreaseFollowers", function(num){self.decreaseFollowers(num)});
       
       this.hetafVolume = 15;
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
        this.pushMove()
        this.scene.direction = 0
      }
      else 
        $super()
    },
    
    getUserCrowds : function(){
       this.userCrowds = []
       var userCrowds = userData['crowd_members']
       for(var crowdType in userCrowds){
           for(var crowd in userCrowds[crowdType]){
               var crowdMember = userCrowds[crowdType][crowd]
               var level = crowdMember.level
               var category = gameData.crowd_members.category[crowdType]['type'];
               if(category == "special" || category == "limited_edition") category = crowdType
               var specs = gameData.crowd_members.specs[category][level]
               this.addCrowdMember(crowdType,specs)
           }
       } 
    },
    start : function(){
      this.getUserCrowds();  
    },
    
   addCrowdMember : function(name, specs){
     var klassName = name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(specs,{handler : this, scene:this.scene, id : this.currentId++})
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     this.objects[this.scene.activeLane].push(obj)
     if (!obj.noDisplay) {
       this.scene.pushToRenderLoop('characters', objDisplay)
     }
     return obj
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
          
        this.scene.fire("correctCommand");
        this.executeCommand("hold", {holdingLevel: holdingLevel});
        this.scene.currentCommand = 3;
     }else{
       this.scene.energy.current -= this.scene.energy.rate;
       this.scene.fire("wrongCommand");
     }
     
   },

   march: function(){
     this.scene.direction = 1
     if(this.target && this.target.chargeTolerance <= 0) this.target = null
     this.scene.fire("correctCommand");
     this.scene.currentCommand = 1;
     if (!this.target) {
       return this.executeCommand("march");
     }
     this.pushing = true
     this.pushMove()
   },
   
   retreat: function(){
     this.scene.direction = -1
     this.scene.fire("correctCommand");
     this.executeCommand("retreat");
     this.scene.currentCommand = 4;
   },

   circle: function(){
     if((this.target == null) || (this.target && this.target.chargeTolerance > 0)){
       this.scene.fire("worngCommand");
       return
     } 
     this.scene.fire("correctCommand");
     this.executeCommand("circle");
     this.scene.currentCommand = 2;
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
   	var increased = false;
   	for(var i=0;i<this.objects[this.scene.activeLane].length;i++){
   		if(this.objects[this.scene.activeLane][i]) 
   			if(this.objects[this.scene.activeLane][i].increaseFollowers(num)) {increased = true; break;}
   	} 
	   if(increased && this.hetafVolume < 30) this.hetafVolume += 5;    
   },

   decreaseFollowers: function(num){
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
      this.pushing = false
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
      if(j == closestIndex && ret == true && 
      true//this.objects[this.target.lane][j].pushDirection == this.objects[this.target.lane][j].pushDirections.forward
      ){
        reverseDirection = true
      }
    }
    if (reverseDirection) {
      this.target.takePush()
      for (var j = 0; j < this.objects[this.target.lane].length; j++) {
        this.objects[this.target.lane][j].reversePushDirection()
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
     this.scene.end(false)
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
   }
     
});
