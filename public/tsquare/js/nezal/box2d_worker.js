function loadScripts(browser){
	PrototypeBrowser = browser
	importScripts('../base/prototype-nodom-min.js')
	importScripts('../base/box2d.js')
	importScripts('../base/box2dutils.js')
	importScripts('box2d_world.js')
}

var inWorker = true
var PrototypeBrowser = null
var world = null
self.onmessage = function(event){
	if(event.data[0] == 'bootstrap'){
		self.onmessage = null
		self.postMessage(['log',['starting']])
		loadScripts(event.data[1])
		world = new Box2dWorld()
		self.postMessage(['log',['done']])
	}
}

