# Express response stub

This is a simple library for stubbing HTTP responses from express server.

## Usage

Basic usage with express:

```javascript
var app = require('express')();
var wrapper = require('express-response-stub').wrapper;
var request = require('express-response-stub').request;

app.listen(9000, function() {
  console.log('server started at 9000');
});

var stub = request.get('/api/info');

stub
  .responseBody('Hello world!')
  .responseCode(200);

var appWrapper = wrapper.of(app);

appWrapper.addBehaviors(stub);
```

## Tests

To run tests execute:

```bash
$ npm install
$ npm test
```