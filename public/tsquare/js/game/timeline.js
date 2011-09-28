var Timeline = Class.create({
  

  initialize : function(gameManager){
    /* This should be MOVED to initialize game part */
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    this.mode = 'timeline';
    var self = this;
    new Loader().load([ {images : ["calendar_25_jan.png", "calendar_26_jan.png", "calendar_27_jan.png", "coming_soon_missions.png",
                                  "home_background.gif", "timeline_screen.png"], path: 'images/timeline/', store: 'timeline'}],
                      {
                        onFinish: function(){
                          self.display();   
                        }
                      });
  },

  display : function(){
    $('home').innerHTML = this.templateManager.load('home', {'missions' : this.gameManager.missions});
    $('timeline').innerHTML = this.templateManager.load('timeline', {'missions' : this.gameManager.missions[this.mode]});
    this.attachListener();
    Game.addLoadedImagesToDiv('home');
    Game.addLoadedImagesToDiv('timeline');
    this.displayHome();
  },  
  
  hide : function(){
    $('home').hide();
    $('timeline').hide();
  },

  displayHome : function() {
    $('home').show();
    $('timeline').hide();
  },

  displayTimeline : function(){
    $('home').hide();
    $$('.calendarWrapper')[0].show();
    $('missions').hide();
    $('timeline').show();
  },

  displayMissions : function(){
    $('home').hide();
    $$('.calendarWrapper')[0].hide();
    $('missions').show();
    $('timeline').show();
  },

  displayMissionDetails : function(id){
    var id = parseInt(id);
    $$('#timeline .missionDetails')[0].innerHTML = this.templateManager.load('missionDetails', {'mission' : this.gameManager.missions[this.mode][id]});
    Game.addLoadedImagesToDiv('timeline');
    this.attachMissionDetailsListeners();
    $$('.missionDetails')[0].show();
  },

  hideMissionDetails : function(){
    $$('.missionDetails')[0].hide();
  },

  attachListener : function(){
    var self = this;
    $$('#home .timelineButton').each(function(element){
      element.observe('click', function(event){
        self.displayTimeline();
      });
    });
    $$('#timeline .calendar').each(function(element){
      element.observe('click', function(event){
        self.displayMissions();
      });
    });
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
    $$('#timeline .missionDetails .playButton')[0].observe('click', function(event){
      console.log(event.element());
      self.gameManager.playMission(event.element().id);
    });
  }

});
