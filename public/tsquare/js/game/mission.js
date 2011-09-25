var Mission = Class.create({

  initialize : function(gameManager){
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    var self = this;
//    self.display();   
  },

  endMission : function(){
  },

  display : function(){
    $('winLose').innerHTML = this.templateManager.load('winLose', {'missions' : this.gameManager.missions});
    this.attachListener();
  },

  play : function(id){
    var self = this;
    var callback = function(data){
      self.currentMission = data;
      self.gameManager.playMission(self.currentMission);
    }
    this.network.missionData(id, callback);
  },

  attachListener : function(){
    var self = this;
    $$('#timeline .mission').each(function(element){
      element.observe('click', function(event){
        self.play(element.id);
      });
    });
  }

});
