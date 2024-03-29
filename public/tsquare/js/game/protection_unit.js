var ProtectionUnit = Class.create(Unit,{
  
  chargeTolerance : 0,
  enemies : null,
  rotationTolerance : 10,
  text: "",
  type : "protection",
  messageAppear: false,
  unitType : "protectionUnit", 
  
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.hp = this.maxHp = 1000
    this.neglected = false
    this.text = this.scene.handlers.message.randomStartMessage('protectionUnit');
    
    var self = this;
    this.scene.observe("targetComplete", function(){self.circleEnd()});
   },
   
   textInfo: function(){
     return this.text;
   },
   
  hpRatio: function() {
  	return this.hp / this.maxHp;
  },
  
  circleEnd : function(){
    if(this.doneProtection){
      this.text = this.scene.handlers.message.randomEndMessage('protectionUnit');
      this.showText();
    }
  },
  
  createEnemies : function(){
     var enemiesCoords = [{x:this.coords.x+this.getWidth()+10, y:this.coords.y}]
     this.enemies = [this.scene.handlers.enemy.createEnemyBlock(enemiesCoords[0])]
     
     this.enemies[0].setCoords (enemiesCoords[0])
     
     for(var i=0;i<this.enemies[0].elements.length;i++){
       this.enemies[0].elements[i][0].coords = {x:this.coords.x+this.getWidth()-50*i, y:this.coords.y+i*100}
     }
     
     this.enemies[0].setTarget(this)
  },
  
  tick : function($super){
    $super()
    this.updatePosition();
    if(this.doneProtection){
      this.escape()
      return
    }
    if(this.enemies) this.enemies[0].tick();
    this.checkTarget()
    this.checkHp()
    
    if(!this.messageAppear && this.text){
      if( this.coords.x < this.scene.view.width-this.getWidth()*1.5 ){
        this.messageAppear = true;
        // if(Math.random() <= 0.5)this.showText();
        this.showText();
        var self = this;
        this.scene.reactor.push(this.scene.reactor.everySeconds(10), function(){self.hideText()});
      }
    }
  },
  
  checkHp : function(){
  },
  
  escape : function(){
  },
  
  checkTarget : function(){
    if(this.isProtected){
      var target = this.scene.handlers.crowd.getLargestXCrowd()
      this.enemies[0].setTarget(target)
    }
  },
  
  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },
  
  rotationComplete : function(attack){
    if(this.rotationTolerance == 0 ) return;
    this.rotationTolerance -= 1;
    if (this.rotationTolerance == 0) {
      this.doneProtection = true
      for(var i=0;i<this.enemies.length;i++){
        this.enemies[i].die()
      }
      this.scene.fire("targetComplete");
      this.scene.collision = false;
    }
  },
  
  die : function($super){
    if( this.noenemy ) return;
    for(var i=0;i<this.enemies.length;i++){
        this.enemies[i].die()
    }
    $super();
    this.scene.fire("targetComplete");
    this.scene.collision = false;
  }
  
})
