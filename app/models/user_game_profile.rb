class UserGameProfile < DataStore::Model

  SEP = '-'.freeze
  CURRENT_VERSION = 52

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
        'girl_7egab' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },
        'journalist' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } },  
        'salafy' => { 1 => {'level'=>1, 'health' => 100, 'upgrades'=>{ 'hp'=>[], 'water'=>[], 'attack'=>[], 'defense'=>[], 'arrest'=>0, 'block'=>0 } } }
      }
      @data['holder_items'] ||= { 'cap' => 0, 'umbrella' => 0 }
      @data['special_items'] ||= { }
      @data['powerups'] ||= []  
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
    last_loaded_stamp
    energy_gain
    crowd_health_gain
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
  
  def last_loaded_stamp
    time = Time.now.utc.to_i
    @data['last_loaded'] = time if @data['last_loaded'].nil?
    seconds_passed = time - @data['last_loaded']
    @data['seconds_passed'] = seconds_passed
    @data['last_loaded'] = time
  end
  
  def crowd_health_gain
    max_health = 100
    health_unit_time = 60*60
    seconds_passed = @data['seconds_passed']
    net_health_units = Float(seconds_passed) / health_unit_time
    
    puts ">>>>>>>>>>>>> seconds_passed = #{seconds_passed}"
    puts ">>>>>>>>>>>>> net_health_units = #{net_health_units}"
    
    @data["crowd_members"].each do |category, category_members|
      category_members.each do |serial, attrs|
        member = category_members[serial]
        needed_health = max_health - member['health']
        
        puts ">>>>>>>>>>>>>> old health : #{member['health']}"
        
        if( net_health_units >= needed_health )
          member['health'] = max_health
        else
          member['health'] += net_health_units
        end
        
        puts ">>>>>>>>>>>>>> new health : #{member['health']}"
        puts "-----------------------------------"
      end
    end
  end

  def energy_gain
    max_energy = 50
    energy_unit_time = 5 * 60
    if( @data['energy'] >= max_energy )
      return
    end
    net_energy_units = @data['seconds_passed'] / energy_unit_time
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