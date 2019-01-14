## aframe-websocket-component

[![Version](http://img.shields.io/npm/v/aframe-websocket-component.svg?style=flat-square)](https://npmjs.org/package/aframe-websocket-component)
[![License](http://img.shields.io/npm/l/aframe-websocket-component.svg?style=flat-square)](https://npmjs.org/package/aframe-websocket-component)

An implentation of Socket.io to set an entities attributes

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-websocket-component/dist/aframe-websocket-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity websocket="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-websocket-component
```

Then require and use.

```js
require('aframe');
require('aframe-websocket-component');
```
