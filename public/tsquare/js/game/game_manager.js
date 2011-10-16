var game = null;
var GameManager = Class.create({
  
  initialize : function(urlParams){
    var self = this;
    this.urlParams = urlParams;
    this.network = new TSquareNetwork();
    this.loader = new Loader();
    var loadingImages =['loading_background.png','loadingbar_left.png','loadingbar_right.png',
    'loadingbar_middle.png','bar_background.png','background.png'];
    this.templateManager = new TemplatesManager(function(){
      new Loader().load([{images : loadingImages, path: 'images/loading/', store: 'loading'}]
          ,{
            onFinish: function(){
              $('inProgress').innerHTML = self.templateManager.load('loadingScreen');
              $('uiContainer').hide();
              $('inProgress').show();
              self.processParams(self.urlParams, function(data){self.processRequest(data)});
            },
          }
      )
    });
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
    self.loader.options.push({
                          onProgress : function(progress){
                            if($$('#inProgress #loadingBarFill')[0])
                              $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
                          },
                          onFinish : function(){
                            $('inProgress').hide();
                            $('uiContainer').show();
                          }
                        })
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
