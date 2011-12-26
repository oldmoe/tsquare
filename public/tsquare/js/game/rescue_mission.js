var RescueMission = new Class.create({
  noOfEnemies : 6,
  initialize : function(scene){
    this.scene = scene
    this.createEnemies()
    this.createCrowds()
    this.setFormations()
  },
  
  createEnemies : function(){
    var elements = []
    for(var i=0;i<this.noOfEnemies;i++){
      var element = this.scene.handlers.clash_enemy.createClashEnemy();
      element.coords.x = this.scene.view.width
      elements.push(element)
    }
    this.enemy = new ClashGroup(this.scene, elements,this.scene.handlers.clash_enemy , 1)
  },
  
  createCrowds : function(){
    var handler = this.scene.handlers.crowd
    this.crowd = new ClashGroup(this.scene, handler.objects[this.scene.activeLane],handler, -1)
  },
  
  setFormations : function(){
    this.crowd.gatherTriangle(300);
    this.scene.fire('rescueMissionStart')
    this.scene.clashDirectionsGenerator.run();
    this.enemy.gatherTriangle(this.scene.view.width - 300);
    this.scene.clashDirectionsGenerator.setCrowd(this.crowd)
    this.scene.clashDirectionsGenerator.setEnemy(this.enemy)
    
  }
})
