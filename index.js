/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * websocket component for A-Frame
 */
AFRAME.registerComponent('websocket', {
  schema: {
    //Either client or controller, controller sends, client receives
    userType: {
      type: 'string',
      default: 'client'
    },
    //Controller sockets will only send data to client sockets in the
    //same room.
    roomId: {
      type: 'string',
      default: 'Lobby'
    },
    //The time between update checks, in milliseconds
    updateFrequency: {
      type: 'number',
      default: 200
    },
    //Any item in this list will neither cause nor appear in an update
    blacklist: {
      type: 'array',
      default: ['material', 'geometry']
    }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: true,
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function(evt) {
    //Create unique roomId for the DOM element
    window.socketNum = ++window.socketNum || 0;
    this.socketNum = window.socketNum;
    this.data.roomId += window.socketNum.toString();
    //this.roomId tracks the last value
    this.roomId = this.data.roomId;

    //Create local socket & set room. If the room is not the default,
    //it will immediately be changed
    this.socket = io();
    this.socket.emit("switchRoom", this.data.roomId);

    //Create necessary variables for tick
    this.sendList = {};
    this.deltaT = 0;
    if (this.data.userType == "client") {
      this.socket.on('updateComponents', (attributeList) => {
        console.log("My userType is:", this.data.userType);
        if (attributeList) {
          for (i in attributeList) {
            var currentAttribute = attributeList[i];
            if (currentAttribute != null)
              this.el.setAttribute(i, currentAttribute);
          }
        }
      });
    }
  },

  /*
  The following is the data format for our websocket data:
  Send on socket (roomId)
  {item a: {attribute1: value1, attribute2: value2, ...},
   item b: {attribute1: value1, attribute2: value2, ...},
   ...
  }
  */


  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function(oldData) {
    //If the roomId has changed, fix it and correct it on the server side
    console.log("My userType is:", this.data.userType);
    if(this.roomId != this.data.roomId){
      this.data.roomId += this.socketNum.toString();
      this.roomId = this.data.roomId;
      this.socket.emit("switchRoom", this.data.roomId);
    }
    if(this.data.userType == 'controller'){
      //this.socket.removeListener('updateComponents', ()=>{console.log("Removed.")});
      this.socket.off('updateComponents');
    }
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
    //console.log("My userType is:", this.data.userType);
    if (this.data.userType == "controller") {
      if (t > this.deltaT + this.data.updateFrequency) {  //Update at the chosen frequency
        this.deltaT = t;
        var needsChange = false;
        var changedAttributes = {};
        for (i of this.el.attributes) {
          if (i.name != "id" && i.name != "websocket" && !this.data.blacklist.includes(i.name)) {  //Don't try to change yourself or anything in the blacklist
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
