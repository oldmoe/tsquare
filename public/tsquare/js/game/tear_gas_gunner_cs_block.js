var TearGasGunnerCsBlock = Class.create(Block,{
  backSpeed : 4,
  moved : 0,
  maxMove : 500,
  updatePosition : function($super){
    if (this.elements[0][0].shotComplete){
      if (this.moved < this.maxMove && this.chargeTolerance > 0) {
        if (this.coords.x > 0.9 * this.scene.view.width) {
          this.elements[0][0].shotComplete = false;
          return;
        }
        this.move(this.backSpeed, 0);
        this.moved += this.backSpeed
      }else{
        this.elements[0][0].shotComplete = false;
        $super();
      }
    }else{
      $super()
    }
  }
})
