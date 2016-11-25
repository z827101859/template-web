/**
 * @author sweetyx
 * @name adminApp
 * @description Main module of the application
 */
angular
    .module('adminApp', [
        'ngSanitize',
        'ui.router',
        'toastr',
        'shark-angular.ui'
    ])
    .config(function(toastrConfig) {
        //配置提示信息(https://github.com/Foxandxss/angular-toastr)
        angular.extend(toastrConfig, {
            timeOut: 2000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-center'
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        //ui-router路由配置
        $urlRouterProvider.otherwise('/unauthorized');
        $stateProvider
            .state('unauthorized', {
                url: "/unauthorized?rnd",
                templateUrl: "views/unauthorized.html",
                controller: 'UnauthorizedCtrl'
            })
            .state('demo-htmleditor', {
                url: "/htmleditor?rnd",
                templateUrl: "views/demo/htmleditor.html",
                controller: 'DemoHtmlEditor',
                permission: 310
            })
            .state('demo-form', {
                url: "/form?rnd",
                templateUrl: "views/demo/form.html",
                controller: 'DemoForm',
                permission: 110
            })
            .state('demo-form1', {
                url: "/form1?rnd",
                templateUrl: "views/demo/form1.html",
                controller: 'DemoForm1',
                permission: 120
            })
            .state('demo-list', {
                //如果用state.go方法做页面切换，则需要申明对应的参数
                url: "/list?rnd&name&key&begindatetime&enddatetime",
                templateUrl: "views/demo/list.html",
                controller: 'DemoList',
                permission: 211
            })
            .state('demo-list-detail', {
                url: "/demo-list-detail?rnd",
                templateUrl: "views/demo/list-detail.html",
                controller: 'DemoListDetail',
                permission: 212
            })
            .state('demo-list1', {
                url: "/list1?rnd",
                templateUrl: "views/demo/list1.html",
                controller: 'DemoList1',
                permission: 220
            })
            .state('demo-list2', {
                url: "/list2?rnd",
                templateUrl: "views/demo/list2.html",
                controller: 'DemoList2',
                permission: 230
            })
            .state('demo-list2.list2-child', {
                url: "/list2-child?page&size&key&name&begindatetime&enddatetime",
                templateUrl: "views/demo/list2-child.html",
                controller: 'DemoList2Child',
                permission: 230
            })
            .state('demo-perm', {
                url: "/perm?rnd&user",
                templateUrl: "views/demo/perm.html",
                controller: 'DemoPerm',
                permission: 321
            })
            .state('demo-modal', {
                url: "/modal?rnd",
                templateUrl: "views/demo/modal.html",
                controller: 'DemoModal',
                permission: 330
            })
            .state('demo-navbar', {
                url: "/navbar?rnd",
                templateUrl: "views/demo/navbar.html",
                controller: 'DemoNavBar',
                permission: 350
            })
            .state('demo-uib', {
                url: "/uib?rnd",
                templateUrl: "views/demo/uib.html",
                controller: 'DemoUIB',
                permission: 340
            })
            .state('demo-uib.tab1', {
                //需要明确指定参数名称
                url: "/tab1",
                templateUrl: "views/demo/uib.tab1.html",
                controller: 'DemoUIB-Tab1',
                data: {
                    parent: 'demo-uib'
                },
                permission: 340
            })
            .state('demo-uib.tab2', {
                url: "/tab2",
                templateUrl: "views/demo/uib.tab2.html",
                controller: 'DemoUIB-Tab2',
                resolve: ['$timeout', '$q', function($timeout, $q) {
                    //完成费操作后才会渲染controller
                    var defer = $q.defer();
                    $timeout(function() {
                        defer.resolve({ id: 1111111 });
                    }, 0);
                    return defer.promise;
                }],
                permission: 340
            })
            .state('demo-test', {
                url: "/test?rnd",
                templateUrl: "views/demo/test.html",
                controller: 'DemoTest',
                permission: 410
            });
    })
    .run(['$rootScope', '$state', 'module', function($rootScope, $state, Module) {
        var go = $state.go;
        var fn = function(to, params, options) {
            //todo 
            go(to, params, options);
        };
        $state.go = fn;
        Module.setPermissions(window.permissionList);
        window.permissionList = null;
        //判断当前用户是否有权限访问该页面
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var permission = toState.permission;
            //没有权限时，统一跳转到unauthorized页面
            if (angular.isDefined(permission) && !Module.hasPermission(permission)) {
                event.defaultPrevented = true;
                $state.go('unauthorized');
                return false;
            }
        });
    }]);