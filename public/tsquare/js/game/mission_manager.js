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
    var score = {score:1000, objectives:0.6, combos: 0.8, win:true};
    this.mode = this.gameManager.timelineManager.mode;
    this.displayEndScreen(score);
  },

  hide : function(){
    $('winLose').hide();
  },

  displayEndScreen : function(score){
    var stars = 0;
    if (score['objectives'] == 1)
      stars = 2;
    else if(score['objectives'] >= 0.5)
      stars = 1;
    if(score['combos'] >= 0.8)
      stars+=1;
    this.sortFriends();
    $('winLose').innerHTML = this.templateManager.load('winLose', {'friends' : this.friends.slice(this.rank+1, this.rank+4),
                             'mission' : this.currentMission['id'], 'mode' : this.mode, 'score' : score, 'stars' : stars });
    this.attachListener();
    $('winLose').show();
  },

  load : function(id, gameCallback){
    var self = this;
    if(this.missions[id])
    {
      gameCallback(self.missions[id]);
    }else {
      var callback = function(data){
        self.currentMission = data;
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
  },

  sortFriends : function() {
    var self = this;
    this.friends = this.gameManager.scoreManager.friends.sortBy(function(friend){ return friend.missions[self.mode][self.currentMission['id']]}).reverse();
    this.rank = 0;
    for(var i=0; i< this.friends.length; i++)
    {
      if(this.friends[i].service_id != socialEngine.userId())
        this.rank ++;
      else
        break;
    }
  }

});
