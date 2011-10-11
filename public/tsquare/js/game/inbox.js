var Inbox = Class.create({

  requests : {},
  
  initialize : function(gameManager){
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    this.gameManager = gameManager;
    var self = this;
    new Loader().load([ {images : ["notifications_item.png", "title_inbox.png", "button_cancel.png", "confirm_button.png"],
                          path: 'images/notifications/', store: 'notifications' }, 
                        {images : ["window_background.png"], 
                          path: 'images/marketplace/', store: 'marketplace' },
                        {images : ["close_button.png"], 
                          path: 'images/game_elements/', store: 'game_elements' }
                      ],
                      {
                        onFinish: function(){
                          self.imagesLoaded = true;
                          self.display();
                        }
                      });
    this.getInboxRequests();
  },

  show : function(){
    $('notifications').show();
  },

  hide : function(){
    $('notifications').hide();
  },

  display : function(){
    var self = this;
    if(this.imagesLoaded && this.dataLoaded)
    {
      $('notifications').innerHTML = this.templateManager.load('notifications', {inbox : this});
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
    if(this.sortedRequests.length == 0)
    {
      this.hide();
      return;
    }
    $$('#notifications .notificationWrapper')[0].innerHTML = this.templateManager.load('notificationsList', 
            {list : this.sortedRequests.slice(0, 3)});
    var userIDs = this.sortedRequests.slice(0, 3).collect(function(request){return request.from.id});
    socialEngine.getUsersInfo(userIDs, function(users){
      users.each(function(user){
        $$('.notificationItem .notificationImage img').each(function(image){
          if(image.id == user.uid) 
          {
            image.src = user.pic_square;
          }
        });
      })
    });
    $$('.notificationActions .confirmButton').each(function(button){
      button.observe('click',  function(){self.acceptRequest(button.getAttribute('requestId'))});
    });
    $$('.notificationActions .cancelButton').each(function(button){
      button.observe('click',  function(){self.cancelRequest(button.getAttribute('requestId'))});
    });
  },

  acceptRequest : function(requestId){
    this.network.genericPostRequest('requests/accept', {request_id : requestId, from : this.requests[requestId]['from']['id']});
    delete(this.requests[requestId]);
    var self = this;
    socialEngine.deleteObject(requestId, function(){ self.displayList() });
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
  
  getInboxRequests : function(){
    var self = this;
    socialEngine.getAppRequests(function(requests){
      requests.each(function(request){
        var data = JSON.parse( request.data )
        //console.log(request)
        self.requests[request.id] = request;
      }); 
      self.dataLoaded = true;
      self.noOfRequests = requests.length;
      self.display();
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
  }

});
