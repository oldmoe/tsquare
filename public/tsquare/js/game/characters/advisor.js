var Advisor = Class.create(Unit,{
    
    speed : 5,
    moved : 0,
    extraScale : 0.85,
    
    initialize : function($super,scene,x,lane, options){
      $super(scene,x,lane, options)
      this.coords.x+=Math.round(Math.randomSign()*Math.random()*this.scene.view.tileWidth/4)
      this.coords.y+=Math.random()*30
      
      this.text = "hi all";
    },
    
    tick : function($super){
      $super()
    },
    
    textInfo: function(){
      return this.text;
    }    
    
})
