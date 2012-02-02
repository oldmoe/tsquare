var DataExporter = Class.create({
	
	levelEditor: null,
	containerId: 'exportDialog',
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		
		var self = this;

		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			$(self.containerId).style.display = 'none';
		});

		$('controls').select('[class=exportButton]')[0].observe('click', function(){
			self.displayData();
		});
	},

	
	exportData: function (){
		var data = [];
		var x = 0;
		var l = 0;
		var elementIndex = 0;
		
		var lanesData = this.levelEditor.grid.lanes;
		
		//adjusting objects positions and ordering
		for(var i=0; i<lanesData.length; i++){
			for(var j=0; j<lanesData[i].tiles.length; j++){
				for (var k=0; k < lanesData[i].tiles[j].objects.length; k++) {
					var obj = lanesData[i].tiles[j].objects[k];
					obj.lane = i;
					obj.x = j;
					obj.order = elementIndex++;
				}
			}
			elementIndex = 0;
		}

		for(var i=0; i<lanesData.length; i++){
			if(data[l] == null) data[l] = [];
			for(var j=0; j<lanesData[i].tiles.length; j++){
			  var advisor = null;
				for (var k=0; k < lanesData[i].tiles[j].objects.length; k++) {
				  var obj = Object.clone(lanesData[i].tiles[j].objects[k]);
				  
				  if(obj.category == "objectives"){
				    obj.name = obj.name + "_rescue";
				    obj.helpMessage = lanesData[i].tiles[j].domObject.select('#helpMessage')[0].value
				    obj.companyMessage = lanesData[i].tiles[j].domObject.select('#companyMessage')[0].value
				    obj.leaveMessage = lanesData[i].tiles[j].domObject.select('#leaveMessage')[0].value
				    obj.targetTile = Number( lanesData[i].tiles[j].domObject.select('input')[0].value );
				    if( obj.targetTile > obj.x ){
				      obj.mission = "escort";
				    } else {
				      obj.mission = "retrieve";
				    }
				  }
				  
				  if(obj.category == "enemy")
				    obj.type = obj.type.cols + "_" + obj.type.rows;
				  if(obj.category == "advisor")
				    advisor = obj;  
				  delete obj.image;
					data[l][x++] = obj
				}
				
				if(advisor){
				  advisor.messages = lanesData[i].tiles[j].messages.messages;
				}
			}
			x=0;
			l++;
		}

		var gameData = {};
		gameData.data = data;
		var settings = this.levelEditor.settingsHandler.getData();
		
		for (var key in settings)
			gameData[key] = settings[key];

		delete gameData.backgrounds;
		
		gameData.backgrounds = {
		  layer1:this.levelEditor.backgroundHandler.getLayer1Data(), 
		  layer2: this.levelEditor.backgroundHandler.getLayer2Data(), 
      sky: this.levelEditor.backgroundHandler.getSkyData(),
		  landmarks: this.levelEditor.backgroundHandler.getLandMarksData(),
		  fence: this.levelEditor.backgroundHandler.getFenceData(),
		  lamp: this.levelEditor.backgroundHandler.getLampData(),
		  land: this.levelEditor.backgroundHandler.getLandData()
	  };
		  
		var settings = this.levelEditor.settingsHandler.getData();
		gameData.energy = settings.energy;
		gameData.environment = settings.environment;
		gameData.gameModes = settings.gameModes;
		gameData.missionDetails = settings.missionDetails;
    gameData.commands = settings.commands;
    gameData.followers = settings.followers;
    gameData.missionHappeningTime = settings.missionHappeningTime;
    gameData.newItem = settings.newItem;
		gameData.missionTime = settings.missionTime;
		gameData.superTime = settings.superTime;
		gameData.locked = settings.locked;
		
		gameData.winPowerups = this.levelEditor.powerupsHandler.getWinPowerupsData();
		
		return gameData;
	},

  displayData : function(){
    var gameData = this.exportData();
		$(this.containerId).select('[id=dataMessage]')[0].value = Object.toJSON(gameData);
		$(this.containerId).style.display = 'block';
  }
	
});
