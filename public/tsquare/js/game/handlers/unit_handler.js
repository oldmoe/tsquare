var UnitHandler = Class.create({
   
   objects: null,
   incoming: null,
   scene: null,
   unitsClassMappings : null,
   target : null,
   
   initialize: function(scene){
       this.unitsClassMappings = {}
       this.incoming = [[],[],[]];
       this.objects = [[],[],[]];
       this.ended = false
       this.scene = scene;       
   },
   
   tick: function(){
       if(this.ended) return
       this.checkObjectsState();
       var self = this;
       this.objects.each(function(laneObjects){self.scene.tickObjects(laneObjects)})
   },
   
   start : function(){
       
   },
   
   add: function(elem){
     if(this.incoming[elem.lane] == null){
       this.incoming[elem.lane] = [];
       this.objects[elem.lane] = [];  
     }
     elem.options = {}
     if (this.unitsClassMappings[elem.name]) {
         elem.options.mappingName =  elem.name;
         elem.name = this.unitsClassMappings[elem.name];
     }
     elem.options.handler = this;
     elem.x = elem.x * this.scene.view.tileWidth;
     this.incoming[elem.lane].push(elem);
   },
   
  checkObjectsState : function(){
    this.checkExistingObjects()
    this.checkIncomingObjects()
    this.checkEnd()
  },
  checkExistingObjects: function(){
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
        if (this.objects[i][j].coords.x + this.objects[i][j].getWidth() < 0) {
          this.objects[i][j].destroy()
          this.objects[i].splice(j, 1)
          j--
        }
      }
    }
  },
  checkIncomingObjects: function(){
    for (var i = 0; i < this.incoming.length; i++) {
      for (var j = 0; this.incoming[i] && j < this.incoming[i].length; j++) {
        if (this.incoming[i][j].x < this.scene.view.xPos + (this.scene.view.width)) {
          this.objects[i].push(this.addObject(this.incoming[i][j]))
          this.incoming[i].splice(0, 1)
          j--;
        }
        else {
          break
        }
      }
    }
  },
  checkEnd : function(){  
    var done = true
    for(var i=0;i<this.objects.length;i++){
      if (this.objects[i].length > 0) {
        done = false;
        break
      }
    }
    for (var i = 0; i < this.incoming.length; i++) {
      if(this.incoming[i].length > 0){
        done = false
        break
      } 
    }
    if(done) this.end()
  },
  
  end : function(){
    
  },
  
  addObject : function(obj){
    return this.scene.addObject(obj);  
  },
  
  detectCollisions : function(others){
    var lane = this.scene.activeLane
    if(this.objects[lane].length == 0) return
    var collision = [];
    var collided = false
    var target = null
    for(var j=0;j<this.objects[lane].length;j++){             
      for(var k=0;k<others[lane].length;k++){
        if(!others[lane][k].neglected && this.objects[lane][j].collidesWith(others[lane][k])){
          others[lane][k].pickTarget(this.objects[lane]);
          collision.push({obj1:this.objects[lane][j], obj2:others[lane][k], lane:lane})            
          collided = true;
          break; 
        }                
      }
    }
    if(others[lane][0] && !collided){
      for(var k=0;k<others[lane].length;k++){
        others[lane][k].setTarget(null);                  
      }
    }
    if(collided){
      for(var j=0;j<this.objects[lane].length;j++){                      
        this.objects[lane][j].setTarget(collision[0].obj2);     
        this.target = collision[0].obj2 
      }
    }
    if(collision.length > 0){
      return true;
    } 
    return false
  },
  
   removeObject: function(object, lane){
      if(this.objects[lane].indexOf(object)!=-1){
          this.objects[lane].remove(object);
          object.destroy();
          return true;
      }
      return false;
   }      
    
});