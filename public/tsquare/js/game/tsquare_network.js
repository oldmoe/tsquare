var TSquareNetwork = Class.create(Network, {

  gameData : function(callback){
    this.genericGetRequest( 'data', {},
                          function(response) { 
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
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
                      var data = JSON.parse(response.responseText);
                      if(callback) callback(data);
                    });
  },
  
  buy : function(options, callback){
    this.genericPostRequest( 'buy_market_item', {'category' : options.category, 'name' : options.name},
                          function(response) {
                            console.log(response);
                            if(callback) callback();
                          });
  },

  postMissionScore : function(id, score, callback){
    this.genericPostRequest( 'mission', {'id' : id, 'score' : score},
                    function(response) {
                      var data = JSON.parse(response.responseText);
                      if(callback) callback(data);
                    });
  },

});
