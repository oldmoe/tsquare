var game = null;
var GameManager = Class.create({
  
  initialize : function(urlParams){
    var self = this;
    this.urlParams = urlParams;
    this.network = new TSquareNetwork();
    this.loader = new Loader();
    var loadingImages =['loading_background.png','loadingbar_left.png','loadingbar_right.png',
    'loadingbar_middle.png','bar_background.png','background.png'];
  	var format = 'mp3';
    this.templateManager = new TemplatesManager(function(){
      new Loader().load([{images : loadingImages, path: 'images/loading/', store: 'loading'}, 
                        {sounds: ['intro.mp3', 'menus_background.mp3'], path: 'sounds/'+format+'/intro/', store: 'intro'}]
          ,{
            onFinish: function(){
              $('inProgress').innerHTML = self.templateManager.load('loadingScreen');
              $('uiContainer').hide();
              var time = Loader.sounds.intro['intro.mp3'].duration;
              setTimeout(function(){
                            self.soundPlayed = true;
                            if(self.imagesLoaded && self.soundPlayed)
                            {
                              Loader.sounds.intro['intro.mp3'].stop();
                              Loader.sounds.intro['menus_background.mp3'].play();
                              $('inProgress').hide();
                              self.selectLanguage("en");
                              self.langSetted = true;
                            }}, time);
              Loader.sounds.intro['intro.mp3'].play();
              $('inProgress').show();
              self.processParams(self.urlParams, function(data){self.processRequest(data)});
            }
          }
      )
    });
	this.reactor = new Reactor();
    Effect.Queues.create('global', this.reactor)
    this.reactor.run();
  },

  initializeData : function(data){
    var self = this;
    self.userData = data.user_data.data;
    self.userData.coins = data.user_data.coins;
    self.gameData = data.game_data.data;
    self.missions = data.missions_data.data;
    this.loader.options.push({
                          onProgress : function(progress){
                            if($$('#inProgress #loadingBarFill')[0])
                              $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
                          },
                          onFinish : function(){
                            self.imagesLoaded = true;
                            if(self.imagesLoaded && self.soundPlayed)
                            {
                              Loader.sounds.intro['intro.mp3'].stop();
                              $('inProgress').hide();
                              if (!self.langSetted) {
                                self.langSetted = true
                                self.selectLanguage("en");
                              }
                            }
                          }
                       });
    self.meterBar = new MeterBar(this);
    self.scoreManager = new ScoreManager(this);
    self.inbox = new Inbox(this);
    self.marketplace = new Marketplace(this);
    self.timelineManager = new Timeline(this);
    self.missionManager = new MissionManager(this);
    if(!self.game)game = new Game(this);
    self.game = game;
  },
  
  setupLangScreen: function() {
  	var self = this;
  	$$('.langBtn').each(function(option) {
  	  option.observe('click', function() {
  	  	self.selectLanguage(option.children[0].alt);
  	  });
  	});
  },
  
  selectLanguage: function(lang) {
  	if (lang == 'عربي') {
  	  game.properties.lang = 'ar';
  	  $(document.body).addClassName('ar');
  	} else {
  	  game.properties.lang = 'en';
      $(document.body).removeClassName('ar');
  	}
    $('uiContainer').show();
    // TODO: implement proper re-rendering mechanism
    this.scoreManager.reset();
  	this.timelineManager.display();
    this.meterBar.display()
  },

  start : function(){
    var self = this;
    var callback = function(data) {
      self.initializeData(data);
    }
    this.network.gameData(callback);
  },
  
  playMission : function(id){
    var self = this;
    self.currentMissionID = id;
    $$('#uiContainer .background')[0].hide();
    self.meterBar.hide();
    self.timelineManager.hide();
    self.scoreManager.hide();
    self.missionManager.hide();
    self.game.show();
    this.missionManager.load(id, function(data){
      self.game.play(data.mission.data, function(){
        self.userData.crowd_members = userData.crowd_members = data.crowd_members;
      });
    });
  },

  replayMission : function(){
    this.playMission( this.currentMissionID );
  },

  openMainPage : function(){
    var self = this;
    if($('gameContainer').getStyle('display') != 'none')
    {
      this.missionManager.hide();
      self.meterBar.hide();      
      self.scoreManager.hide();
      self.timelineManager.hide();
      Effects.fade($('gameContainer'), function(){
        Effects.appear($$('#uiContainer .background')[0], function(){
          self.meterBar.show();
          self.scoreManager.show();
          self.timelineManager.display();
        });
      });
    }else{
      self.timelineManager.display();
    }
  },

  /* If there is a request object acceptance has lead to opening the game, 
    This function should handle it, and respond properly 
    example : request['date']['type'] = 'challenge'
    then open in the game on the mission page */
  processRequest : function(request){
    this.start();
  },

  /* This function is to process url params ... if a request:
        Retrieve request object
        Send accept request to the server
        Delete request from user requests on social network
  */
  processParams : function(params, gameCallback){
    if (params['request_ids']) {
      params['request_ids'] = params['request_ids'].split("%")
      this.notifyFirst = params['request_ids'];
      var callback = function(requests_data){
        var requestData = {};
        gameCallback(requestData);
      }
      socialEngine.getObject(params, callback);
    }
    else {
      gameCallback();
    }
  }


});
