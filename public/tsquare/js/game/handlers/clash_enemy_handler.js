var ClashEnemyHandler = Class.create(UnitHandler,{
  end : function(){
     this.ended = true
     this.scene.end(true)
   }
})
