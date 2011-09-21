Audio.prototype.stop = function(){
	this.pause()
	this.currentTime = 0
}

var AudioManager = Class.create({

	durations : {
			130 : 1900,
			140 : 1600,
			150 : 1400,
			160 : 1250
	},
	
	initialize : function(reactor){
		this.reactor = reactor
		this.index = 0		
    this.format = "mp3"
    this.levelChanged = true
		this.levels = [
			{tempo: 130, beats : [0]},
      {tempo: 130, beats : [0, 1]},
			{tempo: 130, beats : [0, 2]},
			{tempo: 130, beats : [0, 2]},
			{tempo: 130, beats : [0, 4]},
			{tempo: 140, beats : [0, 1]},
			{tempo: 140, beats : [0, 2]},
			{tempo: 140, beats : [0, 3]},
			{tempo: 140, beats : [0, 4]},
			{tempo: 150, beats : [0, 1]},
			{tempo: 150, beats : [0, 2]},
			{tempo: 150, beats : [0, 3]},
			{tempo: 150, beats : [0, 4]},
			{tempo: 160, beats : [0, 1]},
			{tempo: 160, beats : [0, 2]},
			{tempo: 160, beats : [0, 3]},
			{tempo: 160, beats : [0, 4]}
		]
    var self = this
		this.levels.each(function(level){
			level.beats = level.beats.collect(function(beat){
        console.log(Loader.sounds['beats.'+level.tempo],beat+'.'+self.format)
				return Loader.sounds['beats.'+level.tempo][beat+'.'+self.format]
			})
		})
		this.level = this.levels[0]
		this.levelIndex = 0
		
		this.nowPlaying = []
	},

	run : function(){
		this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
	},
	
	tick : function(){
		if(this.index % 2 == 1){
			// we should play the hetaf here, nothing will change with the beats though
      this.index++
			return true 
		}
    if(!this.levelChanged){
      this.index++
      return true
    } 
		var tempo = this.level.tempo
		var toPlay = []
		var result = true
		if(this.tempoChange){
			for(var i=0; i < this.nowPlaying.length; i++){
				this.nowPlaying[i].stop()
			}
			this.tempoChange = false
			this.nowPlaying = []
			for(var i=0; i < this.level.beats.length;i++){
				var sound = this.level.beats[i]
				sound.loop = true
				sound.play({ loops : 100000 })
				this.nowPlaying.push(sound)
			}
			this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
			result = false
		}else{
			// stop sounds in nowPlaying (except if they belong to current list)
			for(var i =0; i < this.level.beats.length; i++){
				toPlay.push(this.level.beats[i])
			}
			for(var i=0; i < this.nowPlaying.length; i++){
				var sound = this.nowPlaying[i]
				if(this.level.beats.indexOf(sound) == -1){
						sound.stop()
				}
			}
			this.nowPlaying = toPlay
			for(var i=0; i < this.nowPlaying.length; i++){
				var sound = this.nowPlaying[i]
				if(!(sound.playState == 1 || sound.ended == true)){ //handle both sound manager and straight html5 audio 
          sound.loop = true
					sound.play({ loops : 100000 })
				}
			}
		}
		this.index += 1
    this.levelChaned = false
		return result
	},
	
	levelUp : function(){
		this.levelIndex+=1
    this.levelChanged = true
		if(this.levelIndex > (this.levels.length - 1)) this.levelIndex = this.levels.length - 1
		if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex-1].tempo) this.tempoChange == true
		this.level = this.levels[this.levelIndex]
	},
	
	levelDown : function(){
		this.levelIndex-=1
    this.levelChanged = true
		if(this.levelIndex < 0) this.levelIndex = 0
		if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex+1].tempo) this.tempoChange == true
		this.level = this.levels[this.levelIndex]
	}	
})