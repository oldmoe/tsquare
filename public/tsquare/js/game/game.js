var Game = Class.create({
  
  inGameMeterBar : null,

  initialize: function(gameManager){
    this.imagesLoaded = false;
    this.missionLoaded = false;
    this.gameManager = gameManager;
    if(gameManager)
      this.templateManager = gameManager.templateManager;
     else{
      this.network = new TSquareNetwork();
      this.templateManager = new TemplatesManager(null);  
     }
    if(gameManager)gameData = gameManager.gameData;
    if(gameManager)userData = gameManager.userData;
    this.startLoading();
  },

  startLoading : function(){
    var self = this
    var loadingImages = ['loading_background.png','loadingbar_left.png','loadingbar_right.png',
    'loadingbar_middle.png','bar_background.png','background.png']
      new Loader().load([{images : loadingImages, path: 'images/loading/', store: 'loading'}]
        ,{
          onFinish: function(){
            $('gameInProgress').innerHTML = self.templateManager.load('loadingScreen')
            self.initializeGame();
          }
        }
      )
  },
  
  initializeGame : function(){
    $('gameCanvas').observe('mouseover',function(e){
     //   console.log(e.pointerX(),e.pointerY())
    })
    
    var gameElementsImages = ['arrow_up.png','arrow_down.png', 'bubble.png', 'world.png',
    'health_meter.png','health_meter_empty.png','hydration_meter_empty.png','hydration_meter.png']
    var characterNames = ['journalist', 'libralymic','medic', 'normal', 'salafy','ultras_green',
    'ultras_white','ultras_red','girl', 'girl7egab', 'bottleguy', 'hala_man']
    var characterImages = ['follower.png']
    var imageNames = ['walk','run','front','back','idle','hold','blur']
    for(var i=0;i<characterNames.length;i++){
        for(var j=0;j<imageNames.length;j++){
            characterImages.push(characterNames[i]+"_"+imageNames[j]+".png")
        }
    }
    var effectsImages = ['hydrate.png', 'hit1.png','good_blue.png','bad_red.png']
    var enemiesImages = ['amn_markazy_stick_walk.png','amn_markazy_stick_hit.png','amn_markazy_tear_gas_shooting.png',
    'amn_markazy_tear_gas_walk.png','amn_markazy_tear_gas_shadow.png','ambulance.png','twitter_guy.png']
    
    var metersBarImages = ["", ""];
    var hoveringIconsImages = ["circle.png", "march.png"];
       
  	var self = this
  	var toLoad = [ 	{images: gameElementsImages, path: 'images/game_elements/', store: 'gameElements'},
  					{images: characterImages, path: 'images/characters/', store: 'characters'},
  					{images: hoveringIconsImages, path: 'images/icons/', store: 'hoveringIcons'},
            {images: effectsImages, path: 'images/effects/', store: 'effects'},
            {images: enemiesImages, path: 'images/enemies/', store: 'enemies'}
  				]
    
    	var format = 'mp3'
    	for(var i=0; i < 4; i++){ //number of tempos
    		var beats = []
    		for(var j=0; j < 5; j++){
    			beats.push(j+'.'+format)
    		}
			if(i == 0){
				beats.push('5.'+format)
			}		
    		var hetaf = []
    		for(var j=0; j < 11; j++){
    			hetaf.push((j+1)+'.'+format)
    		} 
    		var tempo = 130+(i*10)
    		toLoad.push({sounds: beats, path: 'sounds/'+format+'/'+tempo+'/beats/', store: 'beats.'+tempo})
       	toLoad.push({sounds: hetaf, path: 'sounds/'+format+'/'+tempo+'/hetaf/', store: 'hetaf.'+tempo})
    		
    	}					
    						
  	new Loader().load(toLoad, {
  								  onProgress : function(progress){
  									  if($$('#inProgress #loadingBarFill')[0])
  									  $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
  								  },
  								  onFinish:function(){
                      $('gameInProgress').hide()
  					   				self.imagesLoaded = true;
  						  			self.start();
                      self.doneLoading = true
                      // self.play(missionData);
  								  }
    });
  },

  play : function(mission){
    this.data = mission;
    this.mission = mission;
    missionData = mission;
    this.misssionLoaded = false;
	  var backgroundImages = ['background.png']
    backgroundImages.push('followers_crowd.png')

    var self = this;
    this.mission.backgrounds.layer1.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.layer2.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.landmarks.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.fence.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.lamp.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.land.each(function(elem){
      backgroundImages.push(elem.name);
    });
    
	  new Loader().load([{images: backgroundImages, path: 'images/background/', store: 'background'}],
          {onProgress : function(progress){
                      if($$('#inProgress #loadingBarFill')[0])
                      $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
             }, onFinish:function(){        
                  self.missionLoaded = true;
                  self.start();
          }
        })
  },

  start : function(){
    var self = this;
    if(this.imagesLoaded == true && this.missionLoaded == true) {
      this.reset();
      this.scene = new TsquareScene();
      this.scene.observe('end', function(params){self.gameManager.missionManager.end(params)});
	  	this.scene.start();
      $('gameContainer').show();
	  	this.scene.fire("start");
      this.inGameMeterBar = new InGameMeterBar(this);
      this.guidingIcon = new GuidingIcon(this);
      this.scene.pushToRenderLoop('meters', this.inGameMeterBar);
      this.scene.pushToRenderLoop('meters', this.guidingIcon);
    }
  },

  end : function(){
  	this.scene.end();
  },

  hide : function() {
  },

  show : function() {
      $('gameInProgress').show()
  },
  
  reset : function(){
    $("container").innerHTML = ""
    $("gameCanvas").innerHTML = ""
  },

  addLoadedImagesToDiv: function(divId){
    $$('#' + divId + ' .loadedImg').each(function(imgSpan){
      var classes = null
      if (imgSpan.getAttribute('imgClasses')) {
        var classes = imgSpan.getAttribute('imgClasses').split('-')
      }
      var imgPath = imgSpan.getAttribute('imgSrc').split('/')
      var imgPart = Loader
      for (var i = 0; i < imgPath.length; i++) {
        imgPart = imgPart[imgPath[i]]
      }
      var img = $(imgPart).clone()
      var parent = $(imgSpan.parentNode)
      img = parent.insertBefore(img, imgSpan)
      parent.removeChild(imgSpan)
      if (imgSpan.getAttribute('imgId')) 
        img.id = imgSpan.getAttribute('imgId')
      if (imgSpan.getAttribute('hidden') == "true") 
        img.setStyle({
          "display": 'none'
        });
      if (classes) {
        for (var i = 0; i < classes.length; i++) {
          img.addClassName(classes[i])
        }
      }
      var style = imgSpan.getAttribute('imgStyle')
      if (style) 
        img.setAttribute('style', style)
    })
  }

});

