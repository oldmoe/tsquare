class Game < DataStore::Model

  @@data = { "modes" => {}, "ranks" => {}, "products" => { "fb" => {} }, "missions" => {}, "items" => {} }

  def init
    if @data
      @@data.clone.each_pair do |k, v|
        @data[k] = v.clone unless @data[k]
      end
    else
      @data = @@data.clone
    end
  end

  def path
    FB_CONFIGS::find('name', name)['game_name']       
  end

  def process_service_request user_key, request_data, friend_service_id
    case request_data['type']
    when 'link_a_friend'
      served_user = UserGameProfile.get user_key
      puts "!!!!!!!!!!!!!!!!!!! #{served_user.inspect}"
      puts "!!!!!!!!!!!!!!!!!!! #{request_data['memberID']}"
      member_id = request_data['memberID'].split("-")
      served_user["crowd_members"][member_id[0]][member_id[1].to_i]['linked_to'] = friend_service_id
      served_user.save
    end
  end

  def user_data user_profile
    data = {}
    data = @data.clone
#    data.delete('missions')
    data
  end

  class << self  

    def current
      @game = get(GAME_NAME)
    end

  end

end
