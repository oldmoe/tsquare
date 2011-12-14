var Advisor = Class.create(Unit,{
    
    conversationOn : false,
    s: null,
    messageSequence : 0,
    ended: false,
    messages: null,
    
    initialize : function($super,scene,x,lane, options){
      $super(scene,x,lane, options)
      
      this.coords.x+=Math.round(Math.randomSign()*Math.random()*this.scene.view.tileWidth/4)
      // this.coords.y+=Math.random()*30
    },
    
    tick : function($super){
      this.move(this.scene.currentSpeed * this.scene.direction * -1,0);
      
      if (!this.conversationOn && this.coords.x < this.scene.view.width-this.getWidth() ) {
        this.fire("back");
        this.scene.fire("startConversation");
        this.continueConversation();
        this.conversationOn = true;
      }
      
      if(this.ended){
        this.move(-7,0);
      }
      
      $super()
    },
    
    continueConversation: function(){
      if(this.messageSequence < this.messages.length){
        this.text = this.messages[this.messageSequence].message;
        if(this.messages[this.messageSequence].person == 'advisor'){
          this.scene.fire("removeGuidBubble");
          this.showText();
        }else if(this.messages[this.messageSequence].person == 'crowds'){
          this.hideText();
          this.scene.fire("showCrowdBubble", [this.text, true])
        }
        this.messageSequence++;
      }else {
        this.scene.fire("removeGuidBubble");
        this.hideText();
        this.scene.fire("endConversation");
        this.ended = true;
        this.fire("reverseWalk");
      }
    },
    
    textInfo: function(){
      return this.text;
    }    
    
})
