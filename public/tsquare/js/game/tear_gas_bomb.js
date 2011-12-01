var TearGasBomb = Class.create({
    //Attributes for throwing mechanics
    ground: 0,
    t_0: 0,
    t_scale: 500,
    ax: 0,
    ay: 0.004,
    vx: 0,
    vy: 0,
    x_0: 0,
    y_0: 0,
    mode: 0,
    omega: -0.02,
    theta: 0,
    rx: 0,
    ry: 0,
    //Attributes for smoke
    smokes : null,
    smokeRate : 5,
    tickCounter : 0,
    smokeTypes : 4,
    rested : false,
    empty : false,
    smokesCount : 0,
    smokesMaxCount : 20,
    bombSmokesIds : [1, 2, 3, 4],
    hitRate : 5,
    power : 1,
    initialize: function(scene, enemy, coords, velocity, theta, angle_0){
        this.scene = scene;
        this.coords = coords;
        this.ground = 130;
        this.enemy = enemy;
        this.theta = theta;
        this.vx = velocity * Math.cos(angle_0);
        this.vy = velocity * Math.sin(angle_0);  
        this.x_0 = this.coords.x;
        this.y_0 = this.coords.y;
    },
    
    tick: function(){
        this.tickCounter++;
        if(!this.rested)this.moveBomb();
        this.updatePosition();
        if (!this.empty) {
          if (this.tickCounter % this.smokeRate == 0) {
            this.createSmoke();
          }
          if(this.tickCounter % this.hitRate == 0){
           this.scene.handlers.crowd.takeHit(this.power) 
          }  
        }
        if(this.coords.x < 0) this.finished = true;
    },
    
    updatePosition : function(){
      this.coords.x-=this.scene.currentSpeed * this.scene.direction;
    },
    
    moveBomb : function(){
        var t = this.scene.reactor.currentTime();
        if (this.rx == 0 && this.ry == 0) {
          this.rx = this.imgWidth / 2;
          this.ry = this.imgHeight / 2;
        }
        if(this.t_0 == 0) this.t_0 = this.scene.reactor.currentTime();  
        // projectile x & y
        var dt = (t - this.t_0) / 1000 * this.t_scale;
        this.coords.x = this.x_0 + this.vx * dt + 0.5 * this.ax * dt * dt;
        this.coords.y = this.y_0 + this.vy * dt + 0.5 * this.ay * dt * dt;
        
        // rotations and settling
        if (this.mode >= 100) {
          var a = this.theta;
          if (a > Math.PI) a -= Math.PI;
          if (Math.abs(Math.sin(a)) < 0.1) { // settling
            this.theta = a > Math.PI / 2? Math.PI : 0; 
          } else {  // continue rotations till horizontal
            if (a < Math.PI / 2) this.theta += 0.5 * this.omega;
            else this.theta -= 0.5 * this.omega;
          }
          // keep going down till we touch the ground
          this.coords.y = Math.min(this.ground - this.imgHeight / 2, this.coords.y);
          return;
        } else {
          this.theta += 3 * this.omega;
          if (this.theta < 0) this.theta += 2 * Math.PI;
          else if (this.theta > 2 * Math.PI) this.theta -= 2 * Math.PI;
        }
        
        // contact points with the ground level
        var y1 = this.coords.y + (this.imgWidth / 2) * Math.abs(Math.sin(this.theta));
        var y2 = y1 + (this.imgHeight / 2) * Math.abs(Math.cos(this.theta));
        if (y2 >= this.ground) {
            if (this.mode < 2) { // collision
                if (this.vy > 0) 
                    this.vy *= -1;
                this.t_0 = t;
                this.x_0 = this.coords.x;
                this.y_0 = this.coords.y;
                this.vy = -0.35;
                this.vx = -0.35;
                this.omega = -0.02;
                this.mode++;
            }
            else 
                if (this.mode < 100) { // bounces
                    this.t_0 = t;
                    this.x_0 = this.coords.x;
                    this.y_0 = this.coords.y;
                    this.vy *= 0.75;
                    this.vx *= 0.9;
                    this.omega *= 1.05;
                    this.mode++;
                }
            if (Math.abs(this.vy) < 0.01) { // rest
                this.ry = y2 - this.coords.y;
                this.rx = 0;
                this.t_0 = t;
                this.x_0 = this.coords.x;
                this.vx = 0;
                this.omega = -0.2;
                this.mode = 100;
                this.rested = true;
                this.scene.applySpeedFactor(0.2)
            }
        }  
    },
    
    createSmoke : function(){
      if (this.smokesCount < this.smokesMaxCount) {
        this.smokesCount++
        var rand = Math.round(Math.random() * (this.bombSmokesIds.length-1))
        var id = this.bombSmokesIds[rand]
        this.bombSmokesIds.splice(rand,0)
        if(this.bombSmokesIds.length == 0){
          this.bombSmokesIds = [1,2,3,4]
        }
        var bombSmoke = new BombSmoke(this.scene, this.coords.x, this.coords.y, id);
        var bombSmokeDisplay = new BombSmokeDisplay(bombSmoke);
        this.scene.pushToRenderLoop('characters', bombSmokeDisplay);
        this.scene.push(bombSmoke);
      }else{
        this.empty = true;
      }
//      this.smokes.push(bombSmoke)
    }
})
