var ClashEnemyHandler = Class.create(UnitHandler, {
  incomingObject: null,
  initialize : function($super,scene){
    $super(scene)
    var self = this
    this.scene.observe('clashCrowdsBack', function(){
      if (self.incomingObject) 
        self.objects[self.incomingObject.lane].push(self.addObject(self.incomingObject))
        self.incoming[self.incomingObject.lane].splice(0, 1)
        self.incomingObject = null
        self.scene.audioManager.playClash()
     })
  },
  
  tick : function($super){
    if(this.objects[this.scene.activeLane].length > 0)
    this.scene.direction = 0;
    $super();
  },
  
  end: function(){
    this.ended = true
    this.scene.end(true)
  },
  
  createClashEnemy: function(){
    var data = {
      category: "clash_enemy",
      index: 0,
      lane: 1,
      name: "clash_enemy",
      x: 0,
      options: {
        handler: this
      }
    }
    var obj = this.scene.addObject(data)
    this.objects[obj.lane].push(obj)
    return obj
  },
  checkIncomingObjects: function(){
    if(this.incomingObject)return
    for (var i = 0; i < this.incoming.length; i++) {
      for (var j = 0; this.incoming[i] && j < this.incoming[i].length; j++) {
        if (this.incoming[i][j].x < this.scene.view.xPos + this.scene.view.width) {
          this.scene.fire('clashUnit')
          this.incomingObject = this.incoming[i][j]
        }
        else {
          break
        }
      }
    }
  },
  checkExistingObjects: function(){
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
        if (this.objects[i][j].coords.x >  this.scene.view.width) {
          this.objects[i][j].destroy()
          this.objects[i].splice(j, 1)
          j--
        }
      }
    }
  }
})
