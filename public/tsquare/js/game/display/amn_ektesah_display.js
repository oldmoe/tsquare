var AmnEktesahDisplay = Class.create(AmnMarkazyDisplay, {

	loadImages : function() {
		this.blockImg = Loader.images.enemies['amn_2sticks_walk.png'];
		this.hitImage = Loader.images.enemies['amn_2sticks_hit.png'];
		this.hitEffect = Loader.images.effects['hit1.png'];
	}
})