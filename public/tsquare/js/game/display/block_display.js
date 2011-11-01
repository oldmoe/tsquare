var BlockDisplay = Class.create(EnemyDisplay, {
  
  initialize : function(owner){
    this.owner = owner
    for(var i=0;i<this.owner.elements.length;i++){
      for(var j=0;j<this.owner.elements[i].length;j++){
       var displayKlass =eval(owner.objectType.formClassName()+"Display") 
       var objDisplay = new displayKlass(this.owner.elements[i][j])
       this.owner.scene.pushToRenderLoop('characters',objDisplay) 
      }
    }
  }
  
})
