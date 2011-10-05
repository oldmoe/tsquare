var Ambulance = Class.create(ProtectionUnit,{
  escape : function(){
    this.neglected = true
    this.move(5,0)
  }
})
