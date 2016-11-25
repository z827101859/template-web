/**
 * @ngdoc controller
 * @description
 * @author wangying
 */
angular.module('adminApp')
    .controller('DemoList1', ['$scope', '$location', '$timeout', 'common', 'demoService', function($scope, $location, $timeout, Common, DemoService) {
        // 数据列表  [必须]
        $scope.itemList = [];
        // 分页数据  [必须]
        $scope.pagination = {
            page: 1,
            size: 10,
            totalPage: 1,
            total: 0
        };
        var selectItems = [{
            value: '',
            name: '请选择'
        }, {
            value: 1001,
            name: '一班'
        }, {
            value: 1002,
            name: '二班'
        }];
        // $timeout(function() {
        //     $scope.selectItems = selectItems;
        // }, 1000);
        $scope.selectItems = selectItems;
        // 搜索条件列表  [必须]
        $scope.searchForm = {
            key: '',
            class: ''
        };
        //按回车搜索
        $scope.listenKeyDown = function(evt) {
            if (evt.which == 13) {
                $scope.search();
            }
        };
        //搜索
        $scope.search = function() {
            $scope.pagination.page = 1;
            refreshUrl();
        };
        //  修改当前页码  [必须]
        $scope.pageChanged = function(page) {
            $scope.pagination.page = page;
            refreshUrl();
        };
        // 改变分页大小  [必须]
        $scope.changePageSize = function(size) {
            if (size !== $scope.pagination.size) {
                // page 重置为 1
                $scope.pagination.size = size;
                $scope.pagination.page = 1;
                // 查询第一页
                refreshUrl();
            }
        };
        //  修改下拉菜单  [必须]
        $scope.onselect = function(value) {
            console.log($scope.searchForm);
            refreshUrl();
        };

        function getList() {
            var page = $scope.pagination.page;
            var size = $scope.pagination.size;
            DemoService.getDemoTableList1($scope.searchForm, page, size).then(function(data) {
                $.extend(true, $scope.pagination, data.pagination);
                $scope.itemList = data.result;
            }, function() {});
        }

        function refreshUrl() {
            var url = Common.generateUrl($location, $scope.searchForm, $scope.pagination);
            $location.url(url);
            Common.apply($scope);
        };
        Common.parseUrl($location, $scope.searchForm, $scope.pagination, { __formatParams: 1});
        getList();

        $scope.deleteItems = function() {
            var items = $scope.getSelectedItems();
            alert('要删除的items:' + items);
        };
        $scope.exportItems = function() {
            alert('导出');
        };
    }])
