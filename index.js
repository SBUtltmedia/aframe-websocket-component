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
    this.deltaT = 0;
    this.sendToTick;
    this.attributeList = {};
    this.socket = io.connect('http://localhost');
    console.log(this.el.components);
    if (this.data.userType == "client") {
      this.socket.on('updateComponents', (attributeList) => {

          this.sendToTick = attributeList;

      })
  }

},

/**
 * Called when component is attached and when component data changes.
 * Generally modifies the entity based on the data.
 */
update: function(oldData) {
  console.log("websocket is updating");
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
    if (t > this.deltaT + 1000) {
      this.deltaT = t;
      var needsChange = false;
      var sendList = {};
      for (i of this.el.attributes) {
        //var propArr=[];
        if (i.name != this.attrName && i.name != "id") {
          //var attributeProperties = {};
          var currentAttributeProps = this.el.getAttribute(i.name);
          for (j in currentAttributeProps) {
            this.attributeList[i.name] = this.attributeList[i.name] || {};
            if (Object.values(this.attributeList).length == 0 || this.attributeList[i.name][j] != currentAttributeProps[j]) {
              sendList[i.name] = sendList[i.name] || {};
              sendList[i.name][j] = currentAttributeProps[j];
              if (i.name == 'rotation') {
                if (sendList["rotation"].x != undefined && sendList["rotation"].y != undefined) {
                  needsChange = true;
                }
              } else {
                needsChange = true;
              }
            }
          }
        }
      }
      // var sendList = {"rotation":{}};
      // sendList["rotation"].x= this.el.getAttribute("rotation").x;
      // sendList["rotation"].y= this.el.getAttribute("rotation").y;
      // sendList["rotation"].z= this.el.getAttribute("rotation").z;
      if (needsChange) {
        this.socket.emit('controlComponent', sendList);

        for (i in sendList) {
          var currentVar = sendList[i];
          this.attributeList[i] = sendList[i];
        }
        // this.attributeList = JSON.parse(JSON.stringify(sendList))
        //this.attributeList = Object.assign(sendList, this.attributeList);
      }
    }


    // if(!(i.nodeName in this.attributeList) || this.attributeList[i.nodeName] != i.nodeValue){
    //   sendList[i.nodeName] = i.nodeValue;
    //   //console.log(this.el.attributes)
    //   // if(i.name == 'glmol'){
    //   //   for(j in i){
    //   //     console.log(j);
    //   //   }
    //   // }
    //   // console.log((this.attributeList[i.name]) === this.el.getAttribute(i.name))
    //   //
    //   // this.attributeList[i.name] = this.el.getAttribute(i.name)
    //   // console.log(this.el.getAttribute(i.name));
    // }
  }
  // if(Object.keys(sendList).length != 0){
  //   for(i of Object.keys(sendList)){
  //     //console.log(i, sendList[i]);
  //     this.attributeList[i] = sendList[i];
  //     //Object.assign({},this.attributeList, {i: "value3"});
  //     console.log(this.attributeList)
  //     //this.el.glmol.setAttribute(i, this.attributeList[i]);
  //   }
  //   //this.el.glmol.update();
  // }
  //console.log(this.attributeList);


  if (this.data.userType == "client") {

    for (i in this.sendToTick) {

      var currentAttribute = this.sendToTick[i];
      if (i == "rotation") {
      //  console.log(currentAttribute)
        this.el.setAttribute(i, currentAttribute);
        //console.log(this.el.getAttribute(i));
        // console.log(i,currentAttribute)
      } else {
        // for (j in currentAttribute) {
        //   var currentProperty = currentAttribute[j]
        //   this.el.setAttribute(i, j, currentProperty)
        // }
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

// AFRAME.registerComponent('rotation-reader', {
//   tick: function(t) {
//     if (this.data.userType == "controller") {
//       if (t > this.deltaT + 900) {
//         var rotation = this.el.getAttribute('rotation');
//         console.log("I ran")
//         if (this.attributeList['rotation'].x != rotation.x || this.attributeList['rotation'].y != rotation.y){
//           this.attributeList['rotation'].x = rotation.x;
//           this.attributeList['rotation'].x = rotation.x;
//           this.socket.emit('controlComponent', rotation);
//         }
//       }
//     }
//   }
// });
