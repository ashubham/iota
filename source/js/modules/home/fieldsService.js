define([
        './module',
        'lodash'
    ],
    function (module, _) {
        'use strict';


        module.service('fields', function($rootScope, $http, esVersion, alertSrv, es) {

            // Save a reference to this
            var self = this;



            this.list = ['_type'];
            this.indices = [];
            this.typeMap = {};

            // Stop tracking the full mapping, too expensive, instead we only remember the index names
            // we've already seen.
            //
            /*$rootScope.$watch(
                function() {
                    return [{
                        interval: 'none',
                        pattern: '_all',
                        default: 'INDEX_MISSING',
                        warm_fields: true
                    }];
                }, function(n) {
                if(!_.isUndefined(n) && n.length ) {
                    // Only get the mapping for indices we don't know it for
                    var indices = _.difference(n,_.keys(self.indices));
                    // Only get the mapping if there are new indices
                    if(indices.length > 0) {
                        self.map(indices).then(function(result) {
                            self.indices = _.union(self.indices,_.keys(result));
                            self.list = mapFields(result);
                        });
                    }
                }
            });*/



            var mapFields = function (m) {
                var fieldMap = {};
                _.each(m, function(types) {
                    _.each(types, function(type) {
                        fieldMap = _.omit(_.merge(fieldMap,type),
                            ['_parent','_routing','_size','_ttl','_all','_uid','_version','_boost','_source']);
                    });
                });
                return fieldMap;
            };

            this.map = function(indices) {
                var request = es.indices.getMapping({
                        index: indices
                    });

                // Flatten the mapping of each index into dot notated keys.
                return request.then(function(p) {
                    var mapping = {};
                    return esVersion.gte('1.0.0.RC1').then(function(version) {
                        _.each(p, function(indexMap,index) {
                            mapping[index] = {};
                            _.each((version ? indexMap.mappings : indexMap), function (typeMap,type) {
                                mapping[index][type] = flatten(typeMap);
                            });
                        });
                        return mapping;
                    });
                });
                /*.fail(function(err) {
                    if(status === 0) {
                        alertSrv.set('Error',"Could not contact Elasticsearch at "+"es.config.server"+
                            ". Please ensure that Elasticsearch is reachable from your system." ,'error');
                    } else {
                        alertSrv.set('Error',"No index found at "+"ejs.config.server"+"/" +
                            indices.join(',')+"/_mapping. Please create at least one index."  +
                            "If you're using a proxy ensure it is configured correctly.",'error');
                    }
                });*/
            };

            // This should understand both the 1.0 format and the 0.90 format for mappings. Ugly.
            var flatten = function(obj,prefix) {
                var propName = (prefix) ? prefix :  '',
                    dot = (prefix) ? '.':'',
                    ret = {};
                for(var attr in obj){
                    if(attr === 'dynamic_templates' || attr === '_default_') {
                        continue;
                    }
                    // For now only support multi field on the top level
                    // and if there is a default field set.
                    if(obj[attr]['type'] === 'multi_field') {
                        ret[attr] = obj[attr]['fields'][attr] || obj[attr];
                        var keys = _.without(_.keys(obj[attr]['fields']),attr);
                        for(var key in keys) {
                            ret[attr+'.'+keys[key]] = obj[attr]['fields'][keys[key]];
                        }
                    } else if (attr === 'properties' || attr ==='fields') {
                        _.extend(ret,flatten(obj[attr], propName));
                    } else if(typeof obj[attr] === 'object' &&
                        (!_.isUndefined(obj[attr].type) || !_.isUndefined(obj[attr].properties))){
                        _.extend(ret,flatten(obj[attr], propName + dot + attr));
                    } else {
                        if(propName !== '') {
                            ret[propName] = obj;
                        }
                    }
                }
                return ret;
            };

            var indices = ['_all'];
            if(!_.isUndefined(indices) && indices.length ) {
                // Only get the mapping for indices we don't know it for
                // var indices = _.difference(n,_.keys(self.indices));
                // Only get the mapping if there are new indices
                if(indices.length > 0) {
                    self.map(indices).then(function(result) {
                        self.indices = _.union(self.indices,_.keys(result));
                        self.typeMap = mapFields(result);
                        self.list = _.keys(self.typeMap);
                    });
                }
            }

        });

    });