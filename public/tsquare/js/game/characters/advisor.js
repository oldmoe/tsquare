var Advisor = Class.create(Unit,{
    
    conversationOn : false,
    s: null,
    messageSequence : 0,
    ended: false,
    messages: null,
    scalable: false,
    
    initialize : function($super,scene,x,lane, options){
      $super(scene,x,lane, options)
      this.messageSequence = 0;
      // this.coords.x+=Math.round(Math.random()*this.scene.view.tileWidth/5)
    },
    
    tick : function($super){
      this.move(this.scene.currentSpeed * this.scene.direction * -1,0);
      
      if (!this.conversationOn && this.coords.x < this.scene.view.width-this.getWidth()*1.5 ) {
        this.fire("back");
        this.scene.fire("startConversation");
        this.continueConversation();
        this.conversationOn = true;
      }
      
      if(this.ended){
        this.move(7,0);
        if (this.coords.x > this.scene.view.width+this.getWidth()*1.5)
          this.die();
      }
      
      $super()
    },
    
    continueConversation: function(){
      if(this.messageSequence < this.messages.length){
      	if (game.properties.lang == 'en')
          this.text = this.messages[this.messageSequence].message;
        else
          this.text = this.messages[this.messageSequence].message_ar || '<عربي>';
       if(this.messages[this.messageSequence].person == 'crowds'){
          this.hideText();
          this.scene.fire("showCrowdBubble", [this.text]);
        }else{
          this.scene.fire("removeCrowdBubble");
          this.showText();
        }
        this.messageSequence++;
      }else{
        this.messageSequence = 0;
        this.scene.fire("removeCrowdBubble");
        this.hideText();
        this.scene.fire("endConversation");
        this.ended = true;
        this.fire("walk");
      }
    },
    
    textInfo: function(){
      return this.text;
    }    
    
})
