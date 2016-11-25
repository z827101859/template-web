/**
 * @ngdoc controller
 * @description
 * @author wangying
 */
angular.module('adminApp')
    .controller('DemoModal', ['$scope', 'sharkmodal', '$log', 'dialog', 'toastr', function($scope, sharkmodal, $log, Dialog, Toastr) {
        $scope.confirm = function() {
            Dialog.confirm({
                title: '提醒',
                content: '确定要删除吗？'
            });
        };
        $scope.alert = function() {
            Dialog.alert({
                title: '提醒',
                content: '请注意！'
            });
        };
        // 打开弹窗
        $scope.openDialog = function(size) {
            var sharkModalInstance = sharkmodal.open({
                animation: true,
                templateUrl: 'views/demo/dialog.html',
                controller: 'DemoDialog',
                size: size,
                resolve: {
                    params: function() {
                        return { name: 'admin' };
                    }
                }
            });
            // 弹窗在关闭的时候执行的
            sharkModalInstance.then(function() {
                $log.info('Modal closed at: ' + new Date());
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.toastrSuccess = function() {
            Toastr.success("操作成功");
        }
        $scope.toastrError = function() {
            Toastr.error("操作失败");
        }
    }]);
