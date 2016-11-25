angular.module('adminApp')
    .value('currency1', 'CN')
    .value('currency1', 'CN1')
    .constant('currency2', 'EN')
    .constant('currency2', 'EN1')
    .provider("calculator", function() {
        var currency = "美元";
        this.setLocal = function(l) {
            currency = l;
        };
        this.$get = function() {
            return {
                getLocal: function() {
                    return currency;
                },
                add: function(a, b) {
                    return (a + b)+this.getLocal(); },
                subtract: function(a, b) {
                    return (a - b)+this.getLocal(); },
                multiply: function(a, b) {
                    return (a * b)+this.getLocal(); },
                divide: function(a, b) {
                    return (a / b)+this.getLocal(); }
            }
        };
    })
    .config(['$provide','calculatorProvider',function($provide,calculatorProvider) {
        //decorator可以装饰除了constant之外的任何service的，并且可以提供类似于后端的AOP概念的编程的效果。
        $provide.decorator('currency1', function ($delegate) {
            return $delegate + ' - china';
        });
        $provide.decorator('calculator', function ($delegate) {
            var fn = $delegate.add;
            $delegate.add = function(){
                console.log('beigin add');
                return fn.apply($delegate,arguments);
            };
            return $delegate;
        });
        $provide.decorator('demoService', function ($delegate) {
            var fn = $delegate.getDemoTableList;
            $delegate.getDemoTableList = function(){
                console.log('beigin getDemoTableList');
                return fn.apply($delegate,arguments);
            };
            return $delegate;
        });
        calculatorProvider.setLocal("人民币");
    }]);
//provider的非语法糖写法
// .config(['$provide', function($provide) {
//     $provide.provider('calculator', function() {
//         var currency = "美元";
//         this.setLocal = function(l) {
//             currency = l;
//         };
//         this.$get = function() {
//             return {
//                 getLocal: function() {
//                     return currency;
//                 },
//                 add: function(a, b) {
//                     return (a + b)+this.getLocal();
//                 },
//                 subtract: function(a, b) {
//                     return (a - b)+this.getLocal();
//                 },
//                 multiply: function(a, b) {
//                     return (a * b)+this.getLocal();
//                 },
//                 divide: function(a, b) {
//                     return (a / b)+this.getLocal();
//                 }
//             }
//         };
//     });
// }])
