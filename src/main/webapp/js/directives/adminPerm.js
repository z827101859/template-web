/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 权限校验
 */
angular.module('adminApp')
    .directive('adminPerm', ['module', function(Module) {
        function authorizeChildEles(eles) {
            for (var i = 0; i < eles.length; i++) {
                var ele = $(eles[i]);
                var permNo = ele.attr('perm-no');
                var permNoOpposite = ele.attr('perm-no-opposite');
                if (typeof permNo !== 'undefined') {
                    if (!Module.hasPermission(permNo)) {
                        ele.remove();
                    }
                } else if (typeof permNoOpposite !== 'undefined') {
                    if (Module.hasPermission(permNoOpposite)) {
                        ele.remove();
                    }
                } else {
                    authorizeChildEles(ele.children());
                    var childEles = ele.children();
                    if (0 === childEles.length) {
                        //子元素全部隐藏时，本身也隐藏
                        ele.remove();
                    }
                }
            }
        }
        return {
            restrict: 'A',
            compile: function(tElem, tAttrs) {
                authorizeChildEles(tElem);
            }
        };
    }]);
