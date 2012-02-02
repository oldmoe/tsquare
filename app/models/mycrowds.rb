class MyCrowds
  class << self
    def heal user_game_profile, id
      id = id.gsub( "_heal", "" ).split("-")
      name = id[0]
      serial = id[1].to_i
      
      bandages = user_game_profile["bandages"]
      healing_limit = bandages < 10 ? bandages : 10
      
      health = user_game_profile["crowd_members"][name][serial]["health"]
      if( 100 - health < healing_limit )
        healing_limit = (100 - health).ceil
      end
      
      user_game_profile["bandages"] -= healing_limit
      user_game_profile["crowd_members"][name][serial]["health"] += healing_limit
      user_game_profile.save
      
      return {"health" => user_game_profile["crowd_members"][name][serial]["health"],
              "bandages" => user_game_profile["bandages"],
              "name" => name,
              "serial" => serial }
    end
  end
end