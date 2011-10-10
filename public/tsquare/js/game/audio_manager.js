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
			130 : 1850,
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
			130 : [0, 1, 2, 3, 4, 5], 
			140 : [0, 1, 2, 3, 4], 
			150 : [0, 1, 2, 3, 4], 
			160 : [0, 1, 2, 3, 4]
		} 
	
		this.levels = [
			{tempo: 130, beats : [{beat : 0, volume : 12}]},
			{tempo: 130, beats : [{beat : 0, volume : 18}]},
			{tempo: 130, beats : [{beat : 0, volume : 24}]},
			{tempo: 130, beats : [{beat : 0, volume : 24}, {beat : 2, volume : 48}]},
			{tempo: 130, beats : [{beat : 0, volume : 24}, {beat : 5, volume : 48}]},
			{tempo: 130, beats : [{beat : 0, volume : 24}, {beat : 1, volume : 48}]},
			{tempo: 130, beats : [{beat : 0, volume : 24}, {beat : 3, volume : 48}]},
			{tempo: 140, beats : [{beat : 0, volume : 24}, {beat : 3, volume : 96}]},
			{tempo: 150, beats : [{beat : 0, volume : 24}, {beat : 3, volume : 80}]},
			{tempo: 160, beats : [{beat : 0, volume : 24}, {beat : 3, volume : 80}]}
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
	},

	run : function(){
		this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
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
	},
	tick : function(){
		//console.log('tempo changed ', this.tempoChanged, 'level changed', this.levelChanged)
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
				Audio.Fade(this.nowPlaying[i], 0, this.durations[this.level.tempo]/8, this.reactor, function(s){s.stop()})
			}
			this.nowPlaying = []			
			for(var i=0; i< this.levelBeats[this.level.tempo].length; i++){
				var sound = this.levelBeats[this.level.tempo][i]
				sound.mute()
				sound.loop = true
				sound.play({ loops : 100000, onfinish : function(){console.log('finished')}})
				this.nowPlaying.push(sound)
			}
			for(var i=0; i < this.level.beats.length;i++){
				var sound = this.level.beats[i].beat
				//sound.setVolume(0)
				sound.unmute()
				sound.setVolume(this.level.beats[i].volume)
				//Audio.Fade(sound, this.level.beats[i].volume, this.durations[this.level.tempo], this.reactor)
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
	}	
})