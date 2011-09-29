var LOSettingsHandler = new Class.create({
	
	levelEditor: null,
	containerId: 'loSettingsDialog',
	tile: null,
		
	initialize: function(levelEditor){
		
		this.levelEditor = levelEditor;
		
		var self  = this;
		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

		$(this.containerId).select('input[class=save]')[0].observe('click', function(){
			self.save();
		});
	},

	save: function(){
		if($(this.containerId).select('input[id=type1]')[0].checked){
			this.tile.settings.type = 1;
			this.tile.settings.random = {};
			this.tile.settings.random.start = Number($(this.containerId).select('input[name=start]')[0].value) - 1;
			this.tile.settings.random.end = Number($(this.containerId).select('input[name=end]')[0].value) - 1;
			this.tile.settings.random.freq = Number($(this.containerId).select('input[name=freq]')[0].value);
			this.tile.settings.random.interval = Number($(this.containerId).select('input[name=interval]')[0].value);
			if(this.tile.settings.random.end < 0){
				this.tile.settings.random.end = Number(this.levelEditor.grid.getMaxLaneLength());
			}
			
		}else if($(this.containerId).select('input[id=type2]')[0].checked){
			this.tile.settings.type = 2;
			this.tile.settings.cyclic = {};
			this.tile.settings.cyclic.start = Number($(this.containerId).select('input[name=start2]')[0].value) - 1;
			this.tile.settings.cyclic.end = Number($(this.containerId).select('input[name=end2]')[0].value) - 1;
			this.tile.settings.cyclic.freq = Number($(this.containerId).select('input[name=freq2]')[0].value);
			this.tile.settings.cyclic.interval = Number($(this.containerId).select('input[name=interval2]')[0].value);
			if(this.tile.settings.cyclic.end < 0){
				this.tile.settings.cyclic.end = Number(this.levelEditor.grid.getMaxLaneLength());
			}
		}
		
		this.close();
	},
	
	open: function(tile){
		this.tile = tile;
		this.upateDate();
		$('loSettingsDialog').style.display = 'block';
	},
	
	upateDate: function(){

		$(this.containerId).select('input[id=type1]')[0].checked = "checked";
		
		$(this.containerId).select('input[name=start]')[0].value = 0;
		$(this.containerId).select('input[name=end]')[0].value = 0;
		$(this.containerId).select('input[name=freq]')[0].value = 0;
		$(this.containerId).select('input[name=interval]')[0].value = 0;

		$(this.containerId).select('input[name=start2]')[0].value = 0;
		$(this.containerId).select('input[name=end2]')[0].value = 0;
		$(this.containerId).select('input[name=freq2]')[0].value = 0;
		$(this.containerId).select('input[name=interval2]')[0].value = 0;

		if(this.tile.settings.type == 1 && this.tile.settings.random){
			$(this.containerId).select('input[id=type1]')[0].checked = "checked";
			$(this.containerId).select('input[name=start]')[0].value = Number(this.tile.settings.random.start) + 1;
			$(this.containerId).select('input[name=end]')[0].value = Number(this.tile.settings.random.end) + 1;
			$(this.containerId).select('input[name=freq]')[0].value = this.tile.settings.random.freq;
			$(this.containerId).select('input[name=interval]')[0].value = this.tile.settings.random.interval;
		}else if(this.tile.settings.type == 2 && this.tile.settings.cyclic){
			$(this.containerId).select('input[id=type2]')[0].checked = "checked";
			$(this.containerId).select('input[name=start2]')[0].value = Number(this.tile.settings.cyclic.start) + 1;
			$(this.containerId).select('input[name=end2]')[0].value = Number(this.tile.settings.cyclic.end) + 1;
			$(this.containerId).select('input[name=freq2]')[0].value = this.tile.settings.cyclic.freq;
			$(this.containerId).select('input[name=interval2]')[0].value = this.tile.settings.cyclic.interval;
		}

    //initialize the include in lanes data
    var lanesContainer = $(this.containerId).select('div[id=inLanes]')[0];
    lanesContainer.update("");
    var lanes = this.levelEditor.grid.lanes.length;
    for(var i=0; i<lanes; i++){
      $(lanesContainer).update($(lanesContainer).innerHTML + '<input type="checkbox" name="inlane" value="'+i+'">Lane' + (Number(i+1)));
    }
    if(!this.tile.settings.inlanes)this.tile.settings.inlanes = [];

		//load inlanes data
    if(this.tile.settings.inlanes){
      this.tile.settings.inlanes.each(function(val){
        $(lanesContainer).children[val].checked = "checked";
      });
    }		
    var self = this;
    
		var items = $(lanesContainer).children; 
    for(var i=0; i<items.length; i++){
      $(items[i]).observe('change', function(event){
        var value = Number(event.target.value);
        if(event.target.checked){
          if(self.tile.settings.inlanes.indexOf(value) < 0)
            self.tile.settings.inlanes.push(value);
        }else{
          if(self.tile.settings.inlanes.indexOf(value) > -1)
            self.tile.settings.inlanes.splice(self.tile.settings.inlanes.indexOf(value), 1);
        }
      });   
    }
	},
	
	close: function(){
		this.tile = null;
		$('loSettingsDialog').style.display = 'none';
	}
	
});
