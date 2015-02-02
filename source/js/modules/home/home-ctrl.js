/**
 * Home controller definition
 */
define(['./module', 'jsonpath', 'lodash'], function (module, jsonpath, _) {
  'use strict';

  module.controller('HomeController', ['es','$scope', 'fields', '$timeout', 'data','queryParser' , function (es, $scope, fields, $timeout, data, queryParser) {

      $scope.twoTimesTwo = 2 * 2;
      $scope.fields = fields;

      var keywords = ['average', 'max', 'min', 'median'];

      $scope.$watch('fields.list', function(newVal, oldVal) {
          $scope.suggestions = keywords.concat(fields.list);
      });



      $scope.gridsterOpts = {
          margins: [10, 10],
          outerMargin: false,
          pushing: true,
          floating: true,
          mobileBreakPoint: 1000,
          minRows: 3,
          draggable: {
              enabled: true
          },
          resizable: {
              enabled: true,
              handles: ['n', 'e', 's', 'w', 'se', 'sw']
          }
      };



      $scope.getStat = function () {
          return queryParser.getStat($scope.query);
      }


      $scope.getResults = function() {

          data.getResults(queryParser.queryComponents($scope.query))
              .then(function(resp) {
              console.log(resp)
              $scope.data = resp;
              $scope.charts = [
                  {
                    type: 'area',
                      sizeX: 3,
                      sizeY: 2,
                      row: 0,
                      col: 0
                  },
                  {
                    type: 'histo',
                    sizeX: 3,
                    sizeY: 2,
                    row: 0,
                    col: 3
                  },
                  {
                      type: 'area',
                      sizeX: 3,
                      sizeY: 2,
                      row: 0,
                      col: 0
                  },
                  {
                      type: 'histo',
                      sizeX: 3,
                      sizeY: 2,
                      row: 0,
                      col: 3
                  }
              ];
          });

      }



      $scope.changeData = function() {
          $scope.data = {
              series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
              data: [{
                  x: "Laptops",
                  y: [200, 100, 10],
                  tooltip: "this is tooltip"
              }, {
                  x: "Desktops",
                  y: [300, 250, 60]
              }, {
                  x: "Mobiles",
                  y: [471, 160]
              }, {
                  x: "Tablets",
                  y: [154, 10, 379]
              }]
          };
      };

      $scope.config = {
          title: 'Products',
          tooltips: true,
          labels: false,
          mouseover: function() {},
          mouseout: function() {},
          click: function(d) {console.log(d)},
          legend: {
              display: true,
              //could be 'left, right'
              position: 'right'
          }
      };


  }]);
});
