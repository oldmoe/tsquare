var Inbox = Class.create({

  requests : {},

  listeners : [],

  initialize : function(gameManager){
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    this.usersInfo = null;
    var self = this;
    this.gameManager.loader.load([ {images : ["notifications_item.png", "title_inbox.png", "button_cancel.png", "confirm_button.png"],
                          path: 'images/notifications/', store: 'notifications' }, 
                          {images_ar : ["title_inbox.png"],
                          path: 'images/ar/notifications/', store: 'notifications' }, 
                        {images : ["window_background.png"], 
                          path: 'images/marketplace/', store: 'marketplace' },
                        {images : ["close_button.png"],
                          path: 'images/game_elements/', store: 'game_elements' },
                        {images : ["facebook_image_large.png"],  
                          path: 'images/dummy/', store: 'dummy' }
                      ],
                      {
                        onFinish: function(){
                          self.imagesLoaded = true;
                          self.display({ifany : true});
                        }
                      });
    this.getInboxRequests(function(){self.display({ifany : true})});
  },

  show : function(){
     Effects.appear($('notifications'));
  },

  hide : function(){
     Effects.fade($('notifications'));
  },

  display : function(options){
    var self = this;
    if(this.imagesLoaded && this.dataLoaded) {
      $('notifications').innerHTML = this.templateManager.load('notifications', {inbox : this});
      if( this.noOfRequests > 0 && options.ifany ) self.show();
      $$('.notifications .close a').each(function(button){
        button.observe('click',  function(){self.hide()});
      });
      this.displayList();
      Game.addLoadedImagesToDiv('notifications');
    }    
  },

  displayList : function(){
    var self = this;
    this.sortRequests();
    $$('#notifications .notificationWrapper')[0].innerHTML = this.templateManager.load('notificationsList', 
            {list : this.sortedRequests});
    Game.addLoadedImagesToDiv('notificationWrapper');
    if(!this.usersInfo)
    {
      var userIDs = this.sortedRequests.slice(0, 3).collect(function(request){return request.from.id});
      socialEngine.getUsersInfo(userIDs, function(users){
        self.usersInfo = users;
        users.each(function(user){
          $$('.notificationItem .notificationImage img').each(function(image){
            if(image.id == user.uid) 
            {
              image.src = user.pic_square;
            }
          });
        })
      });
    }else{
      this.usersInfo.each(function(user){
        $$('.notificationItem .notificationImage img').each(function(image){
          if(image.id == user.uid) 
          {
            image.src = user.pic_square;
          }
        });
      })
    }
    $$('.notificationActions .confirmButton').each(function(button){
      button.observe('click',  function(){self.acceptRequest(button.getAttribute('requestId'))});
    });
    $$('.notificationActions .cancelButton').each(function(button){
      button.observe('click',  function(){self.cancelRequest(button.getAttribute('requestId'))});
    });
  },

  acceptRequest : function(requestId){
    this.network.genericPostRequest('requests/accept', {request_id : requestId, from : this.requests[requestId]['from']['id']});
    var request = this.requests[requestId];
    delete(this.requests[requestId]);
    var self = this;
    new Effect.BlindUp($$('.notificationWrapper')[0].select(".notificationItem[requestId=" + requestId + "]")[0], 
                        { afterFinish: function(){
                            self.displayList();
                            if(request.data.type=='challenge')          
                            {
                              self.hide();
                              self.gameManager.timelineManager.displayMissions(request);
                            }
                          }, 
                          duration : 0.3
                        });
    socialEngine.deleteObject(requestId);
  },
  
  cancelRequest : function(requestId){
    delete(this.requests[requestId]);
    var self = this;
    socialEngine.deleteObject(requestId, function(){ self.displayList() });
  },
  
  requestTrigger : function(requestType){
    $("request_" + requestType + "_button").observe("click", function(event){
      var request = {};
      request['data'] = {type : requestType};
      request['message'] = "Can you please " + requestType + " me?";
      request['title'] = requestType + " me!"
      socialEngine.requestFromAll( request, function(response){
        //Here we should contact the server to save the request details, for exclusion and timeout conditions
        //console.log( response );
      } )
    })
  },
  
  getInboxRequests : function(callback){
    var self = this;
    socialEngine.getAppRequests(function(requests){
      requests.each(function(request){
        if(request.data)
          request.data = JSON.parse( request.data );
        else
          request.data = {};
          
        self.requests[request.id] = request;
      }); 
      self.dataLoaded = true;
      self.noOfRequests = requests.length;
      self.listeners.each(function(listener){
        listener();
      });
      if(callback) callback();
    });
  },

  sortRequests : function(){
    var self = this;
    this.sortedRequests = [];
    for(var i in this.requests)
    {
      this.sortedRequests.push(this.requests[i]);
    }    
    this.sortedRequests = this.sortedRequests.sortBy(function(request){ 
      if(self.gameManager.notifyFirst && self.gameManager.notifyFirst.indexOf(request.id) > -1) 
        return 0;
      else
        return request.id 
    }).reverse();
  },

  challenges : function(callback){
    var self = this;
    var challenges = [];
    loadingCallback = function(){
      for(var i in self.requests)
      {
        if(self.requests[i]['data']['type'] == 'challenge')
          challenges.push(self.requests[i]);
      }
      callback(challenges)
    }
    if(!this.dataLoaded)
    {
      this.listeners.push(loadingCallback)
    }else{
      loadingCallback();  
    }

  }

});
