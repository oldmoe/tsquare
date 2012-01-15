var SettingsHandler = new Class.create({
	
	levelEditor: null,
	settings: {},
	containerId: 'settingsDialog',
	energyContainerId: 'energySettingsContainer',
	missionContainerId: 'missionImageSettingsContainer',
		
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		this.settings.introMsg = "";
		this.settings.environment = "day";
		this.settings.gameModes = ['normal'];
		this.settings.missionImages = {};
		
		this.init();
		
		var self  = this;
		$('controls').select('[class=settingsButton]')[0].observe('click', function(){
			self.open();
		});
		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

		$(this.energyContainerId).select('input[class=add]')[0].observe('click', function(){
			self.addEnergyMessage();
		});

		$(this.energyContainerId).select('input[class=delete]')[0].observe('click', function(){
			self.deleteEnergyMessage();
		});
		
		$(this.containerId).select('input[name=environment]').each(function(elem){
			elem.observe('click', function(event){
				self.settings.environment = event.target.value;
			});		
		});

		$(this.containerId).select('input[name=gameModes]').each(function(elem){
			elem.observe('change', function(event){
				if(event.target.checked){
					if(self.settings.gameModes.indexOf(event.target.value) < 0)
						self.settings.gameModes.push(event.target.value);
				}else{
					if(self.settings.gameModes.indexOf(event.target.value) > -1)
						self.settings.gameModes.splice(self.settings.gameModes.indexOf(event.target.value), 1);
				}
			});		
		});
		
		$("missionDetails").observe("keyup", function(event){
		  self.settings.missionDetails = event.target.value;
		})

    $("missionTime").observe("keyup", function(event){
      self.settings.missionTime = event.target.value;
    })

    $("superTime").observe("keyup", function(event){
      self.settings.superTime = event.target.value;
    })
		
		$("missionDetails_ar").observe("keyup", function(event){
		  self.settings.missionDetails_ar = event.target.value;
		})
		
	},
	
	init: function(){
	  $("missionDetails").setValue("");
	  $("missionDetails_ar").setValue("");
	},
	
	loadData: function(settings){
	  if(settings.missionDetails){
	    this.settings.missionDetails = settings.missionDetails;
	    $("missionDetails").setValue(settings.missionDetails);
	  }
	  
	  if(settings.missionTime){
	    this.settings.missionTime = settings.missionTime;
	    $("missionTime").setValue(settings.missionTime);
	  }
	    
	  if(settings.superTime){
	    this.settings.superTime = settings.superTime;
	    $("superTime").setValue(settings.superTime);
	  }  
	  
	  if(settings.missionDetails)$("missionDetails").setValue(settings.missionDetails);
	  if(settings.missionDetails_ar)$("missionDetails_ar").setValue(settings.missionDetails_ar);

	  if(settings.gameModes){
	    this.settings.gameModes = settings.gameModes;
	    if(settings.gameModes.indexOf("normal") > -1)$(this.containerId).select('input[name=gameModes]')[0].checked = "checked";
	    if(settings.gameModes.indexOf("sneak") > -1)$(this.containerId).select('input[name=gameModes]')[1].checked = "checked";
	    if(settings.gameModes.indexOf("charging") > -1)$(this.containerId).select('input[name=gameModes]')[2].checked = "checked";
	  }
	  if(settings.environment == "day")$(this.containerId).select('input[name=environment]')[0].checked = "checked";
	  else if(settings.environment == "night")$(this.containerId).select('input[name=environment]')[1].checked = "checked";
	  else if(settings.environment == "day_night")$(this.containerId).select('input[name=environment]')[2].checked = "checked";
	  
	  if(settings.environment)this.settings.environment=settings.environment;
	  
	},
	
	addEnergyMessage: function(){
	  	var obj = {};
	  	obj.energy = $('energyValue').value;
	  	obj.message = $('energyMessage').value;
	  	
		if(!this.settings.energy)this.settings.energy = [];
		
		this.settings.energy.push(obj); 
		
		$('energyValue').value = '';
		$('energyMessage').value = '';
		
		this.updateEnergyMessagesList();
	},

	deleteEnergyMessage: function(){
		this.settings.energy.splice($('energyMessages').selectedIndex, 1);
		this.updateEnergyMessagesList();
	},
	
	updateEnergyMessagesList: function(){
		if($("energyMessages"))$("energyMessages").replace("");
  		var select  = Element('select', {id:'energyMessages'})
  		$('energyMessagesList').insert({'before':select});
	  	
	  	$('energyMessagesList').update("");
		this.settings.energy.each(function(elem, index){
			var a = new Element('li');
			$('energyMessagesList').appendChild(a);
			a.update(elem.energy + ": " + elem.message);
			
	  		var a = new Element('option', {value:index});
	  		a.update(elem.energy + ":" + elem.message);
	  		select.appendChild(a);
		});
	},
	
	getData: function(){
		return this.settings;
	},
	
	open: function(){
		$('settingsDialog').style.display = 'block';
	},
	
	close: function(){
		$('settingsDialog').style.display = 'none';
	}
	
	
	
});
