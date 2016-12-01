var express = require('express');
var request = require('request');
var expect = require('chai').expect;

var requestStub = require('../lib/request');
var wrapper = require('../lib/wrapper');

describe('wrapper test suite', function () {
  var app, appWrapper, server;

  before(function () {
    app = express();
    server = app.listen(9999);
    appWrapper = wrapper.of(app);
  });

  after(function () {
    server.close();
  });

  afterEach(function () {
    appWrapper.reset();
  });

  it('should handle GET requests', function (done) {
    // given
    var stub = requestStub.get('/api/test').responseBody('test response');
    appWrapper.addBehaviors(stub);

    // when
    request.get('http://localhost:9999/api/test', function (error, response, body) {

      // then
      expect(body).to.equal('test response');
      done();
    });
  });

  it('should handle POST requests', function (done) {
    // given
    var stub = requestStub.post('/api/test').responseBody('test response');
    appWrapper.addBehaviors(stub);

    // when
    request.post('http://localhost:9999/api/test', function (error, response, body) {

      // then
      expect(body).to.equal('test response');
      done();
    });
  });

  it('should handle PUT requests', function (done) {
    // given
    var stub = requestStub.put('/api/test').responseBody('test response');
    appWrapper.addBehaviors(stub);

    // when
    request.put('http://localhost:9999/api/test', function (error, response, body) {

      // then
      expect(body).to.equal('test response');
      done();
    });
  });

  it('should handle DELETE requests', function (done) {
    // given
    var stub = requestStub.delete('/api/test').responseBody('test response');
    appWrapper.addBehaviors(stub);

    // when
    request.delete('http://localhost:9999/api/test', function (error, response, body) {

      // then
      expect(body).to.equal('test response');
      done();
    });
  });

  it('should respond to subsequent calls', function (done) {
    // given
    var stub = requestStub.get('/api/test');

    stub
      .onDefaultCall().responseBody('default response')
      .onFirstCall().responseBody('first response')
      .onSecondCall().responseBody('second response')
      .onThirdCall().responseBody('third response');

    appWrapper.addBehaviors(stub);

    // when
    request.get('http://localhost:9999/api/test', function (error, response, body) {

      // then
      expect(body).to.equal('first response');
      request.get('http://localhost:9999/api/test', function (error, response, body) {
        expect(body).to.equal('second response');
        request.get('http://localhost:9999/api/test', function (error, response, body) {
          expect(body).to.equal('third response');
          request.get('http://localhost:9999/api/test', function (error, response, body) {
            expect(body).to.equal('default response');
            done();
          });
        });
      });
    });
  });
});
