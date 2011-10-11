var game = null;
var GameManager = Class.create({
  
  initialize : function(urlParams){
    var self = this;
    this.urlParams = urlParams;
    this.network = new TSquareNetwork();
    this.templateManager = new TemplatesManager(this.network);
    this.processParams(this.urlParams, function(data){self.processRequest(data)});
		this.reactor = new Reactor();
    Effect.Queues.create('global', this.reactor)
    this.reactor.run();
  },

  initializeData : function(data){
    self = this;
    self.userData = data.user_data.data;
    self.userData.coins = data.user_data.coins;
    self.gameData = data.game_data.data;
    self.missions = data.missions_data.data;
    self.meterBar = new MeterBar(self);
    self.scoreManager = new ScoreManager(self);
    self.inbox = new Inbox(self);
    self.marketplace = new Marketplace(self);
    self.timelineManager = new Timeline(self);
    self.missionManager = new MissionManager(self);
    game = new Game(self);
    self.game = game;
  },

  start : function(){
    var self = this;
    var callback = function(data) {
      self.initializeData(data);
      $('uiContainer').show();
    }
    this.network.gameData(callback);
  },
  
  playMission : function(id){
    var self = this;
    $$('#uiContainer .background')[0].hide();
    self.meterBar.hide();
    self.timelineManager.hide();
    self.scoreManager.hide();
    self.missionManager.hide();
    self.game.show();
    this.missionManager.load(id, function(missionData){
      self.game.play(missionData.data);
    });
  },

  replayMission : function(){
    this.game.start();
  },

  openMainPage : function(){
    $$('#uiContainer .background')[0].show();
    $('gameContainer').hide();
    this.missionManager.hide();
    this.meterBar.show();
    this.scoreManager.show();
    this.timelineManager.display();
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
    if(params['request_ids'])
    {
      params['request_ids'] = params['request_ids'].split("%")
      this.notifyFirst = params['request_ids']; 
      var callback = function(requests_data){
        var requestData = {};
        gameCallback(requestData);
      }
      socialEngine.getObject(params, callback);
    }
    else 
      gameCallback();
  }


});
