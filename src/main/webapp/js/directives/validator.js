/**
 * @ngdoc directive
 * @author sweetyx
 * @description
 * 校验指令
 */
angular.module('adminApp')
    .directive('formValidator', ['validator', 'common', function(validator, Common) {
        function validEle($elem,formName,scope){
            var eName = $elem.attr('name');
            var elemDisplay = $elem.is(':hidden');
            var elemDisabled = $elem.is(':disabled');
            var elemCtrl = scope[formName][eName];
            if (eName && elemCtrl){
                if (elemDisplay || elemDisabled) {
                    //隐藏元素和禁用元素不校验
                    var errors = elemCtrl.$error;
                    for (var error in errors) {
                        elemCtrl.$setValidity(error, true);
                    };
                }
                else{
                    validator.removeError($elem);
                    if(!elemCtrl.$valid) {
                        var elementErrors = validator.getErrorMessages($elem, elemCtrl.$error);
                        validator.showError($elem, elementErrors);
                    }
                }
            }
        };
        function showTip($elem){
            if($elem.hasClass('valid-error')){
                var errors = $elem.data('errors');
                var errorStr = '';
                for(var i=0;i<errors.length;i++){
                    errorStr = errorStr + (i+1) + '：' + errors[i] + '<br/>';
                };
                var pos = $elem.offset();
                errorTip.append(errorStr);
                var left = pos.left + $elem.outerWidth() + 10;
                var top = pos.top + $elem.outerHeight()/2 - errorTip.outerHeight()/2;
                top>0 ? top : top = 0 ;
                errorTip.css({
                    left : left,
                    top : top
                });
                errorTip.show();
            }
        };
        function hideTip($elem){
            if($elem.hasClass('valid-error')){
                errorTip.html('');
                errorTip.hide();
            }
        };
        var elemQueryStr = 'input[type="text"],input[type="password"],textarea,select,.js-customcheck';
        var errorTipHtml = '<div id="form-validator-error-tip" class="form-error-tip" style="display:none;"></div>';
        $(document.body).append(errorTipHtml);
        var errorTip = $('#form-validator-error-tip');
        return {
            controller: function($scope) {
                this.form = null;
                this.doValidate = function(success) {
                    if (angular.isFunction(this.form.doValidate)) {
                        this.form.doValidate();
                    }
                    if (this.form.$valid && angular.isFunction(success)) {
                        $scope.$apply(function() {
                            success($scope);
                        });
                    }
                }
            },
            link: function(scope, form, attr, ctrl) {
                var formElem = form[0];
                var formName = form.attr('name');
                $(formElem).on('blur.autocheck',elemQueryStr,function(){
                    validEle($(this),formName,scope);
                });
                //错误提示方式
                var displayWay = attr.displayWay || 'normal';
                validator.setDisplayWay(displayWay);
                if(displayWay==='hover'){
                    $(formElem).on('mouseover.autocheck',elemQueryStr,function(evt){
                        showTip($(this));
                    });
                    $(formElem).on('mouseout.autocheck',elemQueryStr,function(){
                        hideTip($(this));
                    });
                    $(formElem).on('input.autocheck',elemQueryStr,function(){
                        hideTip($(this));
                    });
                };
                //显示验证是否通过
                var doValidate = function() {
                    //防止有动态生成的表单元素不校验，每次校验都取一遍所有元素
                    var needValidateEles = $(formElem).find(elemQueryStr);
                    for (var i = 0; i < needValidateEles.length; i++) {
                        validEle($(needValidateEles[i]),formName,scope);
                    };
                };
                ctrl.form = scope[formName];
                scope[formName].doValidate = doValidate;
                scope.$on('$destroy', function() {
                    $(formElem).off('blur mouseover mouseout input');
                });
            }
        };
    }])
    .directive('formSubmit', ['$parse', function($parse) {
        return {
            require: '^formValidator',
            link: function(scope, element, attr, ctrl) {
                var validSuccessFn = $parse(attr.formSubmit);
                element.on('click.fromSubmit', function() {
                    ctrl.doValidate(validSuccessFn);
                });
                scope.$on('$destroy', function() {
                    element.off('click.fromSubmit');
                });
            }
        };
    }])
    .directive('formRepeat', ['validator', function(validator) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var otherInput = scope[elem.parents('form').attr('name')][attrs.formRepeat];
                ctrl.$parsers.push(function(value) {
                    if (value === otherInput.$viewValue) {
                        ctrl.$setValidity('repeat', true);
                        validator.removeError(elem);
                        return value;
                    } else {
                        ctrl.$setValidity('repeat', false);
                        return value;
                    }
                });
                otherInput.$parsers.push(function(value) {
                    ctrl.$setValidity('repeat', value === ctrl.$viewValue);
                    validator.removeError(elem);
                    return value;
                });
            }
        };
    }])
    .directive('uniquecheck', ['$timeout', '$http', 'validator', 'common', function($timeout, $http, validator, Common) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var notShowError = typeof elem.parents('form').attr('form-validator') === 'undefined';
                function removeAndShowError(){
                    validator.removeError(elem);
                    if(notShowError){
                        return;
                    }
                    var errorMessages = validator.getErrorMessages(elem, ctrl.$error);
                    validator.showError(elem, errorMessages);
                }

                var checkUrl = attrs.checkUrl;
                var setOk = function() {
                    ctrl.$setValidity('uniquecheck', true);
                    removeAndShowError();
                }
                var setFail = function() {
                    ctrl.$setValidity('uniquecheck', false);
                    removeAndShowError();
                };
                var doValidate = function(v) {
                    Common.post(checkUrl + '?key=' + v).then(function(data) {
                        if (data === true) {
                            setOk();
                        } else {
                            setFail();
                        }
                    },function(){
                        setFail();
                    });
                };
                elem.on('blur.uniquecheck', function() {
                    var v = elem.val();
                    if (Common.isEmpty(v)) {
                        ctrl.$setValidity('uniquecheck', true);
                        validator.removeError(elem);
                        removeAndShowError();
                    } else {
                        doValidate(v);
                    }
                });
                scope.$on('$destroy', function() {
                    elem.off('blur.uniquecheck');
                });
            }
        };
    }])
    .directive('datetimecheck', ['validator', 'dateformat', function(validator, Dateformat) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var notShowError = typeof elem.parents('form').attr('form-validator') === 'undefined';
                function removeAndShowError(){
                    validator.removeError(elem);
                    if(notShowError){
                        return;
                    }
                    var errorMessages = validator.getErrorMessages(elem, ctrl.$error);
                    validator.showError(elem, errorMessages);
                }
                var formatStr = scope[attrs.name + 'fn'].format();
                //监视日期最大值
                scope.$watch(function() {
                    return scope[attrs.name + 'fn'].maxDate()._d;
                },function(newVal, oldVal) {
                    var curDate = Dateformat.praseDate(ctrl.$viewValue);
                    if (newVal && ctrl.$valid && Dateformat.isDate(curDate, formatStr) && Dateformat.formatDate(curDate, formatStr).getTime() > Dateformat.formatDate(newVal, formatStr).getTime()) {
                        ctrl.$setValidity('bigerthanend', false);
                    } else {
                        ctrl.$setValidity('bigerthanend', true);
                    }
                    removeAndShowError();
                }, true);
                //监视日期最小值
                scope.$watch(function() {
                    return scope[attrs.name + 'fn'].minDate()._d;
                },function(newVal, oldVal) {
                    var curDate = Dateformat.praseDate(ctrl.$viewValue);
                    if (newVal && ctrl.$valid && Dateformat.isDate(curDate, formatStr) && Dateformat.formatDate(curDate, formatStr).getTime() < Dateformat.formatDate(newVal, formatStr).getTime()) {
                        ctrl.$setValidity('smallerthanstart', false);
                    } else {
                        ctrl.$setValidity('smallerthanstart', true);
                    }
                    removeAndShowError();
                }, true);
                //监视日期格式
                scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                    //为空时不验证
                    if (angular.isUndefined(newVal) || newVal == null || newVal === '') {
                        ctrl.$setValidity('datetimepattern', true);
                        ctrl.$setValidity('bigerthanend', true);
                        ctrl.$setValidity('smallerthanstart', true);
                        removeAndShowError();
                        return;
                    }
                    //验证是否为时间格式
                    if (Dateformat.isDate(newVal, formatStr)) {
                        var curDate = Dateformat.praseDate(newVal);
                        ctrl.$setValidity('datetimepattern', true);
                        //验证不能大于最大日期
                        if (scope[attrs.name + 'fn'].maxDate() && Dateformat.formatDate(scope[attrs.name + 'fn'].maxDate()._d, formatStr).getTime() < Dateformat.formatDate(curDate, formatStr).getTime()) {
                            ctrl.$setValidity('bigerthanend', false);
                        } else{
                            ctrl.$setValidity('bigerthanend', true);
                        }
                        //验证不能小于最小日期
                        if (scope[attrs.name + 'fn'].minDate() && Dateformat.formatDate(scope[attrs.name + 'fn'].minDate()._d, formatStr).getTime() > Dateformat.formatDate(curDate, formatStr).getTime()) {
                            ctrl.$setValidity('smallerthanstart', false);
                        } else{
                            ctrl.$setValidity('smallerthanstart', true);
                        }
                        removeAndShowError();
                    } else {
                        ctrl.$setValidity('datetimepattern', false);
                        ctrl.$setValidity('bigerthanend', true);
                        ctrl.$setValidity('smallerthanstart', true);
                        removeAndShowError();
                    }
                });
            }
        };
    }])
    .directive('betweendayscheck', ['validator', 'dateformat', function(validator, Dateformat) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var notShowError = typeof elem.parents('form').attr('form-validator') === 'undefined';
                function removeAndShowError(){
                    validator.removeError(elem);
                    if(notShowError){
                        return;
                    }
                    var errorMessages = validator.getErrorMessages(elem, ctrl.$error);
                    validator.showError(elem, errorMessages);
                }
                var formatStr = scope[attrs.name + 'fn'].format();
                var betweenDays = attrs.maxBetweenDays;
                var beginDateInputEle = scope[attrs.ngRefbegindate].find('input');
                var doValid = function() {
                    //为空时不验证
                    var beginDateVal = beginDateInputEle.val();
                    var endDateVal = elem.val();
                    if (angular.isUndefined(endDateVal) || endDateVal == null || endDateVal === '' ||
                        angular.isUndefined(beginDateVal) || beginDateVal == null || beginDateVal === '') {
                        ctrl.$setValidity('betweendayscheck', true);
                        removeAndShowError();
                        return;
                    }
                    //不是时间格式不验证
                    if (!Dateformat.isDate(endDateVal, formatStr) || !Dateformat.isDate(beginDateVal, formatStr)) {
                        ctrl.$setValidity('betweendayscheck', true);
                        removeAndShowError();
                        return;
                    }
                    var thisDate = Dateformat.formatDate(endDateVal, formatStr);
                    var beginDate = Dateformat.formatDate(beginDateVal, formatStr);
                    if ((thisDate.getTime() - beginDate.getTime()) / 86400000 > betweenDays) {
                        ctrl.$setValidity('betweendayscheck', false);
                    }
                    else{
                        ctrl.$setValidity('betweendayscheck', true);
                    }
                    removeAndShowError();
                };
                //监视ngModel和开始日期
                scope.$watch(function() {
                    return beginDateInputEle.val();
                },function(newVal, oldVal) {
                    doValid();
                });
                scope.$watch(function() {
                    return elem.val();
                }, function(newVal, oldVal) {
                    doValid();
                });
            }
        };
    }])
    .directive('required', ['common', 'validator', function(Common, validator) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var notShowError = typeof elem.parents('form').attr('form-validator') === 'undefined';
                function removeAndShowError(){
                    validator.removeError(elem);
                    if(notShowError){
                        return;
                    }
                    var errorMessages = validator.getErrorMessages(elem, ctrl.$error);
                    validator.showError(elem, errorMessages);
                }
                elem.parent().prev().prepend('<span class="text-danger">*&nbsp;</span>');
                var requiredValidator1 = function(newValue) {
                    if (Common.isEmpty(newValue) || (Common.isEmpty(newValue.key) && Common.isEmpty(newValue.url))) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                    if(ctrl.$dirty){
                        removeAndShowError();
                    }
                };
                var requiredValidator2 = function(newValue) {
                    if ($.isArray(newValue)) {
                        if (newValue.length === 0) {
                            ctrl.$setValidity('required', false);
                        } else {
                            ctrl.$setValidity('required', true);
                        }
                    } else if (typeof newValue === 'object') {
                        if ($.isEmptyObject(newValue)) {
                            ctrl.$setValidity('required', false);
                        } else {
                            ctrl.$setValidity('required', true);
                        }
                    } else {
                        if (newValue == 0) {
                            ctrl.$setValidity('required', false);
                        } else {
                            ctrl.$setValidity('required', true);
                        }
                    }
                    if(ctrl.$dirty){
                        removeAndShowError();
                    }
                };
                if (typeof elem.attr('fileupload') !== 'undefined') {
                    elem.addClass('js-customcheck');
                    scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                        requiredValidator1(newValue);
                    }, true);
                } else if (elem.attr('type') == 'button' || elem.attr('type') == 'list') {
                    elem.addClass('js-customcheck');
                    scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                        requiredValidator2(newValue);
                    }, true);
                }
            }
        };
    }])
    .directive('ipcheck', ['common', function(Common) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var regExp = Common.ipRegExp;
                scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                    if (!Common.isEmpty(newValue) && regExp.test(newValue) === false) {
                        ctrl.$setValidity('ipcheck', false);
                    } else {
                        ctrl.$setValidity('ipcheck', true);
                    }
                }, true);
            }
        };
    }])
    .directive('numcheck', ['common', function(Common) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var regExp = Common.numRegExp;
                scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                    if (!Common.isEmpty(newValue) && regExp.test(newValue) === false) {
                        ctrl.$setValidity('numcheck', false);
                    } else {
                        ctrl.$setValidity('numcheck', true);
                    }
                }, true);
            }
        };
    }])
    .directive('phonenumcheck', ['common', function(Common) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var regExp = Common.phoneRegExp;
                scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                    if (!Common.isEmpty(newValue) && regExp.test(newValue) === false) {
                        ctrl.$setValidity('phonenumcheck', false);
                    } else {
                        ctrl.$setValidity('phonenumcheck', true);
                    }
                }, true);
            }
        };
    }])
    .directive('emailcheck', ['common', function(Common) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var regExp = Common.emailRegExp;
                scope.$watch(attrs.ngModel, function(newValue, oldvalue) {
                    if (!Common.isEmpty(newValue) && regExp.test(newValue) === false) {
                        ctrl.$setValidity('emailcheck', false);
                    } else {
                        ctrl.$setValidity('emailcheck', true);
                    }
                }, true);
            }
        };
    }]);
