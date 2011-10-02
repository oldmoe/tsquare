var CrowdMember = Class.create(Unit,{
  
  xShift : 100,
  water : 7000,
  maxWater : 700,
  randomDx : 0,
  randomDy : 0,
  waterDecreaseRate : 0.05,
  commandFilters: [],
  rotationPoints : null,
  rotationSpeed : 15,
  rotating : false,
  pushing : false,
  holdingLevel: 0,
  pushDirections : {forward:0,backward:1},
  pushDirection : 0,
  maxPushDisplacement : 100,
  extraSpeed : 0,
  moved : 0,
  
  name : null,
  initialize : function($super,specs,options){
    $super(options.scene, 0, options.scene.activeLane, options)
    this.type = "crowd_member";
    this.rotationPoints = []
    this.followers = []
    this.name = options.name
    var self = this
    this.hp = this.maxHp = specs.hp
    this.water = this.maxWater =  specs.water 
    this.attack = specs.attack || 0
    this.defense = specs.defense || 0 
    var crowdCommandFilters = [
        {command: function(){return self.rotating}, callback: function(){self.circleMove()}},
    ]
    this.commandFilters = crowdCommandFilters.concat(this.commandFilters)      
    this.init(options);
  },
  
  init: function(options){
    this.originalPosition = {x:0,y:0}
    this.originalPosition.y = this.handler.initialPositions[this.lane].y - this.handler.crowdMembersPerColumn * 10
    this.originalPosition.x = this.handler.initialPositions[this.lane].x + 15*this.handler.crowdMembersPerColumn
    this.coords.x = this.originalPosition.x
    this.coords.y = this.originalPosition.y
    this.handler.crowdMembersPerColumn-- 
    if(this.handler.crowdMembersPerColumn == -1){
      this.handler.crowdMembersPerColumn = 2
      this.handler.initialPositions[this.lane].x-=60
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
      console.log("reached maximum number of followers");
      return;
    } 
    for(var i=0;i<noOfFollowers && i<remaining;i++){
      var x = this.originalPosition.x - parseInt(noOfFollowers* 30 * Math.random())
      var y = this.originalPosition.y + parseInt(50 * Math.random()) - 40;
      var follower = this.handler.addFollower("normal", x, y, this.lane, this);
      this.scene.push(follower)
      this.followers.push(follower);
    }
  },
  
  decreaseFollowers: function(num){
    if(this.followers.length > 0){
      var deleted = this.followers.splice(0,num);
      deleted.each(function(elem){
        elem.destroy();
      })
    }
      
  },
  
  tick : function($super){
    $super()
    if(!this.movinngToTarget && Math.abs(this.coords.x - this.originalPosition.x) > 0.1 || Math.abs(this.coords.y!=this.originalPosition.y) >0.1){
        this.moveToTarget(this.originalPosition)
    }  
    this.stateChanged = true
    
    this.updateState();
    
    if(this.followers)this.checkFollowersState();
  },

  updateState: function(){
    this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.dead = true;   
  },
   
  checkFollowersState : function(move){
     for(var i=0;i<this.followers.length;i++){
        if(this.followers[i].hp <=0){
          this.followers[i].destroy()
          this.followers.splice(i,1)
        }
      }
  },
 
  takeHit: function($super, power){
        var hitPower = power;
//    if(this.currentAction == "hold"){
//      hitPower = hitPower * (1-this.scene.holdPowerDepression);
//      this.scene.energy.current += this.scene.energy.rate;
//    }else{
//      this.scene.energy.current -= this.scene.energy.rate;
//    }
        
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
          this.scene.fire("crowd_member_animation_"+this.rotationPoints[0].state)
          for(var i=0; this.followers && i<this.followers.length; i++){
            this.followers[i].circle();
          }          
      }else{
         console.log("invalid command"); 
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
      state : this.getMovingState()
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
      state : "reverse"
    })
  },
  
  pushMove : function(target){
    for(var i=0;i<this.followers.length;i++){
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
    for(var i=0;i<this.followers.length;i++){
      this.followers[i].reversePushDirection()
    }
  },
  
  circleMove : function(){
    if (!this.target|| this.target.hp <= 0 || this.target.dead || this.target.doneProtection) {
      this.resetRotation()
      return
    }
      if (this.rotationPoints.length == 0) {
        this.target.rotationComplete(this.attack)
        this.resetRotation()
        return
//        if (this.target.hp < 0) {
//          return
//        }else{
//          this.circle(this.target)
//        }
      }
      var rp = this.rotationPoints[0]
      var move = Util.getNextMove(this.coords.x,this.coords.y,rp.values.x,rp.values.y,this.rotationSpeed)
      this.move(move[0],move[1])
      if (this.coords.x <= rp.values.x + 0.001 && this.coords.x >= rp.values.x - 0.001 &&
      this.coords.y <= rp.values.y + 0.001 &&this.coords.y >= rp.values.y - 0.001) {
          this.rotationPoints.shift()
          if(this.rotationPoints.length > 0 ) this.scene.fire("crowd_member_animation_"+this.rotationPoints[0].state)
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
  
  resetRotation : function(){
    this.rotationPoints = []
    this.target = null
    this.rotating = false
    this.scene.fire("crowd_member_animation_"+"normal")
  },
  
  getMovingState : function(){
    if(this.scene.running)return "run"
    return "walk"
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
  }
})
  
