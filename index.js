/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * websocket component for A-Frame.
 */
AFRAME.registerComponent('websocket', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,
//
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function (evt) {

    var socket = io.connect('http://localhost');
    socket.on('updateComponent',  (data) =>{
      console.log(data);
      this.el.setAttribute('glmol', data);
      console.log(this.el.getAttribute('glmol'))
    });


  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
