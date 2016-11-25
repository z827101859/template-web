/**
 * @ngdoc service
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
	.factory('adminService', ['common',function(Common) {
		var getInfoUrl = '/xhr/admin/getInfo.json';
		var service = {
			/**
			 * 获取用户信息
			 * @return {[promise]}
			 */
			getInfo : function() {
                var params = {
                	id:1
                }
	            return Common.get(getInfoUrl,params,true);
	    	}
    	};
    	return service;
	}]);