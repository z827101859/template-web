/**
 * @ngdoc service
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
	.factory('demoService', ['common',function(Common) {
		var getDemoTableListUrl = '/xhr/demo/getDemoTableList.json';

		var service = {
			/**
			 * 获取demo的列表数据
			 * @param  {[{key:''}]}
			 * @param  {[int]}
			 * @param  {[int]}
			 * @return {[promise]}
			 */
			getDemoTableList : function(searchForm, page, size) {
	            var params = {
	            	key : searchForm.key,
	            	name : searchForm.key,
	            	begindatetime : searchForm.begindatetime,
	            	enddatetime : searchForm.enddatetime,
	            	page : page || Common.page,
                	size : size || Common.pageSize
	            };
	            return Common.post(getDemoTableListUrl,params);
	    	},
			/**
			 * 获取demo的列表1数据
			 * @param  {[{key:''}]}
			 * @return {[promise]}
			 */
			getDemoTableList1 : function(searchForm, page, size) {
	            var params = {
	            	key : searchForm.key,
	            	page : page || Common.page,
                	size : size || Common.pageSize
	            };
	            return Common.postByJson(getDemoTableListUrl,params);
	    	}
    	};
    	return service;
	}]);