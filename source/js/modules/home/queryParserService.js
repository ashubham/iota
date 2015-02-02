/**
 * Created by ashubham on 10/23/14.
 */

define([
        './module',
        'lodash'
    ],
    function (module, _) {
        'use strict';

        module.service('queryParser', function( fields, data) {
            var self = this;

            self.queryComponents = function (query) {
                var key = getKey(query);
                var stat = self.getStat(query);
                var type = fields.typeMap[key]["type"];


                return {
                    filters: [],
                    aggs: [
                        data.dateHistoAgg(),
                        data.statsAgg(key)
                    ]
                }
            }


            function getKey(query) {
                var input = query.trim().split(' ');
                return (input.length > 1) ? input[1] : input[0];
            }

            self.getStat = function (query) {
                if (!query) return;
                var input = query.trim().split(' ');
                var stat = (input.length > 1) ? input[0] : "average";
                switch(stat) {
                    case 'average': return 'avg';
                    case 'max' : return 'max';
                    case 'min' : return 'min';
                    default : return 'avg';
                }
            }



        });


    });