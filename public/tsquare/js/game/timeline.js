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
                                  "mission_current.png", "mySquare_screen.png","stars.png",
                                  "mission_locked.png", "mission_finished.png", "crowd_member_small.png", "challenge_box.png", "lock.png",
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
      
      if(!this.gameManager.missions[this.mode][i].locked && (this.gameManager.userData.missions[this.mode][i] || this.gameManager.userData.current_mission[this.mode] == i))
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

  getNextMissions : function(id, missions){
    var ids = new Array();
    var next = id;
    for(var key1 in missions){
      var found = false;
      for(var key in missions){
        if(missions[key].next == next){
          ids.push(Number(missions[key].id));
          next = Number(missions[key].id);
          found = true;
          continue;
        }
      }
      if(!found)break;
    }
    return ids.reverse();
  },
  
  displayMissions : function(challenge){
    var self = this;
    this.adjustMissionsData();
    
    var callback = function() {
      var ids = [];
      var missions = self.gameManager.missions[self.mode];
      for(var key in missions){
        var id = Number(missions[key].id);
        if(missions[key].next == 0){
          var chain = self.getNextMissions(id, missions);
          chain.push(id);
          ids = ids.concat(chain);
          console.log(ids);
        }
      }
      
      $$(".walkingCrowdMemeber")[0].hide();
      
      $('timeline').innerHTML = self.templateManager.load('missions', {'missions' : self.gameManager.missions[self.mode],
               'currentMission' : self.gameManager.userData.current_mission[self.mode], 'challenge' : challenge});
               
      self.attachMissionsListener();
      Game.addLoadedImagesToDiv('timeline');
      self.displayChallenges();

      var missionsDivs = $$(".missionMarker");
      for (var i=0; i < missionsDivs.length; i++) {
        missionsDivs[i].children[1].setStyle({display:'block'});
        if(i < ids.length){
          missionsDivs[i].setAttribute("missionid", ids[i]);
          if(self.gameManager.missions[self.mode][ids[i]].playable == false){
            missionsDivs[i].firstChild.addClassName("disabled");
          }else{
            missionsDivs[i].children[1].setStyle({display:'none'});
          }
          if(ids[i] == Number(self.gameManager.userData.current_mission[self.mode])){
            missionsDivs[i].firstChild.addClassName("current");
          }
        }else{
          missionsDivs[i].firstChild.addClassName("disabled");
        } 
      };

      $('timeline').show();
      
      var newImg = Loader.images['timeline']['map_background.gif'].clone();
      $(newImg).addClassName("background");
      $$('.background')[0].insert({after:newImg});
      $$('.background')[0].remove();
      
      if(challenge)
      {
        var challengeDiv = $$('.timelineMissions .friendScore')[0];
        if(challengeDiv)
        {
          challengeDiv.show();
          var element = $$('.timelineMissions')[0].select('[missionid='+challenge.data.mission+']')[0];
          $(challengeDiv).setStyle({top: ($(element).positionedOffset().top-17)+"px", left: ($(element).positionedOffset().left-78)+"px"});
          challengeDiv.setStyle({'zIndex':11});
        }
      }
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

    $$('#home .timelineButton')[0].observe('click', function(event){
        self.displayCalender();
      });

    $$('#home .timelineButton').each(function(element){
      element.observe('mouseover', function(event){
        var pos = element.getLayout().element.offsetLeft + element.getWidth()/2;  
        self.walkingMan.moveTo(pos-30);
      });
    });
  },

  attachCalenderListener : function(){
    var self = this;

    $$('#timeline .calendar')[0].observe('click', function(event){
        self.displayMissions();
    });

    $$('#timeline .calendar').each(function(element){
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
        var mission  = self.gameManager.missions[self.mode][element.getAttribute("missionid")];
        if(mission && !mission.locked){
          var stars = [0,0,0];
          if(mission.score.stars ==  1)
            stars = [1,0,0];
          else if(mission.score.stars ==  2)
            stars = [1,1,0];
          else if(mission.score.stars ==  3)
            stars = [1,1,1];
          var missionTitle = self.templateManager.load('missionTitle', {'title':mission.name, 'stars':stars});
          var container = $$(".timelineMissions")[0];
          container.insert({bottom:missionTitle});
          Game.addLoadedImagesToDiv('missionTitle'); 
          missionTitle = container.children[container.children.length-1]; 
          $(missionTitle).setStyle({top: ($(element).positionedOffset().top-45)+"px", left: ($(element).positionedOffset().left-70)+"px"});
        }
      });
      
      element.observe('mouseout', function(event) {
        element.removeClassName('selected');
        var elem = $$(".timelineMissions .missionTitle")[0];
        if(elem)elem.remove();
      });
      
      element.observe('click', function(event) {
        var mission = self.gameManager.missions[self.mode][parseInt(element.getAttribute("missionid"))];
        if(mission && !mission.locked)
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
