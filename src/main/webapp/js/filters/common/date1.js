/**
 * @ngdoc filter
 * @name adminApp.filter:date1
 * @function
 * @description  如果时间为0，返回空
 * # date1
 * Filter in the adminApp.
 */
angular.module('adminApp')
    .filter('date1',['$filter',function($filter) {
        return function(date,format) {
            if(date === 0){
                return '';
            }
            else{
                return $filter('date')(date,format);
            }
        };
    }]);
