var handlerWithCounter = function (stub) {
  var requestNumber = 1;
  return function (request, response) {
    var behavior = stub.responses()[requestNumber] || stub.responses()['default'];
    ++requestNumber;
    setTimeout(function () {
      response.status(behavior.code);

      behavior.json ?
        response.json(behavior.body) :
        response.send(behavior.body);

    }, behavior.delay);
  };
};

var setupHandler = function (handler, stub) {
  handler(stub.path, handlerWithCounter(stub));
};

var Wrapper = function (app) {
  this.app = app;
  this.router = app._router;
};

Wrapper.prototype.addBehaviors = function (stub) {
  var method;
  switch (stub.method) {
    case 'GET':
      method = this.app.get;
      break;
    case 'POST':
      method = this.app.post;
      break;
    case 'PUT':
      method = this.app.put;
      break;
    case 'DELETE':
      method = this.app.delete;
      break;
    default:
      throw 'Method not implemented.';
  }
  setupHandler(method.bind(this.app), stub);
};

Wrapper.prototype.reset = function () {
  this.app._router = this.router;
};

module.exports = {
  of: function (app) {
    return new Wrapper(app);
  }
};