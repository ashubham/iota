if (typeof define !== 'function') {
  // to be able to require file from node
  var define = require('amdefine')(module);
}

define({
  baseUrl: '.',
  // Here paths are set relative to `/source` folder
  paths: {
    'angular'       : 'vendor/angular/angular',
    'async'         : 'vendor/requirejs-plugins/src/async',
    'jquery'        : 'vendor/jquery/dist/jquery',
    'ngResource'    : 'vendor/angular-resource/angular-resource',
    'ui.router'     : 'vendor/angular-ui-router/release/angular-ui-router',
    'angular-charts': 'vendor/angular-charts/dist/angular-charts',
    'd3'            : 'vendor/d3/d3.v3',
    'elasticsearch' : 'vendor/elasticsearch/elasticsearch.angular',
    'jsonpath'      : 'vendor/jsonpath/lib/jsonpath',
    'ng-strap'      : 'vendor/angular-strap/dist/angular-strap',
    'ng-strap-tpl'  : 'vendor/angular-strap/dist/angular-strap.tpl',
    'ng-animate'    : 'vendor/angular-animate/angular-animate',
    'lodash'        : 'vendor/lodash/dist/lodash',
    'ng-gridster'   : 'vendor/angular-gridster/src/angular-gridster'

  },

  shim: {
    'angular': {
      'deps': ['jquery'],
      'exports': 'angular'
    },
    'ngResource': ['angular'],
    'ui.router' : ['angular'],
    'angular-charts' : ['angular'],
    'elasticsearch' : ['angular'],
    'ng-animate'   : ['angular'],
    'ng-strap'      : ['angular', 'ng-animate'],
    'ng-strap-tpl' : ['angular', 'ng-strap'],
    'ng-gridster'  : ['angular']
  }
});
