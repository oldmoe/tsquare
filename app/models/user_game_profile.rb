class UserGameProfile < DataStore::Model

  SEP = '-'.freeze
  CURRENT_VERSION = 43

  index :timeline_score, :method => :timeline_index
  index :racing_score, :method => :racing_index
  index :cooperation_score, :method => :cooperation_index
  index :global_score, :method => :score_index

  def game_key  
    splits = key.split(self.class::SEP)
    splits[1, splits.size-2].join(self.class::SEP)
  end

  def user
    key_parts = key.split(self.class::SEP)
    @user ||= User.get(User.generate_key(key_parts.first, key_parts.last))
  end

  def service_type
    key.split(self.class::SEP).first
  end

  def service_id
    key.split(self.class::SEP).last
  end

  def timeline_index
    rank_index(format(scores['timeline']))
  end

  def racing_index
    rank_index(format(scores['racing']))
  end

  def cooperation_index
    rank_index(format(scores['cooperation']))
  end

  def score_index
    rank_index(format(scores['global']))
  end

  def rank_index(rank)
    self.class.generate_key(service_type,  Game::current.key, rank)
  end

  def format(key)
    if key.is_a? Integer
      key = sprintf("%8s", key.to_s(36))
    end
    key
  end

  def init
    time = Time.now.to_i
    game = Game::current
    @data ||= {}
    @data['version'] ||= 0
    if @data['version'] < CURRENT_VERSION
      @data = { 'scores' => { 'timeline'=>0, 'racing'=>0, 'cooperation'=>0, 'global'=>0,
                             'update_time'=> { 'timeline'=>time, 'racing'=>time, 'cooperation'=>time, 'global'=>time} 
                            } 
              }
      @data['current_mission'] = {} unless @data['current_mission'].is_a? Hash
      @data['missions'] = {} unless @data['missions'].is_a? Hash
      Mission::MODES.each do |mode|
        @data['current_mission'][mode] = game.data['missions'][mode].keys.min { |i| i.to_i }
        @data['missions'][mode] ||= {}
      end 
      @data['crowd_members'] = {
        'ultras_green' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },
        'journalist' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },  
        'ultras_white' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },
        'ultras_red' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },
        'bottleguy' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } },
                       2 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } }
      }
      @data['holder_items'] ||= { 'cap' => 0, 'umbrella' => 0 }
      @data['special_items'] ||= { }
      @data['power_ups'] ||= {}  
      @data['energy'] ||= 50
      @data['bandages'] ||= 1000
      @data['version'] = CURRENT_VERSION
  end
   # This puts all the missions to the user .. should be removed once testing is done
 # Mission::MODES.each do |mode|
 #       @data['current_mission'][mode] = game.data['missions'][mode].keys.max { |i| i.to_i }
 #       @data['missions'][mode] = game.data['missions'][mode].keys
 # end
   # End of part to be removed
    Mission::MODES.each do |mode|
      game.data['missions'][mode].keys.each do |key|
        @data['missions'][mode][key] ||= { 'score' => 0, 'stars'=>0}
      end
    end 
    energy_gain
    save
  end

  def generate_scores 
    time = Time.now.to_i
    scores = { 'update_time' => {} }
    ['timeline', 'racing', 'cooperation', 'global'].each do |mode|
      scores[mode] = (rand * 100).to_i 
      scores['update_time'][mode] = time
    end
    scores
  end
 
  def global_scores(game_mode, count)
    after_users = filterAppProfiles(self.previous(game_mode + '_score', count)).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    before_users = (filterAppProfiles(self.next(game_mode + '_score', count)).collect do
       |record| {'service_id' => record.service_id, 'scores' => record.scores} 
    end).reverse
    top_users = filterAppProfiles(self.class.last(game_mode + '_score', count)).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    { :list => before_users + [{'service_id' => self.service_id, 'scores' => self.scores}] + after_users, :top => top_users }
  end

  def friends(ids)
    game = Game::current
    records = []
    ids.each do |id|
      record = self.class.get(self.class.generate_key(service_type, Game::current.key, id))
      records << record unless record.nil?
    end
    # Send only the scores data
    records.collect do |record| 
      protected_data = { 'service_id' => record.service_id, 'scores' => record.scores, 'missions' => record.missions }
      if record.service_id == service_id
        record.last_read= record.read_time.nil? ? Time.now.to_i : record.read_time
        record.read_time= Time.now.to_i
        record.save
        protected_data['last_read'] = record.last_read
      end
      protected_data
    end
  end

  def filterAppProfiles(list)
    appProfiles = []
    appProfiles = list.select { |record|
                record.service_type == service_type && record.game_key == game_key } 
    appProfiles
  end

  def energy_gain
    max_energy = 50
    energy_unit_time = 5 * 60
    if( @data['energy'] >= max_energy )
      return
    end
    time = Time.now.utc.to_i
    @data['last_loaded'] ||= time
    seconds_passed = time - @data['last_loaded']
    @data['last_loaded'] = time
    net_energy_units = seconds_passed / energy_unit_time
    needed_energy = max_energy - @data['energy']
    
    if( net_energy_units >= needed_energy )
      @data['energy']= max_energy
      return
    end
    @data['energy']+= net_energy_units
  end
  
  def add_crowd_member name
    new_crowd = {'level' => 1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } }
    if @data['crowd_members'][name]
      next_id = @data['crowd_members'][name].keys.max + 1
      @data['crowd_members'][name][next_id] = new_crowd
    else
      user_game_profile['crowd_members'][name] = {}
      user_game_profile['crowd_members'][name][1] = new_crowd
    end
  end

  class << self

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end

end
