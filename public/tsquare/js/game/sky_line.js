var SkyLine = Class.create({
	
	initialize: function(scene){
    	this.backgrounds = []
    	this.scene = scene
    	
      var images_sky = [Loader.images.background['background.png']];
      var images_clowd = [Loader.images.background['clowds.png']];
      var images_crowd = [Loader.images.background['followers_crowd.png']];
      var images_layer1 = [Loader.images.background[game.data.backgrounds.layer1[0].name]];
      var images_layer2 = [Loader.images.background[game.data.backgrounds.layer2[0].name]];
      var images_lamp = [Loader.images.background[game.data.backgrounds.lamp[0].name], Loader.images.background[game.data.backgrounds.lamp[0].name]]
      var images_road = [Loader.images.background[game.data.backgrounds.land[0].name]]
      var images_fence = [Loader.images.background[game.data.backgrounds.fence[0].name]]
        
      var self = this
      var background_sky = new Background(this.scene, {speed : function(){return  self.scene.direction*(0)}, y: 0, imagesCount: 15, images:images_sky, offsetX:0});
      var background_clowd = new Background(this.scene, {speed : function(){return  self.scene.direction * self.scene.currentSpeed + 3 }, y: 0, imagesCount: 3, images:images_clowd, offsetX:0, alwaysMove : true});
      var background_layer2 = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed-2)}, y: 0, imagesCount: 2, images:images_layer2})
      var background_layer1 = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed-1)}, y: 0, imagesCount: 2, images:images_layer1})
      
      var background_road = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 340, imagesCount: 2, offsetX:0, images:images_road})
      var background_crowd = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 270, imagesCount: 2, images:images_crowd, offsetX:0});
      var background_fence = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 350, imagesCount: 14, images:images_fence})
      var background_lamp = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 200, imagesCount: 3, images:images_lamp})
      
//      var transparent_layer1 = new TransparentLayer(background_cloud.container);
//      var transparent_layer2 = new TransparentLayer(background_layer2.container);
//      transparent_layer1.setBackgroundColor("ff2200");
//      transparent_layer2.setBackgroundColor("ffcccc");
      this.backgrounds.push(background_sky);
      this.backgrounds.push(background_clowd);
      this.backgrounds.push(background_layer1);
      this.backgrounds.push(background_layer2);
      if( game.data.backgrounds.landmarks.length > 0 ){
        var images_landmarks = [Loader.images.background[game.data.backgrounds.landmarks[0].name]]
        var background_landmarks = new Background(this.scene, 
                                                    {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, 
                                                     y: 113,
                                                     imagesCount: 1,
                                                     offsetX: 2000-images_landmarks[0].width/2,
                                                     images:images_landmarks,
                                                     noRepeat : true
                                                    });
        this.backgrounds.push(background_landmarks);
      }
      this.backgrounds.push(background_road);
      this.backgrounds.push(background_fence);
      this.backgrounds.push(background_lamp);
      this.backgrounds.push(background_crowd);
    		
    	for(var i=0; i<this.backgrounds.length; i++){
    		scene.objects.push(this.backgrounds[i])
    		scene.pushToRenderLoop('skyline',this.backgrounds[i])
    	}
	}
});