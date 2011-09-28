class Marketplace
  class << self
    def buyCrowdMember user_game_profile, name, cost_in_coins
      decoy = Game::current.crowd_members['specs'][name].nil?
      if( decoy )
        return {'error' => 'Crowd member does not exist'}
      end
      if user_game_profile['crowd_members'][name]
        next_id = user_game_profile['crowd_members'][name].keys.max + 1
        user_game_profile['crowd_members'][name][next_id] = {}
      else
        user_game_profile['crowd_members'][name] = {}
        user_game_profile['crowd_members'][name][1] = {}
      end
      if cost_in_coins
        user_game_profile.user.coins -= 10
        user_game_profile.user.save
      end
      user_game_profile.save
    end
  end
end