/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * websocket component for A-Frame.
 */
AFRAME.registerComponent('websocket', {
  schema: {
    userType: {
      type: 'string',
      default: 'client'
    }

  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: true,
  //
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function(evt) {
    this.sendList = {};
    this.deltaT = 0;
    this.socket = io.connect('http://localhost');
    this.rotationLock = true;
    if (this.data.userType == "client") {
      this.socket.on('updateComponents', (attributeList) => {
        if (this.data.userType == "client") {
          for (i in attributeList) {
            var currentAttribute = attributeList[i];
            this.el.setAttribute(i, currentAttribute);
          }
        }
      })
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function(oldData) {
    console.log(oldData);
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function() {},

  /**
   * Called on each scene tick.
   */
  tick: function(t) {
    if (this.data.userType == "controller") {
      if (t > this.deltaT + 10) {
        this.deltaT = t;
        var needsChange = false;

        for (i of this.el.attributes) {
          if (i.name != this.attrName && i.name != "id") {
            var currentAttributeProps = this.el.getAttribute(i.name);
            this.sendList[i.name] = this.sendList[i.name] || {}
            for (j in currentAttributeProps) {
              if (this.sendList[i.name][j] !== currentAttributeProps[j]) {
                if (typeof currentAttributeProps[j] != "function") {
                  this.sendList[i.name][j] = currentAttributeProps[j];
                }
                needsChange = true;
              }
            }
          }
        }
        if (needsChange) {
          this.socket.emit('controlComponent', this.sendList);
          for (i in this.sendList) {
            var currentVar = this.sendList[i];
          }
        }
      }
    }

  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function() {},

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function() {}
});

AFRAME.registerComponent('drag-rotate-component', {
  schema: {
    speed: {
      default: 1
    }
  },
  init: function() {
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this));
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this));
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this));
  },
  OnDocumentMouseDown: function(event) {
    this.ifMouseDown = true;
    this.x_cord = event.clientX;
    this.y_cord = event.clientY;
  },
  OnDocumentMouseUp: function() {
    this.ifMouseDown = false;
  },
  OnDocumentMouseMove: function(event) {
    if (this.ifMouseDown) {
      var temp_x = event.clientX - this.x_cord;
      var temp_y = event.clientY - this.y_cord;
      if (Math.abs(temp_y) < Math.abs(temp_x)) {
        this.el.object3D.rotateY(temp_x * this.data.speed / 1000);
      } else {
        this.el.object3D.rotateX(temp_y * this.data.speed / 1000);
      }
      this.x_cord = event.clientX;
      this.y_cord = event.clientY;
    }
  }
});
