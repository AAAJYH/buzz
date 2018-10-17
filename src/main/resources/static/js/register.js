/*gt.sense.js*/
!function(global,factory){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=global.document?factory(global,!0):function(w){if(!w.document)throw new Error("Geetest requires a window with a document");return factory(w)}:factory(global)}("undefined"!=typeof window?window:this,function(window,noGlobal){"use strict";function _Object(obj){this._obj=obj}function Config(config){var self=this;new _Object(config)._each(function(key,value){self[key]=value})}if(void 0===window)throw new Error("Geetest requires browser environment");var document=window.document,head=(window.Math,document.getElementsByTagName("head")[0]);_Object.prototype={_each:function(process){var _obj=this._obj;for(var k in _obj)_obj.hasOwnProperty(k)&&process(k,_obj[k]);return this}},Config.prototype={protocol:"http://",static_servers:["static.geetest.com","dn-staticdown.qbox.me"],sense_path:"static/js/sense.js",type:"sense",_extend:function(obj){var self=this;new _Object(obj)._each(function(key,value){self[key]=value})}};var isNumber=function(value){return"number"==typeof value},isString=function(value){return"string"==typeof value},isBoolean=function(value){return"boolean"==typeof value},isFunction=function(value){return"function"==typeof value},loadScript=function(url,cb){var script=document.createElement("script");script.charset="UTF-8",script.async=!0,script.onerror=function(){cb(!0)};var loaded=!1;script.onload=script.onreadystatechange=function(){loaded||script.readyState&&"loaded"!==script.readyState&&"complete"!==script.readyState||(loaded=!0,setTimeout(function(){cb(!1)},0))},script.src=url,head.appendChild(script)},normalizeDomain=function(domain){return domain.replace(/^https?:\/\/|\/$/g,"")},normalizePath=function(path){return path=path.replace(/\/+/g,"/"),0!==path.indexOf("/")&&(path="/"+path),path},normalizeQuery=function(query){if(!query)return"";var q="?";return new _Object(query)._each(function(key,value){(isString(value)||isNumber(value)||isBoolean(value))&&(q=q+encodeURIComponent(key)+"="+encodeURIComponent(value)+"&")}),"?"===q&&(q=""),q.replace(/&$/,"")},makeURL=function(protocol,domain,path,query){domain=normalizeDomain(domain);var url=normalizePath(path)+normalizeQuery(query);return domain&&(url=protocol+domain+url),url},load=function(protocol,domains,path,query,cb){var tryRequest=function(at){var url=makeURL(protocol,domains[at],path,query);loadScript(url,function(err){err?at>=domains.length-1?cb(!0):tryRequest(at+1):cb(!1)})};tryRequest(0)},throwError=function(errorType,config){var errors={networkError:"网络错误",idNotExist:"参数id必填",cbIlegal:"callback必须是function",geetestNotExist:"Geetest不存在"};if("function"!=typeof config.onError)throw new Error(errors[errorType]);config.onError(errors[errorType])},detect=function(){return!!window.Geetest},initSense=function(userConfig,callback){var config=new Config(userConfig);return userConfig.https?config.protocol="https://":"http:"!==window.location.protocol&&"https:"!==window.location.protocol?config.protocol="https://":config.protocol=window.location.protocol+"//",userConfig&&userConfig.id?callback&&!isFunction(callback)?void throwError("cbIlegal",config):detect()?void(callback&&callback(new window.Geetest(config))):void load(config.protocol,config.static_servers,config.sense_path,null,function(err){if(err)throwError("networkError",config);else{if("undefined"==typeof window.Geetest)return void throwError("geetestNotExist",config);callback&&callback(new window.Geetest(config))}}):void throwError("idNotExist",config)};return window.initSense=initSense,initSense});
;
;(function (factory) {
    var validate = factory();
    // 判断极验类库是否加载进来
    if (typeof initSense === 'function') {
        window.JYValidate = validate;
    }
})(function () {

    /*模板模式，对主要流程进行抽象，在具体业务场景当中，根据具体业务根据单个流程可以进行复写*/
    var that, validateId = '00bf91b5f4baae9fbf9e4d7fe18ea7a3',
        mobileDom = $('input[name="mobile"]'),
        challengeDom = $('input[name="challenge"]'), phoneBtnDom;

    /**
     * 主动异常上报
     * @param data
     *
     * {
     *   type: 1||2  1-场景初始化失败 2-验证失败
     *   error:''  具体的异常信息
     * }
     */
    function sendError(data) {
        if (typeof mfwPageEvent !== 'undefined') {
            mfwPageEvent('default', 'geetest_for_regist', {
                type: data
            });
        }
    }

    return {
        formId: '_j_signup_mobile_form',
        btnClass: 'a.sms-code-send',
        /**
         * 初始化极验验证
         */
        init: function () {
            that = this;
            initSense({
                id: validateId,
                onError: function (err) {
                    // 场景加载失败
                    sendError(JSON.stringify({
                        type: 1,
                        err: err
                    }));
                }
            }, function (sense) {
                // 给发送按钮绑定 发送验证码逻辑
                that.bindSendPhoneCode(sense);
            });
        },
        /**
         * 绑定验证码发送事件
         * @param sense 场景验证对象
         */
        bindSendPhoneCode: function (sense) {
            $('#' + that.formId).delegate(that.btnClass, 'click', function (e) {
                e.preventDefault();

                // 发送验证码之前对表单进行验证
                if (!that.validate()) {
                    return false;
                }

                // 缓存验证码发送按钮
                phoneBtnDom = $(this);

                // 判断按钮是否处于倒计时状态
                if (phoneBtnDom.hasClass('disabled')) {
                    return;
                }

                var challengeVal = challengeDom.val();
                // 判断是否验证通过
                if (challengeVal) {
                    that.sendPhoneCode();
                } else {
                    // 绑定验证场景
                    that.sendValidate(sense, function (data) {
                        challengeDom.val(data.challenge);
                        that.sendPhoneCode();
                    });
                    // 打开验证弹窗
                    sense.sense();
                }

            });
        },
        /**
         * 注册场景验证事件
         * @param senseInfo
         * @param successCallBack
         */
        addSenseEvent(senseInfo, successCallBack) {
            senseInfo.onSuccess(function (data) {
                // 成功回调
                typeof  successCallBack === 'function' && successCallBack(data, that);

            }).onClose(function () {

            }).onError(function (err) {
                // 验证失败
                sendError(JSON.stringify({
                    type: 2,
                    err: err
                }));
            });
            // 事件注册完成以后删除掉事件注册方法
            this.addSenseEvent = null;
        },
        /**
         * 进项验证
         * @param sense  验证场景对象
         * @param successCallBack 验证成功回调
         */
        sendValidate: function (sense, successCallBack) {
            // 设置验证上传信息
            var mobileVal = $('input[name=mobile]').val();

            var senseInfoObj = sense.setInfos(function () {
                return {
                    idType: 1,
                    idValue: mobileVal,
                    interactive: 1
                }
            });
            // 注册验证事件
            this.addSenseEvent && this.addSenseEvent(senseInfoObj, successCallBack);
        },
        /**
         * 发送手机验证码
         * @param self 发送按钮的dom方法
         */
        sendPhoneCode: function () {
            // 发送验证请求
            that.postPhoneCode(that.getValidateParam(), that.dataCallback);
        },
        /**
         * 验证请求的回调函数 (各个验证场景，验证过后所做操作不一样,需要继承复写)
         * @param data
         * @param 当前作用域对象
         */
        dataCallback: function (data, self) {

        },
        /**
         * 启动发送按钮倒计时
         */
        startBtnAction: function () {
            var self = phoneBtnDom, mobileCodeTimer;
            self.addClass('disabled').data('time', 60).html('60秒后重新获取');
            clearInterval(mobileCodeTimer);
            // 启动短信验证码发送按钮倒计时
            mobileCodeTimer = setInterval(function () {
                var time = parseInt(self.data('time'));
                time--;
                if (time > 0) {
                    self.html(time + '秒后重新获取');
                } else {
                    self.removeClass('disabled').html('重新获取验证码');
                    clearInterval(mobileCodeTimer);
                }
                self.data('time', time);
            }, 1000);
        },
        /**
         * 获取进行表单验证的参数
         */
        getValidateParam: function () {
            return {
                mobile: mobileDom.val(),
                challenge: challengeDom.val()
            }
        },
        /**
         * 发送验证码验证请求
         * @param param
         * @param dataCallBack
         */
        postPhoneCode: function (param, dataCallBack) {
            /*$.getJSON('usersController/SendRegisterVerificationCode',param,function (data) {
                typeof  dataCallBack === 'function' && dataCallBack(data,that);
            });*/
            $.ajax({
                url:"usersController/SendRegisterVerificationCode",
                type:"post",
                dataType:"json",
                data:{bindPhone:$("#bindPhone").val()},
                success:function(data)
                {
                    typeof  dataCallBack === 'function' && dataCallBack(data,that);
                }
            });
        },
        /**
         * 在发送验证码之前对表单进行验证
         */
        validate: function () {
            return true;
        },
        /**
         * 清空极验返还的验证码
         */
        clearJYCode: function () {
            challengeDom.val('');
        }

    }
});;
/**
 * Created by Loin on 14-8-13.
 */
