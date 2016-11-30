var expect = require('chai').expect;
var request = require('../lib/stub');

describe('stub test suite', function() {
	it('should create GET request', function() {
		// when
		var stub = request.get('/api/info');

		// then
		expect(stub.method).to.equal('GET');
		expect(stub.path).to.equal('/api/info');
	});

	it('should create POST request', function() {
		// when
		var stub = request.post('/api/info');

		// then
		expect(stub.method).to.equal('POST');
		expect(stub.path).to.equal('/api/info');
	});

	it('should create PUT request', function() {
		// when
		var stub = request.put('/api/info');

		// then
		expect(stub.method).to.equal('PUT');
		expect(stub.path).to.equal('/api/info');
	});

	it('should create DELETE request', function() {
		// when
		var stub = request.delete('/api/info');

		// then
		expect(stub.method).to.equal('DELETE');
		expect(stub.path).to.equal('/api/info');
	});

	it('should have default behavior', function() {
		// given
		var stub = request.get('/api/info');

		// when
		stub
			.responseBody('test response')
			.responseCode(200)
			.responseDelay(500);

		var responses = stub.responses();

		// then
		expect(responses["default"].code).to.equal(200);
		expect(responses["default"].body).to.equal('test response');
		expect(responses["default"].delay).to.equal(500);
	});

	it('should have multiple responses and have default response', function() {
		// given
		var stub = request.get('/api/info');

		// when
		stub
			.onCall(1)
				.responseBody('response 1')
				.responseCode(200)
			.onCall(2)
				.responseBody('response 2')
				.responseCode(404);

		var responses = stub.responses();

		// then
		expect(responses["default"].body).to.equal('');
		expect(responses["default"].code).to.equal(200);
		expect(responses[1].body).to.equal('response 1');
		expect(responses[1].code).to.equal(200);
		expect(responses[2].body).to.equal('response 2');
		expect(responses[2].code).to.equal(404);
	});

	it('should have aliases for first, second and third call', function() {
		// given
		var stub = request.get('/api/info');

		// when
		stub
			.onFirstCall()
				.responseBody('response 1')
				.responseCode(200)
			.onSecondCall()
				.responseBody('response 2')
				.responseCode(404)
			.onThirdCall()
				.responseBody('response 3')
				.responseCode(500)
			.onDefaultCall()
				.responseBody('default response');

		var responses = stub.responses();

		// then
		expect(responses["default"].body).to.equal('default response');
		expect(responses["default"].code).to.equal(200);
		expect(responses[1].body).to.equal('response 1');
		expect(responses[1].code).to.equal(200);
		expect(responses[2].body).to.equal('response 2');
		expect(responses[2].code).to.equal(404);
		expect(responses[3].body).to.equal('response 3');
		expect(responses[3].code).to.equal(500);
	});

	it('should not create new behavior on subsequent call', function() {
		// given
		var stub = request.get('/api/info');

		// when
		stub
			.onFirstCall()
			.responseCode(404);

		stub
			.onFirstCall()
			.responseBody('response 1');

		var responses = stub.responses();

		// then
		expect(responses[1].body).to.equal('response 1');
		expect(responses[1].code).to.equal(404);
	});
});