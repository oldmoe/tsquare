var SocialEngine = Class.create(FBConnect, {

  /*
    Set currentUser field
    Megre the scoring data with the social data(name, picture) in one Array 
  */
  fillSocialData : function(userList, socialData){
    var self = this;
    var socialDataHash = {};
    socialData.each(function(user){ socialDataHash[user.uid] = user });
    // Fill social data
    var invalid = [];
    userList.each(function(user, index){
                    if(user.service_id == socialEngine.userId())  self.currentUser = user;
                    if(socialDataHash[user.service_id])
                    {
                      user.name = socialDataHash[user.service_id].name;
                      user.first_name = socialDataHash[user.service_id].first_name;
                      user.last_name = socialDataHash[user.service_id].last_name;
                      user.picture = socialDataHash[user.service_id].pic_square;
                      user.url = socialDataHash[user.service_id].profile_url;
                    }else{
                      invalid.push(index);
                    }
                  });
    invalid.each(function(index){
      userList.splice(index, 1);
    });
  },

  inviteFriends : function(){
    socialEngine.requestFromNoneAppUsers({'title' :'Invite your friends', 'message':'Revolt with me !!!'}, function(){});
  },

  sendRequest : function(request){
    var fbCallback = function(requests_data){
      var requests = {};
      for(var i in requests_data)
      {
        time = new Date(requests_data[i]['created_time'].gsub('-','/').gsub('T', ' ').split('+')[0]);
        requests[i] = { 'to' : requests_data[i]['to']['id'],
                        'timestamp' : time.getTime()/1000, 
                        'data' : requests_data[i]['data'] };
      }
      game.network.genericPostRequest('requests', {requests : requests})
    };
    game.network.fetchTemplate('requests/exclude', function(response){
      request['exclude_ids'] = JSON.parse(response).join(",")
      FBConnect.sendRequest(request, fbCallback)
    });
  }
  
});
