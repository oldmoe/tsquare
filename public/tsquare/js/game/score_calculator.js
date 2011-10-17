var ScoreCalculator = Class.create({
  
  scene: null,
  
  startTime: null,
  endTime: null,
  levelTime: null,
  
  score: 0,
  
  correctCommandsCount: 0,
  wrongCommandsCount: 0,
  
  correctMovesCount: 0,
  wrongMovesCount: 0,
  
  crowdsCount: 0,
  
  totalObjectives: 1,
  correctObjectiveCount: 0,
  
  gameTime: 0,
  
  initialize: function(scene){
    this.scene = scene;
    this.gameTime = 0;
    
    var self = this;
    this.scene.observe("start", function(){self.start();})
    this.scene.observe("setObjectivesCount", function(objectives){self.totalObjectives = objectives;})
    this.scene.observe('wrongMove',function(){self.wrongMove()})
    this.scene.observe('correctMove',function(){self.correctMove()})
    this.scene.observe('correctObjective',function(){self.correctObjective()})
    this.scene.observe('wrongCommand',function(){self.wrongCommand()})
    this.scene.observe('correctCommand',function(){self.correctCommand()})
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
    this.updateScore(-2);
    this.wrongMovesCount++;
  },

  correctMove: function(){
    this.updateScore(10);
    this.correctMovesCount++;
  },

  correctObjective: function(){
    this.updateScore(20);
    this.correctObjectiveCount++;
  },
  
  wrongCommand: function(){
    this.updateScore(-5);
    this.wrongCommandsCount++;
  },

  correctCommand: function(){
    this.updateScore(20);
    this.correctCommandsCount++;
  },
  
  updateScore: function(score){
    this.score += score
  },
  
  getCombos: function(){
    var t = this.wrongMovesCount+this.correctMovesCount;
    if(t == 0) t = 1;
    return Number(this.correctMovesCount/t).toFixed(2);
  },
  
  getObjectivesRatio: function(){
    return Number(this.correctObjectiveCount/this.totalObjectives).toFixed(2);
  },
  
  updateTime: function(){
    this.gameTime +=1;
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