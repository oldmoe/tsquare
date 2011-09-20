class User < DataStore::Model

  @@data = {"coins" => 100000}

  def init
    if @data
      @@data.clone.each_pair do |k, v|
        @data[k] = v.clone unless @data[k]
      end
    else
      @data = @@data.clone
    end
  end

  class << self

    SEP = '-'.freeze

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end
  
end
