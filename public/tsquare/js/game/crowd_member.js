var CrowdMember = Class.create(Unit,{
  
  xShift : 100,
  water : 7000,
  maxWater : 700,
  specs : null,
  waterDecreaseRate : 0.3,
  commandFilters: [],
  rotationPoints : null,
  rotationSpeed : 35,
  rotating : false,
  holdingLevel: 0,
  pushing : false,
  pushDirections : {prepare:0, forward:1,backward:2},
  pushDirection : 0,
  maxPushDisplacement : 150,
  extraSpeed : 0,
  moved : 0,
  endPosition : 1050,
  fixedPlace : true,
  name : null,
  clashing : false,
  clash : {runningSpeed : 15, pushSpeed : 12, target : null},
  hitting : false,
  laneIndex: 0,
  posChanged: false,
  hitCounter: 0,
  pushSpeed : 5,
  pushPrepareSpeed : 3,
  fixedState : false,
  initialize : function($super,specs,options){
    $super(options.scene, 0, options.scene.activeLane, options)
    this.specs = specs;
    this.type = "crowd_member";
    this.rotationPoints = []
    this.followers = []
    this.name = options.name
    this.secondTicks = this.scene.reactor.everySeconds(1)
    var self = this
    this.hp = this.maxHp = specs.hp * 2
    this.water = this.maxWater =  specs.water
    this.attack = specs.attack || 0
    this.defense = specs.defense || 0 
    var crowdCommandFilters = [
        {command: function(){return self.clashing}, callback: function(){self.clashMove()}},
        {command: function(){return self.hitting}, callback: function(){self.hitMove()}},
        {command: function(){return self.rotating}, callback: function(){self.circleMove()}}
    ]
    this.commandFilters = crowdCommandFilters.concat(this.commandFilters);      
    this.init(options);
  },
  
  init: function(options){
  	this.laneIndex = options.laneIndex || 0
    if( this.specs.x && this.specs.y ){
      this.originalPosition = {x:this.specs.x, y:this.specs.y}
      this.coords.x = this.specs.x;
      this.coords.y = this.specs.y;
    } else {
      this.originalPosition = this.handler.calcPosition(this.lane, this.laneIndex)
      var randomDx = 0//Math.round(Math.random()*20)
      var randomDy = 0//Math.round(Math.random()*20)
      this.originalPosition.x += randomDx
      this.originalPosition.y += randomDy
      this.coords.x = this.originalPosition.x
      this.coords.y = this.originalPosition.y
    }
    if(options && options.level) 
      this.level = options.level
    else 
      this.level = 4
  },
  
  increaseFollowers : function(noOfFollowers){
    var remaining = this.level - (this.followers.length);
    if(remaining <= 0){
      return false;
    } 
    for(var i=0;i<noOfFollowers && i<remaining;i++){
      var x = this.handler.objects[this.lane][this.handler.objects[this.lane].length-1].originalPosition.x - parseInt(noOfFollowers* 150 * Math.random());
      var y = this.originalPosition.y + parseInt(70 * Math.random()) - 35;
      var follower = this.handler.addFollower("normal", x, y, this.lane, this);
      follower.fire(this.scene.speeds[this.scene.speedIndex].state);
      this.scene.push(follower);
      this.followers.push(follower);
    }
    return true;
  },
  
  decreaseFollowers: function(num){
  	if(this.followers.length == 0) return false;
    for (var i=0; i < num && i < this.followers.length; i++) {
      if(!this.followers[i].back)
        this.followers[i].die();
    }
    return true;
  },
  
  fire : function($super,event){
    if(this.fixedState)return;
    if (this.followers) {
      for (var i = 0; i < this.followers.length; i++) {
        if(!this.followers[i].back)
          this.followers[i].fire(event)
      }
    }
    $super(event)
  },
  
  tick : function($super){
    if(this.rescued){
      this.decreaseFollowers( this.followers.length );
      this.move( (-1 * this.scene.currentSpeed * this.scene.direction), -2);
      if( this.coords.y <= 0 ){
        this.destroy();
        this.scene.remove( this );
      }
      $super();
      return;
    }
    if(this.dead){
      this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);
      if(this.coords.x < 0) {
        this.scene.remove(this);
        this.destroy();
      }
      return;
    }
    $super()
    if(this.ending && this.coords.x >= this.endPosition)
    {
      if(this.followers)
      {
        for(var i=0;i<this.followers.length;i++){
          if(this.followers[i].coords.x <  this.endPosition){
            return;
          }
        }
      }
      if(this.endMoveCallback) this.endMoveCallback();
      return;
    }
    
    if(!this.movingToTarget && (Math.abs(this.coords.x - this.originalPosition.x) > 1 || Math.abs(this.coords.y - this.originalPosition.y) > 1)){
      if(this.fixedPlace && !this.handler.pushing){
          this.moveToTarget(this.originalPosition)
      }
    }
     
    this.stateChanged = true
    
    if(this.scene.reactor.ticks % this.secondTicks == 0) this.updateState();
    if(this.followers)this.checkFollowersState();
    
    if (this.posChanged) {
      this.posChanged = false;
      this.originalPosition = this.handler.calcPosition(this.lane, this.laneIndex);
    }
  },
 
  updateState: function(){
    if(this.scene.stopped) return;
    this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.die();   
  },
   
  checkFollowersState : function(move){
     for(var i=0;i<this.followers.length;i++){
        if(this.followers[i].hp <= 0){
          this.followers[i].die()
          this.followers.splice(i,1)
        }
      }
  },
 
  takeHit: function($super, power){
    var hitPower = power;
    if (this.followers && this.followers.length > 0) {
      this.followers[0].takeHit(hitPower)
    }
    else{
      //if(this.defense) hitPower-=this.defense
      $super(hitPower)
    } 
  },
  
  march : function(){
  },
  
  hold : function(options){
      this.holdingLevel = options.holdingLevel;
  },
  
  circle : function(){
      this.scene.direction = 0;
      if(this.target){
          this.rotating = true 
          this.addRotationPoints(this.target)
          this.fire(this.rotationPoints[0].state)
          for(var i=0; this.followers && i<this.followers.length; i++){
            if(!this.followers[i].back)
              this.followers[i].circle();
          }          
      }
  },
  
  hit : function(){
    this.hitting = true;
    this.hitCounter = 0;
    this.fire('hit')
    this.scene.direction = 0;
    for(var i=0; this.followers && i<this.followers.length; i++){
      if(!this.followers[i].back)
        this.followers[i].hit();
    } 
    this.fixedState = true;  // to disable animation change while hitting         
  },
  
  retreat : function(){
  },
  
  die : function($super){
    $super()
	  this.fire("normal");
	  this.dead = true;
	  this.handler.updateObjectsAfterDeath(this);
  },
  
  addRotationPoints : function(target){
    this.rotationPoints.push({
      values: {
        x: target.coords.x - this.getWidth() / 2 - target.getHeight()/4,
        y: target.coords.y + target.getHeight() / 2 - 20
      },
      state: "front"
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x + target.getWidth() - this.getWidth() / 2 - target.getHeight()/4,
        y: target.coords.y + target.getHeight() / 2 - 20
      },
      state : "run"
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x + target.getWidth() - this.getWidth() / 2,
        y: target.coords.y - 20
      },
      state : "back"
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x - this.getWidth() / 2,
        y: target.coords.y - 20
      },
      state : "reverseRun"
    })
    var difference = Math.abs(this.rotationPoints[0].values.x - this.rotationPoints[1].values.x)
    var minCircle = 200
    var extra  = (minCircle - difference)/2
    if(extra > 0){
      var multipliers = [-1 , 1, 1, -1]
      for(var i =0;i<this.rotationPoints.length;i++){
        this.rotationPoints[i].values.x +=extra * multipliers[i] 
      }
    }
  },
  
  pushMove : function(target){
    for(var i=0;i<this.followers.length;i++){
      if(!this.followers[i].back)
        this.followers[i].pushMove(target)
    }
    if(this.pushDirection == this.pushDirections.forward){
      return this.pushForward(target)
    }else if(this.pushDirection == this.pushDirections.backward){
      return this.pushBackward(target) 
    }else{
      return this.pushPrepare(target)
    }        
  },
  
  pushForward : function(target){
    if(this.moved==0)this.fire('run')
    displacement = this.pushSpeed +this.moved*0.3
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
     if(this.coords.x + this.getWidth()/2 > target.coords.x){
       return true
     }
  },
  
  pushBackward : function(target){
    if(this.moved==0)this.fire('walk')
    displacement = -1 *(this.pushSpeed + (this.maxPushDisplacement-this.moved)*0.1)
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
    if (this.moved > this.maxPushDisplacement - 60) {
      return true
    }
  },
  
  pushPrepare : function(){
    if (this.moved == 0) {
      this.fire('walk')
      this.moveBack = true
    }
    displacement = -1 *(this.pushPrepareSpeed + (this.maxPushDisplacement-this.moved)*0.1)
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
    if (this.moved > this.maxPushDisplacement) {
        this.moveBack = false
        return true
    }
  },
  
  nextPushState : function(){
    this.pushDirection = (this.pushDirection + 1) % 3 
    this.moved = 0
    for(var i=0;i<this.followers.length;i++){
      if(!this.followers[i].back)
        this.followers[i].nextPushState()
    }
  },
  
  circleMove : function(){
    if (!this.target|| this.target.hp <= 0 || this.target.dead || this.target.doneProtection || 
    this.target.unitType !="protectionUnit") {
      this.resetRotation();
      return
    }
    if (this.rotationPoints.length == 0) {
      this.fire(this.getMovingState());
      this.target.rotationComplete(this.attack);
      this.resetRotation();
      return
    }
    var rp = this.rotationPoints[0];
    var move = Util.getNextMove(this.coords.x,this.coords.y,rp.values.x,rp.values.y,this.rotationSpeed);
    this.move(move[0],move[1]);
    if (this.coords.x <= rp.values.x + 0.001 && this.coords.x >= rp.values.x - 0.001 &&
    this.coords.y <= rp.values.y + 0.001 &&this.coords.y >= rp.values.y - 0.001) {
        this.rotationPoints.shift()
        if (this.rotationPoints.length > 0) {
          this.fire(this.rotationPoints[0].state)
        }
    }
  },
  
  hitMove : function(){
    if ((this.target && (this.target.hp <= 0 || this.target.dead)) ||
    !this.scene.movementManager.beatMoving) {
      if(this.target && this.target.unitType == "enemy")this.target.rotationComplete(this.attack)
      this.fixedState = false;  // to enable animation change to crowds
      this.fire('idle');
      this.hitting = false;
    }
  },
  
  setTarget: function($super,target){
    if(target && target.chargeTolerance > 0 && this.target!=target){
        this.scene.direction = 0
    }
    $super(target)  
  },
  
  move: function($super, dx, dy){
    $super(dx,dy);
  },
  
  /* March out of the screen with the followers and then call callback after done */
  endMove : function(callback){
    this.ending = true;
    this.endMoveCallback = callback;
    this.moveToTarget({x:this.endPosition, y:this.coords.y});
    if (this.followers) {
      for (var i = 0; i < this.followers.length; i++) {
        if(!this.followers[i].back){
          this.followers[i].ending = true;
          this.followers[i].moveToTarget({x:this.endPosition, y:this.followers[i].coords.y});
        }
      }
    }
  },

  resetRotation : function(){
    this.rotationPoints = [];
    if( this.scene.rescuing && this.scene.rescuing.mission == "retrieve" ){
      this.fire( "retreat" );
    } else {
      this.fire( this.getMovingState() );
    }
    this.rotating = false;
  },
  
  getMovingState : function(){
    return this.scene.speeds[this.scene.speedIndex].state
  },
  
  getReverseState : function(){
    if(this.scene.running)return "reverseRun"
    return "reverse"
  },  
  hpRatio : function(){
    return this.hp/this.maxHp
  },
  waterRatio : function(){
    return this.water/ this.maxWater
  },
  startClash : function(target){
    this.clashing = true
    this.fire('run')
    this.clash.target = target
  },
  clashMove : function(){
    if (this.coords.x + this.getWidth()  - 35 < this.clash.target.coords.x) {
      this.move(this.clash.runningSpeed, 0)
    }
  },
  clashPush : function(){
    this.move(this.clash.pushSpeed,0)
    this.clash.target.move(this.clash.pushSpeed,0)
  },
  stopClash : function(){
    this.clashing = false
  }
})
  
