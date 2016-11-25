/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 计算剩余可输入字数
 */
angular.module('adminApp')
	.directive('countchars',['common',function(Common) {
	return {
		restrict: 'A',
		require : '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			var maxlimit = parseInt(attrs.countchars);
			var ele = element[0];
			var leftcountId = Common.createUUID();
			var leftcountEle = element.after('<div class="text-right">还可以输入<span id='+leftcountId+'>'+maxlimit+'</span>个字</div>').parent().find('#'+leftcountId);
			function textCounter(evt){
				if (ele.value.length > maxlimit){
					evt.preventDefault();
					var subValue = ele.value.substr(0, maxlimit);
					ngModelCtrl.$setViewValue(subValue);
					ele.value = subValue;
				}
				leftcountEle.text(maxlimit - ele.value.length);
			}
			$(ele).on('input propertychange',textCounter);
		}
	};
}]);