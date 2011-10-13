var Effects = {
  
  fade : function(div, afterFinishFn){
    console.log("Effect Fade", div)
    new Effect.Fade(div, {
			duration: 0.5,
      afterFinish: function(){
        div.hide();
        if (afterFinishFn) 
          afterFinishFn()
      }
    })
  },
  appear : function(div, afterFinishFn){
    console.log("Effect Appear", div)
    new Effect.Appear(div, {
			duration: 0.5,
      afterFinish: function(){
        div.show();
        if (afterFinishFn) 
          afterFinishFn()
      }
    })
  },
	show: function(div){
		new Effect.Grow(div, {
			duration: 0.3
		});
	},
	hide: function(div){
		new Effect.Shrink(div, {
			duration: 0.3
		});
	},
  springFade : function(div,yTransition,afterFinishFn){
    if(this.sf)this.sf.cancel()
    this.sf = new Effect.Move(div, {
      mode: 'relative',
      y: yTransition,
      transition: Effect.Transitions.spring,
      afterFinish: function(){
        new Effect.Fade(div, {
          afterFinish: function(){
            if (afterFinishFn) 
              afterFinishFn()
          }
        })
      }
    })
    
  }
}
