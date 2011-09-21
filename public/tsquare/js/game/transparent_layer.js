var TransparentLayer = Class.create({
  
  background: null,
  container: null,
  
  // <div style="position: absolute; left: 0px; top: 0px; height: 340px; width: 950px; opacity: 0.5; background-color: rgb(255, 240, 68);"></div>
  
  initialize: function(background){
    this.background = background;
    this.container = $(document.createElement('div'));
    $(this.background).insert({after:this.container});
    $(this.container).setStyle({
      position: "absolute",
      left: "0px",
      top: "0px",
      height: "340px",
      width: "950px",
      opacity: "0.5",
      backgroundColor: "rgb(255,240,68)"
    });
  },
  
  setBackgroundColor: function(color){
    this.container.style.backgroundColor = color;
  }
  
});