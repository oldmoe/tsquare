var ScoreCalculator = Class.create({
  
  scene: null,
  
  startTime: null,
  endTime: null,
  levelTime: null,
  
  score: 0,
  
  correctCommandsCount: 0,
  wrongCommandsCount: 0,
  totalCommandsCount: 0,
  
  correctMovesCount: 0,
  wrongMovesCount: 0,
  totalMovesCount: 0,
  
  crowdsCount: 0,
  
  achievedObjectives: 0,
  totalObjectives: 0,
  
  gameTime: 0,
  
  initialize: function(scene){
    this.scene = scene;
    this.gameTime = 0;
  },
  
  start: function(){
    this.startTime = (new Date()).getTime();
  },
  
  end: function(){
    this.endTime = (new Date()).getTime();
    this.levelTime = this.startTime - this.endTime;
    
    this.crowdsCount = this.scene.handlers.crowd.getCrowdsCount();
  },
  
  updateScore: function(score){
    this.score += score
  },
  
  updateTime: function(){
    this.gameTime +=1;
  }
  
})