Game.addLoadedImagesToDiv = function(divId){
  $$('#' + divId + ' .loadedImg').each(function(imgSpan){
    var classes = null
    if (imgSpan.getAttribute('imgClasses')) {
      var classes = imgSpan.getAttribute('imgClasses').split('-')
    }
    var imgPath = imgSpan.getAttribute('imgSrc').split('/')
    var imgPart = Loader
    for (var i = 0; i < imgPath.length; i++) {
      imgPart = imgPart[imgPath[i]]
    }
    if($(imgPart))
    {
      img = $(imgPart).clone()
    }
    var parent = $(imgSpan.parentNode)
    img = parent.insertBefore(img, imgSpan)
    parent.removeChild(imgSpan)
    if (imgSpan.getAttribute('imgId')) 
      img.id = imgSpan.getAttribute('imgId')
    if (imgSpan.getAttribute('hidden') == "true") 
      img.setStyle({
        "display": 'none'
      });
    if (classes) {
      for (var i = 0; i < classes.length; i++) {
        img.addClassName(classes[i])
      }
    }
    var style = imgSpan.getAttribute('imgStyle')
    if (style) 
      img.setAttribute('style', style)
    if (imgSpan.getAttribute('alt')) 
      img.setAttribute('alt', imgSpan.getAttribute('alt'));
  })
}
