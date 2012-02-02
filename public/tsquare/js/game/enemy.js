var Enemy = Class.create(Unit, {
  
  target : null,
  charging : false, 
  chargingSpeed : 3,
  hp : 25, attack : 10 , defense : 25, chargeTolerance : 2, circleSize : 1,
  originalPosition : null,
  fixedPosition: false,
  unitType : "enemy", 
  
  initialize : function($super,scene,x,lane,options){
     $super(scene,x,lane,options)
     this.mappingName = options.mappingName || options.obj
     this.type = options.type 
     var specs = gameData.enemies[this.mappingName]["1_1"];
     for(var spec in specs){
         this[spec.dasherize().camelize()] = specs[spec] 
     }
     this.maxHp = this.hp
     this.originalPosition = {x:this.coords.x, y:this.coords.y};
  },
  
  rotationComplete : function(attack){
    if(this.takeHit(attack)) 
      this.scene.fire("updateScore", [75]); //when enemy die
  },
  
  tick : function($super){
    $super()
    this.updatePosition();
    this.handleCollision();
    if(this.fixedPosition){
      this.fixedPosition = false;
      this.moveToTarget(this.originalPosition, null, 2);
    }
  },
  
  handleCollision : function(){
  },
  
  updatePosition: function(){
    if(!this.charging)
      this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);
    else  
      this.move(-(this.scene.currentSpeed * this.scene.direction+this.chargingSpeed), 0);
  },
  
  setTarget: function(target){
      this.target = target;
  },
  
  pickTarget : function(targets){
    var minDistance = 100000
    var minIndex = -1
    for(var i=0;i<targets.length;i++){
    	if (targets[i].dead) continue
        var tmpDistance = Util.distance(this.coords.x,this.coords.y,targets[i].coords.x,targets[i].coords.y)
        if(tmpDistance < minDistance){
            minDistance = tmpDistance
            minIndex = i
        }
    }
    var targetChange = false
    if(minIndex!=-1 && minDistance <= this.getWidth()*3/2){
        if(this.target == null){
          this.target = targets[minIndex]
          this.fire("hit")
          targetChange = true
        }
        
        if(this.target != targets[minIndex]){
          this.target = targets[minIndex]
          targetChange = true
        }
    }else{
        if (this.target) {
            this.target = null
            this.fire("normal")
            targetChange = true
        }
    }
    return targetChange  
  }

});
 
