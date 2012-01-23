class UserMissions

  MISSION_NEEDED_ENERGY = 5

  class << self  
    
    def all user_profile
      missions = {}
      Mission::MODES.each do |mode|
        missions[mode] = {}
        Mission.all[mode].each do |key, mission|
          missions[mode][key] = {
            :id => mission['id'],
            :name => mission['name'],
            :next => mission['next'],
            :locked => mission['data']['locked'],
            :details => mission['data']['missionDetails'],
            :details_ar => mission['data']['missionDetails_ar'],
            :missionTime => mission['data']['missionTime'],
            :superTime => mission['data']['superTime'],
            :score => user_profile.missions[mode][mission['id']]
            }
        end
      end
      missions
    end 

    def data user_profile, mission_id
      data = {}
      mode = Mission.mode mission_id
      if (user_profile.current_mission[mode]==mission_id || user_profile.missions[mode][mission_id] || user_profile.missions[mode][mission_id.to_i]) && user_profile.energy >= MISSION_NEEDED_ENERGY
        data = Mission.get(mission_id)
=begin : Disable energy part for now
        user_profile.energy-= 5
=end
        user_profile.save
      end
      data
    end

    def update user_profile, data
      
      mission_id = data['id']
      score = data['score']
      
      mode = Mission.mode mission_id
      if user_profile.missions[mode][mission_id.to_i] && user_profile.missions[mode][mission_id.to_i]['score']
        if user_profile.missions[mode][mission_id.to_i]['score'].to_i < score['score'].to_i
          user_profile.missions[mode][mission_id] = {'score' => score['score'], 'stars' => score['stars']}      
        end
      else
        user_profile.missions[mode][mission_id.to_i] = {'score' => score['score'], 'stars' => score['stars']}
      end
      
      mission = Mission.get(mission_id)
      
      if score['win'] && user_profile.current_mission[mode] == mission_id
        user_profile.current_mission[mode] = mission['next']
        user_profile.scores['timeline'] += score['score']
        user_profile.scores['global'] += score['score'] 
      else
        user_profile.scores['global'] += score['score']/2
      end
      
      mission_powerups = [];
      if score['win'] && mission['powerups'] && mission['powerups']['win']
        mission_powerups.push(mission['powerups']['win'])
      end
      
      if data['powerups'] && data['powerups'].length > 0
        mission_powerups.push(data['powerups'])
      end

      user_profile.powerups = [] if user_profile.powerups.nil?
      
      mission_powerups.each{|e|user_profile.powerups.push(e)}
      
      # Add experience points here
      user_profile.save
    end
    
    def current user_profile
      Mission.get(user_profile.current_mission)
    end

  end

end
