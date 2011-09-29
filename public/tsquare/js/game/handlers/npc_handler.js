var NPCHandler = Class.create(UnitHandler,{
   addObject: function($super, obj){
    obj.options.type = obj.name
    obj.name = "npc"
    return $super(obj)
   }
});