/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * websocket component for A-Frame
 */
AFRAME.registerComponent('websocket', {
  schema: {
    userType: {
      type: 'string',
      default: 'client'
    },
    roomId: {
      type: 'string',
      default: 'lobby'
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
    if(!window.socket){
      var room = prompt("Please enter a room", "Lobby");
      this.data.roomId = room;
      window.socket = io();
    }
    this.sendList = {};
    this.deltaT = 0;
    window.socket.emit("switchRoom", this.data.roomId );
    if (location.pathname == "/controller") {
      this.data.userType = "controller";
    }
    if (this.data.userType == "client") {
      window.socket.on('updateComponents', (attributeList) => {
        if(attributeList){
        var elAttributeList=attributeList[this.el.id]||{}
        for (i in elAttributeList) {
          var currentAttribute = elAttributeList[i];
          if(currentAttribute != null)
            this.el.setAttribute(i, currentAttribute);
        }
        }
      });
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function(oldData) {
    window.socket.emit("switchRoom", this.data);

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
      if (t > this.deltaT + 100) {
        this.deltaT = t;
        var needsChange = false;
        var changedAttributes = {};
        for (i of this.el.attributes) {
          if (i.name != "id") {

            var currentAttributeProps = this.el.getAttribute(i.name);
            this.sendList[i.name] = this.sendList[i.name] || {}
            for (j in currentAttributeProps) {
              if (typeof currentAttributeProps[j] != "function") {
                if (this.sendList[i.name][j] !== currentAttributeProps[j]) {
                  this.sendList[i.name][j] = currentAttributeProps[j];
                  changedAttributes[i.name] = currentAttributeProps;
                  needsChange = true;
                }
              }
            }
          }
        }
        if (needsChange) {
          elKey={}
          elKey[this.el.id]=changedAttributes;
          window.socket.emit('controlComponent',elKey );
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
