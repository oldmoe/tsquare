var ProtectionUnitHandler = Class.create(UnitHandler,{
  type : "middle",
  addObject : function(obj){
    var ret_obj = this.scene.addObject(obj); 
    ret_obj.createEnemies();
    return  ret_obj;
  },
})
