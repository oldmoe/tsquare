var MessagesHandler = Class.create(UnitHandler, {
  
  guidBubble: null,
  
  initialize: function($super, scene){
    $super(scene);
    var self = this;
    this.scene.observe("showGuidBubble", function(command){if(self.guidBubble==null)self.showGuidBubble(command)});
    this.scene.observe("removeGuidBubble", function(){self.removeGuidBubble()});
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
    
    var crowds = this.scene.handlers.crowd.objects;
    var position = {x: crowds[1][0].coords.x, y: crowds[1][0].coords.y};
    
    this.guidBubble = new Bubble(this.scene, position.x, position.y, message);
    var bubbleDisplay = new BubbleDisplay(this.guidBubble);
    this.scene.pushToRenderLoop('characters', bubbleDisplay);
    
    this.scene.reactor.push(100, this.removeGuidBubble, this);
  },
  
  
  removeGuidBubble: function(){
    if(this.guidBubble){
      this.guidBubble.destroy();
      this.guidBubble = null;
    };
  },
  
   addObject: function($super, obj){
    obj.options.type = obj.name
    obj.name = "advisor"
    return $super(obj)
   }
  
  
});