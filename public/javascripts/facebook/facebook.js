﻿var Display = {
    fetch: function(url, place){
        new Ajax.Request(url, {   method:'get',
                                  onSuccess: function(t){
                                    Display.alter(place, t.responseText);
                                  },
                                  onComplete: function(t){}
                              });
    },
    alter: function(divId, newContent)  {
        $(divId).replace(newContent);
    }
}

var FBConnect = {

    appIds : {
        		'local-studio' : "103040546410849",
        		'studio-sa' : "110624738982804",
        		'staging-studio' : "130918743609615"
	  },
	  
    channelPath : "xd_receiver.html",
    
    url : function(){
		    var data = window.location;
		    data = data.toString().split("/");
		    data = data[3];
		    //document.domain = origDomain
		    return data;
	  },
	  
	  retry : 10,
	  
	  callback : null,
	  
	  getUser : function() {
	        FBConnect.retry --;
          new Ajax.Request( "/" + FBConnect.url() + "/users/user", 
                                    {   method:'get', 
                                        onSuccess: function(t, json){
                                              var response = JSON.parse(t.responseText);
                                              if (response['user'])
                                                FBConnect.callback();
                                              else if (FBConnect.retry >= 0)
                                                window.setTimeout(FBConnect.getUser, 1000);
                                        }
                                    });                               
	  },
	  
    init : function( successCallback ) {
        fbRoot = document.createElement('div');
        fbRoot.setAttribute("id", "fb-root");
        document.body.appendChild(fbRoot);
        FB.init({
            appId  : FBConnect.appIds[FBConnect.url()],
            apiKey  : FBConnect.appIds[FBConnect.url()],
            status : true, // check login status
            cookie : true // enable cookies to allow the server to access the session
        });
        FBConnect.callback = successCallback;
        FB.getLoginStatus(function(response) {
			      if (response.session) {
			          FBConnect.session = response.session
			          Ajax.Responders.register({
				          onCreate: function(req) {					
					        req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString(FBConnect.session)
					        return true
				          }
			          });
                if(document.getElementsByTagName('fb:fan')[0]) 
                {
                    document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id', FBConnect.appIds[FBConnect.url()]);
                    FB.XFBML.parse();
                }
                FBConnect.getUser();
              }else{
                Display.fetch("placeHolder.html", "game");
            }
        });
    },
    invite : function(){
        var appUrl = "http://apps.facebook.com/" + FBConnect.url();
        FB.api(
            {  method: 'friends.getAppUsers' },
            function(response) {
                var ids = response;
                FB.ui({
                    method:'fbml.dialog',
                    width: '550px',
                    fbml:'<fb:Fbml>   ' +
                                '<fb:request-form action="' + window.location + '"' + ' method="GET" invite="true" ' +
                                                  'type="Studio SA 2010" content="I am predicting the results of the world cup 2010 on Studio S.A. Predict with me ' +
                                                  '<fb:req-choice url=\'' + appUrl + '\' ' +  'label=\'Play\' />" >' +
                                '<div style="width : 80%; margin:auto;padding:auto;"> ' +
                                  '<fb:multi-friend-selector showborder="false"' + 'exclude_ids="' + ids + '"' + 'actiontext="Invite your friends to play Studio South Africa 2010 with you" cols="3" rows="2"/>' +         
                                '<div/> ' +
                                '</fb:request-form>' +
                          '</fb:Fbml> '
                  });
            }
        );
    },
    connect : function() {
        FB.login(function(response) {
            if (response.session) {
                if (response.perms) {
                  // user is logged in and granted some permissions.
                  // perms is a comma separated list of granted permissions
                  window.location = window.location;
                } else {
                }
            } else {
                alert("You have to log in to facebook to play the game");
            }
        }, {perms:'read_stream,publish_stream'});
    },  
    eventSubscribe : function() {
        FB.Event.subscribe('auth.sessionChange', function(response) {
          if (response.session) {
          } else {
          }
        });
    },
    bookmark : function(){
        FB.ui({ method: 'bookmark.add' });
    },
    publish : function(match, prediction) {
        var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
        if (prediction)
        {
          var title = match.teamA.name_ar + ' ضد ' + match.teamB.name_ar + " " +  prediction.goals_a + "-" + prediction.goals_b
          var desc = 'توقعت نتيجة' +
                     prediction.goals_a + "-" + prediction.goals_b +
                     ' لمباراة '+
                     match.teamA.name_ar + ' ضد ' + match.teamB.name_ar  +
' .هل لديك توقع أفضل؟'
          FB.ui(
                {
                  method: 'stream.publish',
                  display: 'dialog',
                  message: '',
                  attachment: {
                    name : title,
                  	'media': [{ 'type': 'image', 
                  	            'src': 'http://173.192.39.215/images/background/logo.png',
                  	            'href': loc }],

                    description: (desc)
                      
                  },
                  action_links: [ {text:'توقع أنت', href: loc } ],
                  user_message_prompt: 'تحدي أصدقائك لتوقع نتيجة المباراة'
                },
                function(response) {
                  if (response && response.post_id) {
                  } else {
                  }
                }
          );
        }
    },
    publishScore : function(match, prediction) {
        var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
        if (prediction && prediction.score>=0)
        {
          var title = match.teamA.name_ar + ' ضد ' + match.teamB.name_ar;
          var desc = ' جمعت' +  prediction.score + ' نقطة من مباراة '
           + match.teamA.name_ar + ' ضد ' + match.teamB.name_ar +
                ' .كم جمعت؟'
          FB.ui(
                {
                  display: 'popup',
                  method: 'stream.publish',
                  message: '',
                  attachment: {
                    name : title,
                  	'media': [{ 'type': 'image', 
                  	            'src': 'http://173.192.39.215/images/background/logo.png',
                  	            'href': loc }],
                    description: (desc)
                  },
                  action_links: [ {text:'توقع أنت', href: loc } ],
                  user_message_prompt: 'أخبر أصدقائك بنتيجة توقعك و تحداهم للتوقعات القادمة'
                }
          );
        }
    }

}

