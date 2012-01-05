var Mission = {

  adminUrl : 'nezal-admin',

  currMission : {},
  
  id : null,

  initialize : function(){
    
/*
    var gameData = {"data":[[],[{"name":"twitter_guy","category":"protection","index":0,"lane":1,"x":4,"order":0},{"name":"wood_stick_cs","category":"enemy","type":"1_1","index":0,"lane":1,"x":9,"order":1}],[]],"backgrounds":{"layer1":[{"name":"main_skyline.png"}],"layer2":[{"name":"secondary_skyline.png"}],"landmarks":[{"name":"landmark_2.png"}],"fence":[{"name":"fence.png"}],"lamp":[{"name":"3amod2.png"}],"land":[{"name":"land.png"}]}}
    Mission.currMission = gameData;
    // $('missionName').value = Mission.currMission.name;
    var levelLoader = new LevelLoader();
    return;
*/        
    this.id = parseInt(window.location.toString().split('?')[1].split('&')[0].split('=')[1]);
    this.game = window.location.toString().split('?')[1].split('&')[1].split('=')[1];
    $$('#controls .saveButton')[0].stopObserving('click');
		$$('#controls .saveButton')[0].observe('click', function(){ Mission.saveToServer(); });
    new Ajax.Request( '/' + this.adminUrl + "/" + this.game + '/missions/' + this.id + '.json' , {
       method : 'get',
       onSuccess : function(response){
          Mission.currMission = JSON.parse(response.responseText);
          $('missionName').value = Mission.currMission.name;
          var levelLoader = new LevelLoader();
       }
    });
  },

  editMissionName : function(){
    Mission.currMission.name = $('missionName').value;
    Mission.saveToServer();
  },

  saveToServer : function(){
    var data = levelEditor.dataExporter.exportData();
    if(Mission.currMission == null)
      Mission.currMission = {};
      
    Mission.currMission.data = data;
    new Ajax.Request( '/' + this.adminUrl + "/" + this.game + '/missions/' + this.id + '.json' , {
                      method : 'put',
                      parameters : { "data" : JSON.stringify(Mission.currMission) },
                      onSuccess : function(response){
                        Mission.showSuccessMsg();
                        // Mission.initialize();
                      },
                      onFailure : function(response){
                        Mission.showErrorMsg();
                      }
                     
                 });    
  },

  showSuccessMsg : function(){
    $('saveReqStatus').innerHTML = "Saved successfully"
    $('saveReqStatus').className = "success"
    $('saveReqStatus').show();
    window.setTimeout( function(){$('saveReqStatus').hide()}, 5000 )
  },

  showErrorMsg : function(){
    $('saveReqStatus').innerHTML = "Error, your changes are not saved!"
    $('saveReqStatus').className = "error"
    $('saveReqStatus').show();
    window.setTimeout( function(){$('saveReqStatus').hide()}, 10000 )
  }


}
