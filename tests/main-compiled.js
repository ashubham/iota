/**
 * Monkey patching for RequireJS 'define' method in order to remove ^app/ substring in
 * dependency path for controllers, filters, services and directives.
 */
(function(global) {
    var original_define = global.define;
    // reg exp for testing if dependency is app file
    var isAppFile = /^Source\/(controllers|services|filters|directives)\//;

    // Override
    global.define = function(name, deps, callback) {
        var args = Array.prototype.slice.apply(arguments);

        // Process only anonymous definitions
        if(args.length != 2) {
            return original_define.apply(null, args);
        }

        // basically deps and callback are defined only for specs for testing
        var deps = args[0], callback = args[1];
        if(deps instanceof Array && typeof callback == "function") {
            for(var i = 0; i < deps.length; i++) {
                if(isAppFile.test(deps[i]))
                    deps[i] = deps[i].replace('Source/', '');
            }
        }

        original_define.apply(null, args);
    };

    // Enable AMD mode
    // Without this code line libs such as 'moment' or 'accounting' aren't being loaded
    // when we try to run tests for compiled .js file
    global.define.amd = original_define.amd;
})(this);

/**
 * another one monkey patch to prevent "no timestamp" error
 * https://github.com/karma-runner/karma-requirejs/issues/6#issuecomment-23037725
 */
(function (global) {
    for (var file in window.__karma__.files) {
        global.__karma__.files[file.replace(/^\//, '')] = global.__karma__.files[file];
    }
} (this))

require.config({
    baseUrl: 'base/',

    paths: {
        /* paths */
        'Specs': './tests/specs',

        /*named modules for app deps*/
        'angular': './build/js/libs/angular/angular',
        'angular-resource': './build/js/libs/angular/angular-resource',
        'async': './build/js/libs/requirejs-plugins/src/async',
        'domReady': './build/js/libs/requirejs-domready/domReady',
        /*named modules for test dependencies*/
        'angular-mocks': './build/js/libs/angular-mocks/angular-mocks',
        'chai': './build/js/libs/chai/chai'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-mocks': {
            deps: ['angular']
        }
    }
});


/* add yo specs here */
require(['require',
    './build/js/main'
   ], function (require) {
    dump('tests/main-compiled.js is starting requirejs');

    // to ensure that source is already loaded before tests are tried to run
    require([
        'Specs/services/index',
        'Specs/filters/index',
        'Specs/directives/index',
        'Specs/controllers/index'
    ], window.__karma__.start);
});