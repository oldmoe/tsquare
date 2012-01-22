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
        data['mission'] = Mission.get(mission_id)
=begin : Disable energy part for now
        user_profile.energy-= 5
=end
        distribute_health_tax user_profile, data['mission']
        user_profile.save
        data['crowd_members'] = user_profile["crowd_members"]
      end
      data
    end
    
    def distribute_health_tax user_profile, mission_data
      
      members = []
      user_profile["crowd_members"].each do |category, category_members|
        category_members.each do |serial, attrs|
          if( attrs['health'].to_i >= 40 )
            members << attrs
          end
        end
      end
      
      #################################################
      # Health tax distribution algorithm starts here #
      #-----------------------------------------------#
      
      health_tax = mission_data['healthTax'].to_i
      joining_members = members.length
      non_zero_taxed_members = []
      while( health_tax > 0 && joining_members > 0 ) do
        
        (1..joining_members).each do |serial|
          choice = (rand * members.length).floor
          health = members[choice]['health'].to_i
          health_loss = health_tax / members.length
          health -= health_loss
          if( health <= 0 )
            health_tax -= members[choice]['health'].to_i
            members[choice]['health'] = 0
            members.delete_at choice
          else
            health_tax -= health_loss
            members[choice]['health'] = health
            non_zero_taxed_members << members.delete_at(choice)
          end
        end
        
        members = non_zero_taxed_members
        joining_members = members.length
        non_zero_taxed_members = []
      end
      
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
