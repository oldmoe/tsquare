//loads images and store them in memory for later use

var Loader = Class.create({
  initialize: function (){
    this.loadedResources =0
    this.chunk = 25
    this.currentLength = 0
    this.resources = []
    this.options = [];
  },
  /*
  this method loads the images
    @imageNames         array of names of the images for ex: ['tank.png','creep.png']
    path          the path that contains the images for ex: c:/images/
    onProgress          a callback that takes a parameter "progress" and it's called each time an image is loaded
    onFinish        a callback that is called after all images are loaded
  */
  setLength : function(resources){
    var self = this
    resources.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          self.currentLength += resource[type].length
        }
      })
    })
  },  

  load : function(resources, options){
    this.options.push(options)
    this.setLength(resources)
    var self = this
    var objects = []
    var toLoad = []
    var l =0
    var remainedResources = []
    resources = resources.clone()
    resources.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          if(l>self.chunk)  remainedResources.push(resource)
          var names = resource[type]
          if(names.length+l<self.chunk){
            l+=names.length
            toLoad.push(Nezal.clone_obj(resource))
            resource[type]= []
          }
          else{
            var n = Nezal.clone_obj(resource)
            n[type] = resource[type].splice(0,self.chunk-l)
            toLoad.push(n)
            l=self.chunk
            remainedResources.push(resource)
          }
        }
      })
    })
    this.addResources(remainedResources)
    toLoad.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          var path = resource.path || type+'/game/'
          var store = resource.store
          var names = resource[type]
          self.loadResources(path,store,names,type)
        }
      })
    })
  },
  addResources : function(resources){
    var self = this
    resources.each(function(resource){
      self.resources.push(resource)
    })
  },
  loadResource : function(){
    var self = this
    var resource = this.resources[0]
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          var path = resource.path || type+'/game/'
          var store = resource.store
          var names = resource[type]
          if(names.length==1)self.resources.splice(0,1)
          self.loadResources(path,store,names.splice(0,1),type)
        }
      })
  },
  loadResources : function(path,store,names,type){
    var self = this
    if(!Loader[type][store])Loader[type][store] = {}
    for ( var  i=0 ; i < names.length ; i++ ){
      if(!Loader[type][store][names[i]]){ 
        var src = ''
        src = path + names[i]
        Loader[type][store][names[i]] = self['load_'+type](src, this.options);
      }else{
        self.onload(this.options);
      //objects[names[i]] = Loader[type][store][names[i]]
      }
    }
  },

  onload: function(options){
    var self = this;
    this.loadedResources++;
    options.each(function(options){
      if(options.onProgress) options.onProgress(Math.round((self.loadedResources/self.currentLength)*100))
    });
    if(self.loadedResources == self.currentLength){
      self.loadedResources = 0
      self.currentLength = 0
      options.each(function(options){
        if(options.onFinish){
          options.onFinish()
        }
      });
      self.options = [];
    } 
    else if(self.resources.length>0){
      self.loadResource()
    }
  },

  onerror: function(resource, options){
    var self = this;
    this.loadedResources++;
    resource.src = '';
    if(self.loadedResources == self.currentLength){
      self.loadedResources = 0
      self.currentLength = 0
      options.each(function(options){
        if(options.onError){
          options.onError()
        }
        else if(options.onFinish){
          options.onFinish()
        }
      });
      self.options = [];
    } 
    else if(self.resources.length>0){
      self.loadResource()
    }
  },

  load_images : function(src, options){
    var image = new Image();
    var self = this
    image.onload = function(){self.onload(options);}
    image.onerror = function(){self.onerror(this, options);}
    image.src = src
    return $(image)
  },
  
  load_sounds : function(src, options){
	  var self = this
	  var sound = null
	  if(soundManager && soundManager.ok()){
		  sound = soundManager.createSound({
			  id : src.split('.')[0],
			  url : src,
			  autoPlay : false,
			  autoLoad : true,
			  volume : 100,
			  multiShot : true,
			  onload : function(){self.onload(options)}	
		  })
	  }else{
		  sound = new Audio
		  sound.onload = function(){self.onload(options)}
		  sound.src
	  }
    return sound
  },
  load_animations :function(src,options){
    return this.load_images(src,options)
  },
  load_htmls : function(src, options){
    var self = this;
    var content = {html : ''};
    new Ajax.Request(src, {
      method : 'get',
      asynchronous : true,
      onSuccess: function(response) {
        content.html = response.responseText;
        self.onload(options);
      }
    })
    return content;
  }
})

Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.htmls = {} 
Loader.resourceTypes = ['images', 'sounds','animations', 'htmls']

