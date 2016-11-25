/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 时间选择器
 * api参考地址 http://eonasdan.github.io/bootstrap-datetimepicker
 * 在scope作用域中提供 scope[attrs.name]（日期控件对象名称） scope[attrs.name+'fn']（日期控件对象方法）
 * 该控件的赋值支持 Long 格式，scope中的ng-model返回值为 Long 类型
 */
angular.module('adminApp')
	.directive('datetimepicker', ['dateformat',function(Dateformat) {
	return {
		restrict: 'A',
		require : '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			//判断日期格式是否正确
			var validFormat = function(str,format){
                if(str.length !== format.length)
                    return false;
                for(var i=0;i<format.length;i++){
                    if(format.charAt(i) === '-' || format.charAt(i) === ' ' || format.charAt(i) === '/'){
                        if(format.charAt(i) !== str.charAt(i))
                            return false;
                    }
                }
                return true;
            }
			//严格判断对象是否为日期类型
			var isDate = function(d){
				if(typeof d === 'object' && d != null && d instanceof Date && d.toString() !== 'Invalid Date')
					return true;
				if(typeof d === 'string' && validFormat(d,scope[attrs.name+'fn'].format()) && Dateformat.praseDate(d).toString() !== 'Invalid Date')
					return true;
				if(typeof d === 'number')
					return true;
				return false;
			}
			//控件默认配置
			var defaultOps = {
				calendarWeeks:false,
				format: 'YYYY-MM-DD HH:mm:ss',
				useStrict:true,
				locale: 'zh-cn',
				widgetPositioning : {
		            horizontal: 'left',
		            vertical: 'bottom'
		        },
		        keepInvalid:true,
		        keyBinds:false,
		        icons:{
		        	time: 'icon icon-time',
		            date: 'icon icon-calendar',
		            up: 'icon  icon-angle-up',
		            down: 'icon icon-angle-down',
		            previous: 'icon  icon-angle-left',
		            next: 'icon  icon-angle-right',
		            today: 'icon  icon-screenshot',
		            clear: 'icon  icon-trash'
		        }
		        ,ignoreReadonly:true
		        ,allowInputToggle:true
		        ,tooltips:{
		        	today: '',
		            clear: '',
		            close: '',
		            selectMonth: '',
		            prevMonth: '',
		            nextMonth: '',
		            selectYear: '',
		            prevYear: '',
		            nextYear: '',
		            selectDecade: '',
		            prevDecade: '',
		            nextDecade: '',
		            prevCentury: '',
		            nextCentury: '',
		            pickHour: '',
		            incrementHour: '',
		            decrementHour: '',
		            pickMinute: '',
		            incrementMinute: '',
		            decrementMinute: '',
		            pickSecond: '',
		            incrementSecond: '',
		            decrementSecond: '',
		            togglePeriod: '',
		            selectTime: ''
		        }
			};
			//用户自定义配置
			if(attrs.ngDtoptions){
				var ops = scope.$eval(attrs.ngDtoptions);
				for(var i in ops){
					if(i==='maxDate' || i==='minDate'){
						defaultOps[i] = Dateformat.praseDate(ops[i]);
						element.attr(i,Dateformat.toDateString(defaultOps[i],defaultOps.format));
					}
					else
						defaultOps[i] = ops[i];
				}
			}
			//初始化日期控件
			var datepickContainer = element.parent();
			scope[attrs.name] = datepickContainer.datetimepicker(defaultOps);
			scope[attrs.name+'fn'] = scope[attrs.name].data('DateTimePicker');
        	//绑定数据
        	if(ngModelCtrl){
		        scope.$watch(attrs.ngModel, function(newVal,oldVal){
	        		doAfterDateTimeChange(newVal);
		        });
				//监视日期输入框变化
                element.on('input propertychange blur',function(){
                    doAfterDateTimeChange(element.val());
                });
                // 强制更新一下
                element.blur(function() {
                	if(!scope.$$phase){
                		scope.$apply()
                	}
                });
                var doAfterDateTimeChange = function(newVal){
                	if(Dateformat.isDate(newVal,scope[attrs.name+'fn'].format())){
	        			var curDate = Dateformat.formatDate(newVal,defaultOps.format);
	        			element.val(Dateformat.toDateString(curDate,defaultOps.format));
	        			if(typeof newVal==='string'){
	        				if(attrs.returnType === 'milliseconds')
	        					ngModelCtrl.$setViewValue(curDate.getTime());
	        				else
	        					ngModelCtrl.$setViewValue(curDate);
	        			}
	        			//如果存在相关联的开始-结束日期，设置相关联日期的最大-最小值
	        			if(attrs.ngRefenddate){
        					//存在结束日期
        					var __curMaxDate = scope[attrs.ngRefenddate+'fn'].maxDate();
        					if(__curMaxDate && __curMaxDate.isBefore(curDate)){
        						//设置结束日期的最小值不能超过其本身的最大值
        						scope[attrs.ngRefenddate+'fn'].minDate(__curMaxDate);
        						scope[attrs.ngRefenddate].find('input').attr('minDate',Dateformat.toDateString(__curMaxDate,defaultOps.format));
        					}
        					else{
        						//设置结束日期的最小值为当前值
        						scope[attrs.ngRefenddate+'fn'].minDate(curDate);
        						scope[attrs.ngRefenddate].find('input').attr('minDate',Dateformat.toDateString(curDate,defaultOps.format));
        					}
        				}
        				if(attrs.ngRefbegindate){
        					//存在开始日期
        					var __curMinDate = scope[attrs.ngRefbegindate+'fn'].minDate();
        					if(__curMinDate && __curMinDate.isAfter(curDate)){
        						//设置开始日期的最大值不能超过其本身的最小值
        						scope[attrs.ngRefbegindate+'fn'].maxDate(__curMinDate);
        						scope[attrs.ngRefbegindate].find('input').attr('maxDate',Dateformat.toDateString(__curMinDate,defaultOps.format));
        					}
        					else{
        						//设置开始日期的最大值为当前值
        						scope[attrs.ngRefbegindate+'fn'].maxDate(curDate);
        						scope[attrs.ngRefbegindate].find('input').attr('maxDate',Dateformat.toDateString(curDate,defaultOps.format));
        					}
        				}
	        		}
                }

        	}
			scope.$on('$destroy', function () {
			    scope[attrs.name+'fn'].destroy();
			});

		}
	};
}]);