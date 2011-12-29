var Block = Class.create(Enemy,{
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    elementWidth : 70,
    elementHeight : 15,
    noDisplay : false,
    distaceBetweenUnits : 10,
    text: "",
        
    initialize : function($super,scene,x,lane,options){
      this.type = "block";
      this.elements = []
      $super(scene,x,lane,options)
      if (options && options.obj) {
          this.objectType = options.obj
          this.addElementsToBlock(options)
      }
      this.options = options
      
      this.text = this.scene.handlers.message.messages.enemy[Math.round(Math.random()*(this.scene.handlers.message.messages.enemy.length-1))];
    },
    
    textInfo: function(){
      return this.text;
    },
    
    addElementsToBlock : function(options){
      var counter = 0
      for(var i=0;i<options.rows;i++){
        this.elements[i] = []
        for (var j = 0; j < options.columns; j++) {
            var randomY = Math.round(Math.random()*8) - 4
            var randomX = Math.round(Math.random()*8) - 4
            var x = this.coords.x + this.elementWidth * i - this.distaceBetweenUnits*j + this.scene.view.xPos;
            options.y = this.coords.y + this.elementHeight * (j-1);
            this.elements[i][j] = this.scene.addObject({name: options.obj, x: x, lane:this.lane, options:options});
            this.elements[i][j].block = this;
        }
      }
    },
    
   updatePosition : function($super){
      $super()
   },
   
    takeHit : function(power){
      var maxHp = 0
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].takeHit(power)
          maxHp = Math.max(this.elements[i][j].hp,maxHp ) 
          if (maxHp <= 0) {
            break;
          }
        }
      }
      if(maxHp<= 0){
        this.scene.collision = false;
        this.scene.fire("targetCircleComplete");
        this.die();
      }
    },
    
    getSize : function(){
      return this.elements.length * this.elements[0].length  
    }, 
    
    split : function(){
      if(this.elements.length == 1)return
       if(this.elements.length == 3 || this.elements.length == 2){
          this.setTarget(null)
          var options = this.options
          options.type = "3_1";
          options.mappingName = options.mappingName || options.obj
          options.obj = null;
          var blocks = [] 
          for(var i=0;i<this.elements.length;i++){
            var b = new Block(this.scene,this.elements[i][0].coords.x ,this.scene.activeLane, options)
		        var objDisplay = new BlockDisplay(b)
    		     if (!b.noDisplay) {
    		       this.scene.pushToRenderLoop('characters', objDisplay)
    		     }
            b.coords.y = this.coords.y
            b.moveToTarget({x:this.coords.x + (100+150*i),y:this.coords.y})
            b.elements = [this.elements[i]]              
            blocks.pushFirst(b)
          }
          for (var i = 0; i < this.elements.length; i++) {
            this.handler.objects[this.lane].pushFirst(blocks[i])
          }
        }
        this.handler.removeObject(this, this.lane)
        this.destroy(true);
    },
    
    setElements : function(elements){
        this.elements = elements
    },
    
    setTarget : function(target){
      for(var i=0;i<this.elements.length;i++){
          for(var j=0;j<this.elements[i].length;j++){
              this.elements[i][j].setTarget(target)
          }
      }  
    },
    
    pickTarget : function(targets){
        for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
                this.elements[i][j].pickTarget(targets)
            }
        }
    },
    tick : function($super){
       $super()
       for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
               this.elements[i][j].tick()
            }
        }
    },
    move : function(dx,dy){
        this.coords.x+=dx
        this.coords.y+=dy
        this.moveElements(dx,dy)
    },    
    takePush : function(){
       this.chargeTolerance--;
       if(this.chargeTolerance == 0) this.split();
    },
    
    moveElements : function(dx,dy){
        for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
                this.elements[i][j].move(dx,dy)
            }
        }
    },
    
    setCoords : function(coords){
      this.coords = coords
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].coords = Nezal.clone_obj(coords) 
        }
      }
    },
    
    die: function($super){
      $super();
    }
    
})
