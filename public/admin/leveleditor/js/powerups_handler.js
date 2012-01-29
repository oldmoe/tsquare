var PowerupsHandler = Class.create({
	
	levelEditor: null,
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		
		this.addDropEvent('winPowerups');
	},
	
	addDropEvent: function(dropTarget){
		var self = this; 
    $(dropTarget).ondragover = function(){return false}
    $(dropTarget).ondrop = function(event){
      if(event.dataTransfer.mozSourceNode.getAttribute('category'))
        self.drop(event.dataTransfer.mozSourceNode, dropTarget);
      return false;
    }
	},
	
	drop: function(draggable, dropTarget){
      if($(draggable).getAttribute('category') == 'powerup')
        this.addObject(draggable, dropTarget);
	},
	
	loadObject: function(obj, container){
	  this.createObject(obj, $(container)); 
	},
	
	addObject: function(draggable, dropTarget){
    var obj = {};
    obj.name = draggable.name;
    obj.category = $(draggable).getAttribute('category');
    obj.type = $(draggable).getAttribute('type');
    obj.attribute = $(draggable).getAttribute('attribute');
    obj.effect = $(draggable).getAttribute('effect');
    obj.image = draggable.src;
	  this.createObject(obj, dropTarget);
	},
	
	createObject: function(obj, container){
	  this.addCloseEvent($(container).insert({bottom:this.createHTMLElement(obj)}).lastChild);
	},
	
	createHTMLElement: function(obj){
		return '<div style="float:left;position: relative">'+
		'<div class="loCloseIcon"></div>'+
		this.createDraggedItem(obj)+
		'</div>';
	},
	
	addCloseEvent: function(tile){
		var self = this; 
		tile.select('[class=loCloseIcon]')[0].observe('click', function(){
			var res = confirm("Are you sure you want to delete this tile?", "Confirmation");
			if(res == true){
				self.remove(tile);
			}
		});	
	},
		
	createDraggedItem : function (obj){
		return '<img src="'+obj.image+'" name="'+obj.name+'" category="'+obj.category+'" type="'+obj.type+'" attribute="'+obj.attribute+'" effect="'+obj.effect+'" />';
	},
	
	remove: function(tile){
		tile.remove();
	},
	
  getWinPowerupsData: function(){
    return this._exportData('winPowerups');
  },

	_exportData: function(container){
		var data = [];
		$(container).childElements().each(function(elem){
			var obj = {};
			obj.name = $(elem.lastChild).getAttribute('name');
      obj.category = $(elem.lastChild).getAttribute('category');
      obj.type = $(elem.lastChild).getAttribute('type');
      obj.attribute = $(elem.lastChild).getAttribute('attribute');
      obj.effect = $(elem.lastChild).getAttribute('effect');
			data.push(obj);
		});
		return data;
	}
	
	
});