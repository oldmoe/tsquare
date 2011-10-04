var NPCHandler = Class.create(UnitHandler,{
  initialize: function($super,scene){
    $super(scene)
    this.unitsClassMappings = {'normal_man':'normal','doctor':'medic',
    'girl_7egab':'girl7egab','micman':'libralymic','salafi':'salafy','7alaman':'hala_man'}
  },
   addObject: function($super, obj){
    obj.options.type = obj.name
    obj.name = "npc"
    return $super(obj)
   }
});