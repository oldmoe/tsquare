class AdminController < ApplicationController
  
  ADMIN_URL = "nezal-admin"

  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/admin'

  # Serve the add new game page
  get '/' do
    erb :index , {:layout => :app}
  end

  # Add a new Game
  post '/' do
    @game = Game.create(params["name"], {"name" => params["name"], "description" => params["description"]})
    puts @game
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  ######################################################################
  # Game Ranks Requests
  # Add, Remove rank requests
  ######################################################################
  post '/:game_name/ranks' do
    @game = Game.get(params[:game_name])
    @game.ranks[params["name"]] = {"name" => params["name"], "lower_exp" => params["lower_exp"], "upper_exp" => params["upper_exp"]}
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end
  
  # Delete a rank
  put '/:game_name/ranks/:rank_name' do
    @game = Game.get(params[:game_name])
    @game.ranks.delete(params[:rank_name])
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  ######################################################################
  # Game Products Requests
  # View list of Quests, Edit Quest page, Add, Remove, Retrieve and Save metadata
  ######################################################################  
  def populate_items
    items = {}
    Game::current.crowd_members['category'].keys.each do |crowd_member|
      items["crowd_members.category."+crowd_member] = crowd_member.humanize
    end
    items
  end

  get '/:game_name/products/new' do
    @game = Game::current
    @product = {}
    @items = populate_items
    erb :edit_product , {:layout => :app}
  end
  
  put '/:game_name/product/:name' do
    @game = Game::current
    @game.products["fb"].delete( params[:name] )
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}/"
  end
  
  get '/:game_name/product/:name/edit' do
    @game = Game::current
    @product = @game.products["fb"][params[:name]]
    @items = populate_items
    erb :edit_product , {:layout => :app}
  end

  get '/:game_name/product/:name' do
    @game = Game::current
    @product = @game.products["fb"][params[:name]]
    erb :product , {:layout => :app}
  end
  
  #Adding a facebook product
  post "/:game_name/product" do
    @game = Game::current
    if !@game.products["fb"][params[:title]]
      @game.products["fb"][params[:title]] = {}
    end
    
    product = @game.products["fb"][params[:title]]

    if !params['image_file'].blank?
      File.open("public/#{@game.path}/images/products/" + params['image_file'][:filename], "w") do |f|
        f.write(params['image_file'][:tempfile].read)
      end
      product["product_url"] = "#{ABSOLUTE_URL}/#{@game.name}/images/products/#{params['image_file'][:filename]}"
    end
    ["title", "description", "price", "item_id"].each do |key|
      product[key] = params[key]
    end
    product["image_url"] = product["product_url"]
    
    #updating the game data real item with the product id => product['title']
    reached = @game
    access_parts = product["item_id"].split "."
    access_parts.each do |part|
      puts "#{reached}"
      reached = reached[part]
    end
    reached['buyID'] = product['title']
    
    @game.save
    
    redirect "/#{ADMIN_URL}/#{@game.name}/product/#{product["title"]}"
  end

  ######################################################################
  # Game Missions Requests
  # View list of Missions, Edit Mission page, Add, Remove, Retrieve and Save metadata
  ######################################################################  
  # Serve game mis‭sions list display page 
  get '/:game_name/missions' do
    @game = Game.current
    puts @game, @game.name
    @missions = Mission.all
    erb :missions , {:layout => :app}
  end

  # Add a mission to a game 
  post '/:game_name/missions' do
    @game = Game.current
    Mission.add(params['name'], params['parent'], params['mode'])
    redirect "/#{ADMIN_URL}/#{params[:game_name]}/missions"
  end

  # Get mission metadata
  # Send Json mission object
  # Send Level Editor Page
  get %r{([0-9A-Za-z_\-]+)(/missions/)([0-9A-Za-z_\-]+)(.json)?} do
    @game = Game.current
    puts params[:captures]
    id = (params[:captures][2])
    if params[:captures][3]
      Nezal::Decoder.encode(Mission.get(id))
    else
      @game = Game.get(params[:game_name])
      @missions = Mission.all
      redirect "/admin/leveleditor/index-new.html?mission=#{params[:captures][2]}&game=#{params[:captures][0]}"
    end
  end

  # Update a mission  
  # Delete Mission
  put %r{([0-9A-Za-z_\-]+)(/missions/)([0-9A-Za-z_\-]+)(.json)?} do
    @game = Game.current
    id = (params[:captures][2])
    if params[:captures][3]
      mission = Nezal::Decoder.decode(params['data'])
      Mission.edit(id, mission)
      ''
    else
      Mission.delete(id)
      redirect "/#{ADMIN_URL}/#{params[:captures][0]}/missions"
    end
  end

  ######################################################################
  # Game Language/Locale text files Requests
  ######################################################################
  # Get Language data
  get '/:game_name/locale.json' do 
    @game = Game.get(params[:game_name])
    BD::Language::init()
    Nezal::Decoder.encode(BD::Language::load())
  end

  # Edit Language data
  put '/:game_name/locale.json' do 
    @game = Game.get(params[:game_name])
    BD::Language::save(params['data'])
    ''
  end

  # Serve Language edit page
  get '/:game_name/locale/:language' do 
    @game = Game.get(params[:game_name])
    @language = params[:language]
    @data = BD::Language.load()
    erb :language , {:layout => :app}
  end

  ######################################################################
  # Game requests
  # Serve default game page located under admin, game specific edit game page (show.erb) under the game directory 
  # Serve game metadata, save metadata requests
  ######################################################################
  get '/:game_name/data' do 
    @game = Game.get(params[:game_name])
    @language = params[:language]
    erb :edit , {:layout => :app}
  end
  
  put '/:game_name/upload_data' do 
    @game = Game.get(params[:game_name])
    data = params["data_file"][:tempfile].read
    @game.data= Nezal::Decoder.decode(data)
    @game.save
    redirect "/#{ADMIN_URL}/#{params[:game_name]}/data"
  end
  
  get '/:game_name/download_data' do 
    @game = Game.get(params[:game_name])
    content_type :json
    response.headers["Content-Disposition"] = "attachment; filename=\"#{params[:game_name]}-#{Time.now.utc.to_s}.json\""
    Nezal::Decoder.encode(@game.data)
  end
  
  # Serve the show.erb to display game details { Ranks .. doesnt include the metadata}
  get %r{/([0-9A-Za-z_\-]+)(.json)?} do
    @game = Game.get(params[:captures][0])
    if params[:captures][1]
      Nezal::Decoder.encode(@game.data)
    else
      erb :show , {:layout => :app}
    end
  end
  
  # Edit game metadata object
  put %r{/([0-9A-Za-z_\-]+).json} do
    @game = Game.get(params[:captures][0])
    data = params["data"]
    @game.data= Nezal::Decoder.decode(data)
    @game.save
  end

  ######################################################################
  # Administrative Requests
  ######################################################################
  # Delete all user game profiles
  # DANGEROUS METHOD !!!!!!!!!!!
  put '/:game_id/user_game_profiles' do
    if( UserGameProfile.count < 50 )
      UserGameProfile.delete_all(["game_id = ?", Game.find_by_name(params[:game_id])])
    end
  end

  get '/:game_name/stats' do
	  game = Game.find_by_name(params[:game_name])
	  totoalCount = UserGameProfile.count(:conditions => "game_id = #{game.id}")
	  newbieCount = UserGameProfile.count(:conditions => "game_id = #{game.id} AND newbie = 't'")
    expneqz = UserGameProfile.count(:conditions => "game_id = #{game.id} AND exp = 0")
    return "user count = #{totoalCount} ||| newbieCount = #{newbieCount} ||| users exp equal 0 = #{expneqz}"
  end

end

