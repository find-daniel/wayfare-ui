const Browser = require('zombie');

// We're going to make requests to http://localhost:1337
Browser.localhost('localhost', 1337);
const browser = new Browser();


describe('user can load our home page', function () {
  before(function(done){
    browser.visit('/', done)
  })

  it('should render our home page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user can load our login page', function () {
  before(function(done){
    browser.visit('/login', done)
  })

  it('should render our login page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user can load our signup page', function () {
  before(function(done){
    browser.visit('/login', done)
  })

  it('should render our signup page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user signs up with new local account', function() {
  before(function(done) {
    browser.visit('/signup', done);
  });

  describe('submits form', function() {
    before(function(done) {
      browser
        .fill('input[id=email]',    Math.random().toString(36).substring(3)+'@gmail.com')
        .fill('input[id=password]', 'anypassword')
        .pressButton('Submit', done);
    });

    it('should be successful signup', function(done) {
      browser.assert.status(200);
      browser.assert.success();
      done()
    });

  });
});


// will add more once front-end gets figured out


// describe('user signs in with a local account', function() {

//   before(function(done) {
//     browser.visit('/login', done);
//   });

//   describe('user logs in', function() {
//     before(function(done) {
//       browser
//         .fill('input[id=email]', Math.random().toString(36).substring(3)+'@gmail.com')
//         .fill('input[id=password]', 'anypassword')
//         .pressButton('Login', done);
//     });

//     console.log('yo', browser.resources)

//     it('should not return a status of 200', function(done) {
//       browser.assert.status(200);
//       done()
//     });

//   });
// });