var TearGasBomb = Class.create({
    ground: 0,
    t_0: 0,
    t_scale: 400,
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
    initialize: function(scene, enemy, coords, velocity, theta, angle_0){
        this.scene = scene;
        this.coords = coords;
        this.ground = 150;
        this.enemy = enemy;
        this.theta = theta;
        this.vx = velocity * Math.cos(angle_0);
        this.vy = velocity * Math.sin(angle_0);  
        this.x_0 = this.coords.x
        this.y_0 = this.coords.y
    },
    tick: function(){
        var t = new Date().getTime();
        if (this.rx == 0 && this.ry == 0) {
          this.rx = this.imgWidth / 2
          this.ry = this.imgHeight / 2
        }
        if(this.t_0 == 0) this.t_0 = t;  
        // projectile x & y
        var dt = (t - this.t_0) / 1000 * this.t_scale;
        this.coords.x = this.x_0 + this.vx * dt + 0.5 * this.ax * dt * dt;
        this.coords.y = this.y_0 + this.vy * dt + 0.5 * this.ay * dt * dt;
        
        // rotations and settling
        if (this.mode >= 100) {
            if (Math.sin(this.theta) < 0.01 && Math.sin(this.theta) > -0.01) { // settling
            }
            else { // continue rotations till horizontal
                this.theta += Math.cos(this.theta) * 0.2 * this.omega;
            }
            // keep going down till we touch the ground
            this.coords.y = Math.min(this.ground - this.imgHeight / 2, this.coords.y);
            return;
        }
        else {
            this.theta += 3 * this.omega;
            if (this.theta > 2 * Math.PI) 
                this.theta -= 2 * Math.PI;
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
            }
        }
    }
})
