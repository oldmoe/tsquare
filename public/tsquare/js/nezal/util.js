//contains common important functions
var Util = {
	log : function(obj){
		if(console) console.log(obj)
	},
  
  degToRad : function(deg){
    return deg * Math.PI / 180
  },
  
  radToDeg : function(rad){
    return rad * 180 / Math.PI
  },
	
	//gets the distances to move according to the speed
	//@x1,@y1 params : coordinates of the object
	//@x2,@y2 params : coordinates of the target
	//@speed param : speed of movement
	getNextMove : function(x1,y1,x2,y2,speed){
		if(x1==x2&&y1==y2) return [0,0,0]
		var distance = Util.distance(x1,y1,x2,y2)
		speed = Math.min(speed,distance)
		var angle =0
		var tan = 0
		if(x1==x2 && y1 > y2){
      		angle = Math.PI/2
    	}
		else if (x1 == x2 && y1 < y2) {
			angle = Math.PI * 1.5
		}
		else {
			tan = (y1 - y2) / (x1 - x2);
			angle = Math.atan(tan);
		}
    	
		var dy = Math.abs((speed * Math.sin(angle)));
		var dx = Math.abs((speed * Math.cos(angle)));
		var xDiff = x1-x2;
		var yDiff = y1-y2;
		if(xDiff>0)dx*=-1;
		if(yDiff>0)dy*=-1;
		var movements = new Array;
		movements[0] = dx;
		movements[1] = dy;
		movements[2] = angle
		return movements;
	},
	
	// determines whether two lines are intersected or not
	// @v1,@v2 the two lines ,  each line is represented of by points (x1,y1),(x2,y2) as [x1,y1,x2,y2] 
	lineIntersection : function(v1,v2){
		if(this.pointDirection([v1[0],v1[1]],v2)* this.pointDirection([v1[2],v1[3]],v2) <= 0
		&& this.pointDirection([v2[0],v2[1]],v1)* this.pointDirection([v2[2],v2[3]],v1) <= 0) return true
		return false
	 },
	 
	 // helper function to get the direction of a point to a line the returned number sign represents 
	 // the direction
	 pointDirection : function(p,line){
		var v1 = [line[0]-p[0],line[1]-p[1]]
		var v2 = [line[2]-p[0],line[3]-p[1]]
        var res = v1[0]*v2[1] - v2[0]*v1[1]
        var ret = 0
        if(res>0)ret = 1
        else if(res<0) ret = -1
        return ret
	 },
	 
	 //determines whether two isometric objects intersect or not
	 //@u1,@u2 params : two isometric objects each object o has o.x, o.y which are the center 
	 //of the base and o.imgWidth, o.imgHeight, o.zdim which are the dimesions of the object
	 
	 collision : function(u1,u2){
		var A = [u1.owner.coords.x,u1.owner.coords.y-u1.imgHeight/2+u1.zdim]
		var B = [u1.owner.coords.x-u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
		var C = [u1.owner.coords.x,u1.owner.coords.y+u1.imgHeight/2]
		var D = [u1.owner.coords.x+u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
		
		var AB =  [A[0],A[1],B[0],B[1]]
		var BC =  [B[0],B[1],C[0],C[1]]
		var CD =  [C[0],C[1],D[0],D[1]]
		var DA =  [D[0],D[1],A[0],A[1]]
		
		var X = [u2.owner.coords.x,u2.owner.coords.y-u2.imgHeight/2+u2.zdim]
		var Y = [u2.owner.coords.x-u2.imgWidth/2,u2.owner.coords.y+u2.zdim/2]
		var Z = [u2.owner.coords.x,u2.owner.coords.y+u2.imgHeight/2]
		var W = [u2.owner.coords.x+u2.imgWidth/2,u2.owner.coords.y+u2.zdim/2]
		
		var XY =  [X[0],X[1],Y[0],Y[1]]
		var YZ =  [Y[0],Y[1],Z[0],Z[1]]
		var ZW =  [Z[0],Z[1],W[0],W[1]]
		var WX =  [W[0],W[1],X[0],X[1]]
		
		var v1 = [AB,BC,CD,DA]
		var v2 = [XY,YZ,ZW,WX]
		
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(Util.lineIntersection(v1[i],v2[j])) return true
			}
		}
		return false
	 },
   isInside : function(u1,polygon){
    var A = [u1.owner.coords.x,u1.owner.coords.y-u1.imgHeight/2+u1.zdim]
		var B = [u1.owner.coords.x-u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
		var C = [u1.owner.coords.x,u1.owner.coords.y+u1.imgHeight/2]
		var D = [u1.owner.coords.x+u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
     
    var XY =  [polygon[0].x,polygon[0].y,polygon[1].x,polygon[1].y]
		var YZ =  [polygon[1].x,polygon[1].y,polygon[2].x,polygon[2].y]
		var ZW =  [polygon[2].x,polygon[2].y,polygon[3].x,polygon[3].y]
		var WX =  [polygon[3].x,polygon[3].y,polygon[0].x,polygon[0].y]
    
    var v =  [XY,YZ,ZW,WX]
    var points = [A,B,C,D]
    var dirs = []
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        dirs[j] = Util.pointDirection(points[i],v[j])
      }
      var m = 1;
      for (var j = 1; j < 4; j++) {
        if (dirs[j] != dirs[j - 1]) 
          return false
      }
    }
    return true
   },
	 distance : function(x1,y1,x2,y2){
		return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
	 },
	 timeDisplay : function(remainingTime){
	 	  var string = ''
	 	  var seconds = remainingTime % 60
	    remainingTime = ((remainingTime - seconds) / 60)
	    var minutes = remainingTime % 60
	    remainingTime = ((remainingTime - minutes) / 60)
	    var hours = remainingTime % 24
	    remainingTime = ((remainingTime - hours) / 24)
	    var days = Math.floor(remainingTime)
	    if(days > 0){
	      string = days + 'd ' + hours + 'h'
	    }else if(hours > 0){
	      string = hours + 'h ' + minutes + 'm'      
	    }else if(minutes > 0){
	      string = minutes + 'm ' + seconds + 's'
	    }else{
	      string = seconds + ' seconds'
	    }
	    return string;
	 },
   //attributes can be {text:'text value'} with defualt css or {text:'text value', linkClass:c1, spanClass:c2}
   createButton: function(attributes){
		   var link = $(document.createElement('a'))		   
		   var linkStyleClass = attributes.linkClass || 'defualtButton'
		   link.addClassName(linkStyleClass)
		   var textSpan = $(document.createElement('SPAN'))
		   textSpanStyleClass = attributes.spanClass || 'defaultButtonText'
		   textSpan.addClassName(textSpanStyleClass)
		   textSpan.innerHTML = attributes.text || '';
		   link.appendChild(textSpan);
		   return game.domConverter.getHTML(link);
	},
  flip : function(div){
    div.style.MozTransform = "scaleX(-1)"
    div.style.OTransform = "scaleX(-1)"
    div.style.WebkitTransform = "scaleX(-1)"
    div.style.Transform = "scaleX(-1)"
    div.style['-ms-transform'] = "scaleX(-1)"
    div.style.filter = "filpH"
    div.style.MsFilter = "flipH"
  },
  removeTransform : function(div){
    div.style.MozTransform = ""
    div.style.OTransform = ""
    div.style.WebkitTransform = ""
    div.style['-ms-transform'] = ""
    div.style.filter = ""
    div.style.MsFilter = ""
  }
}
String.prototype.formClassName = function(){
  return this.dasherize().capitalize().camelize()
}
Array.prototype.random = function(){
	return this[Math.round(Math.random()*(this.length-1))]
}
Array.prototype.pushInPlaceDescending=function(obj,field){
	var index=0
	while(this[index]&&this[index][field] < obj[field]){
		index++
	}
	if(!this[index]) this.push(obj)
	else{
		for(var i=this.length;i>index-1;i--){
			this[i]=this[i-1]
		}
		this[index]=obj
	}
}
Array.prototype.pushFirst = function(obj){
    for(var i= this.length-1;i>=0;i--){
        this[i+1] = this[i]
    }
    this[0] = obj
}
Array.prototype.pushInPlaceAscending=function(obj,field){
	var index=0
	while(this[index]&&this[index][field] > obj[field]){
		index++
	}
	if(!this[index]) this.push(obj)
	else{
		for(var i=this.length;i>index-1;i--){
			this[i]=this[i-1]
		}
		this[index]=obj
	}
}

String.prototype.humanize = function(){
  return this.underscore().capitalize().gsub("_", " ");
}

Math.randomSign = function(){
  var r = Math.random();
  return r > 0.5 ? 1 : -1;
}
