var npm_install_retry = require('../');
var expect            = require('chai').expect;

function Fail3TimesCommand() { this.times = 0; }

Fail3TimesCommand.prototype.toString = function() {
  if(this.times < 3) {
    this.times++;
    return 'echo npm ERR\\! cb\\(\\) never called\\!';
  }
  return 'echo peace and love';
};

describe('npm-install-retry', function () {
  
  it('should retry after failed', function (done) {
    npm_install_retry(new Fail3TimesCommand(), '', { wait: 0, attempts: 10 }, function (err, result) {
      if (err) return done(err);
      expect(result.times).to.eql(4);
      done();
    });
  });

  it('should fail if it fail all attempts', function (done) {
    npm_install_retry('echo npm ERR\\! cb\\(\\) never called\\!', '', { wait: 0, attempts: 10 }, function (err, result) {
      expect(err.message).to.eql('too many attempts');
      done();
    });
  });

});