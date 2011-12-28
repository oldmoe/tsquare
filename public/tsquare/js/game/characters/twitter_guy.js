var TwitterGuy = Class.create(ProtectionUnit,{
  escape : function(){
    this.neglected = true
    //removes the element from the start of the objects array and push it to its end
    this.handler.objects[this.lane].remove(this)
    this.handler.objects[this.lane].push(this)
  }
})
