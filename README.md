[![Build Status](https://travis-ci.org/jfromaniello/npm-install-retry.svg?branch=master)](https://travis-ci.org/jfromaniello/npm-install-retry)

![Build status](https://ci.appveyor.com/api/projects/status/sc7937we6gb0mwoc?svg=true)

Command line utility that retries  `npm install` when NPM fails with flaky errors:
* `npm ERR! cb() never called`,
* `npm ERR! errno ECONNRESET`,
* `npm ERR! shasum check failed`,
* `npm ERR! code EINTEGRITY`

This happens sporadically and has been reported many times:

-  https://github.com/meteor/meteor/issues/1190
-  https://github.com/isaacs/npm/issues/2907
-  https://github.com/isaacs/npm/issues/3269
-  https://github.com/npm/npm/issues?utf8=%E2%9C%93&q=ECONNRESET+
-  https://github.com/npm/npm/issues/2701

and still fails.


## Installation

	npm install -g  npm-install-retry

## Usage

From command-line:

	npm-install-retry --wait 500 --attempts 10 --configFile config.json -- --production

It has the following options: `wait` (defaults to 500), `attempts` (default to 10), and `configFile`. Everything after `--` goes directly to npm.

#### Config file

The config JSON file is currently only used to provide a list of regex strings that should match an NPM error and trigger a retry. For example:

```
{
  "matchers": ["npm ERR\\! cb\\(\\) never called\\!", "npm ERR\\! errno ECONNRESET",
               "npm ERR\\! shasum check failed", "npm ERR\\! code EINTEGRITY"]
}
```

The config file is chosen in the following order:
1) A user-specified file (using `--configFile`)
2) `.npmretry.json` in the user's home directory
3) `.npmretry.json` in the `npm-install-retry` installation directory

## License

MIT 2013 - José F. Romaniello
