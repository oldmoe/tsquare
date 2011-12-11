var ClashGroup = Class.create(ClashEnemy, {
    elements: null,
    elementsPerColumn: 5,
    elementHeight: 20,
    elementWidth: 40,
    distaceBetweenUnits: 10,
    initialize: function(scene, elements, handler, direction){
        this.scene = scene
        this.handler = handler
        this.elements = elements
        this.coords = this.elements[0].coords
        this.direction = direction
        this.scene.push(this)
    },
    
    gatherRectangle: function(x){
        new CrowdAction(this.scene).gatherRectangle(this.elements, x)
    },
    
    tick: function($super){
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].tick()
        }
    },
    
    gatherTriangle: function(x){
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].fixedPlace = false;
        }
        new CrowdAction(this.scene).gatherTriangle(this.elements, x, this.direction)
    },
    
    fire: function(state){
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].fire(state)
        }
    },
    
    moveToTarget: function(target, callback, speed){
        // modifying the target point for each element relative to the first element to keep the elements destribution as it is
        for (var i = 0; i < this.elements[0].length; i++) {c
            var targetModified = {
                x: target.x + this.elements[i].coords.x - this.elements[0].coords.x,
                y: target.y + this.elements[i].coords.y - this.elements[0].coords.y
            }
            this.elements[i].moveToTarget(targetModified, callback, speed)
        }
    },
    
    clashPush: function(){
        this.move(-this.direction * this.pushSpeed, 0)
        this.target.move(-this.direction * this.pushSpeed, 0)
    },
    
    move: function(dx, dy){
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].move(dx, dy)
        }
    },
    
    startClash: function(target){
        this.target = target
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].startClash(target.elements[0]);
        }
    }
})
