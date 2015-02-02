iota
======

System to dynamically plot statistical graphs based on textual queries.

Installation
------------

    # Get NPM dependencies:
    npm install

    # Install global NPM dependencies:
    npm -g install bower
    npm -g install gulp
    npm -g install karma

    # Also to be able to run tests from CLI
    # without browser window popping consider
    # to install PhantomJS:
    # http://phantomjs.org/download.html

    # Get Ruby dependencies required to compile styles from Sass:
    bundle install


Vendor update
-------------

* `bower install`

  To update all the dependencies to the latest compatible versions.

## Tests

Tests use Jasmin for assertions.

You can write tests in both Coffee and JS
(see `/source/js/modules/home/home-ctrl.spec.js` and `/source/js/modules/home/home-ctrl.spec.coffee`).

### E2E Tests

[Protractor](https://github.com/angular/protractor) is used to provide way to do E2E tests. To install go to `client`
directory and run:

    npm install -g protractor

    // This installs Selenium standalone
    // server and Chrome driver:
    webdriver-manager update

    // Start the server with:
    gulp webdriver

    // To test source:
    gulp protractor

Check `p.conf` and `p-compiled.conf` for Protractor settings.

Checkout [Protractor docs](https://github.com/angular/protractor/blob/master/docs/) for more information.
