var TemplatesManager = Class.create({
  initialize : function(callback){
    var templates = ['templates.html', 'marketplace.html', 'missions.html', 'notifications.html'];
    var templatesRootNode = $(document.createElement('div'));
    templatesRootNode.innerHTML = '';
    new Loader().load([{ htmls : templates,
                      path : 'templates/', store: 'templates' }], 
                      {
                        onFinish : function(){
                          templates.each(function(templateName){
                            templatesRootNode.innerHTML += Loader.htmls.templates[templateName]['html'];
                          });
                          templatesRootNode.select('textarea').each(function(node){
                            node.setAttribute('id', node.getAttribute('id') + "-template");
                          });
                          if(callback) callback();
                        }
                      });
    $(document.body.appendChild(templatesRootNode)).hide();
  },

  load : function(name, params){
    return TrimPath.processDOMTemplate(name + "-template", params);
  }
});
