/**
 * @ngdoc controller
 * @description
 * @author Liangyuekang
 */
angular.module('adminApp')
    .controller('DemoList2', ['$scope', '$location', '$state', 'common', 'demoService', 'dateformat', 'validator', function($scope, $location, $state, Common, DemoService, Dateformat, Validator) {
        $scope.curActive = 0;
        $scope.state = $state;
        $scope.tabArr = ['demo-list2.list2-child'];
        $scope.tabSwitch = function(index){
            console.log($scope.curActive);
        }
        // 饼状图总额
        var totalAmount = 0;
        // 构造饼状图参数
        $scope.conf = {
            //主题配置
            theme: 'default',
            //echarts样式配置 width和height为必配置项
            style: {
                width: '90%',
                minWidth: '800px',
                height: '340px'
            }
        };
        // 生成饼状图
        $scope.opt = {
            title: {
                fontStyle: {
                    fontStyle: 'oblique'
                },
                text: '上面是不会二次刷新的饼状图',
                subtextStyle: {
                    color: 'red',
                    fontSize: 16
                },
                x: 'center',
                textAlign: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                selectedMode: true,
                textStyle: {
                    fontSize: 14
                },
                right: '20%',
                top: '20%',
                data: ['艾米莉亚', '菲鲁特', '雷姆', '拉姆', '碧翠丝', '菲利克斯♂']
            },
            series: [{
                name: 'RE0人气排行榜',
                type: 'pie',
                radius: '50%',
                center: ['30%', '50%'],
                data: [{
                    name: '艾米莉亚',
                    value: 1000
                }, {
                    name: '菲鲁特',
                    value: 2000
                }, {
                    name: '雷姆',
                    value: 10000
                }, {
                    name: '拉姆',
                    value: 3000
                }, {
                    name: '碧翠丝',
                    value: 2000
                }, {
                    name: '菲利克斯♂',
                    value: 3000
                }],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        // 数据注入echarts实例
        // 修改数据重新注入时需手动setOption($scope.opt);
        /* setTimeout(function() {
         *      $scope.opt.series[0].data[0].name = '惠惠';
         *      $scope.opt.legend.data[0] = '惠惠';
         *      $scope.myecharts.setOption($scope.opt);
         * }, 1000);
         */
    }])
    .controller('DemoList2Child', ['$scope', '$location', '$state', 'common', 'demoService', 'dateformat', 'validator', function($scope, $location, $state, Common, DemoService, Dateformat, Validator) {
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
            name: '',
            begindatetime: Dateformat.formatDate(Dateformat.addDay(new Date(), -30), 'YYYY-MM-DD').getTime(),
            enddatetime: Dateformat.formatDate(new Date(), 'YYYY-MM-DD').getTime(),
            key: ''
        };
        //搜索
        $scope.search = function() {
            if (!$scope.validForm()) {
                return;
            }
            $scope.pagination.page = 1;
            refreshUrl();
        };
        //  修改当前页码  [必须]
        $scope.pageChanged = function(page) {
            if (!$scope.validForm()) {
                return;
            }
            $scope.pagination.page = page;
            refreshUrl();
        };
        // 改变分页大小  [必须]
        $scope.changePageSize = function(size) {
            if (!$scope.validForm()) {
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
        $scope.validForm = function() {
            return $scope.formValidator.$valid;
        };

        function getList() {
            var page = $scope.pagination.page;
            var size = $scope.pagination.size;
            DemoService.getDemoTableList($scope.searchForm, page, size).then(function(data) {
                $.extend(true, $scope.pagination, data.pagination);
                $scope.itemList = data.result;
            }, function() {});
        }

        function refreshUrl() {
            // 为保证整个页面不刷新，不使用location的刷新方法
            // var url = Common.generateUrl($location, $scope.searchForm, $scope.pagination);
            // $location.url(url);
            // Common.apply($scope);
            // 正确使用方法为：
            var urlParams = $.extend({}, $scope.searchForm, $scope.pagination);
            $state.go('demo-list2.list2-child', urlParams);
        };
        Common.parseUrl($location, $scope.searchForm, $scope.pagination, { __formatParams: 1, begindatetime: 'number', enddatetime: 'number' });
        getList();

        $scope.deleteItems = function() {
            var items = $scope.getSelectedItems();
            alert('要删除的items:' + items);
        };
        $scope.exportItems = function() {
            alert('导出');
        };

        $scope.detail = function(id) {
            $state.go('demo-list-detail', { rnd: new Date().getTime() });
        };
    }])
