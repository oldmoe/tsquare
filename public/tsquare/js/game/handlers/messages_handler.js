var MessagesHandler = Class.create(UnitHandler, {
  
  crowdBubble: null,
  currentGameMode: null,
  
  messages : {},
  
  enemyMessage: null,
  
  scopeHeight : 80,
  
  initialize: function($super, scene){
    $super(scene);
    
    this.messages.en = {
      "protectionUnit" : [
        "Please help me, help me !!",
        "Hi there, protect me please"
      ],
      
      "enemy" : [
        "Attack!",
        "Attack them!"
      ]
    }
    this.messages.ar = {
      "protectionUnit" : [
        "النجدة!!",
        "الحقوني!!"
      ],
      
      "enemy" : [
        "الهجوم!",
        "خلص عليهم!"
      ]
    }
    
    var self = this;
    this.scene.observe("showGuidBubble", function(command){self.showGuidBubble(command)});

    this.scene.observe("removeCrowdBubble", function(command){self.removeCrowdBubble()});
    this.scene.observe("showCrowdBubble", function(message, delay){self.showCrowdBubble(message, delay)});
    
    this.scene.observe("showBubble", function(type, coords){self.showBubble(type, coords)});
    
    this.scene.observe('startConversation', function(){self.startConversation()});
    this.scene.observe('endConversation', function(){self.endConversation()});
    this.scene.observe("continueConversation", function(command){self.continueConversation()});
  },

   startConversation: function(){
     if(this.scene.currentSpeed > 0){
       this.scene.currentSpeed = 3;
       this.scene.energy.current = 10;
       this.scene.targetEnergy = 10;
     }
     this.currentGameMode = this.scene.movementManager.currentMode; 
     this.scene.movementManager.currentMode = this.scene.movementManager.modes.conversation;
     console.log('start')
     new Effect.Fade('guidingBar', {duration : 2})
     new Effect.Move('topScope', {y:this.scopeHeight})
     new Effect.Move('bottomScope', {y:-this.scopeHeight})
   },
  
  continueConversation: function(){
    this.objects[0][0].continueConversation();
  },
  
  endConversation: function(){
    this.scene.movementManager.currentMode = this.currentGameMode;
    new Effect.Appear('guidingBar') 
    new Effect.Move('topScope', {y:-this.scopeHeight})
    new Effect.Move('bottomScope', {y:this.scopeHeight})
  },
  
  showGuidBubble: function(command) {
    var message = game.scene.movementManager.commandText(command);
    this.showCrowdBubble(message, 70);
  },
  
  showCrowdBubble: function(message, delay){
    var crowds = this.scene.handlers.crowd.objects;
    var position = {x: crowds[1][0].coords.x-100, y: crowds[1][0].coords.y};
    
    if(this.crowdBubble)this.removeCrowdBubble();
    
    this.crowdBubble = new Bubble(this.scene, position.x, position.y, message);
    var bubbleDisplay = new BubbleDisplay(this.crowdBubble);
    this.scene.pushToRenderLoop('characters', bubbleDisplay);
    
    if(delay)this.scene.reactor.push(delay, this.removeCrowdBubble, this);
  },
  
  randomMessage: function(type) {
  	var allMessages = this.messages[game.properties.lang][type];
    return allMessages[Math.round(Math.random()*(allMessages.length-1))];
  },

  showBubble: function(type, coords) {
    var message = this.randomMessage(type);
    var bubble = new Bubble(this.scene, coords.x, coords.y, message);
    var bubbleDisplay = new BubbleDisplay(bubble);
    this.scene.pushToRenderLoop('characters', bubbleDisplay);
    
    this.scene.reactor.push(100, function(){
      bubble.destroy();
    });
  },
  
  removeCrowdBubble: function(){
    if(this.crowdBubble){
      this.crowdBubble.destroy();
      this.crowdBubble = null;
    };
  },
  
 addObject: function($super, obj){
  obj.options.type = obj.name;
  obj.name = "advisor";
  var advisor = $super(obj)
  advisor.messages = obj.messages;
  return advisor;
 }
  
  
});