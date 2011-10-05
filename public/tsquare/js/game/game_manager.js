var game = null;
var GameManager = Class.create({
  
  initialize : function(urlParams){
    var self = this;
    this.urlParams = urlParams;
    this.network = new TSquareNetwork();
    this.templateManager = new TemplatesManager(this.network);  
    this.processParams(urlParams, function(data){self.processRequest(data)});
		this.reactor = new Reactor();
    Effect.Queues.create('global', this.reactor)
    this.reactor.run();
  },

  initializeData : function(data){
    self = this;
    self.userData = data.user_data.data;
    self.userData.crowd_members = data.user_data.data.crowd_members;
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
    var callback = function(requests_data){
      var requestData = {};
      if(params['request_ids'])
      {
        console.log( params['request_ids'],  requests_data);
        var requestData = requests_data[params['request_ids']];
        console.log( "!@!@!@@!!@!@!@!@", requestData);
        if(params['request_ids'])
        {
          gameManager.network.genericPostRequest('requests/accept', {request_id : params['request_ids'], from : requestData['from']['id']});
          socialEngine.deleteObject(params['request_ids']);
        }
      }
      gameCallback(requestData);
    }
    socialEngine.getObject(params['request_ids'], callback);
  }


});
