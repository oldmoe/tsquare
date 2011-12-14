var AmnEktesah = Class.create(Enemy, {

	hitting : false,
	hittingTime : 0,
	hitOffset : 10,
	hittingTime : 0,
	hitDone : false,

	initialize : function($super, scene, x, lane, options) {
		$super(scene, x, lane, options)
		this.type = "amn_ektesah";
		this.hp = 50;
		this.maxHp = 50;
		this.power = 40;
		this.hittingTicks = this.scene.reactor.everySeconds(1)
	},
	handleCollision : function() {
		if(this.target) {
			if(this.hittingTime == this.hittingTicks) {
				this.target.takeHit(this.power);
				this.hitDone = true
			}
			this.hittingTime += 1;
			this.hittingTime = this.hittingTime % (this.hittingTicks + 1);
		}
	},
	updatePosition : function() {

	},
	setTarget : function(target) {
		if(this.target != null && target == null) {
			this.fire("normal")
		}

		if(this.target == null && target != null) {
			this.fire("hit");
		}

		this.target = target;
	}
})