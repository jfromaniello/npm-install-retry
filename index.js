require('colors');
var spawn    = require('child_process').spawn;

module.exports = function (command, args, options, callback) {
  var times = 1;
  function run () {
    var runCmd = command + ' ' + args.join(' ');
    console.log(('attempt ' + times).bold.green + ': ' + runCmd);

    process.env.npm_config_color = 0;

    var attempt = spawn(command, args);
    var stdout = [], stderr = [];

    attempt.stdout.on('data', function (data) {
      stdout.push(data);
    });

    attempt.stderr.on('data', function(data) {
      stderr.push(data);
    });

    attempt.on('error', function(err) {
      return callback(err);
    });

    attempt.on('close', function (exitCode) {
      stdout = Buffer.concat(stdout).toString();
      stderr = Buffer.concat(stderr).toString();

      if (stdout.match(/npm ERR\! cb\(\) never called\!/ig) || stderr.match(/npm ERR\! cb\(\) never called\!/ig)) {
        if (times >= options.attempts) {
          return callback(new Error('too many attempts'));
        }
        times++;
        return setTimeout(run, options.wait);
      }

      return callback(null, {times: times, stdout: stdout, exitCode: exitCode});
    });

    attempt.stdout.pipe(process.stdout);
    attempt.stderr.pipe(process.stderr);
  }
  run();
};