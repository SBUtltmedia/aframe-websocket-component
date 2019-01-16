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
      init: function(evt) {

        this.attributeList = {};
        this.socket = io.connect('http://localhost');

        if (this.data.type == "client") {
          this.socket.on('updateComponents', (componentList) => {
            for (i in componentList) {
              this.el.setAttributes(i, componentList[i]);
            }
          })
        }

      },

        /**
         * Called when component is attached and when component data changes.
         * Generally modifies the entity based on the data.
         */
        update: function(oldData) {},

          /**
           * Called when a component is removed (e.g., via removeAttribute).
           * Generally undoes all modifications to the entity.
           */
          remove: function() {},

          /**
           * Called on each scene tick.
           */
          tick: function(t) {

            for (i of this.el.attributes) {

              if (i.name != this.attrName) {
                 console.log(!(this.attributeList[i.name]) === this.el.getAttribute(i.name))
                if (!(this.attributeList[i.name]) === this.el.getAttribute(i.name)) {
                  console.log("s")
                  this.attributeList[i.name] = this.el.getAttribute(i.name)
                  console.log(this.el.getAttribute(i.name));
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
