var Ambulance = Class.create(ProtectionUnit,{
  escape : function(){
    this.neglected = true
    this.handler.objects[this.lane].remove(this)
    this.handler.objects[this.lane].push(this)
    this.move(5,0)
  }
})
