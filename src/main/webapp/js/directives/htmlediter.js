/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 富文本编辑器
 */
angular.module('adminApp')
    .directive('htmlediter', ['common', function(Common) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: false, //使用父作用域作为自己的作用域
            link: function(scope, element, attrs, ngModelCtrl) {
                //默认配置
                var defaultOps = {
                    toolbars: [
                        ['source', 'bold', 'italic', 'underline', 'strikethrough', 'blockquote', 'horizontal', 'removeformat', 'selectall', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', 'cleardoc', 'insertorderedlist', 'insertunorderedlist', 'justifyleft', 'justifycenter', 'justifyright', 'indent', 'touppercase', 'tolowercase', 'date', 'time', 'emotion', 'insertimage', 'link', 'insertvideo', 'anchor']
                    ]
                };
                //用户自定义配置
                if (attrs.ngUmoptions) {
                    var ops = scope.$eval(attrs.ngUmoptions);
                    for (var i in ops) {
                        defaultOps[i] = ops[i];
                    }
                }
                //初始化编辑器
                var width = element.width();
                // 动态生成id
                var htmlediterId = Common.createUUID();
                element.attr('id', htmlediterId);
                scope[htmlediterId] = UE.getEditor(htmlediterId, defaultOps);
                //绑定ng-model
                scope[htmlediterId].addListener('contentchange', function() {
                    ngModelCtrl.$setViewValue(scope[htmlediterId].getContent());
                });
                scope[htmlediterId].addListener('ready', function() {
                    //待元素渲染后再watch
                    scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                        if (newVal != scope[htmlediterId].getContent())
                            scope[htmlediterId].setContent(newVal);
                    });
                });
                scope.$on('$destroy', function() {
                    UE.delEditor(htmlediterId);
                    scope[htmlediterId] = null;
                });
            }
        };
    }]);
