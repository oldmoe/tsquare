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
	reactor: null,
	
	initialize : function(scene){
		this.reactor = scene.reactor
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
      {tempo: 130, rewards : [{sound : 1, volume : 60}, {sound : 2, volume : 60}]},
      {tempo: 130, rewards : [{sound : 1, volume : 60}, {sound : 2, volume : 60}]},
      
      {tempo: 130, rewards : [{sound : 3, volume : 60}, {sound : 4, volume : 60}]},
      {tempo: 130, rewards : [{sound : 3, volume : 60}, {sound : 4, volume : 60}]},
      
      {tempo: 130, rewards : [{sound : 5, volume : 60}, {sound : 6, volume : 60}]},
      {tempo: 130, rewards : [{sound : 5, volume : 60}, {sound : 6, volume : 60}]},
      
      {tempo: 130, rewards : [{sound : 7, volume : 60}, {sound : 8, volume : 60}]},
      {tempo: 130, rewards : [{sound : 7, volume : 60}, {sound : 8, volume : 60}]},
      
      {tempo: 130, rewards : [{sound : 9, volume : 60}, {sound : 9, volume : 60}]}
      /*,
      {tempo: 130, rewards : [{sound : 4, volume : 80}, {sound : 5, volume : 80}]},
      {tempo: 130, rewards : [{sound : 6, volume : 80}, {sound : 7, volume : 80}]},
      {tempo: 130, rewards : [{sound : 17, volume : 80}, {sound : 18, volume : 80}]},
      {tempo: 130, rewards : [{sound : 8, volume : 80}, {sound : 9, volume : 80}]},
      {tempo: 130, rewards : [{sound : 10, volume : 80}, {sound : 11, volume : 80}]},
      {tempo: 130, rewards : [{sound : 13, volume : 80}, {sound : 14, volume : 80}]},
      {tempo: 130, rewards : [{sound : 15, volume : 80}, {sound : 16, volume : 80}]}
      */
    ];

    this.levels = [
      {tempo: 130, beats : [{beat : 0, volume : 60}]},//50

      {tempo: 130, beats : [{beat : 0, volume : 90}, {beat : 1, volume : 20}]},
      {tempo: 130, beats : [{beat : 0, volume : 90}, {beat : 1, volume : 20}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 90}, {beat : 1, volume : 30}, {beat : 2, volume : 10}]},
      {tempo: 130, beats : [{beat : 0, volume : 90}, {beat : 1, volume : 30}, {beat : 2, volume : 10}]}
