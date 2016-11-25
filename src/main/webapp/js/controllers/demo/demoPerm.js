/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
    .controller('DemoPerm', ['$scope', '$location', 'sharkmodal', function($scope, $location, sharkmodal) {
        console.log($location.search());

        $scope.addRole = function() {
            var sharkModalInstance = sharkmodal.open({
                animation: true,
                templateUrl: 'views/demo/edit-role.html',
                controller: 'DemoEditRole',
                resolve: {
                    params: function() {
                        return {
                            type: 'add',
                            perms: []
                        };
                    }
                }
            });
            sharkModalInstance.then(function() {}, function() {});
        }
        $scope.editRole = function() {
            var sharkModalInstance = sharkmodal.open({
                animation: true,
                templateUrl: 'views/demo/edit-role.html',
                controller: 'DemoEditRole',
                resolve: {
                    params: function() {
                        return {
                            type: 'edit',
                            perms: [110]
                        };
                    }
                }
            });
            sharkModalInstance.then(function() {}, function() {});
        }
    }])
    .controller('DemoEditRole', ['$scope', 'modalInstance', 'permData', 'params', function($scope, modalInstance, permData, Params) {
        $scope.treeData = permData;
        $scope.preSelectedPermIds = Params.perms;
        $scope.title = Params.type === 'edit' ? '编辑角色' : '新建角色';
        // 全选
        $scope.selectAll = function() {
            $scope.permTree.selectAll();
        };
        // 反选
        $scope.reverseSelect = function() {
            $scope.permTree.reverseSelect();
        };
        // 全不选
        $scope.unSelectAll = function() {
            $scope.permTree.selectNo();
        };
        $scope.ok = function() {
            $scope.formValidator.doValidate();
            if (!$scope.formValidator.$valid) {
                return;
            };
            var permArr = [];
            var selectedNodes = $scope.permTree.getCheckedNodes();
            console.log(selectedNodes);
            modalInstance.close();
        };
        $scope.cancel = function() {
            modalInstance.dismiss();
        };
    }]);
