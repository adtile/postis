import $ from "jquery";

function buildFrame(src, onLoad = ()=>{}, onError = ()=>{}) {
  var frame;
  frame = $("<iframe>", {
    src: src,
    id:  "testing-frame",
    frameborder: 2,
    scrolling: "no",
    onerror: (error) => {
      onError(error, frame);
    },
    onload: () => {
      onLoad(null, frame);
    }
  });
  frame.appendTo($("body"));

  return frame[0];
}

export function appendSourcelessFrame(code, callback) {
  let src = "javascript:'<html><head></head><body></body></html>'";
  var iframe = buildFrame(src);
  iframe.contentDocument.open("text/html", "replace");
  iframe.contentDocument.write("<html><head><" + "sc" + "ript type=\"text/javascript\" src=\"http://localhost:8080/dist/postis.js\"><" + "/s" + "cri" + "pt></head><body><" + "sc" + "ript type=\"text/javascript\">!(" + code + ")();<" + "/s" + "cri" + "pt></body></html>");
  iframe.contentDocument.close();
  return iframe;
}

export function appendSourcedFrame(code, onload, onerror) {
  let uri = "http://localhost:8080/test/resources/page.html?inject=" + btoa("!(" + code.toString() + ")();");
  return buildFrame(uri, onload, onerror);
}

export function buildBridgeCodeSourced() {
  var targetWindow = window.parent;
  var channel = window.Postis({
    type: "sourced",
    window: targetWindow,
    scope: "scope-for-message-changing-to-avoid-overlapping"
  });
  channel.ready(function() {
    channel.listen("remoteMessageFromParent", function(remoteMessage) {
      channel.send({
        method: "remoteMessageFromChild",
        params: {
          echo: remoteMessage,
          from: "child iframe"
        }
      });
    });
  });
};

export function buildBridgeCodeSourceless() {
  var targetWindow = window.parent;
  var channel = window.Postis({
    type: "sourceless",
    window: targetWindow,
    scope: "scope-for-message-changing-to-avoid-overlapping"
  });
  channel.ready(function() {
    channel.listen("remoteMessageFromParent", function(remoteMessage) {
      channel.send({
        method: "remoteMessageFromChild",
        params: {
          echo: remoteMessage,
          from: "child iframe"
        }
      });
    });
  });
};
