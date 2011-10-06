var EnemyHandler = Class.create(UnitHandler, {
   
   type : "right",
   
   initialize: function($super,scene){
     $super(scene)  
     this.unitsClassMappings['wood_stick_cs'] = 'amn_markazy'
   },
   
   addObject : function($super,obj){
      if(obj.type){
          var dims = obj.type.split("_")
          var rows = parseInt(dims[0])
          var cols =  parseInt(dims[1])
          obj.options.obj = obj.name
          obj.name =  "block"
          obj.options.type = obj.type
          obj.options.rows = rows
          obj.options.columns = cols
      }
      return $super(obj)   
   },
   
   end : function(){
     this.ended = true
     this.scene.end(true)
   },
   
   createOneManUnit : function(){
      var properties = {
        category: "enemy",
        type : "1_1",
        name : "amn_markazy",
        options : {handler:this, mappingName:"wood_stick_cs"},
        lane : this.scene.activeLane
      }
      return this.addObject(properties)  
   } 
   
});