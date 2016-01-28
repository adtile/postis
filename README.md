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

## Release

New releases are prepared in master after merging the PRs. Please include a meaningful changelog entry in PR.

Write a new `CHANGELOG.md` entry before running built-in [npm version](https://docs.npmjs.com/cli/version) bump and add the change to next commit.

```
npm version <major | minor | patch>
git push --tags
```

`npm version` should include added changelog entry in the commit. Remember to push changes.
