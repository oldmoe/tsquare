var ProtectionUnitHandler = Class.create(UnitHandler,{
  
  type : "middle",
  
  addObject : function(obj){
    obj.options.noenemy = obj.noenemy;
    var ret_obj = this.scene.addObject(obj); 
    if(!obj.noenemy) ret_obj.createEnemies(); 
    return  ret_obj;
  },
  
  checkObjectsState : function($super){
    $super()
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
        if( (this.objects[i][j].coords.x + this.objects[i][j].getWidth() < 0 || this.objects[i][j].coords.x > (this.scene.view.width) )){
          this.objects[i][j].mute = true;
          if( !this.objects[i][j].noenemy ){
            this.objects[i][j].destroy();
            this.objects[i].splice(j, 1)
            j--
          }
        } else {
          this.objects[i][j].mute = false;
        }
      }
    }
  },
  
   end : function(){
     this.ended = true
   }
})
