var orderedJS = [["js/base/prototype.js",
                 "js/nezal/nezal.js",
                 "js/nezal/observer.js",
                 "js/nezal/reactor.js",
                 "js/base/effects.js",
                 "js/base/template.js",
                 "js/base/box2d-all.js",
                 "js/base/box2dutils.js"],
                 
                 ["js/nezal/facebook.js",
                 "js/nezal/carousel.js",
                 "js/nezal/network.js",
                 "js/nezal/display.js",
                 "js/nezal/loader.js",
                 "js/nezal/layer.js",
                 "js/nezal/util.js",
                 "js/nezal/scene.js",
                 "js/nezal/sprite.js",
                 "js/nezal/language.js",
                 "js/nezal/dom_sprite.js",
                 "js/nezal/dom_img_sprite.js",
                 "js/nezal/dom_text_sprite.js",
                 "js/nezal/dom_meter_sprite.js",
                 "js/nezal/img_meter_sprite.js",
                 "js/nezal/dom_meterbar_sprite.js",
                 "js/nezal/templates_manager.js"],
                 
                 ["js/game/social_engine.js",
                 "js/game/game_manager.js",
                 "js/game/mission_manager.js",
                 "js/game/meter_bar.js",
                 "js/game/score_manager.js",
                 "js/game/marketplace.js",
                 "js/game/inbox.js",
                 "js/game/tsquare_network.js",
                 "js/game/timeline.js",
                 "js/game/effects.js",
                 "js/game/gameData.js",
                 "js/game/clash_directions_generator.js",
                 "js/game/unit.js",
                 "js/game/enemy.js",
                 "js/game/follower.js",
                 "js/game/crowd_member.js",
                 "js/game/amn_markazy.js",
                 "js/game/clash_enemy.js",
                 "js/game/clash_group.js",
                 "js/game/box_car.js",
                 "js/game/charging_amn_markazy.js",
                 "js/game/tear_gas_gunner_cs.js",
                 "js/game/tear_gas_bomb.js",
                 "js/game/bomb_smoke.js",
                 "js/game/block.js",
                 "js/game/tear_gas_gunner_cs_block.js",
                 "js/game/bubble.js",
                 "js/game/scenario.js",
                 "js/game/protection_unit.js",
                 "js/game/rescue_unit.js"],
                 
                 ["js/game/handlers/unit_handler.js",
                 "js/game/handlers/crowd_handler.js",
                 "js/game/handlers/enemy_handler.js",
                 "js/game/handlers/protection_unit_handler.js",
                 "js/game/handlers/npc_handler.js",
                 "js/game/handlers/messages_handler.js",
                 "js/game/handlers/clash_enemy_handler.js",
                 "js/game/handlers/rescue_unit_handler.js",
                 
                 "js/game/physics/physics_handler.js",
                 
                 "js/game/display/enemy_display.js",
                 "js/game/display/clash_direction.js",
                 "js/game/display/follower_display.js",
                 "js/game/display/crowd_member_display.js",
                 "js/game/display/block_display.js",
                 "js/game/display/tear_gas_gunner_cs_block_display.js",
                 "js/game/display/amn_markazy_display.js",
                 "js/game/display/clash_enemy_display.js",
                 "js/game/display/tear_gas_gunner_cs_display.js",
                 "js/game/display/tear_gas_bomb_display.js",
                 "js/game/display/bomb_smoke_display.js",
                 "js/game/display/charging_amn_markazy_display.js",
                 "js/game/display/box_car_display.js",
                 "js/game/display/advisor_display.js",
                 "js/game/display/walking_man_display.js",
                 "js/game/display/bubble_display.js"],
                 
                 ["js/game/characters/journalist.js",
                 "js/game/characters/journalist_rescue.js",
                 "js/game/characters/libralymic.js",
                 "js/game/characters/healer.js",
                 "js/game/characters/normal.js",
                 "js/game/characters/salafy.js",
                 "js/game/characters/ultras_green.js",
                 "js/game/characters/ultras_red.js",
                 "js/game/characters/ultras_white.js",
                 "js/game/characters/girl.js",
                 "js/game/characters/girl7egab.js",
                 "js/game/characters/bottleguy.js",
                 "js/game/characters/hala_man.js",
                 "js/game/characters/ambulance.js",
                 "js/game/characters/twitter_guy.js",
                 "js/game/characters/poorguy.js",
                 "js/game/characters/advisor.js",
                 "js/game/characters/npc.js"],
                 
                 ["js/game/display/journalist_display.js",
                 "js/game/display/journalist_rescue_display.js",
                 "js/game/display/libralymic_display.js",
                 "js/game/display/healer_display.js",
                 "js/game/display/normal_display.js",
                 "js/game/display/salafy_display.js",
                 "js/game/display/ultras_green_display.js",
                 "js/game/display/ultras_white_display.js",
                 "js/game/display/ultras_red_display.js",
                 "js/game/display/girl_display.js",
                 "js/game/display/girl7egab_display.js",
                 "js/game/display/bottleguy_display.js",
                 "js/game/display/hala_man_display.js",
                 "js/game/display/ambulance_display.js",
                 "js/game/display/twitter_guy_display.js",
                 "js/game/display/poorguy_display.js",
                 "js/game/display/npc_display.js",
                 "js/game/display/animation.js"],
                 
                 ["js/game/guiding_icon.js",
                 "js/game/transparent_layer.js",
                 "js/game/background.js",
                 "js/game/sky_line.js",
                 "js/game/score_calculator.js",
                 "js/game/tsquare_scene.js",
                 "js/game/audio_manager.js",
                 "js/game/movement_manager.js",
                 "js/game/flashing_handler.js",
                 "js/game/ingame_meter_bar.js",
                 "js/game/tsquare_network.js",
                 "js/game/game.js"]]

