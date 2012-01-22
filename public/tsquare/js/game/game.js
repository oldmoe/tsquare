var Game = Class.create({
  
  properties: {}, // key-value store
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
    this.loader = new Loader();
    this.startLoading();
  },

  startLoading : function(){
    var self = this    
    var loadingImages = ['loading_background.png','loadingbar_left.png','loadingbar_right.png',
    'loadingbar_middle.png','bar_background.png','background.png']
      this.loader.load([{images : loadingImages, path: 'images/loading/', store: 'loading'}]
        ,{
          onFinish: function(){
            $('gameInProgress').innerHTML = self.templateManager.load('loadingScreen')
            self.initializeGame();
          }
        }
      )
  },
  
  initializeGame : function(){
    var gameElementsImages = ['arrow_up.png','arrow_down.png', 'bubble.png', 'bubble_inverted.png',
    'health_meter.png','health_meter_empty.png','hydration_meter_empty.png','hydration_meter.png',
    'square.png','line.png', 'smoke1.png', 'smoke2.png', 'smoke3.png', 'smoke4.png']
    var characterNames = ['journalist', 'libralymic','medic', 'normal', 'salafy','ultras_green',
    'ultras_white','ultras_red','girl', 'girl7egab', 'bottleguy', 'hala_man', 'follower1','follower2','follower3']
    var characterImages = ['follower.png']
    var imageNames = ['walk','run','front','back','idle','hold','blur','dead', 'hit']
    for(var i=0;i<characterNames.length;i++){
        for(var j=0;j<imageNames.length;j++){
            characterImages.push(characterNames[i]+"_"+imageNames[j]+".png")
        }
    }
    var effectsImages = ['hydrate.png', 'hit1.png','good_blue.png','bad_red.png']
    var enemiesImages = ['amn_markazy_stick_walk.png','amn_markazy_stick_hit.png','amn_markazy_tear_gas_shooting.png',
    'amn_markazy_tear_gas_walk.png', 'ambulance.png','twitter_guy.png',
    'amn_kalabsh_back.png','amn_kalabsh_blur.png','amn_kalabsh_front.png','amn_kalabsh_run.png',
    'amn_kalabsh_walk.png', 'box_car.png', 'tear_gas_bomb.png',
    'amn_2sticks_walk.png', 'amn_2sticks_hit.png']
    
    var countDownImages = ["1.png", "2.png", "3.png", "go.png"];
    
    var shadowImages = ["crowd_shadow.png", "box_car_shadow.png", "amn_markazy_shadow.png", 
    "ambulance_shadow.png", "twitter_shadow.png", "amn_markazy_tear_gas_shadow.png"];
    
    this.properties.lang = 'en';

  	var self = this
  	var toLoad = [ 	{images: gameElementsImages, path: 'images/game_elements/', store: 'gameElements'},
  	        {images: countDownImages, path: 'images/game_elements/', store: 'countDown'},
  					{images: characterImages, path: 'images/characters/', store: 'characters'},
            {images: effectsImages, path: 'images/effects/', store: 'effects'},
            {images: shadowImages, path: 'images/effects/', store: 'effects'},
            {images: enemiesImages, path: 'images/enemies/', store: 'enemies'}
  				]
    
    	var format = ['mp3'];
    	for(var i=0; i < format.length; i++){ //number of tempos
    		var beats = []
    		for(var j=0; j < 5; j++){
    			beats.push(j+'.'+format[i])
    		}
    		var hetaf = []
    		for(var j=0; j < 11; j++){
    			hetaf.push((j+1)+'.'+format[i])
    		} 
        var reward = []
        for(var j=1; j <= 9; j++){
          reward.push((j)+'.'+format[i])
        } 

    		var tempo = 130+(i*10)
    		toLoad.push({sounds: beats, path: 'sounds/'+format[i]+'/'+tempo+'/beats/', store: 'beats.'+tempo})
       	toLoad.push({sounds: hetaf, path: 'sounds/'+format[i]+'/'+tempo+'/hetaf/', store: 'hetaf.'+tempo})
       	toLoad.push({sounds: reward, path: 'sounds/'+format[i]+'/'+tempo+'/reward/', store: 'reward.'+tempo})
       	
       	var sfx = ["ho", "hey", "ha", "hii", "background_ascending", "background_music", "ambient", "ambulance", "beat", "Bullet-hit-body", "Central-security", "Crowd-voice", "Explosion", 
        "Gun-shot", "Hit-police-car", "Morning-air-birds", "Night-sound", "Police", "Police-march", "Punch", "Tank-move",
         "Tear-gas", "clash_preparing", "clash_scenario", "win_lose", "wrong_move", "combo1", "combo2", "combo3"];

        for(var j=0; j < sfx.length; j++){
          sfx[j] = sfx[j]+'.'+format[i];
        } 
       	toLoad.push({sounds: sfx, path: 'sounds/'+format[i]+"/sfx/", store: 'sfx'});
    	}
    						
  	new Loader().load(toLoad, {
  								  onProgress : function(progress){
  									  if($$('#gameInProgress #loadingBarFill')[0])
  									  $$('#gameInProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
  								  },
  								  onFinish:function(){
  					   				self.imagesLoaded = true;
  						  			self.start();
  								  },
                    onError:function(){
  					   				self.imagesLoaded = true;
  						  			self.start();
                    }
    });
  },

  play : function(mission){
    this.data = mission;
    this.mission = mission;
    missionData = mission;
    this.misssionLoaded = false;
	  var backgroundImages = ['background.png', 'clowds.png', 'followers_crowd.png', 'followers_crowd_car.png']
    if(Loader.sounds.intro)Loader.sounds.intro['menus_background.mp3'].stop();
    var self = this;
    this.mission.backgrounds.layer1.each(function(elem){
      backgroundImages.push(elem.name);
    });
    this.mission.backgrounds.layer2.each(function(elem){
      backgroundImages.push(elem.name);
    });
    if(this.mission.backgrounds.sky)
    this.mission.backgrounds.sky.each(function(elem){
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
    
	this.loader.load([{images: backgroundImages, path: 'images/background/', store: 'background'}],
        {onProgress : function(progress){
                    if($$('#gameInProgress #loadingBarFill')[0])
                    $$('#gameInProgress #loadingBarFill')[0].style.width = Math.min(progress,86)+"%"
           }, onFinish:function(){        
                self.missionLoaded = true;
                self.start();
        }
      })
  },

  start : function(){
    var self = this;
    if(this.imagesLoaded == true && this.missionLoaded == true) {
      $('gameInProgress').hide();
      this.reset();
      this.scene = new TsquareScene();
      if(this.gameManager)this.gameManager.missionManager.registerSceneListeners(this.scene);
	  this.scene.start();
      $('gameContainer').show();
      this.inGameMeterBar = new InGameMeterBar(this);
      this.guidingIcon = new GuidingIcon(this);
    }
  },

  hide : function() {
  },

  show : function() {
      $('gameInProgress').show()
  },
  
  reset : function(){
    $("container").innerHTML = ""
    $("gameCanvas").innerHTML = ""
  }
});

Game.addLoadedImagesToDiv = function(divId){
  $$('#' + divId + ' .loadedImg').each(function(imgSpan){
  	var langSensitive = imgSpan.hasClassName('lang');
    var classes = null
    if (imgSpan.getAttribute('imgClasses')) {
      var classes = imgSpan.getAttribute('imgClasses').split('-')
    }
    var imgPath = imgSpan.getAttribute('imgSrc').split('/')
    var imgPart = Loader['images']
    if (langSensitive && game.properties.lang != 'en')
      imgPart = Loader['images_' + game.properties.lang];
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
