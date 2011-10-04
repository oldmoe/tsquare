/* 
  owner : should contain coords hash {coords : {x:10, y:10}}.
          U can move the div within its parent using shiftX, shiftY
  assets : parent : div to which I should append the bar.
           img : bar image.
  properties : width : bar width, defaults to bar image width
              height : bar height, defaults to bar image height
              meterFunc : function that returns the filling portion of the bar
  Example usage :
  new DomMeterbarSprite({coords : {y:100, x:100} },
                {img: Loader.images.game_elements['loadingbar.png'], parent:$$('body')[0]}, { width:310, height:30, 'meterFunc' : function(){return 50;} })
*/
var DomMeterbarSprite = Class.create(DomSprite, {

  initialize : function($super,owner, assets, properties){
    this.shittX = 0;
    this.shiftY = 0;
    this.parent = assets['parent'];
    this.img = assets['img'];
    $super(owner, null, properties);
    /* Create a div container for the image */
    this.imgSprite = new DomSprite(owner);
  	this.imgSprite.div.appendChild(this.img);
    /* Append div container */
    this.div.appendChild(this.imgSprite.div);
    assets.parent.appendChild(this.div);
	  properties = properties || {};
	  this.orientation = properties['orientation'] || 'horizontal'
	  this.width = properties['width'] || (this.orientation == 'horizontal' ? this.img.width : this.img.height);
	  this.height = properties['height'] || (this.orientation == 'horizontal' ? this.img.height : this.img.width);
	  this.meterFunc = properties['meterFunc'] || this.owner.getMeterFunc();
	  this.imgSprite.setStyle({'position':'absolute',
												    'top' : '0px',
                            'left' : '0px',
                            'height' : this.height+"px",
                            'width' : this.width+"px",
                            'overflow' : 'hidden'
												  });
	  this.div.style.width = this.width + "px";													
	  this.div.style.height = this.height + "px";
    this.render();									
  },

  render : function($super){
    this.imgSprite.setStyle({width : this.meterFunc() + "px"});
    $super();
  },

  position : function(){
    var position = {};
    position.x = 0 + this.shiftX;
    position.y = 0 + this.shiftY;
    position.zIndex = this.zIndex;
    return position;
  },

  setShiftX : function(shiftX){
    this.shiftX = shiftX;
  },

  setShiftY : function(shiftY){
    this.shiftY = shiftY;
  },

  createDiv : function(){
    this.div = $(document.createElement('DIV'));
    this.parent.appendChild(this.div);
  }

});
