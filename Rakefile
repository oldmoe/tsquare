require 'active_record'
require 'logger'
require 'yaml'

load Dir.pwd + '/app/models/metadata_manager.rb'
load Dir.pwd + '/lib/resource_bundler.rb'
load Dir.pwd + '/lib/static_generator.rb'



namespace :db do
  
    desc "Migrate the database through scripts in db/migrate."
    task :migrate => :environment do
      ActiveRecord::Migrator.migrate('db/migrate', ENV["version"] ? ENV["version"].to_i : nil)
    end
  
    desc "Rollback the database schema to the previous version"
    task :rollback => :environment do
      previous_version = ENV["version"] ? ENV["version"].to_i : ActiveRecord::Migrator.current_version.to_i - 1
      ActiveRecord::Migrator.migrate("db/migrate/", previous_version)
      puts "Schema rolled back to previous verison (#{previous_version})."
    end
    
    task :environment do
        env = ENV['env'] ? ENV["env"] : 'test'
        ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))[env])
        ActiveRecord::Base.logger = Logger.new(File.open('log/database.log', 'a'))
    end
  
end

namespace :deploy do
	
	desc "Bundle resources and compress them, also add cache busters"
    task :bundle do
		bundle
		generate_resources
		render
    end
	
	desc "Bundle static resources, those should not be cacheable from the server"
	task :generate do
		generate_campaigns
	end
	
end




