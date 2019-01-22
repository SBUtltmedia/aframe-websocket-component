/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
    this.attributeList = {};
    this.socket = io.connect('http://localhost');

    if (this.data.userType == "client") {
      this.socket.on('updateComponents', (attributeList) => {
        console.log("update", attributeList);
        for (i in attributeList) {
          var currentAttribute = attributeList[i];
          if (i != "rotation" && i != "glmol" && i != "position") {
            this.el.setAttribute('glmol', i, currentAttribute);
          }
          // if(function(){
          //   for(j in this.el.getAttribute('glmol').components){
          //     if(i == j.name)
          //       return true;
          //   }
          //   return false;
          // })
          else {
            this.el.setAttribute(i, currentAttribute);
          }

          //console.log(this.el);
          // if(i == 'rotation'){
          //   this.el.rotation.set(
          //     THREE.Math.degToRad(attributeList[i].x),
          //     THREE.Math.degToRad(attributeList[i].y),
          //     THREE.Math.degToRad(attributeList[i].z)
          //   );
          // }
          // for(j in currentAttribute){
          //   console.log(i, attributeList[i], j, currentAttribute[j]);
          //
          // }
          //document.querySelector('a-scene').flushToDOM(true);
        }
        // for (i in componentList) {
        //   this.el.setAttribute(i, componentList[i]);
        // }
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
        console.log("Time: ", Math.floor(t) + "ms");
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


/***/ })
/******/ ]);