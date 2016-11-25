/**
 * @ngdoc controller
 * @description
 * @author wangying
 */
angular.module('adminApp')
    .controller('DemoDialog', ['$scope','modalInstance','params',function($scope,modalInstance,params) {
        $scope.adminInfo = {
            nickname: params.name
        };
        // 关闭
        $scope.cancel = function() {
            modalInstance.dismiss();
        };
        // 确定
        $scope.ok = function() {
            modalInstance.close();
        };
    }]);
