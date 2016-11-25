/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
	.controller('DemoHtmlEditor', ['$scope',function($scope) {
		$scope.content = 'hello<br/>world<br/>!!';
	}]);
