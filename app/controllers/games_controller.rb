class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'

  # get the game object metadata
  get '/:game_name/data' do
    if( decode(params['data'])['request'] && !decode(params['data'])['request'].empty?)
      data = decode(params['data'])['request'].values[0]
      data['request_id'] = data['id']
      data['from'] = data['from']['id']
      data['data'] = decode( data['data'] )
      process_request_accept data
    end
    
    data = {
      :game_data => { :data => Game::current.user_data(user_game_profile) } , 
      :user_data => { :coins => user.coins,
                      :data => user_game_profile.data
                    },
      :missions_data => { :data => UserMissions.all(user_game_profile) }
    }
    data[:user_data][:volatile_data] = user_game_profile['volatile_data'] || {}
    encode(data)
  end
  
  # update the user game profile
  post '/:game_name/data' do
    BaseDefender.edit_game_profile(user_game_profile, params['data'])
    user_game_profile.quests['descriptions'] = BD::Quest::load_quests(user_game_profile)
    data = {
      :user_data => { :coins => user_game_profile.user.coins, 
                      :rank => user_game_profile.rank,
                      :exp => user_game_profile.exp, 
                      :locale => user_game_profile.locale, 
                      :metadata => user_game_profile.data
                      }
    }
    encode(data)
  end

  get '/:game_name/global_scores' do
    result = user_game_profile.global_scores(decode(params['data'])['game_mode'], 5)
    encode(result)
  end

  get '/:game_name/friends' do
    result = user_game_profile.friends(decode(params['data'])['friends_ids'])
    encode(result)
  end
  
  get '/:game_name/mission' do
    data = decode(params['data'])
    result = UserMissions.data(user_game_profile, data['id'])
    encode(result)
  end

  post '/:game_name/mission' do
    data = decode(params['data'])
    result = UserMissions.update(user_game_profile, data)
    data = {
      :game_data => { :data => Game::current.user_data(user_game_profile) } , 
      :user_data => { :coins => user.coins,
                      :data => user_game_profile.data
                    },
      :missions_data => { :data => UserMissions.all(user_game_profile) }
    }
    data[:user_data][:volatile_data] = user_game_profile['volatile_data'] || {}
    encode(data)
  end

  # Change User to be nolonger a newbie
  post '/:game_name/users/newbie' do
    if @game_profile.newbie
      @game_profile.newbie = false;
      @game_profile.save
    end
    encode( {:user_data => {'exp' => @game_profile.exp, 'rank' => @game_profile.rank.name} })    
  end
  
  # User bookmarked the application
  post '/:game_name/users/bookmark' do
    if(!@game_profile.bookmarked)
      # Here should go the code to reward the bookmark action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User likes the application
  post '/:game_name/users/like' do
    if(!@game_profile.like)
      # Here should go the code to reward the like action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User subscribed to the application
  post '/:game_name/users/subscribe' do
    if(!@game_profile.subscribed)
      # Here should go the code to reward the subscribe action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end

  # Change User Locale
  post '/:game_name/users/locale' do
    @game_profile.locale = params['locale'];
    @game_profile.save
    @game_profile.locale
  end

  post '/:game_name/credits' do
    LOGGER.debug ">>>>>>>>>>>> Facebook credits"
    LOGGER.debug ">>>>>>>>  #{params}"
    result = nil
    data = Service::PROVIDERS[service_provider][:helper]::decode params['signed_request'], app_configs if params['signed_request']
    if data
      case params['method']
      when 'payments_get_items'
        result = {'content' => [], 'method' => 'payments_get_items' }
        product = Game::current.products[service_provider][data['credits']['order_info'].delete("\"")]
        product['item_id'] = data['order_info']
        result['content'] << product
      when 'payments_status_update'
        LOGGER.debug "!!!!!!!!!!!!!!!!!!!!!!! #{data}"
        result = {'content' => {}, 'method' => 'payments_status_update' }
        if params['status'] == 'placed'
          game = Game::current
          order_details = Nezal::Decoder.decode( data['credits']['order_details'] )
          user_id = UserGameProfile::generate_key(Service::PROVIDERS[service_provider][:prefix], game.key, order_details['receiver'])
          user_game_profile = UserGameProfile.get user_id
          product_title = order_details['items'][0]['title']
          product = game.products[service_provider][ product_title.delete("\"") ]
          crowd_member_name = product['item_id'].split(".")[-1]

          Marketplace.buyCrowdMember user_game_profile, crowd_member_name, false
          
          result['content']['status'] = 'settled'
          result['content']['order_id'] = data['order_id']
        end
      end
    end
    encode(result)
  end

  get '/:game_name/requests/exclude' do
    ids = []
    user_requests = Request.get(user_game_profile.key)    
    ids = user_requests.excluded_friends unless user_requests.nil?
    encode(ids)
  end

  post '/:game_name/requests' do
    user_requests = Request.get(user_game_profile.key)
    if user_requests.nil?
      user_requests = Request.create(user_game_profile.key)
    end
    puts "BEEEEEFFFFFOOOOOORRRRRREEEEEEE #{params}"
    data = decode(params['data'])
    data['requests'].each do |id, request|
      user_requests.requests[id] = request
    end
    puts "$$$$$$$$#{user_requests.inspect}"
    user_requests.save
  end
  
  def process_request_accept data
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!! #{data}"
    #Not a saved request
    if( data['data'] )
      request_type = data['data']['type']
      if( request_type == "invite" )
        Game::current.process_service_request(user_game_profile.key, data['data'], build_game_profile_key(data['from']))
      end
      return
    end
    
    request_id = data['request_id']
    from_user_key = data['from']
    user_requests = Request.get(build_game_profile_key(from_user_key))
    request = user_requests.process user_game_profile.service_id, request_id
    
    puts ">>>>>> /:game_name/requests/accept"
  end
  
  post '/:game_name/requests/accept' do 
    data = decode(params['data'])
    process_request_accept data
  end
  
  post '/:game_name/heal' do
    data = decode(params['data'])
    response = MyCrowds.heal user_game_profile, data["id"]
    return encode(response)
  end
  
  post '/:game_name/buy_market_item' do
    data = decode(params['data'])
    response = {}
    case data['category']
      when 'marketMembers'
        response = Marketplace.buyCrowdMember user_game_profile, data['name'], true
    end
    response = {
      :game_data => { :data => Game::current.user_data(user_game_profile) } , 
      :user_data => { :coins => user.coins,
                      :data => user_game_profile.data
                    },
      :missions_data => { :data => UserMissions.all(user_game_profile) }
    }
    return encode(response)
  end
  
  get '/:game_name/' do
    File.read(File.join( 'public', @app_configs["game_name"], @service_provider + '-' + 'index.html'))
  end

  post '/:game_name/' do
    File.read(File.join( 'public', @app_configs["game_name"], @service_provider + '-' + 'index.html'))
  end

  post '/:game_name/users/reset' do
    user_game_profile.destroy
    user.destroy
  end


end
