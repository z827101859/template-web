/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 修复angularjs在弹窗模式下的select元素，ie不会渲染值的问题
 * s手动触发重绘
 */
angular.module('adminApp')
    .directive('fixieselect', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (!document.all) return;
            var selectEle = element[0];
            $timeout(function(){
                var option = document.createElement("option");
                selectEle.add(option, null);
                selectEle.remove(selectEle.options.length - 1);
            },0);
        }
    };
}]);