function flatten( array ) {
  var retVal = [];
  for (var i=0; i<array.length; i++) {
    for (var j=0; j<array[i].length; j++) {
      retVal.push( array[i][j] );
    }
  }
  return retVal;
};
orderedJS = flatten( orderedJS );
                 
styleSheets = ["css/style.css",
               "css/main.css",
               "css/timeline.css",
               "css/mission.css",
               "css/meter_bar.css",
               "css/scores.css",
               "css/notifications.css",
               "css/marketplace.css"];

loadCssFiles = function() {
  for( var i in styleSheets ){
    var fileName = styleSheets[i];
    //Dynamic adding of CSS files in IE
    if( document.createStyleSheet ){
      document.createStyleSheet(fileName);
    } else {
      var head = document.getElementsByTagName('head')[0];
      var style = document.createElement('link');
      style.setAttribute("rel", "stylesheet")
      style.setAttribute("type", "text/css")
      style.setAttribute("href", fileName)
      head.appendChild(style);
    }
  }
}

function loadJsFiles(index){
  if( orderedJS.length == index ){
    GameInitializer();
    return;
  }
  var head = document.getElementsByTagName('head')[0];
  var fileName = orderedJS[index];
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.src = fileName;
  
  var callback = function(){
    loadJsFiles( index+1 );
  }
  
  script.onload = callback;
  // For IE 6 & 7
  script.onreadystatechange = function() {
    if (this.readyState == 'complete') {
      callback();
    }
  }
  
  head.appendChild(script);
}

var onloadFired = false;
window.onload = function(){
  onloadFired = true;
}

var GameInitializer = function(){
  var run = function(){
    soundManager.onready(function(){
      socialEngine = new SocialEngine();
      socialEngine.init(function(params){
        try {
          gameManager = new GameManager(params);
        } catch(e){
          console.log(e);
        }
      });
    })
  }
  
  if( onloadFired ) run();
  else window.onload = run;
}

soundManager.flashVersion = 9;
soundManager.url = 'flash';
loadCssFiles();
loadJsFiles(0);
