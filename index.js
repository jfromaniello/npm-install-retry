require('colors');
var exec    = require('child_process').exec;
const os = require('os');
const path = require('path');
var matchers;

var loadConfig = configFile => {
  if (configFile) {
    matchers = require(configFile).matchers;
  } else {
    try {
      matchers = require(`${os.homedir()}/.npmretry.json`).matchers;
    } catch (err) {
      matchers = require(path.join(__dirname, '/.npmretry.json')).matchers;
    }
  }
};

module.exports = function (command, args, options, callback) {
  var times = 1;
  function run () {
    var runCmd = command + ' ' + (args || []).join(' ');
    console.log(('attempt ' + times).bold.green + ': ' + runCmd);

    process.env.npm_config_color = 0;

    var attempt = exec(runCmd, function (err, stdout, stderr) {
      var match = matchers.some(function (matcher) {
        const regex = new RegExp(matcher, 'ig');
        return stdout.match(regex) || stderr.match(regex);
      });
      if (match) {
        if (times >= options.attempts) {
          return callback(new Error('too many attempts'));
        }
        times++;
        return setTimeout(run, options.wait);
      }
      return callback(null, {times: times, stdout: stdout, exitCode: (err && err.code) || 0});
    });

    attempt.stdout.pipe(process.stdout);
    attempt.stderr.pipe(process.stderr);
  }
  loadConfig(options.configFile);
  run();
};
