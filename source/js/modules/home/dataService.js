/**
 * Created by ashubham on 10/10/14.
 */

define([
        './module',
        'lodash'
    ],
    function (module, _) {
        'use strict';


        module.service('data', function($rootScope, $http, esVersion, alertSrv, es) {

            var self = this;
            self.index = 'logstash-websitebuilder.clientscript-2014.09.10';

            self.intervals = {
                year:"year",
                quarter: "quarter",
                month: "month",
                week: "week",
                day: "day",
                hour: "hour",
                minute: "minute",
                second: "second",
                default: "hour"
            }

            self.orderBy = {
                term: "_term",
                termCount: "_count",
                avg: "avg",
                max: "max",
                min: "min",
                sum: "sum",
                count: "count",
                default: "_term"
            }

            self.order = {
                asc: "asc",
                desc : "desc",
                default: "asc"
            }

            self.getResults = function (options) {
                var queryJson = {
                    index: self.index,
                    size: 0,
                    body : {

                    }
                };

                var filterJson = getFilterJson(options.filters);
                var aggsJson = getAggsJson(options.aggs);

                queryJson.body.query = filterJson;
                queryJson.body.aggs = aggsJson;
                console.log(queryJson);

                return es.search(queryJson);

            }

            function getFilterJson(filters) {
                return {"match_all" : {} };
            }



            function getAggsJson(aggs, position) {

                var returnObj = {};
                if(!position) position = 0;
                var aggName = getAggName(aggs[position]);

                if(position == aggs.length - 1) {
                    returnObj[aggName] = aggs[position];
                    return returnObj;
                }


                returnObj[aggName] = aggs[position];
                returnObj[aggName]["aggs"] = getAggsJson(aggs, position + 1);
                return returnObj;

            }


            function getAggName(agg) {
                return Object.keys(agg)[0];

            }

            self.statsAgg = function (field) {
                return {
                        "stats": {
                            "field": field
                        }
                };
            }

            self.termsAgg = function (field, orderBy, order, size, threshold) {
                var orderBy = self.orderBy[orderBy || "default"];
                var order = self.order[order || "default"];
                return {
                        "terms": {
                            "field" : field,
                            "min_doc_count" : threshold || 0,
                            "order" : {
                                orderBy : order
                            },
                            "size": size || 10
                        }
                    }
            }

            self.dateHistoAgg = function(field, interval) {
                return {
                    "date_histogram":{
                        "field": field || "@timestamp",
                        "interval": interval || self.intervals["default"]
                    }
                }
            }

            self.histoAgg = function(field, interval) {
                return {
                        "histogram": {
                            "field": field,
                            "interval": interval
                        }
                    }
            }

            self.percentileAgg = function(field) {

                return {
                    "percentiles": {
                        "field" : field
                    }
                }
            };







        });
    });
