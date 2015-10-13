function Posty(options) {
  var scope = options.scope;
  var targetWindow = options.window;
  var listeners = {};
  var sendBuffer = [];
  var listenBuffer = {};
  var ready = false;
  var readyMethod = "__ready__";

  window.addEventListener("message", function (event) {
    var data = JSON.parse(event.data);
    var params = [].concat(data.params);
    if (data.posty && data.scope === scope) {
      var listenersForMethod = listeners[data.method];
      if (listenersForMethod) {
        for (var i = 0; i < listenersForMethod.length; i++) {
          listenersForMethod[i].apply(null, params);
        }
      } else {
        listenBuffer[data.method] = listenBuffer[data.method] || [];
        listenBuffer[data.method].push(params);
      }
    }
  }, false);

  var posty = {
    listen: function (method, callback) {
      listeners[method] = listeners[method] || [];
      listeners[method].push(callback);

      var listenBufferForMethod = listenBuffer[method];
      if (listenBufferForMethod) {
        var listenersForMethod = listeners[method];
        for (var i = 0; i < listenersForMethod.length; i++) {
          for (var j = 0; j < listenBufferForMethod.length; j++) {
            listenersForMethod[i].apply(null, listenBufferForMethod[j]);
          }
        }
      }
      delete listenBuffer[method];
    },

    send: function (opts) {
      var method = opts.method;

      if (ready || opts.method === readyMethod) {
        targetWindow.postMessage(JSON.stringify({
          posty: true,
          scope: scope,
          method: method,
          params: opts.params
        }), "*");
      } else {
        sendBuffer.push(opts);
      }
    },

    ready: function (callback) {
      if (ready) {
        callback();
      } else {
        setTimeout(function () { posty.ready(callback); }, 50);
      }
    }
  };

  var readyCheckID = +new Date() + Math.random() + "";

  var readynessCheck = setInterval(function () {
    posty.send({
      method: readyMethod,
      params: readyCheckID
    });
  }, 50);

  posty.listen(readyMethod, function (id) {
    if (id === readyCheckID) {
      clearInterval(readynessCheck);
      ready = true;

      for (var i = 0; i < sendBuffer.length; i++) {
        posty.send(sendBuffer[i]);
      }
      sendBuffer = [];
    } else {
      posty.send({
        method: readyMethod,
        params: id
      });
    }
  });

  return posty;
}

module.exports = Posty;