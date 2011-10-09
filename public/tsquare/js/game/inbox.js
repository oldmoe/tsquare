var Inbox = Class.create({

  requests : {help : [], gift : [], challenge : []},
  
  initialize : function(gameManager){
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    var self = this;
    new Loader().load([ {images : ["notifications_item.png", "title_inbox.png", "button_cancel.png", "confirm_button.png"],
                          path: 'images/notifications/', store: 'notifications' }, 
                        {images : ["close_button.png", ""], 
                          path: 'images/game_elements/', store: 'game_elements' },
                      ],
                      {
                        onFinish: function(){
                          self.imagesLoaded = true;
                          self.display();
                        }
                      });
    this.getInboxRequests();
  },

  display : function(){
    if(this.imagesLoaded && this.dataLoaded)
    {
      $('notifications').innerHTML = this.templateManager.load('notifications', {inbox : this});
    }    
  },

  acceptRequest : function(requestId){
  },
  
  cancelRequest : function(requestId){
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
  
  getInboxRequests : function(){
    var self = this;
    socialEngine.getAppRequests(function(requests){
      requests.each(function(request){
        var data = JSON.parse( request.data )
        //console.log(request)
        self.requests[ data.type ].push( request );
      }); 
      self.dataLoaded = true;
      self.display();
    });
  }

});
