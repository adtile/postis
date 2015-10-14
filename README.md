# Postis

Postis is a light wrapper around the PostMessage API

## Installation

```bash
$ npm install --save postis
```

## Usage

Parent HTML which contains an iframe:

```javascript
var postis = require("postis");
var targetWindow = document.querySelectorAll("iframe")[0].contentWindow;

var channel = postis({
  window: targetWindow,
  scope: "scope-for-message-changing-to-avoid-overlapping"
});

channel.ready(function() {
  channel.listen("remoteMessageFromChild", function(remoteMessage) {
    console.log("remoteMessageFromChild:", remoteMessage);
  });

  channel.send({
    method: "remoteMessageFromParent",
    params: { awesome: "messsage",
              from: "Parent window"}
  });
});
```

In embedded child iframe:

```javascript
var postis = require("postis");
var targetWindow = window.parent;

var channel = postis({
  window: targetWindow,
  scope: "scope-for-message-changing-to-avoid-overlapping"
});

channel.ready(function() {
  channel.listen("remoteMessageFromParent", function(remoteMessage) {
    console.log("remoteMessageFromParent:", remoteMessage);
  });

  channel.send({
    method: "remoteMessageFromChild",
    params: { awesome: "messsage",
              from: "child iframe"}
  });
});
```
