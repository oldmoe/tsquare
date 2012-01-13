class UserMissions

  MISSION_NEEDED_ENERGY = 5

  class << self  
    
    def all user_profile
      missions = {}
      Mission::MODES.each do |mode|
        missions[mode] = {}
        Mission.all[mode].each do |key, mission|
          missions[mode][key] = { :name => mission['name'], :id => mission['id'], :details => mission['data']['missionDetails'], :details_ar => mission['data']['missionDetails_ar'], :score => user_profile.missions[mode][mission['id']] }
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

    def update user_profile, mission_id, score
      mission_id = mission_id
      mode = Mission.mode mission_id
      if user_profile.missions[mode][mission_id.to_i] && user_profile.missions[mode][mission_id.to_i]['score']
        if user_profile.missions[mode][mission_id.to_i]['score'].to_i < score['score'].to_i
          user_profile.missions[mode][mission_id] = {'score' => score['score'], 'stars' => score['stars']}      
        end
      else
        user_profile.missions[mode][mission_id.to_i] = {'score' => score['score'], 'stars' => score['stars']}
      end
      if score['win'] && user_profile.current_mission[mode] == mission_id
        user_profile.current_mission[mode] = Mission.get(mission_id)['next']
        user_profile.scores['timeline'] += score['score']
        user_profile.scores['global'] += score['score']
      else
        user_profile.scores['global'] += score['score']/2
      end
      # Add experience points here
      user_profile.save
    end

    def current user_profile
      Mission.get(user_profile.current_mission)
    end

  end

end
