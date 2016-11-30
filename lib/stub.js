var Behavior = function() {
	this.code = 200;
	this.body = '';
	this.delay = 0;
};

Behavior.prototype.isDelayed = function() {
	return this.delay !== 0;
};

var Stub = function(method, path) {
	this.method = method;
	this.path = path;
	this.behaviors = {
		"default": new Behavior()
	};
	this.currentBehavior = "default";
};

Stub.prototype.onCall = function(which) {
	if(which !== 0) {
		if(!this.behaviors.hasOwnProperty(which)) {
			this.behaviors[which] = new Behavior();
		}
		this.currentBehavior = which;
	} else {
		this.currentBehavior = "default";
	}
	return this;
};

Stub.prototype.onFirstCall = function() {
	return this.onCall(1);
};

Stub.prototype.onSecondCall = function() {
	return this.onCall(2);
};

Stub.prototype.onThirdCall = function() {
	return this.onCall(3);
};

Stub.prototype.onDefaultCall = function() {
	return this.onCall(0);
};

Stub.prototype.responseBody = function(body) {
	this.behaviors[this.currentBehavior].body = body;
	return this;
};

Stub.prototype.responseCode = function(code) {
	this.behaviors[this.currentBehavior].code = code;
	return this;
};

Stub.prototype.responses = function() {
	return this.behaviors;
};

module.exports = {
	request: {
		get: function(path) {
			return new Stub('GET', path);
		},
		post: function(path) {
			return new Stub('POST', path);
		},
		put: function(path) {
			return new Stub('PUT', path);
		},
		"delete": function(path) {
			return new Stub('DELETE', path);
		}
	}
};