(function($) {

    function verification() {
        this.defaults = {
            submitClass: 'submit',
            submitCallback: null,
            loading: function() {

            },
            success: function() {

            },
            failed: function() {
                return false;
            },
            customFuncs: {}
        };

        this.allRules = {
            'phone': {
                'regex': /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/g
            },
            'postcode': {
                'regex': /^\d{6}$/g
            },
            'mobile': {
                //'regex': /^1\d{10}$/g
                'regex': /^(\d{11}|[0\+]\d+)$/g
            },
            'email': {
                'regex': /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/g
            },
            'date': {
                'regex': [
                    /^\d{4}-\d{2}-\d{2}$/g,
                    /^\d{4}\/\d{2}\/\d{2}$/g
                ]
            }
        };

        this.original = null; //原始对象
        this.options = {}; //基础配置
        this.timer = null;

        this.init = function(element, options) {
            var self = this;

            self.original = element;
            self.options = $.extend(true, {}, self.defaults, options);
            $(element).find('[class*=verification][type=text],[class*=verification][type=password],textarea[class*=verification]').bind('blur.verification', function() {
                self.verifyField($(this));
            });

            if(('form' === element.nodeName.toLowerCase())) {
                $(element).bind('submit.verification', function() {
                    if($(element).find('input[type="submit"]').hasClass('disabled')) {
                        return false;
                    }
                    self.verifyFields();
                    return self.manageSubmit();
                })
            } else {
                $(element).find('.' + self.options.submitClass).click(function() {
                    if($(this).hasClass('disabled')) {
                        return false;
                    }
                    self.verifyFields();
                    return self.manageSubmit();
                });
            }
        };

        this.manageSubmit = function() {
            var self = this;
            if($(self.original).find('[class*=verification][data-verification-result=failed]').size() > 0) {
                return false;
            } else if($(self.original).find('[class*=verification][data-verification-result=loading]').size() > 0) {
                this.timer = setTimeout(function() {
                    self.manageSubmit();
                }, 100);
                return false;
            } else if($(self.original).find('[class*=verification]').size() === $(self.original).find('[class*=verification][data-verification-result=success]').size()) {
                if(('form' === self.original.nodeName.toLowerCase())) {
                    if('function' === typeof self.options.submitCallback) {
                        self.options.submitCallback.call(self,  self.original);
                        return false;
                    } else {
                        $(self.original).unbind('submit.verification').submit();
                        return false;
                    }
                } else {
                    self.options.submitCallback.call(self,  self.original);
                    return false;
                }
            } else {
                return false;
            }

        };

        this.verifyFields = function() {
            var self = this,
                result = null;

            $(self.original).find('[class*=verification]').each(function() {
                var field = $(this);
                if(result !== false) {
                    result = self.verifyField(field);
                }
            });

            return result;
        };

        this.verifyField = function(field) {
            var self = this,
                fieldName = field.attr('data-verification-name') ? field.attr('data-verification-name') : '该项',
                rulesParsing = field.attr('class'),
                getRules = /verification\[(.*)\]/.exec(rulesParsing);

            if(!getRules)
                return false;

            var str = getRules[1],
                rules = str.split(/\[|,|\]/),
                required = false;

            for(var i = 0; i < rules.length; i++) {
                rules[i] = rules[i].replace(' ', '');
                if(rules[i] === '') {
                    delete rules[i];
                }
            }

            for(var i = 0; i < rules.length; i++) {
                switch (rules[i]) {
                    case 'required':
                        required = true;
                        if(!$.trim(field.val()) || field.val() == field.attr('data-verification-placeholder') || field.val() == field.attr('placeholder')) {
                            field.attr('data-verification-result', 'failed');
                            if('function' === typeof self.options.failed) {
                                self.options.failed.call(self, field, fieldName + '不能为空');
                            }
                            return false;
                        } else {
                            field.attr('data-verification-result', 'success');
                            if('function' === typeof self.options.success) {
                                self.options.success.call(self, field);
                            }
                        }
                        break;
                    case 'custom':
                        var customRule = rules[i + 1],
                            rule = self.allRules[customRule],
                            result;

                        if(rule) {
                            if(rule['regex']) {
                                if(rule.regex.length) {
                                    for(var j = 0; j < rule.regex.length; j++) {
                                        if(false === result) {
                                            break;
                                        }
                                        var ex = rule.regex[j],
                                            pattern = new RegExp(ex);
                                        if(required) {
                                            result = (!pattern.test(field.val()));
                                        } else {
                                            result = ('' !== $.trim(field.val()) && !pattern.test(field.val()));
                                        }
                                    }
                                } else {
                                    var ex = rule.regex,
                                        pattern = new RegExp(ex);

                                    if(required) {
                                        result = (!pattern.test(field.val()));
                                    } else {
                                        result = ('' !== $.trim(field.val()) && !pattern.test(field.val()));
                                    }
                                }

                                if(result) {
                                    field.attr('data-verification-result', 'failed');
                                    if('function' === typeof self.options.failed) {
                                        self.options.failed.call(self, field, fieldName + '格式不正确');
                                    }
                                    return false;
                                } else {
                                    field.attr('data-verification-result', 'success');
                                    if('function' === typeof self.options.success) {
                                        self.options.success.call(self, field);
                                    }
                                }
                            } else if(rule['func']) {
                                //ajax function validate
                            }
                        }

                        break;
                    case 'minSize':
                        var min = rules[i + 1],
                            len = field.val().length;
                        if(len < min) {
                            field.attr('data-verification-result', 'failed');
                            if('function' === typeof self.options.failed) {
                                self.options.failed.call(self, field, fieldName + '不能小于' + min + '个字符');
                            }
                            return false;
                        } else {
                            field.attr('data-verification-result', 'success');
                            if('function' === typeof self.options.success) {
                                self.options.success.call(self, field);
                            }
                        }
                        break;
                    case 'maxSize':
                        var max = rules[i + 1],
                            len = field.val().length;
                        if(len > max) {
                            field.attr('data-verification-result', 'failed');
                            if('function' === typeof self.options.failed) {
                                self.options.failed.call(self, field, fieldName + '不能大于' + max + '个字符');
                            }
                            return false;
                        } else {
                            field.attr('data-verification-result', 'success');
                            if('function' === typeof self.options.success) {
                                self.options.success.call(self, field);
                            }
                        }
                        break;
                    case 'equals':
                        var name = rules[i + 1];
                        if(field.val() != $(self.original).find('input[name="' + name + '"]').val()) {
                            field.attr('data-verification-result', 'failed');
                            if('function' === typeof self.options.failed) {
                                self.options.failed.call(self, field, '输入的' + fieldName + '不一致');
                            }
                            return false;
                        } else {
                            field.attr('data-verification-result', 'success');
                            if('function' === typeof self.options.success) {
                                self.options.success.call(self, field);
                            }
                        }
                        break;
                    case 'ajax':
                        var key = rules[i + 1],
                            val = field.val();
                        switch (key) {
                            case 'checkEmail':
                                field.attr('data-verification-result', 'loading');
                                self.options.loading.call(self, field, '正在验证...');
                                $.post('/ajax/ajax_email.php', {'email': val}, function(d) {
                                    if(d.ret == 1) {
                                        field.attr('data-verification-result', 'success');
                                        if('function' === typeof self.options.success) {
                                            self.options.success.call(self, field);
                                        }
                                        return false;
                                    } else if(d.ret == 2) {
                                        field.attr('data-verification-result', 'failed');
                                        if('function' === typeof self.options.failed) {
                                            self.options.failed.call(self, field, fieldName + '格式不正确');
                                        }
                                    } else if(d.ret == 3) {
                                        field.attr('data-verification-result', 'failed');
                                        if('function' === typeof self.options.failed) {
                                            self.options.failed.call(self, field, fieldName + '已经存在');
                                        }
                                    }
                                }, 'json');
                                break;
                            case 'checkMobile':
                                field.attr('data-verification-result', 'loading');
                                self.options.loading.call(self, field, '正在验证...');
                                $.post('/ajax/ajax_mobile.php', {'action': 'verifymobile', 'mobile': val}, function(d) {
                                    if(d.ret == 1) {
                                        field.attr('data-verification-result', 'success');
                                        if('function' === typeof self.options.success) {
                                            self.options.success.call(self, field);
                                        }
                                        return false;
                                    } else if(d.ret == 3) {
                                        field.attr('data-verification-result', 'failed');
                                        if('function' === typeof self.options.failed) {
                                            self.options.failed.call(self, field, fieldName + '格式不正确');
                                        }
                                    } else if(d.ret == 2) {
                                        field.attr('data-verification-result', 'failed');
                                        if('function' === typeof self.options.failed) {
                                            self.options.failed.call(self, field, fieldName + '已经存在');
                                        }
                                    }
                                }, 'json');
                                break;
                            case 'checkMCode':
                                field.attr('data-verification-result', 'loading');
                                self.options.loading.call(self, field, '正在验证...');
                                $.post('/ajax/ajax_mobile.php', {'action': 'nlmvc', 'mobile': $(self.original).find('input[name="' + rules[i + 2] + '"]').val(), 'v_code': val}, function(d) {
                                    if(d.ret == 1) {
                                        field.attr('data-verification-result', 'success');
                                        if('function' === typeof self.options.success) {
                                            self.options.success.call(self, field);
                                        }
                                        return false;
                                    } else {
                                        field.attr('data-verification-result', 'failed');
                                        if('function' === typeof self.options.failed) {
                                            self.options.failed.call(self, field, fieldName + '输入有误');
                                        }
                                    }
                                }, 'json');
                                break;
                            default: break;
                        }
                        break;
                    case 'funcCall':
                        field.attr('data-verification-result', 'loading');
                        var functionName = rules[i + 1],
                            fn;
                        if(functionName.indexOf('.') > -1) {
                            var namespaces = functionName.split('.'),
                                scope = window;
                            while(namespaces.length) {
                                scope = scope[namespaces.shift()];
                            }
                            fn = scope;
                        } else {
                            fn = window[functionName] || self.options.customFuncs[functionName];
                        }
                        if('function' == typeof(fn)) {
                            fn(field);
                        }
                        break;
                    default: break;
                }
            }
        }
    }

    $.verification = {
        init: function(object, options) {
            return object.each(function() {
                var opts = $.extend(true, {}, options),
                    obj;

                obj = new verification();
                obj.init(this, opts);
                $.data(this, 'verification', obj);
            });
        },
        verifyField: function(object, field) {
            var verification = object.data('verification');

            if(!verification || !field.size()) {
                return undefined;
            }

            return verification.verifyField(field);
        },
        verifySuccess: function(field) {
            field.attr('data-verification-result', 'success');
        },
        verifyFailed: function(field) {
            field.attr('data-verification-result', 'failed');
        }
    };

    $.fn.verification = function(method) {
        var args = arguments;
        if('undefined' !== typeof $.verification[method]) {
            args = Array.prototype.concat.call([args[0]], [this], Array.prototype.slice.call(args, 1));
            return $.verification[method].apply($.verification, Array.prototype.slice.call(args, 1));
        } else if('object' === typeof method || !method) {
            Array.prototype.unshift.call(args, this);
            return $.verification.init.apply($.verification, args);
        } else {
            console.log('Method "' + method + '" does not exist in verification');
        }
    };
})(jQuery);;
/**
 * Created by Loin on 14/10/27.
 */
