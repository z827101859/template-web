/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
 angular.module('adminApp')
	.controller('DemoList', ['$scope','$location','$state','common','demoService','dateformat','validator',function($scope,$location,$state,Common,DemoService,Dateformat,Validator) {
        console.log('参数：');
        console.log($location.search());
        console.log($state.params);
        // 数据列表  [必须]
        $scope.itemList = [];
        // 分页数据  [必须]
        $scope.pagination = {
            page: 1,
            size: 10,
            totalPage: 1,
            total: 0
        };
        // 搜索条件列表  [必须]
        $scope.searchForm = {
            name:'',
            begindatetime:Dateformat.formatDate(Dateformat.addDay(new Date(),-30),'YYYY-MM-DD').getTime(),
            enddatetime:Dateformat.formatDate(new Date(),'YYYY-MM-DD').getTime(),
            key:''
        };
        //搜索
        $scope.search = function() {
            if(!$scope.validForm()){
                return;
            }
            $scope.pagination.page = 1;
            refreshUrl();
        };
        //  修改当前页码  [必须]
        $scope.pageChanged = function(page) {
            if(!$scope.validForm()){
                return;
            }
            $scope.pagination.page = page;
            refreshUrl();
        };
        // 改变分页大小  [必须]
        $scope.changePageSize = function(size) {
            if(!$scope.validForm()){
                return;
            }
            if (size !== $scope.pagination.size) {
                // page 重置为 1
                $scope.pagination.size = size;
                $scope.pagination.page = 1;
                // 查询第一页
                refreshUrl();
            }
        };
        $scope.validForm = function(){
            return $scope.formValidator.$valid;
        };
        function getList(){
        	var page = $scope.pagination.page;
        	var size = $scope.pagination.size;
        	DemoService.getDemoTableList($scope.searchForm,page,size).then(function(data){
                $.extend(true,$scope.pagination,data.pagination);
        		$scope.itemList = angular.copy(data.result);
                $scope.itemList2 = angular.copy(data.result);
        	},function(){});
        }
        function refreshUrl() {
            var url = Common.generateUrl($location,$scope.searchForm,$scope.pagination);
            $location.url(url);
            Common.apply($scope);
        };
        Common.parseUrl($location,$scope.searchForm,$scope.pagination,{__formatParams:1,begindatetime:'number',enddatetime:'number'});
        getList();

        $scope.deleteItems1 = function(){
            console.log('表格1是否全选中:'+$scope.isAllItemsChecked1);
            console.log('表格1要删除的items:'+$scope.getSelectedItems1());
        };
        $scope.deleteItems2 = function(){
            console.log('表格2是否全选中:'+$scope.isAllItemsChecked2);
            console.log('表格2要删除的items:'+$scope.getSelectedItems2());
        };


        $scope.detail = function(id){
            $state.go('demo-list-detail',{rnd:new Date().getTime()});
        };
	}])