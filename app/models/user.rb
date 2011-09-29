class User < DataStore::Model

  CURRENT_VERSION = 1

  @@data = {"coins" => 1000}

  def init
    @data['version'] ||= 0
    if @data
      @@data.clone.each_pair do |k, v|
        @data[k] = v.clone unless @data[k]
      end
    else
      @data = @@data.clone
    end
    if @data['version'] < CURRENT_VERSION
      @data['coins'] = @@data['coins']
      @data['version'] = CURRENT_VERSION
      save
    end
  end

  class << self

    SEP = '-'.freeze

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end
  
end
