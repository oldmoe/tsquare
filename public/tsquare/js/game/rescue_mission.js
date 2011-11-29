var RescueMission = new Class.create({
  noOfEnemies : 10,
  initialize : function(scene){
    this.scene = scene
    this.createEnemies()
    this.createCrowds()
    this.setFormations()
  },
  createEnemies : function(){
    var elements = []
    for(var i=0;i<this.noOfEnemies;i++){
      elements.push(this.scene.handlers.clash_enemy.createClashEnemy())
    }
    this.enemy = new ClashGroup(this.scene, elements,this.scene.handlers.clash_enemy)
  },
  createCrowds : function(){
    var handler = this.scene.handlers.crowd
    this.crowd = new ClashGroup(this.scene, handler.objects[this.scene.activeLane],handler)
  },
  setFormations : function(){
    this.crowd.gatherTriangle(300)
    this.enemy.gatherTriangle(this.scene.view.width)
  }
})
