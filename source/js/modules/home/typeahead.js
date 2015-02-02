/**
 * Created by ashubham on 9/30/14.
 */

define(['angular', './module'], function(angular, module) {

    module.directive('typeahead', function($timeout) {
        var spacer;
        function calculateWidthForText(text) {

            if (spacer === undefined) { // on first call only.
                spacer = document.createElement('span');
                spacer.style.visibility = 'hidden';
                spacer.style.position = 'fixed';
                spacer.style.outline = '0';
                spacer.style.margin =  '0';
                spacer.style.padding = '0';
                spacer.style.border =  '0';
                spacer.style.left = '0';
                spacer.style.whiteSpace = 'pre';
                spacer.style.fontSize =   14;
                spacer.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
                spacer.style.fontWeight = 'normal';
                document.body.appendChild(spacer);
            }

            // Used to encode an HTML string into a plain text.
            // taken from http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
            spacer.innerHTML = String(text).replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            return spacer.getBoundingClientRect().right;
        }


        return {
            restrict: 'AEC',
            scope: {
                items: '=',
                prompt:'@',
                model: '=',
                onSelect:'&',
                classes: '@'
            },
            link:function(scope,elem,attrs){

                var
                    input,
                    suggestionBoxLeft = 0,
                    partialQuery = "";


                elem.bind("keydown keypress", function (event) {

                    if(event.which == 38 && scope.current > 0) {
                        scope.current-- ;
                    }
                    else if(event.which == 40 && scope.current < scope.filteredItems.length - 1) {
                        scope.current++;
                    }
                    else if((event.which == 39 || event.which == 13) && scope.filteredItems.length) {
                        scope.handleSelection(scope.filteredItems[scope.current]);
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    scope.$digest();
                });

                scope.handleSelection=function(selectedItem){
                    scope.model=partialQuery+ " "+ selectedItem;
                    scope.current=0;
                    scope.selected=true;
                    /*$timeout(function(){
                        scope.onSelect();
                    },200);*/
                };

                scope.$watch('model', function(newValue, oldValue) {
                    if (!newValue) {
                        scope.filterBy="";
                        return;
                    }
                    input = newValue.split(' ');
                    scope.filterBy = (oldValue && newValue.trim() == oldValue.trim()) ? "" : input.pop();
                    partialQuery = input.join(' ');
                    suggestionBoxLeft = calculateWidthForText(partialQuery + " ") + 5;
                });

                scope.getFilter = function () {

                }

                scope.current=0;
                scope.selected=true;


                scope.style = function () {
                    return {
                        left: suggestionBoxLeft
                    };
                };
            },
            templateUrl: 'assets/templates/suggestionTpl.html'
        }
    });

});
