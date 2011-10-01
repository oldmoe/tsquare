var NPCHandler = Class.create(UnitHandler,{
  initialize: function($super,scene){
    $super(scene)
    this.unitsClassMappings = {'normal_man':'normal','doctor':'medic'}
  },
   addObject: function($super, obj){
    obj.options.type = obj.name
    obj.name = "npc"
    return $super(obj)
   }
});