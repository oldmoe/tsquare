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

    var self = this;
    
    this.adjustedMyMembers = this.adjustMyMembers();
    
    this.adjustedMembers = [];
    var membersImages = [];
    for(var item in this.members['category']){
      var specs = this.gatherSpecs(item);
      var specIds = specs.specIds;
      var memberSpecs = specs.memberSpecs;
      this.adjustedMembers.push(
                        {displayName : this.members['category'][item].name,
                         codeName : item,
                         specs : memberSpecs,
                         specIds : specIds,
                         buyID : this.members['category'][item]['buyID'],
                         memberID : ""
                        });
      membersImages.push(item + "_icon.png");
    }
    // membersImages.remove('attacker_icon.png')
    // membersImages.remove('supplier_icon.png')
    // membersImages.remove('leader_icon.png')
    // membersImages.remove('energy_booster_icon.png')
    // membersImages.remove('amr_salama_icon.png')
    // membersImages.remove('wael_ghoneim_icon.png')
    
    this.loader = this.gameManager.loader
    this.loader.load([ {images : ["my_stuff_title.png", "buy_window_title.png", "tab_background.png", "dialog_box.png",
                               'item_background.png', 'item_title_background.png', 'item_details.png', 'link_button.png', 
                                'Linked_background.png' ],
                                     path: 'images/marketplace/', store: 'marketplace'},
                       {images_ar : ["my_stuff_title.png"],
                                     path: 'images/ar/marketplace/', store: 'marketplace'},
                        {images : membersImages,
                                     path: 'images/marketplace/members/', store: 'marketplace'},
                        {images : ["close_button.png", "first_button.png", "last_button.png", 'next_button.png', 'previous_button.png'], 
                          path: 'images/game_elements/', store: 'game_elements' }], {
      onFinish : function(){}
    });
    

  },

  show : function(){
    Effects.appear($('marketplace'));
  },

  hide : function(){
    Effects.fade($('marketplace'), function(){$('marketplace').innerHTML = ""});
  },
  
  gatherSpecs : function(memberName){
    var specIds = [];
    var memberSpecs = {};
    var memberType = "";
    
    memberType = this.members['category'][memberName]['type'] != "normal" ? memberName : 'normal';
    if(memberType.indexOf("ultras") != -1) memberType = "ultras";
    
    for(var spec in this.members['specs'][memberType][1]){
      if (spec == "special") {
        for (var specialSpec in this.members['specs'][memberType][1]['special']) {
          memberSpecs[specialSpec] = this.members['specs'][memberType][1]['special'][specialSpec];
          specIds.push( specialSpec );
        }
      } else {
        memberSpecs[spec] = this.members['specs'][memberType][1][spec];
        specIds.push( spec );
      }
    }
    
    return {specIds : specIds, memberSpecs : memberSpecs};
  },
  
  adjustMyMembers : function(){
    this.enableNextMission = false;
    var Health_Shift_Const = 8;
    var Quarter_Timer_Const = -25;
    var Minute = 60;
    var Hour = Minute * Minute;
    
    var adjustedMyMembers = []
    for(var memberName in this.myMembers){
      var specs = this.gatherSpecs( memberName );
      var specIds = specs.specIds;
      var memberSpecs = specs.memberSpecs;
      for(var memberID in this.myMembers[memberName]){
        
        var memberData = this.myMembers[memberName][memberID];
        
        this.enableNextMission = this.enableNextMission || (memberData.health >= 40);
        
        var healthShift = 0;
        var timerShift = 0;
        var remainingSecondsTillHealthUnit = Hour - Math.round( (memberData.health - Math.floor(memberData.health)) * Hour )
        
        /**
         * This will determine the pixel shift of the timer image
         * If you can find a readable pattern for this, it will be great ;)
         * */
        if( remainingSecondsTillHealthUnit < Minute*60 ){
          timerShift = Quarter_Timer_Const * 0;
        }
        if( remainingSecondsTillHealthUnit < Minute*45 ){
          timerShift = Quarter_Timer_Const * 1;
        }
        if( remainingSecondsTillHealthUnit < Minute*30 ){
          timerShift = Quarter_Timer_Const * 2;
        }
        if( remainingSecondsTillHealthUnit < Minute*15 ){
          timerShift = Quarter_Timer_Const * 3;
        }
        
        /**
         * This will determine the pixel shift of the health meter image
         * If you can find a readable pattern for this, it will be great ;)
         * */
        if( memberData.health < 100 ){
          healthShift = Health_Shift_Const * 1;
        }
        if( memberData.health < 80 ){
          healthShift = Health_Shift_Const * 2;
        }
        if( memberData.health < 60 ){
          healthShift = Health_Shift_Const * 3;
        }
        if( memberData.health < 40 ){
          healthShift = Health_Shift_Const * 4;
        }
        if( memberData.health < 20 ){
          healthShift = Health_Shift_Const * 5;
        }
        if( memberData.health == 0 ){
          healthShift = Health_Shift_Const * 6;
        }
        adjustedMyMembers.push( 
                        {codeName : memberName,
                         displayName : this.members['category'][memberName].name,
                         memberData : memberData,
                         specs : memberSpecs,
                         specIds : specIds,
                         memberID : memberID,
                         healthShift : healthShift,
                         remainingMinutesTillHealthUnit : Math.ceil(remainingSecondsTillHealthUnit / Minute),
                         timerShift : timerShift
                        });
      }
    }
    return adjustedMyMembers;
  },
  
  buy : function(options){
    if(!options.buyID.empty()) {
      socialEngine.buyItem( options.buyID );
    } else {
      var self = this;
      this.network.buy(options, function(responseData){
        $('dialogBox').show();
        self.gameManager.initializeData(responseData);
      });
    }
  },
  
  renderFloatingItems : function(categoryItems, screen, preMission, myStuff){
    $$('#floatingItems')[0].innerHTML = this.templateManager.load('floatingItems', { categoryItems: categoryItems, screen : screen, preMission : preMission });
    Game.addLoadedImagesToDiv('marketplace');
    $$('#floatingItems li div.crowedItem div.crowedItemImage img').each(function(img){
      var id = img.id;
      img.observe('mouseover', function(event){ 
        var offsetLeft = $(id + "_container").offsetLeft;
        var offsetTop = $(id + "_container").offsetTop;
        if( offsetTop > 0 ) offsetTop = -20;
        
        if(offsetLeft > 404)offsetLeft = -200
        else offsetLeft = 136
        
        $(id + '_details').setStyle({left : offsetLeft + 'px', top : offsetTop + 'px'});
        $(id + '_details').show(); 
      });
      img.observe('mouseout', function(event){ $(id + '_details').hide(); });
    });
    this.containerWidth = Math.ceil( categoryItems.size() / this.rows) * this.itemWidth;
    this.containerWidth = Math.max( this.containerWidth, this.columns * this.itemWidth );
    $$('#floatingItems ul')[0].setStyle( { width: this.containerWidth + 'px' } );
    
    this.adjustNavigators('floatingItems');
    
    
    var self = this;
    //Activating feature : healing injured crowd members
    $$('.healTrigger').each(function(healTrigger){
      healTrigger.observe("click", function(event){
        self.network.heal( {memberID : healTrigger.id}, function(data){
          $("bandageAmount").innerHTML = data.bandages;
          
          self.myMembers[data.name][data.serial].health = data.health
          userData.crowd_members[data.name][data.serial].health = data.health
          
          self.adjustedMyMembers = self.adjustMyMembers();
          
          self.renderFloatingItems( self.adjustedMyMembers, screen, preMission, myStuff );
        } );
      });    
    });
    
    if( myStuff ){
      //Activating feature : linking a crowd member to a friend
      $$('.linkButton').each(function(link){
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
      
      //Activating feature : adding the name of the fb friend to the facebook image
      var userIDS = []
      $$('.linkedMember').each(function(link){
        userIDS.push(link.id)
      });
      socialEngine.getUsersInfo(userIDS, function(users){
        users.each(function(user){
          $$('.linkedMember').each(function(image){
            if(image.id == user.uid) 
            {
              image.src = user.pic_square;
              image.title = user.name;
            }
          });
        })
      })
    }
    
    
    
  },
  
  openMarketplace : function(options){
    var myStuff = options.myStuff;
    var preMission = options.preMission;
    var missionID = options.missionID;
    var self = this;
    var screen = myStuff ? 'myStaff' : 'marketplace';
    
    this.network.gameData(function(data){
      self.myMembers = data.user_data.data.crowd_members;
      self.adjustedMyMembers = self.adjustMyMembers();
      $('marketplace').hide();
      $('marketplace').innerHTML = self.templateManager.load('marketplace', {screen : screen, 
                                                                             bandages : self.gameManager.userData.bandages,
                                                                             preMission : preMission});
      $('marketplace').setStyle({top:"-363px"}); //should be removed after waleed fix the css for the marketplace

      if( preMission ){
        $('readyButton').stopObserving('click');                                                                       
        $('readyButton').observe('click', function(event){
          if( self.enableNextMission ){
            self.gameManager.marketplace.hide();
            self.gameManager.playMission(missionID);
          } else {
            $('cantJoinErrorMessage').show();
          }
        });
      }
      
      var categoryItems = myStuff ? self.adjustedMyMembers : self.adjustedMembers;
      
      //Attaching triggers to the market placetabs
      $('marketMembers').stopObserving('click');
      $('marketMembers').observe('click', function(event){
        self.renderFloatingItems(categoryItems, screen, preMission, myStuff);
        $('marketMembers').parentNode.addClassName("selected");
      });
      
      //Loading the template of the auto selected tab
      self.renderFloatingItems(categoryItems, screen, preMission, myStuff);
      
      $$('#marketplace .close')[0].stopObserving('click');
      $$('#marketplace .close')[0].observe('click', function(event){
        self.hide();
      })
      self.show();
    });
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
