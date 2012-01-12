var Timeline = Class.create(UIManager, {
  
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
                                  "mission_icon_selected.png", "play_button.png", "map_background.gif"], path: 'images/timeline/', store: 'timeline'},
                       {images_ar : ["calendar_25_jan.png", "calendar_26_jan.png", "calendar_27_jan.png",
                                  "mission_details.png", "timeline_screen.png", "rescue_screen.png", "challenge_screen.png",
                                  "mySquare_screen.png", "play_button.png"], path: 'images/ar/timeline/', store: 'timeline'},
                       {images: ["ultras_red_idle.png", "ultras_red_walk.png", "ultras_red_run.png"], path: 'images/characters/', store: 'characters'},
                       {images: ['crowd_shadow.png'], path: 'images/effects/', store: 'effects'},          
                       {images : ["facebook_image_large.png"],  path: 'images/dummy/', store: 'dummy' }],
                      {
                        onFinish: function(){
                          self.imagesLoaded = true;
                          self.display();
                          Game.addLoadedImagesToDiv("uiContainer");
                        }
                      });
    this.gameManager.inbox.challenges(function(challenges){
      self.challenges = challenges
      self.challengesLoaded = true;
      //TODO: Is this necessary? 
      // self.display();
    });
  },

  display : function() {
    if(this.resetRequest || (this.imagesLoaded && this.challengesLoaded))
    {
      $('home').innerHTML = this.templateManager.load('home', {'missions' : this.gameManager.missions});
      Game.addLoadedImagesToDiv('home');
      if (!this.walkingMan) {
        this.walkingMan = new WalkingManDisplay(this.gameManager.reactor);
      }
      this.attachHomeListener();
      this.displayHome();
    }
  },  
  
  hide : function() {
    $('homeContainer').hide();
    $('home').hide();
    $('timeline').hide();
  },

  displayHome : function() {
    $$(".walkingCrowdMemeber")[0].show();

    if($$('.background')[0]){
      var newImg = Loader.images['timeline']['home_background.gif'].clone();
      $(newImg).addClassName("background");
      $$('.background')[0].insert({after:newImg});
      $$('.background')[0].remove();
    }
    
    this.walkingMan.moveTo();
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    homeDiv.hide();
    if(timelineDiv.getStyle('display') != 'none')
      Effects.fade(timelineDiv, function(){Effects.appear(homeDiv)});
    else
      Effects.appear(homeDiv);
    $('homeContainer').show()
  },

  displayCalender : function(){
    this.walkingMan.moveTo();
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
    this.walkingMan.moveTo();
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
      var ids = new Array();
      var missions = self.gameManager.missions[self.mode];
      for(var key in missions){
        ids.push(Number(missions[key].id));
      }
      function sortNumberAscending(a,b){
        return a - b;
      }
      ids = ids.sort(sortNumberAscending);
      console.log(missions)
      $$(".walkingCrowdMemeber")[0].hide();
      
      $('timeline').innerHTML = self.templateManager.load('missions', {'missions' : self.gameManager.missions[self.mode],
               'currentMission' : self.gameManager.userData.current_mission[self.mode], 'challenge' : challenge});

      var missionsDivs = $$(".missionMarker");
      for (var i=0; i < missionsDivs.length && i < ids.length; i++) {
        missionsDivs[i].setAttribute("missionId", ids[i]); 
      };
               
      self.attachMissionsListener();
      Game.addLoadedImagesToDiv('timeline');
      self.displayChallenges();
      $('timeline').show();
      
      var newImg = Loader.images['timeline']['map_background.gif'].clone();
      $(newImg).addClassName("background");
      $$('.background')[0].insert({after:newImg});
      $$('.background')[0].remove();
      
      // self.carousel = new Carousel("missions", self.images, 7, 2);
/*      if(challenge)
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
      }*/
      // self.carousel.center(self.currentMissionIndex);
      // self.carousel.checkButtons();
      // $('timeline').hide();
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
    var idString = id+"";
    if(id < 10) idString = "0" + idString;  

    var self = this;
    var callback =  function(){
      $$('.missionDetails')[0].hide();
      
      $$('#timeline .missionDetails')[0].innerHTML = self.templateManager.load('missionDetails', {'mission' : self.gameManager.missions[self.mode][id], 'id': idString});
      Game.addLoadedImagesToDiv('timeline');
      
      self.attachMissionDetailsListeners();
      $$('.missionDetails')[0].show();
    }
    new Loader().load([ {images : ["mission_"+ idString + ".jpg"], path: 'images/missions_images/', store: 'missions'}],
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
        var pos = element.getLayout().element.offsetLeft + element.getWidth()/2;  
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
        var gap = 20;
        var wgap = (960 - element.getWidth() * count - gap * (count-1)) / 2;
        var pos = wgap + element.getLayout().element.offsetLeft + element.getWidth()/2; 
        self.walkingMan.moveTo(pos-30);
      });
    });
  },

  attachMissionsListener : function(){
    var self = this;
    $$('#timeline .timelineMissions li').each(function(element){
      element.observe('mouseover', function(event) {
        element.addClassName('selected');
      });
      
      element.observe('mouseout', function(event) {
        element.removeClassName('selected');
      });
      
      element.observe('click', function(event) {
        self.displayMissionDetails(parseInt(element.getAttribute("missionid")));
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
