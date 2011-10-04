var Enemy = Class.create(Unit, {
  
  target : null,
  charging : false, 
  chargingSpeed : 3,
  hp : 25, attack : 10 , defense : 25, chargeTolerance : 2, circleSize : 1,
  hitState : null,normalState:null,
  
  initialize : function($super,scene,x,y,options){
     $super(scene,x,y,options)
     this.mappingName = options.mappingName
     this.type = options.type 
     var specs = gameData.enemies[this.mappingName][this.type];
     for(var spec in specs){
         this[spec.dasherize().camelize()] = specs[spec] 
     }
     this.maxHp = this.hp
  },
  
  rotationComplete : function(attack){
    this.takeHit(attack)
  },
  
  tick : function($super){
    $super()
    
    this.updatePosition();
    this.handleCollision();
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
        var tmpDistance = Util.distance(this.coords.x,this.coords.y,targets[i].coords.x,targets[i].coords.y)
        if(tmpDistance < minDistance){
            minDistance = tmpDistance
            minIndex = i
        }
    }
    var targetChange = false
    if(minIndex!=-1 && minDistance <= this.getWidth()){
        if(this.target == null){
          this.target = targets[minIndex]
          this.scene.fire(this.hitState)
          targetChange = true
        }
        
        if(this.target != targets[minIndex]){
          this.target = targets[minIndex]
          targetChange = true
        }
    }else{
        if (this.target) {
            this.target = null
            this.scene.fire(this.normalState)
            targetChange = true
        }
    }
    return targetChange  
  }

});
 
