class UserMissions

  class << self  
    
    def all user_profile
      missions = {}
      Mission::MODES.each do |mode|
        missions[mode] = {}
        Mission.all[mode].each do |key, mission|
          missions[mode][key] = { :name => mission['name'], :id => mission['id'] }
        end
      end
      missions
    end 

    def data user_profile, mission_id
      data = {}
      mission_id = mission_id.to_i
      mode = Mission.mode mission_id
      if user_profile.current_mission[mode]==mission_id ||user_profile.missions[mode][mission_id]
        data = Mission.get(mission_id)
      end
      data
    end

    def current user_profile
      Mission.get(user_profile.current_mission)
    end

  end

end
