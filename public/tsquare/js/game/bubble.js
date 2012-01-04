var Bubble = Class.create(Unit,{

  scalable: false,
  
  initialize : function($super,scene,x,y, text, oneMessage){
    $super(scene,x,0, {y:y});
    this.text = text;
    this.oneMessage = oneMessage;
  },

  textInfo : function(){
    return this.text
  }
})
