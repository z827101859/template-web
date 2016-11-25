/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 编译动态插入的html
 */
angular.module('adminApp')
    .directive('compile', ['common','$compile',function(Common,$compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                Common.post(attrs.url).then(function(data){
                    element.html(data);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);