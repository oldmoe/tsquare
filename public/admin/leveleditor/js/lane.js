var Lane = Class.create({
	
	DEFAULT_TILE_COUNT : 10,
	
	parent : null,
	tiles : null,
	index: 0,
	domObject : null,
	self : null,
	
	initialize : function(parent, index, tilesCount){
		this.parent = parent;
		this.tiles = [];
		if(index != null){
		  if(index>0)
		    this.domObject = $($(this.parent.domObject).children[index-1]).insert({after:'<tr></tr>'}).next();
		  else
		    this.domObject = $(this.parent.domObject).insert({top:'<tr></tr>'}).firstChild;  
		}else{
		  this.domObject = $(this.parent.domObject).insert({bottom:'<tr></tr>'}).lastChild;
		}
		
		this.createOptionsTile();
		
		var count = this.DEFAULT_TILE_COUNT;
		if(tilesCount)
		  count = tilesCount;
		for(var i=0; i<count; i++){
			this.tiles.push(new Tile(this));
		}
	},

	getPosition: function(){
		return $(this.domObject).previousSiblings().size();
	},
	
	createOptionsTile: function(){
		var elem = $(this.domObject).insert({top:this.createHTML()}).firstChild.firstChild;
		var self = this;
		$(elem).observe('click', function(){
			var res = confirm("Are you sure you want to clear this lane's data?", "Confirmation");
			if(res == true){
				self.remove();
			}
		});
	},
	
	createHTML: function(){
	  return '<td style="background-color:white"><div class="deleteRowButton" title="Delete lane"></div>'+
	  '</td>';
	},
	
	removeTile: function(index){
		$(this.tiles[index].domObject).remove();
		this.tiles.splice(index, 1);
		this.updateTilePositionsLabel();
	},

	addTile: function(index){
	  var tile = new Tile(this, this.tiles[index].domObject);
		this.tiles.splice(index+1,0, tile);
		this.updateTilePositionsLabel();		
	},
	
	remove: function(){
		this.parent.resetLane(this.getPosition());
	},
	
	updateTilePositionsLabel: function(){
		this.tiles.each(function(elem){
			elem.updatePositionLabel();
		});
	}
	
});