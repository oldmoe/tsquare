var ClashDirectionsGenerator = Class.create({
  speed : 7,
  minSpeed : 2,
  maxSpeed : 15,
  rate : 1,
  clickPosition : null,
  widthTolerance : 40,
  directions : {0:"right",1:"left",2:"up",3:"down"},
  initialize : function(scene){
    this.directions = []
    this.scene = scene
    this.rate = this.scene.reactor.everySeconds(this.rate)
    this.clickPosition = {x:this.scene.view.width/2,y:0}
    this.running = false
    this.createFrame()
  },
  generateDirection : function(){
    if(!this.running)return
    var direction = Math.round(Math.random())
    this.addDirection(direction)
    this.scene.reactor.push(this.rate,this.generateDirection,this)
  },
  tick : function(){
    if(!this.running)return
    for(var i=0;i<this.directions.length;i++){
      this.directions[i].owner.coords.x-=this.speed
    }
    if(this.directions[0] && this.directions[0].owner.coords.x < this.scene.view.width / 2){
        // mistake
        this.directions[0].obj.destroy()
        this.directions[0].obj.removed = true
        this.directions.shift()
     }
  },
  stop : function(){
    this.running = false
    while(this.directions.length > 0){
      this.directions[0].obj.destroy()
      this.directions[0].obj.removed = true
      this.directions.shift()
    }
  },
  createFrame : function(){
    var owner = {coords: {
      x: this.scene.view.width / 2,
      y: 0
    }, angle:0, imgWidth : 60, imgHeight:60}
    console.log('x',owner.coords.x)
    this.frame = new DomImgSprite(owner,{img:Loader.images.gameElements['square.png']},{
      width : 60,
      height : 60
    })
    this.frame.setImgWidth(60)
    this.frame.render()
  },
  processDirection : function(direction){
    if(this.directions[0]){
      console.log(this.directions[0].owner.coords.x,this.clickPosition.x)
       if(direction == this.directions[0].direction){
         if(this.directions[0].owner.coords.x > this.clickPosition.x - this.widthTolerance &&  this.directions[0].owner.coords.x < this.clickPosition.x + this.widthTolerance){
           console.log('correct')
         }
       }else{
         console.log('wrong')
       }
    }else{
        console.log('wrong')
    }
  },
  addDirection : function(direction){
    var owner = {coords: {
      x: this.scene.view.width - 20,
      y: 0
    }}
    var display = new ClashDirection(owner,direction)
    this.scene.pushToRenderLoop('skyline', display)
    this.directions.push({owner : owner,obj: display, direction:direction})
  },
  run : function(){
    this.running = true
    this.generateDirection()
  }
})
