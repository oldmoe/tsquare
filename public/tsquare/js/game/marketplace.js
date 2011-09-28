var Marketplace = Class.create({
  moves : {},
  members : {},
  items : {},
  powerups : {},
  special : {},
  crowd_items :{},
  
  columns : 5,
  itemWidth : 136,
  rows : 2,
  
  initialize : function(gameManager){
    this.gameManager = gameManager;
    this.network = this.gameManager.network;
    this.templateManager = this.gameManager.templateManager;
    
    var gameData = gameManager.gameData;
    this.moves = gameData.commands;
    this.members = gameData.crowd_members;
    this.items = gameData.holder_items;
    this.powerups = gameData.power_ups;
    this.special = gameData.special_items;
    this.crowd_items = gameData.crowd_items;
    
    this.myMembers = this.gameManager.userData.crowd_members;
    
    new Loader().load([ {images : ["my_stuff_title.png", "buy_window_title.png", "close_button.png", "tab_background.png"],
                                     path: 'images/marketplace/', store: 'marketplace'}], {
      onFinish : function(){}
    });
    
    
    var self = this;
    
    this.adjustedMyMembers = this.adjustMyMembers();
    
    this.adjustedMembers = [];
    var membersImages = [];
    
    for(var item in this.members['specs']){
      var specs = this.gatherSpecs(item);
      var specIds = specs.specIds;
      var memberSpecs = specs.memberSpecs;
      
      this.adjustedMembers.push({name : item, specs : memberSpecs, specIds : specIds, buyID : this.members['specs'][item]['buyID']});
      membersImages.push(item + ".png");
    }
    new Loader().load([ {images : membersImages, path: 'images/marketplace/members/', store: 'marketplace'}], {
      onFinish : function(){}
    });
  },
  
  gatherSpecs : function(memberName){
    var specIds = [];
    var memberSpecs = {};
    for(var spec in this.members['specs'][memberName]['1']){
      if (spec == "special") {
        for (var specialSpec in this.members['specs'][memberName]['1']['special']) {
          memberSpecs[specialSpec] = this.members['specs'][memberName]['1']['special'][specialSpec];
          specIds.push( specialSpec );
        }
      } else {
        memberSpecs[spec] = this.members['specs'][memberName]['1'][spec];
        specIds.push( spec );
      }
    }
    
    return {specIds : specIds, memberSpecs : memberSpecs};
  },
  
  adjustMyMembers : function(){
    var adjustedMyMembers = []
    for(var memberName in this.myMembers){
      var specs = this.gatherSpecs( memberName );
      var specIds = specs.specIds;
      var memberSpecs = specs.memberSpecs;
      for(var memeberID in this.myMembers[memberName]){
        adjustedMyMembers.push( {name : memberName, specs : memberSpecs, specIds : specIds, memberID : memeberID} )
      }
    }
    return adjustedMyMembers;
  },
  
  buy : function(options){
    if(!options.buyID.empty()) {
      socialEngine.buyItem( options.buyID );
    } else {
      this.network.buy(options, function(responseData){
        console.log( "toot" )
        $('dialogBox').show();
      });
    }
  },
  
  renderFloatingItems : function(categoryItems, screen){
    $$('#floatingItems')[0].innerHTML = this.templateManager.load('floatingItems', { categoryItems: categoryItems, screen : screen });
    Game.addLoadedImagesToDiv('marketplace');
    $$('#floatingItems li div.crowedItem div.crowedItemImage img').each(function(img){
      var offsetLeft = $(img.id + '_container').offsetLeft + 136;
      var offsetTop = $(img.id + '_container').offsetTop;
      if( offsetTop > 0 ) offsetTop = 90;
      if( offsetLeft > 408 ){
        offsetLeft -= 215+136;
      }
      $(img.id + '_details').setStyle({left : offsetLeft + 'px', top : offsetTop + 'px'});
      img.observe('mouseover', function(event){ $(img.id + '_details').show(); });
      img.observe('mouseout', function(event){ $(img.id + '_details').hide(); });
    });
    this.containerWidth = Math.ceil( categoryItems.size() / this.rows) * this.itemWidth;
    this.containerWidth = Math.max( this.containerWidth, this.columns * this.itemWidth );
    $$('#floatingItems ul')[0].setStyle( { width: this.containerWidth + 'px' } );
    
    this.adjustNavigators('floatingItems');
  },
  
  openMarketplace : function(myStuff){
    var self = this;
    var screen = myStuff ? 'myStaff' : 'marketplace'
    $('marketplace').innerHTML = this.templateManager.load('marketplace', {screen : screen});
    
    var categoryItems = myStuff ? self.adjustedMyMembers : self.adjustedMembers;
    
    //Attaching triggers to the market placetabs
    $('marketMembers').stopObserving('click');
    $('marketMembers').observe('click', function(event){
      self.renderFloatingItems(categoryItems, screen);
      $('marketMembers').parentNode.addClassName("selected");
    });
    
    //Loading the template of the auto selected tab
    self.renderFloatingItems(categoryItems, screen);
    if( myStuff ){
      $$('.linkMembers').each(function(link){
        link.observe("click", function(event){
          var request = {};
          request['data'] = {type : 'link_a_friend', memberID : link.id};
          request['message'] = "Would you like to play in my team? We have a revolution to do!";
          request['title'] = "Join my team!"
          socialEngine.sendRequest( request, function(response){
            //Here we should contact the server to save the request details, for exclusion and timeout conditions
            //console.log( response );
          } )
        });
      });
    }
      
    $$('#marketplace .close')[0].stopObserving('click');
    $$('#marketplace .close')[0].observe('click', function(event){
      $('marketplace').innerHTML = "";
    })
  },
  
  adjustNavigators : function(marketTab){
    var self = this;
    var getIntegerStyle = function(stringStyle){
      var length = stringStyle.length;
      return Number(stringStyle.substr(0, length-2));
    }
    var left = getIntegerStyle( $$('#' + marketTab + ' ul')[0].getStyle('marginLeft') );
    //Adjusting left controls states
    if( left == 0 ){
      $$('.leftControls a')[0].removeClassName('selected');
      $$('.leftControls a')[1].removeClassName('selected');
    } else {
      $$('.leftControls a')[0].addClassName('selected');
      $$('.leftControls a')[1].addClassName('selected');
    }
    
    //Adjusting right controls states
    var right = self.containerWidth + left - ( self.columns * self.itemWidth );
    if( right == 0 ){
      $$('.rightControls a')[0].removeClassName('selected');
      $$('.rightControls a')[1].removeClassName('selected');
    } else {
      $$('.rightControls a')[0].addClassName('selected');
      $$('.rightControls a')[1].addClassName('selected');
    }
    
    
    $$('.leftControls a')[0].stopObserving('click');
    $$('.leftControls a')[1].stopObserving('click');
    $$('.rightControls a')[0].stopObserving('click');
    $$('.rightControls a')[1].stopObserving('click');
    
    
    $$('.leftControls a')[0].observe('click', function(event){
      if( left != 0 ){
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left + self.itemWidth)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
    $$('.leftControls a')[1].observe('click', function(event){
      if( left != 0 ){
        var maxShift = Math.min( self.columns*self.itemWidth, -left );
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left + maxShift)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
    $$('.rightControls a')[0].observe('click', function(event){
      if (right != 0) {
        $$('#' + marketTab + ' ul')[0].setStyle({marginLeft: (left - self.itemWidth) + 'px'});
        self.adjustNavigators(marketTab);
      }
    });
    $$('.rightControls a')[1].observe('click', function(event){
      if( right != 0 ){
        var maxShift = Math.min( self.columns*self.itemWidth, right );
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left - maxShift)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
  }
});
