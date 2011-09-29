var Game = Class.create({
  

  initialize: function(gameManager){
    this.imagesLoaded = false;
    this.missionLoaded = false;
    this.gameManager = gameManager;
    if(gameManager)gameData = gameManager.gameData;
    if(gameManager)userData = gameManager.userData;
    this.startLoading();
  },

  startLoading : function(){
    this.initializeGame();
  },
  
  initializeGame : function(){
      
    $('inProgress').hide()
    $('gameCanvas').show()
    $('container').show()
    $('gameCanvas').observe('mouseover',function(e){
     //   console.log(e.pointerX(),e.pointerY())
    })
    
    var gameElementsImages = ['arrow_up.png','arrow_down.png', 'bubble.png', 'world.png']
    var characterNames = ['journalist', 'libralymic','medic', 'normal', 'salafy','ultras_green',
    'ultras_white','ultras_red','girl', 'girl7egab', 'bottleguy', 'hala_man']
    var characterImages = []
    var imageNames = ['walk','run','front','back','idle','hold']
    for(var i=0;i<characterNames.length;i++){
        for(var j=0;j<imageNames.length;j++){
            characterImages.push(characterNames[i]+"_"+imageNames[j]+".png")
        }
    }
    var enemiesImages = ['amn_markazy_stick_walk.png','amn_markazy_stick_hit.png','amn_markazy_tear_gas_shooting.png',
    'amn_markazy_tear_gas_walk.png','amn_markazy_tear_gas_shadow.png','ambulance.png','twitter_guy.png']
    var hoveringIconsImages = ['lock.png', 'circle.png', 'march.png', 'push.png'];
    	var self = this
    	var toLoad = [ 	{images: gameElementsImages, path: 'images/game_elements/', store: 'gameElements'},
    					{images: characterImages, path: 'images/characters/', store: 'characters'},
    					{images: hoveringIconsImages, path: 'images/icons/', store: 'hoveringIcons'},
                        {images: enemiesImages, path: 'images/enemies/', store: 'enemies'}
    				]
    
    	var format = 'mp3'
    	for(var i=0; i < 4; i++){ //number of
    		var beats = []
    		for(var j=0; j < 5; j++){
    			beats.push(j+'.'+format)
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
  									  $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,88)+"%"
  								  },
  								  onFinish:function(){
  					   				self.imagesLoaded = true;
  						  			self.start();
  						  			// self.play(missionData)
  								  }
    });
  },

  play : function(mission){
    this.data = mission;
    this.mission = mission;
    missionData = mission;
    this.misssionLoaded = false;
	  var backgroundImages = ['background.png']

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
                        { onFinish:function(){        
                            self.missionLoaded = true;
                            self.start();
                        }
                      })
  },

  start : function(){
    if(this.imagesLoaded == true && this.missionLoaded == true)
    {
      this.scene = new TsquareScene();
	  	this.scene.start();
	  	this.scene.fire("start");
    }
  },

  end : function(){
  	this.scene.end();
  },

  hide : function() {
  },

  show : function() {

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
