var ProtectionUnitHandler = Class.create(UnitHandler,{
  
  type : "middle",
  
  addObject : function(obj){
    var ret_obj = this.scene.addObject(obj); 
    ret_obj.createEnemies();
    return  ret_obj;
  },
  
  checkObjectsState : function($super){
    $super()
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
        if(this.objects[i][j].coords.x < 0 || this.objects[i][j].coords.x > (this.scene.view.width)){
           this.objects[i][j].destroy();
           this.objects[i].splice(j, 1)
           j--
        } 
      }
    }
  },
  
   end : function(){
     this.ended = true
     this.scene.end(true)
   }
})
