/**
 * @ngdoc function
 * @name adminApp.controller:GlobalHeaderCtrl
 * @description
 * # GlobalHeaderCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('GlobalHeaderCtrl', ['$scope','adminService', function ($scope,AdminService) {
  		setInterval(function(){
	  		AdminService.getInfo().then(function(data){
	    		$scope.nickname = data.nickname;
	  		},function(){});
  		},5000);
  }]);