/*      
      {tempo: 130, beats : [{beat : 0, volume : 30}, {beat : 1, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 30}, {beat : 1, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 2, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 3, volume : 50}]},
      
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 50}]},
      {tempo: 130, beats : [{beat : 0, volume : 40}, {beat : 4, volume : 50}]}*/      
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
/*
    for(var tempo in this.rewardSounds){
      this.rewardSounds[tempo] = this.rewardSounds[tempo].collect(function(sound){
        return Loader.sounds['reward.'+tempo][sound+'.'+self.format]
      });
    }
*/		
		this.level = this.levels[0]
		this.currentReward = this.rewardLevels[0]
		this.levelIndex = 0
		this.rewardIndex = 0
		this.currentRewardIndex = 0
		
		this.nowPlaying = []
		this.playingRewards = []
		this.tempoChanged = true;
		
		scene.observe('keySound',function(keyIndex){self.playKeySound(keyIndex)});
		
		this.cc = false;
	},

  playAmbient : function(){
    this.sound_ambient = Loader.sounds['sfx']['ambient.mp3'];
    this.sound_ambient.loop = true;
    this.sound_ambient.play({volume:10, loops:10000});//70

    this.sound_background_music = Loader.sounds['sfx']['background_music.mp3'];
    this.sound_background_music.loop = true;
    this.sound_background_music.play({volume:10, loops:10000});//80
  },
	
	playKeySound: function(keyIndex){
	  
	  var sound;
	  
	  if(keyIndex == 0){ //right
      sound = Loader.sounds['sfx']['ho.mp3'];
      if(sound.playState){
        sound.stop();
      }
	    sound.play({volume:30, position:50});
	  }else if(keyIndex == 1){//left
      sound = Loader.sounds['sfx']['hii.mp3'];
      if(sound.playState){
        sound.stop();
      }
      sound.play({volume:30, position:70});
    }else if(keyIndex == 2){//up
      sound = Loader.sounds['sfx']['ha.mp3'];
      if(sound.playState){
        sound.stop();
      }
      sound.play({volume:30, position:50});
    }else if(keyIndex == 3){//down
      sound = Loader.sounds['sfx']['hey.mp3'];
      if(sound.playState){
        sound.stop();
      }
      sound.play({volume:30, position:70});
    }
	},
	
  
	playClash : function(){
    this.stop()
    Loader.sounds['sfx']['clash_scenario.mp3'].play({loops : 1000})
  },
  
  pause : function(){
    for(var i=0; i < this.nowPlaying.length; i++){
      this.nowPlaying[i].pause()
    }
    this.background_audio.pause()
  },
  
  stopClash : function(){
    Loader.sounds['sfx']['clash_scenario.mp3'].stop()
    for(var i=0; i < this.nowPlaying.length; i++){
      this.nowPlaying[i].play({loops : 1000})
    }
    this.background_audio.play({loops : 1000})

  },
  
	run : function(){
	  this.playAmbient();
	  this.changeTempo();
	  this.switchBeatsChannels();
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
			this.nowPlaying[i].stop();
		 }
     this.background_audio.stop();
     this.sound_ambient.stop();
     this.sound_background_music.stop();
	},

  changeTempo : function(){
    var tempo = this.level.tempo
    //stope the current playing sound
    for(var i=0; i < this.nowPlaying.length; i++){
      this.nowPlaying[i].stop()
      //Audio.Fade(this.nowPlaying[i], 0, this.durations[this.level.tempo]/8, this.reactor, function(s){s.stop()})
    }

    this.nowPlaying = []      

    var sound = this.levelBeats[this.level.tempo][0]
    sound.mute()
    sound.loop = true
    sound.play({ loops : 100000})
    this.nowPlaying.push(sound)

    for(var i=1; i< this.levelBeats[this.level.tempo].length; i++){
      var sound = this.levelBeats[this.level.tempo][i]
      sound.mute()
      sound.loop = true
      sound.play({ loops : 100000, position:this.nowPlaying[0].position})
      this.nowPlaying.push(sound)
    }
    
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
    var delay = position;
    
    //if(delay == 0)delay = this.nowPlaying[0].position - (this.nowPlaying[0].duration-28);
      this.currentReward.rewards[this.currentRewardIndex].sound.play({volume:this.currentReward.rewards[this.currentRewardIndex].volume, position:delay});
      if(this.currentRewardIndex){
        this.currentRewardIndex = 0;
      }
      else{
        this.currentRewardIndex = 1;
        this.rewardIndex = Math.round(Math.random()*(this.rewardLevels.length-1));
        this.currentReward = this.rewardLevels[this.rewardIndex];
      }
            
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
		// this.rewardDown();
	},

  rewardUp : function(){
    var mid = (this.nowPlaying[0].duration-28);
    var pos = this.nowPlaying[0].position; 
    if(pos < mid){
      var self = this;
      // self.playHetaf(300);
      setTimeout(function(){self.playHetaf(0)}, 350);
    }else{
      this.playHetaf(pos-mid);
    }

    // if(this.rewardIndex == (this.rewardLevels.length - 1)) return
    // this.rewardIndex+=1
    // this.currentReward = this.rewardLevels[this.rewardIndex]
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
      var volume = options.volume;
      options.volume = 0;
      sound.setVolume(0);
      sound.play(options);
      Audio.Fade(sound, volume, sound.duration, this.reactor)
		}
	},
	
	mute: function(sound, fade){
	  if(sound.playersCount == null){
	    if(fade)
	       Audio.Fade(sound, 0, sound.duration, this.reactor, function(s){s.stop()})
	    else
	      sound.stop();
	  }else if(sound.playersCount > 1){
	    sound.playersCount -= 1;
    }else{
      sound.playersCount = 0;
      if(fade)
        Audio.Fade(sound, 0, sound.duration, this.reactor, function(s){s.stop()})
      else
        sound.stop();  
    }
	}
	
		
})