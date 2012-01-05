var Message = Class.create({
	
	tile : null,
	containerId: 'discussionDialog',
	levelEditor: null,
	
	initialize: function(levelEditor){
	  
		this.levelEditor = levelEditor;

		var self = this
		
		$(this.containerId).select('input[class=add]')[0].observe('click', function(){
			self.add();
		});

		$(this.containerId).select('input[class=reset]')[0].observe('click', function(){
			self.reset();
		});

		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

	},

	open: function(tile){
		this.tile = tile;
		this.updateDialogData();
		$('discussionDialog').style.display = 'block';
	},

	close: function(){
		$('discussionDialog').style.display = 'none';
	},
	
	add: function(){
		var select = $(this.containerId).select('select[id=gameElementsList]')[0];
		var option = select.options[select.selectedIndex];
		
		var obj = {};
		var message = $(this.containerId).select('textarea[class=messageText]')[0].value.strip();
		var message_ar = $(this.containerId).select('textarea[class=messageText]')[1].value.strip();
		if(message == "" || message == null || message_ar == "" || message_ar == null){
		  alert("Can't add empty message");
		  return;
		}
		obj.message = message;
		obj.message_ar = message_ar;
		obj.person = option.text;
		
		// obj.tile = this.levelEditor.grid.lanes[option.getAttribute('lane')].tiles[option.getAttribute('x')];
		//this is the order of the object inside the tile
		// obj.object = obj.tile.objects[option.getAttribute('index')];
		
		this.tile.messages.messages.push(obj);
		
		$(this.containerId).select('textarea[class=messageText]')[0].value = '';
		$(this.containerId).select('textarea[class=messageText]')[1].value = '';
		this.updateMessagesList();
	},

	reset: function(){
		this.tile.messages.messages = [];
		this.updateMessagesList();
	},
	
	updateDialogData: function() {
        //update objects dropdwon list
		var select = $(this.containerId).select('select[id=gameElementsList]')[0];
		select.update("");

        for (var k=0; k<this.tile.objects.length;k++) {
            var obj = this.tile.objects[k];
            var x = this.tile.getPosition();
            var lane = this.tile.parent.getPosition();
            var a = new Element('option', {value:obj.name, x:x, lane:lane, index:k});
            // a.update(obj.name+'('+Number(lane+1)+','+Number(x+1)+','+Number(k+1)+')');
            a.update(obj.name);
            select.appendChild(a);
        }

        var a = new Element('option', {value:""});
        a.update("crowds");
        select.appendChild(a);
      
        //update existing list
        this.updateMessagesList();
	},
	
	updateMessagesList: function() {
		var messagesList = $(this.containerId).select('ol[id=messagesList]')[0];
		messagesList.update("");
		var messagesList_ar = $(this.containerId).select('ol[id=messagesList_ar]')[0];
		messagesList_ar.update("");
		for (var i=0; i<this.tile.messages.messages.length; i++) {
			var obj = this.tile.messages.messages[i];
			var a = new Element('li');
			messagesList.appendChild(a);
			a.update(obj.person + ": " + obj.message + " ");
            var link = new Element('a')
            link.innerHTML = 'x'
            a.appendChild(link)
            this.addLinkObserver(link,i)
            
			var a_ar = new Element('li');
			messagesList_ar.appendChild(a_ar);
			a_ar.update(obj.person + ": " + obj.message_ar + " ");
            var link_ar = new Element('a')
            link_ar.innerHTML = 'x'
            a_ar.appendChild(link_ar)
            this.addLinkObserver(link_ar,i)
		}
		
		if (this.tile.messages.length) {
			this.tile.mark();
		} else {
			this.tile.unmark();
		}
	},
  
  addLinkObserver : function(link, index){
    var self = this
    link.style.cursor = "pointer"
    link.style.color = "blue"
    link.observe('click', function(){
      self.tile.messages.messages.splice(index,1)
      self.updateMessagesList()
    })
  }
});
