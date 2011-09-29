class Mission

  MODES = ['timeline', 'challenge', 'rescue']

  class << self
  
    def init
      game = Game::current
      save = false
      if game.missions.nil?
        game.missions = {}
        save = true
      end
      MODES.each do |mode|                
        if game.missions[mode].nil?
          game.missions[mode] = {}
          save = true
        end
      end      
      if game.missions['id_generator'].nil?
        game.missions['id_generator'] = 1
        save = true
      end
      if save
        game.save
      end    
    end

    def all
      init
      game = Game::current
      missions = {}
      game.missions['timeline'].each_pair do |key, value|
        value['id'] = value['id'].to_s
        value['next'] = value['next'].to_s
        missions[key.to_s] = value
      end
      game.missions['timeline']= missions
      game.save
      missions = {}
      MODES.each { |mode| missions[mode] = game.missions[mode] }
      missions
    end

    def get id
      all
      game = Game::current
      mode = self.mode(id)
      game.missions[mode][id]
    end

    def edit id, data
      init
      game = Game::current
      mode = mode(id)
      if mode 
        game.missions[mode][id] = data
        game.save
      end
    end

    def delete id
      init
      game = Game::current
      mode = self.mode(id)
      if mode 
        deleted_mission = game.missions[mode][id]
        if deleted_mission
          missions = game.missions[mode].select do | key, mission |
            mission['next'] == id
          end
          missions.each do | key, mission |
            mission['next'] = deleted_mission['next']
          end
          game.missions[mode].delete(id)
          game.save
        end
      end
    end

    def add name, parent, mode
      init
      game = Game::current
      mission = { 'name' => name, 'data' => {} }
      mission['id'] = game.missions['id_generator'].to_s
      next_mission = 0 
      unless game.missions[mode][parent].nil? 
        next_mission = game.missions[mode][parent]['next']
        game.missions[mode][parent]['next'] = mission['id']
      end
      mission['next'] = next_mission
      game.missions['id_generator'] += 1
      game.missions[mode][mission['id']]= mission
      game.save
    end

    def mode id
      game = Game::current
      (MODES::select { |mode| game.missions[mode][id].nil? == false }).first
    end

  end  

end
