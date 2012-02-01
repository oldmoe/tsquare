var TSquareNetwork = Class.create(Network, {

  gameData : function(urlParams, callback){
    var self = this;
    if( urlParams && urlParams['request_ids'] ) {
      var requestID = urlParams['request_ids'][0];
      FB.api('/?ids=' + requestID, function(response) {
                      socialEngine.deleteObject(requestID);
                      self.genericGetRequest( 'data', {request : response},
                          function(response) {
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
                  });
    } else {
      this.genericGetRequest( 'data', {},
                          function(response) {
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
    }
  },
  
  friends : function(ids, callback){
    this.genericGetRequest( 'friends', {'friends_ids' : ids},
                          function(response) {
                            var IDs = JSON.parse(response.responseText);
                            if(callback) callback(IDs);
                          });
  },
  
  globalScores : function(gameMode, callback){
    this.genericGetRequest( 'global_scores', {'game_mode' : gameMode},
                          function(response) {
                            var scores = JSON.parse(response.responseText);
                            if(callback) callback(scores);
                          });
  },

  missionData : function(id, callback){
    this.genericGetRequest( 'mission', {'id' : id},
                    function(response) {
                      if(callback) callback(JSON.parse(response.responseText));
                    });
  },
  
  buy : function(options, callback){
    this.genericPostRequest( 'buy_market_item', {'category' : options.category, 'name' : options.name},
                          function(response) {
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
  },
  
  heal : function(options, callback){
    this.genericPostRequest( 'heal', {'id' : options.memberID},
                          function(response) {
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
  },

  postMissionScore : function(id, score, callback){
    this.genericPostRequest( 'mission', {'id' : id, 'score' : score},
                    function(response) {
                      var data = JSON.parse(response.responseText);
                      if(callback) callback(data);
                    });
  }

});
