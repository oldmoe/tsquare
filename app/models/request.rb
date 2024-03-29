# Each record should hold the requests a user has made.
# key : user key.
# data : hash of requests. 
#        requests : { request_key => { :to => user_key, :timestamp => Time request was issued, :data => {} } ,
#                     request2_key => {} .. etc }
class Request < DataStore::Model

  REQUEST_TYPES = {
    'challenge' => { :expire => 60*60*2*24, :exclude => 60*60*24 },
    'gift' => { :expire => 60*60*2*24, :exclude => 60*60*24 },
    'help' => { :expire => 60*60*2*24, :exclude => 60*60*24 },
    'link_a_friend' => { :expire => 60*60*2*24, :exclude => 60*60*24 }
  }

  @@data = { "requests" => {} }
  
  def init
    @data ||= { "requests" => {} }
  end

  def excluded_friends 
    ids = []
    time = Time.now.to_i
    requests.each do |id, request|
      puts "############{request}"
      data = JSON.parse( request['data'] ) if request['data']
      if time - request['timestamp'] < REQUEST_TYPES[ data['type'] ][ :exclude ]
        ids << request['to']
      end
    end
    ids.uniq
  end

  def get_friend_request friend_key, request_id
    puts ">>>>>>>>>> requests = #{requests.inspect}"
    request_id = request_id.split("_")[0]
    puts ">>>>>>>>>> request_id = #{request_id.inspect}"
    friend_request = requests[request_id]
    puts ">>>>>>>>>> friend_request = #{friend_request.inspect}"
    #if friend_request && friend_request['to'] == friend_key
      return friend_request      
    #end
  end
  
  def process friend_key, request_id
    request = get_friend_request friend_key, request_id
    puts ">>>>>>>>>>>> request && request['data'] = #{request} && #{request['data']}"
    if request && request['data']
      data = JSON.parse( request['data'] )
      expire_time = REQUEST_TYPES[ data['type'] ][ :expire ]
      if request && request['timestamp'] + expire_time > Time.now.to_i
        request['expired'] = true
      end
      Game::current.process_service_request(key, data, friend_key)
      puts ">>>>>>>>>>>> process #{friend_key}, #{request_id}"
    end
    requests.delete(request_id)
    save
  end

end
