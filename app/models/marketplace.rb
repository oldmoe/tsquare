class Marketplace
  class << self
    def buyCrowdMember user_game_profile, name, cost_in_coins
      decoy = Game::current.crowd_members['category'][name].nil?
      if( decoy )
        return {'error' => 'Crowd member does not exist'}
      end
      
      user_game_profile.add_crowd_member name
      
      if cost_in_coins
        user_game_profile.user.coins -= 10
        user_game_profile.user.save
      end
      user_game_profile.save
    end
  end
end
