if (window.Audio) {
  Audio.prototype.stop = function(){
    this.pause()
    this.currentTime = 0
  }
  
  Audio.prototype.setVolume = function(volume){
    this.volume = volume / 100
  }
  
  
  Audio.Fade = function(sound, to, duration, reactor, callback){
    var from = sound.volume
    var step = (to - from) / (duration / reactor.delay)
    var tick = function(){
      sound.setVolume(sound.volume + step)
      if ((step > 0 && sound.volume >= to) || (step < 0 && sound.volume <= to)) {
        sound.setVolume(to)
        if (callback) 
          callback(sound)
        return false
      }
    }
    reactor.pushEvery(0, 1, tick)
  }
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
		// this.rewardIndex = 0		
		this.format = "mp3"
		this.levelChanged = true

		this.levelBeats = {
			130 : [0, 1, 2, 3, 4] 
		} 
		
    this.rewardSounds = {
      130: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
    };
    
    this.rewardLevels = [
      {tempo: 130, rewards : [{sound : 2, volume : 30}, {sound : 3, volume : 30}]}
      // {tempo: 130, rewards : [{sound : 4, volume : 30}, {sound : 5, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 6, volume : 30}, {sound : 7, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 17, volume : 30}, {sound : 18, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 8, volume : 30}, {sound : 9, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 10, volume : 30}, {sound : 11, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 13, volume : 30}, {sound : 14, volume : 30}]},
      // {tempo: 130, rewards : [{sound : 15, volume : 30}, {sound : 16, volume : 30}]}
      
    ];
/*
    this.rewardLevels = [
      {tempo: 130, rewards : [{sound : 2, volume : 30}]},
      {tempo: 130, rewards : [{sound : 4, volume : 30}]},
      {tempo: 130, rewards : [{sound : 6, volume : 30}]},
      {tempo: 130, rewards : [{sound : 17, volume : 30}]},
      {tempo: 130, rewards : [{sound : 8, volume : 30}]},
      {tempo: 130, rewards : [{sound : 10, volume : 30}]},
      {tempo: 130, rewards : [{sound : 13, volume : 30}]},
      {tempo: 130, rewards : [{sound : 15, volume : 30}]}
      
    ];
*/    
    this.levels = [
      {tempo: 130, beats : [{beat : 0, volume : 20}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 1, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 1, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 50}]}      
    ]
		
		var self = this
		
		//replacing beat index with its sound
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

    this.rewardLevels.each(function(level){
      level.rewards = level.rewards.collect(function(reward){
        return {sound: Loader.sounds['reward.'+level.tempo][reward.sound+'.'+self.format], volume: reward.volume}
      })
    })

    for(var tempo in this.rewardSounds){
      this.rewardSounds[tempo] = this.rewardSounds[tempo].collect(function(sound){
        return Loader.sounds['reward.'+tempo][sound+'.'+self.format]
      });
    }
		
		this.level = this.levels[0]
		this.currentReward = this.rewardLevels[0]
		this.levelIndex = 0
		this.rewardIndex = 0
		this.currentRewardIndex = 0
		
		this.nowPlaying = []
		this.playingRewards = []
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
	  this.changeTempo();
	  this.switchBeatsChannels();
		// this.reactor.pushEvery(0, this.reactor.timeToTicks(this.durations[this.level.tempo]), this.tick, this)
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

  changeTempo : function(){
    var tempo = this.level.tempo
    //stope the current playing sound
    for(var i=0; i < this.nowPlaying.length; i++){
      this.nowPlaying[i].stop()
      //Audio.Fade(this.nowPlaying[i], 0, this.durations[this.level.tempo]/8, this.reactor, function(s){s.stop()})
    }

    // for(var i=0; i < this.playingRewards.length; i++){
      // this.playingRewards[i].stop()
    // }
    
    this.nowPlaying = []      
    for(var i=0; i< this.levelBeats[this.level.tempo].length; i++){
      var sound = this.levelBeats[this.level.tempo][i]
      sound.mute()
      sound.loop = true
      sound.play({ loops : 100000})
      this.nowPlaying.push(sound)
    }
    
    // this.playingRewards = [];
    // for(var i=0; i< this.rewardSounds[this.currentReward.tempo].length; i++){
      // var sound = this.rewardSounds[this.currentReward.tempo][i]
      // sound.mute()
      // sound.loop = true
      // sound.play({ loops : 100000})
      // this.playingRewards.push(sound)
    // }
    
    for(var i=0; i < this.level.beats.length;i++){
      var sound = this.level.beats[i].beat
      sound.setVolume(this.level.beats[i].volume)
      sound.unmute()
    }
  },
  
  switchBeatsChannels: function(){
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
  },
  
  playHetaf: function(position){
    // console.log(this.nowPlaying[0].position, position, this.currentRewardIndex, this.levelIndex)
    var delay = position;
    if(delay == 0)delay = this.nowPlaying[0].position - (this.nowPlaying[0].duration-72)/2;
    console.log(delay)
      this.currentReward.rewards[this.currentRewardIndex].sound.play({volume:this.currentReward.rewards[this.currentRewardIndex].volume, position:delay});
      if(this.currentRewardIndex)
        this.currentRewardIndex = 0;
      else
        this.currentRewardIndex = 1;    
  },
  
  switchHetafChannels: function(){
    for(var i=0; i < this.playingRewards.length; i++){
      var sound = this.playingRewards[i]
      var found = this.currentReward.rewards.find(function(reward){return reward.sound == sound})
      if(found){
        sound.setVolume(found.volume)
        if(sound.muted)sound.unmute()
      }else{
        sound.mute()
      }
    }
  },

	levelUp : function(){
	  this.rewardUp();
		if(this.levelIndex == (this.levels.length - 1)) return
		this.levelIndex+=1
		this.levelChanged = true
    if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex-1].tempo) this.changeTempo();
		this.level = this.levels[this.levelIndex]
		this.switchBeatsChannels();
	},
	
	levelDown : function(){
		if(this.levelIndex == 0) return
		this.levelIndex-=1
		this.levelChanged = true
		if(this.levels[this.levelIndex].tempo != this.levels[this.levelIndex+1].tempo) this.changeTempo();
		this.level = this.levels[this.levelIndex]
		this.switchBeatsChannels();
		this.rewardDown();
	},

  rewardUp : function(){
    var mid = (this.nowPlaying[0].duration-72)/2;
    var pos = this.nowPlaying[0].position; 
    if(pos < mid){
      var self = this;
      var pre = this.nowPlaying[0].position;
      setTimeout(function(){self.playHetaf(0)}, (mid-pos));
    }else{
      this.playHetaf(pos-mid);
    }

    if(this.rewardIndex == (this.rewardLevels.length - 1)) return
    this.rewardIndex+=1
    this.currentReward = this.rewardLevels[this.rewardIndex]
  },

  rewardDown : function(){
    if(this.rewardIndex == 0) return
    this.rewardIndex-=1
    this.currentReward = this.rewardLevels[this.rewardIndex]
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