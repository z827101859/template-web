/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
    .controller('DemoUIB', ['$scope', '$state', '$location', 'common', function($scope, $state, $location, Common) {
        console.log('parentPage');
        $scope.curActive = 0;
        $scope.tabSwitch = function(index) {
            if (index == 0) {
                $state.go('demo-uib.tab1');
            } else if (index == 1) {
                $state.go('demo-uib.tab2');
            }
        }
    }])
    .controller('DemoUIB-Tab1', ['$scope', '$state', '$location', function($scope, $state, $location) {
        console.log('childPage1:', $state.params);
        $scope.$parent.curActive = 0;
        $scope.goTab = function() {
            $state.go('demo-uib.tab2');
        }
    }])
    .controller('DemoUIB-Tab2', ['$scope', '$state', function($scope, $state) {
        console.log('childPage2:', $state.params);
        $scope.$parent.curActive = 1;
        $scope.goTab = function() {
            $state.go('demo-uib.tab1');
        }
    }]);
