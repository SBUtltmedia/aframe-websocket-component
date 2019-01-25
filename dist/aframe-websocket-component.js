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
    this.sendList = {};
    this.deltaT = 0;
    // this.attributeList = {};
    this.socket = io.connect('http://localhost');

    if (this.data.userType == "client") {
      this.socket.on('updateComponents', (attributeList) => {

        if (this.data.userType == "client") {

          for (i in attributeList) {
            var currentAttribute = attributeList[i];

            // var currentRotation = this.el.getAttribute('rotation');
            // if (i == "rotation") {
            //   if (currentRotation != currentAttribute) {
            //     this.el.setAttribute(i, currentAttribute);
            //   }
            // } else {


            // currentAttribute = currentAttribute || {};
            //     console.log(i,j, currentAttribute[j])
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
          console.log(i)
          if (i.name != this.attrName && i.name != "id") {
            //var attributeProperties = {};
            var currentAttributeProps = this.el.getAttribute(i.name);
            this.sendList[i.name] = this.sendList[i.name] || {}

            for (j in currentAttributeProps) {

              if (this.sendList[i.name][j] !== currentAttributeProps[j]) {
                if (typeof currentAttributeProps[j] != "function") {
                  this.sendList[i.name][j] = currentAttributeProps[j];
                }
                // if (i.name == 'rotation') {
                //   if (sendList["rotation"].x != undefined && sendList["rotation"].y != undefined) {
                //     needsChange = true;
                //   }
                // } else {
                needsChange = true;
                // }
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