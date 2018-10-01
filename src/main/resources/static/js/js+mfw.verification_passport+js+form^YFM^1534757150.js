(function(b) {
	function a() {
		this.defaults = {
			submitClass: "submit",
			submitCallback: null,
			loading: function() {},
			success: function() {},
			failed: function() {
				return false
			},
			customFuncs: {}
		};
		this.allRules = {
			phone: {
				regex: /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/g
			},
			postcode: {
				regex: /^\d{6}$/g
			},
			mobile: {
				regex: /^(\d{11}|[0\+]\d+)$/g
			},
			email: {
				regex: /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/g
			},
			date: {
				regex: [/^\d{4}-\d{2}-\d{2}$/g, /^\d{4}\/\d{2}\/\d{2}$/g]
			}
		};
		this.original = null;
		this.options = {};
		this.timer = null;
		this.init = function(e, d) {
			var c = this;
			c.original = e;
			c.options = b.extend(true, {}, c.defaults, d);
			b(e).find("[class*=verification][type=text],[class*=verification][type=password],textarea[class*=verification]").bind("blur.verification", function() {
				c.verifyField(b(this))
			});
			if (("form" === e.nodeName.toLowerCase())) {
				b(e).bind("submit.verification", function() {
					if (b(e).find('input[type="submit"]').hasClass("disabled")) {
						return false
					}
					c.verifyFields();
					return c.manageSubmit()
				})
			} else {
				b(e).find("." + c.options.submitClass).click(function() {
					if (b(this).hasClass("disabled")) {
						return false
					}
					c.verifyFields();
					return c.manageSubmit()
				})
			}
		};
		this.manageSubmit = function() {
			var c = this;
			if (b(c.original).find("[class*=verification][data-verification-result=failed]").size() > 0) {
				return false
			} else {
				if (b(c.original).find("[class*=verification][data-verification-result=loading]").size() > 0) {
					this.timer = setTimeout(function() {
						c.manageSubmit()
					}, 100);
					return false
				} else {
					if (b(c.original).find("[class*=verification]").size() === b(c.original).find("[class*=verification][data-verification-result=success]").size()) {
						if (("form" === c.original.nodeName.toLowerCase())) {
							if ("function" === typeof c.options.submitCallback) {
								c.options.submitCallback.call(c, c.original);
								return false
							} else {
								b(c.original).unbind("submit.verification").submit();
								return false
							}
						} else {
							c.options.submitCallback.call(c, c.original);
							return false
						}
					} else {
						return false
					}
				}
			}
		};
		this.verifyFields = function() {
			var d = this,
				c = null;
			b(d.original).find("[class*=verification]").each(function() {
				var e = b(this);
				if (c !== false) {
					c = d.verifyField(e)
				}
			});
			return c
		};
		this.verifyField = function(d) {
			var o = this,
				f = d.attr("data-verification-name") ? d.attr("data-verification-name") : "该项",
				p = d.attr("class"),
				y = /verification\[(.*)\]/.exec(p);
			if (!y) {
				return false
			}
			var q = y[1],
				l = q.split(/\[|,|\]/),
				m = false;
			for (var u = 0; u < l.length; u++) {
				l[u] = l[u].replace(" ", "");
				if (l[u] === "") {
					delete l[u]
				}
			}
			for (var u = 0; u < l.length; u++) {
				switch (l[u]) {
					case "required":
						m = true;
						if (!b.trim(d.val()) || d.val() == d.attr("data-verification-placeholder") || d.val() == d.attr("placeholder")) {
							d.attr("data-verification-result", "failed");
							if ("function" === typeof o.options.failed) {
								o.options.failed.call(o, d, f + "不能为空")
							}
							return false
						} else {
							d.attr("data-verification-result", "success");
							if ("function" === typeof o.options.success) {
								o.options.success.call(o, d)
							}
						}
						break;
					case "custom":
						var e = l[u + 1],
							g = o.allRules[e],
							n;
						if (g) {
							if (g.regex) {
								if (g.regex.length) {
									for (var s = 0; s < g.regex.length; s++) {
										if (false === n) {
											break
										}
										var x = g.regex[s],
											w = new RegExp(x);
										if (m) {
											n = (!w.test(d.val()))
										} else {
											n = ("" !== b.trim(d.val()) && !w.test(d.val()))
										}
									}
								} else {
									var x = g.regex,
										w = new RegExp(x);
									if (m) {
										n = (!w.test(d.val()))
									} else {
										n = ("" !== b.trim(d.val()) && !w.test(d.val()))
									}
								}
								if (n) {
									d.attr("data-verification-result", "failed");
									if ("function" === typeof o.options.failed) {
										o.options.failed.call(o, d, f + "格式不正确")
									}
									return false
								} else {
									d.attr("data-verification-result", "success");
									if ("function" === typeof o.options.success) {
										o.options.success.call(o, d)
									}
								}
							} else {
								if (g.func) {}
							}
						}
						break;
					case "minSize":
						var r = l[u + 1],
							v = d.val().length;
						if (v < r) {
							d.attr("data-verification-result", "failed");
							if ("function" === typeof o.options.failed) {
								o.options.failed.call(o, d, f + "不能小于" + r + "个字符")
							}
							return false
						} else {
							d.attr("data-verification-result", "success");
							if ("function" === typeof o.options.success) {
								o.options.success.call(o, d)
							}
						}
						break;
					case "maxSize":
						var t = l[u + 1],
							v = d.val().length;
						if (v > t) {
							d.attr("data-verification-result", "failed");
							if ("function" === typeof o.options.failed) {
								o.options.failed.call(o, d, f + "不能大于" + t + "个字符")
							}
							return false
						} else {
							d.attr("data-verification-result", "success");
							if ("function" === typeof o.options.success) {
								o.options.success.call(o, d)
							}
						}
						break;
					case "equals":
						var C = l[u + 1];
						if (d.val() != b(o.original).find('input[name="' + C + '"]').val()) {
							d.attr("data-verification-result", "failed");
							if ("function" === typeof o.options.failed) {
								o.options.failed.call(o, d, "输入的" + f + "不一致")
							}
							return false
						} else {
							d.attr("data-verification-result", "success");
							if ("function" === typeof o.options.success) {
								o.options.success.call(o, d)
							}
						}
						break;
					case "ajax":
						var B = l[u + 1],
							A = d.val();
						switch (B) {
							case "checkEmail":
								d.attr("data-verification-result", "loading");
								o.options.loading.call(o, d, "正在验证...");
								b.post("usersController/checkbindEmail", {
                                    bindEmail: A
								}, function(i) {
									if (i == 2) {
										d.attr("data-verification-result", "success");
										if ("function" === typeof o.options.success) {
											o.options.success.call(o, d)
										}
										return false
									} else {
										if (i == 3) {
											d.attr("data-verification-result", "failed");
											if ("function" === typeof o.options.failed) {
												o.options.failed.call(o, d, f + "格式不正确")
											}
										} else {
											if (i == 1) {
												d.attr("data-verification-result", "failed");
												if ("function" === typeof o.options.failed) {
													o.options.failed.call(o, d, f + "不存在")
												}
											}
										}
									}
								}, "json");
								break;
							case "checkMobile":
								d.attr("data-verification-result", "loading");
								o.options.loading.call(o, d, "正在验证...");
								b.post("usersController/checkbindPhone", {
                                    bindPhone: A
								}, function(i) {
									if (i == 2) {
										d.attr("data-verification-result", "success");
										if ("function" === typeof o.options.success) {
											o.options.success.call(o, d)
										}
										return false
									} else {
										if (i == 3) {
											d.attr("data-verification-result", "failed");
											if ("function" === typeof o.options.failed) {
												o.options.failed.call(o, d, f + "格式不正确")
											}
										} else {
											if (i == 1) {
												d.attr("data-verification-result", "failed");
												if ("function" === typeof o.options.failed) {
													o.options.failed.call(o, d, f + "不存在")
												}
											}
										}
									}
								}, "json");
								break;
							case "checkMCode":
								d.attr("data-verification-result", "loading");
								o.options.loading.call(o, d, "正在验证...");
								b.post("/ajax/ajax_mobile.php", {
									action: "nlmvc",
									mobile: b(o.original).find('input[name="' + l[u + 2] + '"]').val(),
									v_code: A
								}, function(i) {
									if (i.ret == 1) {
										d.attr("data-verification-result", "success");
										if ("function" === typeof o.options.success) {
											o.options.success.call(o, d)
										}
										return false
									} else {
										d.attr("data-verification-result", "failed");
										if ("function" === typeof o.options.failed) {
											o.options.failed.call(o, d, f + "输入有误")
										}
									}
								}, "json");
								break;
							default:
								break
						}
						break;
					case "funcCall":
						d.attr("data-verification-result", "loading");
						var z = l[u + 1],
							h;
						if (z.indexOf(".") > -1) {
							var k = z.split("."),
								c = window;
							while (k.length) {
								c = c[k.shift()]
							}
							h = c
						} else {
							h = window[z] || o.options.customFuncs[z]
						}
						if ("function" == typeof(h)) {
							h(d)
						}
						break;
					default:
						break
				}
			}
		}
	}
	b.verification = {
		init: function(d, c) {
			return d.each(function() {
				var e = b.extend(true, {}, c),
					f;
				f = new a();
				f.init(this, e);
				b.data(this, "verification", f)
			})
		},
		verifyField: function(c, e) {
			var d = c.data("verification");
			if (!d || !e.size()) {
				return undefined
			}
			return d.verifyField(e)
		},
		verifySuccess: function(c) {
			c.attr("data-verification-result", "success")
		},
		verifyFailed: function(c) {
			c.attr("data-verification-result", "failed")
		}
	};
	b.fn.verification = function(d) {
		var c = arguments;
		if ("undefined" !== typeof b.verification[d]) {
			c = Array.prototype.concat.call([c[0]], [this], Array.prototype.slice.call(c, 1));
			return b.verification[d].apply(b.verification, Array.prototype.slice.call(c, 1))
		} else {
			if ("object" === typeof d || !d) {
				Array.prototype.unshift.call(c, this);
				return b.verification.init.apply(b.verification, c)
			} else {
				console.log('Method "' + d + '" does not exist in verification')
			}
		}
	}
})(jQuery);
$(function() {
	if (typeof JYValidate === "object") {
		$.extend(JYValidate, {
			dataCallback: function(h, g) {
				if (!h.error_code) {
					g.startBtnAction()
				} else {
					if (h.error_code == 10002) {
						g.clearJYCode()
					} else {
						g.clearJYCode();
						alert(h.message)
					}
				}
			}
		});
		JYValidate.init()
	}
	var c = function() {
		$('[type="text"],[type="password"]', ".signup-forms").val("");
		$(".err-tip", ".signup-forms").html("").hide()
	};
	var b = function() {
		$(".alert").remove()
	};
	var d = function() {
		c();
		b();
		$(".signup-forms").toggleClass("flip")
	};
	var a = function() {
		c();
		b();
		$(".signup-forms").toggleClass("flip")
	};
	var e = function() {
		c();
		b();
		$(".signup-forms").toggleClass("flip")
	};
	var f = function() {
		c();
		b();
		$(".signup-forms").toggleClass("flip")
	};
	$("#_j_bind_box").delegate(".bottom-link a", "click", function(g) {
		g.preventDefault();
		a()
	});
	$("#_j_complete_box").delegate(".bottom-link a", "click", function(g) {
		g.preventDefault();
		d()
	});
	$("#_j_login_box").delegate(".bottom-link a", "click", function(g) {
		g.preventDefault();
		e()
	});
	$("#_j_signup_box").delegate(".bottom-link a", "click", function(g) {
		g.preventDefault();
		f()
	});
	$("#_j_signup_form").delegate(".form-link a", "click", function(i) {
		i.preventDefault();
		var g = $('[name="passport"]', "#_j_signup_form").val("");
		var h = $(".info-tip", "#_j_signup_form");
		g.next(".err-tip").html("").hide();
		if ("mobile" === g.attr("data-type")) {
			g.attr("data-type", "email").attr("placeholder", "您的邮箱").attr("data-verification-name", "邮箱").attr("class", g.attr("class").replace("custom[mobile]", "custom[email]"));
			h.hide();
			$(this).text("使用手机号码注册")
		} else {
			g.attr("data-type", "mobile").attr("placeholder", "您的手机号码").attr("data-verification-name", "手机号码").attr("class", g.attr("class").replace("custom[email]", "custom[mobile]"));
			h.show();
			$(this).text("使用邮箱注册")
		}
	});
	$(".connect .more").on("click", function(g) {
		g.preventDefault();
		$(".connect .bd").toggleClass("open")
	});
	$("#_j_forget_form").delegate(".form-link a", "click", function(h) {
		h.preventDefault();
		var g = $('[name="passport"]', "#_j_forget_form").val("");
		g.next(".err-tip").html("").hide();
		if ("mobile" === g.attr("data-type")) {
			g.attr("data-type", "email").attr("placeholder", "您的邮箱").attr("data-verification-name", "邮箱");
			//g.attr("class", g.attr("class").replace("custom[mobile]", "custom[email]","ajax[checkEmail]"));
			g.attr("class","verification[required,maxSize[50],custom[email],ajax[checkEmail]]");
			$(this).text("使用手机号码找回")
			$("#_j_forget_form").attr("action","usersController/showUpdateuserPassword_html?temp=email");
		} else {
			g.attr("data-type", "mobile").attr("placeholder", "您的手机号码").attr("data-verification-name", "手机号码");
			//g.attr("class", g.attr("class").replace("custom[email]", "custom[mobile]","ajax[checkMobile]"));
            g.attr("class","verification[required,maxSize[50],custom[mobile],ajax[checkMobile]]");
            $("#_j_forget_form").attr("action","usersController/showUpdateuserPassword_html?temp=phone");
			$(this).text("使用邮箱找回")
		}
	});
	$(".signup-forms").delegate("a.verify-code-send", "click", function(h) {
		h.preventDefault();
		var g = $(this).find("img");
		g.attr("src", g.data("src") + "?" + new Date().getTime())
	});
	$("#_j_complete_form").verification({
		customFuncs: {
            checkCode: function(h) {
                var g = $.trim(h.val());
                $.get("usersController/checkCode", {
                    code: g
                }, function(data) {
                    if (!data) {
                        h.closest(".form-field").find(".err-tip").html("验证码不正确").show();
                        h.closest(".form-field").find(".verify-code-send").trigger("click");
                        $.verification.verifyFailed(h)
                    } else {
                        h.closest(".form-field").find(".err-tip").html("").hide();
                        $.verification.verifySuccess(h)
                    }
                })
            },
			checkSMSCode: function(i) {
				var g = $('[name="mobile"]', "#_j_complete_form").val();
				var h = $.trim(i.val());
				$.get("/api.php/checkSMSCode", {
					mobile: g,
					code: h
				}, function(j) {
					if (!j) {
						i.closest(".form-field").find(".err-tip").html("短信验证码不正确或已过期").show();
						$.verification.verifyFailed(i)
					} else {
						i.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(i)
					}
				})
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_complete_form").delegate("a.sms-code-send", "click", function(j) {
		j.preventDefault();
		var g = $(this);
		if (g.hasClass("disabled")) {
			return
		}
		var h = $('[name="mobile"]', "#_j_complete_form");
		var i = $('[name="code"]', "#_j_complete_form");
		$.getJSON("/api.php/generateSMSCode", {
			mobile: h.val(),
			code: i.val()
		}, function(k) {
			if (!k.error_code) {
				g.addClass("disabled").data("time", 60).html("60秒后重新获取");
				clearInterval(mobileCodeTimer);
				mobileCodeTimer = setInterval(function() {
					var l = parseInt(g.data("time"));
					l--;
					if (l > 0) {
						g.html(l + "秒后重新获取")
					} else {
						g.removeClass("disabled").html("重新获取验证码");
						clearInterval(mobileCodeTimer)
					}
					g.data("time", l)
				}, 1000)
			} else {
				if (k.error_code == 10002) {
					i.closest(".form-field").find(".err-tip").html("验证码不正确").show();
					i.closest(".form-field").find(".verify-code-send").trigger("click");
					$.verification.verifyFailed(i)
				} else {
					i.closest(".form-field").find(".err-tip").html(k.message).show()
				}
			}
		})
	});
	$("#_j_login_form").verification({
		customFuncs: {
			checkShowCode: function(h) {
				var g = $.trim(h.val());
				$.get("/api.php/checkShowCode", {
					passport: g
				}, function(k) {
					$.verification.verifySuccess(h);
					if (k) {
						var j = $('input[name="code"]', "#_j_login_form");
						var i = j.closest(".form-field");
						if (i.is(":hidden")) {
							j.attr("class", j.attr("class").replace("verification[checkCode]", "verification[required,funcCall[checkCode]]"));
							i.show();
							$.verification.verifyFailed(j)
						}
					}
				})
			},
			checkCode: function(h) {
				if (h.closest(".form-field").is(":hidden")) {
					$.verification.verifySuccess(h);
					return
				}
				var g = $.trim(h.val());
				$.get("usersController/checkCode", {
					code: g
				}, function(i) {
					if (!i) {
						h.closest(".form-field").find(".err-tip").html("验证码不正确").show();
						h.closest(".form-field").find(".verify-code-send").trigger("click");
						$.verification.verifyFailed(h)
					} else {
						h.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(h)
					}
				})
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_signup_form").verification({
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_signup_mobile_form").verification({
		customFuncs: {
			checkSuperCode: function(h) {
				var g = $.trim(h.val());
				$.get("/api.php/checkSuperCode", {
					code: g
				}, function(i) {
					if (!i) {
						h.closest(".form-field").find(".err-tip").html("验证码不正确").show();
						h.closest(".form-field").find(".verify-code-send").trigger("click");
						$.verification.verifyFailed(h)
					} else {
						h.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(h)
					}
				})
			},
			checkSMSCode: function(i) {
				var g = $('[name="mobile"]', "#_j_signup_mobile_form").val();
				var h = $.trim(i.val());
				$.get("/api.php/checkSMSCode", {
					mobile: g,
					code: h
				}, function(j) {
					if (!j) {
						i.closest(".form-field").find(".err-tip").html("短信验证码不正确或已过期").show();
						$.verification.verifyFailed(i)
					} else {
						i.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(i)
					}
				})
			},
			checkPasswordStrong: function(h) {
				var g = $.trim(h.val());
				var i = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
				if (!i.test(g)) {
					h.closest(".form-field").find(".err-tip").html("密码过于简单，需包含字母和数字").show();
					$.verification.verifyFailed(h)
				} else {
					h.closest(".form-field").find(".err-tip").html("").hide();
					$.verification.verifySuccess(h)
				}
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_signup_mail_form").verification({
		customFuncs: {
			checkCode: function(h) {
				var g = $.trim(h.val());
				$.get("usersController/checkCode", {
					code: g
				}, function(i) {
					if (!i) {
						h.closest(".form-field").find(".err-tip").html("验证码不正确").show();
						h.closest(".form-field").find(".verify-code-send").trigger("click");
						$.verification.verifyFailed(h)
					} else {
						h.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(h)
					}
				})
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_send_verify_form").verification({
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_forget_form").verification({
		customFuncs: {
			checkCode: function(h) {
				var g = $.trim(h.val());
				$.get("usersController/checkCode", {
					code: g
				}, function(i) {
					if (!i) {
						h.closest(".form-field").find(".err-tip").html("验证码不正确").show();
						h.closest(".form-field").find(".verify-code-send").trigger("click");
						$.verification.verifyFailed(h)
					} else {
						h.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(h)
					}
				})
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_forget_mobile_form").verification({
		customFuncs: {
			checkSMSCode: function(i) {
				var g = $('[name="mobile"]', "#_j_forget_mobile_form").val();
				var h = $.trim(i.val());
				$.get("usersController/checksmsCode", {
                    bindPhone: g,
                    verificationCode: h
				}, function(j) {
					if (!j) {
						i.closest(".form-field").find(".err-tip").html("短信验证码不正确或已过期").show();
						$.verification.verifyFailed(i)
					} else {
						i.closest(".form-field").find(".err-tip").html("").hide();
						$.verification.verifySuccess(i)
					}
				})
			},
			checkPasswordStrong: function(h) {
				var g = $.trim(h.val());
				var i = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
				if (!i.test(g)) {
					h.closest(".form-field").find(".err-tip").html("密码过于简单，需包含字母和数字").show();
					$.verification.verifyFailed(h)
				} else {
					h.closest(".form-field").find(".err-tip").html("").hide();
					$.verification.verifySuccess(h)
				}
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_reset_mobile_form").verification({
		customFuncs: {
			checkPasswordStrong: function(h) {
				var g = $.trim(h.val());
				var i = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
				if (!i.test(g)) {
					h.closest(".form-field").find(".err-tip").html("密码过于简单，需包含字母和数字").show();
					$.verification.verifyFailed(h)
				} else {
					h.closest(".form-field").find(".err-tip").html("").hide();
					$.verification.verifySuccess(h)
				}
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	});
	$("#_j_forget_mail_form").verification({
		customFuncs: {
			checkPasswordStrong: function(h) {
				var g = $.trim(h.val());
				var i = /(?=.*[A-Za-z])(?=.*[0-9]).{8,30}/;
				if (!i.test(g)) {
					h.closest(".form-field").find(".err-tip").html("密码过于简单，需包含字母和数字").show();
					$.verification.verifyFailed(h)
				} else {
					h.closest(".form-field").find(".err-tip").html("").hide();
					$.verification.verifySuccess(h)
				}
			}
		},
		success: function(g) {
			g.closest(".form-field").find(".err-tip").html("").hide()
		},
		failed: function(h, g) {
			h.closest(".form-field").find(".err-tip").html(g).show()
		}
	})
});