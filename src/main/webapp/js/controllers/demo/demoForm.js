/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
	.controller('DemoForm', ['$scope',function($scope) {
        $scope.submitFrom = function(){
            console.log($scope.formValidator);
        };
        $scope.formData = {
            identity:null
        };
        $scope.changeIdentity = function(){
        	console.log($scope.formData);
        };
        $scope.identities = [{
        	key:100,
        	value:'教师'
        },{
        	key:101,
        	value:'公务员'
        }];
	}]);
