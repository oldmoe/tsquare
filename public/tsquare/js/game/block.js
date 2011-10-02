var Block = Class.create(Enemy,{
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    elementWidth : 70,
    elementHeight : 15,
    noDisplay : true,
    
    initialize : function($super,scene,x,y,options){
      this.type = "block";
      this.elements = []
      $super(scene,x,y,options)
      if (options && options.obj) {
          this.objectType = options.obj
          this.addElementsToBlock(options)
      }
      this.options = options
    },
    
    
    addElementsToBlock : function(options){
      var counter = 0
      var blockObjectKlass = eval(options.obj.formClassName())
      for(var i=0;i<options.rows;i++){
        this.elements[i] = []
        options.type = "1_1"
        for (var j = 0; j < options.columns; j++) {
            this.elements[i][j] = new blockObjectKlass(this.scene,0,this.lane,options)
            var randomY = Math.round(Math.random()*8) - 4
            var randomX = Math.round(Math.random()*8) - 4
            this.elements[i][j].coords.x = this.coords.x + this.elementWidth * i - 10*j
            this.elements[i][j].coords.y = this.coords.y + this.elementHeight * (j-1)
        }
      }
    },
    updatePosition : function($super){
      $super()
   },
    getWidth : function(){
      if(!this.elements[0] || !this.elements[0][0])return 0
      return this.elementWidth * this.elements.length + (this.elements[0][0].imgWidth - this.elementWidth)  
    },
    
    getHeight : function(){
      if(!this.elements[0]  || !this.elements[0][0])return 0
      return this.elementHeight * this.elements.length + (this.elements[0][0].imgHeight - this.elementHeight)
    },
    
    takeHit : function(power){
      var maxHp = 0
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].takeHit(power)
          maxHp = Math.max(this.elements[i][j].hp,maxHp ) 
          if (this.elements[i][j].hp <= 0) {
            this.elements[i][j].destroy()
            this.elements[i].remove(this.elements[i][j])
            j--
          }
        }
      }
      if(maxHp<= 0 && this.handler.objects[this.lane].indexOf(this)!=-1 ){
        this.dead = true
        this.handler.objects[this.lane].remove(this)
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
            var blocks = [] 
            for(var i=0;i<this.elements.length;i++){
              var b = new Block(this.scene,this.elements[i][0].coords.x ,1, options)
              b.coords.y = this.coords.y
              b.moveToTarget({x:this.coords.x + (100+150*i),y:this.coords.y})
              b.elements = [this.elements[i]]              
              blocks.pushFirst(b)
            }
            for (var i = 0; i < this.elements.length; i++) {
              this.handler.objects[this.lane].pushFirst(blocks[i])
            }
        }
        this.handler.objects[this.lane].remove(this)
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
       this.chargeTolerance--
       if(this.chargeTolerance == 0) this.split()
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
  destroy : function(){
    for (var i = 0; i < this.elements.length; i++) {
      for (var j = 0; j < this.elements[i].length; j++) {
        this.elements[i][j].destroy()
      }
    }     
  }    
})
