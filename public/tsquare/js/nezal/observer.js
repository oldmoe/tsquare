var Observer = Class.create({
    
  observers: null,
  
  initialize: function(){
      this.observers = {};
  },
  
  /* Scope : is an optional target object to fire the event on, if not supplied, it will be fired on "this"
   * If the callback "func" returned false the observer will be removed
   */
  observe : function(event, func, scope){
    if(!this.observers[event]) this.observers[event] = []
    var observer = [func, scope]
    this.observers[event].push(observer)
    return observer
  },
    
  fire : function(event, params){
    if(this.observers[event]){
      var observers = Nezal.clone_obj(this.observers[event]);
      var toRemove = []
      for(var i=0;i<observers.length;i++){
        var scope = observers[i][1] || this
        if(observers[i][0].apply(scope, params) === false){
          toRemove.push(observers[i])
        }
      }
      toRemove.each(function(observer){
        this.observers.splice(this.observers.indexOf(observer),1)
      })
    }
  }
    
});