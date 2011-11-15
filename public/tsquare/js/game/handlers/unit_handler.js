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
           elem.options.mappingName =  elem.name
           elem.name = this.unitsClassMappings[elem.name]
       }
       elem.options.handler = this
       elem.x = elem.x * this.scene.view.tileWidth
      this.incoming[elem.lane].push(elem)
   },
   
  checkObjectsState : function(){
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
         if(this.objects[i][j].coords.x +  this.objects[i][j].getWidth()< 0){
           this.objects[i][j].destroy()
           this.objects[i].splice(j, 1)
           j--
         }  
      }
    }
    for(var i=0;i<this.incoming.length;i++){
      for(var j=0; this.incoming[i] && j<this.incoming[i].length;j++){
        if (this.incoming[i][j].x < this.scene.view.xPos + this.scene.view.width) {
          this.objects[i].push(this.addObject(this.incoming[i][j]))
          this.incoming[i].splice(0, 1)
          j--;
        }
        else {
          break
        }
      }
    }
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
      } 
    }
    if(done) this.end()
  },
  
  end : function(){
    
  },
  
  addObject : function(obj){
    return this.scene.addObject(obj)  
  },
  
  detectCollisions : function(others){
    var collision = [];
    for(var i=0;i<this.objects.length;i++){
        if(this.objects[i] && this.objects[i][0]){
          var collided = false
          for(var j=0;j<this.objects[i].length;j++){             
            if(others[i] && others[i][0] ){               
                if(!others[i][0].neglected && this.objects[i][j].collidesWith(others[i][0])){
                    others[i][0].pickTarget(this.objects[i]);     
                    collision.push({obj1:this.objects[i][j], obj2:others[i][0], lane:i})            
                    collided = true;
                    break; 
                }                
             }
           }
           if(others[i] && others[i][0] && !collided){
               others[i][0].setTarget(null);                  
           }
           for(var j=0;j<this.objects[i].length;j++){                      
                if(collided){
                    this.objects[i][j].setTarget(others[i][0]);     
                    this.target = others[i][0]  
                }
           }
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