var ImgMeterSprite = Class.create(DomSprite, {
  initialize : function($super, owner, images, properties){
    $super(owner, null, properties);
    properties = properties || {}
    this.orientation = properties['orientation'] || 'horizontal'
    this.width = properties['width'] || (this.orientation == 'horizontal' ? 30 : 5)
    this.height = properties['height'] || (this.orientation == 'horizontal' ? 5 : 30)
    this.meterFunc = properties['meterFunc'] || this.owner.getMeterFunc()
    this.hideWhenFull = properties['hideWhenFull']
    this.emptyImg = images.empty.clone()
    this.fullImg = images.full.clone()
    this.fullDivContainer = document.createElement('div')
    this.fullDivContainer.appendChild(this.fullImg)
    this.emptyDivContainer = document.createElement('div')
    this.emptyDivContainer.appendChild(this.emptyImg)
    this.emptyDivContainer.addClassName('meterEmpty')
    this.fullDivContainer.addClassName('meterFull')  
    this.emptyDivContainer.setStyle({'position':'absolute'
                          , height:this.emptyImg.height+"px"
                          , width:this.emptyImg.width+"px"
                          });
    this.fullDivContainer.setStyle({'position':'absolute'
                          , height:this.fullImg.width+"px"
                          , width:this.fullImg.height+"px"
                          });

    this.div.appendChild(this.emptyDivContainer);
    this.div.appendChild(this.fullDivContainer);
    this.div.addClassName('meter')  
    this.setMeterStyle()
    this.height = this.fullImg.height
    this.width = this.fullImg.width
    this.fullImg.setStyle({position:"absolute"})
    this.div.style.width = this.fullImg.width + "px";                         
    this.div.style.height = this.fullImg.height + "px"; 
    this.render()
  },
  
  getMeterLength : function(){
      return Math.round(this.meterFunc() * (this.orientation == 'horizontal' ? this.width : this.height))
  },
    
  setMeterStyle : function(){
    if(this.orientation == 'horizontal'){
      this.fullDivContainer.setStyle({width:this.getMeterLength()+"px"})
    }else{
      var height = this.getMeterLength()
      this.fullDivContainer.setStyle({height:height+"px", top:this.height-height+"px"})
      this.fullImg.setStyle({marginTop: -(this.height-height)+"px"})                               
    }
  },

  render : function($super){
      if (this.meterFunc() <= 0.5 && this.div.style.display=="none") {
        this.div.show()
        return
      }else if(this.meterFunc() > 0.5 && this.div.style.display!="none"){
        this.div.hide()
      }
      if (this.meterFunc() > 0.5 && this.div.style.display=="none") {
        return               
      }
      $super();
    try{
      if(this.owner.dead){
        return this.destroy();
      }
  this.setMeterStyle()
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  }
})
