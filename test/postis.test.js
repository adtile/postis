import Postis from "../src/index";
import $ from "jquery";
import {
  appendSourcedFrame,
  appendSourcelessFrame,
  buildBridgeCodeSourced,
  buildBridgeCodeSourceless
} from "./helper"

describe("Postis", function() {
  this.timeout(15000);
  it("ensure that sourceless iframe is cabable to call fn from parent", (done) => {
    window.testCall = () => {
      assert.ok("calling parent from frame", "works!");
      done();
    };
    appendSourcelessFrame("window.parent.testCall");
  });

  function assertEchoMessage(message) {
    assert.deepPropertyVal(message, "echo.from", "Parent window");
    assert.deepPropertyVal(message, "echo.awesome", "message");
    assert.deepPropertyVal(message, "from", "child iframe");
  }

  it("sourceless iframe communications", (done) => {
    var iframe = appendSourcelessFrame(buildBridgeCodeSourceless);
    var channel = Postis({
      type: "sourceless",
      window: iframe.contentWindow,
      scope: "scope-for-message-changing-to-avoid-overlapping"
    });

    channel.ready(function() {
      assert.ok("bridge between iframe and parent", "works!");
      channel.listen("remoteMessageFromChild", function(remoteMessage) {
        assertEchoMessage(remoteMessage);
        done();
      });

      channel.send({
        method: "remoteMessageFromParent",
        params: {
          awesome: "message",
          from: "Parent window"
        }
      });
    });
  });

  it("sourced iframe communications", (done) => {
    var iframe = appendSourcedFrame(buildBridgeCodeSourced);
    var channel = Postis({
      window: iframe.contentWindow,
      scope: "scope-for-message-changing-to-avoid-overlapping"
    });

    channel.ready(function() {
      assert.ok("bridge between iframe and parent", "works!");
      channel.listen("remoteMessageFromChild", function(remoteMessage) {
        assertEchoMessage(remoteMessage);
        done();
      });

      channel.send({
        method: "remoteMessageFromParent",
        params: {
          awesome: "message",
          from: "Parent window"
        }
      });
    });
  });
});
