var UIManager = Class.create({
  reset: function() {
  	this.resetRequest = true;
  	this.display();
  	delete this.resetRequest;
  }
})