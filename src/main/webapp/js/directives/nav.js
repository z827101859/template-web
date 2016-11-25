/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 左侧导航
 */
angular.module('adminApp')
    .controller('GlobalNavCtrl', ['$scope','$state','$rootScope', function ($scope, $state,$rootScope) {
        this.setInitElement = function(ele){
            $scope.initElement = ele;
        };
        $scope.navtitle = '我是左侧标题栏，点击分割线上的箭头可收缩';
        $scope.go = function(state,params){
            if($scope.currentState === state){
                return;
            };
            var dParams = {rnd:new Date().getTime()};
            if(params){
                $.extend(dParams,params);
            }
            $state.go(state,dParams);
        };
        var unsubscribe = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.currentState = toState.name;
            /*
            切换左侧导航的选中状态
            */
            //移除原先选中的菜单
            $scope.initElement.find('a').removeClass('active');
            //选中菜单
            var query = 'a[nav-module=' + $scope.currentState.split('.')[0] + ']';
            var navLink = $scope.initElement.find(query);
            navLink.addClass('active');
            //展开所在菜单组
            var groupWrap = navLink.parent();
            if(groupWrap.is(':hidden')){
                groupWrap.slideDown(200);
            }
        });
        $scope.$on('$destroy',function(){
            //scope销毁时移除监听stateChangeSuccess
            unsubscribe();
        });
    }])
    .directive('nav',['$state','$rootScope',function($state,$rootScope) {
        return {
            restrict: 'A',
            controller: 'GlobalNavCtrl',//与GlobalNavCtrl共用一个scope
            compile: function(tElem, tAttrs) {
                var groups = tElem.find('.js-group-title');
                groups.on('click',function(e){
                    var ele = $(e.target).next('.js-group-wrap');
                    ele.slideToggle(200);
                });
                return function(scope,element,attrs,ctrl){
                    console.log(scope);
                    ctrl.setInitElement(element);
                }
            }
        };
    }])
    .directive('menuCollapse',['$rootScope','$timeout',function($rootScope,$timeout) {
        return {
            restrict: 'A',
            compile: function(tElem, tAttrs) {
                var leftMenu = $('#js-left-menu');
                var rightContainer = $('#js-right-container');
                tElem.on('click',function(){
                    if(leftMenu.width() == 0){
                        tElem.css('left','20%');
                        tElem.removeClass('z-right').addClass('z-left');
                        leftMenu.width('20%');
                        rightContainer.width('80%');
                    }
                    else{
                        tElem.css('left','0.5%');
                        tElem.removeClass('z-left').addClass('z-right');
                        leftMenu.width(0);
                        rightContainer.width('100%');
                    }
                    $timeout(function(){
                        $rootScope.$broadcast('resize');
                    },500)
                });
            }
        };
    }]);