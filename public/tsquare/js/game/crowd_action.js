var CrowdAction = Class.create({
   elementsPerColumn : 5,
   elementHeight : 30,
   elementWidth : 50,
   distaceBetweenUnits : 10,
   initialize : function(scene,options){
     options = options || {}
     this.scene = scene
     this.elementsPerColumn = options.elementsPerColumn || this.elementsPerColumn
     this.elementHeight = options.elementHeight || this.elementHeight
     this.elementWidth = options.elementWidth || this.elementWidth
     this.distanceBetweenUnits = options.distanceBetweenUnits || this.distanceBetweenUnits
   },
   gatherRectangle : function(objects,x,direction){
     direction = 1 || direction
     var x = x;
     var y_center = this.scene.view.height/2 - 140
     var sign = -1
     for(var i=0;i<objects.length;i++){
        var y = y_center+sign*this.elementHeight * (i%this.elementsPerColumn) //+(Math.random()*20 - 10)
        var obj_x=x-sign*(i%this.elementsPerColumn)*this.distaceBetweenUnits// + (Math.random()*20 - 10)
        objects[i].moveToTarget({x:obj_x,y:y})
        if((i+1)%this.elementsPerColumn == 0) x +=this.elementWidth   
        sign*=-1     
      }
   },
   gatherTriangle : function(objects,x,direction){
     direction = direction || 1
     var x = x;
     var y_center = this.scene.view.height/2 - 140
     var y = y_center
     var sign = -1
     var columnCount = 1
     var count = 0
     var columnSign = -1
     for(var i=0;i<objects.length;i++){
        if(count==columnCount){
          count = 0
          y_center+=columnSign* 10
          columnSign*=-1
          sign = -1
          y = y_center
          columnCount++
          x+=direction*this.elementWidth
        }
        var y = y+sign*this.elementHeight * (count) +(Math.random()*20 - 10)
        var obj_x=x-sign*count*this.distaceBetweenUnits + (Math.random()*20 - 10)
        objects[i].moveToTarget({x:obj_x,y:y})
        sign*=-1
        count++     
      }
   }

})
