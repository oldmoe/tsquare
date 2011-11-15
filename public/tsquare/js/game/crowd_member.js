var CrowdMember = Class.create(Unit,{
  
  xShift : 100,
  water : 7000,
  maxWater : 700,
  randomDx : 0,
  randomDy : 0,
  waterDecreaseRate : 1,
  commandFilters: [],
  rotationPoints : null,
  rotationSpeed : 25,
  rotating : false,
  pushing : false,
  holdingLevel: 0,
  pushDirections : {forward:0,backward:1},
  pushDirection : 0,
  maxPushDisplacement : 100,
  extraSpeed : 0,
  moved : 0,
  endPosition : 1050,
  fixedPlace : true,
  name : null,
  clashing : false,
  initialize : function($super,specs,options){
    $super(options.scene, 0, options.scene.activeLane, options)
    this.type = "crowd_member";
    this.rotationPoints = []
    this.followers = []
    this.name = options.name
    this.secondTicks = this.scene.reactor.everySeconds(1)
    var self = this
    this.hp = this.maxHp = specs.hp
    this.water = this.maxWater =  specs.water
    this.water = this.maxWater = 100
    this.attack = specs.attack || 0
    this.defense = specs.defense || 0 
    var crowdCommandFilters = [
        {command: function(){return self.clashing}, callback: function(){self.clashMove()}},
        {command: function(){return self.rotating}, callback: function(){self.circleMove()}}
    ]
    this.commandFilters = crowdCommandFilters.concat(this.commandFilters)      
    this.init(options);
  },
  
  init: function(options){
    this.originalPosition = {x:0,y:0}
    this.originalPosition.y = this.handler.initialPositions[this.lane].y - this.handler.crowdMembersPerColumn * 10
    this.originalPosition.x = this.handler.initialPositions[this.lane].x + 30*this.handler.crowdMembersPerColumn
    this.coords.x = this.originalPosition.x
    this.coords.y = this.originalPosition.y
    this.handler.crowdMembersPerColumn-- 
    if(this.handler.crowdMembersPerColumn == -1){
      this.handler.crowdMembersPerColumn = 2
      this.handler.initialPositions[this.lane].x-=100
    }
    this.randomDx = Math.round(Math.random()*50)
    this.coords.x +=this.randomDx
    this.randomDy = Math.round(Math.random()*30)
    this.coords.y+= this.randomDy
    if(options && options.level) 
      this.level = options.level
    else 
      this.level = 4
  },
  
  increaseFollowers : function(noOfFollowers){
    var remaining = this.level - (this.followers.length);
    if(remaining <= 0){
      return;
    } 
    for(var i=0;i<noOfFollowers && i<remaining;i++){
      var x = this.handler.objects[this.lane][this.handler.objects[this.lane].length-1].originalPosition.x - parseInt(noOfFollowers* 150 * Math.random());
      var y = this.originalPosition.y + parseInt(70 * Math.random()) - 35;
      var follower = this.handler.addFollower("normal", x, y, this.lane, this);
      this.scene.push(follower);
      this.followers.push(follower);
    }
  },
  
  decreaseFollowers: function(num){
    for (var i=0; i < num && i < this.followers.length; i++) {
      if(!this.followers[i].back)
        this.followers[i].die();
    };
  },
  
  fire : function($super,event){
    if (this.followers) {
      for (var i = 0; i < this.followers.length; i++) {
        if(!this.followers[i].back)
          this.followers[i].fire(event)
      }
    }
    $super(event)
  },
  
  tick : function($super){
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
    if(this.fixedPlace && (!this.movingToTarget && (Math.abs(this.coords.x - this.originalPosition.x) > 1 || Math.abs(this.coords.y!=this.originalPosition.y) > 1))){
        this.moveToTarget(this.originalPosition)
    } 
     
    this.stateChanged = true
    
    if(this.scene.reactor.ticks % this.secondTicks == 0)this.updateState();
    
    if(this.followers)this.checkFollowersState();
  },

  updateState: function(){
    this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.dead = true;   
  },
   
  checkFollowersState : function(move){
     for(var i=0;i<this.followers.length;i++){
        if(this.followers[i].hp <= 0){
          this.followers[i].destroy()
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
      if(this.defense) hitPower-=this.defense
      $super(hitPower)
    } 
  },
  
  circle : function(){
      if(this.target){
          this.currentAction = "circle";
          this.rotating = true 
          this.addRotationPoints(this.target)
          this.fire(this.rotationPoints[0].state)
          for(var i=0; this.followers && i<this.followers.length; i++){
            if(!this.followers[i].back)
              this.followers[i].circle();
          }          
      }else{
      }
  },
  
  retreat : function(){
      this.currentAction = "retreat";
      
  },
  
  march : function(){
      this.currentAction = "march"
  },
  
  hold : function(options){
      this.currentAction = "hold"
      this.holdingLevel = options.holdingLevel;
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
    }else{
      return this.pushBackward(target)
    }        
  },
  
  pushForward : function(target){
    displacement = this.scene.currentSpeed +this.moved*0.2
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
     if(this.coords.x + this.getWidth()/2 > target.coords.x){
       return true
     }
  },
  
  pushBackward : function(target){
    displacement = -1 *(this.scene.currentSpeed + (this.maxPushDisplacement-this.moved)*0.2)
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
    if (this.moved > this.maxPushDisplacement) {
      return true
    }
  },
  
  reversePushDirection : function(){
    this.pushDirection = 1 - this.pushDirection
    this.moved = 0
    for(var i=0;i<this.followers.length;i++){
      if(!this.followers[i].back)
        this.followers[i].reversePushDirection()
    }
  },
  
  circleMove : function(){
    if (!this.target|| this.target.hp <= 0 || this.target.dead || this.target.doneProtection) {
      this.resetRotation()
      return
    }
    if (this.rotationPoints.length == 0) {
      this.fire(this.getMovingState())
      this.target.rotationComplete(this.attack)
      this.resetRotation()
      return
    }
    var rp = this.rotationPoints[0]
    var move = Util.getNextMove(this.coords.x,this.coords.y,rp.values.x,rp.values.y,this.rotationSpeed)
    this.move(move[0],move[1])
    if (this.coords.x <= rp.values.x + 0.001 && this.coords.x >= rp.values.x - 0.001 &&
    this.coords.y <= rp.values.y + 0.001 &&this.coords.y >= rp.values.y - 0.001) {
        this.rotationPoints.shift()
        if (this.rotationPoints.length > 0) {
          this.fire(this.rotationPoints[0].state)
        }
    }
  },
  
  setTarget: function($super,target){
    if(target && target.chargeTolerance > 0 && this.target!=target){
        this.scene.direction = 0
    }//else if(target == null && this.rotating)return  
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
    this.rotationPoints = []
    this.fire(this.scene.speeds[this.scene.speedIndex].state)
    this.rotating = false
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
  clash : {firstMove: true,runningSpeed : 15, pushSpeed : 12, target : null}
})
  
