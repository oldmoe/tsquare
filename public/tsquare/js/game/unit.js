var Unit = Class.create(Observer,{
  
  x:0,y:0,
  speed : 1,
  angle :0,
  attack: 10,
  hp : 30,
  maxHp : 30,
  stateChanged : false,
  kickedoutYShift : 0,
  maxkickedoutYShift : 57,
  kickedOutXShift : false,
  dead : false,
  movingToTarget : false,
  movingSpeed : 8,
  defaultMovingSpeed : 8,
  noDisplay : false,
  target: null,
  handler: null,
  movingToTarget : false,
  targetPoint: null,
  type: null,
  neglected : false,
  scalable: true, // for specifying which object can be scalable
  moveToTargetCallback : null,
  initialize : function($super, scene,x,lane, options){
    $super();
    var self = this
    this.commandFilters = [
      {command: function(){return self.movingToTarget}, callback: function(){self.moveToTargetPoint()}}
    ];
    this.target = null
    this.scene = scene
    this.lane = lane
    if(options && options.type)this.type = options.type;
    if(options && options.noenemy)this.noenemy = options.noenemy;
    if(options && options.coords){
      this.coords = options.coords;
    }else{
      var y = 0;
      if(options && options.y) 
        y = options.y;
      else 
        y = this.scene.view.laneMiddle*2*this.lane+this.scene.view.laneMiddle;
      this.coords ={x:x, y:y}  
    }
    
    if(options && options.handler)this.handler = options.handler
    
    if(options && options.noMessage)this.noMessage = options.noMessage
  },
  
  processCommand: function(){
    for(var i=0;i<this.commandFilters.length;i++){
        if(this.commandFilters[i].command()){
            if(!this.commandFilters[i].callback()) break;
        }    
    }
  },
  
  tick : function(){
    if(this.dead)return
    this.processCommand()
  },
  
  moveToTargetPoint : function(){
    if (this.targetPoint) {
      if (Math.abs(this.targetPoint.x - this.coords.x) > 1 || Math.abs(this.targetPoint.y - this.coords.y) > 1) {
        var move = Util.getNextMove(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y, this.movingSpeed)
        this.move(move[0], move[1])
      }
      else {
        this.movingToTarget = false
        if(this.moveToTargetCallback)this.moveToTargetCallback()
      }
    }  
  },
  
  //Return true if unit dies
  takeHit : function(attack){
  	if (attack <= 0 || this.dead) return;
    this.hp -= attack;
    if(this.hp <=0){
      this.die()
      return true;
    }
    return false;   
  },
  
  move : function(dx,dy){
    this.coords.x+=dx
    this.coords.y+=dy
  },
  
  //Kickingout is meant to kickout a mondass, but, we have no mondaseen yet.
  startKickingOut : function(){
    this.kickedout = true
  },
  
  kickout : function(){
    if(this.coords.x < 0) this.dead = true
    if(this.kickedoutYShift < this.maxkickedoutYShift ){
      this.move(0,-3)
      this.kickedoutYShift+=3
    }else{
      if (!this.kickedOutXShift) {
        this.shake = true
        this.kickedOutXShift = true
      }
      else {
        this.move(-3, 0)
      }
    }
  },
 
  moveToTarget : function(targetPoint, callback, movingSpeed){
   this.movingSpeed = movingSpeed || this.defaultMovingSpeed
   this.movingToTarget = true
   this.targetPoint = targetPoint
   this.moveToTargetCallback = callback
  },
  
  pickTarget : function(targets){
    var minDistance = 100000
    var minIndex = -1
    for(var i=0;i<targets.length;i++){
        var tmpDistance = Util.distance(this.coords.x,this.coords.y,targets[i].coords.x,targets[i].coords.y)
        if(tmpDistance < minDistance){
            minDistance = tmpDistance
            minIndex = i
        }
    }
    if(minIndex!=-1 && this.target!=targets[minIndex] && minDistance < this.getWidth()){
        this.target = targets[minIndex]
    }  
  },
  
  getCoords : function(){
    return {x: this.coords.x+this.scene.x}
  },
  
  setTarget: function(target){
       this.target = target;
  },

  getSize : function(){
    return 1  
  },
  
  collidesWith: function(target){
      if (this.coords.x + this.getWidth()/2 > target.coords.x){
         return true;
      }
      return false;  
  },
  
  fire : function($super, event){
  	if (this.dead) return;
  	$super(event);
  },
  
  die : function(){
    this.dead = true;
    this.destroy();
    if(this.handler)
      this.handler.removeObject(this, this.lane);
  }
  
})
