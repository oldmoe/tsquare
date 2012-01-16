var Effects = {
  
  fade : function(div, afterFinishFn){
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
  
  springFade: function(div, yTransition, afterFinishFn){
    if (this.sf) this.sf.cancel()
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
  },
  
  shakeOut : function(div, direction, afterFinishFn){
    direction = direction || 1
    new Effect.Shake(div, {
      duration: 0.2,
      distance: 5,
      afterFinish: function(){
        new Effect.Move(div, {x:direction * 700, 
          afterFinish : function(){
            if(afterFinishFn) afterFinishFn()
          } 
        })
      }
   })
  },
  
  kickout : function(element, afterFinishCallback, duration){
     duration = duration || 0.2
     element.setAttribute('scale', '1')
     new Effect.Move(element, {x:200,y:-600, duration: duration, afterFinish : function(){
       new Effect.Move(element, {x:100,y:100, duration: duration, afterFinish :afterFinishCallback })
     }, beforeUpdate : function(){
       var scale = parseFloat(element.getAttribute('scale'))
       scale-=0.1
       element.setStyle({MozTransform : 'scale(' + scale + ')' })
       element.setAttribute('scale', scale)
     }})
  },
  
  pulsateFadeUp : function(element,afterFinishCallback ){
   new Effect.Pulsate(element, {
      duration: 0.8,
      afterFinish: function(){
       new Effect.FadeUp(element, {
          duration: 1,
          afterFinish: function(){
            if(afterFinishCallback)afterFinishCallback()
          }
        })
      }
    })
  },
  pulsateFadeDown : function(element,afterFinishCallback ){
   new Effect.Pulsate(element, {
      duration: 0.8,
      afterFinish: function(){
       new Effect.FadeDown(element, {
          duration: 1,
          afterFinish: function(){
            if(afterFinishCallback)afterFinishCallback()
          }
        })
      }
    })
  }
}
