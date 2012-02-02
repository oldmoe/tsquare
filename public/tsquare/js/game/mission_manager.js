var MissionManager = Class.create({

  initialize : function(gameManager){ 
    this.missions = {}
    this.currentMission = {}
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    var self = this;
    this.gameManager.loader.load([ {images : ["score_background.png", "star_icon.png", "time_background.png", "button_big.png", "objectives.png",
                                  "replay_button.png", "home_button.png", "next_mission_button.png", "objectivesState.png",
                                  "lose_score_background.png", "lose_star_icon.png", "lose_stars_background.png",
                                  "lose_replay_button.png", "lose_home_button.png", "lose_next_mission_button.png", 
                                  "win_lose_window.png", "lose_window.png", "button_cancel.png"],
                          path: 'images/win_lose/', store: 'win_lose' }, 
                        {images : ["close_button.png", "guide_walk.png", "guide_attack.png", "guide_defend.png", 
                        "guide_retreat.png", "guide_push.png"], 
                          path: 'images/game_elements/', store: 'game_elements' },
                        {images : ["friendsScore.png", "friend_box.png"], 
                          path: 'images/friends/', store: 'friends' }, 
                        {images : ["paused_screen.png", "play_btn.png", "exit_btn.png", "controls_area.png"], 
                          path: 'images/game_elements/', store: 'game_elements' },
                          {images_ar : ["paused_screen.png"], 
                          path: 'images/ar/game_elements/', store: 'game_elements' }
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

  registerSceneListeners : function(scene){
    var self = this;
    scene.observe('end', function(params){self.end(params)});
    scene.observe('animationEnd', function(){
      self.endAnimationDone = true;
      self.displayEndScreen(self.score);
    });
    self.pauseScreenOn = false;
    $('pause').hide();
  	$('pause').innerHTML = this.templateManager.load('pause');
    Game.addLoadedImagesToDiv('pause');
    scene.observe('togglePause', function(){
    	if (self.pauseScreenOn) {
    		$('pause').hide();
    		self.pauseScreenOn = false;
    	} else {
    		$('pause').show();
    		self.pauseScreenOn = true;
    	}
    });
    $$('#pause .controls .playBtn')[0].observe('click', function(event){
      scene.fire('togglePause');
    });
    $$('#pause .controls .exitBtn')[0].observe('click', function(event){
      scene.fire('end');
	  $('pause').hide();
	  self.pauseScreenOn = false;
      self.goHome();
    });
  },

  end : function(score){
    this.ended = true;
    this.score = score;
    if(this.imagesLoaded)
    {
      this.eneded = false;
      this.mode = this.gameManager.timelineManager.mode;
      var self = this;
      var usedPowerups = [];
      var powerups = this.gameManager.userData.powerups;
      for (var i=0; powerups && i < powerups.length; i++) {
        if(powerups[i].changed) usedPowerups.push(powerups[i]);
      };
      if (score) {
        score.usedPowerups = usedPowerups;

        this.missionPowerups = null;
        var missionInfo = this.gameManager.userData.missions[this.mode][this.currentMission.id];
        if(missionInfo == null || (missionInfo && missionInfo.stars == 0))
          this.missionPowerups = this.gameManager.game.mission.winPowerups;
        
        this.network.postMissionScore(this.currentMission.id, score, function(data){
          self.donePosting = true;
          if (self.gameManager.scoreManager.currentUser) {
            self.gameManager.scoreManager.currentUser.missions[self.mode][self.currentMission['id']] = self.score;
            self.displayEndScreen(self.score);
            self.gameManager.initializeData(data);
          }
        });
      }
    }
  },
  
  hide : function(){
    $('winLose').hide()
  },

  show:function(){
    $('winLose').show();
  },

  displayStaticEndScreen : function(){
    var nextMission = this.gameManager.missions[this.mode][this.currentMission.next] ? true : false;
    var staticData = {'friends' : [], 'mission' : this.currentMission['id'], 'mode' : this.mode, 'score' : {score : '...', objectives : 0, stars : 0},
                      next : nextMission  };
    var screenName = (this.score.win == true) ? 'win' : 'lose';
    $('winLose').innerHTML = this.templateManager.load(screenName, staticData);
    Game.addLoadedImagesToDiv('winLose');
    this.attachListener();
    this.show();
  },
  
  getTimeAsString: function(time){
    var r = [0, 0, 0];
    r[0] = parseInt(time/(60*60));//hours
    time -= r[0] * 60 * 60;
    r[1] = parseInt(time / 60);//minutes
    time -= r[1] * 60;
    r[2] = time;//seconds

    var res =  "";
    if (r[0] > 0){
      res += r[0]<10?"0"+r[0]:r[0];
      res += ":";
    }
    res += r[1]<10?"0"+r[1]:r[1];
    res += ":";
    res += r[2]<10?"0"+r[2]:r[2];
    
    return res;
  },
  
  displayEndScreen : function(score){
    if(this.donePosting && this.endAnimationDone){
      this.sortFriends();
      var screenName = (this.score.win == true) ? 'win' : 'lose';
      var nextMission = this.gameManager.missions[this.mode][this.currentMission.next] && !this.gameManager.missions[this.mode][this.currentMission.next].locked ? true : false;
      var superTime = this.getTimeAsString(this.gameManager.game.mission.superTime);
      var missionTime = this.getTimeAsString(this.gameManager.game.scene.scoreCalculator.gameTime);
      
      $('winLose').innerHTML = this.templateManager.load(screenName, {'friends' : this.friends.slice(this.rank+1, this.rank+4),
                               'mission' : this.currentMission['id'], 'mode' : this.mode, 'score' : score, next : nextMission , 
                               missionTime : missionTime, superTime: superTime, powerups : this.missionPowerups});
                               
      Game.addLoadedImagesToDiv('winLose');
      this.attachListener();
      this.show();
    }else if(this.endAnimationDone){
      this.displayStaticEndScreen();
    }
  },

  load : function(id, gameCallback){
    var self = this;
    var callback = function(data){
      var missionData = data['mission']
      self.currentMission = missionData;
      self.missions[missionData.id] = missionData;
      gameCallback(data);
    }
    this.network.missionData(id, callback);
  },
  
  goHome : function() {
    game.scene.reactor.stop();
  	game.scene.audioManager.stop();
    Loader.sounds.intro['menus_background.mp3'].play();
    self.gameManager.openMainPage();
  },

  attachListener : function(){
    var self = this;
    $$('#winLose .replayButton')[0].observe('click', function(event){
      $('winLose').hide();
      self.gameManager.marketplace.openMarketplace({gameView : true, myStuff : true, preMission : true, missionID : self.currentMission.id});
    });
    $$('#winLose .homeButton')[0].observe('click', function(event){
      self.goHome();
    });
    $$('#winLose .nextMissionButton').each(function(button){
      button.observe('click', function(event){
        $('winLose').hide();
        self.gameManager.marketplace.openMarketplace({gameView : true, myStuff : true, preMission : true, missionID : self.currentMission.next});
      });
    });
    $$('#winLose .close')[0].observe('click', function(event){
      self.goHome();
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