$(function () {

    if (typeof JYValidate === 'object') {
        $.extend(JYValidate, {
            dataCallback: function (data, self) {
                if (!data['error_code']) {
                    // 启动按钮倒计时
                    self.startBtnAction();
                } else if (data['error_code'] == 10002) {
                    // 清空验证码
                    self.clearJYCode();
                    /*code.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                    code.closest('.form-field').find('.verify-code-send').trigger('click');*/
                    // $.verification.verifyFailed(code);
                } else {
                    self.clearJYCode();
                    alert(data['message']);
                    /*code.closest('.form-field').find('.err-tip').html(data['message']).show();*/
                }
            }
        });
        JYValidate.init();
    }

    var resetForm = function () {
        $('[type="text"],[type="password"]', '.signup-forms').val('');
        $('.err-tip', '.signup-forms').html('').hide();
    };

    var clearAlerts = function () {
        $('.alert').remove();
    };

    var toBindBox = function () {
        resetForm();
        clearAlerts();
        $('.signup-forms').toggleClass('flip');
    };

    var toCompleteBox = function () {
        resetForm();
        clearAlerts();
        $('.signup-forms').toggleClass('flip');
    };

    var toSignupBox = function () {
        resetForm();
        clearAlerts();
        $('.signup-forms').toggleClass('flip');
    };

    var toLoginBox = function () {
        resetForm();
        clearAlerts();
        $('.signup-forms').toggleClass('flip');
    };

    $('#_j_bind_box').delegate('.bottom-link a', 'click', function (e) {
        e.preventDefault();
        toCompleteBox();
    });

    $('#_j_complete_box').delegate('.bottom-link a', 'click', function (e) {
        e.preventDefault();
        toBindBox();
    });

    $('#_j_login_box').delegate('.bottom-link a', 'click', function (e) {
        e.preventDefault();
        toSignupBox();
    });

    $('#_j_signup_box').delegate('.bottom-link a', 'click', function (e) {
        e.preventDefault();
        toLoginBox();
    });

    $('#_j_signup_form').delegate('.form-link a', 'click', function (e) {
        e.preventDefault();
        var input = $('[name="passport"]', '#_j_signup_form').val('');
        var info = $('.info-tip', '#_j_signup_form');
        input.next('.err-tip').html('').hide();
        if ('mobile' === input.attr('data-type')) {
            input.attr('data-type', 'email')
                .attr('placeholder', '您的邮箱')
                .attr('data-verification-name', '邮箱')
                .attr('class', input.attr('class').replace('custom[mobile]', 'custom[email]'));
            info.hide();
            $(this).text('使用手机号码注册');
        } else {
            input.attr('data-type', 'mobile')
                .attr('placeholder', '您的手机号码')
                .attr('data-verification-name', '手机号码')
                .attr('class', input.attr('class').replace('custom[email]', 'custom[mobile]'));
            info.show();
            $(this).text('使用邮箱注册');
        }
    });

    $('.connect .more').on('click', function (e) {
        e.preventDefault();
        $('.connect .bd').toggleClass('open');
    });

    $('#_j_forget_form').delegate('.form-link a', 'click', function (e) {
        e.preventDefault();
        var input = $('[name="passport"]', '#_j_forget_form').val('');
        input.next('.err-tip').html('').hide();
        if ('mobile' === input.attr('data-type')) {
            input.attr('data-type', 'email')
                .attr('placeholder', '您的邮箱')
                .attr('data-verification-name', '邮箱')
                .attr('class', input.attr('class').replace('custom[mobile]', 'custom[email]'));
            $(this).text('使用手机号码找回');
        } else {
            input.attr('data-type', 'mobile')
                .attr('placeholder', '您的手机号码')
                .attr('data-verification-name', '手机号码')
                .attr('class', input.attr('class').replace('custom[email]', 'custom[mobile]'));
            $(this).text('使用邮箱找回');
        }
    });


    $('.signup-forms').delegate('a.verify-code-send', 'click', function (e) {
        e.preventDefault();
        var codeImg = $(this).find('img');
        codeImg.attr('src', codeImg.data('src') + '?' + new Date().getTime());
    });

    $('#_j_complete_form').verification({
        customFuncs: {
            checkCode: function (field) {
                var code = $.trim(field.val());
                $.get('/api.php/checkCode', {
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                        field.closest('.form-field').find('.verify-code-send').trigger('click');
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            },
            checkSMSCode: function (field) {
                var mobile = $('[name="mobile"]', '#_j_complete_form').val();
                var code = $.trim(field.val());
                $.get('/api.php/checkSMSCode', {
                    mobile: mobile,
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('短信验证码不正确或已过期').show();
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_complete_form').delegate('a.sms-code-send', 'click', function (e) {
        e.preventDefault();
        var self = $(this);
        if (self.hasClass('disabled')) {
            return;
        }
        var mobile = $('[name="mobile"]', '#_j_complete_form');
        var code = $('[name="code"]', '#_j_complete_form');
        $.getJSON('/api.php/generateSMSCode', {
            mobile: mobile.val(),
            code: code.val()
        }, function (data) {
            if (!data['error_code']) {
                self.addClass('disabled').data('time', 60).html('60秒后重新获取');
                clearInterval(mobileCodeTimer);
                mobileCodeTimer = setInterval(function () {
                    var time = parseInt(self.data('time'));
                    time--;
                    if (time > 0) {
                        self.html(time + '秒后重新获取');
                    } else {
                        self.removeClass('disabled').html('重新获取验证码');
                        clearInterval(mobileCodeTimer);
                    }
                    self.data('time', time);
                }, 1000);
            } else if (data['error_code'] == 10002) {
                code.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                code.closest('.form-field').find('.verify-code-send').trigger('click');
                $.verification.verifyFailed(code);
            } else {
                code.closest('.form-field').find('.err-tip').html(data['message']).show();
            }
        });
    });

    $('#_j_login_form').verification({
        customFuncs: {
            checkShowCode: function (field) {
                var passport = $.trim(field.val());
                $.get('/api.php/checkShowCode', {
                    passport: passport
                }, function (data) {
                    $.verification.verifySuccess(field);
                    if (data) {
                        var codeInput = $('input[name="code"]', '#_j_login_form');
                        var codeField = codeInput.closest('.form-field');
                        if (codeField.is(':hidden')) {
                            codeInput.attr('class', codeInput.attr('class').replace('verification[checkCode]', 'verification[required,funcCall[checkCode]]'));
                            codeField.show();
                            $.verification.verifyFailed(codeInput);
                        }
                    }
                });
            },
            checkCode: function (field) {
                if (field.closest('.form-field').is(':hidden')) {
                    $.verification.verifySuccess(field);
                    return;
                }
                var code = $.trim(field.val());
                $.get('/api.php/checkCode', {
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                        field.closest('.form-field').find('.verify-code-send').trigger('click');
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_signup_form').verification({
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_signup_mobile_form').verification({
        customFuncs: {
            checkSuperCode: function (field) {
                var code = $.trim(field.val());
                $.get('/api.php/checkSuperCode', {
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                        field.closest('.form-field').find('.verify-code-send').trigger('click');
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            },
            checkSMSCode: function (field) {
                var mobile = $('[name="mobile"]', '#_j_signup_mobile_form').val();
                var code = $.trim(field.val());
               $.get('usersController/checksmsCode', {
                   bindPhone: mobile,
                   verificationCode: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('短信验证码不正确或已过期').show();
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            },
            checkPasswordStrong: function (field) {
                var value = $.trim(field.val());
                var preg = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
                if(!preg.test(value)) {
                    field.closest('.form-field').find('.err-tip').html('密码过于简单，需包含字母和数字').show();
                    $.verification.verifyFailed(field);
                } else {
                    field.closest('.form-field').find('.err-tip').html('').hide();
                    $.verification.verifySuccess(field);
                }
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_signup_mail_form').verification({
        customFuncs: {
            checkCode: function (field) {
                var code = $.trim(field.val());
                $.get('/api.php/checkCode', {
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                        field.closest('.form-field').find('.verify-code-send').trigger('click');
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_send_verify_form').verification({
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_forget_form').verification({
        customFuncs: {
            checkCode: function (field) {
                var code = $.trim(field.val());
                $.get('/api.php/checkCode', {
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('验证码不正确').show();
                        field.closest('.form-field').find('.verify-code-send').trigger('click');
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_forget_mobile_form').verification({
        customFuncs: {
            checkSMSCode: function (field) {
                var mobile = $('[name="mobile"]', '#_j_forget_mobile_form').val();
                var code = $.trim(field.val());
                if(code)
                $.get('/api.php/checkSMSCode', {
                    mobile: mobile,
                    code: code
                }, function (data) {
                    if (!data) {
                        field.closest('.form-field').find('.err-tip').html('短信验证码不正确或已过期').show();
                        $.verification.verifyFailed(field);
                    } else {
                        field.closest('.form-field').find('.err-tip').html('').hide();
                        $.verification.verifySuccess(field);
                    }
                });
            },
            checkPasswordStrong: function (field) {
                var value = $.trim(field.val());
                var preg = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
                if(!preg.test(value)) {
                    field.closest('.form-field').find('.err-tip').html('密码过于简单，需包含字母和数字').show();
                    $.verification.verifyFailed(field);
                } else {
                    field.closest('.form-field').find('.err-tip').html('').hide();
                    $.verification.verifySuccess(field);
                }
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_reset_mobile_form').verification({
        customFuncs: {
            checkPasswordStrong: function (field) {
                var value = $.trim(field.val());
                var preg = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
                if(!preg.test(value)) {
                    field.closest('.form-field').find('.err-tip').html('密码过于简单，需包含字母和数字').show();
                    $.verification.verifyFailed(field);
                } else {
                    field.closest('.form-field').find('.err-tip').html('').hide();
                    $.verification.verifySuccess(field);
                }
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });

    $('#_j_forget_mail_form').verification({
        customFuncs: {
            checkPasswordStrong: function (field) {
                var value = $.trim(field.val());
                var preg = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
                if(!preg.test(value)) {
                    field.closest('.form-field').find('.err-tip').html('密码过于简单，需包含字母和数字').show();
                    $.verification.verifyFailed(field);
                } else {
                    field.closest('.form-field').find('.err-tip').html('').hide();
                    $.verification.verifySuccess(field);
                }
            }
        },
        success: function (field) {
            field.closest('.form-field').find('.err-tip').html('').hide();
        },
        failed: function (field, message) {
            field.closest('.form-field').find('.err-tip').html(message).show();
        }
    });
});;
