# Postis

Postis lightway is a wrapper around the PostMessage API

## Installation

```bash
$ npm install --save postis
```

## Usage

Main HTML which contains iframe:

```javascript
var postis = require("postis");
var targetWindow = document.querySelectorAll("iframe")[0].contentWindow;

var channel = postis({
  window: targetWindow,
  scope: "scope-for-message-changing-to-avoid-overlapping"
});

channel.ready(function() {
  channel.listen("remoteMessageFromIframe", function(remoteMessage) {
    console.log("remoteMessageFromIframe:", remoteMessage);
  });

  channel.send({
    method: "remoteMessageFromMainHTML",
    params: { assome: "messsage",
              from: "Parent window"}
  });
});
```

In Embedded iframe:

```javascript
var postis = require("postis");
var targetWindow = window.parent;

var channel = postis({
  window: targetWindow,
  scope: "scope-for-message-changing-to-avoid-overlapping"
});

channel.ready(function() {
  channel.listen("remoteMessageFromMainHTML", function(remoteMessage) {
    console.log("remoteMessageFromMainHTML:", remoteMessage);
  });

  channel.send({
    method: "remoteMessageFromIframe",
    params: { assome: "messsage",
              from: "iframe"}
  });
});
```
