var EnemyHandler = Class.create(UnitHandler, {
   
   type : "right",
   
   initialize: function($super,scene){
     $super(scene)  
     this.unitsClassMappings['wood_stick_cs'] = 'amn_markazy'
     this.unitsClassMappings['iron_stick_cs'] = 'amn_ektesah'
   },
   
   addObject : function($super,obj){
      if(obj.type){
        var dims = obj.type.split("_")
        var rows = parseInt(dims[0])
        var cols =  parseInt(dims[1])
        obj.options.obj = obj.name
        //TO be removed and solved
        if(obj.name == "tear_gas_gunner_cs")
        obj.name =  "tear_gas_gunner_cs_block"
        else obj.name = "block"
        //end
        obj.options.type = obj.type
        obj.options.rows = rows
        obj.options.columns = cols
      }
      var enemy = $super(obj);
      return enemy;    
   },
   
   end : function(){
     this.ended = true
   },
   
   createEnemyBlock : function(coords){
      var properties = {
        category: "enemy",
        type : "1_2",
        name : "amn_markazy",
        options : {handler:this, mappingName:"wood_stick_cs", coords: coords, noMessage: true},
        lane : this.scene.activeLane
      }
      return this.addObject(properties)  
   } 
   
});