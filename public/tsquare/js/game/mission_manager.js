var MissionManager = Class.create({

  initialize : function(gameManager){ 
    this.missions = {}
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    var self = this;
//    self.display();   
  },

  end : function(score){
    
  },

  hide : function(){
    $('winLose').hide();
  },

  displayEndScreen : function(score){
    $('winLose').innerHTML = this.templateManager.load('winLose', {'friends' : this.gameManager.scoreManager.friends, 'score' : score});
    this.attachListener();
  },

  load : function(id, gameCallback){
    var self = this;
    if(this.missions[id])
    {
      gameCallback(self.missions[id]);
    }else {
      var callback = function(data){
        self.currentMission = data;
        console.log(self.currentMission);
        self.missions[data.id] = data;
        gameCallback(self.currentMission);
      }
      this.network.missionData(id, callback);
    }
  },

  attachListener : function(){
    var self = this;
    $$('#winLose .replayButton')[0].observe('click', function(event){
      self.gameManager.playMission(self.currentMission.id);
    });
    $$('#winLose .homeButton')[0].observe('click', function(event){
      self.gameManager.openMainPage();
    });
    $$('#winLose .nextMissionButton')[0].observe('click', function(event){
      self.gameManager.playMission(self.currentMission.next);
    });
    $$('#winLose .close')[0].observe('click', function(event){
      self.hide();
    });
  }

});
