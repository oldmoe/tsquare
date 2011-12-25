var Timeline = Class.create({
  
  images : {
              'left' : 'images/game_elements/previous_button.png',
              'left-disabled' : 'images/game_elements/previous_button.png',
              'right' : 'images/game_elements/next_button.png',
              'right-disabled' :'images/game_elements/next_button.png'
            },


  initialize : function(gameManager){
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    this.mode = 'timeline';
    this.loader = gameManager.loader;
    var self = this;
    this.loader.load([ {images : ["calendar_25_jan.png", "calendar_26_jan.png", "calendar_27_jan.png", "coming_soon_missions.png",
                                  "home_background.gif", "mission_details.png", "timeline_screen.png", "rescue_screen.png", "challenge_screen.png",
                                  "mission_current.png", "mySquare_screen.png",
                                  "mission_locked.png", "mission_finished.png", "crowd_member_small.png", "challenge_box.png",
                                  "mission_icon_selected.png", "play_button.png", "timeline.png"], path: 'images/timeline/', store: 'timeline'},
                        {images: ["ultras_red_idle.png", "ultras_red_walk.png", "ultras_red_run.png"], path: 'images/characters/', store: 'characters'},          
                        {images : ["facebook_image_large.png"],  path: 'images/dummy/', store: 'dummy' }],
                      {
                        onFinish: function(){ 
                          self.imagesLoaded = true;
                          self.display();
                        }
                      });
    this.gameManager.inbox.challenges(function(challenges){
      self.challenges = challenges
      self.challengesLoaded = true;
      self.walkingMan = new WalkingManDisplay(this.gameManager.reactor);
      self.display();
    });
  },

  display : function(){
    
    if(this.imagesLoaded && this.challengesLoaded)
    {
      $('home').innerHTML = this.templateManager.load('home', {'missions' : this.gameManager.missions});
      Game.addLoadedImagesToDiv('home');
      this.attachHomeListener();
      this.displayHome();
    }
  },  
  
  hide : function(){
    $('homeContainer').hide();
    $('home').hide();
    $('timeline').hide();
  },

  displayHome : function() {
    this.walkingMan.moveTo(100);
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    homeDiv.hide();
    if(timelineDiv.getStyle('display') != 'none')
      Effects.fade(timelineDiv, function(){Effects.appear(homeDiv)});
    else
      Effects.appear(homeDiv);
  },

  displayCalender : function(){
    this.walkingMan.moveTo(240);
    var self = this;
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    var missionsDiv = $('missions');
    var callback = function(){
      $('timeline').hide();
      $('timeline').innerHTML = self.templateManager.load('calender');
      self.attachCalenderListener();
      Game.addLoadedImagesToDiv('timeline');
      $$('.calendarWrapper')[0].show();
      Effects.appear(timelineDiv);
    }
    if(homeDiv.getStyle('display') != 'none')
    {
      Effects.fade(homeDiv, function(){
        callback();
      });
    } else if(missionsDiv && missionsDiv.getStyle('display') != 'none'){
      Effects.fade(timelineDiv, function(){
        callback();
      });
    }else{
      Effects.appear(timelineDiv);
    }
  },

  adjustMissionsData : function(challenge){
    this.walkingMan.moveTo(80);
    var self = this;
    var currentMission =  (challenge) ? challenge.data.mission : this.gameManager.userData.current_mission[this.mode];
    this.currentMissionIndex = 0;
    for(var i in this.gameManager.missions[this.mode])
    {
      this.gameManager.missions[this.mode][i].challenge = null; 
      if(this.gameManager.userData.missions[this.mode][i] || this.gameManager.userData.current_mission[this.mode] == i)
        this.gameManager.missions[this.mode][i]['playable'] = true;
      else
        this.gameManager.missions[this.mode][i]['playable'] = false;
    }
    for(var i in this.gameManager.missions[this.mode])
    {
      if(currentMission != i)
        this.currentMissionIndex += 1;
      else
        break;
    }
    // Keep it looked till we show challenges 
    this.challenges.each(function(challenge){
      if(self.gameManager.missions[self.mode][challenge.data.mission])
        self.gameManager.missions[self.mode][challenge.data.mission]['challenge'] = challenge;
    });
  },

  displayMissions : function(challenge){
    var self = this;
    if(this.carousel) 
    {
      this.carousel.destroy();
    }
    this.adjustMissionsData();
    var callback = function() {
      $('timeline').innerHTML = self.templateManager.load('missions', {'missions' : self.gameManager.missions[self.mode],
               'currentMission' : self.gameManager.userData.current_mission[self.mode], 'challenge' : challenge});
      self.attachMissionsListener();
      Game.addLoadedImagesToDiv('timeline');
      self.displayChallenges();
      $('timeline').show();
      self.carousel = new Carousel("missions", self.images, 7, 2);
      if(challenge)
      {
        self.carousel.observeScrolling(function(){
          var containerOffset = $$('.missionsContainer').last().cumulativeOffset();
          var challengedMissionOffset = $$('.missionsContainer #mission_' + challenge.data.mission).last().cumulativeOffset();
          var challengeDiv = $$('.timelineMissions .friendScore')[0];
          if(challengeDiv)
          {
            challengeDiv.show();
            challengeDiv.style['left'] = challengedMissionOffset.left + 6 - containerOffset.left;
            challengeDiv.style['top'] = 0;
            challengeDiv.setStyle({'zIndex':11});
            var challengeLeft = challengeDiv.cumulativeOffset().left;
            if($$('.missionsContainer li')[gameManager.timelineManager.carousel.currIndex])
            {
              var left = $$('.missionsContainer li')[gameManager.timelineManager.carousel.currIndex].cumulativeOffset().left;
              if(challengeLeft + 60 < left ) challengeDiv.hide();   
            }
            if($$('.missionsContainer li')[self.carousel.currIndex + self.carousel.displayCount - 1])
            {
              var left = $$('.missionsContainer li')[self.carousel.currIndex + self.carousel.displayCount - 1].cumulativeOffset().left;
              if(challengeLeft + 60 > left ) challengeDiv.hide();   
            }
          }
        });
      }
      self.carousel.center(self.currentMissionIndex);
      self.carousel.checkButtons();
      $('timeline').hide();
    }
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    var missionsDiv = $('missions');
    $('home').hide();
    if($$('.calendarWrapper')[0] && $$('.calendarWrapper')[0].getStyle('display') != 'none')
    {
      Effects.fade(timelineDiv, function(){
        callback();
        Effects.appear(timelineDiv);
      });
    } else {
      callback();
      Effects.appear(timelineDiv);
    }
  },

  displayChallenges : function(){
    var userIDs = []
    var users = [];
    this.challenges.each(function(challenge){
      userIDs.push(challenge.from.id);
      users.push({'service_id' : challenge.from.id})
    });
    var callback = function(){
      users.each(function(user){
        $$('.timelineMissions .friendScore .smallImageWrapper img').each(function(image){
          if(image.id == user.service_id) 
          {
            image.src = user.picture;
            image.title = user.name;
          }
        });
      })
    }
/*    if(this.gameManager.scoreManager.friendsLoaded)
    {
      users = this.gameManager.scoreManager.friends.collect(function(friend){userIDs.indexOf(friend.service_id) > -1 });
      console.log(users)
      callback();
    } else {*/
      socialEngine.getUsersInfo(userIDs, function(data){
        socialEngine.fillSocialData(users, data)
        callback();
      })
//    }
  },

  displayMissionDetails : function(id){
    var id = parseInt(id);
    var self = this;
    var callback =  function(){
        Effects.fade($$('.missionDetails')[0], function(){
          $$('#timeline .missionDetails')[0].innerHTML = self.templateManager.load('missionDetails', {'mission' : self.gameManager.missions[self.mode][id]});
          Game.addLoadedImagesToDiv('timeline');
          self.attachMissionDetailsListeners();
          Effects.appear($$('.missionDetails')[0]);
        });
    }
    new Loader().load([ {images : [id + ".png"], path: 'images/missions/', store: 'missions'}],
                      {
                        onFinish: callback,
                        onError : callback
                      });
  },

  hideMissionDetails : function(){
    Effects.fade($$('.missionDetails')[0]);
  },

  attachHomeListener : function(){
    var self = this;
    $$('#home .timelineButton').each(function(element){
      element.observe('click', function(event){
        self.displayCalender();
      });
      element.observe('mouseover', function(event){
        var count = event.element().parentNode.parentNode.parentNode.children.length;
        var elem = event.element().parentNode.parentNode;
        var elemIndex = elem.previousSiblings().length;
        var gap = (960 - elem.getWidth() * count) / (count+1);
        var pos = gap * (elemIndex+1) + elem.getWidth()*elemIndex + elem.getWidth()/2; 
        self.walkingMan.moveTo(pos-30);
      });
    });
  },

  attachCalenderListener : function(){
    var self = this;
    $$('#timeline .calendar').each(function(element){
      element.observe('click', function(event){
        self.displayMissions();
      });
      element.observe('mouseover', function(event){
        var count = event.element().parentNode.parentNode.parentNode.children.length;
        var elem = event.element().parentNode.parentNode;
        var elemIndex = elem.previousSiblings().length;
        var gap = 20;
        var wgap = (960 - elem.getWidth() * count - gap * (count-1)) / 2;
        var pos = wgap + gap * elemIndex + elem.getWidth()*elemIndex + elem.getWidth()/2; 
        self.walkingMan.moveTo(pos-30);
      });
    });
  },

  attachMissionsListener : function(){
    var self = this;
    $$('#timeline .timelineMissions li').each(function(element){
      element.observe('mouseover', function(event) {
        element.addClassName('selected');
        //move character
        var elem = event.element().parentNode.parentNode;
        var elemIndex = elem.previousSiblings().length;
        elemIndex = elemIndex - gameManager.timelineManager.carousel.currIndex;
        var gap = 10;
        var wgap = 40;
        var pos = wgap + gap * elemIndex + elem.getWidth()*elemIndex + elem.getWidth()/2;
        if(pos < 0 || pos > 1000)return; 
        self.walkingMan.moveTo(pos-25);
      });
      element.observe('mouseout', function(event) {
        element.removeClassName('selected');
      });
      element.observe('click', function(event) {
        self.displayMissionDetails(parseInt(element.id.split('_')[1]));
      });
    });
  },

  attachMissionDetailsListeners : function(){
    var self = this;
    $$('#timeline .missionDetails .close')[0].observe('click', function(event){
      self.hideMissionDetails();
    });
    if($$('#timeline .missionDetails .playButton')[0])
    {
      $$('#timeline .missionDetails .playButton')[0].observe('click', function(event){
        self.gameManager.playMission(event.element().id);
      });
    }
  }

});
