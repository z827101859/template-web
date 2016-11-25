/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 轮播图
 */
angular.module('adminApp')
    .directive('carousel', ['$rootScope','$timeout','common',function($rootScope,$timeout,Common) {
        return {
            restrict: 'A',
            template: '<div class="swiper-container">\
                            <div class="swiper-wrapper">\
                            </div>\
                        </div>',
            replace: true,
            link: function(scope, element, attrs) {
                var uuid = Common.createUUID();
                element.attr('id',uuid);
                //组织html结构
                var source = scope.$eval(attrs.carouselSource);
                var html = '';
                source.map(function(item){
                    html = html + '<div class="swiper-slide"><img class="img" src="' + item + '"></div>';
                });
                element.children().append(html);
                //轮播图配置项
            	var defaultOps = {
                    autoplay:3000,//自动切换的频率
                    speed:300,//每页切换的速度
                    loop:true,//是否循环切换
                    autoplayDisableOnInteraction:false,//操作轮播图停止自动滚动
                    resizeReInit:false,//窗口大小改变重新初始化
                    initialSlide :0,//默认显示第几屏
                    slidesPerView: 1,//每页显示大小
    		        paginationClickable: true,//小圆点是否可点
                    hasPagination : false,//是否需要小圆点
                    hasArrow : false//是否需要箭头
            	};
            	var ops = $.extend(true,defaultOps,scope.$eval(attrs.carouselOptions));
                //小圆点
                if(ops.hasPagination){
                    ops.pagination = '.pagination-' + uuid;
                    element.append('<div class="pagination pagination-'+ uuid +'"></div>');
                }
            	var swiper = new Swiper('#'+uuid,ops);
                //左右切换箭头
                if(ops.hasArrow){
                    element.append('<a class="arrow-left" href="javascript:void(0);"></a><a class="arrow-right" href="javascript:void(0);"></a>');
                    var arrowLeft = element.children('.arrow-left');
                    arrowLeft.on('click', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        swiper.swipePrev();
                    });
                    var arrowRight = element.children('.arrow-right');
                    arrowRight.on('click', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        swiper.swipeNext();
                    });
                    scope.$on('$destroy',function(){
                        arrowLeft.off('click');
                        arrowRight.off('click');
                    });
                }
                $timeout(function(){
                    swiper.resizeFix();
                },0);
                var unsubscribe = $rootScope.$on('resize',function(){
                    swiper.resizeFix();
                });

                scope.$on('$destroy',function(){
                    unsubscribe();
                    swiper.destroy();
                });
            }
        };
    }]);