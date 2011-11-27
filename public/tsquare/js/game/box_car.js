var BoxCar = Class.create(Unit,{
  moveSpeed : 8,
  unloaded : false,
  boxUnit : null,
  verticalShift : -60,
  unitHorizontalShift : -50,
  clashDone : false,
  initialize: function($super, scene, x, y, options){
    $super(scene, x-scene.view.width, y, options)
    this.coords.y+=this.verticalShift
  },
  tick: function($super){
    $super()
    if(this.coords.x < 0.9 * this.scene.view.width || this.clashDone){
      this.updatePosition();
    }else if(!this.unloaded){
      this.unloaded = true
      this.addClashEnemy()
    }
    if(this.coords.x > this.scene.view.width + this.getWidth()){
      this.handler.removeObject(this, this.lane)
    }
  },
  updatePosition: function(){
    this.move(this.moveSpeed, 0);  
  },
  addClashEnemy: function(){
     this.boxUnit = this.handler.createClashEnemy()
     this.boxUnit.coords.x = this.coords.x + this.unitHorizontalShift
     this.boxUnit.coords.y = this.coords.y
     this.boxUnit.fire('front')
     var self = this
     this.boxUnit.moveToTarget({x:this.boxUnit.coords.x , y: this.coords.y-this.verticalShift},
     function(){
       self.boxUnit.fire('normal')
       self.boxUnit.start(self)
     })
  },
  lose : function(){
    this.boxUnit.fire('normal')
    var self = this
    this.boxUnit.moveToTarget({x:this.coords.x+this.unitHorizontalShift,y:this.boxUnit.coords.y},
    function(){
      self.boxUnit.fire('back')
      self.boxUnit.moveToTarget({x:self.boxUnit.coords.x,y:self.coords.y},
      function(){
        self.boxUnit.handler.removeObject(self.boxUnit,self.boxUnit.lane)
        self.clashDone = true
        self.scene.audioManager.stopClash();
      })
    })
  },
  win : function(){
    var self = this
    this.boxUnit.target.clashing = false
    this.boxUnit.target.fire('walk')
    this.boxUnit.fire('reverseWalk')
    this.boxUnit.target.moveToTarget({x:this.boxUnit.coords.x+this.boxUnit.getWidth()- 20, y:this.boxUnit.coords.y},function(){
      self.boxUnit.moveToTarget({
        x: self.coords.x + self.unitHorizontalShift,
        y: self.boxUnit.coords.y
      }, function(){
        self.boxUnit.fire('back')
        self.boxUnit.moveToTarget({
          x: self.coords.x + self.unitHorizontalShift,
          y: self.coords.y
        }, function(){
          self.boxUnit.handler.removeObject(self.boxUnit, self.boxUnit.lane)
          self.clashDone = true
          self.scene.audioManager.stopClash()
        })
      })
      self.boxUnit.target.moveToTarget({
        x: self.coords.x + self.unitHorizontalShift,
        y: self.boxUnit.target.coords.y
      }, function(){
        self.boxUnit.target.fire('back')
        self.boxUnit.target.moveToTarget({
          x: self.coords.x + self.unitHorizontalShift,
          y: self.coords.y
        }, function(){
          self.boxUnit.target.handler.removeObject(self.boxUnit.target, self.boxUnit.lane)
        })
      })
    })
  }
})
