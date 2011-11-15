Audio.prototype.stop = function(){
	this.pause()
	this.currentTime = 0
}

Audio.prototype.setVolume = function(volume){
	this.volume = volume/100
}


Audio.Fade = function(sound, to, duration, reactor, callback){
	var from = sound.volume
	var step = (to - from) / (duration/reactor.delay)
	var tick = function(){
		sound.setVolume(sound.volume + step)
		if((step > 0 && sound.volume >= to) || (step < 0 && sound.volume <= to)){
			sound.setVolume(to)
			if(callback) callback(sound)
			return false
		}
	}
	reactor.pushEvery(0, 1, tick)
}

var AudioManager = Class.create({

	durations : {
			130 : 1800,
			140 : 1750,
			150 : 1600,
			160 : 1500
	},
	
	initialize : function(reactor){
		this.reactor = reactor
		this.index = 0		
		this.format = "mp3"
		this.levelChanged = true

		this.levelBeats = {
			130 : [0, 1, 2, 3, 4], 
		} 
/*	
		this.levels = [
			{tempo: 130, beats : [{beat : 0, volume : 1}]},
			{tempo: 130, beats : [{beat : 0, volume : 1}]},
			{tempo: 130, beats : [{beat : 0, volume : 1}, {beat : 2, volume : 1}]},
			{tempo: 130, beats : [{beat : 0, volume : 1}, {beat : 2, volume : 1}]},
      {tempo: 130, beats : [{beat : 0, volume : 1}, {beat : 3, volume : 1}]},
      {tempo: 130, beats : [{beat : 0, volume : 1}, {beat : 3, volume : 1}]}      
		]
*/
    this.levels = [
      {tempo: 130, beats : [{beat : 0, volume : 30}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 1, volume : 40}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 1, volume : 40}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 40}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 40}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 40}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 40}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 40}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 40}]}      
    ]
		
		var self = this
		
		this.levels.each(function(level){
			level.beats = level.beats.collect(function(beat){
				return {beat: Loader.sounds['beats.'+level.tempo][beat.beat+'.'+self.format], volume: beat.volume}
			})
		})
		
		for(var tempo in this.levelBeats){
			this.levelBeats[tempo] = this.levelBeats[tempo].collect(function(beat){
				return Loader.sounds['beats.'+tempo][beat+'.'+self.format]				
			})
		}
		
		this.level = this.levels[0]
		this.levelIndex = 0
		
		this.nowPlaying = []
		this.tempoChanged = true;
		
		// this.playAmbient();
	},

  playAmbient : function(){
    var self = this;
    Loader.sounds['sfx']['ambient.mp3'].play({volume : 30, onfinish: function(){
      self.playAmbient();
    }})
  },
	
	run : function(){
		this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
    this.background_audio = Loader.sounds['beats.'+130][3+'.'+this.format] 
    this.background_audio.loop = true
    // this.background_audio.play({volume : 100, loop:true,loops:10000})
	},
	
  nextBeatTime: function(){
    return this.durations[this.level.tempo]/4
  },
	nextBeatTicks : function(){
		return this.reactor.timeToTicks(this.durations[this.level.tempo]/4)
	},
	nextLoopTicks : function(){
    return this.reactor.timeToTicks(this.durations[this.level.tempo])
  },
	stop : function(){
		for(var i=0; i < this.nowPlaying.length; i++){
			this.nowPlaying[i].stop()
		 }
     this.background_audio.stop()
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
		if(this.tempoChanged){
			this.tempoChanged = false
			for(var i=0; i < this.nowPlaying.length; i++){
				this.nowPlaying[i].stop()
        //Audio.Fade(this.nowPlaying[i], 0, this.durations[this.level.tempo]/8, this.reactor, function(s){s.stop()})
			}
			this.nowPlaying = []			
			for(var i=0; i< this.levelBeats[this.level.tempo].length; i++){
				var sound = this.levelBeats[this.level.tempo][i]
				sound.mute()
				sound.loop = true
				sound.play({ loops : 100000})
				this.nowPlaying.push(sound)
			}
			for(var i=0; i < this.level.beats.length;i++){
				var sound = this.level.beats[i].beat
        sound.setVolume(this.level.beats[i].volume)
				sound.unmute()
			}
			this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
			return false // return false so we stop the current periodical reactor
		}else{
			for(var i=0; i < this.nowPlaying.length; i++){
				var sound = this.nowPlaying[i]
				var found = this.level.beats.find(function(beat){return beat.beat == sound})
				if(found){
					sound.setVolume(found.volume)
					if(sound.muted)sound.unmute()
				}else{
					sound.mute()
				}
			}
		}
		this.index += 1
		this.levelChanged = false
		return true
	},
	
	levelUp : function(){
		if(this.levelIndex == (this.levels.length - 1)) return
		this.levelIndex+=1
		this.levelChanged = true
    if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex-1].tempo) this.tempoChanged = true
		this.level = this.levels[this.levelIndex]
	},
	
	levelDown : function(){
		if(this.levelIndex == 0) return
		this.levelIndex-=1
		this.levelChanged = true
		if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex+1].tempo) this.tempoChanged = true
		this.level = this.levels[this.levelIndex]
	},
	
	play: function(sound, options, repeat){
		if(repeat){
		  sound.play(options);
		  return;
		}
		if(sound.playersCount){
			sound.playersCount += 1;
		}else{
      sound.playersCount = 1;
      sound.play(options);
		}
	},
	
	mute: function(sound){
	  if(sound.playersCount == null){
	    sound.stop();
	  }else if(sound.playersCount > 1){
	    sound.playersCount -= 1;
    }else{
      sound.playersCount = 0;
      sound.stop();
    }
	}
	
		
})