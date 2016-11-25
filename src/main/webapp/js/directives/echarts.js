angular.module('adminApp')
    .directive('echarts', ['$rootScope','$window', '$timeout', function($rootScope,$window, $timeout) {
        return {
            scope: false,
            restrict: 'A',
            link: function(scope, element, attrs) {
                var config = scope[attrs.echartConf];
                var option = scope[attrs.echartOpt];
                //获取图像主题
                var theme = (config && config.theme) ? config.theme : 'default';
                //实例化图表对象
                var chartInstance = echarts.init(element[0], theme);
                //配置项设置(
                if (config) {
                    if (config.style) {
                        var styleObj = config.style;
                        for (var key in styleObj) {
                            if (styleObj.hasOwnProperty(key)) {
                                element[0].style[key] = styleObj[key];
                            }
                        }
                        chartInstance.resize();
                    }
                }

                //数据配置
                if (option) {
                    chartInstance.setOption(option);
                }

                //注册设置的事件
                if (config && config.events) {
                    var events = config.events;
                    if (angular.isArray(events) && events.length > 0) {
                        events.map(function(elem) {
                            for (var m in elem) {
                                chartInstance.on(m, elem[m]);
                            }
                        });
                    }
                }
                //在scope中暴露chart的实例化对象
                if (attrs.name) {
                    scope[attrs.name] = chartInstance;
                }

                var timer;
                function onResize() {
                    $timeout.cancel(timer);
                    timer = $timeout(function() {
                        chartInstance.resize();
                    }, 200);
                }
                //如果一个页面有两个图，这里有bug
                angular.element($window).bind('resize', onResize);
                var unsubscribe = $rootScope.$on('resize',onResize);
                //scope销毁时，销毁echarts实例 ,注销resize监听 , 注销timeout
                scope.$on('$destroy', function() {
                    chartInstance.dispose();
                    unsubscribe();
                    angular.element($window).off('resize', onResize);
                    $timeout.cancel(timer);
                });
            }
        }
    }]);