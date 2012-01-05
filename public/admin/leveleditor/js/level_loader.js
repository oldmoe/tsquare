var LevelLoader = Class.create({
  
  missionData: null,
  mission: null,
  
  initialize: function(){
    this.mission = Mission.currMission;
    // this.missionData = this.mission.data;
    this.missionData = this.mission;
    this.load();
  },
  
  load: function(){
//    if(this.mission && this.mission.name)$("missionName").update(this.mission.name);
    if(this.missionData){
      if(this.missionData.data)this.loadObjects(this.missionData.data);
      if(this.missionData.backgrounds)this.loadBackgrounds(this.missionData.backgrounds);
      if(this.missionData)this.loadSettings(this.missionData);
      alert("Data loaded successfully.");
    }else{
      alert("No data to load.");
    }
  },
  
  loadSettings: function(missionData){
    var settings = {};
    settings.gameModes = missionData.gameModes;
    settings.environment = missionData.environment;
    settings.missionDetails = missionData.missionDetails;
    levelEditor.settingsHandler.loadData(settings);
  },
  
  loadBackgrounds: function(backgrounds){
    this.loadBackgroundContainer(backgrounds.layer1, "bgLayer1");
    this.loadBackgroundContainer(backgrounds.layer2, "bgLayer2");
    this.loadBackgroundContainer(backgrounds.landmarks, "bgLandmarks");
    this.loadBackgroundContainer(backgrounds.land, "bgLand");
    this.loadBackgroundContainer(backgrounds.fence, "bgFence");
    this.loadBackgroundContainer(backgrounds.lamp, "bgLamp");
  },
  
  loadBackgroundContainer: function(objects, container){
    for (var i=0; objects && i < objects.length; i++) {
      objects[i].category = "background";
      levelEditor.backgroundHandler.loadObject(this.loadImagePath(objects[i]), container);
    };
  },
  
  loadObjects: function(objects){
    var laneLength = 0;
    for (var i=0; objects && i < objects.length; i++) {
      for (var j=0; j < objects[i].length; j++) {
        if(laneLength < objects[i][j].x)
          laneLength = objects[i][j].x;
      };
    };
    
    //adjusting the size of lanes to fit the new data
    levelEditor.grid.adjustLength(laneLength+1);
    
    for (var i=0; objects && i < objects.length; i++) {
      for (var j=0; j < objects[i].length; j++) {
        levelEditor.grid.lanes[i].tiles[objects[i][j].x].loadObject(this.loadImagePath(objects[i][j]));
      };
    };
  },
  
  loadImagePath: function(obj){
    for (var i=0; i < EditorData.length; i++) {
      if( obj.category == "objectives" ){
        obj.name = obj.name.split("_")[0];
      }
      if(obj.name == EditorData[i].name && obj.category == EditorData[i].category){
        if(obj.type){
          if(obj.type == EditorData[i].type){
            obj.image = EditorData[i].src;
            break;
          }
        }else{
          obj.image = EditorData[i].src;
          break;
        }
      }
    };
    return obj;
  }
  
  
});
