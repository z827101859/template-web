/**
 * @ngdoc service
 * @name adminApp.dialog
 * @author wuzifang
 * @description
 * # dialog
 * Service in the adminApp.
 */
angular.module('adminApp')
    .factory('dialog', ['sharkmodal', '$q', function(sharkmodal, $q) {
        var service = {
            /**
             * 确认弹框
             * @param  {object} options
             * @param  {string} options.title 标题
             * @param  {string} options.content  内容
             * @param  {string} options.okTxt 确认按钮文本
             * @param  {string} options.cancelTxt 取消按钮文本
             * @return {promise}         promise   then close, dismiss
             */
            confirm: function(options) {
                options.title = options.title || '提醒';
                var content = options.content;
                var size = options.size;
                options.okTxt = options.okTxt || '确定';
                options.cancelTxt = options.cancelTxt || '取消';
                if (typeof options.showOk === 'undefined') {
                    options.showOk = true;
                }
                if (typeof options.showCancel === 'undefined') {
                    options.showCancel = true;
                }
                // 打开弹窗
                var modalInstance = sharkmodal.open({
                    animation: true,
                    templateUrl: 'views/global/dialog.html',
                    controller: 'DialogConfirmCtrl',
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        options: function() {
                            return options;
                        }
                    }
                });
                return modalInstance.result;
            },
            /**
             * 确认弹框
             * @param  {object} options
             * @param  {string} options.title 标题
             * @param  {string} options.content  内容
             * @param  {string} options.okTxt 确认按钮文本
             * @param  {string} options.cancelTxt 取消按钮文本
             * @return {promise}         promise   then close, dismiss
             */
            alert: function(options) {
                options.showOk = false;
                options.cancelTxt = options.cancelTxt || '关闭';
                return service.confirm(options);
            }
        };

        return service;
    }]);

angular.module('adminApp')
    .controller('DialogConfirmCtrl', function($scope, modalInstance, options) {
        // 设置
        $scope.options = options;
        // 关闭
        $scope.cancel = function() {
            modalInstance.dismiss();
        };
        // 确定
        $scope.ok = function() {
            modalInstance.close();
        };
    });
