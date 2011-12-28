var MessagesHandler = Class.create(UnitHandler, {
  
  crowdBubble: null,
  currentGameMode: null,
  
  messages : null,
  
  enemyMessage: null,
  
  initialize: function($super, scene){
    $super(scene);
    
    this.messages = {
      "protectionUnit" : [
        "Please help me, help me !!", "Hi there, protect me please"
      ],
      
      "enemy" : [
        "Attack!", "Attack them!"
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
   },
  
  continueConversation: function(){
    this.objects[0][0].continueConversation();
  },
  
  endConversation: function(){
    this.scene.movementManager.currentMode = this.currentGameMode; 
  },
  
  showGuidBubble: function(command){
    var message = "Click the keys; ";
    if(command == "march") //forward
      message += "right, right, left, right";
    else if(command == "retreat")//retreat
      message += "left, left, right left";
    else if(command == "circle")//circle
      message += "up, down, up, down";
    else if(command == "hold")//hold
      message += "";
    
    this.showCrowdBubble(message, 100);
  },
  
  showCrowdBubble: function(message, delay){
    var crowds = this.scene.handlers.crowd.objects;
    var position = {x: crowds[1][0].coords.x, y: crowds[1][0].coords.y};
    
    if(this.crowdBubble)this.removeCrowdBubble();
    
    this.crowdBubble = new Bubble(this.scene, position.x, position.y, message);
    var bubbleDisplay = new BubbleDisplay(this.crowdBubble);
    this.scene.pushToRenderLoop('characters', bubbleDisplay);
    
    if(delay)this.scene.reactor.push(delay, this.removeCrowdBubble, this);
  },

  showBubble: function(type, coords){
    var message = this.messages[type][Math.round(Math.random()*(this.messages[type].length-1))];
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