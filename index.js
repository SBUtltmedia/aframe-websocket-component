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
    var room = prompt("Please enter a room", "Lobby");
    //var el = document.querySelector('#glmolId');
    this.data.roomId=room;
    // this.el.setAttribute('websocket', data);


    this.sendList = {};
    this.deltaT = 0;
    this.socket = io();

    if(location.pathname == "/controller"){
      // this.el.setAttribute('glmol', 'userType', 'controller');
      this.data.userType = "controller";
    }
    if (this.data.userType == "client") {

      this.socket.on('updateComponents', (attributeList) => {
        for (i in attributeList) {
          var currentAttribute = attributeList[i];
          this.el.setAttribute(i, currentAttribute);
        }
      });
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function(oldData) {
    this.socket.emit("switchRoom", this.data);
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
        var changedAttributes = {};
        for (i of this.el.attributes) {
          if (i.name != "id") {
            var currentAttributeProps = this.el.getAttribute(i.name);
            this.sendList[i.name] = this.sendList[i.name] || {}
            for (j in currentAttributeProps) {
              if (this.sendList[i.name][j] !== currentAttributeProps[j]) {
                if (typeof currentAttributeProps[j] != "function") {
                  this.sendList[i.name][j] = currentAttributeProps[j];
                  changedAttributes[i.name] = currentAttributeProps;
                  needsChange = true;
                }
              }
            }
          }
        }
        if (needsChange) {
          console.log(changedAttributes);
          this.socket.emit('controlComponent', changedAttributes);
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
