var ScoreCalculator = Class.create({
  
  scene: null,
  
  startTime: null,
  endTime: null,
  levelTime: null,
  
  score: 0,
  
  correctMovesCount: 0,
  wrongMovesCount: 0,
  
  crowdsCount: 0,
  
  totalObjectives: 1, //This is set for one, because there is a mandatory objective to be alive and not lose the mission
  correctObjectiveCount: 0,
  
  comboLevel: 1,
  comboCount: 0,
  
  gameTime: 0,
  remainingTime: 0,
  superTime: 0,
  missionTime: 0,
  
  initialize: function(scene){
    this.scene = scene;
    this.missionTime = missionData.missionTime || 120;
    this.superTime = missionData.superTime || this.missionTime;
    this.gameTime = this.missionTime;
    this.remainingTime = this.missionTime-this.superTime;
    
    var self = this;
    this.scene.observe("start", function(){self.start();})
    this.scene.observe("incrementObjectivesCount", function(){self.totalObjectives += 1;})
    this.scene.observe('wrongMove',function(){self.wrongMove()})
    this.scene.observe('correctMove',function(){self.correctMove()})
    this.scene.observe('correctObjective',function(){self.correctObjective()})
    this.scene.observe("updateScore", function(score){self.updateScore(score)});
  },
  
  start: function(){
    this.startTime = (new Date()).getTime();
  },
  
  end: function(){
    this.endTime = (new Date()).getTime();
    this.levelTime = this.startTime - this.endTime;
    
    this.crowdsCount = this.scene.handlers.crowd.getCrowdsCount();
  },

  wrongMove: function(){
    this.wrongMovesCount++;
    this.comboCount = 0;
  },

  correctMove: function(){
    this.updateScore(25 * this.comboLevel);
    this.correctMovesCount++;
    
    this.comboCount++;
    
    if(this.comboCount > 5)
      this.comboLevel = 1;
    else if(this.comboCount > 10)
      this.comboLevel = 2;
    else if(this.comboCount > 20)
      this.comboLevel = 3;
  },

  correctObjective: function(){
    this.updateScore(50);
    this.correctObjectiveCount++;
  },
  
  wrongCommand: function(){
    this.updateScore(-25);
    this.wrongCommandsCount++;
  },

  correctCommand: function(){
    this.updateScore(30);
    this.correctCommandsCount++;
  },
  
  updateScore: function(score){
    if(score < 0 && this.score == 0) return;
    this.score += score
  },
  
  getCombos: function(){
    var t = this.wrongMovesCount+this.correctMovesCount;
    if(t == 0) t = 1;
    return Number(this.correctMovesCount/t).toFixed(2);
  },
  
  getObjectivesRatio: function(){
    return Number(this.correctObjectiveCount/this.totalObjectives);
  },
  
  updateTime: function(){
    if(this.gameTime > 0)
      this.gameTime -=1;
  },
  
  getTimeDetails: function(){
    var r = [0, 0, 0];
    var time = this.gameTime;
    r[0] = parseInt(time/(60*60));//hours
    time -= r[0] * 60 * 60;
    r[1] = parseInt(time / 60);//minutes
    time -= r[1] * 60;
    r[2] = time;//seconds
    return r;
  }
  
})