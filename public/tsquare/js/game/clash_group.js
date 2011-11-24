var ClashGroup = Class.create({
   elements : null,
   elementsPerColumn : 5,
   elementHeight : 20,
   elementWidth : 50,
   distaceBetweenUnits : 10,
   initialize : function(scene,elements, handler){
      this.scene = scene
      this.elements = []
      this.noOfElements = noOfElements
      this.handler = handler
      this.elements = elements
   },
   createElements : function(){
     for(var i=0;i< this.noOfElements;i++){
       this.elements[i] = this.handler.createClashEnemy()
       this.elements[i].coords.x = this.scene.view.width
       this.elements[i].coords.y = Math.round(Math.random()*this.scene.view.height)
     }
   },
   gatherRectangle : function(x){
     new CrowdAction(this.scene).gatherRectangle(this.elements,x)
   },
   gatherTriangle : function(x){
     new CrowdAction(this.scene).gatherTriangle(this.elements,x)
   },
   fire : function(state){
     for(var i=0;i<this.elements.length;i++){
       this.elements[i].fire(state)
     }
   }
})
