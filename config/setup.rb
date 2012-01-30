require 'yaml'
require 'logger'
require 'active_record'
require 'data_store'

LOGGER = Logger.new(STDOUT)
LOGGER.level = Logger::DEBUG

# Initialize the database connection 
#ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))[ENV['RACK_ENV']])
#ActiveRecord::Base.logger = Logger.new(File.open('log/database.log', 'a'))

GAME_NAME = (ENV['RACK_ENV']=='production' ? 'thawragy' : ( ENV['RACK_ENV']=='testing' ? 'staging-thawragy' : 'local-thawragy') )
ABSOLUTE_URL = (ENV['RACK_ENV']=='production' ? "http://base-defender.nezal.com:7500/fb-games" : "http://127.0.0.1:5500/fb-games")

# Initialize and load the facebook app definition
FB_CONFIGS = YAML.load_file("config/facebook_apps.yml")
# Initialize and load the kongregate app definition
K_CONFIGS = YAML.load_file("config/kongregate_apps.yml")

def FB_CONFIGS::find(field, app_name)
  FB_CONFIGS.each_pair do |key, value| 
    return value if (value[field] && value[field].index(app_name) == 0)
  end
end

def K_CONFIGS::find(field, app_name)
  K_CONFIGS.each_pair do |key, value| 
    return value if (value[field] && value[field].index(app_name) == 0)
  end
end
