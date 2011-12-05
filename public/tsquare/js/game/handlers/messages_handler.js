var MessagesHandler = Class.create({
  
  guidBubble: null,
  
  initialize: function(scene){
    this.scene  = scene;
    var self = this;
    this.scene.observe("showGuidBubble", function(command){if(self.guidBubble==null)self.showGuidBubble(command)});
    this.scene.observe("removeGuidBubble", function(){self.removeGuidBubble()});
  },
  
  showGuidBubble: function(command){
    var message = "Listen to the rhythm and click the keys; ";
    if(command == 0) //forward
      message += "right, right, right, right";
    else if(command == 1)//retreat
      message += "left, left, left, left";
    else if(command == 2)//circle
      message += "right, left, right, left";
    else if(command == 3)//hold
      message += "";
    
    var crowds = this.scene.handlers.crowd.objects;
    var position = {x: crowds[1][0].coords.x, y: crowds[1][0].coords.y};
    
    this.guidBubble = new Bubble(this.scene, position.x, position.y, message);
    var bubbleDisplay = new BubbleDisplay(this.guidBubble);
    this.scene.pushToRenderLoop('characters', bubbleDisplay);
    
    // this.scene.reactor.push(1000, this.removeGuidBubble, this);
  },
  
  
  removeGuidBubble: function(){
    if(this.guidBubble){
      this.guidBubble.destroy();
      this.guidBubble = null;
    };
  }
  
  
  
});