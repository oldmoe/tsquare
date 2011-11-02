require 'json'

def time_to_name time
  time.to_s.delete('-').delete(' ').delete(':').split('+')[0]
end

def production?
  ARGV[0]=="production"
end

#############################################################
#-------------------- Caching statics ----------------------#
#############################################################
pwd = Dir.pwd
base_resources_urls = {
  "images" => "#{pwd}/public/tsquare/images",
  "sounds" => "#{pwd}/public/tsquare/sounds",
  "flash" => "#{pwd}/public/tsquare/flash",
  "templates" => "#{pwd}/public/tsquare/templates"
}

URLS = {}
def retrive_static_files_paths base_url, dir
  image_directories = Dir.entries(dir)
  image_directories.delete '.'
  image_directories.delete '..'
  image_directories.each do |dir_name|
   sub_path = dir + '/' + dir_name
   if File.file? sub_path
     URLS[sub_path.split(base_url)[1]] = time_to_name File.mtime(sub_path) if production?
     URLS[sub_path.split(base_url)[1]] = "" if !production?
   end
   retrive_static_files_paths(base_url, sub_path) if File.directory? sub_path
  end
end

base_resources_urls.values.each do |base|
  retrive_static_files_paths base, base
end

urls_js_file_path = "#{Dir.pwd}/public/tsquare/js/nezal/urls.js"
File.open(urls_js_file_path, 'w') {|f| f.write("var urls = #{JSON.generate URLS}") }

if production?
  #############################################################
  #---------------------- Caching JS -------------------------#
  #############################################################
  imports_js_file_path = "#{Dir.pwd}/public/tsquare/js/game/imports.js"
  imports_js_file = File.open(imports_js_file_path, "rb")
  contents = imports_js_file.read

  js_blocks = contents.scan(/\[\"js.*?.js\"\]/m)
  max_mtime = nil
  grouped_js = nil
  grouped_file_name_index = 0
  js_blocks.each do |js_block|
    js_array = JSON.parse js_block
    js_array.each do |js_path|
      js_full_path = Dir.pwd + '/public/tsquare/' + js_path
      current_mtime = File.mtime(js_full_path)
      max_mtime = current_mtime if max_mtime.nil? || current_mtime > max_mtime
      grouped_js = "#{grouped_js}\n#{File.open(js_full_path, 'rb').read}"
    end
    grouped_file_name = "#{Dir.pwd}/public/tsquare/js/#{grouped_file_name_index}.js"
    puts( grouped_js[0..10] )
    File.open(grouped_file_name, 'w') {|f| f.puts( grouped_js ) }
    contents = contents.gsub(js_block, %Q( ["js/#{grouped_file_name_index}-#{time_to_name max_mtime}.js"] ))
    grouped_file_name_index += 1
    max_mtime = nil
    grouped_js = nil
    
  end
  
  #############################################################
  #--------------------- Caching CSS --------------------------#
  #############################################################

  css_includes = contents.scan(/\"css.*\.css\"/)
  css_includes.each do |css_path|
    css_path = css_path.delete "\""
    css_full_path = Dir.pwd + '/public/tsquare/' + css_path
    next if !File.file? css_full_path
    contents = contents.gsub(css_path, "#{css_path.gsub(".css", "")}-#{time_to_name File.mtime(css_full_path)}.css")
  end
  File.open(imports_js_file_path + ".production", 'w') {|f| f.write(contents) }
end

