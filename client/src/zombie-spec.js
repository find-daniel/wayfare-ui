const Browser = require('zombie');

// We're going to make requests to http://localhost:1337
Browser.localhost('localhost', 1337);
const browser = new Browser();


describe('user can load home page', function () {
  before(function(done){
    browser.visit('/', done)
  })

  it('should render home page', function(done){
    browser.assert.text('title', 'Wayfare');
    browser.assert.text('h1', 'Inside Home');
    browser.assert.success();
    done();
  })

})

describe('user can load login page', function () {
  before(function(done){
    browser.visit('/login', done)
  })

  it('should render login page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user can load signup page', function () {
  before(function(done){
    browser.visit('/login', done)
  })

  it('should render signup page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user can load create-listing page', function () {
  before(function(done){
    browser.visit('/user/create-listing', done)
  })

  it('should render login page', function(done){
    browser.assert.success();
    done();
  })
})

describe('user can load create-listing page', function () {
  before(function(done){
    browser.visit('/user/create-listing', done)
  })

  it('should render login page', function(done){
    browser.assert.success();
    done();
  })

  // it('should refuse empty submissions', function(done) {
  //   browser.pressButton('Create').then(function() {
  //     browser.assert.text('div.alert', 'Please fill out the fields')
  //   }).then(done, done);
  // });

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


//     it('should not return a status of 200', function(done) {
//       browser.assert.status(200);
//       done()
//     });

//   });
// });