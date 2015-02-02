define([
  'angular',
   'd3',
   'angular-charts',
  'ui.router',
  '../../config',
    'elasticsearch'
], function (angular) {
  'use strict';

  return angular.module('app.home', [
    'app.constants',
    'ui.router',
    'angularCharts',
    'elasticsearch'
  ]).config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'js/modules/home/home.html',
        controller: function ($scope, $inject, $modal, UserManager) {
          $modal.open({
            template: 'template',
            controller: function ($scope) {
              console.log($scope);
            },
            resolve: {
              foo: function ($stateParams) {
                return $stateParams;
              },
              bar: function (someService) {
                return someService;
              }
            }
          })
        },
        resolve: {
          foo: function ($stateParams) {
            return $stateParams;
          },
          bar: function (someService) {
            return someService;
          }
        }
      });
  });

});
