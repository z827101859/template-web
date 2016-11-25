angular.module('adminApp')
    .provider('validator', [function() {
        var defaultRules = {
            required: '不能为空',
            maxlength: '输入值长度不能大于{maxlength}',
            minlength: '输入值长度不能小于{minlength}',
            repeat: '两次输入不一致',
            pattern: '输入格式不正确',
            max: '输入值不能大于{max}',
            min: '输入值不能小于{min}',
            datetimepattern: '日期格式不正确',
            bigerthanend: '不能大于最大日期{maxDate}',
            smallerthanstart: '不能小于最小日期{minDate}',
            betweendayscheck: '间隔日期不能超过{maxBetweenDays}天',
            uniquecheck: '该值已经存在，请重新输入',
            ipcheck: 'ip地址不正确',
            phonenumcheck: '手机号码不正确',
            numcheck: '请输入数字',
            emailcheck: 'email地址不正确'
        };
        var validatorFn = function() {
            this.elemTypes = ['text','password','select-one'];
            this.rules = {};
            this.displayWay = 'hover';
            this.isEmpty = function(object) {
                if (!object) {
                    return true;
                }
                if (object instanceof Array && object.length === 0) {
                    return true;
                }
                return false;
            };
            this.defaultShowError = function(elem, errorMessages) {
                if(!$.isArray(errorMessages) || errorMessages.length ==0){
                    return;
                };
                if(this.displayWay === 'hover'){
                    if(!elem.hasClass('valid-error')){
                        elem.addClass('valid-error');
                        elem.data('errors',errorMessages);
                    }
                }
                else{
                    var $group = elem.closest('.form-group');
                    if (!this.isEmpty($group) && !$group.hasClass('has-error')) {
                        $group.addClass('has-error');
                        $group.append('<div class="col-sm-3 fv-error">\
                                            <p class="form-control-static">\
                                                <span class="icon icon-exclamation-sign text-danger"></span>\
                                                <span class="text-muted">' + errorMessages[0] + '</span>\
                                            </p>\
                                        </div>');
                    }
                }
            };
            this.defaultRemoveError = function(elem) {
                if(this.displayWay === 'hover'){
                    if(elem.hasClass('valid-error')){
                        elem.removeClass('valid-error');
                        elem.removeData('errors');
                    }
                }
                else{
                    var $group = elem.closest('.form-group');
                    if (!this.isEmpty($group) && $group.hasClass('has-error')) {
                        $group.removeClass('has-error');
                        $group.find('.fv-error').remove();
                    }
                }
            };
        };
        validatorFn.prototype = {
            constructor: validatorFn,
            setRules: function(rules) {
                this.rules = rules;
            },
            setDisplayWay: function(displayWay) {
                this.displayWay = displayWay;
            },
            getErrorMessage: function(elem,error) {
                var msgTpl = null;
                var eName = elem.attr('name');
                if (!this.isEmpty(this.rules[eName]) && !this.isEmpty(this.rules[eName][error])) {
                    msgTpl = this.rules[eName][error];
                }
                if(msgTpl == null){
                    msgTpl = defaultRules[error];
                }
                if(msgTpl == null){
                    throw new Error('该验证规则(' + error + ')默认错误信息没有设置！');
                    return '';
                }
                switch (error) {
                    case 'maxlength':
                        msgTpl = msgTpl.replace('{maxlength}', elem.attr('ng-maxlength'));
                        break;
                    case 'minlength':
                        msgTpl = msgTpl.replace('{minlength}', elem.attr('ng-minlength'));
                        break;
                    case 'max':
                        msgTpl = msgTpl.replace('{max}', elem.attr('max'));
                        break;
                    case 'min':
                        msgTpl = msgTpl.replace('{min}', elem.attr('min'));
                        break;
                    case 'bigerthanend':
                        msgTpl = msgTpl.replace('{maxDate}', elem.attr('maxDate'));
                        break;
                    case 'smallerthanstart':
                        msgTpl = msgTpl.replace('{minDate}', elem.attr('minDate'));
                        break;
                    case 'betweendayscheck':
                        msgTpl = msgTpl.replace('{maxBetweenDays}', elem.attr('max-between-days'));
                        break;
                }
                return msgTpl;
            },
            getErrorMessages: function(elem, errors) {
                var elementErrors = [];
                for (var error in errors) {
                    if (errors[error]) {
                        var msg = this.getErrorMessage(elem,error);
                        elementErrors.push(msg);
                    }
                }
                return elementErrors;
            },
            showError: function(elem, errorMessages) {
                return this.defaultShowError(elem, errorMessages);
            },
            removeError: function(elem) {
                return this.defaultRemoveError(elem);
            }
        };
        var validator = new validatorFn();
        this.setRules = function(rules) {
            validator.setRules(rules);
        };
        this.setDisplayWay = function(displayWay) {
            validator.setDisplayWay(displayWay);
        };
        this.$get = function() {
            return validator;
        }
    }]);
