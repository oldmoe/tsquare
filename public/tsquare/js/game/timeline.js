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
    var self = this;
    new Loader().load([ {images : ["calendar_25_jan.png", "calendar_26_jan.png", "calendar_27_jan.png", "coming_soon_missions.png",
                                  "home_background.gif", "mission_details.png", "timeline_screen.png", "mission_current.png",
                                  "mission_locked.png", "mission_finished.png", "crowd_member_small.png",
                                  "mission_icon_selected.png", "play_button.png", "timeline.png"], path: 'images/timeline/', store: 'timeline'}],
                      {
                        onFinish: function(){
                          self.display();
                        }
                      });
  },

  display : function(){
    $('home').innerHTML = this.templateManager.load('home', {'missions' : this.gameManager.missions});
    Game.addLoadedImagesToDiv('home');
    this.attachHomeListener();
    this.displayHome();
  },  
  
  hide : function(){
    $('home').hide();
    $('timeline').hide();
  },

  displayHome : function() {
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    homeDiv.hide();
    if(timelineDiv.getStyle('display') != 'none')
      Effects.fade(timelineDiv, function(){Effects.appear(homeDiv)});
    else
      Effects.appear(homeDiv);
  },

  displayCalender : function(){
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

  displayMissions : function(){
    var self = this;
    if(this.carousel) 
    {
      this.carousel.destroy();
    }
    var currentMissionIndex = 0;
    for(var i in this.gameManager.missions[this.mode])
    {
      if(this.gameManager.userData.missions[this.mode][i] || this.gameManager.userData.current_mission[this.mode] == i)
        this.gameManager.missions[this.mode][i]['playable'] = true;
      else
        this.gameManager.missions[this.mode][i]['playable'] = false;
    }
    for(var i in this.gameManager.missions[this.mode])
    {
      if(this.gameManager.userData.current_mission[this.mode] != i)
        currentMissionIndex += 1;
      else
        break;
    }
    var callback = function() {
      $('timeline').innerHTML = self.templateManager.load('missions', {'missions' : self.gameManager.missions[self.mode],
               'currentMission' : self.gameManager.userData.current_mission[self.mode]});
      self.attachMissionsListener();
      Game.addLoadedImagesToDiv('timeline');
      $('timeline').show();
      self.carousel = new Carousel("missions", self.images, 7, 2);
      self.carousel.center(currentMissionIndex);
      self.carousel.checkButtons();
      $('timeline').hide();
    }
    var homeDiv = $('home');
    var timelineDiv = $('timeline');
    var missionsDiv = $('missions');
    $('home').hide();
    if($$('.calendarWrapper')[0].getStyle('display') != 'none')
    {
      Effects.fade(timelineDiv, function(){
        callback();
        Effects.appear(timelineDiv);
      });
    } else {
      Effects.appear(timelineDiv);
    }
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
    });
  },

  attachCalenderListener : function(){
    var self = this;
    $$('#timeline .calendar').each(function(element){
      element.observe('click', function(event){
        self.displayMissions();
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
