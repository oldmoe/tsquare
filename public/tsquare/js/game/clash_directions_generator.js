//generates directions in case of clash mode
//how, hide clash sprites based on the mode
//check for clicks if correct or not
var ClashDirectionsGenerator = Class.create({
  speed : 12,
  minSpeed : 12,
  clickPosition : null,
  widthTolerance : 40,
  directions : {0:"right",1:"left",2:"up",3:"down"},
  crowd : null, enemy : null,
  startCounter : 3,
  directionsArrived : 0,
  firstCorrect : false,
  distanceToGenerateDirection : 150,
  initialize : function(scene){
    this.sprites = {}                         
    this.directions = []
    this.scene = scene
    this.rate = this.scene.reactor.everySeconds(this.rate)
    this.clickPosition = {x:this.scene.view.width/2,y:0}
    this.running = false
    this.createFrame()
    this.createObservers()
    this.hide()
    this.startingDirection = 0;
  },
  
  createObservers : function(){
    var self = this
    this.scene.observe('clashCrowdsBack',function(){
      self.run();
    })
    this.scene.observe('clashWin', function(){
      self.stop();
    })
    this.scene.observe('clashLose', function(){
      self.stop();
    })
     this.scene.observe('enemyClashed', function(){
      Effect.Shake('gameContainer', {duration : 0.2, distance : 5 });
    })
  },
  
  generateDirection : function(){
    if(!this.running)return
    var direction = Math.round(Math.random()*3)
    this.addDirection(direction)
  },
  
  tick : function(){
    if(!this.running)return
    if(!this.crowd || !this.enemy) return
    if(!this.directions[0] || this.directions[this.directions.length-1].owner.moved > this.distanceToGenerateDirection){
      this.generateDirection()
    }
    for(var i=this.startingDirection; i<this.directions.length;i++){
      this.directions[i].owner.coords.x-= this.speed 
      this.directions[i].owner.moved +=this.speed
    }
    if(this.directions[0] && this.startingDirection == 0 && this.directions[0].owner.coords.x < this.scene.view.width / 2 - 15){
      var self = this
      self.startingDirection = 1
      Effect.Fade(this.directions[0].obj.sprites.direction.div, {duration : 0.3, afterFinish: function(){
        if(self.directionsArrived == 0){
          self.enemy.startClash(self.crowd)
        }
        self.directionsArrived++ 
        if(self.directions[0].obj.directionCorrect){
          self.crowd.clashPush()
        }else{
          self.enemy.clashPush()
        }
        self.removeFirstDirection()
        self.updateSpeed()
        self.checkEnd()
      }})  
    }
  },
  
  checkEnd : function(){
    if(this.crowd.coords.x > this.scene.view.width - 180){
      this.scene.fire('clashWin')
    }else if(this.enemy.coords.x < 100){
      this.scene.fire('clashLose')
    }
  },
  
  updateSpeed : function(){
    this.speed = this.minSpeed + (this.crowd.coords.x - this.scene.view.width/2)/100
  },
  
  removeFirstDirection : function(){
    this.directions[0].obj.destroy()
    this.directions[0].obj.removed = true
    this.directions.shift()
    this.startingDirection = 0
  },
  
  createFrame : function(){
    var frameOwner = {coords: {
      x: this.scene.view.width / 2,
      y: 0
    }, angle:0, imgWidth : 60, imgHeight:60}
    this.sprites.frame = new DomImgSprite(frameOwner,{img:Loader.images.gameElements['square.png']},{
      width : 60,
      height : 60,
      shiftX : -30
    })
    this.sprites.frame.setImgWidth(60)
    this.sprites.frame.render()
    var leftLineOwner = {coords: {
      x: this.scene.view.width / 2 - 350,
      y:  100
    }, angle:0, imgWidth : 80, imgHeight:130}
    var rightLineOwner = {coords: {
      x: this.scene.view.width / 2 + 350,
      y:  100
    }, angle:0, imgWidth : 80, imgHeight:130}
    this.sprites.leftLine = new DomImgSprite(leftLineOwner,{img:Loader.images.gameElements['line.png']})
    this.sprites.rightLine = new DomImgSprite(rightLineOwner,{img:Loader.images.gameElements['line.png']})
    this.sprites.leftLine.render()
    this.sprites.rightLine.render()
  },
  
  processDirection : function(direction){
    if(this.directions[0]){
      if(direction == this.directions[0].direction){
         if(this.directions[0].owner.coords.x > this.clickPosition.x - this.widthTolerance &&  this.directions[0].owner.coords.x < this.clickPosition.x + this.widthTolerance){
           if(!this.firstCorrect){
             this.crowd.startClash(this.enemy)
             this.firstCorrect = true
           } 
           this.directions[0].obj.correct()
         }else{
           this.directions[0].obj.wrong()
         }
       }else{
          this.directions[0].obj.wrong()
       }
    }
  },
  
  addDirection : function(direction){
    var owner = {
      coords: {
        x: this.scene.view.width - 20,
        y: 0
      },
      moved: 0
    }
    var display = new ClashDirection(owner,direction)
    this.scene.pushToRenderLoop('skyline', display)
    this.directions.push({owner : owner,obj: display, direction:direction})
  },
  
  stop : function(){
    this.hide()
    this.running = false
    this.firstCorrect = false
    this.crowd = null
    this.enemy = null
    this.directionsArrived = 0
    var length = this.directions.length
    for(var i=0;i<length;i++){
      this.removeFirstDirection()
    }
  },
  
  run : function(){
    this.show()
  },
  
  start : function(){
     this.scene.reactor.pushEvery(0,this.scene.reactor.everySeconds(1),this.doStart,this)
  },
  
  doStart: function(){
    $('initCounter').show()
    $('initCounter').update("");
    console.log(this.startCounter)
    $('initCounter').appendChild(Loader.images.countDown[this.startCounter + ".png"]);
    Effect.Puff('initCounter')
    this.startCounter--
    if (this.startCounter == 0) {
      this.scene.reactor.push(this.scene.reactor.everySeconds(1), function(){
        $('initCounter').show()
        $('initCounter').update("");
        $('initCounter').appendChild(Loader.images.countDown["go.png"]);
        this.startCounter = 3;
        Effect.Puff('initCounter', {
          transition: Effect.Transitions.sinoidal
        })
        this.running = true
        this.generateDirection()
      }, this)
      return false
    }
  },
  
  setCrowd: function(crowd){
    console.log('setting crowd')
    this.crowd = crowd
    if (this.enemy) 
      this.start()
  },
  
  setEnemy: function(enemy){
    console.log('setting enemy')
    this.enemy = enemy
    if (this.crowd) 
      this.start()
  },
  
  hide: function(){
    for (var sprite in this.sprites) {
      this.sprites[sprite].hide()
    }
  },
  
  show: function(){
    for (var sprite in this.sprites) {
      this.sprites[sprite].show()
    }
  }
})
