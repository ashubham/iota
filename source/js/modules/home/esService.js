/**
 * Created by ashubham on 8/29/14.
 */

define(['./module', 'elasticsearch'], function(module) {
    module.service('es', function (esFactory) {
        return esFactory({
            host: 'localhost:9200'
            // ...
        });
    });
});

