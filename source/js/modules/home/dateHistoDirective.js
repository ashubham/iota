/**
 * Created by ashubham on 9/3/14.
 */

define(['angular','jquery','d3', './module'], function (angular, $, d3, module) {

    return module.directive('fsDateHisto', [function() {
        'use strict';

        return {
            restrict: 'E',

            // sets up the isolate scope so that we don't clobber parent scope
            scope: {
                onClick:   '=',
                width:     '=',
                height:    '=',
                bind:      '=',
                label:     '@',
                field:     '@',
                duration:  '@',
                delay:     '@',
                interval:  '@',
                stat:   '='
            },

            // angular directives return a link fn
            link: function(scope, element, attrs) {

                var margin = {
                    top:20,
                    right: 20,
                    bottom: 30,
                    left: 80
                };

                // default width/height - mainly to create initial aspect ratio
                var width = scope.width || 1280;
                var height = scope.height || 400;

                var label = attrs.label || 'Frequency';
                var klass = attrs.class || '';

                // add margin (make room for x,y labels)
                width = width - margin.left - margin.right;
                height = height - margin.top - margin.bottom;

                // create x,y scales (x is inferred as time)
                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                // create x,y axis
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                // create the root svg node
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // insert the x axis (no data yet)
                svg.append('g')
                    .attr('class', 'histo x axis ' + klass)
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                // insert the y axis (no data yet)
                svg.append('g')
                    .attr('class', 'histo y axis ' + klass)
                    .call(yAxis)
                    .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.51em')
                    .style('text-anchor', 'end')
                    .text(label);


                // mainer observer fn called when scope is updated. Data and scope vars are npw bound
                scope.$watch('bind', function(data) {

                    // pull info from scope
                    var duration = scope.duration || 0;
                    var delay = scope.delay || 0;
                    var field = scope.field || attrs.bind.split('.').pop().toLowerCase();
                    var interval = scope.interval || 'day';
                    var stat = scope.stat() || false;

                    // just because scope is bound doesn't imply we have data
                    if (data) {

                        // pull the data array from the facet
                        data = data.buckets || [];



                        // calculate the bar width based on the data length leaving
                        // a 2 pixel "gap" between bars.
                        var barWidth = width/data.length - 2;

                        var intervalMsecs = 86400000;

                        // workaround until this pull request is merged
                        // the user can pass in an appropriate interval
                        // https://github.com/elasticsearch/elasticsearch/pull/2559
                        switch(interval.toLowerCase()) {
                            case 'minute':
                                intervalMsecs = 60000;
                                break;
                            case 'hour':
                                intervalMsecs = 3600000;
                                break;
                            case 'day':
                                intervalMsecs = 86400000;
                                break;
                            case 'week':
                                intervalMsecs = 604800000;
                                break;
                            case 'month':
                                intervalMsecs = 2630000000;
                                break;
                            case 'year':
                                intervalMsecs = 31560000000;
                                break;
                        }

                        // recalculate the x and y domains based on the new data.
                        // we have to add our "interval" to the max otherwise
                        // we don't have enough room to draw the last bar.
                        x.domain([
                            d3.min(data, function(d) {
                                return d.key;
                            }),
                                d3.max(data, function(d) {
                                    return d.key;
                                }) + intervalMsecs
                        ]);
                        y.domain([0, d3.max(data, function(d) { return (stat) ? d['stats'][stat]: d.doc_count; })]);

                        // create transition (x,y axis)
                        var t = svg.transition().duration(duration);

                        // using a random key function here will cause all nodes to update
                        var bars = svg.selectAll('rect')
                            .data(data, function(d) { return Math.random(); });

                        // d3 enter fn binds each new value to a rect
                        bars.enter()
                            .append('rect')
                            .attr('class', 'histo rect ' + klass)
                            .attr('cursor', 'pointer')
                            .attr('x', function(d) { return x(d.key); })
                            .attr("y", function(d) { return height })
                            .attr('width', barWidth)
                            .transition()
                            .delay(function (d,i){ return i * delay; })
                            .duration(duration)
                            .attr('height', function(d) { return height - y((stat) ? d['stats'][stat]: d.doc_count); })
                            .attr('y', function(d) { return y((stat) ? d['stats'][stat]: d.doc_count); });

                        // wire up event listeners - (registers filter callback)
                        bars.on('mousedown', function(d) {
                            scope.$apply(function() {
                                (scope.onClick || angular.noop)(field, d.key);
                            });
                        });

                        // d3 exit/remove flushes old values (removes old rects)
                        bars.exit().remove();

                        // update our x,y axis based on new data values
                        t.select('.x').call(xAxis);
                        t.select('.y').call(yAxis);
                    }
                }, true)
            }
        };
    }]);
});