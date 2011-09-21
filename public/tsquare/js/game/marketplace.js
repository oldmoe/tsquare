var Marketplace = Class.create({
  moves : {},
  members : {},
  items : {},
  powerups : {},
  special : {},
  crowd_items :{},
  
  columns : 5,
  itemWidth : 137,
  rows : 2,
  
  initialize : function(gameManager){
    this.gameManager = gameManager;
    this.network = this.gameManager.network;
    this.templateManager = this.gameManager.templateManager;
    var itemsData = gameData;
    
    this.moves = itemsData.commands;
    this.members = itemsData.crowd_members;
    this.items = itemsData.holder_items;
    this.powerups = itemsData.power_ups;
    this.special = itemsData.special_items;
    this.crowd_items = itemsData.crowd_items;
    
    this.myMembers = this.gameManager.userData.crowd_members;
    
    new Loader().load([ {images : ["my_stuff_title.png", "buy_window_title.png", "close_button.png", "tab_background.png"],
                                     path: 'images/marketplace/', store: 'marketplace'}], {
      onFinish : function(){}
    });
    
    
    var self = this;
    
    this.adjustedMyMembers = [];
    
    this.adjustedMembers = [];
    var membersImages = [];
    
    for(var item in this.members['specs']){
      var specIds = [];
      var memberSpecs = {};
      for(var spec in this.members['specs'][item]['1']){
        if (spec == "special") {
          for (var specialSpec in this.members['specs'][item]['1']['special']) {
            memberSpecs[specialSpec] = this.members['specs'][item]['1']['special'][specialSpec];
            specIds.push( specialSpec );
          }
        } else {
          memberSpecs[spec] = this.members['specs'][item]['1'][spec];
          specIds.push( spec );
        }
      }
      
      this.adjustedMembers.push({name : item, specs : memberSpecs, specIds : specIds});
      membersImages.push(item + ".png");
    }
    new Loader().load([ {images : membersImages, path: 'images/marketplace/members/', store: 'marketplace'}], {
      onFinish : function(){}
    });
  },
  
  buy : function(options){
    this.network.buy(options);
  },
  
  renderFloatingItems : function(categoryItems){
    $$('#floatingItems')[0].innerHTML = this.templateManager.load('floatingItems', { categoryItems: categoryItems });
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
  },
  
  openMarketplace : function(myStuff){
    var self = this;
    var screen = myStuff ? 'myStaff' : 'marketplace'
    $('marketplace').innerHTML = this.templateManager.load('marketplace', {screen : screen});
    
    //Attaching triggers to the market placetabs
    $('marketMembers').stopObserving('click');
    $('marketMembers').observe('click', function(event){
      self.renderFloatingItems(self.adjustedMembers);
      $('marketMembers').parentNode.addClassName("selected");
      $('marketMoves').parentNode.removeClassName("selected");
    });
    
    //Loading the template of the auto selected tab
    self.renderFloatingItems(self.adjustedMembers);
      
    this.containerWidth = Math.ceil( this.adjustedMembers.size() / this.rows) * this.itemWidth;
    this.containerWidth = Math.max( this.containerWidth, this.columns * this.itemWidth );
    $$('#floatingItems ul')[0].setStyle( { width: this.containerWidth + 'px' } );
    
    this.adjustNavigators('floatingItems');
    
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
    console.log( "left : " + left );
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
    console.log( "right : " + right );
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
