var Bubble = Class.create(Unit,{

  initialize : function($super,scene,x,y,text){
    $super(scene,x,0, {y:y});
    this.text = text
  },

  textInfo : function(){
    return this.text
  }
})
