var MissionManager = Class.create({

  initialize : function(gameManager){ 
    this.missions = {}
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    var self = this;
    this.gameManager.loader.load([ {images : ["score_background.png", "star_icon.png", "stars_background.png", 
                                  "replay_button.png", "home_button.png", "next_mission_button.png",
                                  "lose_score_background.png", "lose_star_icon.png", "lose_stars_background.png",
                                  "lose_replay_button.png", "lose_home_button.png", "lose_next_mission_button.png", 
                                  "win_lose_window.png", "lose_window.png", "button_cancel.png"],
                          path: 'images/win_lose/', store: 'win_lose' }, 
                        {images : ["close_button.png"], 
                          path: 'images/game_elements/', store: 'game_elements' },
                        {images : ["friendsScore.png", "friend_box.png"], 
                          path: 'images/friends/', store: 'friends' }
                      ],
                      {
                        onFinish: function(){
                          self.imagesLoaded = true;
                          if(self.ended == true)
                          {
                            self.end(self.score);
                          }
                        }
                      });
//    self.display();   
  },

  end : function(score){
    this.ended = true;
    this.score = score;
    if(this.imagesLoaded)
    {
      this.eneded = false;
      score['stars'] = this.calculateStars(score);
      this.displayStaticEndScreen();
      var self = this;
      this.network.postMissionScore( this.currentMission.id, score, function(data){
        self.mode = self.gameManager.timelineManager.mode;
        if(self.gameManager.scoreManager.currentUser)
        {
          self.gameManager.scoreManager.currentUser.missions[self.mode][self.currentMission['id']] = score;
          self.displayEndScreen(score);
          self.gameManager.initializeData(data);
        }
      });
    }
  },
  
  displayStaticEndScreen : function(){
    var staticData = {'friends' : [], 'mission' : this.currentMission['id'], 'mode' : this.mode, 'score' : {score : '...', objectives : 0, stars : 0} };
    var screenName = (this.score.win == true) ? 'win' : 'lose';
    $('winLose').innerHTML = this.templateManager.load(screenName, staticData);
    Game.addLoadedImagesToDiv('winLose');
    this.attachListener();
    this.show();
  },

  hide : function(){
    Effects.fade($('winLose'));
  },

  show:function(){
    Effects.appear($('winLose'));
  },

  calculateStars : function(score) {
    var stars = 0;
    if (score['objectives'] == 1)
      stars = 2;
    else if(score['objectives'] >= 0.5)
      stars = 1;
    if(score['combos'] >= 0.8)
      stars+=1;
    return stars;
  },
  
  displayEndScreen : function(score){
    this.sortFriends();
    var screenName = (this.score.win == true) ? 'win' : 'lose';
    $('winLose').innerHTML = this.templateManager.load(screenName, {'friends' : this.friends.slice(this.rank+1, this.rank+4),
                             'mission' : this.currentMission['id'], 'mode' : this.mode, 'score' : score });
    Game.addLoadedImagesToDiv('winLose');
    this.attachListener();
    this.show();
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
    $$('#winLose .nextMissionButton').each(function(button){
      button.observe('click', function(event){
        self.gameManager.playMission(self.currentMission.next);
      });
    });
    $$('#winLose .close')[0].observe('click', function(event){
      self.gameManager.openMainPage();
    });
    $$('#winLose .challengeFriends .friend .cancelButton').each(function(element){
      element.observe('click', function(event){
        self.challengeFriend(element.id);
      });
    });
  },

  sortFriends : function(score) {
    var self = this;
    this.friends = this.gameManager.scoreManager.friends.sortBy(function(friend){ 
      if(friend.missions[self.mode][self.currentMission['id']])
      {
        var extra = 0;
        if(friend.missions[self.mode][self.currentMission['id']]['score'] == self.score.score && 
            friend.service_id != socialEngine.userId()) 
          extra = 1;
        return (friend.missions[self.mode][self.currentMission['id']]['score'] + extra);
      }
      else
        return 0;
    }).reverse();
    this.rank = 0;
    for(var i=0; i< this.friends.length; i++)
    {
      if(this.friends[i].service_id != socialEngine.userId())
        this.rank ++;
      else
        break;
    }
  }, 

  challengeFriend : function(friendId){
    var message = "Too low of a score, mate!!. So I topped your miserable score with " + 
                this.score.score + " in the " + this.currentMission.name + ". Up for some challenge?";
    var data = {type : 'challenge', mission : this.currentMission.id, score : this.score.score};
    socialEngine.sendFriendRequest(friendId, message, data);
  }

});
