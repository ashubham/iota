/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define([
  'angular',
  'd3',
  'ui.router',
  'angular-charts',
  'elasticsearch',
  'ng-strap',
  'ng-strap-tpl',
  'ng-gridster',
  './config',
  './modules/docs/docs',
  './modules/home/home',
  './modules/ui/ui'
], function (angular) {
  'use strict';

  return angular.module('app', [
    'app.constants',
    'app.docs',
    'app.home',
    'app.ui',
    'ui.router',
    'angularCharts',
    'gridster',
    'mgcrea.ngStrap',
    'elasticsearch'
  ]).config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });

});
