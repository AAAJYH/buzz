M.define("/js/Dropdown", function(c, b, d) {
	function a(e) {
		this.$nav = typeof e.nav === "string" ? $(e.nav) : e.nav;
		this.$panel = typeof e.panel === "string" ? $(e.panel) : e.panel;
		this.showCallback = e.showCallback;
		this.hideCallback = e.hideCallback;
		this.delay = e.delay || 0;
		this.event = e.event || "mouseenterleave";
		this._isShow = false;
		this.init()
	}
	a.prototype = {
		init: function() {
			if (this.event === "mouseenterleave") {
				this.$nav.on("mouseenter.dropdown", M.bind(function(e) {
					this.show()
				}, this)).on("mouseleave.dropdown", M.bind(function(e) {
					if ($(e.relatedTarget).closest(this.$panel).length === 0) {
						this.hide(true)
					}
				}, this));
				this.$panel.on("mouseenter.dropdown", M.bind(function(e) {
					this.show()
				}, this)).on("mouseleave.dropdown", M.bind(function(e) {
					if ($(e.relatedTarget).closest(this.$nav).length === 0) {
						this.hide(false)
					}
				}, this))
			}
			if (this.event === "click") {
				this.$nav.on("click.dropdown", M.bind(function(e) {
					this.show()
				}, this));
				$(document).on("click.dropdown", M.bind(function(e) {
					if ($(e.target).closest(this.$nav).length === 0 && $(e.target).closest(this.$panel).length === 0) {
						this.hide(false)
					}
				}, this))
			}
		},
		show: function() {
			this.$panel.show();
			this._isShow = true;
			if (M.isFunction(this.showCallback)) {
				this.showCallback.call(this, this.$nav, this.$panel)
			}
		},
		hide: function(e) {
			this._isShow = false;
			if (e && this.delay > 0) {
				setTimeout(M.bind(function() {
					if (!this._isShow) {
						this.$panel.hide();
						if (M.isFunction(this.hideCallback)) {
							this.hideCallback.call(this, this.$nav, this.$panel)
						}
					}
				}, this), this.delay)
			} else {
				this.$panel.hide();
				if (M.isFunction(this.hideCallback)) {
					this.hideCallback.call(this, this.$nav, this.$panel)
				}
			}
		},
		destory: function() {
			if (this.event === "mouseenterleave") {
				this.$nav.off("mouseenter.dropdown").off("mouseleave.dropdown");
				this.$panel.off("mouseenter.dropdown").off("mouseleave.dropdown")
			}
			if (this.event === "click") {
				this.$nav.off("click.dropdown")
			}
			this.$panel.hide()
		}
	};
	d.exports = a
});
M.define("/js/pageletcommon/pageHeadUserInfoWWWNormal", function(c) {
	var a = c("/js/Dropdown"),
		b = window.Env || {};
	return {
		events: {},
		init: function() {
			var k = $("#head-btn-daka");
			$(function() {
				$(".new_daka_tips").addClass("on")
			});
			$(".ndt_close").on("click", function() {
				$(this).parent().hide()
			});
			M.Event.on("afterDaka", l);

			function l(q) {
				if (q && q.dakaFlag) {
					k.closest(".head-daka").addClass("daka-complete")
				}
			}
			var e = i("dakaday");
			if (e !== null) {
				$(".head-btn-daka").attr("data-day", e)
			}

			function i(q) {
				var s = new RegExp("(^|&)" + q + "=([^&]*)(&|$)");
				var t = window.location.search.substr(1).match(s);
				if (t !== null) {
					return unescape(t[2])
				}
				return null
			}
			var g = new a({
				nav: "#_j_head_user",
				panel: "#_j_user_panel",
				showCallback: function(q, r) {
					q.find(".drop-trigger").addClass("drop-trigger-active")
				},
				hideCallback: function(q, r) {
					q.find(".drop-trigger").removeClass("drop-trigger-active")
				},
				delay: 500
			});
			var d = 0,
				p = $("#_j_head_msg"),
				o = $("#_j_msg_panel"),
				n = p.find(".head-msg-new"),
				j = $("#_j_msg_float_panel");
			var f = new a({
				nav: p.selector,
				panel: o.selector,
				showCallback: function(q, r) {
					q.find(".drop-trigger").addClass("drop-trigger-active")
				},
				hideCallback: function(q, r) {
					q.find(".drop-trigger").removeClass("drop-trigger-active")
				},
				delay: 200
			});
			M.Event.on("get new msg", function(q) {
				if (q.msg || d > 0) {
					o.find("ul").html(q.menu_index);
					h()
				}
			});
			o.on("click", "a", function(q) {
				M.Event.fire("update msg")
			});
			j.on("click", "ul a", function(q) {
				M.Event.fire("update msg")
			});
			j.on("click", ".close-newmsg", function(q) {
				m()
			});

			function m() {
				n.hide();
				j.hide();
				$.ajax({
					url: "http://" + b.WWW_HOST + "/ajax/ajax_msg.php",
					dataType: "jsonp",
					data: {
						a: "ignore",
						from: "1"
					},
					success: function(q) {
						M.Event.fire("update msg")
					}
				})
			}
			window.close_msg_tips = m;

			function h() {
				var q = "";
				d = 0;
				o.find(".num").each(function(r, t) {
					var s = $(t);
					d += Number(s.html());
					q += "<li>" + s.closest("li").html() + "</li>"
				});
				if (d > 0) {
					n.html((d > 99 ? "99+" : d)).show();
					j.find("ul").html(q).end().show()
				} else {
					n.hide();
					j.hide()
				}
			}
			h()
		}
	}
});
/*!
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright 2011, Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function(i, f) {
	var t = i.fn.domManip,
		h = "_tmplitem",
		u = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
		p = {},
		e = {},
		y, x = {
			key: 0,
			data: {}
		},
		w = 0,
		q = 0,
		g = [];

	function k(B, A, D, E) {
		var C = {
			data: E || (E === 0 || E === false) ? E : (A ? A.data : {}),
			_wrap: A ? A._wrap : null,
			tmpl: null,
			parent: A || null,
			nodes: [],
			calls: c,
			nest: b,
			wrap: n,
			html: r,
			update: z
		};
		if (B) {
			i.extend(C, B, {
				nodes: [],
				parent: A
			})
		}
		if (D) {
			C.tmpl = D;
			C._ctnt = C._ctnt || C.tmpl(i, C);
			C.key = ++w;
			(g.length ? e : p)[w] = C
		}
		return C
	}
	i.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function(A, B) {
		i.fn[A] = function(C) {
			var F = [],
				I = i(C),
				E, G, D, J, H = this.length === 1 && this[0].parentNode;
			y = p || {};
			if (H && H.nodeType === 11 && H.childNodes.length === 1 && I.length === 1) {
				I[B](this[0]);
				F = this
			} else {
				for (G = 0, D = I.length; G < D; G++) {
					q = G;
					E = (G > 0 ? this.clone(true) : this).get();
					i(I[G])[B](E);
					F = F.concat(E)
				}
				q = 0;
				F = this.pushStack(F, A, I.selector)
			}
			J = y;
			y = null;
			i.tmpl.complete(J);
			return F
		}
	});
	i.fn.extend({
		tmpl: function(C, B, A) {
			return i.tmpl(this[0], C, B, A)
		},
		tmplItem: function() {
			return i.tmplItem(this[0])
		},
		template: function(A) {
			return i.template(A, this[0])
		},
		domManip: function(E, H, G, I) {
			if (E[0] && i.isArray(E[0])) {
				var B = i.makeArray(arguments),
					A = E[0],
					F = A.length,
					C = 0,
					D;
				while (C < F && !(D = i.data(A[C++], "tmplItem"))) {}
				if (D && q) {
					B[2] = function(J) {
						i.tmpl.afterManip(this, J, G)
					}
				}
				t.apply(this, B)
			} else {
				t.apply(this, arguments)
			}
			q = 0;
			if (!y) {
				i.tmpl.complete(p)
			}
			return this
		}
	});
	i.extend({
		tmpl: function(C, F, E, B) {
			var D, A = !B;
			if (A) {
				B = x;
				C = i.template[C] || i.template(null, C);
				e = {}
			} else {
				if (!C) {
					C = B.tmpl;
					p[B.key] = B;
					B.nodes = [];
					if (B.wrapped) {
						s(B, B.wrapped)
					}
					return i(m(B, null, B.tmpl(i, B)))
				}
			}
			if (!C) {
				return []
			}
			if (typeof F === "function") {
				F = F.call(B || {})
			}
			if (E && E.wrapped) {
				s(E, E.wrapped)
			}
			D = i.isArray(F) ? i.map(F, function(G) {
				return G ? k(E, B, C, G) : null
			}) : [k(E, B, C, F)];
			return A ? i(m(B, null, D)) : D
		},
		tmplItem: function(B) {
			var A;
			if (B instanceof i) {
				B = B[0]
			}
			while (B && B.nodeType === 1 && !(A = i.data(B, "tmplItem")) && (B = B.parentNode)) {}
			return A || x
		},
		template: function(B, A) {
			if (A) {
				if (typeof A === "string") {
					A = l(A)
				} else {
					if (A instanceof i) {
						A = A[0] || {}
					}
				}
				if (A.nodeType) {
					A = i.data(A, "tmpl") || i.data(A, "tmpl", l(A.innerHTML))
				}
				return typeof B === "string" ? (i.template[B] = A) : A
			}
			return B ? (typeof B !== "string" ? i.template(null, B) : (i.template[B] || i.template(null, u.test(B) ? B : i(B)))) : null
		},
		encode: function(A) {
			return ("" + A).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")
		}
	});
	i.extend(i.tmpl, {
		tag: {
			tmpl: {
				_default: {
					$2: "null"
				},
				open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
			},
			wrap: {
				_default: {
					$2: "null"
				},
				open: "$item.calls(__,$1,$2);__=[];",
				close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
			},
			each: {
				_default: {
					$2: "$index, $value"
				},
				open: "if($notnull_1){$.each($1a,function($2){with(this){",
				close: "}});}"
			},
			"if": {
				open: "if(($notnull_1) && $1a){",
				close: "}"
			},
			"else": {
				_default: {
					$1: "true"
				},
				open: "}else if(($notnull_1) && $1a){"
			},
			html: {
				open: "if($notnull_1){__.push($1a);}"
			},
			"=": {
				_default: {
					$1: "$data"
				},
				open: "if($notnull_1){__.push($.encode($1a));}"
			},
			"!": {
				open: ""
			}
		},
		complete: function(A) {
			p = {}
		},
		afterManip: function v(C, A, D) {
			var B = A.nodeType === 11 ? i.makeArray(A.childNodes) : A.nodeType === 1 ? [A] : [];
			D.call(C, A);
			o(B);
			q++
		}
	});

	function m(A, E, C) {
		var D, B = C ? i.map(C, function(F) {
			return (typeof F === "string") ? (A.key ? F.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + h + '="' + A.key + '" $2') : F) : m(F, A, F._ctnt)
		}) : A;
		if (E) {
			return B
		}
		B = B.join("");
		B.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function(G, H, F, I) {
			D = i(F).get();
			o(D);
			if (H) {
				D = a(H).concat(D)
			}
			if (I) {
				D = D.concat(a(I))
			}
		});
		return D ? D : a(B)
	}

	function a(B) {
		var A = document.createElement("div");
		A.innerHTML = B;
		return i.makeArray(A.childNodes)
	}

	function l(A) {
		return new Function("jQuery", "$item", "var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('" + i.trim(A).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function(I, C, G, D, E, J, F) {
			var L = i.tmpl.tag[G],
				B, H, K;
			if (!L) {
				throw "Unknown template tag: " + G
			}
			B = L._default || [];
			if (J && !/\w$/.test(E)) {
				E += J;
				J = ""
			}
			if (E) {
				E = j(E);
				F = F ? ("," + j(F) + ")") : (J ? ")" : "");
				H = J ? (E.indexOf(".") > -1 ? E + j(J) : ("(" + E + ").call($item" + F)) : E;
				K = J ? H : "(typeof(" + E + ")==='function'?(" + E + ").call($item):(" + E + "))"
			} else {
				K = H = B.$1 || "null"
			}
			D = j(D);
			return "');" + L[C ? "close" : "open"].split("$notnull_1").join(E ? "typeof(" + E + ")!=='undefined' && (" + E + ")!=null" : "true").split("$1a").join(K).split("$1").join(H).split("$2").join(D || B.$2 || "") + "__.push('"
		}) + "');}return __;")
	}

	function s(B, A) {
		B._wrap = m(B, true, i.isArray(A) ? A : [u.test(A) ? A : i(A).html()]).join("")
	}

	function j(A) {
		return A ? A.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null
	}

	function d(A) {
		var B = document.createElement("div");
		B.appendChild(A.cloneNode(true));
		return B.innerHTML
	}

	function o(G) {
		var I = "_" + q,
			B, A, E = {},
			F, D, C;
		for (F = 0, D = G.length; F < D; F++) {
			if ((B = G[F]).nodeType !== 1) {
				continue
			}
			A = B.getElementsByTagName("*");
			for (C = A.length - 1; C >= 0; C--) {
				H(A[C])
			}
			H(B)
		}

		function H(P) {
			var L, O = P,
				N, J, K;
			if ((K = P.getAttribute(h))) {
				while (O.parentNode && (O = O.parentNode).nodeType === 1 && !(L = O.getAttribute(h))) {}
				if (L !== K) {
					O = O.parentNode ? (O.nodeType === 11 ? 0 : (O.getAttribute(h) || 0)) : 0;
					if (!(J = p[K])) {
						J = e[K];
						J = k(J, p[O] || e[O]);
						J.key = ++w;
						p[w] = J
					}
					if (q) {
						Q(K)
					}
				}
				P.removeAttribute(h)
			} else {
				if (q && (J = i.data(P, "tmplItem"))) {
					Q(J.key);
					p[J.key] = J;
					O = i.data(P.parentNode, "tmplItem");
					O = O ? O.key : 0
				}
			}
			if (J) {
				N = J;
				while (N && N.key != O) {
					N.nodes.push(P);
					N = N.parent
				}
				delete J._ctnt;
				delete J._wrap;
				i.data(P, "tmplItem", J)
			}

			function Q(R) {
				R = R + I;
				J = E[R] = (E[R] || k(J, p[J.parent.key + I] || J.parent))
			}
		}
	}

	function c(C, A, D, B) {
		if (!C) {
			return g.pop()
		}
		g.push({
			_: C,
			tmpl: A,
			item: this,
			data: D,
			options: B
		})
	}

	function b(A, C, B) {
		return i.tmpl(i.template(A), C, B, this)
	}

	function n(C, A) {
		var B = C.options || {};
		B.wrapped = A;
		return i.tmpl(i.template(C.tmpl), C.data, B, C.item)
	}

	function r(B, C) {
		var A = this._wrap;
		return i.map(i(i.isArray(A) ? A.join("") : A).filter(B || "*"), function(D) {
			return C ? D.innerText || D.textContent : D.outerHTML || d(D)
		})
	}

	function z() {
		var A = this.nodes;
		i.tmpl(null, null, null, this).insertBefore(A[0]);
		i(A).remove()
	}
	if (window.M && typeof M.define == "function") {
		M.define("jq-tmpl", function() {
			return i
		})
	}
})(jQuery);
M.define("InputListener", function(c, b, d) {
	var a = {
		listen: function(f, e) {
			f = $(f);
			f.each($.proxy(function(g, h) {
				h = $(h);
				if (!h.is("input") && !h.is("textarea")) {
					throw new Error("input listener only apply to input or textarea")
				}
				this.initListen(h, e)
			}, this))
		},
		unlisten: function(e) {
			e = $(e);
			e.each($.proxy(function(h, k) {
				k = $(k);
				if (!k.is("input") && !k.is("textarea")) {
					throw new Error("input listener only apply to input or textarea")
				}
				if (arguments.length == 1) {
					k.unbind("focus", this.getStartListenFunc());
					k.unbind("blur", this.getStopListenFunc());
					k.removeData("__input_listener_handlers")
				} else {
					if (typeof arguments[1] == "function") {
						var j = arguments[1],
							g = k.data("__input_listener_listeninterval");
						for (var h = 0, f = g.length; h < f; h++) {
							if (g[h] == j) {
								g.splice(h, 1);
								h--
							}
						}
					}
				}
			}, this))
		},
		initListen: function(f, e) {
			f.data("__input_listener_currentval", f.val());
			if (!f.data("__input_listener_handlers")) {
				this.bindListenEvent(f)
			}
			this.addListenHandler(f, e);
			if (f.is(":focus")) {
				f.blur();
				f.focus()
			}
		},
		bindListenEvent: function(e) {
			e.data("__input_listener_handlers", []);
			e.focus(this.getStartListenFunc());
			e.blur(this.getStopListenFunc())
		},
		getStartListenFunc: function() {
			if (!this.bindStartListenFunc) {
				this.bindStartListenFunc = $.proxy(this.startListen, this)
			}
			return this.bindStartListenFunc
		},
		getStopListenFunc: function() {
			if (!this.bindStopListenFunc) {
				this.bindStopListenFunc = $.proxy(this.stopListen, this)
			}
			return this.bindStopListenFunc
		},
		startListen: function(e) {
			var f = $(e.target);
			f.data("__input_listener_currentval", f.val());
			f.data("__input_listener_listeninterval", setInterval($.proxy(function() {
				var h = f.data("__input_listener_currentval"),
					g = f.val();
				if (h != g) {
					f.data("__input_listener_currentval", g);
					this.triggerListenHandler(f)
				}
			}, this), 100))
		},
		stopListen: function(e) {
			var f = $(e.target);
			clearInterval(f.data("__input_listener_listeninterval"))
		},
		addListenHandler: function(f, e) {
			if (typeof e == "function") {
				f.data("__input_listener_handlers").push(e)
			}
		},
		triggerListenHandler: function(h) {
			var f = h.data("__input_listener_handlers");
			for (var g = 0, e = f.length; g < e; g++) {
				f[g].call(null, {
					target: h.get(0)
				})
			}
		}
	};
	return a
});
M.define("SuggestionXHR", function(b, a, c) {
	function d(e) {
		this.URL = null;
		this.delay = 200;
		this.dataType = "text";
		$.extend(this, e);
		this.delayTimer = null;
		this.xhr = null;
		this.cache = {};
		this.init()
	}
	d.prototype = {
		init: function() {
			if (!this.URL) {
				throw new Error("no url for suggestion")
			}
		},
		getSuggestion: function(g, h) {
			var f = this.getQuery(g),
				e = this.cache[f];
			h = typeof h === "function" ? h : $.noop;
			this.stop();
			if (e) {
				h(e)
			} else {
				this.getXHRData(f, h)
			}
		},
		stop: function() {
			clearTimeout(this.delayTimer);
			if (this.xhr && this.xhr.readyState !== 4) {
				this.xhr.abort()
			}
		},
		getQuery: function(h) {
			var g = "";
			if (typeof h == "string") {
				g = encodeURIComponent(h)
			} else {
				if (h && typeof h == "object") {
					var e = [];
					for (var f in h) {
						if (h.hasOwnProperty(f)) {
							e.push(f + "=" + encodeURIComponent(h[f]))
						}
					}
					g = e.join("&")
				}
			}
			return g
		},
		getXHRData: function(e, h) {
			var f = this.xhr,
				g = {
					url: this.URL,
					data: e,
					dataType: this.dataType,
					success: M.bind(function(i) {
						h(i);
						this.cache[e] = i
					}, this)
				};
			this.delayTimer = setTimeout(M.bind(function() {
				this.xhr = $.ajax(g)
			}, this), this.delay)
		}
	};
	return d
});
M.define("DropList", function(c, b, d) {
	var a = M.Event;

	function e(f) {
		this.trigger = null;
		this.container = null;
		this.itemSelector = "._j_listitem";
		this.itemHoverClass = "on";
		this.firstItemHover = false;
		$.extend(this, f);
		this.trigger = $(this.trigger);
		this.container = $(this.container);
		this.mouseon = false;
		this.visible = false;
		this.init()
	}
	M.mix(e.prototype, {
		createContainer: $.noop,
		updateList: $.noop,
		init: function() {
			if (!this.trigger.length) {
				M.error("no trigger for drop list")
			}
			if (!this.container.length) {
				this.container = this.createContainer()
			}
			if (!this.container.length) {
				M.error("no container for drop list")
			}
			this.bindEvents()
		},
		bindEvents: function() {
			this.trigger.on("keydown", $.proxy(function(g) {
				var h = g.keyCode;
				if (this.visible && h == 13) {
					var f = this.getFocusItem();
					if (f.length) {
						this.selectItem(f);
						g.preventDefault()
					}
				} else {
					if (this.visible && h == 38) {
						this.moveFocus(-1)
					} else {
						if (this.visible && h == 40) {
							this.moveFocus(1)
						}
					}
				}
			}, this));
			this.container.on("mouseenter", this.itemSelector, $.proxy(this.moveFocus, this)).on("click", this.itemSelector, $.proxy(this.clickItem, this)).on("mouseenter", $.proxy(this.mouseOverCnt, this)).on("mouseleave", $.proxy(this.mouseOutCnt, this))
		},
		show: function(g) {
			this.updateList(g);
			this.container.show();
			if (this.firstItemHover) {
				var f = this.container.find(this.itemSelector);
				if (f.length) {
					this.moveFocus(1)
				}
			}
			this.visible = true
		},
		hide: function() {
			this.container.hide();
			this.visible = false
		},
		clickItem: function(g) {
			var f = this.getFocusItem();
			this.selectItem(f);
			g.preventDefault()
		},
		selectItem: function(f) {
			a(this).fire("itemselected", {
				item: f
			})
		},
		moveFocus: function(i) {
			var h = this.container.find(this.itemSelector),
				j = this.getFocusItem(),
				g = j,
				f;
			if (i === -1) {
				if (j.length) {
					f = h.index(j) - 1
				}
				if (!j.length || f == -1) {
					g = h.last()
				} else {
					g = h.eq(f)
				}
			} else {
				if (i === 1) {
					if (j.length) {
						f = h.index(j) + 1
					}
					if (!j.length || f == h.length) {
						g = h.first()
					} else {
						g = h.eq(f)
					}
				} else {
					if (i.currentTarget) {
						g = $(i.currentTarget)
					}
				}
			}
			j.removeClass(this.itemHoverClass);
			g.addClass(this.itemHoverClass);
			a(this).fire("itemfocused", {
				prevItem: j,
				focusItem: g
			})
		},
		getFocusItem: function() {
			var f = this.container.find(this.itemSelector);
			return f.filter("." + this.itemHoverClass)
		},
		mouseOverCnt: function() {
			this.mouseon = true
		},
		mouseOutCnt: function() {
			this.mouseon = false
		}
	});
	return e
});
M.define("Suggestion", function(c) {
	c("jq-tmpl");
	var a = c("InputListener");
	var b = '{{each(i, item) list}}<li class="${listItemClass}" data-value="${item.value}">${item.text}</li>{{/each}}';

	function d(e) {
		e.suggestionURL = e.url || $(e.input).data("suggestionurl");
		this.dropListClass = "droplist";
		this.listItemSelector = "._j_listitem";
		this.listItemHoverClass = "on";
		this.listFirstItemHover = false;
		this.keyParamName = "key";
		this.dataType = "json";
		this.suggestionParams = {};
		this.listContainer = null;
		M.mix(this, e);
		this.input = $(this.input);
		this.listTmpl = this.listTmpl || b;
		this.actOnList = false;
		this.init()
	}
	M.mix(d.prototype, {
		init: function() {
			a.listen(this.input, $.proxy(this.inputChange, this));
			this.input.blur($.proxy(function(f) {
				var e = $(f.currentTarget);
				if (e.data("droplist")) {
					setTimeout($.proxy(function() {
						if (!this.actOnList && e.data("droplist")) {
							e.data("droplist").hide()
						}
						this.actOnList = false
					}, this), 200)
				}
			}, this));
			this.input.keyup($.proxy(function(f) {
				var e = $(f.currentTarget);
				if (f.keyCode == 40 && (!e.data("droplist") || !e.data("droplist").visible)) {
					this.inputChange(f)
				}
			}, this))
		},
		inputChange: function(i) {
			var f = $(i.target),
				k = $.trim(f.val()),
				j = c("SuggestionXHR"),
				h = c("DropList");
			var g = f.data("droplist");
			if (!g) {
				f.data("droplist", g = new h({
					trigger: f,
					itemSelector: this.listItemSelector,
					itemHoverClass: this.listItemHoverClass,
					firstItemHover: this.listFirstItemHover,
					container: this.listContainer,
					createContainer: $.proxy(function() {
						var l = this.createListContainer(f);
						this.listContainer = l;
						return l
					}, this),
					updateList: $.proxy(this.updateList, this)
				}));
				M.Event(g).on("itemselected", $.proxy(function(l) {
					this.dropItemSelected(f, l.item)
				}, this));
				M.Event(g).on("itemfocused", $.proxy(function(l) {
					M.Event(this).fire("itemfocused", l)
				}, this))
			}
			g.hide = function() {
				setTimeout($.proxy(function() {
					if (M.windowFocused) {
						this.container.hide();
						this.visible = false
					}
				}, this), 1)
			};
			var e = f.data("suggestion");
			if (!e) {
				f.data("suggestion", e = new j({
					URL: this.suggestionURL,
					dataType: this.dataType
				}))
			}
			if (!k.length) {
				e.stop();
				g.hide();
				M.Event(this).fire("after hide list")
			} else {
				this.suggestionParams[this.keyParamName] = k;
				M.Event(this).fire("before suggestion xhr");
				e.getSuggestion(this.suggestionParams, $.proxy(function(m) {
					M.Event(this).fire("before show list");
					var l = this.handleSuggest(m);
					if (l) {
						f.data("droplist").show(l)
					}
				}, this))
			}
		},
		handleSuggest: function(f) {
			var e = "";
			if (this.dataType == "json") {
				e = $.tmpl(this.listTmpl, f)
			}
			return e
		},
		createListContainer: function(f) {
			var g = $("<ul />"),
				e = f.position();
			g.css({
				display: "none",
				position: "absolute",
				left: e.left,
				top: e.top + f.outerHeight()
			}).addClass(this.dropListClass);
			g.insertAfter(f);
			return g
		},
		updateList: function(e) {
			this.listContainer.html(e)
		},
		hideDropList: function() {
			this.input.data("droplist") && this.input.data("droplist").hide()
		},
		dropItemSelected: function(e, f) {
			a.unlisten(e);
			M.Event(this).fire("itemselected", {
				item: f,
				input: e
			});
			a.listen(e, $.proxy(this.inputChange, this))
		}
	});
	return d
});
M.define("MesSearchEvent", function(b, a, c) {
	var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
	Math.uuid = function(f, j) {
		var l = e,
			h = [],
			g;
		j = j || l.length;
		if (f) {
			for (g = 0; g < f; g++) {
				h[g] = l[0 | Math.random() * j]
			}
		} else {
			var k;
			h[8] = h[13] = h[18] = h[23] = "-";
			h[14] = "4";
			for (g = 0; g < 36; g++) {
				if (!h[g]) {
					k = 0 | Math.random() * 16;
					h[g] = l[(g == 19) ? (k & 3) | 8 : k]
				}
			}
		}
		return h.join("")
	};
	Math.uuidFast = function() {
		var k = e,
			h = new Array(36),
			g = 0,
			j;
		for (var f = 0; f < 36; f++) {
			if (f == 8 || f == 13 || f == 18 || f == 23) {
				h[f] = "-"
			} else {
				if (f == 14) {
					h[f] = "4"
				} else {
					if (g <= 2) {
						g = 33554432 + (Math.random() * 16777216) | 0
					}
					j = g & 15;
					g = g >> 4;
					h[f] = k[(f == 19) ? (j & 3) | 8 : j]
				}
			}
		}
		return h.join("")
	};
	Math.uuidCompact = function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(h) {
			var g = Math.random() * 16 | 0,
				f = h == "x" ? g : (g & 3 | 8);
			return f.toString(16)
		})
	};
	var d = {
		uuid: function() {
			return Math.uuid()
		},
		search: function(f) {
			var g = Math.uuid();
			f.id = g;
			!!mfwPageEvent && mfwPageEvent("se", "v2_search", f);
			return g
		},
		searchCache: function(f) {
			var g = Math.uuid();
			f.id = g;
			!!mfwPageEvent && mfwPageEvent("se", "v2_search_cache", f);
			return g
		},
		resultClick: function(f) {
			!!mfwPageEvent && mfwPageEvent("se", "v2_result_click", f);
			return f.id
		}
	};
	c.exports = d
});
M.define("/js/SiteSearch", function(e) {
	var d = "1.0.0",
		h = e("Suggestion"),
		f = e("MesSearchEvent"),
		g = M.cssSupport("transition"),
		b = M.cssSupport("transform"),
		c = window.Env || {};
	var a = function(C) {
		var E = $("#" + C.input + ""),
			T = !!C.submit ? $("#" + C.submit + "") : null,
			t = C.additionalClass ? C.additionalClass : "",
			K = !!C.isRelevant,
			s = C.maxCount || 0,
			z = C.hideOnScroll || false,
			n = false,
			J = false,
			i = "",
			y = "",
			l = "",
			p = "";
		if (C.input === "_j_index_search_input_all") {
			var H = [];
			if (E.val() === "" && H && H.length) {
				var S = Math.floor(Math.random() * H.length),
					I = H[S];
				E.val(I.name).data("url", I.url)
			}
			E.on("focus", function(V) {
				if (E.data("url")) {
					E.val("").data("url", "")
				}
			})
		}
		if (c.is_async_site_search) {
			n = true
		}
		var P = new h({
			url: (c.WWW_HOST ? window.location.protocol + "//" + c.WWW_HOST : "") + "/search/ss.php",
			suggestionParams: {
				isHeader: Number(K)
			},
			input: E,
			listItemHoverClass: "active",
			listFirstItemHover: false,
			dataType: "jsonp",
			createListContainer: function() {
				var V = $('<div class="m-search-suggest ' + t + ' hide"><ul class="mss-list"></ul></div>').appendTo("body");
				V.on("mouseenter", ".mss-place .mss-title, .mss-place .mss-nav a", function(X) {
					var W = $(X.currentTarget),
						Y = W.closest(".mss-place");
					Y.find(".mss-title").removeClass("active").removeClass("frozen").end().find(".mss-nav a").removeClass("active").end();
					W.addClass("active")
				}).on("mouseleave", ".mss-place .mss-title, .mss-place .mss-nav a", function(X) {
					var W = $(X.currentTarget);
					W.removeClass("active")
				});
				return V
			},
			handleSuggest: function(aB) {
				i = aB.keyword;
				J = !!aB.is_hit;
				l = "http://" + aB.www_host;
				var aw = aB.keyword_cut,
					ay = aB.show_types,
					W = aB.hide_types;
				var aq = $("<ul>");
				var aa = aB.first_poi;
				if (!!aa) {
					var al = aa,
						aj = $('<li class="mss-item _j_listitem" data-type="poi">').appendTo(aq),
						ao = $('<div class="mss-title">').appendTo(aj);
					aj.attr("data-url", al.url);
					ao.append('<span class="mss-fr">' + (!!al.mddname ? al.mddname : "") + al.typename + "</span>");
					ao.append('<span class="mss-cn">' + al.dis_name + "</span>")
				}
				var ag = aB.article_info;
				if (ag && ag.result) {
					for (var ar = 0; ar < ag.result.length; ar++) {
						var af = ag.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="article_promoted">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", af.link);
						ao.html(af.name_display)
					}
				}
				var ak = aB.mdd_info;
				if (ak && ak.result) {
					for (var ar = 0; ar < ak.result.length; ar++) {
						var Z = ak.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="mdd">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", Z.url);
						if (!!Z.parent) {
							ao.append('<span class="mss-fr">' + Z.parent + "</span>")
						}
						ao.append('<span class="mss-cn">' + Z.dis_name + "</span>");
						ao.append('<span class="mss-gl"> ' + Z.infoname + "</span>")
					}
				}
				var an = aB.hotel_info;
				if (an && an.result && !K) {
					for (var ar = 0; ar < an.result.length; ar++) {
						var az = an.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="hotel_promoted">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", az.url);
						ao.append('<span class="mss-fr">' + az.typename + "</span>");
						ao.append('<span class="mss-cn">' + az.title + "</span>");
						ao.append('<span class="mss-gl"> ' + az.infoname + "</span>")
					}
				}
				var ad = aB.gl_info;
				if (ad && ad.result) {
					for (var ar = 0; ar < ad.result.length; ar++) {
						var ap = ad.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="sales_gonglve">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", ap.url);
						ao.append('<span class="mss-fr">' + ap.typename + "</span>");
						ao.append('<span class="mss-cn">' + ap.title + "</span>")
					}
				}
				var Y = aB.sales_info;
				if (Y && Y.result && !K) {
					for (var ar = 0; ar < Y.result.length; ar++) {
						var V = Y.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="sales_promoted">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", V.url);
						ao.append('<span class="mss-fr">' + V.typename + "</span>");
						ao.append('<span class="mss-cn">' + V.title + "</span>");
						ao.append('<span class="mss-gl"> ' + V.infoname + "</span>")
					}
				}
				var ae = aB.route_info;
				if (ae && ae.result && !K) {
					for (var ar = 0; ar < ae.result.length; ar++) {
						var ax = ae.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="route_promoted">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", ax.url);
						ao.append('<span class="mss-fr">' + ax.typename + "</span>");
						ao.append('<span class="mss-cn">' + ax.title + "</span>");
						ao.append('<span class="mss-gl"> ' + ax.infoname + "</span>")
					}
				}
				var at = aB.qa_info;
				if (at && at.result) {
					for (var ar = 0; ar < at.result.length; ar++) {
						var ah = at.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="wenda">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", ah.url);
						ao.append('<span class="mss-fr">' + ah.typename + "</span>");
						ao.append('<span class="mss-cn">' + ah.title + "</span>")
					}
				}
				var ac = aB.poi_info,
					av = !K;
				if (M.isArray(ay) && M.indexOf(ay, "poi") !== -1) {
					av = true
				}
				if (ac && ac.result && av) {
					for (var ar = 0; ar < ac.result.length; ar++) {
						var al = ac.result[ar],
							X = "hotel" === al.stype ? "hotel" : "poi",
							aj = $('<li class="mss-item _j_listitem" data-type="' + X + '">').appendTo(aq),
							ao = $('<div class="mss-title">').appendTo(aj);
						aj.attr("data-url", al.url);
						ao.append('<span class="mss-fr">' + (!!al.mddname ? al.mddname : "") + al.typename + "</span>");
						ao.append('<span class="mss-cn" style="color:#999;">' + al.dis_name + "</span>")
					}
				}
				var ai = aB.sekey_info,
					au = K;
				if (M.isArray(W) && M.indexOf(W, "sekey") !== -1) {
					au = false
				}
				if (ai && ai.result && au) {
					for (var ar = 0; ar < ai.result.length; ar++) {
						if (ar > 4) {
							break
						}
						var aA = ai.result[ar],
							aj = $('<li class="mss-item _j_listitem" data-type="sekey">').appendTo(aq);
						aj.attr("data-url", aA.url);
						aj.append('<div class="mss-title">' + aA.name + "</div>")
					}
				}
				var ab = aB.ginfo_num;
				if (!!ab) {
					var aj = $('<li class="mss-item _j_listitem" data-type="info">').appendTo(aq);
					aj.append('<div class="mss-title">搜“<span class="mss-key">' + aw + '</span>”相关游记<span class="mss-num">' + ab + "篇</span></div>")
				}
				var am = aB.user_num;
				if (!!ab) {
					var aj = $('<li class="mss-item _j_listitem" data-type="user">').appendTo(aq);
					aj.append('<div class="mss-title">搜“<span class="mss-key">' + aw + "</span>”相关用户</div>")
				}
				if (s > 0) {
					aq.find("._j_listitem").each(function(aC, aD) {
						if (aC > s) {
							$(aD).remove()
						}
					})
				}
				return aq.html()
			},
			updateList: function(V) {
				this.listContainer.find(".mss-list").html(V);
				if (K) {
					this.listContainer.find(".mss-list").addClass("shrink-list")
				}
				if (J) {
					P.input.data("droplist").moveFocus(1)
				}
			}
		});
		if (n) {
			var A = e("InputListener"),
				w = e("SuggestionXHR"),
				D = new w({
					URL: (c.WWW_HOST ? "http://" + c.WWW_HOST : "") + "/search/s.php",
					dataType: "json"
				}),
				v = $("#_j_mfw_search_main"),
				U = E.closest(".search-wrapper"),
				L = $('<div class="search-keyword-tip"></div>').appendTo(U),
				B = C.input === "_j_index_search_input_all",
				G = false,
				u, q, N, k, r;
			A.listen(E, function(W) {
				var V = $(W.target),
					X = $.trim(V.val());
				if (!G && X) {
					G = true
				}
				L.hide()
			});
			M.Event(P).on("before suggestion xhr", function() {
				var V = P.suggestionParams[P.keyParamName];
				if (V && V !== y) {
					D.getSuggestion({
						q: V,
						gall: 1
					}, $.proxy(function(X) {
						var ab = $.trim(E.val());
						if (!ab) {
							return false
						}
						if (!X || !X.keyword || (!X.result && !X.unmatch)) {
							return false
						}
						if (X.unmatch === 1) {
							L.hide()
						} else {
							y = V;
							if (U[0]) {
								var Y = X.keyword.length,
									W = X.keyword.replace(/[A-Za-z0-9\s]/g, "").length,
									aa = Y - W;
								setTimeout(function() {
									L.html(X.keyword).css("left", 32 + W * 14 + aa * 7).show()
								}, 1)
							}
							v.html($(X.result).css("minHeight", 0).html());
							if (g && b) {
								v.find("> .wid").addClass("anim-climb");
								setTimeout(function() {
									v.find("> .wid").removeClass("anim-climb")
								}, 1)
							}
							var Z = c.search_type || "all";
							c.search_seid = Q(V, Z);
							c.search_keyword = V;
							c.is_search_cache = true;
							c.is_search_updated = true
						}
					}, P))
				}
			})
		}
		M.Event(P).on("before suggestion xhr", function() {
			R(E, P.listContainer)
		});
		M.Event(P).on("before show list", function() {
			P.listContainer.find(".mss-list").show()
		});
		M.Event(P).on("itemfocused", function(W) {
			var V = W.prevItem,
				X = W.focusItem,
				Y = P.listContainer;
			if (1 < Y.find(".mss-place").length) {
				if (X.hasClass("mss-place")) {
					Y.find(".mss-place").removeClass("frozen")
				}
				if (!X.hasClass("mss-place") && !!V && V.hasClass("mss-place")) {
					Y.find(".mss-place").removeClass("frozen");
					V.addClass("frozen")
				}
			}
			if (X.hasClass("mss-place")) {
				X.find(".mss-title").addClass("frozen")
			}
		});
		M.Event(P).on("itemselected", function(X) {
			var Z = X.item;
			if (Z.length) {
				var Y = Z.data("type"),
					W = Z.data("url"),
					ab = E.attr("id") === "_j_head_search_input" ? "header" : "default";
				if (Y === "flight_hotel" || Y === "flight" || Y === "local") {
					Y = "sales"
				}
				p = m(i, "all", ab, "suggest");
				if ("info" === Y || "user" === Y) {
					var aa = m(i, Y, ab, "suggest");
					location.href = l + "/search/s.php?q=" + encodeURIComponent(i) + "&t=" + Y + "&seid=" + aa
				} else {
					var W = Z.data("url"),
						V = P.listContainer.find(".mss-item").index(Z.closest(".mss-item")) + 1;
					O(W, V, Y);
					location.href = Z.data("url")
				}
			} else {
				if (i !== "") {
					location.href = l + "/search/s.php?q=" + encodeURIComponent(i)
				}
			}
		});
		var x = E.closest(".head-search-wrapper");
		if (x[0]) {
			E.on("focus", function(V) {
				setTimeout(function() {
					x.addClass("head-search-focus")
				}, 1)
			}).on("blur", function(V) {
				setTimeout(function() {
					if (M.windowFocused) {
						x.removeClass("head-search-focus")
					}
				}, 1)
			})
		}
		if (T && T[0]) {
			T.on("click", function(X) {
				var W = $.trim(E.val());
				if (E.data("url")) {
					if (E.data("url").indexOf("http") !== -1) {
						location.href = E.data("url")
					} else {
						location.href = (c.WWW_HOST ? "http://" + c.WWW_HOST : "") + E.data("url")
					}
					return true
				}
				if (W !== "") {
					if (P.listContainer) {
						P.listContainer.hide()
					}
					var Z = E.attr("id") === "_j_head_search_input" ? "header" : "default",
						aa = c.search_type || "all",
						Y = m(W, aa, Z, "form"),
						V = l + "/search/s.php?q=" + encodeURIComponent(W);
					if (c.search_type && location.pathname === "/search/s.php") {
						V += "&t=" + c.search_type
					}
					V += "&seid=" + Y;
					location.href = V
				}
			})
		}
		if (E && E[0]) {
			E.on("keydown", function(X) {
				if (X.keyCode == 13) {
					var aa = P.input.data("droplist");
					if (aa && aa.getFocusItem().length) {
						return true
					}
					var W = $.trim(E.val());
					if (W !== "") {
						if (P.listContainer) {
							P.listContainer.hide()
						}
						var Z = E.attr("id") === "_j_head_search_input" ? "header" : "default",
							ab = c.search_type || "all",
							Y = m(W, ab, Z, "form"),
							V = l + "/search/s.php?q=" + encodeURIComponent(W);
						if (c.search_type && location.pathname === "/search/s.php") {
							V += "&t=" + c.search_type
						}
						V += "&seid=" + Y;
						location.href = V
					}
				}
			})
		}
		$(window).resize(function() {
			if (P.listContainer && P.listContainer.length && P.listContainer.is(":visible")) {
				R(E, P.listContainer)
			}
		});
		$(window).on("scroll", function(V) {
			if (z) {
				P.hideDropList()
			}
		});

		function R(V, X) {
			var W = V.offset();
			X.css({
				left: W.left + (C.input === "_j_index_search_input_all" ? 0 : 1),
				top: W.top + E.outerHeight() - 2
			})
		}

		function m(V, Z, Y, X) {
			var W = {
				keyword: V,
				content_category: Z,
				searchbox_category: "main_search",
				searchbox_position: Y,
				search_type: X,
				version: d
			};
			return f.search(W)
		}

		function Q(V, X) {
			var W = {
				keyword: V,
				content_category: X,
				version: d
			};
			return f.searchCache(W)
		}

		function O(Y, W, X) {
			var V = {
				id: p,
				keyword: i,
				click_url: Y,
				index: W,
				content_category: X,
				search_type: "suggest",
				version: d
			};
			return f.resultClick(V)
		}

		function F(W, aa) {
			var X = [],
				ac = W.split("|");
			aa = j(aa);
			for (var Z = 0; Z < ac.length; Z++) {
				var Y = $.trim(ac[Z]);
				if (Y == "search://") {
					var V = X.length;
					X[V] = ac[Z++];
					X[V + 1] = ac[Z++];
					X[V + 2] = ac[Z++];
					X[V + 3] = ac[Z++];
					X[V + 4] = ac[Z++];
					X[V + 5] = ac[Z];
					continue
				}
				if (Y) {
					try {
						Y = Y.replace(new RegExp(aa, "ig"), function(ad) {
							return '<span class="highlight">' + ad + "</span>"
						})
					} catch (ab) {
						Y = Y.replace(aa, function(ad) {
							return '<span class="highlight">' + ad + "</span>"
						})
					}
					X[X.length] = Y
				}
			}
			return X
		}
		var o = $("<div/>");

		function j(V) {
			return o.text(V).html()
		}
	};
	return a
});
M.closure(function(c) {
	var r = $("#header");
	if (!r.length) {
		return false
	}
	var o = c("/js/Dropdown");
	var n = c("/js/SiteSearch");
	new n({
		input: "_j_head_search_input",
		submit: "_j_head_search_link",
		isRelevant: true
	});
	$("#_j_nav_sales").find("[data-sales-nav]").on("click", function() {
		var t = $(this).data("salesNav");
		mfwPageEvent("sales", "index_sales_nav", {
			name: t
		})
	});
	if (!window.showBarFlag) {
		$("._j_sales_nav_show").off("hover")
	} else {
		var b = 0,
			p = 0;
		$("._j_sales_nav_show").hover(function() {
			clearTimeout(b);
			p = setTimeout(function() {
				$("._j_sales_nav_show").addClass("head-nav-hover");
				$("._j_sales_top").fadeIn(300)
			}, 200)
		}, function() {
			clearTimeout(p);
			b = setTimeout(function() {
				$("._j_sales_nav_show").removeClass("head-nav-hover");
				$("._j_sales_top").fadeOut(300)
			}, 200)
		})
	}
	var m = 0,
		f = 0;
	$("._j_shequ_nav_show").hover(function() {
		clearTimeout(m);
		f = setTimeout(function() {
			$("._j_shequ_nav_show").addClass("head-nav-hover");
			$("._j_shequ_top").fadeIn(300)
		}, 200)
	}, function() {
		clearTimeout(f);
		m = setTimeout(function() {
			$("._j_shequ_nav_show").removeClass("head-nav-hover");
			$("._j_shequ_top").fadeOut(300)
		}, 200)
	});
	var q = $("#_j_community_panel"),
		i = q.find(".panel-image").length,
		j = Math.floor(Math.random() * i);
	if (j === i) {
		j--
	}
	q.find(".panel-image").eq(j).show();
	$("#_j_showlogin").click(function(t) {
		if (window.location.host === Env.WWW_HOST) {
			t.preventDefault()
		}
		M.Event.fire("login:required")
	});
	var g = window.location.hostname,
		k = window.location.pathname + window.location.search,
		a = $("#_j_head_nav");
	if (g.indexOf("www") === 0) {
		if (k === "" || k === "/") {
			a.children("li:eq(0)").addClass("head-nav-active")
		}
		var h = new RegExp("^/(mdd|photo/mdd|poi|photo/poi|travel-scenic-spot|jd|cy|gw|yl|yj|xc|baike)/|sFrom=mdd.*|sFrom=smdd.*", "i");
		if (h.test(k)) {
			a.children("li:eq(1)").addClass("head-nav-active")
		}
		var e = new RegExp("^/gonglve/.*", "i");
		if (e.test(k)) {
			a.children("li:eq(2)").addClass("head-nav-active")
		}
		var d = window.Env && window.Env.sales_title_tag;
		if (d) {
			if (d === "flight_hotel") {
				a.children("li:eq(3)").find("ul>li:eq(0)>a").addClass("on")
			} else {
				if (d === "visa") {
					a.children("li:eq(3)").find("ul>li:eq(2)>a").addClass("on")
				} else {
					if (d === "localdeals") {
						a.children("li:eq(3)").find("ul>li:eq(1)>a").addClass("on")
					} else {
						if (d === "insurance") {
							a.children("li:eq(3)").find("ul>li:eq(4)>a").addClass("on")
						}
					}
				}
			}
			a.find("li:eq(3)").addClass("head-nav-active")
		}
		if (/^\/insurance\//i.test(k)) {
			a.find("li:eq(3)").addClass("head-nav-active")
		}
		var s = new RegExp("^/hotel/(?!.*sFrom=mdd).*", "ig");
		if (s.test(k)) {
			a.children("li:eq(4)").addClass("head-nav-active");
			a.children("li:eq(4)").find(".head-act616").remove()
		}
		var l = new RegExp("^/(wenda|qa|mall|together|group|i|traveller|rudder|paimai|club|postal|school|photo_pk|focus)/(?!.*sFrom=mdd|s.php*).*", "i");
		if (l.test(k)) {
			a.children("li:eq(5)").addClass("head-nav-active")
		}
	}
});
(function(a) {
	window.wysiwyg = a(window, document)
})(function(j, q) {
	var c = function(A, z, x) {
		var y;
		return function() {
			if (y) {
				if (!x) {
					return
				}
				clearTimeout(y)
			}
			var C = this,
				B = arguments;
			y = setTimeout(function() {
				y = null;
				A.apply(C, B)
			}, z)
		}
	};
	var r = function(y, A, z, x) {
		if (y.addEventListener) {
			y.addEventListener(A, z, x ? true : false)
		} else {
			if (y.attachEvent) {
				y.attachEvent("on" + A, z)
			} else {
				if (y != j) {
					y["on" + A] = z
				}
			}
		}
	};
	var t = function(y, A, z, x) {
		if (y.removeEventListener) {
			y.removeEventListener(A, z, x ? true : false)
		} else {
			if (y.detachEvent) {
				y.detachEvent("on" + A, z)
			} else {
				if (y != j) {
					y["on" + A] = null
				}
			}
		}
	};
	var w = function(z, A, y, x) {
		if (q.createEvent) {
			var B = q.createEvent("Event");
			B.initEvent(A, y !== undefined ? y : true, x !== undefined ? x : false);
			z.dispatchEvent(B)
		} else {
			if (q.createEventObject) {
				var B = q.createEventObject();
				z.fireEvent("on" + A, B)
			} else {
				if (typeof(z["on" + A]) == "function") {
					z["on" + A]()
				}
			}
		}
	};
	var u = function(x) {
		if (x.preventDefault) {
			x.preventDefault()
		} else {
			x.returnValue = false
		}
		if (x.stopPropagation) {
			x.stopPropagation()
		} else {
			x.cancelBubble = true
		}
		return false
	};
	var o = typeof(Node) != "undefined" ? Node.ELEMENT_NODE : 1;
	var f = typeof(Node) != "undefined" ? Node.TEXT_NODE : 3;
	var m = function(x, y) {
		var z = y;
		while (z) {
			if (z === x) {
				return true
			}
			z = z.parentNode
		}
		return false
	};
	var b = function(y, x) {
		if (y.firstChild) {
			return y.firstChild
		}
		while (y) {
			if (y == x) {
				return null
			}
			if (y.nextSibling) {
				return y.nextSibling
			}
			y = y.parentNode
		}
		return null
	};
	var p = function(x) {
		if (j.getSelection) {
			var y = j.getSelection();
			if (y.rangeCount > 0) {
				return y.getRangeAt(0)
			}
		} else {
			if (q.selection) {
				var y = q.selection;
				return y.createRange()
			}
		}
		return null
	};
	var l = function(x, z) {
		if (!z) {
			return
		}
		if (j.getSelection) {
			var y = j.getSelection();
			y.removeAllRanges();
			y.addRange(z)
		} else {
			if (q.selection) {
				z.select()
			}
		}
	};
	var h = function() {
		if (j.getSelection) {
			var B = j.getSelection();
			if (!B.rangeCount) {
				return false
			}
			var y = B.getRangeAt(0).cloneRange();
			if (y.getBoundingClientRect) {
				var A = y.getBoundingClientRect();
				if (A && A.left && A.top && A.right && A.bottom) {
					return {
						left: parseInt(A.left),
						top: parseInt(A.top),
						width: parseInt(A.right - A.left),
						height: parseInt(A.bottom - A.top)
					}
				}
				var x = y.getClientRects ? y.getClientRects() : [];
				for (var z = 0; z < x.length; ++z) {
					var A = x[z];
					if (A.left && A.top && A.right && A.bottom) {
						return {
							left: parseInt(A.left),
							top: parseInt(A.top),
							width: parseInt(A.right - A.left),
							height: parseInt(A.bottom - A.top)
						}
					}
				}
			}
		} else {
			if (q.selection) {
				var B = q.selection;
				if (B.type != "Control") {
					var y = B.createRange();
					if (y.boundingLeft || y.boundingTop || y.boundingWidth || y.boundingHeight) {
						return {
							left: y.boundingLeft,
							top: y.boundingTop,
							width: y.boundingWidth,
							height: y.boundingHeight
						}
					}
				}
			}
		}
		return false
	};
	var i = function(y) {
		if (j.getSelection) {
			var A = j.getSelection();
			if (A.isCollapsed) {
				return true
			}
			return false
		} else {
			if (q.selection) {
				var A = q.selection;
				if (A.type == "Text") {
					var z = q.selection.createRange();
					var x = q.body.createTextRange();
					x.moveToElementText(y);
					x.setEndPoint("EndToStart", z);
					return z.htmlText.length == 0
				}
				if (A.type == "Control") {
					return false
				}
			}
		}
		return true
	};
	var k = function(B) {
		if (j.getSelection) {
			var z = j.getSelection();
			if (!z.rangeCount) {
				return []
			}
			var y = [];
			for (var F = 0; F < z.rangeCount; ++F) {
				var H = z.getRangeAt(F),
					A = H.startContainer,
					I = H.endContainer;
				while (A) {
					if (A != B) {
						var J = false;
						if (z.containsNode) {
							J = z.containsNode(A, true)
						} else {
							var E = q.createRange();
							E.selectNodeContents(A);
							for (var F = 0; F < z.rangeCount; ++F) {
								var H = z.getRangeAt(F);
								if (H.compareBoundaryPoints(H.END_TO_START, E) >= 0 && H.compareBoundaryPoints(H.START_TO_END, E) <= 0) {
									J = true;
									break
								}
							}
						}
						if (J) {
							y.push(A)
						}
					}
					A = b(A, A == I ? I : B)
				}
			}
			if (y.length == 0 && m(B, z.focusNode) && z.focusNode != B) {
				y.push(z.focusNode)
			}
			return y
		} else {
			if (q.selection) {
				var z = q.selection;
				if (z.type == "Text") {
					var y = [];
					var x = z.createRangeCollection();
					for (var F = 0; F < x.length; ++F) {
						var H = x[F],
							G = H.parentElement(),
							A = G;
						while (A) {
							var E = H.duplicate();
							E.moveToElementText(A.nodeType != o ? A.parentNode : A);
							if (E.compareEndPoints("EndToStart", H) >= 0 && E.compareEndPoints("StartToEnd", H) <= 0) {
								var D = false;
								for (var C = 0; C < y.length; ++C) {
									if (y[C] !== A) {
										continue
									}
									D = true;
									break
								}
								if (!D) {
									y.push(A)
								}
							}
							A = b(A, G)
						}
					}
					if (y.length == 0 && m(B, q.activeElement) && q.activeElement != B) {
						y.push(q.activeElement)
					}
					return y
				}
				if (z.type == "Control") {
					var y = [];
					var H = z.createRange();
					for (var F = 0; F < H.length; ++F) {
						y.push(H(F))
					}
					return y
				}
			}
		}
		return []
	};
	var g = function() {
		if (j.getSelection) {
			var y = j.getSelection();
			if (!y.isCollapsed) {
				try {
					y.collapseToEnd()
				} catch (z) {}
			}
		} else {
			if (q.selection) {
				var y = q.selection;
				if (y.type != "Control") {
					var x = y.createRange();
					x.collapse(false);
					x.select()
				}
			}
		}
	};
	var e = function(x, B, A) {
		if (j.getSelection) {
			var C = j.getSelection();
			if (C.modify) {
				for (var z = 0; z < B; ++z) {
					C.modify("extend", "backward", "character")
				}
				for (var z = 0; z < A; ++z) {
					C.modify("extend", "forward", "character")
				}
			} else {
				var y = C.getRangeAt(0);
				y.setStart(y.startContainer, y.startOffset - B);
				y.setEnd(y.endContainer, y.endOffset + A);
				C.removeAllRanges();
				C.addRange(y)
			}
		} else {
			if (q.selection) {
				var C = q.selection;
				if (C.type != "Control") {
					var y = C.createRange();
					y.collapse(true);
					y.moveStart("character", -B);
					y.moveEnd("character", A);
					y.select()
				}
			}
		}
	};
	var s = function(y) {
		if (i(y)) {
			return null
		}
		if (j.getSelection) {
			var D = j.getSelection();
			if (D.rangeCount) {
				var z = q.createElement("div"),
					x = D.rangeCount;
				for (var B = 0; B < x; ++B) {
					var C = D.getRangeAt(B).cloneContents();
					z.appendChild(C)
				}
				return z.innerHTML
			}
		} else {
			if (q.selection) {
				var D = q.selection;
				if (D.type == "Text") {
					var A = D.createRange();
					return A.htmlText
				}
			}
		}
		return null
	};
	var d = function() {
		if (j.getSelection) {
			var x = j.getSelection().anchorNode;
			x = x.nodeType == 3 ? x.parentNode : x;
			return x
		} else {
			if (q.selection) {
				var y = q.selection;
				if (y.type == "Text") {
					return q.selection.createRange().parentElement()
				}
			}
		}
		return null
	};
	var n = function(x, B) {
		if (j.getSelection) {
			var A = j.getSelection();
			if (m(x, A.anchorNode) && m(x, A.focusNode)) {
				return true
			}
			if (!B) {
				return false
			}
			var y = q.createRange();
			y.selectNodeContents(x);
			y.collapse(false);
			A.removeAllRanges();
			A.addRange(y)
		} else {
			if (q.selection) {
				var A = q.selection;
				if (A.type == "Control") {
					var y = A.createRange();
					if (y.length != 0 && m(x, y(0))) {
						return true
					}
				} else {
					var z = q.body.createTextRange();
					z.moveToElementText(x);
					var y = A.createRange();
					if (z.inRange(y)) {
						return true
					}
				}
				if (!B) {
					return false
				}
				var y = q.body.createTextRange();
				y.moveToElementText(x);
				y.setEndPoint("StartToEnd", y);
				y.select()
			}
		}
		return true
	};
	var v = function(B, D) {
		if (j.getSelection) {
			var y = j.getSelection();
			if (y.getRangeAt && y.rangeCount) {
				var E = y.getRangeAt(0);
				var z = q.createElement("div");
				z.innerHTML = D;
				var F = q.createDocumentFragment(),
					A, x;
				while ((A = z.firstChild)) {
					x = F.appendChild(A)
				}
				if (m(B, E.commonAncestorContainer)) {
					E.deleteContents();
					E.insertNode(F)
				} else {
					B.appendChild(F)
				}
				if (x) {
					E = E.cloneRange();
					E.setStartAfter(x);
					E.collapse(true);
					y.removeAllRanges();
					y.addRange(E)
				}
			}
		} else {
			if (q.selection) {
				var y = q.selection;
				if (y.type != "Control") {
					var C = y.createRange();
					C.collapse(true);
					var E = y.createRange();
					if (m(B, E.parentElement())) {
						E.pasteHTML(D)
					} else {
						var G = q.body.createTextRange();
						G.moveToElementText(B);
						G.collapse(false);
						G.select();
						G.pasteHTML(D)
					}
					E = y.createRange();
					E.setEndPoint("StartToEnd", C);
					E.select()
				}
			}
		}
	};
	var a = function(ac) {
		ac = ac || {};
		var V = ac.element || null;
		if (typeof(V) == "string") {
			V = q.getElementById(V)
		}
		var Q = ac.onKeyDown || null;
		var al = ac.onKeyPress || null;
		var y = ac.onKeyUp || null;
		var S = ac.onSelection || null;
		var ad = ac.onPlaceholder || null;
		var ai = ac.onOpenpopup || null;
		var O = ac.onClosepopup || null;
		var af = ac.hijackContextmenu || false;
		var T = ac.readOnly || false;
		var R = V.nodeName == "TEXTAREA" || V.nodeName == "INPUT";
		if (R) {
			var aa = "contentEditable" in q.body;
			if (aa) {
				var F = navigator.userAgent.match(/(?:iPad|iPhone|Android).* AppleWebKit\/([^ ]+)/);
				if (F && 420 <= parseInt(F[1]) && parseInt(F[1]) < 534) {
					aa = false
				}
			}
			if (!aa) {
				var I = V;
				var ag = function(ap) {
					return ap.replace(/<br[ \/]*>\n?/gi, "<br>\n")
				};
				I.value = ag(I.value);
				var am = function() {
					return this
				};
				var C = function() {
					return null
				};
				return {
					legacy: true,
					getElement: function() {
						return I
					},
					getHTML: function() {
						return I.value
					},
					setHTML: function(ap) {
						I.value = ag(ap);
						return this
					},
					getSelectedHTML: C,
					sync: am,
					readOnly: function(ap) {
						if (ap === undefined) {
							return I.hasAttribute ? I.hasAttribute("readonly") : !!I.getAttribute("readonly")
						}
						if (ap) {
							I.setAttribute("readonly", "readonly")
						} else {
							I.removeAttribute("readonly")
						}
						return this
					},
					collapseSelection: am,
					expandSelection: am,
					openPopup: C,
					closePopup: am,
					removeFormat: am,
					bold: am,
					italic: am,
					underline: am,
					strikethrough: am,
					forecolor: am,
					highlight: am,
					fontName: am,
					fontSize: am,
					subscript: am,
					superscript: am,
					align: am,
					format: am,
					indent: am,
					insertLink: am,
					insertImage: am,
					insertHTML: am,
					insertList: am
				}
			}
		}
		var I = null,
			ao = null;
		if (R) {
			I = V;
			I.style.display = "none";
			ao = q.createElement("DIV");
			ao.innerHTML = I.value || "";
			var K = I.parentNode,
				z = I.nextSibling;
			if (z) {
				K.insertBefore(ao, z)
			} else {
				K.appendChild(ao)
			}
		} else {
			ao = V
		}
		if (!T) {
			ao.setAttribute("contentEditable", "true")
		}
		var P = (q.all && (!q.documentMode || q.documentMode <= 8)) ? q : j;
		var U = null,
			ab;
		if (R) {
			var H = ao.innerHTML;
			U = function() {
				var ap = ao.innerHTML;
				if (ap == H) {
					return
				}
				I.value = ap;
				H = ap;
				w(I, "change", false)
			};
			var Y = I.form;
			if (Y) {
				r(Y, "reset", function() {
					ao.innerHTML = "";
					U();
					ab(true)
				})
			}
		}
		var Z;
		if (ad) {
			var N = false;
			Z = function() {
				var ar = true;
				var ap = ao;
				while (ap) {
					ap = b(ap, ao);
					if (!ap) {} else {
						if (ap.nodeType == o) {
							if (ap.nodeName == "IMG") {
								ar = false;
								break
							}
						} else {
							if (ap.nodeType == f) {
								var aq = ap.nodeValue;
								if (aq && aq.search(/[^\s]/) != -1) {
									ar = false;
									break
								}
							}
						}
					}
				}
				if (N != ar) {
					ad(ar);
					N = ar
				}
			};
			Z()
		}
		var X = null,
			E = null,
			W = null;
		if (S) {
			E = function(at, aq, aB) {
				var ay = i(ao);
				var ar = k(ao);
				var aA = (at === null || aq === null) ? null : {
					left: at,
					top: aq,
					width: 0,
					height: 0
				};
				var ap = h();
				if (ap) {
					aA = ap
				}
				if (aA) {
					if (ao.getBoundingClientRect) {
						var aC = ao.getBoundingClientRect();
						aA.left -= parseInt(aC.left);
						aA.top -= parseInt(aC.top)
					} else {
						var aw = ao,
							av = 0,
							au = 0,
							ax = false;
						do {
							av += aw.offsetLeft ? parseInt(aw.offsetLeft) : 0;
							au += aw.offsetTop ? parseInt(aw.offsetTop) : 0;
							if (aw.style.position == "fixed") {
								ax = true
							}
						} while (aw = aw.offsetParent);
						aA.left -= av - (ax ? 0 : j.pageXOffset);
						aA.top -= au - (ax ? 0 : j.pageYOffset)
					}
					if (aA.left < 0) {
						aA.left = 0
					}
					if (aA.top < 0) {
						aA.top = 0
					}
					if (aA.width > ao.offsetWidth) {
						aA.width = ao.offsetWidth
					}
					if (aA.height > ao.offsetHeight) {
						aA.height = ao.offsetHeight
					}
				} else {
					if (ar.length) {
						for (var az = 0; az < ar.length; ++az) {
							var aw = ar[az];
							if (aw.nodeType != o) {
								continue
							}
							aA = {
								left: aw.offsetLeft,
								top: aw.offsetTop,
								width: aw.offsetWidth,
								height: aw.offsetHeight
							};
							break
						}
					}
				}
				S(ay, aA, ar, aB)
			};
			W = c(E, 1)
		}
		var ah = null;
		var D = function(aq) {
			if (!aq) {
				var aq = j.event
			}
			var ap = aq.target || aq.srcElement;
			if (ap.nodeType == f) {
				ap = ap.parentNode
			}
			if (m(ah, ap)) {
				return
			}
			an()
		};
		var ae = function() {
			if (ah) {
				return ah
			}
			r(P, "mousedown", D, true);
			ah = q.createElement("DIV");
			var aq = ao.parentNode,
				ap = ao.nextSibling;
			if (ap) {
				aq.insertBefore(ah, ap)
			} else {
				aq.appendChild(ah)
			}
			if (ai) {
				ai()
			}
			return ah
		};
		var an = function() {
			if (!ah) {
				return
			}
			ah.parentNode.removeChild(ah);
			ah = null;
			t(P, "mousedown", D, true);
			if (O) {
				O()
			}
		};
		r(ao, "focus", function() {
			if (I) {
				w(I, "focus", false)
			}
		});
		r(ao, "blur", function() {
			if (U) {
				U()
			}
			if (I) {
				w(I, "blur", false)
			}
		});
		var B = null;
		if (Z || U) {
			var A = U ? c(U, 250, true) : null;
			var ak = function(ap) {
				if (Z) {
					Z()
				}
				if (A) {
					A()
				}
			};
			B = c(ak, 1);
			r(ao, "input", B);
			r(ao, "DOMNodeInserted", B);
			r(ao, "DOMNodeRemoved", B);
			r(ao, "DOMSubtreeModified", B);
			r(ao, "DOMCharacterDataModified", B);
			r(ao, "propertychange", B);
			r(ao, "textInput", B);
			r(ao, "paste", B);
			r(ao, "cut", B);
			r(ao, "drop", B)
		}
		var J = function(av, ap) {
			if (!av) {
				var av = j.event
			}
			var ar = av.which || av.keyCode,
				au = String.fromCharCode(ar || av.charCode),
				aq = av.shiftKey || false,
				at = av.altKey || false,
				ax = av.ctrlKey || false,
				aw = av.metaKey || false;
			if (ap == 1) {
				if (Q && Q(ar, au, aq, at, ax, aw) === false) {
					return u(av)
				}
			} else {
				if (ap == 2) {
					if (al && al(ar, au, aq, at, ax, aw) === false) {
						return u(av)
					}
				} else {
					if (ap == 3) {
						if (y && y(ar, au, aq, at, ax, aw) === false) {
							return u(av)
						}
					}
				}
			}
			if (ap == 2 || ap == 3) {
				X = null;
				if (W) {
					W(null, null, false)
				}
			}
			if (ap == 2 && B) {
				switch (ar) {
					case 33:
					case 34:
					case 35:
					case 36:
					case 37:
					case 38:
					case 39:
					case 40:
						break;
					default:
						B();
						break
				}
			}
		};
		r(ao, "keydown", function(ap) {
			return J(ap, 1)
		});
		r(ao, "keypress", function(ap) {
			return J(ap, 2)
		});
		r(ao, "keyup", function(ap) {
			return J(ap, 3)
		});
		var aj = function(at, ap) {
			if (!at) {
				var at = j.event
			}
			var ar = null,
				aq = null;
			if (at.clientX && at.clientY) {
				ar = at.clientX;
				aq = at.clientY
			} else {
				if (at.pageX && at.pageY) {
					ar = at.pageX - j.pageXOffset;
					aq = at.pageY - j.pageYOffset
				}
			}
			if (at.which && at.which == 3) {
				ap = true
			} else {
				if (at.button && at.button == 2) {
					ap = true
				}
			}
			t(P, "mouseup", aj);
			X = null;
			if (!af && ap) {
				return
			}
			if (W) {
				W(ar, aq, ap)
			}
		};
		r(ao, "mousedown", function(ap) {
			t(P, "mouseup", aj);
			r(P, "mouseup", aj)
		});
		r(ao, "mouseup", function(ap) {
			aj(ap);
			if (B) {
				B()
			}
		});
		r(ao, "dblclick", function(ap) {
			aj(ap)
		});
		r(ao, "selectionchange", function(ap) {
			aj(ap)
		});
		if (af) {
			r(ao, "contextmenu", function(ap) {
				aj(ap, true);
				return u(ap)
			})
		}
		var x = function(av, au, ar) {
			l(ao, X);
			ao.focus();
			if (!n(ao, ar)) {
				return false
			}
			if (j.getSelection) {
				try {
					if (q.queryCommandSupported && !q.queryCommandSupported(av)) {
						return false
					}
					return q.execCommand(av, false, au)
				} catch (at) {}
			} else {
				if (q.selection) {
					var aq = q.selection;
					if (aq.type != "None") {
						var ap = aq.createRange();
						try {
							if (!ap.queryCommandEnabled(av)) {
								return false
							}
							return ap.execCommand(av, false, au)
						} catch (at) {}
					}
				}
			}
			return false
		};
		var G = null;
		var L = function() {
			if (q.all || !!j.MSInputMethodContext) {
				G = q.createElement("DIV");
				ao.appendChild(G)
			}
		};
		ab = function(ap) {
			if (G) {
				ao.removeChild(G);
				G = null
			}
			if (B) {
				B()
			}
			if (ap) {
				g();
				X = null
			} else {
				if (X) {
					X = p(ao)
				}
			}
		};
		return {
			getElement: function() {
				return ao
			},
			getHTML: function() {
				return ao.innerHTML
			},
			setHTML: function(ap) {
				ao.innerHTML = ap || "<br>";
				ab(true);
				return this
			},
			getSelectedNodes: function() {
				return k(ao)
			},
			getSelectedHTML: function() {
				l(ao, X);
				if (!n(ao)) {
					return null
				}
				return s(ao)
			},
			getSelectionParentNode: function() {
				l(ao, X);
				if (!n(ao)) {
					return null
				}
				return d()
			},
			sync: function() {
				if (U) {
					U()
				}
				return this
			},
			readOnly: function(ap) {
				if (ap === undefined) {
					return ao.hasAttribute ? !ao.hasAttribute("contentEditable") : !ao.getAttribute("contentEditable")
				}
				if (ap) {
					ao.removeAttribute("contentEditable")
				} else {
					ao.setAttribute("contentEditable", "true")
				}
				return this
			},
			collapseSelection: function() {
				g();
				X = null;
				return this
			},
			expandSelection: function(aq, ap) {
				l(ao, X);
				if (!n(ao)) {
					return this
				}
				e(ao, aq, ap);
				X = p(ao);
				return this
			},
			saveSelection: function() {
				X = p(ao)
			},
			openPopup: function() {
				if (!X) {
					X = p(ao)
				}
				return ae()
			},
			closePopup: function() {
				an();
				return this
			},
			removeFormat: function() {
				x("removeFormat");
				x("unlink");
				ab();
				return this
			},
			bold: function() {
				x("bold");
				ab();
				return this
			},
			italic: function() {
				x("italic");
				ab();
				return this
			},
			underline: function() {
				x("underline");
				ab();
				return this
			},
			strikethrough: function() {
				x("strikeThrough");
				ab();
				return this
			},
			forecolor: function(ap) {
				x("foreColor", ap);
				ab();
				return this
			},
			highlight: function(ap) {
				if (!x("hiliteColor", ap)) {
					x("backColor", ap)
				}
				ab();
				return this
			},
			fontName: function(ap) {
				x("fontName", ap);
				ab();
				return this
			},
			fontSize: function(ap) {
				x("fontSize", ap);
				ab();
				return this
			},
			subscript: function() {
				x("subscript");
				ab();
				return this
			},
			superscript: function() {
				x("superscript");
				ab();
				return this
			},
			align: function(ap) {
				L();
				if (ap == "left") {
					x("justifyLeft")
				} else {
					if (ap == "center") {
						x("justifyCenter")
					} else {
						if (ap == "right") {
							x("justifyRight")
						} else {
							if (ap == "justify") {
								x("justifyFull")
							}
						}
					}
				}
				ab();
				return this
			},
			format: function(ap) {
				L();
				x("formatBlock", ap);
				ab();
				return this
			},
			indent: function(ap) {
				L();
				x(ap ? "outdent" : "indent");
				ab();
				return this
			},
			insertLink: function(ap) {
				x("createLink", ap);
				ab(true);
				return this
			},
			insertImage: function(ap) {
				x("insertImage", ap, true);
				ab(true);
				return this
			},
			insertHTML: function(ap) {
				if (!x("insertHTML", ap, true)) {
					l(ao, X);
					n(ao, true);
					v(ao, ap)
				}
				ab(true);
				return this
			},
			insertList: function(ap) {
				L();
				x(ap ? "insertOrderedList" : "insertUnorderedList");
				ab();
				return this
			}
		}
	};
	return a
});
(function(a) {
	return a(window, document, jQuery)
})(function(e, a, f) {
	var c = function(o, C, A) {
		var j, u, y, n, x, l, k, B;
		n = Math.floor(o * 6);
		x = o * 6 - n;
		l = A * (1 - C);
		k = A * (1 - x * C);
		B = A * (1 - (1 - x) * C);
		switch (n % 6) {
			case 0:
				j = A, u = B, y = l;
				break;
			case 1:
				j = k, u = A, y = l;
				break;
			case 2:
				j = l, u = A, y = B;
				break;
			case 3:
				j = l, u = k, y = A;
				break;
			case 4:
				j = B, u = l, y = A;
				break;
			case 5:
				j = A, u = l, y = k;
				break
		}
		var z = Math.floor(j * 255).toString(16);
		var m = Math.floor(u * 255).toString(16);
		var w = Math.floor(y * 255).toString(16);
		return "#" + (z.length < 2 ? "0" : "") + z + (m.length < 2 ? "0" : "") + m + (w.length < 2 ? "0" : "") + w
	};
	var d = function(g) {
		return g.replace(/[&<>"]/g, function(h) {
			var i = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;"
			};
			return i[h] || h
		})
	};
	var b = function(z, n, C, j, v, H, T, s, S, U, k, R, F, g, O, D, L, N) {
		var P = function(V, W) {
			if (!W) {} else {
				if (V.getSelectedHTML()) {
					V.insertLink(W)
				} else {
					V.insertHTML('<a href="' + d(W) + '">' + d(W) + "</a>")
				}
			}
			V.closePopup().collapseSelection()
		};
		var w = function(V, Y) {
			var Z = f('<input type="text" value="">').val(Y ? Y.attr("href") : "").addClass("wysiwyg-input").keypress(function(aa) {
				if (aa.which != 10 && aa.which != 13) {
					return
				}
				if (Y) {
					Y.prop("href", Z.val());
					V.closePopup().collapseSelection()
				} else {
					P(V, Z.val())
				}
			});
			if (s) {
				Z.prop("placeholder", s)
			}
			var X = f();
			if (H) {
				X = E(H).click(function(aa) {
					if (Y) {
						Y.prop("href", Z.val());
						V.closePopup().collapseSelection()
					} else {
						P(V, Z.val())
					}
					aa.stopPropagation();
					aa.preventDefault();
					return false
				})
			}
			var W = f("<div/>").addClass("wysiwyg-toolbar-form").prop("unselectable", "on");
			W.append(Z).append(X);
			return W
		};
		var r = function(Y) {
			var W = function(af, ae) {
				var ag = '<img id="wysiwyg-insert-image" src="" alt=""' + (ae ? ' title="' + d(ae) + '"' : "") + ">";
				Y.insertHTML(ag).closePopup().collapseSelection();
				var ah = f("#wysiwyg-insert-image").removeAttr("id");
				if (U) {
					ah.css({
						maxWidth: U[0] + "px",
						maxHeight: U[1] + "px"
					}).load(function() {
						ah.css({
							maxWidth: "",
							maxHeight: ""
						});
						var aj = ah.width(),
							ai = ah.height();
						if (aj > U[0] || ai > U[1]) {
							if ((aj / ai) > (U[0] / U[1])) {
								ai = parseInt(ai / aj * U[0]);
								aj = U[0]
							} else {
								aj = parseInt(aj / ai * U[1]);
								ai = U[1]
							}
							ah.prop("width", aj).prop("height", ai)
						}
					})
				}
				ah.prop("src", af)
			};
			var X = f("<div/>").addClass("wysiwyg-toolbar-form").prop("unselectable", "on");
			var ab = null,
				ad = f('<input type="file">').css({
					position: "absolute",
					left: 0,
					top: 0,
					width: "100%",
					height: "100%",
					opacity: 0,
					cursor: "pointer"
				});
			if (!F && e.File && e.FileReader && e.FileList) {
				var Z = function(af) {
					if (typeof(k) === "function" && !k(af)) {
						return
					} else {
						if (!af.type.match(k)) {
							return
						}
					}
					var ae = new FileReader();
					ae.onload = function(ah) {
						var ag = ah.target.result;
						W(ag, af.name)
					};
					ae.readAsDataURL(af)
				};
				ab = ad.prop("draggable", "true").change(function(ag) {
					var af = ag.target.files;
					for (var ae = 0; ae < af.length; ++ae) {
						Z(af[ae])
					}
				}).on("dragover", function(ae) {
					ae.originalEvent.dataTransfer.dropEffect = "copy";
					ae.stopPropagation();
					ae.preventDefault();
					return false
				}).on("drop", function(ag) {
					var af = ag.originalEvent.dataTransfer.files;
					for (var ae = 0; ae < af.length; ++ae) {
						Z(af[ae])
					}
					ag.stopPropagation();
					ag.preventDefault();
					return false
				})
			} else {
				if (R) {
					var ac = ad.change(function(ae) {
						R.call(this, W)
					});
					ab = f("<form/>").append(ac)
				}
			}
			if (ab) {
				f("<div/>").addClass("wysiwyg-browse").html(T).append(ab).appendTo(X)
			}
			var aa = f('<input type="text" value="">').addClass("wysiwyg-input").keypress(function(ae) {
				if (ae.which == 10 || ae.which == 13) {
					W(aa.val())
				}
			});
			if (s) {
				aa.prop("placeholder", s)
			}
			var V = f();
			if (H) {
				V = E(H).click(function(ae) {
					W(aa.val());
					ae.stopPropagation();
					ae.preventDefault();
					return false
				})
			}
			X.append(f("<div/>").append(aa).append(V));
			return X
		};
		var q = function(V) {
			var Y = function(ab, ac) {
				ab = f.trim(ab || "");
				ac = f.trim(ac || "");
				var ad = false;
				if (ab.length && !ac.length) {
					ad = ab
				} else {
					if (ac.indexOf("<") == -1 && ac.indexOf(">") == -1 && ac.match(/^(?:https?:\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?$/)) {
						ad = ac
					}
				}
				if (ad && g) {
					ac = g(ad) || ""
				}
				if (!ac.length && ad) {
					ac = '<video src="' + d(ad) + '">'
				}
				V.insertHTML(ac).closePopup().collapseSelection()
			};
			var W = f("<div/>").addClass("wysiwyg-toolbar-form").prop("unselectable", "on");
			var X = f("<textarea>").addClass("wysiwyg-input wysiwyg-inputtextarea");
			if (S) {
				X.prop("placeholder", S)
			}
			f("<div/>").addClass("wysiwyg-embedcode").append(X).appendTo(W);
			var aa = f('<input type="text" value="">').addClass("wysiwyg-input").keypress(function(ab) {
				if (ab.which == 10 || ab.which == 13) {
					Y(aa.val())
				}
			});
			if (s) {
				aa.prop("placeholder", s)
			}
			var Z = f();
			if (H) {
				Z = E(H).click(function(ab) {
					Y(aa.val(), X.val());
					ab.stopPropagation();
					ab.preventDefault();
					return false
				})
			}
			W.append(f("<div/>").append(aa).append(Z));
			return W
		};
		var B = function(W, Y) {
			var V = f("<table/>").prop("cellpadding", "0").prop("cellspacing", "0").prop("unselectable", "on");
			for (var ag = 1; ag < 15; ++ag) {
				var ae = f("<tr/>");
				for (var X = 0; X < 25; ++X) {
					var Z;
					if (X == 24) {
						var af = Math.floor(255 / 13 * (14 - ag)).toString(16);
						var ac = (af.length < 2 ? "0" : "") + af;
						Z = "#" + ac + ac + ac
					} else {
						var ab = X / 24;
						var aa = ag <= 8 ? ag / 8 : 1;
						var ad = ag > 8 ? (16 - ag) / 8 : 1;
						Z = c(ab, aa, ad)
					}
					f("<td/>").addClass("wysiwyg-toolbar-color").prop("title", Z).prop("unselectable", "on").css({
						backgroundColor: Z
					}).click(function() {
						var ah = this.title;
						if (Y) {
							W.forecolor(ah).closePopup().collapseSelection()
						} else {
							W.highlight(ah).closePopup().collapseSelection()
						}
						return false
					}).appendTo(ae)
				}
				V.append(ae)
			}
			return V
		};
		var Q = function(V, W) {
			switch (V) {
				case "insertimage":
					if (!W) {
						return null
					}
					return function(X) {
						W(r(h), X)
					};
				case "insertvideo":
					if (!W) {
						return null
					}
					return function(X) {
						W(q(h), X)
					};
				case "insertlink":
					if (!W) {
						return null
					}
					return function(X) {
						W(w(h), X)
					};
				case "bold":
					return function() {
						h.bold()
					};
				case "italic":
					return function() {
						h.italic()
					};
				case "underline":
					return function() {
						h.underline()
					};
				case "strikethrough":
					return function() {
						h.strikethrough()
					};
				case "forecolor":
					if (!W) {
						return null
					}
					return function(X) {
						W(B(h, true), X)
					};
				case "highlight":
					if (!W) {
						return null
					}
					return function(X) {
						W(B(h, false), X)
					};
				case "alignleft":
					return function() {
						h.align("left")
					};
				case "aligncenter":
					return function() {
						h.align("center")
					};
				case "alignright":
					return function() {
						h.align("right")
					};
				case "alignjustify":
					return function() {
						h.align("justify")
					};
				case "subscript":
					return function() {
						h.subscript()
					};
				case "superscript":
					return function() {
						h.superscript()
					};
				case "indent":
					return function() {
						h.indent()
					};
				case "outdent":
					return function() {
						h.indent(true)
					};
				case "orderedList":
					return function() {
						h.insertList(true)
					};
				case "unorderedList":
					return function() {
						h.insertList()
					};
				case "removeformat":
					return function() {
						h.removeFormat().closePopup().collapseSelection()
					}
			}
			return null
		};
		var E = function(W) {
			var V = f("<a/>").addClass("wysiwyg-toolbar-icon").prop("href", "#").prop("unselectable", "on").append(W.image);
			f.each(W, function(X, Y) {
				switch (X) {
					case "class":
						V.addClass(Y);
						break;
					case "image":
					case "html":
					case "popup":
					case "click":
					case "showstatic":
					case "showselection":
						break;
					default:
						V.attr(X, Y);
						break
				}
			});
			return V
		};
		var p = function(V, W, X, Y) {
			f.each(v, function(Z, ac) {
				if (!ac) {
					return
				}
				if (W === false && "showstatic" in ac && !ac.showstatic) {
					return
				}
				if (W === true && "showselection" in ac && !ac.showselection) {
					return
				}
				var ab;
				if ("click" in ac) {
					ab = function(ad) {
						ac.click(f(ad))
					}
				} else {
					if ("popup" in ac) {
						ab = function(ae) {
							var af = X();
							var ad = ac.popup(af, f(ae));
							Y(af, ae, ad)
						}
					} else {
						ab = Q(Z, function(ad, ae) {
							var af = X();
							af.append(ad);
							Y(af, ae);
							af.find("input[type=text]:first").focus()
						})
					}
				}
				var aa;
				if (ab) {
					aa = E(ac).click(function(ad) {
						ab(ad.currentTarget);
						if (Q(Z)) {
							h.getElement().focus()
						}
						ad.stopPropagation();
						ad.preventDefault();
						return false
					})
				} else {
					if (ac.html) {
						aa = f(ac.html)
					}
				}
				if (aa) {
					V.append(aa)
				}
			})
		};
		var u = function(af, ai, Z, ae) {
			var ak = ai.get(0),
				W = ak.offsetParent,
				V = 0,
				aj = 0,
				ad = false,
				ac = 0,
				al = 0,
				ag = false,
				X = false,
				Y = af.width(),
				ah = W;
			while (ah) {
				ac += ah.offsetLeft;
				al += ah.offsetTop;
				var an = f(ah),
					aa = an.css("position");
				if (aa != "static") {
					ad = true
				} else {
					if (!ad) {
						V += ah.offsetLeft;
						aj += ah.offsetTop
					}
				}
				if (aa == "fixed") {
					ag = true
				}
				if (an.css("overflow") != "visible") {
					X = true
				}
				ah = ah.offsetParent
			}
			var ao = f(W || a.body);
			ao.append(af);
			Z += V + ak.offsetLeft;
			ae += aj + ak.offsetTop;
			if (ag || X) {
				if (Z + Y > ao.width() - 1) {
					Z = ao.width() - Y - 1
				}
				if (Z < 1) {
					Z = 1
				}
			}
			var am = f(e).width();
			if (ac + Z + Y > am - 1) {
				Z = am - ac - Y - 1
			}
			var ab = ag ? 0 : f(e).scrollLeft();
			if (ac + Z < ab + 1) {
				Z = ab - ac + 1
			}
			af.css({
				left: parseInt(Z) + "px",
				top: parseInt(ae) + "px"
			})
		};
		var t = {},
			i = null;
		var y = function(ac, ab, Z, aa) {
			var Y = function(ai, am, aj, al, af, ag, ak) {
				if (!N) {
					return
				}
				var ah = i || "";
				switch (am) {
					case 8:
						ah = ah.substring(0, ah.length - 1);
					case 13:
					case 27:
					case 33:
					case 34:
					case 35:
					case 36:
					case 37:
					case 38:
					case 39:
					case 40:
						if (ai) {
							return
						}
						aj = false;
						break;
					default:
						if (!ai) {
							return
						}
						ah += aj;
						break
				}
				var ae = N(ah, am, aj, al, af, ag, ak);
				if (typeof(ae) == "object" && ae.length) {
					var ad = f(V.openPopup());
					ad.hide().addClass("wysiwyg-popup wysiwyg-popuphover").empty().append(ae);
					i = ah
				} else {
					V.closePopup();
					i = null;
					return ae
				}
			};
			var X = {
				element: ac.get(0),
				onKeyDown: function(af, ah, ae, ag, aj, ai) {
					if (O && O(af, ah, ae, ag, aj, ai) === false) {
						return false
					}
					if (ah && !ae && !ag && aj && !ai) {
						var ad = ah.toLowerCase();
						if (!t[ad]) {
							return
						}
						t[ad]();
						return false
					}
					return Y(false, af, ah, ae, ag, aj, ai)
				},
				onKeyPress: function(ae, ag, ad, af, ai, ah) {
					if (D && D(ae, ag, ad, af, ai, ah) === false) {
						return false
					}
					return Y(true, ae, ag, ad, af, ai, ah)
				},
				onKeyUp: function(ae, ag, ad, af, ai, ah) {
					if (L && L(ae, ag, ad, af, ai, ah) === false) {
						return false
					}
				},
				onSelection: function(ak, ah, ae, af) {
					var ag = true,
						ad = null;
					if (ak) {
						f.each(ae, function(am, an) {
							var al = f(an).closest("a");
							if (al.length != 0) {
								ad = w(V, al);
								return false
							}
						})
					}
					if (V.readOnly()) {
						ag = false
					} else {
						if (!ah) {
							ag = false
						} else {
							if (ad) {} else {
								if (af) {} else {
									if (i) {} else {
										if (f.inArray("selection", j.split("-")) == -1) {
											ag = false
										} else {
											if (ak) {
												ag = false
											} else {
												if (ae.length == 1 && ae[0].nodeName == "IMG") {
													ag = false
												}
											}
										}
									}
								}
							}
						}
					}
					if (!ag) {
						V.closePopup();
						return
					}
					var aj;
					var ai = function() {
						var ap = aj.outerWidth();
						var ao = Z.offset(),
							al = f(V.getElement()).offset();
						var an = ah.left + parseInt(ah.width / 2) - parseInt(ap / 2) + al.left - ao.left;
						var am = ah.top + ah.height + al.top - ao.top;
						u(aj, Z, an, am)
					};
					aj = f(V.openPopup());
					if (!aj.hasClass("wysiwyg-popuphover") || (!aj.data("special")) != (!ad)) {
						aj = f(V.closePopup().openPopup())
					}
					if (i) {
						aj.show()
					} else {
						if (!aj.hasClass("wysiwyg-popup")) {
							aj.addClass("wysiwyg-popup wysiwyg-popuphover");
							if (ad) {
								aj.empty().append(ad).data("special", true)
							} else {
								p(aj, true, function() {
									return aj.empty()
								}, ai)
							}
						}
					}
					ai()
				},
				onOpenpopup: function() {
					G()
				},
				onClosepopup: function() {
					i = null;
					K()
				},
				hijackContextmenu: (j == "selection"),
				readOnly: !!ac.prop("readonly")
			};
			if (aa) {
				var W = f("<div/>").addClass("wysiwyg-placeholder").html(aa).hide();
				Z.prepend(W);
				X.onPlaceholder = function(ad) {
					if (ad) {
						W.show()
					} else {
						W.hide()
					}
				}
			}
			var V = wysiwyg(X);
			return V
		};
		var m = f("<div/>").addClass("wysiwyg-container");
		if (n) {
			m.addClass(n)
		}
		z.wrap(m);
		m = z.parent(".wysiwyg-container");
		var o = false;
		if (C) {
			o = f("<div/>").addClass("wysiwyg-wrapper").click(function() {
				h.getElement().focus()
			});
			z.wrap(o);
			o = z.parent(".wysiwyg-wrapper")
		}
		var h = y(z, m, C ? o : m, C);
		if (h.legacy) {
			var z = f(h.getElement());
			z.addClass("wysiwyg-textarea");
			if (z.is(":visible")) {
				z.width(m.width() - (z.outerWidth() - z.width()))
			}
		} else {
			f(h.getElement()).addClass("wysiwyg-editor")
		}
		var A = null;
		var G = function() {
			if (A) {
				clearTimeout(A)
			}
			A = null;
			m.addClass("wysiwyg-active");
			m.find(".wysiwyg-toolbar-focus").slideDown(200)
		};
		var K = function() {
			if (A || a.activeElement == h.getElement()) {
				return
			}
			A = setTimeout(function() {
				A = null;
				m.removeClass("wysiwyg-active");
				if (f.trim(h.getHTML().replace(/<br\s*[\/]?>/gi, "")).length == 0) {
					m.find(".wysiwyg-toolbar-focus").slideUp(200)
				}
			}, 100)
		};
		f(h.getElement()).focus(G).blur(K);
		z.closest("form").on("reset", K);
		var I = {};
		f.each(v, function(V, X) {
			if (!X || !X.hotkey) {
				return
			}
			var W = Q(V);
			if (!W) {
				return
			}
			t[X.hotkey.toLowerCase()] = W;
			I[V] = W
		});
		if (!f.isEmptyObject(v) && j != "selection") {
			var J = f.inArray("top", j.split("-")) != -1;
			var x = f.inArray("focus", j.split("-")) != -1;
			var l = f("<div/>").addClass("wysiwyg-toolbar").addClass(J ? "wysiwyg-toolbar-top" : "wysiwyg-toolbar-bottom");
			if (x) {
				l.hide().addClass("wysiwyg-toolbar-focus")
			}
			p(l, false, function() {
				var V = f(h.openPopup());
				if (V.hasClass("wysiwyg-popup") && V.hasClass("wysiwyg-popuphover")) {
					V = f(h.closePopup().openPopup())
				}
				if (!V.hasClass("wysiwyg-popup")) {
					V.addClass("wysiwyg-popup")
				}
				return V
			}, function(aa, Z, V) {
				var W = f(Z);
				var ab = aa.outerWidth();
				var Y = W.offset().left - m.offset().left + parseInt(W.width() / 2) - parseInt(ab / 2);
				var X = W.offset().top - m.offset().top;
				if (J) {
					X += W.outerHeight()
				} else {
					X -= aa.outerHeight()
				}
				if (V) {
					Y = V.left;
					X = V.top
				}
				u(aa, m, Y, X)
			});
			if (J) {
				m.prepend(l)
			} else {
				m.append(l)
			}
		}
		return {
			wysiwygeditor: h,
			$container: m
		}
	};
	f.fn.wysiwyg = function(g, i) {
		if (!g || typeof(g) === "object") {
			g = f.extend({}, g);
			return this.each(function() {
				var t = f(this);
				if (t.data("wysiwyg")) {
					return
				}
				var y = g["class"],
					n = g.placeholder || t.prop("placeholder"),
					m = g.toolbar || "top",
					x = g.buttons || {},
					l = g.submit,
					u = g.selectImage,
					A = g.placeholderUrl || null,
					j = g.placeholderEmbed || null,
					s = g.maxImageSize || null,
					v = g.filterImageType || "^image/",
					o = g.onImageUpload || null,
					k = g.forceImageUpload && o,
					q = g.videoFromUrl || null,
					w = g.onKeyDown || null,
					z = g.onKeyPress || null,
					p = g.onKeyUp || null,
					r = g.onAutocomplete || null;
				var B = b(t, y, n, m, x, l, u, A, j, s, v, o, k, q, w, z, p, r);
				t.data("wysiwyg", B)
			})
		} else {
			if (this.length == 1) {
				var h = this.data("wysiwyg");
				if (!h) {
					return this
				}
				if (g == "container") {
					return h.$container
				}
				if (g == "shell") {
					return h.wysiwygeditor
				}
			}
		}
		return this
	}
});
if (window.M && typeof window.M.define == "function") {
	window.M.define("/js/plugins/wysiwyg/wysiwyg", function() {})
}(function(c) {
	var b = c.scrollTo = function(e, d, f) {
		c(window).scrollTo(e, d, f)
	};
	b.defaults = {
		axis: "xy",
		duration: parseFloat(c.fn.jquery) >= 1.3 ? 0 : 1,
		limit: true
	};
	b.window = function(d) {
		return c(window)._scrollable()
	};
	c.fn._scrollable = function() {
		return this.map(function() {
			var e = this,
				f = !e.nodeName || c.inArray(e.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
			if (!f) {
				return e
			}
			var d = (e.contentWindow || e).document || e.ownerDocument || e;
			return /webkit/i.test(navigator.userAgent) || d.compatMode == "BackCompat" ? d.body : d.documentElement
		})
	};
	c.fn.scrollTo = function(i, h, d) {
		if (typeof h == "object") {
			d = h;
			h = 0
		}
		if (typeof d == "function") {
			d = {
				onAfter: d
			}
		}
		if (i == "max") {
			i = 9000000000
		}
		d = c.extend({}, b.defaults, d);
		h = h || d.duration;
		d.queue = d.queue && d.axis.length > 1;
		if (d.queue) {
			h /= 2
		}
		d.offset = a(d.offset);
		d.over = a(d.over);
		return this._scrollable().each(function() {
			if (!i) {
				return
			}
			var m = this,
				j = c(m),
				k = i,
				g, e = {},
				l = j.is("html,body");
			switch (typeof k) {
				case "number":
				case "string":
					if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(k)) {
						k = a(k);
						break
					}
					k = c(k, this);
					if (!k.length) {
						return
					}
				case "object":
					if (k.is || k.style) {
						g = (k = c(k)).offset()
					}
			}
			c.each(d.axis.split(""), function(s, q) {
				var o = q == "x" ? "Left" : "Top",
					u = o.toLowerCase(),
					r = "scroll" + o,
					p = m[r],
					n = b.max(m, q);
				if (g) {
					e[r] = g[u] + (l ? 0 : p - j.offset()[u]);
					if (d.margin) {
						e[r] -= parseInt(k.css("margin" + o)) || 0;
						e[r] -= parseInt(k.css("border" + o + "Width")) || 0
					}
					e[r] += d.offset[u] || 0;
					if (d.over[u]) {
						e[r] += k[q == "x" ? "width" : "height"]() * d.over[u]
					}
				} else {
					var t = k[u];
					e[r] = t.slice && t.slice(-1) == "%" ? parseFloat(t) / 100 * n : t
				}
				if (d.limit && /^\d+$/.test(e[r])) {
					e[r] = e[r] <= 0 ? 0 : Math.min(e[r], n)
				}
				if (!s && d.queue) {
					if (p != e[r]) {
						f(d.onAfterFirst)
					}
					delete e[r]
				}
			});
			f(d.onAfter);

			function f(n) {
				j.animate(e, h, d.easing, n && function() {
					n.call(this, i, d)
				})
			}
		}).end()
	};
	b.max = function(h, g) {
		var k = g == "x" ? "Width" : "Height",
			f = "scroll" + k;
		if (!c(h).is("html,body")) {
			return h[f] - c(h)[k.toLowerCase()]()
		}
		var j = "client" + k,
			i = h.ownerDocument.documentElement,
			e = h.ownerDocument.body;
		return Math.max(i[f], e[f]) - Math.min(i[j], e[j])
	};

	function a(d) {
		return typeof d == "object" ? d : {
			top: d,
			left: d
		}
	}
})(jQuery);
if (window.M && typeof window.M.define == "function") {
	window.M.define("/js/jquery.scrollTo.js", function() {
		return jQuery
	})
}
M.define("dialog/Layer", function(a) {
	var g = 0,
		f = 550,
		d = (function() {
			return $.browser && $.browser.msie && parseInt($.browser.version, 10) == 7
		}()),
		c = (function() {
			return $.browser && $.browser.msie && parseInt($.browser.version, 10) < 7
		}());

	function b() {
		return g++
	}

	function e(h) {
		this.opacity = 0.8;
		this.background = "#fff";
		this.impl = "Dialog";
		this.fixed = true;
		M.mix(this, h);
		this.id = "_j_layer_" + b();
		this.stacks = [];
		this.activeStackId = null;
		this.overflow = false;
		this.changeFixed = false;
		e.instances[this.id] = this;
		if (!e[this.impl]) {
			e[this.impl] = []
		}
		e[this.impl].push(this.id);
		this.init()
	}
	e.prototype = {
		init: function() {
			this._createPanel()
		},
		_createPanel: function() {
			f++;
			var h = {
					position: (!c && this.fixed) ? "fixed" : "absolute",
					width: "100%",
					height: "100%",
					top: 0,
					left: 0
				},
				j = M.mix({}, h, {
					"z-index": f,
					display: "none"
				}),
				k = M.mix({}, h, {
					position: !c ? "fixed" : "absolute",
					background: this.background,
					opacity: this.opacity,
					"z-index": -1
				}),
				i = M.mix({}, h, {
					"z-index": 0
				}, (!c && this.fixed) ? {
					"overflow-x": "hidden",
					"overflow-y": "hidden"
				} : {
					overflow: "visible"
				});
			this._panel = $('<div id="' + this.id + '" class="layer _j_layer">                                <div class="layer_mask _j_mask"></div>                                <div class="layer_content _j_content"></div>                            </div>').css(j).appendTo("body");
			this._mask = this._panel.children("._j_mask").css(k);
			this._content = this._panel.children("._j_content").css(i)
		},
		setZIndex: function(h) {
			f = h;
			this._panel.css("z-index", f)
		},
		getZIndex: function() {
			return +this._panel.css("z-index")
		},
		toFront: function() {
			this.setZIndex(f + 1)
		},
		setFixed: function(h) {
			h = !!h;
			if (this.fixed != h) {
				this.changeFixed = true;
				this.fixed = h;
				if (!c && this.fixed) {
					this._panel.css("position", "fixed");
					this._content.css({
						position: "fixed",
						"overflow-x": "hidden",
						"overflow-y": "hidden"
					})
				} else {
					this._panel.css("position", "absolute");
					this._content.css({
						position: "absolute",
						"overflow-x": "",
						"overflow-y": "",
						overflow: "visible"
					})
				}
			} else {
				this.changeFixed = false
			}
		},
		newStack: function(i) {
			var h = $(i).appendTo(this._content);
			this.stacks.push(h);
			return this.stacks.length - 1
		},
		getStack: function(h) {
			return this.stacks[h]
		},
		getActiveStack: function() {
			return this.stacks[this.activeStackId]
		},
		setActiveStack: function(h) {
			this.activeStackId = h
		},
		getPanel: function() {
			return this._panel
		},
		getMask: function() {
			return this._mask
		},
		getContent: function() {
			return this._content
		},
		show: function(j) {
			var i = this;
			if (this.visible) {
				typeof j === "function" && j();
				return
			}
			e.activeId = this.id;
			this.visible = true;
			if (c) {
				var h = document.documentElement && document.documentElement.scrollHeight || document.body.scrollHeight;
				this._panel.css("height", h);
				this._mask.css("height", h)
			}
			this._panel.fadeIn(200, function() {
				typeof j === "function" && j()
			})
		},
		hide: function(i) {
			var h = this;
			if (!this.visible) {
				typeof i === "function" && i();
				return
			}
			this.visible = false;
			if (c) {
				this._panel.css("height", "");
				this._mask.css("height", "")
			}
			this._panel.fadeOut(200, function() {
				typeof i === "function" && i();
				h._recoverTopScroller()
			})
		},
		setOverFlow: function(h) {
			this.overflow = h;
			if (h) {
				if (!c && this.fixed) {
					this._hideTopScroller();
					this._content.css("overflow-y", "auto")
				}
			} else {
				if (!c && this.fixed) {
					this._content.css("overflow-y", "hidden")
				}
			}
		},
		_hideTopScroller: function() {
			if (d) {
				$("html").css("overflow", "hidden")
			} else {
				if (!c) {
					$("body").css("overflow", "hidden")
				} else {
					$("body").css("overflow-x", "hidden");
					this._panel.height($(document).height() + 20)
				}
			}
		},
		_recoverTopScroller: function() {
			if (d) {
				$("html").css("overflow", "")
			} else {
				if (!c) {
					$("body").css("overflow", "")
				} else {
					$("body").css("overflow-x", "")
				}
			}
		},
		destroy: function() {
			this.hide($.proxy(function() {
				this._panel && this._panel.remove();
				this._panel = null;
				if (M.indexOf(e[this.impl], this.id) != -1) {
					e[this.impl].splice(M.indexOf(e[this.impl], this.id), 1)
				}
				delete e.instances[this.id]
			}, this))
		},
		clear: function() {
			this._content.empty();
			this.stacks = [];
			this.activeStackId = null
		}
	};
	e.instances = {};
	e.activeId = null;
	e.getInstance = function(h) {
		return e.instances[h]
	};
	e.getActive = function(h) {
		var i = e.getInstance(e.activeId);
		if (h && i) {
			i = i.impl === h ? i : null
		}
		return i
	};
	e.getImplInstance = function(i) {
		var h = e.getActive(i);
		if (!h && M.is(e[i], "Array") && e[i].length) {
			h = e.getInstance(e[i][e[i].length - 1])
		}
		return h
	};
	e.closeActive = function() {
		var h = e.getActive();
		if (h && h.getActiveStack()) {
			h.getActiveStack().trigger("close")
		}
	};
	$(document).keyup(function(h) {
		if (h.keyCode == 27) {
			e.closeActive()
		}
	});
	$(document).unload(function() {
		M.forEach(e.instances, function() {
			e.destroy()
		})
	});
	return e
});
M.define("dialog/DialogBase", function(b) {
	var e = b("dialog/Layer"),
		a = M.Event,
		d = (function() {
			return $.browser && $.browser.msie && parseInt($.browser.version, 10) < 7
		}());

	function c(f) {
		this.newLayer = false;
		this.width = "";
		this.height = "";
		this.background = "#000";
		this.panelBackground = "#fff";
		this.bgOpacity = 0.7;
		this.stackable = true;
		this.fixed = true;
		this.reposition = false;
		this.autoPosition = true;
		this.minTopOffset = 20;
		this.layerZIndex = -1;
		this.impl = "Dialog";
		M.mix(this, f);
		this.visible = false;
		this.destroyed = false;
		this.positioned = false;
		this.resizeTimer = 0;
		this.init()
	}
	c.prototype = {
		tpl: "<div />",
		init: function() {
			this._createDialog();
			this._bindEvents()
		},
		_createDialog: function() {
			this._panel = $(this.tpl).css({
				position: "absolute",
				opacity: 0,
				display: "none",
				background: this.panelBackground,
				"z-index": 0
			});
			this.setRect({
				width: this.width,
				height: this.height
			});
			this._layer = !this.newLayer && e.getImplInstance(this.impl) || new e({
				impl: this.impl
			});
			if (this.layerZIndex >= 0) {
				this._layer.setZIndex(this.layerZIndex)
			}
			this._layer.setFixed(this.fixed);
			this._layer.getMask().css({
				background: this.background,
				opacity: this.bgOpacity
			});
			this._stackId = this._layer.newStack(this._panel);
			this.setPanelContent()
		},
		_bindEvents: function() {
			var f = this;
			$(window).resize($.proxy(this.resizePosition, this));
			M.Event(this).on("resize", $.proxy(this.resizePosition, this));
			this._panel.delegate("._j_close, a[data-dialog-button]", "click", function(g) {
				var h = $(g.currentTarget).attr("data-dialog-button");
				if (h == "hide") {
					f.hide()
				} else {
					f.close()
				}
				g.preventDefault()
			});
			this._panel.bind("close", function(g, h) {
				f.close(h)
			})
		},
		resizePosition: function() {
			var f = this;
			clearTimeout(this.resizeTimer);
			if (f.visible && f.autoPosition) {
				this.resizeTimer = setTimeout(function() {
					f.setPosition()
				}, 100)
			}
		},
		addClass: function(f) {
			this._panel.addClass(f)
		},
		removeClass: function(f) {
			this._panel.removeClass(f)
		},
		setRect: function(f) {
			if (f.width) {
				this._panel.css("width", f.width);
				this.width = f.width
			}
			if (f.height) {
				this._panel.css("height", f.height);
				this.height = f.height
			}
		},
		getPanel: function() {
			return this._panel
		},
		getLayer: function() {
			return this._layer
		},
		getMask: function() {
			return this._layer && this._layer.getMask()
		},
		setPanelContent: function() {},
		_getPanelRect: function() {
			var f = this.getPanel(),
				g = f.outerHeight(),
				h = f.outerWidth();
			if (!f.is(":visible")) {
				f.css({
					visibility: "hidden",
					display: "block"
				});
				var g = f.outerHeight(),
					h = f.outerWidth();
				f.css({
					visibility: "",
					display: ""
				})
			}
			return {
				height: g,
				width: h
			}
		},
		_getNumric: function(f) {
			f = parseInt(f, 10);
			return isNaN(f) ? 0 : f
		},
		setPosition: function(f) {
			var g = this._getPanelRect(),
				h = {
					width: $(window).width(),
					height: $(window).height()
				};
			var k = (h.width - (this._getNumric(this.width) > 0 ? this._getNumric(this.width) : g.width)) / 2,
				j = (h.height - (this._getNumric(this.height) > 0 ? this._getNumric(this.height) : g.height)) * 4 / 9;
			j = j < this.minTopOffset ? this.minTopOffset : j;
			if (d || !this.fixed) {
				var i = $(window).scrollTop();
				if (i > 0) {
					j += i
				}
			}
			f = {
				left: (f && f.left) || k,
				top: (f && f.top) || j
			};
			if (!d && this.fixed) {
				if (h.height - g.height <= f.top) {
					this.getPanel().addClass("dialog_overflow");
					this._layer.setOverFlow(true)
				} else {
					this.getPanel().removeClass("dialog_overflow");
					this._layer.setOverFlow(false)
				}
			}
			var l = this.positioned ? "animate" : "css";
			$.fn[l].call(this.getPanel(), f, 200);
			this.positioned = true;
			this.position = f
		},
		setFixed: function(f) {
			this.fixed = !!f;
			this._layer.setFixed(this.fixed)
		},
		getPosition: function() {
			return this.position
		},
		show: function(f) {
			if (this.visible) {
				return
			}
			var h = this;
			a(this).fire("beforeshow");
			var g;
			if (this._layer.getActiveStack()) {
				g = this._layer.getActiveStack();
				if (!this.reposition && !f && !this._layer.changeFixed) {
					f = this._layer.getActiveStack().position()
				}
			}
			this._layer.show();
			this.getPanel().css({
				display: "",
				"z-index": 1
			});
			this.setPosition(f);
			g && g.trigger("close", [true]);
			this.visible = true;
			this._layer.setActiveStack(this._stackId);
			this.getPanel().animate({
				opacity: 1
			}, {
				queue: false,
				duration: 200,
				complete: function() {
					a(h).fire("aftershow")
				}
			})
		},
		close: function() {
			var f = this.stackable ? "hide" : "destroy";
			this[f].apply(this, Array.prototype.slice.call(arguments))
		},
		hide: function(g, f) {
			if (typeof g == "function") {
				f = g;
				g = undefined
			}
			if (!this.visible) {
				typeof f == "function" && f();
				return
			}
			a(this).fire("beforeclose");
			a(this).fire("beforehide");
			this._layer.setActiveStack(null);
			this.visible = false;
			if (!g) {
				this._layer.hide()
			}
			this.getPanel().animate({
				opacity: 0
			}, {
				queue: false,
				duration: 200,
				complete: $.proxy(function() {
					this.getPanel().css({
						display: "none",
						"z-index": 0
					});
					a(this).fire("afterhide");
					a(this).fire("afterclose");
					typeof f == "function" && f()
				}, this)
			})
		},
		destroy: function(g, f) {
			if (typeof g == "function") {
				f = g;
				g = undefined
			}
			if (this.destroyed) {
				M.error("Dialog already destroyed!");
				typeof f == "function" && f();
				return
			}
			a(this).fire("beforeclose");
			a(this).fire("beforedestroy");
			this.destroyed = true;
			this.hide(g, $.proxy(function() {
				if (this._panel.length) {
					this._panel.undelegate();
					this._panel.unbind();
					this._panel.remove();
					this._panel = null
				}
				this._layer = null;
				a(this).fire("afterdestroy");
				a(this).fire("afterclose");
				typeof f == "function" && f()
			}, this))
		}
	};
	return c
});
M.define("dialog/Dialog", function(c) {
	var d = c("dialog/DialogBase"),
		a = '<div class="popup-box layer_dialog _j_dialog pop_no_margin">                    <div class="dialog_title" style="display:none"><div class="_j_title title"></div></div>                    <div class="dialog_body _j_content"></div>                    <a id="popup_close" class="close-btn _j_close"><i></i></a>                </div>';
	var b = M.extend(function(e) {
		this.content = "";
		this.title = "";
		this.PANEL_CLASS = "";
		this.MASK_CLASS = "";
		b.$parent.call(this, e)
	}, d);
	M.mix(b.prototype, {
		tpl: a,
		setPanelContent: function() {
			this._dialogTitle = this._panel.find("._j_title");
			this._dialogContent = this._panel.find("._j_content");
			this.setTitle(this.title);
			this.setContent(this.content);
			this.addClass(this.PANEL_CLASS);
			this.getMask().addClass(this.MASK_CLASS)
		},
		setTitle: function(e) {
			if (e) {
				this._dialogTitle.html(e).parent().css("display", "")
			} else {
				this._dialogTitle.parent().css("display", "none")
			}
			this.title = e
		},
		getTitle: function() {
			return this.title
		},
		setContent: function(e) {
			this._dialogContent.empty().append(e)
		}
	});
	return b
});
M.define("dialog/alert", function(e, d) {
	var b = e("dialog/Dialog"),
		a = '<div id="popup_container" class="popup-box new-popbox"><a class="close-btn _j_close"><i></i></a><div class="pop-ico" id="_j_alertpopicon"><i class="i1"></i></div><div class="pop-ctn"><p class="hd _j_content"></p><p class="bd _j_detail"></p></div><div class="pop-btns"><a role="button" tabindex="0" class="popbtn popbtn-submit _j_close">&nbsp;确定&nbsp;</a></div></div>',
		f = M.extend(function(j) {
			var i = {
				width: 420,
				content: "请输入内容",
				background: "#000",
				bgOpacity: 0.7,
				PANEL_CLASS: "pop_no_margin",
				reposition: true,
				impl: "Alert",
				layerZIndex: 10000
			};
			j = M.mix(i, j);
			f.$parent.call(this, j);
			this.bindEvents()
		}, b),
		g = null,
		h = $.noop;
	M.mix(f.prototype, {
		tpl: a,
		setAlertTitle: function(i) {
			this.setContent(i)
		},
		setAlertContent: function(i) {
			this.getPanel().find("._j_detail").text(i)
		},
		bindEvents: function() {
			this.getPanel().on("keydown", ".pop-btns ._j_close", function(i) {
				if (i.keyCode == 13) {
					$(this).trigger("click")
				}
			})
		}
	});
	var c = function(i, k, j) {
		if (!g) {
			g = new f();
			M.Event(g).on("afterhide", function() {
				if (typeof h == "function") {
					h.call(g, g.getPanel())
				}
			});
			M.Event(g).on("aftershow", function() {
				g.getPanel().find(".pop-btns ._j_close").focus()
			})
		}
		g.getLayer().toFront();
		if (M.isObject(i)) {
			g.setAlertTitle(i.title);
			g.setAlertContent(i.content)
		} else {
			g.setAlertTitle(i);
			g.setAlertContent("")
		}
		if (typeof k == "function") {
			h = k
		} else {
			h = $.noop
		}
		if (j) {
			$("#_j_alertpopicon").children("i").attr("class", "i" + j)
		} else {
			$("#_j_alertpopicon").children("i").attr("class", "i" + 1)
		}
		g.show();
		return g
	};
	d.pop = c;
	d.warning = function(i, j) {
		c(i, j, 1)
	};
	d.tip = function(i, j) {
		c(i, j, 3)
	}
});
(function(b, g) {
	var d = {};

	function c(m, n) {
		var l, j = [];
		for (var k = 0; k < m.length; ++k) {
			l = d[m[k]] || e(m[k]);
			if (!l) {
				throw "module definition dependecy not found: " + m[k]
			}
			j.push(l)
		}
		n.apply(null, j)
	}

	function h(k, j, i) {
		if (typeof k !== "string") {
			throw "invalid module definition, module id must be defined and be a string"
		}
		if (j === g) {
			throw "invalid module definition, dependencies must be specified"
		}
		if (i === g) {
			throw "invalid module definition, definition function must be specified"
		}
		c(j, function() {
			d[k] = i.apply(null, arguments)
		})
	}

	function f(i) {
		return !!d[i]
	}

	function e(l) {
		var j = b;
		var i = l.split(/[.\/]/);
		for (var k = 0; k < i.length; ++k) {
			if (!j[i[k]]) {
				return
			}
			j = j[i[k]]
		}
		return j
	}

	function a(l) {
		for (var k = 0; k < l.length; k++) {
			var m = b;
			var o = l[k];
			var j = o.split(/[.\/]/);
			for (var n = 0; n < j.length - 1; ++n) {
				if (m[j[n]] === g) {
					m[j[n]] = {}
				}
				m = m[j[n]]
			}
			m[j[j.length - 1]] = d[o]
		}
	}
	h("moxie/core/utils/Basic", [], function() {
		var r = function(w) {
			var v;
			if (w === v) {
				return "undefined"
			} else {
				if (w === null) {
					return "null"
				} else {
					if (w.nodeType) {
						return "node"
					}
				}
			}
			return ({}).toString.call(w).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
		};
		var n = function(w) {
			var v;
			p(arguments, function(x, y) {
				if (y > 0) {
					p(x, function(A, z) {
						if (A !== v) {
							if (r(w[z]) === r(A) && !!~u(r(A), ["array", "object"])) {
								n(w[z], A)
							} else {
								w[z] = A
							}
						}
					})
				}
			});
			return w
		};
		var p = function(A, B) {
			var z, x, w, y;
			if (A) {
				try {
					z = A.length
				} catch (v) {
					z = y
				}
				if (z === y) {
					for (x in A) {
						if (A.hasOwnProperty(x)) {
							if (B(A[x], x) === false) {
								return
							}
						}
					}
				} else {
					for (w = 0; w < z; w++) {
						if (B(A[w], w) === false) {
							return
						}
					}
				}
			}
		};
		var s = function(v) {
			var w;
			if (!v || r(v) !== "object") {
				return true
			}
			for (w in v) {
				return false
			}
			return true
		};
		var l = function(w, v) {
			var x = 0,
				y = w.length;
			if (r(v) !== "function") {
				v = function() {}
			}
			if (!w || !w.length) {
				v()
			}

			function z(A) {
				if (r(w[A]) === "function") {
					w[A](function(B) {
						++A < y && !B ? z(A) : v(B)
					})
				}
			}
			z(x)
		};
		var i = function(w, v) {
			var y = 0,
				x = w.length,
				z = new Array(x);
			p(w, function(B, A) {
				B(function(D) {
					if (D) {
						return v(D)
					}
					var C = [].slice.call(arguments);
					C.shift();
					z[A] = C;
					y++;
					if (y === x) {
						z.unshift(null);
						v.apply(this, z)
					}
				})
			})
		};
		var u = function(x, y) {
			if (y) {
				if (Array.prototype.indexOf) {
					return Array.prototype.indexOf.call(y, x)
				}
				for (var v = 0, w = y.length; v < w; v++) {
					if (y[v] === x) {
						return v
					}
				}
			}
			return -1
		};
		var q = function(w, y) {
			var x = [];
			if (r(w) !== "array") {
				w = [w]
			}
			if (r(y) !== "array") {
				y = [y]
			}
			for (var v in w) {
				if (u(w[v], y) === -1) {
					x.push(w[v])
				}
			}
			return x.length ? x : false
		};
		var t = function(x, w) {
			var v = [];
			p(x, function(y) {
				if (u(y, w) !== -1) {
					v.push(y)
				}
			});
			return v.length ? v : null
		};
		var m = function(x) {
			var w, v = [];
			for (w = 0; w < x.length; w++) {
				v[w] = x[w]
			}
			return v
		};
		var o = (function() {
			var v = 0;
			return function(y) {
				var w = new Date().getTime().toString(32),
					x;
				for (x = 0; x < 5; x++) {
					w += Math.floor(Math.random() * 65535).toString(32)
				}
				return (y || "o_") + w + (v++).toString(32)
			}
		}());
		var j = function(v) {
			if (!v) {
				return v
			}
			return String.prototype.trim ? String.prototype.trim.call(v) : v.toString().replace(/^\s*/, "").replace(/\s*$/, "")
		};
		var k = function(v) {
			if (typeof(v) !== "string") {
				return v
			}
			var x = {
					t: 1099511627776,
					g: 1073741824,
					m: 1048576,
					k: 1024
				},
				w;
			v = /^([0-9]+)([mgk]?)$/.exec(v.toLowerCase().replace(/[^0-9mkg]/g, ""));
			w = v[2];
			v = +v[1];
			if (x.hasOwnProperty(w)) {
				v *= x[w]
			}
			return v
		};
		return {
			guid: o,
			typeOf: r,
			extend: n,
			each: p,
			isEmptyObj: s,
			inSeries: l,
			inParallel: i,
			inArray: u,
			arrayDiff: q,
			arrayIntersect: t,
			toArray: m,
			trim: j,
			parseSizeStr: k
		}
	});
	h("moxie/core/I18n", ["moxie/core/utils/Basic"], function(j) {
		var i = {};
		return {
			addI18n: function(k) {
				return j.extend(i, k)
			},
			translate: function(k) {
				return i[k] || k
			},
			_: function(k) {
				return this.translate(k)
			},
			sprintf: function(l) {
				var k = [].slice.call(arguments, 1);
				return l.replace(/%[a-z]/g, function() {
					var m = k.shift();
					return j.typeOf(m) !== "undefined" ? m : ""
				})
			}
		}
	});
	h("moxie/core/utils/Mime", ["moxie/core/utils/Basic", "moxie/core/I18n"], function(l, k) {
		var i = "application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-word,doc,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe";
		var j = {
			mimes: {},
			extensions: {},
			addMimeType: function(m) {
				var n = m.split(/,/),
					o, q, p;
				for (o = 0; o < n.length; o += 2) {
					p = n[o + 1].split(/ /);
					for (q = 0; q < p.length; q++) {
						this.mimes[p[q]] = n[o]
					}
					this.extensions[n[o]] = p
				}
			},
			extList2mimes: function(s, t) {
				var n = this,
					r, o, q, p, m = [];
				for (o = 0; o < s.length; o++) {
					r = s[o].extensions.split(/\s*,\s*/);
					for (q = 0; q < r.length; q++) {
						if (r[q] === "*") {
							return []
						}
						p = n.mimes[r[q]];
						if (!p) {
							if (t && /^\w+$/.test(r[q])) {
								m.push("." + r[q])
							} else {
								return []
							}
						} else {
							if (l.inArray(p, m) === -1) {
								m.push(p)
							}
						}
					}
				}
				return m
			},
			mimes2exts: function(m) {
				var n = this,
					o = [];
				l.each(m, function(q) {
					if (q === "*") {
						o = [];
						return false
					}
					var p = q.match(/^(\w+)\/(\*|\w+)$/);
					if (p) {
						if (p[2] === "*") {
							l.each(n.extensions, function(r, s) {
								if ((new RegExp("^" + p[1] + "/")).test(s)) {
									[].push.apply(o, n.extensions[s])
								}
							})
						} else {
							if (n.extensions[q]) {
								[].push.apply(o, n.extensions[q])
							}
						}
					}
				});
				return o
			},
			mimes2extList: function(m) {
				var o = [],
					n = [];
				if (l.typeOf(m) === "string") {
					m = l.trim(m).split(/\s*,\s*/)
				}
				n = this.mimes2exts(m);
				o.push({
					title: k.translate("Files"),
					extensions: n.length ? n.join(",") : "*"
				});
				o.mimes = m;
				return o
			},
			getFileExtension: function(n) {
				var m = n && n.match(/\.([^.]+)$/);
				if (m) {
					return m[1].toLowerCase()
				}
				return ""
			},
			getFileMime: function(m) {
				return this.mimes[this.getFileExtension(m)] || ""
			}
		};
		j.addMimeType(i);
		return j
	});
	h("moxie/core/utils/Env", ["moxie/core/utils/Basic"], function(m) {
		var k = (function(r) {
			var H = "",
				G = "?",
				B = "function",
				t = "undefined",
				p = "object",
				q = "major",
				C = "model",
				s = "name",
				y = "type",
				w = "vendor",
				E = "version",
				n = "architecture",
				u = "console",
				A = "mobile",
				F = "tablet";
			var o = {
				has: function(J, I) {
					return I.toLowerCase().indexOf(J.toLowerCase()) !== -1
				},
				lowerize: function(I) {
					return I.toLowerCase()
				}
			};
			var D = {
				rgx: function() {
					for (var T, N = 0, L, K, J, I, O, P, Q = arguments; N < Q.length; N += 2) {
						var S = Q[N],
							R = Q[N + 1];
						if (typeof(T) === t) {
							T = {};
							for (J in R) {
								I = R[J];
								if (typeof(I) === p) {
									T[I[0]] = r
								} else {
									T[I] = r
								}
							}
						}
						for (L = K = 0; L < S.length; L++) {
							O = S[L].exec(this.getUA());
							if (!!O) {
								for (J = 0; J < R.length; J++) {
									P = O[++K];
									I = R[J];
									if (typeof(I) === p && I.length > 0) {
										if (I.length == 2) {
											if (typeof(I[1]) == B) {
												T[I[0]] = I[1].call(this, P)
											} else {
												T[I[0]] = I[1]
											}
										} else {
											if (I.length == 3) {
												if (typeof(I[1]) === B && !(I[1].exec && I[1].test)) {
													T[I[0]] = P ? I[1].call(this, P, I[2]) : r
												} else {
													T[I[0]] = P ? P.replace(I[1], I[2]) : r
												}
											} else {
												if (I.length == 4) {
													T[I[0]] = P ? I[3].call(this, P.replace(I[1], I[2])) : r
												}
											}
										}
									} else {
										T[I] = P ? P : r
									}
								}
								break
							}
						}
						if (!!O) {
							break
						}
					}
					return T
				},
				str: function(L, K) {
					for (var J in K) {
						if (typeof(K[J]) === p && K[J].length > 0) {
							for (var I = 0; I < K[J].length; I++) {
								if (o.has(K[J][I], L)) {
									return (J === G) ? r : J
								}
							}
						} else {
							if (o.has(K[J], L)) {
								return (J === G) ? r : J
							}
						}
					}
					return L
				}
			};
			var z = {
				browser: {
					oldsafari: {
						major: {
							"1": ["/8", "/1", "/3"],
							"2": "/4",
							"?": "/"
						},
						version: {
							"1.0": "/8",
							"1.2": "/1",
							"1.3": "/3",
							"2.0": "/412",
							"2.0.2": "/416",
							"2.0.3": "/417",
							"2.0.4": "/419",
							"?": "/"
						}
					}
				},
				device: {
					sprint: {
						model: {
							"Evo Shift 4G": "7373KT"
						},
						vendor: {
							HTC: "APA",
							Sprint: "Sprint"
						}
					}
				},
				os: {
					windows: {
						version: {
							ME: "4.90",
							"NT 3.11": "NT3.51",
							"NT 4.0": "NT4.0",
							"2000": "NT 5.0",
							XP: ["NT 5.1", "NT 5.2"],
							Vista: "NT 6.0",
							"7": "NT 6.1",
							"8": "NT 6.2",
							"8.1": "NT 6.3",
							RT: "ARM"
						}
					}
				}
			};
			var x = {
				browser: [
					[/(opera\smini)\/((\d+)?[\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i, /(opera).+version\/((\d+)?[\w\.]+)/i, /(opera)[\/\s]+((\d+)?[\w\.]+)/i],
					[s, E, q],
					[/\s(opr)\/((\d+)?[\w\.]+)/i],
					[
						[s, "Opera"], E, q
					],
					[/(kindle)\/((\d+)?[\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i, /(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i, /(rekonq)((?:\/)[\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i],
					[s, E, q],
					[/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i],
					[
						[s, "IE"], E, q
					],
					[/(yabrowser)\/((\d+)?[\w\.]+)/i],
					[
						[s, "Yandex"], E, q
					],
					[/(comodo_dragon)\/((\d+)?[\w\.]+)/i],
					[
						[s, /_/g, " "], E, q
					],
					[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i],
					[s, E, q],
					[/(dolfin)\/((\d+)?[\w\.]+)/i],
					[
						[s, "Dolphin"], E, q
					],
					[/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i],
					[
						[s, "Chrome"], E, q
					],
					[/((?:android.+))version\/((\d+)?[\w\.]+)\smobile\ssafari/i],
					[
						[s, "Android Browser"], E, q
					],
					[/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i],
					[E, q, [s, "Mobile Safari"]],
					[/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i],
					[E, q, s],
					[/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i],
					[s, [q, D.str, z.browser.oldsafari.major],
						[E, D.str, z.browser.oldsafari.version]
					],
					[/(konqueror)\/((\d+)?[\w\.]+)/i, /(webkit|khtml)\/((\d+)?[\w\.]+)/i],
					[s, E, q],
					[/(navigator|netscape)\/((\d+)?[\w\.-]+)/i],
					[
						[s, "Netscape"], E, q
					],
					[/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i, /(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i, /(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i, /(links)\s\(((\d+)?[\w\.]+)/i, /(gobrowser)\/?((\d+)?[\w\.]+)*/i, /(ice\s?browser)\/v?((\d+)?[\w\._]+)/i, /(mosaic)[\/\s]((\d+)?[\w\.]+)/i],
					[s, E, q]
				],
				engine: [
					[/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
					[s, E],
					[/rv\:([\w\.]+).*(gecko)/i],
					[E, s]
				],
				os: [
					[/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
					[s, [E, D.str, z.os.windows.version]],
					[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
					[
						[s, "Windows"],
						[E, D.str, z.os.windows.version]
					],
					[/\((bb)(10);/i],
					[
						[s, "BlackBerry"], E
					],
					[/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)\/([\w\.]+)/i, /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i],
					[s, E],
					[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
					[
						[s, "Symbian"], E
					],
					[/mozilla.+\(mobile;.+gecko.+firefox/i],
					[
						[s, "Firefox OS"], E
					],
					[/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
					[s, E],
					[/(cros)\s[\w]+\s([\w\.]+\w)/i],
					[
						[s, "Chromium OS"], E
					],
					[/(sunos)\s?([\w\.]+\d)*/i],
					[
						[s, "Solaris"], E
					],
					[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
					[s, E],
					[/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],
					[
						[s, "iOS"],
						[E, /_/g, "."]
					],
					[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i],
					[s, [E, /_/g, "."]],
					[/(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i, /(unix)\s?([\w\.]+)*/i],
					[s, E]
				]
			};
			var v = function(I) {
				var J = I || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : H);
				this.getBrowser = function() {
					return D.rgx.apply(this, x.browser)
				};
				this.getEngine = function() {
					return D.rgx.apply(this, x.engine)
				};
				this.getOS = function() {
					return D.rgx.apply(this, x.os)
				};
				this.getResult = function() {
					return {
						ua: this.getUA(),
						browser: this.getBrowser(),
						engine: this.getEngine(),
						os: this.getOS()
					}
				};
				this.getUA = function() {
					return J
				};
				this.setUA = function(K) {
					J = K;
					return this
				};
				this.setUA(J)
			};
			return new v().getResult()
		})();

		function j(v, t, o) {
			var s = 0,
				u = 0,
				n = 0,
				p = {
					dev: -6,
					alpha: -5,
					a: -5,
					beta: -4,
					b: -4,
					RC: -3,
					rc: -3,
					"#": -2,
					p: 1,
					pl: 1
				},
				q = function(w) {
					w = ("" + w).replace(/[_\-+]/g, ".");
					w = w.replace(/([^.\d]+)/g, ".$1.").replace(/\.{2,}/g, ".");
					return (!w.length ? [-8] : w.split("."))
				},
				r = function(w) {
					return !w ? 0 : (isNaN(w) ? p[w] || -7 : parseInt(w, 10))
				};
			v = q(v);
			t = q(t);
			u = Math.max(v.length, t.length);
			for (s = 0; s < u; s++) {
				if (v[s] == t[s]) {
					continue
				}
				v[s] = r(v[s]);
				t[s] = r(t[s]);
				if (v[s] < t[s]) {
					n = -1;
					break
				} else {
					if (v[s] > t[s]) {
						n = 1;
						break
					}
				}
			}
			if (!o) {
				return n
			}
			switch (o) {
				case ">":
				case "gt":
					return (n > 0);
				case ">=":
				case "ge":
					return (n >= 0);
				case "<=":
				case "le":
					return (n <= 0);
				case "==":
				case "=":
				case "eq":
					return (n === 0);
				case "<>":
				case "!=":
				case "ne":
					return (n !== 0);
				case "":
				case "<":
				case "lt":
					return (n < 0);
				default:
					return null
			}
		}
		var l = (function() {
			var n = {
				define_property: (function() {
					return false
				}()),
				create_canvas: (function() {
					var o = document.createElement("canvas");
					return !!(o.getContext && o.getContext("2d"))
				}()),
				return_response_type: function(o) {
					try {
						if (m.inArray(o, ["", "text", "document"]) !== -1) {
							return true
						} else {
							if (window.XMLHttpRequest) {
								var q = new XMLHttpRequest();
								q.open("get", "/");
								if ("responseType" in q) {
									q.responseType = o;
									if (q.responseType !== o) {
										return false
									}
									return true
								}
							}
						}
					} catch (p) {}
					return false
				},
				use_data_uri: (function() {
					var o = new Image();
					o.onload = function() {
						n.use_data_uri = (o.width === 1 && o.height === 1)
					};
					setTimeout(function() {
						o.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
					}, 1);
					return false
				}()),
				use_data_uri_over32kb: function() {
					return n.use_data_uri && (i.browser !== "IE" || i.version >= 9)
				},
				use_data_uri_of: function(o) {
					return (n.use_data_uri && o < 33000 || n.use_data_uri_over32kb())
				},
				use_fileinput: function() {
					var o = document.createElement("input");
					o.setAttribute("type", "file");
					return !o.disabled
				}
			};
			return function(p) {
				var o = [].slice.call(arguments);
				o.shift();
				return m.typeOf(n[p]) === "function" ? n[p].apply(this, o) : !!n[p]
			}
		}());
		var i = {
			can: l,
			browser: k.browser.name,
			version: parseFloat(k.browser.major),
			os: k.os.name,
			osVersion: k.os.version,
			verComp: j,
			swf_url: "../flash/Moxie.swf",
			xap_url: "../silverlight/Moxie.xap",
			global_event_dispatcher: "moxie.core.EventTarget.instance.dispatchEvent"
		};
		i.OS = i.os;
		return i
	});
	h("moxie/core/utils/Dom", ["moxie/core/utils/Env"], function(j) {
		var k = function(q) {
			if (typeof q !== "string") {
				return q
			}
			return document.getElementById(q)
		};
		var l = function(s, r) {
			if (!s.className) {
				return false
			}
			var q = new RegExp("(^|\\s+)" + r + "(\\s+|$)");
			return q.test(s.className)
		};
		var m = function(r, q) {
			if (!l(r, q)) {
				r.className = !r.className ? q : r.className.replace(/\s+$/, "") + " " + q
			}
		};
		var p = function(s, r) {
			if (s.className) {
				var q = new RegExp("(^|\\s+)" + r + "(\\s+|$)");
				s.className = s.className.replace(q, function(u, t, v) {
					return t === " " && v === " " ? " " : ""
				})
			}
		};
		var i = function(r, q) {
			if (r.currentStyle) {
				return r.currentStyle[q]
			} else {
				if (window.getComputedStyle) {
					return window.getComputedStyle(r, null)[q]
				}
			}
		};
		var o = function(r, v) {
			var w = 0,
				u = 0,
				A, z = document,
				s, t;
			r = r;
			v = v || z.body;

			function q(E) {
				var C, D, B = 0,
					F = 0;
				if (E) {
					D = E.getBoundingClientRect();
					C = z.compatMode === "CSS1Compat" ? z.documentElement : z.body;
					B = D.left + C.scrollLeft;
					F = D.top + C.scrollTop
				}
				return {
					x: B,
					y: F
				}
			}
			if (r && r.getBoundingClientRect && j.browser === "IE" && (!z.documentMode || z.documentMode < 8)) {
				s = q(r);
				t = q(v);
				return {
					x: s.x - t.x,
					y: s.y - t.y
				}
			}
			A = r;
			while (A && A != v && A.nodeType) {
				w += A.offsetLeft || 0;
				u += A.offsetTop || 0;
				A = A.offsetParent
			}
			A = r.parentNode;
			while (A && A != v && A.nodeType) {
				w -= A.scrollLeft || 0;
				u -= A.scrollTop || 0;
				A = A.parentNode
			}
			return {
				x: w,
				y: u
			}
		};
		var n = function(q) {
			return {
				w: q.offsetWidth || q.clientWidth,
				h: q.offsetHeight || q.clientHeight
			}
		};
		return {
			get: k,
			hasClass: l,
			addClass: m,
			removeClass: p,
			getStyle: i,
			getPos: o,
			getSize: n
		}
	});
	h("moxie/core/Exceptions", ["moxie/core/utils/Basic"], function(j) {
		function i(m, l) {
			var k;
			for (k in m) {
				if (m[k] === l) {
					return k
				}
			}
			return null
		}
		return {
			RuntimeError: (function() {
				var k = {
					NOT_INIT_ERR: 1,
					NOT_SUPPORTED_ERR: 9,
					JS_ERR: 4
				};

				function l(m) {
					this.code = m;
					this.name = i(k, m);
					this.message = this.name + ": RuntimeError " + this.code
				}
				j.extend(l, k);
				l.prototype = Error.prototype;
				return l
			}()),
			OperationNotAllowedException: (function() {
				function k(l) {
					this.code = l;
					this.name = "OperationNotAllowedException"
				}
				j.extend(k, {
					NOT_ALLOWED_ERR: 1
				});
				k.prototype = Error.prototype;
				return k
			}()),
			ImageError: (function() {
				var k = {
					WRONG_FORMAT: 1,
					MAX_RESOLUTION_ERR: 2
				};

				function l(m) {
					this.code = m;
					this.name = i(k, m);
					this.message = this.name + ": ImageError " + this.code
				}
				j.extend(l, k);
				l.prototype = Error.prototype;
				return l
			}()),
			FileException: (function() {
				var k = {
					NOT_FOUND_ERR: 1,
					SECURITY_ERR: 2,
					ABORT_ERR: 3,
					NOT_READABLE_ERR: 4,
					ENCODING_ERR: 5,
					NO_MODIFICATION_ALLOWED_ERR: 6,
					INVALID_STATE_ERR: 7,
					SYNTAX_ERR: 8
				};

				function l(m) {
					this.code = m;
					this.name = i(k, m);
					this.message = this.name + ": FileException " + this.code
				}
				j.extend(l, k);
				l.prototype = Error.prototype;
				return l
			}()),
			DOMException: (function() {
				var k = {
					INDEX_SIZE_ERR: 1,
					DOMSTRING_SIZE_ERR: 2,
					HIERARCHY_REQUEST_ERR: 3,
					WRONG_DOCUMENT_ERR: 4,
					INVALID_CHARACTER_ERR: 5,
					NO_DATA_ALLOWED_ERR: 6,
					NO_MODIFICATION_ALLOWED_ERR: 7,
					NOT_FOUND_ERR: 8,
					NOT_SUPPORTED_ERR: 9,
					INUSE_ATTRIBUTE_ERR: 10,
					INVALID_STATE_ERR: 11,
					SYNTAX_ERR: 12,
					INVALID_MODIFICATION_ERR: 13,
					NAMESPACE_ERR: 14,
					INVALID_ACCESS_ERR: 15,
					VALIDATION_ERR: 16,
					TYPE_MISMATCH_ERR: 17,
					SECURITY_ERR: 18,
					NETWORK_ERR: 19,
					ABORT_ERR: 20,
					URL_MISMATCH_ERR: 21,
					QUOTA_EXCEEDED_ERR: 22,
					TIMEOUT_ERR: 23,
					INVALID_NODE_TYPE_ERR: 24,
					DATA_CLONE_ERR: 25
				};

				function l(m) {
					this.code = m;
					this.name = i(k, m);
					this.message = this.name + ": DOMException " + this.code
				}
				j.extend(l, k);
				l.prototype = Error.prototype;
				return l
			}()),
			EventException: (function() {
				function k(l) {
					this.code = l;
					this.name = "EventException"
				}
				j.extend(k, {
					UNSPECIFIED_EVENT_TYPE_ERR: 0
				});
				k.prototype = Error.prototype;
				return k
			}())
		}
	});
	h("moxie/core/EventTarget", ["moxie/core/Exceptions", "moxie/core/utils/Basic"], function(i, j) {
		function k() {
			var l = {};
			j.extend(this, {
				uid: null,
				init: function() {
					if (!this.uid) {
						this.uid = j.guid("uid_")
					}
				},
				addEventListener: function(q, p, n, o) {
					var m = this,
						r;
					q = j.trim(q);
					if (/\s/.test(q)) {
						j.each(q.split(/\s+/), function(s) {
							m.addEventListener(s, p, n, o)
						});
						return
					}
					q = q.toLowerCase();
					n = parseInt(n, 10) || 0;
					r = l[this.uid] && l[this.uid][q] || [];
					r.push({
						fn: p,
						priority: n,
						scope: o || this
					});
					if (!l[this.uid]) {
						l[this.uid] = {}
					}
					l[this.uid][q] = r
				},
				hasEventListener: function(m) {
					return m ? !!(l[this.uid] && l[this.uid][m]) : !!l[this.uid]
				},
				removeEventListener: function(o, n) {
					o = o.toLowerCase();
					var p = l[this.uid] && l[this.uid][o],
						m;
					if (p) {
						if (n) {
							for (m = p.length - 1; m >= 0; m--) {
								if (p[m].fn === n) {
									p.splice(m, 1);
									break
								}
							}
						} else {
							p = []
						}
						if (!p.length) {
							delete l[this.uid][o];
							if (j.isEmptyObj(l[this.uid])) {
								delete l[this.uid]
							}
						}
					}
				},
				removeAllEventListeners: function() {
					if (l[this.uid]) {
						delete l[this.uid]
					}
				},
				dispatchEvent: function(r) {
					var o, p, q, s, t = {},
						u = true,
						m;
					if (j.typeOf(r) !== "string") {
						s = r;
						if (j.typeOf(s.type) === "string") {
							r = s.type;
							if (s.total !== m && s.loaded !== m) {
								t.total = s.total;
								t.loaded = s.loaded
							}
							t.async = s.async || false
						} else {
							throw new i.EventException(i.EventException.UNSPECIFIED_EVENT_TYPE_ERR)
						}
					}
					if (r.indexOf("::") !== -1) {
						(function(v) {
							o = v[0];
							r = v[1]
						}(r.split("::")))
					} else {
						o = this.uid
					}
					r = r.toLowerCase();
					p = l[o] && l[o][r];
					if (p) {
						p.sort(function(w, v) {
							return v.priority - w.priority
						});
						q = [].slice.call(arguments);
						q.shift();
						t.type = r;
						q.unshift(t);
						var n = [];
						j.each(p, function(v) {
							q[0].target = v.scope;
							if (t.async) {
								n.push(function(w) {
									setTimeout(function() {
										w(v.fn.apply(v.scope, q) === false)
									}, 1)
								})
							} else {
								n.push(function(w) {
									w(v.fn.apply(v.scope, q) === false)
								})
							}
						});
						if (n.length) {
							j.inSeries(n, function(v) {
								u = !v
							})
						}
					}
					return u
				},
				bind: function() {
					this.addEventListener.apply(this, arguments)
				},
				unbind: function() {
					this.removeEventListener.apply(this, arguments)
				},
				unbindAll: function() {
					this.removeAllEventListeners.apply(this, arguments)
				},
				trigger: function() {
					return this.dispatchEvent.apply(this, arguments)
				},
				convertEventPropsToHandlers: function(m) {
					var o;
					if (j.typeOf(m) !== "array") {
						m = [m]
					}
					for (var n = 0; n < m.length; n++) {
						o = "on" + m[n];
						if (j.typeOf(this[o]) === "function") {
							this.addEventListener(m[n], this[o])
						} else {
							if (j.typeOf(this[o]) === "undefined") {
								this[o] = null
							}
						}
					}
				}
			})
		}
		k.instance = new k();
		return k
	});
	h("moxie/core/utils/Encode", [], function() {
		var k = function(m) {
			return unescape(encodeURIComponent(m))
		};
		var l = function(m) {
			return decodeURIComponent(escape(m))
		};
		var j = function(t, y) {
			if (typeof(window.atob) === "function") {
				return y ? l(window.atob(t)) : window.atob(t)
			}
			var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var o, n, m, x, w, v, u, z, s = 0,
				A = 0,
				q = "",
				r = [];
			if (!t) {
				return t
			}
			t += "";
			do {
				x = p.indexOf(t.charAt(s++));
				w = p.indexOf(t.charAt(s++));
				v = p.indexOf(t.charAt(s++));
				u = p.indexOf(t.charAt(s++));
				z = x << 18 | w << 12 | v << 6 | u;
				o = z >> 16 & 255;
				n = z >> 8 & 255;
				m = z & 255;
				if (v == 64) {
					r[A++] = String.fromCharCode(o)
				} else {
					if (u == 64) {
						r[A++] = String.fromCharCode(o, n)
					} else {
						r[A++] = String.fromCharCode(o, n, m)
					}
				}
			} while (s < t.length);
			q = r.join("");
			return y ? l(q) : q
		};
		var i = function(v, A) {
			if (A) {
				k(v)
			}
			if (typeof(window.btoa) === "function") {
				return window.btoa(v)
			}
			var q = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var p, o, n, z, y, x, w, B, u = 0,
				C = 0,
				t = "",
				s = [];
			if (!v) {
				return v
			}
			do {
				p = v.charCodeAt(u++);
				o = v.charCodeAt(u++);
				n = v.charCodeAt(u++);
				B = p << 16 | o << 8 | n;
				z = B >> 18 & 63;
				y = B >> 12 & 63;
				x = B >> 6 & 63;
				w = B & 63;
				s[C++] = q.charAt(z) + q.charAt(y) + q.charAt(x) + q.charAt(w)
			} while (u < v.length);
			t = s.join("");
			var m = v.length % 3;
			return (m ? t.slice(0, m - 3) : t) + "===".slice(m || 3)
		};
		return {
			utf8_encode: k,
			utf8_decode: l,
			atob: j,
			btoa: i
		}
	});
	h("moxie/runtime/Runtime", ["moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/EventTarget"], function(m, l, n) {
		var i = {},
			j = {};

		function k(w, t, r, q, p) {
			var v = this,
				o, u = m.guid(t + "_"),
				s = p || "browser";
			w = w || {};
			j[u] = this;
			r = m.extend({
				access_binary: false,
				access_image_binary: false,
				display_media: false,
				do_cors: false,
				drag_and_drop: false,
				filter_by_extension: true,
				resize_image: false,
				report_upload_progress: false,
				return_response_headers: false,
				return_response_type: false,
				return_status_code: true,
				send_custom_headers: false,
				select_file: false,
				select_folder: false,
				select_multiple: true,
				send_binary_string: false,
				send_browser_cookies: true,
				send_multipart: true,
				slice_blob: false,
				stream_upload: false,
				summon_file_dialog: false,
				upload_filesize: true,
				use_http_method: true
			}, r);
			if (w.preferred_caps) {
				s = k.getMode(q, w.preferred_caps, s)
			}
			o = (function() {
				var x = {};
				return {
					exec: function(A, y, B, z) {
						if (o[y]) {
							if (!x[A]) {
								x[A] = {
									context: this,
									instance: new o[y]()
								}
							}
							if (x[A].instance[B]) {
								return x[A].instance[B].apply(this, z)
							}
						}
					},
					removeInstance: function(y) {
						delete x[y]
					},
					removeAllInstances: function() {
						var y = this;
						m.each(x, function(A, z) {
							if (m.typeOf(A.instance.destroy) === "function") {
								A.instance.destroy.call(A.context)
							}
							y.removeInstance(z)
						})
					}
				}
			}());
			m.extend(this, {
				initialized: false,
				uid: u,
				type: t,
				mode: k.getMode(q, (w.required_caps), s),
				shimid: u + "_container",
				clients: 0,
				options: w,
				can: function(z, A) {
					var x = arguments[2] || r;
					if (m.typeOf(z) === "string" && m.typeOf(A) === "undefined") {
						z = k.parseCaps(z)
					}
					if (m.typeOf(z) === "object") {
						for (var y in z) {
							if (!this.can(y, z[y], x)) {
								return false
							}
						}
						return true
					}
					if (m.typeOf(x[z]) === "function") {
						return x[z].call(this, A)
					} else {
						return (A === x[z])
					}
				},
				getShimContainer: function() {
					var x, y = l.get(this.shimid);
					if (!y) {
						x = this.options.container ? l.get(this.options.container) : document.body;
						y = document.createElement("div");
						y.id = this.shimid;
						y.className = "moxie-shim moxie-shim-" + this.type;
						m.extend(y.style, {
							position: "absolute",
							top: "0px",
							left: "0px",
							width: "1px",
							height: "1px",
							overflow: "hidden"
						});
						x.appendChild(y);
						x = null
					}
					return y
				},
				getShim: function() {
					return o
				},
				shimExec: function(y, z) {
					var x = [].slice.call(arguments, 2);
					return v.getShim().exec.call(this, this.uid, y, z, x)
				},
				exec: function(y, z) {
					var x = [].slice.call(arguments, 2);
					if (v[y] && v[y][z]) {
						return v[y][z].apply(this, x)
					}
					return v.shimExec.apply(this, arguments)
				},
				destroy: function() {
					if (!v) {
						return
					}
					var x = l.get(this.shimid);
					if (x) {
						x.parentNode.removeChild(x)
					}
					if (o) {
						o.removeAllInstances()
					}
					this.unbindAll();
					delete j[this.uid];
					this.uid = null;
					u = v = o = x = null
				}
			});
			if (this.mode && w.required_caps && !this.can(w.required_caps)) {
				this.mode = false
			}
		}
		k.order = "html5,flash,silverlight,html4";
		k.getRuntime = function(o) {
			return j[o] ? j[o] : false
		};
		k.addConstructor = function(p, o) {
			o.prototype = n.instance;
			i[p] = o
		};
		k.getConstructor = function(o) {
			return i[o] || null
		};
		k.getInfo = function(o) {
			var p = k.getRuntime(o);
			if (p) {
				return {
					uid: p.uid,
					type: p.type,
					mode: p.mode,
					can: function() {
						return p.can.apply(p, arguments)
					}
				}
			}
			return null
		};
		k.parseCaps = function(o) {
			var p = {};
			if (m.typeOf(o) !== "string") {
				return o || {}
			}
			m.each(o.split(","), function(q) {
				p[q] = true
			});
			return p
		};
		k.can = function(p, r) {
			var q, o = k.getConstructor(p),
				s;
			if (o) {
				q = new o({
					required_caps: r
				});
				s = q.mode;
				q.destroy();
				return !!s
			}
			return false
		};
		k.thatCan = function(q, r) {
			var p = (r || k.order).split(/\s*,\s*/);
			for (var o in p) {
				if (k.can(p[o], q)) {
					return p[o]
				}
			}
			return null
		};
		k.getMode = function(o, r, p) {
			var q = null;
			if (m.typeOf(p) === "undefined") {
				p = "browser"
			}
			if (r && !m.isEmptyObj(o)) {
				m.each(r, function(u, s) {
					if (o.hasOwnProperty(s)) {
						var t = o[s](u);
						if (typeof(t) === "string") {
							t = [t]
						}
						if (!q) {
							q = t
						} else {
							if (!(q = m.arrayIntersect(q, t))) {
								return (q = false)
							}
						}
					}
				});
				if (q) {
					return m.inArray(p, q) !== -1 ? p : q[0]
				} else {
					if (q === false) {
						return false
					}
				}
			}
			return p
		};
		k.capTrue = function() {
			return true
		};
		k.capFalse = function() {
			return false
		};
		k.capTest = function(o) {
			return function() {
				return !!o
			}
		};
		return k
	});
	h("moxie/runtime/RuntimeClient", ["moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/runtime/Runtime"], function(i, l, k) {
		return function j() {
			var m;
			l.extend(this, {
				connectRuntime: function(q) {
					var o = this,
						p;

					function n(r) {
						var t, s;
						if (!r.length) {
							o.trigger("RuntimeError", new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR));
							m = null;
							return
						}
						t = r.shift();
						s = k.getConstructor(t);
						if (!s) {
							n(r);
							return
						}
						m = new s(q);
						m.bind("Init", function() {
							m.initialized = true;
							setTimeout(function() {
								m.clients++;
								o.trigger("RuntimeInit", m)
							}, 1)
						});
						m.bind("Error", function() {
							m.destroy();
							n(r)
						});
						if (!m.mode) {
							m.trigger("Error");
							return
						}
						m.init()
					}
					if (l.typeOf(q) === "string") {
						p = q
					} else {
						if (l.typeOf(q.ruid) === "string") {
							p = q.ruid
						}
					}
					if (p) {
						m = k.getRuntime(p);
						if (m) {
							m.clients++;
							return m
						} else {
							throw new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR)
						}
					}
					n((q.runtime_order || k.order).split(/\s*,\s*/))
				},
				getRuntime: function() {
					if (m && m.uid) {
						return m
					}
					m = null;
					return null
				},
				disconnectRuntime: function() {
					if (m && --m.clients <= 0) {
						m.destroy();
						m = null
					}
				}
			})
		}
	});
	h("moxie/file/Blob", ["moxie/core/utils/Basic", "moxie/core/utils/Encode", "moxie/runtime/RuntimeClient"], function(l, j, k) {
		var i = {};

		function m(p, o) {
			function n(u, q, s) {
				var r, t = i[this.uid];
				if (l.typeOf(t) !== "string" || !t.length) {
					return null
				}
				r = new m(null, {
					type: s,
					size: q - u
				});
				r.detach(t.substr(u, r.size));
				return r
			}
			k.call(this);
			if (p) {
				this.connectRuntime(p)
			}
			if (!o) {
				o = {}
			} else {
				if (l.typeOf(o) === "string") {
					o = {
						data: o
					}
				}
			}
			l.extend(this, {
				uid: o.uid || l.guid("uid_"),
				ruid: p,
				size: o.size || 0,
				type: o.type || "",
				slice: function(s, q, r) {
					if (this.isDetached()) {
						return n.apply(this, arguments)
					}
					return this.getRuntime().exec.call(this, "Blob", "slice", this.getSource(), s, q, r)
				},
				getSource: function() {
					if (!i[this.uid]) {
						return null
					}
					return i[this.uid]
				},
				detach: function(r) {
					if (this.ruid) {
						this.getRuntime().exec.call(this, "Blob", "destroy");
						this.disconnectRuntime();
						this.ruid = null
					}
					r = r || "";
					var q = r.match(/^data:([^;]*);base64,/);
					if (q) {
						this.type = q[1];
						r = j.atob(r.substring(r.indexOf("base64,") + 7))
					}
					this.size = r.length;
					i[this.uid] = r
				},
				isDetached: function() {
					return !this.ruid && l.typeOf(i[this.uid]) === "string"
				},
				destroy: function() {
					this.detach();
					delete i[this.uid]
				}
			});
			if (o.data) {
				this.detach(o.data)
			} else {
				i[this.uid] = o
			}
		}
		return m
	});
	h("moxie/file/File", ["moxie/core/utils/Basic", "moxie/core/utils/Mime", "moxie/file/Blob"], function(k, j, l) {
		function i(n, o) {
			var m, p;
			if (!o) {
				o = {}
			}
			if (o.type && o.type !== "") {
				p = o.type
			} else {
				p = j.getFileMime(o.name)
			}
			if (o.name) {
				m = o.name.replace(/\\/g, "/");
				m = m.substr(m.lastIndexOf("/") + 1)
			} else {
				var q = p.split("/")[0];
				m = k.guid((q !== "" ? q : "file") + "_");
				if (j.extensions[p]) {
					m += "." + j.extensions[p][0]
				}
			}
			l.apply(this, arguments);
			k.extend(this, {
				type: p || "",
				name: m || k.guid("file_"),
				lastModifiedDate: o.lastModifiedDate || (new Date()).toLocaleString()
			})
		}
		i.prototype = l.prototype;
		return i
	});
	h("moxie/file/FileInput", ["moxie/core/utils/Basic", "moxie/core/utils/Mime", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/core/EventTarget", "moxie/core/I18n", "moxie/file/File", "moxie/runtime/Runtime", "moxie/runtime/RuntimeClient"], function(j, m, l, q, s, k, o, i, p) {
		var r = ["ready", "change", "cancel", "mouseenter", "mouseleave", "mousedown", "mouseup"];

		function n(w) {
			var u = this,
				t, v, x;
			if (j.inArray(j.typeOf(w), ["string", "node"]) !== -1) {
				w = {
					browse_button: w
				}
			}
			v = l.get(w.browse_button);
			if (!v) {
				throw new q.DOMException(q.DOMException.NOT_FOUND_ERR)
			}
			x = {
				accept: [{
					title: k.translate("All Files"),
					extensions: "*"
				}],
				name: "file",
				multiple: false,
				required_caps: false,
				container: v.parentNode || document.body
			};
			w = j.extend({}, x, w);
			if (typeof(w.required_caps) === "string") {
				w.required_caps = i.parseCaps(w.required_caps)
			}
			if (typeof(w.accept) === "string") {
				w.accept = m.mimes2extList(w.accept)
			}
			t = l.get(w.container);
			if (!t) {
				t = document.body
			}
			if (l.getStyle(t, "position") === "static") {
				t.style.position = "relative"
			}
			t = v = null;
			p.call(u);
			j.extend(u, {
				uid: j.guid("uid_"),
				ruid: null,
				shimid: null,
				files: null,
				init: function() {
					u.convertEventPropsToHandlers(r);
					u.bind("RuntimeInit", function(z, y) {
						u.ruid = y.uid;
						u.shimid = y.shimid;
						u.bind("Ready", function() {
							u.trigger("Refresh")
						}, 999);
						u.bind("Change", function() {
							var A = y.exec.call(u, "FileInput", "getFiles");
							u.files = [];
							j.each(A, function(B) {
								if (B.size === 0) {
									return true
								}
								u.files.push(new o(u.ruid, B))
							})
						}, 999);
						u.bind("Refresh", function() {
							var D, C, B, A;
							B = l.get(w.browse_button);
							A = l.get(y.shimid);
							if (B) {
								D = l.getPos(B, l.get(w.container));
								C = l.getSize(B);
								if (A) {
									j.extend(A.style, {
										top: D.y + "px",
										left: D.x + "px",
										width: C.w + "px",
										height: C.h + "px"
									})
								}
							}
							A = B = null
						});
						y.exec.call(u, "FileInput", "init", w)
					});
					u.connectRuntime(j.extend({}, w, {
						required_caps: {
							select_file: true
						}
					}))
				},
				disable: function(z) {
					var y = this.getRuntime();
					if (y) {
						y.exec.call(this, "FileInput", "disable", j.typeOf(z) === "undefined" ? true : z)
					}
				},
				refresh: function() {
					u.trigger("Refresh")
				},
				destroy: function() {
					var y = this.getRuntime();
					if (y) {
						y.exec.call(this, "FileInput", "destroy");
						this.disconnectRuntime()
					}
					if (j.typeOf(this.files) === "array") {
						j.each(this.files, function(z) {
							z.destroy()
						})
					}
					this.files = null
				}
			})
		}
		n.prototype = s.instance;
		return n
	});
	h("moxie/file/FileDrop", ["moxie/core/I18n", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/file/File", "moxie/runtime/RuntimeClient", "moxie/core/EventTarget", "moxie/core/utils/Mime"], function(k, l, p, i, n, o, r, m) {
		var q = ["ready", "dragenter", "dragleave", "drop", "error"];

		function j(t) {
			var s = this,
				u;
			if (typeof(t) === "string") {
				t = {
					drop_zone: t
				}
			}
			u = {
				accept: [{
					title: k.translate("All Files"),
					extensions: "*"
				}],
				required_caps: {
					drag_and_drop: true
				}
			};
			t = typeof(t) === "object" ? i.extend({}, u, t) : u;
			t.container = l.get(t.drop_zone) || document.body;
			if (l.getStyle(t.container, "position") === "static") {
				t.container.style.position = "relative"
			}
			if (typeof(t.accept) === "string") {
				t.accept = m.mimes2extList(t.accept)
			}
			o.call(s);
			i.extend(s, {
				uid: i.guid("uid_"),
				ruid: null,
				files: null,
				init: function() {
					s.convertEventPropsToHandlers(q);
					s.bind("RuntimeInit", function(w, v) {
						s.ruid = v.uid;
						s.bind("Drop", function() {
							var x = v.exec.call(s, "FileDrop", "getFiles");
							s.files = [];
							i.each(x, function(y) {
								s.files.push(new n(s.ruid, y))
							})
						}, 999);
						v.exec.call(s, "FileDrop", "init", t);
						s.dispatchEvent("ready")
					});
					s.connectRuntime(t)
				},
				destroy: function() {
					var v = this.getRuntime();
					if (v) {
						v.exec.call(this, "FileDrop", "destroy");
						this.disconnectRuntime()
					}
					this.files = null
				}
			})
		}
		j.prototype = r.instance;
		return j
	});
	h("moxie/runtime/RuntimeTarget", ["moxie/core/utils/Basic", "moxie/runtime/RuntimeClient", "moxie/core/EventTarget"], function(k, j, l) {
		function i() {
			this.uid = k.guid("uid_");
			j.call(this);
			this.destroy = function() {
				this.disconnectRuntime();
				this.unbindAll()
			}
		}
		i.prototype = l.instance;
		return i
	});
	h("moxie/file/FileReader", ["moxie/core/utils/Basic", "moxie/core/utils/Encode", "moxie/core/Exceptions", "moxie/core/EventTarget", "moxie/file/Blob", "moxie/file/File", "moxie/runtime/RuntimeTarget"], function(i, m, o, q, l, n, k) {
		var p = ["loadstart", "progress", "load", "abort", "error", "loadend"];

		function j() {
			var r = this,
				t;
			i.extend(this, {
				uid: i.guid("uid_"),
				readyState: j.EMPTY,
				result: null,
				error: null,
				readAsBinaryString: function(u) {
					s.call(this, "readAsBinaryString", u)
				},
				readAsDataURL: function(u) {
					s.call(this, "readAsDataURL", u)
				},
				readAsText: function(u) {
					s.call(this, "readAsText", u)
				},
				abort: function() {
					this.result = null;
					if (i.inArray(this.readyState, [j.EMPTY, j.DONE]) !== -1) {
						return
					} else {
						if (this.readyState === j.LOADING) {
							this.readyState = j.DONE
						}
					}
					if (t) {
						t.getRuntime().exec.call(this, "FileReader", "abort")
					}
					this.trigger("abort");
					this.trigger("loadend")
				},
				destroy: function() {
					this.abort();
					if (t) {
						t.getRuntime().exec.call(this, "FileReader", "destroy");
						t.disconnectRuntime()
					}
					r = t = null
				}
			});

			function s(z, v) {
				t = new k();

				function x(A) {
					r.readyState = j.DONE;
					r.error = A;
					r.trigger("error");
					w()
				}

				function w() {
					t.destroy();
					t = null;
					r.trigger("loadend")
				}

				function u(A) {
					t.bind("Error", function(C, B) {
						x(B)
					});
					t.bind("Progress", function(B) {
						r.result = A.exec.call(t, "FileReader", "getResult");
						r.trigger(B)
					});
					t.bind("Load", function(B) {
						r.readyState = j.DONE;
						r.result = A.exec.call(t, "FileReader", "getResult");
						r.trigger(B);
						w()
					});
					A.exec.call(t, "FileReader", "read", z, v)
				}
				this.convertEventPropsToHandlers(p);
				if (this.readyState === j.LOADING) {
					return x(new o.DOMException(o.DOMException.INVALID_STATE_ERR))
				}
				this.readyState = j.LOADING;
				this.trigger("loadstart");
				if (v instanceof l) {
					if (v.isDetached()) {
						var y = v.getSource();
						switch (z) {
							case "readAsText":
							case "readAsBinaryString":
								this.result = y;
								break;
							case "readAsDataURL":
								this.result = "data:" + v.type + ";base64," + m.btoa(y);
								break
						}
						this.readyState = j.DONE;
						this.trigger("load");
						w()
					} else {
						u(t.connectRuntime(v.ruid))
					}
				} else {
					x(new o.DOMException(o.DOMException.NOT_FOUND_ERR))
				}
			}
		}
		j.EMPTY = 0;
		j.LOADING = 1;
		j.DONE = 2;
		j.prototype = q.instance;
		return j
	});
	h("moxie/core/utils/Url", [], function() {
		var i = function(l, t) {
			var s = ["source", "scheme", "authority", "userInfo", "user", "pass", "host", "port", "relative", "path", "directory", "file", "query", "fragment"],
				p = s.length,
				q = {
					http: 80,
					https: 443
				},
				n = {},
				r = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,
				o = r.exec(l || "");
			while (p--) {
				if (o[p]) {
					n[s[p]] = o[p]
				}
			}
			if (!n.scheme) {
				if (!t || typeof(t) === "string") {
					t = i(t || document.location.href)
				}
				n.scheme = t.scheme;
				n.host = t.host;
				n.port = t.port;
				var u = "";
				if (/^[^\/]/.test(n.path)) {
					u = t.path;
					if (!/(\/|\/[^\.]+)$/.test(u)) {
						u = u.replace(/\/[^\/]+$/, "/")
					} else {
						u += "/"
					}
				}
				n.path = u + (n.path || "")
			}
			if (!n.port) {
				n.port = q[n.scheme] || 80
			}
			n.port = parseInt(n.port, 10);
			if (!n.path) {
				n.path = "/"
			}
			delete n.source;
			return n
		};
		var k = function(m) {
			var n = {
					http: 80,
					https: 443
				},
				l = i(m);
			return l.scheme + "://" + l.host + (l.port !== n[l.scheme] ? ":" + l.port : "") + l.path + (l.query ? l.query : "")
		};
		var j = function(m) {
			function l(n) {
				return [n.scheme, n.host, n.port].join("/")
			}
			if (typeof m === "string") {
				m = i(m)
			}
			return l(i()) === l(m)
		};
		return {
			parseUrl: i,
			resolveUrl: k,
			hasSameOrigin: j
		}
	});
	h("moxie/file/FileReaderSync", ["moxie/core/utils/Basic", "moxie/runtime/RuntimeClient", "moxie/core/utils/Encode"], function(k, j, i) {
		return function() {
			j.call(this);
			k.extend(this, {
				uid: k.guid("uid_"),
				readAsBinaryString: function(m) {
					return l.call(this, "readAsBinaryString", m)
				},
				readAsDataURL: function(m) {
					return l.call(this, "readAsDataURL", m)
				},
				readAsText: function(m) {
					return l.call(this, "readAsText", m)
				}
			});

			function l(s, o) {
				if (o.isDetached()) {
					var r = o.getSource();
					switch (s) {
						case "readAsBinaryString":
							return r;
						case "readAsDataURL":
							return "data:" + o.type + ";base64," + i.btoa(r);
						case "readAsText":
							var n = "";
							for (var p = 0, q = r.length; p < q; p++) {
								n += String.fromCharCode(r[p])
							}
							return n
					}
				} else {
					var m = this.connectRuntime(o.ruid).exec.call(this, "FileReaderSync", "read", s, o);
					this.disconnectRuntime();
					return m
				}
			}
		}
	});
	h("moxie/xhr/FormData", ["moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/file/Blob"], function(i, j, l) {
		function k() {
			var m, n = [];
			j.extend(this, {
				append: function(p, q) {
					var o = this,
						r = j.typeOf(q);
					if (q instanceof l) {
						m = {
							name: p,
							value: q
						}
					} else {
						if ("array" === r) {
							p += "[]";
							j.each(q, function(s) {
								o.append(p, s)
							})
						} else {
							if ("object" === r) {
								j.each(q, function(t, s) {
									o.append(p + "[" + s + "]", t)
								})
							} else {
								if ("null" === r || "undefined" === r || "number" === r && isNaN(q)) {
									o.append(p, "false")
								} else {
									n.push({
										name: p,
										value: q.toString()
									})
								}
							}
						}
					}
				},
				hasBlob: function() {
					return !!this.getBlob()
				},
				getBlob: function() {
					return m && m.value || null
				},
				getBlobName: function() {
					return m && m.name || null
				},
				each: function(o) {
					j.each(n, function(p) {
						o(p.value, p.name)
					});
					if (m) {
						o(m.value, m.name)
					}
				},
				destroy: function() {
					m = null;
					n = []
				}
			})
		}
		return k
	});
	h("moxie/xhr/XMLHttpRequest", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/core/EventTarget", "moxie/core/utils/Encode", "moxie/core/utils/Url", "moxie/runtime/Runtime", "moxie/runtime/RuntimeTarget", "moxie/file/Blob", "moxie/file/FileReaderSync", "moxie/xhr/FormData", "moxie/core/utils/Env", "moxie/core/utils/Mime"], function(q, r, p, y, u, o, s, n, w, z, i, t) {
		var j = {
			100: "Continue",
			101: "Switching Protocols",
			102: "Processing",
			200: "OK",
			201: "Created",
			202: "Accepted",
			203: "Non-Authoritative Information",
			204: "No Content",
			205: "Reset Content",
			206: "Partial Content",
			207: "Multi-Status",
			226: "IM Used",
			300: "Multiple Choices",
			301: "Moved Permanently",
			302: "Found",
			303: "See Other",
			304: "Not Modified",
			305: "Use Proxy",
			306: "Reserved",
			307: "Temporary Redirect",
			400: "Bad Request",
			401: "Unauthorized",
			402: "Payment Required",
			403: "Forbidden",
			404: "Not Found",
			405: "Method Not Allowed",
			406: "Not Acceptable",
			407: "Proxy Authentication Required",
			408: "Request Timeout",
			409: "Conflict",
			410: "Gone",
			411: "Length Required",
			412: "Precondition Failed",
			413: "Request Entity Too Large",
			414: "Request-URI Too Long",
			415: "Unsupported Media Type",
			416: "Requested Range Not Satisfiable",
			417: "Expectation Failed",
			422: "Unprocessable Entity",
			423: "Locked",
			424: "Failed Dependency",
			426: "Upgrade Required",
			500: "Internal Server Error",
			501: "Not Implemented",
			502: "Bad Gateway",
			503: "Service Unavailable",
			504: "Gateway Timeout",
			505: "HTTP Version Not Supported",
			506: "Variant Also Negotiates",
			507: "Insufficient Storage",
			510: "Not Extended"
		};

		function m() {
			this.uid = q.guid("uid_")
		}
		m.prototype = p.instance;
		var l = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
		var k = 1,
			A = 2;

		function v() {
			var S = this,
				E = {
					timeout: 0,
					readyState: v.UNSENT,
					withCredentials: false,
					status: 0,
					statusText: "",
					responseType: "",
					responseXML: null,
					responseText: null,
					response: null
				},
				Y = true,
				J, Q, R = {},
				T, G, I = null,
				K = null,
				ab = false,
				B = false,
				x = false,
				L = false,
				D = false,
				H = false,
				O, X, W = null,
				Z = null,
				U = {},
				P, V = "",
				C;
			q.extend(this, E, {
				uid: q.guid("uid_"),
				upload: new m(),
				open: function(ah, af, ag, ad, ae) {
					var ac;
					if (!ah || !af) {
						throw new r.DOMException(r.DOMException.SYNTAX_ERR)
					}
					if (/[\u0100-\uffff]/.test(ah) || y.utf8_encode(ah) !== ah) {
						throw new r.DOMException(r.DOMException.SYNTAX_ERR)
					}
					if (!!~q.inArray(ah.toUpperCase(), ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "TRACE", "TRACK"])) {
						Q = ah.toUpperCase()
					}
					if (!!~q.inArray(Q, ["CONNECT", "TRACE", "TRACK"])) {
						throw new r.DOMException(r.DOMException.SECURITY_ERR)
					}
					af = y.utf8_encode(af);
					ac = u.parseUrl(af);
					H = u.hasSameOrigin(ac);
					J = u.resolveUrl(af);
					if ((ad || ae) && !H) {
						throw new r.DOMException(r.DOMException.INVALID_ACCESS_ERR)
					}
					T = ad || ac.user;
					G = ae || ac.pass;
					Y = ag || true;
					if (Y === false && (aa("timeout") || aa("withCredentials") || aa("responseType") !== "")) {
						throw new r.DOMException(r.DOMException.INVALID_ACCESS_ERR)
					}
					ab = !Y;
					B = false;
					R = {};
					N.call(this);
					aa("readyState", v.OPENED);
					this.convertEventPropsToHandlers(["readystatechange"]);
					this.dispatchEvent("readystatechange")
				},
				setRequestHeader: function(ae, ad) {
					var ac = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
					if (aa("readyState") !== v.OPENED || B) {
						throw new r.DOMException(r.DOMException.INVALID_STATE_ERR)
					}
					if (/[\u0100-\uffff]/.test(ae) || y.utf8_encode(ae) !== ae) {
						throw new r.DOMException(r.DOMException.SYNTAX_ERR)
					}
					ae = q.trim(ae).toLowerCase();
					if (!!~q.inArray(ae, ac) || /^(proxy\-|sec\-)/.test(ae)) {
						return false
					}
					if (!R[ae]) {
						R[ae] = ad
					} else {
						R[ae] += ", " + ad
					}
					return true
				},
				getAllResponseHeaders: function() {
					return V || ""
				},
				getResponseHeader: function(ac) {
					ac = ac.toLowerCase();
					if (D || !!~q.inArray(ac, ["set-cookie", "set-cookie2"])) {
						return null
					}
					if (V && V !== "") {
						if (!C) {
							C = {};
							q.each(V.split(/\r\n/), function(ad) {
								var ae = ad.split(/:\s+/);
								if (ae.length === 2) {
									ae[0] = q.trim(ae[0]);
									C[ae[0].toLowerCase()] = {
										header: ae[0],
										value: q.trim(ae[1])
									}
								}
							})
						}
						if (C.hasOwnProperty(ac)) {
							return C[ac].header + ": " + C[ac].value
						}
					}
					return null
				},
				overrideMimeType: function(ad) {
					var ac, ae;
					if (!!~q.inArray(aa("readyState"), [v.LOADING, v.DONE])) {
						throw new r.DOMException(r.DOMException.INVALID_STATE_ERR)
					}
					ad = q.trim(ad.toLowerCase());
					if (/;/.test(ad) && (ac = ad.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))) {
						ad = ac[1];
						if (ac[2]) {
							ae = ac[2]
						}
					}
					if (!t.mimes[ad]) {
						throw new r.DOMException(r.DOMException.SYNTAX_ERR)
					}
					W = ad;
					Z = ae
				},
				send: function(ae, ad) {
					if (q.typeOf(ad) === "string") {
						U = {
							ruid: ad
						}
					} else {
						if (!ad) {
							U = {}
						} else {
							U = ad
						}
					}
					this.convertEventPropsToHandlers(l);
					this.upload.convertEventPropsToHandlers(l);
					if (this.readyState !== v.OPENED || B) {
						throw new r.DOMException(r.DOMException.INVALID_STATE_ERR)
					}
					if (ae instanceof n) {
						U.ruid = ae.ruid;
						K = ae.type || "application/octet-stream"
					} else {
						if (ae instanceof z) {
							if (ae.hasBlob()) {
								var ac = ae.getBlob();
								U.ruid = ac.ruid;
								K = ac.type || "application/octet-stream"
							}
						} else {
							if (typeof ae === "string") {
								I = "UTF-8";
								K = "text/plain;charset=UTF-8";
								ae = y.utf8_encode(ae)
							}
						}
					}
					if (!this.withCredentials) {
						this.withCredentials = (U.required_caps && U.required_caps.send_browser_cookies) && !H
					}
					x = (!ab && this.upload.hasEventListener());
					D = false;
					L = !ae;
					if (!ab) {
						B = true
					}
					F.call(this, ae)
				},
				abort: function() {
					D = true;
					ab = false;
					if (!~q.inArray(aa("readyState"), [v.UNSENT, v.OPENED, v.DONE])) {
						aa("readyState", v.DONE);
						B = false;
						if (P) {
							P.getRuntime().exec.call(P, "XMLHttpRequest", "abort", L)
						} else {
							throw new r.DOMException(r.DOMException.INVALID_STATE_ERR)
						}
						L = true
					} else {
						aa("readyState", v.UNSENT)
					}
				},
				destroy: function() {
					if (P) {
						if (q.typeOf(P.destroy) === "function") {
							P.destroy()
						}
						P = null
					}
					this.unbindAll();
					if (this.upload) {
						this.upload.unbindAll();
						this.upload = null
					}
				}
			});

			function aa(ad, ac) {
				if (!E.hasOwnProperty(ad)) {
					return
				}
				if (arguments.length === 1) {
					return i.can("define_property") ? E[ad] : S[ad]
				} else {
					if (i.can("define_property")) {
						E[ad] = ac
					} else {
						S[ad] = ac
					}
				}
			}

			function F(af) {
				var ad = this;
				O = new Date().getTime();
				P = new s();

				function ae() {
					if (P) {
						P.destroy();
						P = null
					}
					ad.dispatchEvent("loadend");
					ad = null
				}

				function ac(ag) {
					P.bind("LoadStart", function(ah) {
						aa("readyState", v.LOADING);
						ad.dispatchEvent("readystatechange");
						ad.dispatchEvent(ah);
						if (x) {
							ad.upload.dispatchEvent(ah)
						}
					});
					P.bind("Progress", function(ah) {
						if (aa("readyState") !== v.LOADING) {
							aa("readyState", v.LOADING);
							ad.dispatchEvent("readystatechange")
						}
						ad.dispatchEvent(ah)
					});
					P.bind("UploadProgress", function(ah) {
						if (x) {
							ad.upload.dispatchEvent({
								type: "progress",
								lengthComputable: false,
								total: ah.total,
								loaded: ah.loaded
							})
						}
					});
					P.bind("Load", function(ah) {
						aa("readyState", v.DONE);
						aa("status", Number(ag.exec.call(P, "XMLHttpRequest", "getStatus") || 0));
						aa("statusText", j[aa("status")] || "");
						aa("response", ag.exec.call(P, "XMLHttpRequest", "getResponse", aa("responseType")));
						if (!!~q.inArray(aa("responseType"), ["text", ""])) {
							aa("responseText", aa("response"))
						} else {
							if (aa("responseType") === "document") {
								aa("responseXML", aa("response"))
							}
						}
						V = ag.exec.call(P, "XMLHttpRequest", "getAllResponseHeaders");
						ad.dispatchEvent("readystatechange");
						if (aa("status") > 0) {
							if (x) {
								ad.upload.dispatchEvent(ah)
							}
							ad.dispatchEvent(ah)
						} else {
							D = true;
							ad.dispatchEvent("error")
						}
						ae()
					});
					P.bind("Abort", function(ah) {
						ad.dispatchEvent(ah);
						ae()
					});
					P.bind("Error", function(ah) {
						D = true;
						aa("readyState", v.DONE);
						ad.dispatchEvent("readystatechange");
						L = true;
						ad.dispatchEvent(ah);
						ae()
					});
					ag.exec.call(P, "XMLHttpRequest", "send", {
						url: J,
						method: Q,
						async: Y,
						user: T,
						password: G,
						headers: R,
						mimeType: K,
						encoding: I,
						responseType: ad.responseType,
						withCredentials: ad.withCredentials,
						options: U
					}, af)
				}
				if (typeof(U.required_caps) === "string") {
					U.required_caps = o.parseCaps(U.required_caps)
				}
				U.required_caps = q.extend({}, U.required_caps, {
					return_response_type: ad.responseType
				});
				if (af instanceof z) {
					U.required_caps.send_multipart = true
				}
				if (!H) {
					U.required_caps.do_cors = true
				}
				if (U.ruid) {
					ac(P.connectRuntime(U))
				} else {
					P.bind("RuntimeInit", function(ah, ag) {
						ac(ag)
					});
					P.bind("RuntimeError", function(ah, ag) {
						ad.dispatchEvent("RuntimeError", ag)
					});
					P.connectRuntime(U)
				}
			}

			function N() {
				aa("responseText", "");
				aa("responseXML", null);
				aa("response", null);
				aa("status", 0);
				aa("statusText", "");
				O = X = null
			}
		}
		v.UNSENT = 0;
		v.OPENED = 1;
		v.HEADERS_RECEIVED = 2;
		v.LOADING = 3;
		v.DONE = 4;
		v.prototype = p.instance;
		return v
	});
	h("moxie/runtime/Transporter", ["moxie/core/utils/Basic", "moxie/core/utils/Encode", "moxie/runtime/RuntimeClient", "moxie/core/EventTarget"], function(l, i, j, m) {
		function k() {
			var r, p, n, s, v, u;
			j.call(this);
			l.extend(this, {
				uid: l.guid("uid_"),
				state: k.IDLE,
				result: null,
				transport: function(A, z, y) {
					var x = this;
					y = l.extend({
						chunk_size: 204798
					}, y);
					if ((r = y.chunk_size % 3)) {
						y.chunk_size += 3 - r
					}
					u = y.chunk_size;
					t.call(this);
					n = A;
					s = A.length;
					if (l.typeOf(y) === "string" || y.ruid) {
						q.call(x, z, this.connectRuntime(y))
					} else {
						var w = function(C, B) {
							x.unbind("RuntimeInit", w);
							q.call(x, z, B)
						};
						this.bind("RuntimeInit", w);
						this.connectRuntime(y)
					}
				},
				abort: function() {
					var w = this;
					w.state = k.IDLE;
					if (p) {
						p.exec.call(w, "Transporter", "clear");
						w.trigger("TransportingAborted")
					}
					t.call(w)
				},
				destroy: function() {
					this.unbindAll();
					p = null;
					this.disconnectRuntime();
					t.call(this)
				}
			});

			function t() {
				s = v = 0;
				n = this.result = null
			}

			function q(x, y) {
				var w = this;
				p = y;
				w.bind("TransportingProgress", function(z) {
					v = z.loaded;
					if (v < s && l.inArray(w.state, [k.IDLE, k.DONE]) === -1) {
						o.call(w)
					}
				}, 999);
				w.bind("TransportingComplete", function() {
					v = s;
					w.state = k.DONE;
					n = null;
					w.result = p.exec.call(w, "Transporter", "getAsBlob", x || "")
				}, 999);
				w.state = k.BUSY;
				w.trigger("TransportingStarted");
				o.call(w)
			}

			function o() {
				var w = this,
					x, y = s - v;
				if (u > y) {
					u = y
				}
				x = i.btoa(n.substr(v, u));
				p.exec.call(w, "Transporter", "receive", x, s)
			}
		}
		k.IDLE = 0;
		k.BUSY = 1;
		k.DONE = 2;
		k.prototype = m.instance;
		return k
	});
	h("moxie/image/Image", ["moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/file/FileReaderSync", "moxie/xhr/XMLHttpRequest", "moxie/runtime/Runtime", "moxie/runtime/RuntimeClient", "moxie/runtime/Transporter", "moxie/core/utils/Env", "moxie/core/EventTarget", "moxie/file/Blob", "moxie/file/File", "moxie/core/utils/Encode"], function(k, n, t, r, u, j, s, m, q, w, l, p, o) {
		var v = ["progress", "load", "error", "resize", "embedded"];

		function i() {
			s.call(this);
			k.extend(this, {
				uid: k.guid("uid_"),
				ruid: null,
				name: "",
				size: 0,
				width: 0,
				height: 0,
				type: "",
				meta: {},
				clone: function() {
					this.load.apply(this, arguments)
				},
				load: function() {
					this.bind("Load Resize", function() {
						y.call(this)
					}, 999);
					this.convertEventPropsToHandlers(v);
					z.apply(this, arguments)
				},
				downsize: function(D) {
					var E = {
						width: this.width,
						height: this.height,
						crop: false,
						preserveHeaders: true
					};
					if (typeof(D) === "object") {
						D = k.extend(E, D)
					} else {
						D = k.extend(E, {
							width: arguments[0],
							height: arguments[1],
							crop: arguments[2],
							preserveHeaders: arguments[3]
						})
					}
					try {
						if (!this.size) {
							throw new t.DOMException(t.DOMException.INVALID_STATE_ERR)
						}
						if (this.width > i.MAX_RESIZE_WIDTH || this.height > i.MAX_RESIZE_HEIGHT) {
							throw new t.ImageError(t.ImageError.MAX_RESOLUTION_ERR)
						}
						this.getRuntime().exec.call(this, "Image", "downsize", D.width, D.height, D.crop, D.preserveHeaders)
					} catch (C) {
						this.trigger("error", C.code)
					}
				},
				crop: function(E, C, D) {
					this.downsize(E, C, true, D)
				},
				getAsCanvas: function() {
					if (!q.can("create_canvas")) {
						throw new t.RuntimeError(t.RuntimeError.NOT_SUPPORTED_ERR)
					}
					var C = this.connectRuntime(this.ruid);
					return C.exec.call(this, "Image", "getAsCanvas")
				},
				getAsBlob: function(C, D) {
					if (!this.size) {
						throw new t.DOMException(t.DOMException.INVALID_STATE_ERR)
					}
					if (!C) {
						C = "image/jpeg"
					}
					if (C === "image/jpeg" && !D) {
						D = 90
					}
					return this.getRuntime().exec.call(this, "Image", "getAsBlob", C, D)
				},
				getAsDataURL: function(C, D) {
					if (!this.size) {
						throw new t.DOMException(t.DOMException.INVALID_STATE_ERR)
					}
					return this.getRuntime().exec.call(this, "Image", "getAsDataURL", C, D)
				},
				getAsBinaryString: function(C, E) {
					var D = this.getAsDataURL(C, E);
					return o.atob(D.substring(D.indexOf("base64,") + 7))
				},
				embed: function(F) {
					var O = this,
						K, J, L, H, P = arguments[1] || {},
						E = this.width,
						N = this.height,
						G;

					function D() {
						if (q.can("create_canvas")) {
							var Q = K.getAsCanvas();
							if (Q) {
								F.appendChild(Q);
								Q = null;
								K.destroy();
								O.trigger("embedded");
								return
							}
						}
						var S = K.getAsDataURL(J, L);
						if (!S) {
							throw new t.ImageError(t.ImageError.WRONG_FORMAT)
						}
						if (q.can("use_data_uri_of", S.length)) {
							F.innerHTML = '<img src="' + S + '" width="' + K.width + '" height="' + K.height + '" />';
							K.destroy();
							O.trigger("embedded")
						} else {
							var R = new m();
							R.bind("TransportingComplete", function() {
								G = O.connectRuntime(this.result.ruid);
								O.bind("Embedded", function() {
									k.extend(G.getShimContainer().style, {
										top: "0px",
										left: "0px",
										width: K.width + "px",
										height: K.height + "px"
									});
									G = null
								}, 999);
								G.exec.call(O, "ImageView", "display", this.result.uid, E, N);
								K.destroy()
							});
							R.transport(o.atob(S.substring(S.indexOf("base64,") + 7)), J, k.extend({}, P, {
								required_caps: {
									display_media: true
								},
								runtime_order: "flash,silverlight",
								container: F
							}))
						}
					}
					try {
						if (!(F = n.get(F))) {
							throw new t.DOMException(t.DOMException.INVALID_NODE_TYPE_ERR)
						}
						if (!this.size) {
							throw new t.DOMException(t.DOMException.INVALID_STATE_ERR)
						}
						if (this.width > i.MAX_RESIZE_WIDTH || this.height > i.MAX_RESIZE_HEIGHT) {
							throw new t.ImageError(t.ImageError.MAX_RESOLUTION_ERR)
						}
						J = P.type || this.type || "image/jpeg";
						L = P.quality || 90;
						H = k.typeOf(P.crop) !== "undefined" ? P.crop : false;
						if (P.width) {
							E = P.width;
							N = P.height || E
						} else {
							var C = n.getSize(F);
							if (C.w && C.h) {
								E = C.w;
								N = C.h
							}
						}
						K = new i();
						K.bind("Resize", function() {
							D.call(O)
						});
						K.bind("Load", function() {
							K.downsize(E, N, H, false)
						});
						K.clone(this, false);
						return K
					} catch (I) {
						this.trigger("error", I.code)
					}
				},
				destroy: function() {
					if (this.ruid) {
						this.getRuntime().exec.call(this, "Image", "destroy");
						this.disconnectRuntime()
					}
					this.unbindAll()
				}
			});

			function y(C) {
				if (!C) {
					C = this.getRuntime().exec.call(this, "Image", "getInfo")
				}
				this.size = C.size;
				this.width = C.width;
				this.height = C.height;
				this.type = C.type;
				this.meta = C.meta;
				if (this.name === "") {
					this.name = C.name
				}
			}

			function z(E) {
				var D = k.typeOf(E);
				try {
					if (E instanceof i) {
						if (!E.size) {
							throw new t.DOMException(t.DOMException.INVALID_STATE_ERR)
						}
						x.apply(this, arguments)
					} else {
						if (E instanceof l) {
							if (!~k.inArray(E.type, ["image/jpeg", "image/png"])) {
								throw new t.ImageError(t.ImageError.WRONG_FORMAT)
							}
							A.apply(this, arguments)
						} else {
							if (k.inArray(D, ["blob", "file"]) !== -1) {
								z.call(this, new p(null, E), arguments[1])
							} else {
								if (D === "string") {
									if (/^data:[^;]*;base64,/.test(E)) {
										z.call(this, new l(null, {
											data: E
										}), arguments[1])
									} else {
										B.apply(this, arguments)
									}
								} else {
									if (D === "node" && E.nodeName.toLowerCase() === "img") {
										z.call(this, E.src, arguments[1])
									} else {
										throw new t.DOMException(t.DOMException.TYPE_MISMATCH_ERR)
									}
								}
							}
						}
					}
				} catch (C) {
					this.trigger("error", C.code)
				}
			}

			function x(C, D) {
				var E = this.connectRuntime(C.ruid);
				this.ruid = E.uid;
				E.exec.call(this, "Image", "loadFromImage", C, (k.typeOf(D) === "undefined" ? true : D))
			}

			function A(E, F) {
				var D = this;
				D.name = E.name || "";

				function C(G) {
					D.ruid = G.uid;
					G.exec.call(D, "Image", "loadFromBlob", E)
				}
				if (E.isDetached()) {
					this.bind("RuntimeInit", function(H, G) {
						C(G)
					});
					if (F && typeof(F.required_caps) === "string") {
						F.required_caps = j.parseCaps(F.required_caps)
					}
					this.connectRuntime(k.extend({
						required_caps: {
							access_image_binary: true,
							resize_image: true
						}
					}, F))
				} else {
					C(this.connectRuntime(E.ruid))
				}
			}

			function B(E, D) {
				var C = this,
					F;
				F = new u();
				F.open("get", E);
				F.responseType = "blob";
				F.onprogress = function(G) {
					C.trigger(G)
				};
				F.onload = function() {
					A.call(C, F.response, true)
				};
				F.onerror = function(G) {
					C.trigger(G)
				};
				F.onloadend = function() {
					F.destroy()
				};
				F.bind("RuntimeError", function(H, G) {
					C.trigger("RuntimeError", G)
				});
				F.send(null, D)
			}
		}
		i.MAX_RESIZE_WIDTH = 6500;
		i.MAX_RESIZE_HEIGHT = 6500;
		i.prototype = w.instance;
		return i
	});
	h("moxie/runtime/html5/Runtime", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/Runtime", "moxie/core/utils/Env"], function(n, i, k, j) {
		var m = "html5",
			l = {};

		function o(q) {
			var p = this,
				t = k.capTest,
				s = k.capTrue;
			var r = n.extend({
				access_binary: t(window.FileReader || window.File && window.File.getAsDataURL),
				access_image_binary: function() {
					return p.can("access_binary") && !!l.Image
				},
				display_media: t(j.can("create_canvas") || j.can("use_data_uri_over32kb")),
				do_cors: t(window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest()),
				drag_and_drop: t(function() {
					var u = document.createElement("div");
					return (("draggable" in u) || ("ondragstart" in u && "ondrop" in u)) && (j.browser !== "IE" || j.version > 9)
				}()),
				filter_by_extension: t(function() {
					return (j.browser === "Chrome" && j.version >= 28) || (j.browser === "IE" && j.version >= 10)
				}()),
				return_response_headers: s,
				return_response_type: function(u) {
					if (u === "json" && !!window.JSON) {
						return true
					}
					return j.can("return_response_type", u)
				},
				return_status_code: s,
				report_upload_progress: t(window.XMLHttpRequest && new XMLHttpRequest().upload),
				resize_image: function() {
					return p.can("access_binary") && j.can("create_canvas")
				},
				select_file: function() {
					return j.can("use_fileinput") && window.File
				},
				select_folder: function() {
					return p.can("select_file") && j.browser === "Chrome" && j.version >= 21
				},
				select_multiple: function() {
					return p.can("select_file") && !(j.browser === "Safari" && j.os === "Windows") && !(j.os === "iOS" && j.verComp(j.osVersion, "7.0.4", "<"))
				},
				send_binary_string: t(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),
				send_custom_headers: t(window.XMLHttpRequest),
				send_multipart: function() {
					return !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || p.can("send_binary_string")
				},
				slice_blob: t(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
				stream_upload: function() {
					return p.can("slice_blob") && p.can("send_multipart")
				},
				summon_file_dialog: t(function() {
					return (j.browser === "Firefox" && j.version >= 4) || (j.browser === "Opera" && j.version >= 12) || (j.browser === "IE" && j.version >= 10) || !!~n.inArray(j.browser, ["Chrome", "Safari"])
				}()),
				upload_filesize: s
			}, arguments[2]);
			k.call(this, q, (arguments[1] || m), r);
			n.extend(this, {
				init: function() {
					this.trigger("Init")
				},
				destroy: (function(u) {
					return function() {
						u.call(p);
						u = p = null
					}
				}(this.destroy))
			});
			n.extend(this.getShim(), l)
		}
		k.addConstructor(m, o);
		return l
	});
	h("moxie/runtime/html5/file/Blob", ["moxie/runtime/html5/Runtime", "moxie/file/Blob"], function(j, k) {
		function i() {
			function l(n, q, m) {
				var o;
				if (window.File.prototype.slice) {
					try {
						n.slice();
						return n.slice(q, m)
					} catch (p) {
						return n.slice(q, m - q)
					}
				} else {
					if ((o = window.File.prototype.webkitSlice || window.File.prototype.mozSlice)) {
						return o.call(n, q, m)
					} else {
						return null
					}
				}
			}
			this.slice = function() {
				return new k(this.getRuntime().uid, l.apply(this, arguments))
			}
		}
		return (j.Blob = i)
	});
	h("moxie/core/utils/Events", ["moxie/core/utils/Basic"], function(o) {
		var p = {},
			l = "moxie_" + o.guid();

		function k() {
			this.returnValue = false
		}

		function j() {
			this.cancelBubble = true
		}
		var m = function(u, q, v, s) {
			var t, r;
			q = q.toLowerCase();
			if (u.addEventListener) {
				t = v;
				u.addEventListener(q, t, false)
			} else {
				if (u.attachEvent) {
					t = function() {
						var w = window.event;
						if (!w.target) {
							w.target = w.srcElement
						}
						w.preventDefault = k;
						w.stopPropagation = j;
						v(w)
					};
					u.attachEvent("on" + q, t)
				}
			}
			if (!u[l]) {
				u[l] = o.guid()
			}
			if (!p.hasOwnProperty(u[l])) {
				p[u[l]] = {}
			}
			r = p[u[l]];
			if (!r.hasOwnProperty(q)) {
				r[q] = []
			}
			r[q].push({
				func: t,
				orig: v,
				key: s
			})
		};
		var n = function(v, q, w) {
			var t, s;
			q = q.toLowerCase();
			if (v[l] && p[v[l]] && p[v[l]][q]) {
				t = p[v[l]][q]
			} else {
				return
			}
			for (var r = t.length - 1; r >= 0; r--) {
				if (t[r].orig === w || t[r].key === w) {
					if (v.removeEventListener) {
						v.removeEventListener(q, t[r].func, false)
					} else {
						if (v.detachEvent) {
							v.detachEvent("on" + q, t[r].func)
						}
					}
					t[r].orig = null;
					t[r].func = null;
					t.splice(r, 1);
					if (w !== s) {
						break
					}
				}
			}
			if (!t.length) {
				delete p[v[l]][q]
			}
			if (o.isEmptyObj(p[v[l]])) {
				delete p[v[l]];
				try {
					delete v[l]
				} catch (u) {
					v[l] = s
				}
			}
		};
		var i = function(r, q) {
			if (!r || !r[l]) {
				return
			}
			o.each(p[r[l]], function(t, s) {
				n(r, s, q)
			})
		};
		return {
			addEvent: m,
			removeEvent: n,
			removeAllEvents: i
		}
	});
	h("moxie/runtime/html5/file/FileInput", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function(m, o, l, j, k, i) {
		function n() {
			var q = [],
				p;
			o.extend(this, {
				init: function(A) {
					var r = this,
						y = r.getRuntime(),
						x, t, u, z, w, v;
					p = A;
					q = [];
					u = p.accept.mimes || k.extList2mimes(p.accept, y.can("filter_by_extension"));
					t = y.getShimContainer();
					t.innerHTML = '<input id="' + y.uid + '" type="file" style="font-size:999px;opacity:0;"' + (p.multiple && y.can("select_multiple") ? "multiple" : "") + (p.directory && y.can("select_folder") ? "webkitdirectory directory" : "") + (u ? ' accept="' + u.join(",") + '"' : "") + " />";
					x = l.get(y.uid);
					o.extend(x.style, {
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%"
					});
					z = l.get(p.browse_button);
					w = parseInt(l.getStyle(z, "z-index"), 10) || 0;
					if (y.can("summon_file_dialog")) {
						if (l.getStyle(z, "position") === "static") {
							z.style.position = "relative"
						}
						t.style.zIndex = w - 1;
						j.addEvent(z, "click", function(C) {
							var B = l.get(y.uid);
							if (B && !B.disabled) {
								B.click()
							}
							C.preventDefault()
						}, r.uid)
					} else {
						t.style.zIndex = w
					}
					v = y.can("summon_file_dialog") ? z : t;
					j.addEvent(v, "mouseover", function() {
						r.trigger("mouseenter")
					}, r.uid);
					j.addEvent(v, "mouseout", function() {
						r.trigger("mouseleave")
					}, r.uid);
					j.addEvent(v, "mousedown", function() {
						r.trigger("mousedown")
					}, r.uid);
					j.addEvent(l.get(p.container), "mouseup", function() {
						r.trigger("mouseup")
					}, r.uid);
					x.onchange = function s() {
						q = [];
						if (p.directory) {
							o.each(this.files, function(C) {
								if (C.name !== ".") {
									q.push(C)
								}
							})
						} else {
							q = [].slice.call(this.files)
						}
						if (i.browser !== "IE" && i.browser !== "IEMobile") {
							this.value = ""
						} else {
							var B = this.cloneNode(true);
							this.parentNode.replaceChild(B, this);
							B.onchange = s
						}
						r.trigger("change")
					};
					r.trigger({
						type: "ready",
						async: true
					});
					t = null
				},
				getFiles: function() {
					return q
				},
				disable: function(t) {
					var s = this.getRuntime(),
						r;
					if ((r = l.get(s.uid))) {
						r.disabled = !!t
					}
				},
				destroy: function() {
					var s = this.getRuntime(),
						t = s.getShim(),
						r = s.getShimContainer();
					j.removeAllEvents(r, this.uid);
					j.removeAllEvents(p && l.get(p.container), this.uid);
					j.removeAllEvents(p && l.get(p.browse_button), this.uid);
					if (r) {
						r.innerHTML = ""
					}
					t.removeInstance(this.uid);
					q = p = r = t = null
				}
			})
		}
		return (m.FileInput = n)
	});
	h("moxie/runtime/html5/file/FileDrop", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime"], function(l, m, k, i, j) {
		function n() {
			var p = [],
				s = [],
				w;
			m.extend(this, {
				init: function(z) {
					var y = this,
						A;
					w = z;
					s = r(w.accept);
					A = w.container;
					i.addEvent(A, "dragover", function(B) {
						if (!q(B)) {
							return
						}
						B.preventDefault();
						B.dataTransfer.dropEffect = "copy"
					}, y.uid);
					i.addEvent(A, "drop", function(B) {
						if (!q(B)) {
							return
						}
						B.preventDefault();
						p = [];
						if (B.dataTransfer.items && B.dataTransfer.items[0].webkitGetAsEntry) {
							v(B.dataTransfer.items, function() {
								y.trigger("drop")
							})
						} else {
							m.each(B.dataTransfer.files, function(C) {
								if (u(C)) {
									p.push(C)
								}
							});
							y.trigger("drop")
						}
					}, y.uid);
					i.addEvent(A, "dragenter", function(B) {
						y.trigger("dragenter")
					}, y.uid);
					i.addEvent(A, "dragleave", function(B) {
						y.trigger("dragleave")
					}, y.uid)
				},
				getFiles: function() {
					return p
				},
				destroy: function() {
					i.removeAllEvents(w && k.get(w.container), this.uid);
					p = s = w = null
				}
			});

			function q(z) {
				if (!z.dataTransfer || !z.dataTransfer.types) {
					return false
				}
				var y = m.toArray(z.dataTransfer.types || []);
				return m.inArray("Files", y) !== -1 || m.inArray("public.file-url", y) !== -1 || m.inArray("application/x-moz-file", y) !== -1
			}

			function r(A) {
				var z = [];
				for (var y = 0; y < A.length; y++) {
					[].push.apply(z, A[y].extensions.split(/\s*,\s*/))
				}
				return m.inArray("*", z) === -1 ? z : []
			}

			function u(y) {
				if (!s.length) {
					return true
				}
				var z = j.getFileExtension(y.name);
				return !z || m.inArray(z, s) !== -1
			}

			function v(A, z) {
				var y = [];
				m.each(A, function(D) {
					var C = D.webkitGetAsEntry();
					if (C) {
						if (C.isFile) {
							var B = D.getAsFile();
							if (u(B)) {
								p.push(B)
							}
						} else {
							y.push(C)
						}
					}
				});
				if (y.length) {
					t(y, z)
				} else {
					z()
				}
			}

			function t(A, z) {
				var y = [];
				m.each(A, function(B) {
					y.push(function(C) {
						o(B, C)
					})
				});
				m.inSeries(y, function() {
					z()
				})
			}

			function o(z, y) {
				if (z.isFile) {
					z.file(function(A) {
						if (u(A)) {
							p.push(A)
						}
						y()
					}, function() {
						y()
					})
				} else {
					if (z.isDirectory) {
						x(z, y)
					} else {
						y()
					}
				}
			}

			function x(C, z) {
				var y = [],
					B = C.createReader();

				function A(D) {
					B.readEntries(function(E) {
						if (E.length) {
							[].push.apply(y, E);
							A(D)
						} else {
							D()
						}
					}, D)
				}
				A(function() {
					t(y, z)
				})
			}
		}
		return (l.FileDrop = n)
	});
	h("moxie/runtime/html5/file/FileReader", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Encode", "moxie/core/utils/Basic"], function(j, i, l) {
		function k() {
			var n, o = false;
			l.extend(this, {
				read: function(r, p) {
					var q = this;
					n = new window.FileReader();
					n.addEventListener("progress", function(s) {
						q.trigger(s)
					});
					n.addEventListener("load", function(s) {
						q.trigger(s)
					});
					n.addEventListener("error", function(s) {
						q.trigger(s, n.error)
					});
					n.addEventListener("loadend", function() {
						n = null
					});
					if (l.typeOf(n[r]) === "function") {
						o = false;
						n[r](p.getSource())
					} else {
						if (r === "readAsBinaryString") {
							o = true;
							n.readAsDataURL(p.getSource())
						}
					}
				},
				getResult: function() {
					return n && n.result ? (o ? m(n.result) : n.result) : null
				},
				abort: function() {
					if (n) {
						n.abort()
					}
				},
				destroy: function() {
					n = null
				}
			});

			function m(p) {
				return i.atob(p.substring(p.indexOf("base64,") + 7))
			}
		}
		return (j.FileReader = k)
	});
	h("moxie/runtime/html5/xhr/XMLHttpRequest", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Mime", "moxie/core/utils/Url", "moxie/file/File", "moxie/file/Blob", "moxie/xhr/FormData", "moxie/core/Exceptions", "moxie/core/utils/Env"], function(o, j, l, i, n, k, r, p, m) {
		function q() {
			var u = this,
				y, w;
			j.extend(this, {
				send: function(G, D) {
					var F = this,
						C = (m.browser === "Mozilla" && m.version >= 4 && m.version < 7),
						z = m.browser === "Android Browser",
						E = false;
					w = G.url.replace(/^.+?\/([\w\-\.]+)$/, "$1").toLowerCase();
					y = x();
					y.open(G.method, G.url, G.async, G.user, G.password);
					if (D instanceof k) {
						if (D.isDetached()) {
							E = true
						}
						D = D.getSource()
					} else {
						if (D instanceof r) {
							if (D.hasBlob()) {
								if (D.getBlob().isDetached()) {
									D = v.call(F, D);
									E = true
								} else {
									if ((C || z) && j.typeOf(D.getBlob().getSource()) === "blob" && window.FileReader) {
										s.call(F, G, D);
										return
									}
								}
							}
							if (D instanceof r) {
								var B = new window.FormData();
								D.each(function(I, H) {
									if (I instanceof k) {
										B.append(H, I.getSource())
									} else {
										B.append(H, I)
									}
								});
								D = B
							}
						}
					}
					if (y.upload) {
						if (G.withCredentials) {
							y.withCredentials = true
						}
						y.addEventListener("load", function(H) {
							F.trigger(H)
						});
						y.addEventListener("error", function(H) {
							F.trigger(H)
						});
						y.addEventListener("progress", function(H) {
							F.trigger(H)
						});
						y.upload.addEventListener("progress", function(H) {
							F.trigger({
								type: "UploadProgress",
								loaded: H.loaded,
								total: H.total
							})
						})
					} else {
						y.onreadystatechange = function A() {
							switch (y.readyState) {
								case 1:
									break;
								case 2:
									break;
								case 3:
									var J, H;
									try {
										if (i.hasSameOrigin(G.url)) {
											J = y.getResponseHeader("Content-Length") || 0
										}
										if (y.responseText) {
											H = y.responseText.length
										}
									} catch (I) {
										J = H = 0
									}
									F.trigger({
										type: "progress",
										lengthComputable: !!J,
										total: parseInt(J, 10),
										loaded: H
									});
									break;
								case 4:
									y.onreadystatechange = function() {};
									if (y.status === 0) {
										F.trigger("error")
									} else {
										F.trigger("load")
									}
									break
							}
						}
					}
					if (!j.isEmptyObj(G.headers)) {
						j.each(G.headers, function(H, I) {
							y.setRequestHeader(I, H)
						})
					}
					if ("" !== G.responseType && "responseType" in y) {
						if ("json" === G.responseType && !m.can("return_response_type", "json")) {
							y.responseType = "text"
						} else {
							y.responseType = G.responseType
						}
					}
					if (!E) {
						y.send(D)
					} else {
						if (y.sendAsBinary) {
							y.sendAsBinary(D)
						} else {
							(function() {
								var H = new Uint8Array(D.length);
								for (var I = 0; I < D.length; I++) {
									H[I] = (D.charCodeAt(I) & 255)
								}
								y.send(H.buffer)
							}())
						}
					}
					F.trigger("loadstart")
				},
				getStatus: function() {
					try {
						if (y) {
							return y.status
						}
					} catch (z) {}
					return 0
				},
				getResponse: function(B) {
					var A = this.getRuntime();
					try {
						switch (B) {
							case "blob":
								var D = new n(A.uid, y.response);
								var E = y.getResponseHeader("Content-Disposition");
								if (E) {
									var z = E.match(/filename=([\'\"'])([^\1]+)\1/);
									if (z) {
										w = z[2]
									}
								}
								D.name = w;
								if (!D.type) {
									D.type = l.getFileMime(w)
								}
								return D;
							case "json":
								if (!m.can("return_response_type", "json")) {
									return y.status === 200 && !!window.JSON ? JSON.parse(y.responseText) : null
								}
								return y.response;
							case "document":
								return t(y);
							default:
								return y.responseText !== "" ? y.responseText : null
						}
					} catch (C) {
						return null
					}
				},
				getAllResponseHeaders: function() {
					try {
						return y.getAllResponseHeaders()
					} catch (z) {}
					return ""
				},
				abort: function() {
					if (y) {
						y.abort()
					}
				},
				destroy: function() {
					u = w = null
				}
			});

			function s(D, B) {
				var C = this,
					A, z;
				A = B.getBlob().getSource();
				z = new window.FileReader();
				z.onload = function() {
					B.append(B.getBlobName(), new k(null, {
						type: A.type,
						data: z.result
					}));
					u.send.call(C, D, B)
				};
				z.readAsBinaryString(A)
			}

			function x() {
				if (window.XMLHttpRequest && !(m.browser === "IE" && m.version < 8)) {
					return new window.XMLHttpRequest()
				} else {
					return (function() {
						var z = ["Msxml2.XMLHTTP.6.0", "Microsoft.XMLHTTP"];
						for (var B = 0; B < z.length; B++) {
							try {
								return new ActiveXObject(z[B])
							} catch (A) {}
						}
					})()
				}
			}

			function t(A) {
				var B = A.responseXML;
				var z = A.responseText;
				if (m.browser === "IE" && z && B && !B.documentElement && /[^\/]+\/[^\+]+\+xml/.test(A.getResponseHeader("Content-Type"))) {
					B = new window.ActiveXObject("Microsoft.XMLDOM");
					B.async = false;
					B.validateOnParse = false;
					B.loadXML(z)
				}
				if (B) {
					if ((m.browser === "IE" && B.parseError !== 0) || !B.documentElement || B.documentElement.tagName === "parsererror") {
						return null
					}
				}
				return B
			}

			function v(B) {
				var E = "----moxieboundary" + new Date().getTime(),
					C = "--",
					D = "\r\n",
					z = "",
					A = this.getRuntime();
				if (!A.can("send_binary_string")) {
					throw new p.RuntimeError(p.RuntimeError.NOT_SUPPORTED_ERR)
				}
				y.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + E);
				B.each(function(G, F) {
					if (G instanceof k) {
						z += C + E + D + 'Content-Disposition: form-data; name="' + F + '"; filename="' + unescape(encodeURIComponent(G.name || "blob")) + '"' + D + "Content-Type: " + (G.type || "application/octet-stream") + D + D + G.getSource() + D
					} else {
						z += C + E + D + 'Content-Disposition: form-data; name="' + F + '"' + D + D + unescape(encodeURIComponent(G)) + D
					}
				});
				z += C + E + C + D;
				return z
			}
		}
		return (o.XMLHttpRequest = q)
	});
	h("moxie/runtime/html5/utils/BinaryReader", [], function() {
		return function() {
			var l = false,
				j;

			function m(o, q) {
				var n = l ? 0 : -8 * (q - 1),
					r = 0,
					p;
				for (p = 0; p < q; p++) {
					r |= (j.charCodeAt(o + p) << Math.abs(n + p * 8))
				}
				return r
			}

			function i(p, n, o) {
				o = arguments.length === 3 ? o : j.length - n - 1;
				j = j.substr(0, n) + p + j.substr(o + n)
			}

			function k(o, p, r) {
				var s = "",
					n = l ? 0 : -8 * (r - 1),
					q;
				for (q = 0; q < r; q++) {
					s += String.fromCharCode((p >> Math.abs(n + q * 8)) & 255)
				}
				i(s, o, r)
			}
			return {
				II: function(n) {
					if (n === g) {
						return l
					} else {
						l = n
					}
				},
				init: function(n) {
					l = false;
					j = n
				},
				SEGMENT: function(n, p, o) {
					switch (arguments.length) {
						case 1:
							return j.substr(n, j.length - n - 1);
						case 2:
							return j.substr(n, p);
						case 3:
							i(o, n, p);
							break;
						default:
							return j
					}
				},
				BYTE: function(n) {
					return m(n, 1)
				},
				SHORT: function(n) {
					return m(n, 2)
				},
				LONG: function(n, o) {
					if (o === g) {
						return m(n, 4)
					} else {
						k(n, o, 4)
					}
				},
				SLONG: function(n) {
					var o = m(n, 4);
					return (o > 2147483647 ? o - 4294967296 : o)
				},
				STRING: function(n, o) {
					var p = "";
					for (o += n; n < o; n++) {
						p += String.fromCharCode(m(n, 1))
					}
					return p
				}
			}
		}
	});
	h("moxie/runtime/html5/image/JPEGHeaders", ["moxie/runtime/html5/utils/BinaryReader"], function(j) {
		return function i(o) {
			var p = [],
				n, k, l, m = 0;
			n = new j();
			n.init(o);
			if (n.SHORT(0) !== 65496) {
				return
			}
			k = 2;
			while (k <= o.length) {
				l = n.SHORT(k);
				if (l >= 65488 && l <= 65495) {
					k += 2;
					continue
				}
				if (l === 65498 || l === 65497) {
					break
				}
				m = n.SHORT(k + 2) + 2;
				if (l >= 65505 && l <= 65519) {
					p.push({
						hex: l,
						name: "APP" + (l & 15),
						start: k,
						length: m,
						segment: n.SEGMENT(k, m)
					})
				}
				k += m
			}
			n.init(null);
			return {
				headers: p,
				restore: function(s) {
					var q, r;
					n.init(s);
					k = n.SHORT(2) == 65504 ? 4 + n.SHORT(4) : 2;
					for (r = 0, q = p.length; r < q; r++) {
						if (p[r].name == "APP2" && p[r].segment.indexOf("ProPhoto RGB") > 0) {
							continue
						} else {
							n.SEGMENT(k, 0, p[r].segment);
							k += p[r].length
						}
					}
					s = n.SEGMENT();
					n.init(null);
					return s
				},
				strip: function(s) {
					var t, q, r;
					q = new i(s);
					t = q.headers;
					q.purge();
					n.init(s);
					r = t.length;
					while (r--) {
						n.SEGMENT(t[r].start, t[r].length, "")
					}
					s = n.SEGMENT();
					n.init(null);
					return s
				},
				get: function(r) {
					var t = [];
					for (var s = 0, q = p.length; s < q; s++) {
						if (p[s].name === r.toUpperCase()) {
							t.push(p[s].segment)
						}
					}
					return t
				},
				set: function(r, u) {
					var v = [],
						s, t, q;
					if (typeof(u) === "string") {
						v.push(u)
					} else {
						v = u
					}
					for (s = t = 0, q = p.length; s < q; s++) {
						if (p[s].name === r.toUpperCase()) {
							p[s].segment = v[t];
							p[s].length = v[t].length;
							t++
						}
						if (t >= v.length) {
							break
						}
					}
				},
				purge: function() {
					p = [];
					n.init(null);
					n = null
				}
			}
		}
	});
	h("moxie/runtime/html5/image/ExifParser", ["moxie/core/utils/Basic", "moxie/runtime/html5/utils/BinaryReader"], function(k, j) {
		return function i() {
			var p, m, l, n = {},
				s;
			p = new j();
			m = {
				tiff: {
					274: "Orientation",
					270: "ImageDescription",
					271: "Make",
					272: "Model",
					305: "Software",
					34665: "ExifIFDPointer",
					34853: "GPSInfoIFDPointer"
				},
				exif: {
					36864: "ExifVersion",
					40961: "ColorSpace",
					40962: "PixelXDimension",
					40963: "PixelYDimension",
					36867: "DateTimeOriginal",
					33434: "ExposureTime",
					33437: "FNumber",
					34855: "ISOSpeedRatings",
					37377: "ShutterSpeedValue",
					37378: "ApertureValue",
					37383: "MeteringMode",
					37384: "LightSource",
					37385: "Flash",
					37386: "FocalLength",
					41986: "ExposureMode",
					41987: "WhiteBalance",
					41990: "SceneCaptureType",
					41988: "DigitalZoomRatio",
					41992: "Contrast",
					41993: "Saturation",
					41994: "Sharpness"
				},
				gps: {
					0: "GPSVersionID",
					1: "GPSLatitudeRef",
					2: "GPSLatitude",
					3: "GPSLongitudeRef",
					4: "GPSLongitude"
				}
			};
			s = {
				ColorSpace: {
					1: "sRGB",
					0: "Uncalibrated"
				},
				MeteringMode: {
					0: "Unknown",
					1: "Average",
					2: "CenterWeightedAverage",
					3: "Spot",
					4: "MultiSpot",
					5: "Pattern",
					6: "Partial",
					255: "Other"
				},
				LightSource: {
					1: "Daylight",
					2: "Fliorescent",
					3: "Tungsten",
					4: "Flash",
					9: "Fine weather",
					10: "Cloudy weather",
					11: "Shade",
					12: "Daylight fluorescent (D 5700 - 7100K)",
					13: "Day white fluorescent (N 4600 -5400K)",
					14: "Cool white fluorescent (W 3900 - 4500K)",
					15: "White fluorescent (WW 3200 - 3700K)",
					17: "Standard light A",
					18: "Standard light B",
					19: "Standard light C",
					20: "D55",
					21: "D65",
					22: "D75",
					23: "D50",
					24: "ISO studio tungsten",
					255: "Other"
				},
				Flash: {
					0: "Flash did not fire.",
					1: "Flash fired.",
					5: "Strobe return light not detected.",
					7: "Strobe return light detected.",
					9: "Flash fired, compulsory flash mode",
					13: "Flash fired, compulsory flash mode, return light not detected",
					15: "Flash fired, compulsory flash mode, return light detected",
					16: "Flash did not fire, compulsory flash mode",
					24: "Flash did not fire, auto mode",
					25: "Flash fired, auto mode",
					29: "Flash fired, auto mode, return light not detected",
					31: "Flash fired, auto mode, return light detected",
					32: "No flash function",
					65: "Flash fired, red-eye reduction mode",
					69: "Flash fired, red-eye reduction mode, return light not detected",
					71: "Flash fired, red-eye reduction mode, return light detected",
					73: "Flash fired, compulsory flash mode, red-eye reduction mode",
					77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
					79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
					89: "Flash fired, auto mode, red-eye reduction mode",
					93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
					95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
				},
				ExposureMode: {
					0: "Auto exposure",
					1: "Manual exposure",
					2: "Auto bracket"
				},
				WhiteBalance: {
					0: "Auto white balance",
					1: "Manual white balance"
				},
				SceneCaptureType: {
					0: "Standard",
					1: "Landscape",
					2: "Portrait",
					3: "Night scene"
				},
				Contrast: {
					0: "Normal",
					1: "Soft",
					2: "Hard"
				},
				Saturation: {
					0: "Normal",
					1: "Low saturation",
					2: "High saturation"
				},
				Sharpness: {
					0: "Normal",
					1: "Soft",
					2: "Hard"
				},
				GPSLatitudeRef: {
					N: "North latitude",
					S: "South latitude"
				},
				GPSLongitudeRef: {
					E: "East longitude",
					W: "West longitude"
				}
			};

			function o(t, B) {
				var v = p.SHORT(t),
					y, E, F, A, z, u, w, C, D = [],
					x = {};
				for (y = 0; y < v; y++) {
					w = u = t + 12 * y + 2;
					F = B[p.SHORT(w)];
					if (F === g) {
						continue
					}
					A = p.SHORT(w += 2);
					z = p.LONG(w += 2);
					w += 4;
					D = [];
					switch (A) {
						case 1:
						case 7:
							if (z > 4) {
								w = p.LONG(w) + n.tiffHeader
							}
							for (E = 0; E < z; E++) {
								D[E] = p.BYTE(w + E)
							}
							break;
						case 2:
							if (z > 4) {
								w = p.LONG(w) + n.tiffHeader
							}
							x[F] = p.STRING(w, z - 1);
							continue;
						case 3:
							if (z > 2) {
								w = p.LONG(w) + n.tiffHeader
							}
							for (E = 0; E < z; E++) {
								D[E] = p.SHORT(w + E * 2)
							}
							break;
						case 4:
							if (z > 1) {
								w = p.LONG(w) + n.tiffHeader
							}
							for (E = 0; E < z; E++) {
								D[E] = p.LONG(w + E * 4)
							}
							break;
						case 5:
							w = p.LONG(w) + n.tiffHeader;
							for (E = 0; E < z; E++) {
								D[E] = p.LONG(w + E * 4) / p.LONG(w + E * 4 + 4)
							}
							break;
						case 9:
							w = p.LONG(w) + n.tiffHeader;
							for (E = 0; E < z; E++) {
								D[E] = p.SLONG(w + E * 4)
							}
							break;
						case 10:
							w = p.LONG(w) + n.tiffHeader;
							for (E = 0; E < z; E++) {
								D[E] = p.SLONG(w + E * 4) / p.SLONG(w + E * 4 + 4)
							}
							break;
						default:
							continue
					}
					C = (z == 1 ? D[0] : D);
					if (s.hasOwnProperty(F) && typeof C != "object") {
						x[F] = s[F][C]
					} else {
						x[F] = C
					}
				}
				return x
			}

			function r() {
				var t = n.tiffHeader;
				p.II(p.SHORT(t) == 18761);
				if (p.SHORT(t += 2) !== 42) {
					return false
				}
				n.IFD0 = n.tiffHeader + p.LONG(t += 2);
				l = o(n.IFD0, m.tiff);
				if ("ExifIFDPointer" in l) {
					n.exifIFD = n.tiffHeader + l.ExifIFDPointer;
					delete l.ExifIFDPointer
				}
				if ("GPSInfoIFDPointer" in l) {
					n.gpsIFD = n.tiffHeader + l.GPSInfoIFDPointer;
					delete l.GPSInfoIFDPointer
				}
				return true
			}

			function q(A, C, z) {
				var x, v, u, t = 0;
				if (typeof(C) === "string") {
					var B = m[A.toLowerCase()];
					for (var w in B) {
						if (B[w] === C) {
							C = w;
							break
						}
					}
				}
				x = n[A.toLowerCase() + "IFD"];
				v = p.SHORT(x);
				for (var y = 0; y < v; y++) {
					u = x + 12 * y + 2;
					if (p.SHORT(u) == C) {
						t = u + 8;
						break
					}
				}
				if (!t) {
					return false
				}
				p.LONG(t, z);
				return true
			}
			return {
				init: function(t) {
					n = {
						tiffHeader: 10
					};
					if (t === g || !t.length) {
						return false
					}
					p.init(t);
					if (p.SHORT(0) === 65505 && p.STRING(4, 5).toUpperCase() === "EXIF\0") {
						return r()
					}
					return false
				},
				TIFF: function() {
					return l
				},
				EXIF: function() {
					var u;
					u = o(n.exifIFD, m.exif);
					if (u.ExifVersion && k.typeOf(u.ExifVersion) === "array") {
						for (var v = 0, t = ""; v < u.ExifVersion.length; v++) {
							t += String.fromCharCode(u.ExifVersion[v])
						}
						u.ExifVersion = t
					}
					return u
				},
				GPS: function() {
					var t;
					t = o(n.gpsIFD, m.gps);
					if (t.GPSVersionID && k.typeOf(t.GPSVersionID) === "array") {
						t.GPSVersionID = t.GPSVersionID.join(".")
					}
					return t
				},
				setExif: function(t, u) {
					if (t !== "PixelXDimension" && t !== "PixelYDimension") {
						return false
					}
					return q("exif", t, u)
				},
				getBinary: function() {
					return p.SEGMENT()
				},
				purge: function() {
					p.init(null);
					p = l = null;
					n = {}
				}
			}
		}
	});
	h("moxie/runtime/html5/image/JPEG", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/html5/image/JPEGHeaders", "moxie/runtime/html5/utils/BinaryReader", "moxie/runtime/html5/image/ExifParser"], function(n, i, k, m, j) {
		function l(w) {
			var p, r, t, s, v, o;

			function u() {
				var x = 0,
					y, z;
				while (x <= p.length) {
					y = r.SHORT(x += 2);
					if (y >= 65472 && y <= 65475) {
						x += 5;
						return {
							height: r.SHORT(x),
							width: r.SHORT(x += 2)
						}
					}
					z = r.SHORT(x += 2);
					x += z - 2
				}
				return null
			}
			p = w;
			r = new m();
			r.init(p);
			if (r.SHORT(0) !== 65496) {
				throw new i.ImageError(i.ImageError.WRONG_FORMAT)
			}
			t = new k(w);
			s = new j();
			o = !!s.init(t.get("app1")[0]);
			v = u.call(this);
			n.extend(this, {
				type: "image/jpeg",
				size: p.length,
				width: v && v.width || 0,
				height: v && v.height || 0,
				setExif: function(x, y) {
					if (!o) {
						return false
					}
					if (n.typeOf(x) === "object") {
						n.each(x, function(A, z) {
							s.setExif(z, A)
						})
					} else {
						s.setExif(x, y)
					}
					t.set("app1", s.getBinary())
				},
				writeHeaders: function() {
					if (!arguments.length) {
						return (p = t.restore(p))
					}
					return t.restore(arguments[0])
				},
				stripHeaders: function(x) {
					return t.strip(x)
				},
				purge: function() {
					q.call(this)
				}
			});
			if (o) {
				this.meta = {
					tiff: s.TIFF(),
					exif: s.EXIF(),
					gps: s.GPS()
				}
			}

			function q() {
				if (!s || !t || !r) {
					return
				}
				s.purge();
				t.purge();
				r.init(null);
				p = v = t = s = r = null
			}
		}
		return l
	});
	h("moxie/runtime/html5/image/PNG", ["moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/runtime/html5/utils/BinaryReader"], function(i, l, k) {
		function j(u) {
			var n, p, r, q, t;
			n = u;
			p = new k();
			p.init(n);
			(function() {
				var v = 0,
					x = 0,
					w = [35152, 20039, 3338, 6666];
				for (x = 0; x < w.length; x++, v += 2) {
					if (w[x] != p.SHORT(v)) {
						throw new i.ImageError(i.ImageError.WRONG_FORMAT)
					}
				}
			}());

			function s() {
				var w, v;
				w = m.call(this, 8);
				if (w.type == "IHDR") {
					v = w.start;
					return {
						width: p.LONG(v),
						height: p.LONG(v += 4)
					}
				}
				return null
			}

			function o() {
				if (!p) {
					return
				}
				p.init(null);
				n = t = r = q = p = null
			}
			t = s.call(this);
			l.extend(this, {
				type: "image/png",
				size: n.length,
				width: t.width,
				height: t.height,
				purge: function() {
					o.call(this)
				}
			});
			o.call(this);

			function m(v) {
				var y, x, z, w;
				y = p.LONG(v);
				x = p.STRING(v += 4, 4);
				z = v += 4;
				w = p.LONG(v + y);
				return {
					length: y,
					type: x,
					start: z,
					CRC: w
				}
			}
		}
		return j
	});
	h("moxie/runtime/html5/image/ImageInfo", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/html5/image/JPEG", "moxie/runtime/html5/image/PNG"], function(l, i, k, j) {
		return function(n) {
			var o = [k, j],
				m;
			m = (function() {
				for (var q = 0; q < o.length; q++) {
					try {
						return new o[q](n)
					} catch (p) {}
				}
				throw new i.ImageError(i.ImageError.WRONG_FORMAT)
			}());
			l.extend(this, {
				type: "",
				size: 0,
				width: 0,
				height: 0,
				setExif: function() {},
				writeHeaders: function(p) {
					return p
				},
				stripHeaders: function(p) {
					return p
				},
				purge: function() {}
			});
			l.extend(this, m);
			this.purge = function() {
				m.purge();
				m = null
			}
		}
	});
	h("moxie/runtime/html5/image/MegaPixel", [], function() {
		function i(I, m, n) {
			var p = I.naturalWidth,
				v = I.naturalHeight;
			var C = n.width,
				z = n.height;
			var r = n.x || 0,
				q = n.y || 0;
			var D = m.getContext("2d");
			if (j(I)) {
				p /= 2;
				v /= 2
			}
			var G = 1024;
			var l = document.createElement("canvas");
			l.width = l.height = G;
			var o = l.getContext("2d");
			var E = k(I, p, v);
			var w = 0;
			while (w < v) {
				var H = w + G > v ? v - w : G;
				var A = 0;
				while (A < p) {
					var B = A + G > p ? p - A : G;
					o.clearRect(0, 0, G, G);
					o.drawImage(I, -A, -w);
					var t = (A * C / p + r) << 0;
					var u = Math.ceil(B * C / p);
					var s = (w * z / v / E + q) << 0;
					var F = Math.ceil(H * z / v / E);
					D.drawImage(l, 0, 0, B, H, t, s, u, F);
					A += G
				}
				w += G
			}
			l = o = null
		}

		function j(n) {
			var m = n.naturalWidth,
				p = n.naturalHeight;
			if (m * p > 1024 * 1024) {
				var o = document.createElement("canvas");
				o.width = o.height = 1;
				var l = o.getContext("2d");
				l.drawImage(n, -m + 1, 0);
				return l.getImageData(0, 0, 1, 1).data[3] === 0
			} else {
				return false
			}
		}

		function k(p, m, u) {
			var l = document.createElement("canvas");
			l.width = 1;
			l.height = u;
			var v = l.getContext("2d");
			v.drawImage(p, 0, 0);
			var o = v.getImageData(0, 0, 1, u).data;
			var s = 0;
			var q = u;
			var t = u;
			while (t > s) {
				var n = o[(t - 1) * 4 + 3];
				if (n === 0) {
					q = t
				} else {
					s = t
				}
				t = (q + s) >> 1
			}
			l = null;
			var r = (t / u);
			return (r === 0) ? 1 : r
		}
		return {
			isSubsampled: j,
			renderTo: i
		}
	});
	h("moxie/runtime/html5/image/Image", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/core/utils/Encode", "moxie/file/File", "moxie/runtime/html5/image/ImageInfo", "moxie/runtime/html5/image/MegaPixel", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function(o, i, p, k, m, r, q, j, l) {
		function n() {
			var C = this,
				B, G, A, w, E, I = false,
				t = true;
			i.extend(this, {
				loadFromBlob: function(L) {
					var K = this,
						N = K.getRuntime(),
						J = arguments.length > 1 ? arguments[1] : true;
					if (!N.can("access_binary")) {
						throw new p.RuntimeError(p.RuntimeError.NOT_SUPPORTED_ERR)
					}
					E = L;
					if (L.isDetached()) {
						w = L.getSource();
						z.call(this, w);
						return
					} else {
						F.call(this, L.getSource(), function(O) {
							if (J) {
								w = H(O)
							}
							z.call(K, O)
						})
					}
				},
				loadFromImage: function(J, K) {
					this.meta = J.meta;
					E = new m(null, {
						name: J.name,
						size: J.size,
						type: J.type
					});
					z.call(this, K ? (w = J.getAsBinaryString()) : J.getAsDataURL())
				},
				getInfo: function() {
					var J = this.getRuntime(),
						K;
					if (!G && w && J.can("access_image_binary")) {
						G = new r(w)
					}
					K = {
						width: x().width || 0,
						height: x().height || 0,
						type: E.type || j.getFileMime(E.name),
						size: w && w.length || E.size || 0,
						name: E.name || "",
						meta: G && G.meta || this.meta || {}
					};
					return K
				},
				downsize: function() {
					s.apply(this, arguments)
				},
				getAsCanvas: function() {
					if (A) {
						A.id = this.uid + "_canvas"
					}
					return A
				},
				getAsBlob: function(J, K) {
					if (J !== this.type) {
						s.call(this, this.width, this.height, false)
					}
					return new m(null, {
						name: E.name || "",
						type: J,
						data: C.getAsBinaryString.call(this, J, K)
					})
				},
				getAsDataURL: function(K) {
					var L = arguments[1] || 90;
					if (!I) {
						return B.src
					}
					if ("image/jpeg" !== K) {
						return A.toDataURL("image/png")
					} else {
						try {
							return A.toDataURL("image/jpeg", L / 100)
						} catch (J) {
							return A.toDataURL("image/jpeg")
						}
					}
				},
				getAsBinaryString: function(K, N) {
					if (!I) {
						if (!w) {
							w = H(C.getAsDataURL(K, N))
						}
						return w
					}
					if ("image/jpeg" !== K) {
						w = H(C.getAsDataURL(K, N))
					} else {
						var L;
						if (!N) {
							N = 90
						}
						try {
							L = A.toDataURL("image/jpeg", N / 100)
						} catch (J) {
							L = A.toDataURL("image/jpeg")
						}
						w = H(L);
						if (G) {
							w = G.stripHeaders(w);
							if (t) {
								if (G.meta && G.meta.exif) {
									G.setExif({
										PixelXDimension: this.width,
										PixelYDimension: this.height
									})
								}
								w = G.writeHeaders(w)
							}
							G.purge();
							G = null
						}
					}
					I = false;
					return w
				},
				destroy: function() {
					C = null;
					u.call(this);
					this.getRuntime().getShim().removeInstance(this.uid)
				}
			});

			function x() {
				if (!A && !B) {
					throw new p.ImageError(p.DOMException.INVALID_STATE_ERR)
				}
				return A || B
			}

			function H(J) {
				return k.atob(J.substring(J.indexOf("base64,") + 7))
			}

			function D(K, J) {
				return "data:" + (J || "") + ";base64," + k.btoa(K)
			}

			function z(K) {
				var J = this;
				B = new Image();
				B.onerror = function() {
					u.call(this);
					J.trigger("error", p.ImageError.WRONG_FORMAT)
				};
				B.onload = function() {
					J.trigger("load")
				};
				B.src = /^data:[^;]*;base64,/.test(K) ? K : D(K, E.type)
			}

			function F(L, N) {
				var K = this,
					J;
				if (window.FileReader) {
					J = new FileReader();
					J.onload = function() {
						N(this.result)
					};
					J.onerror = function() {
						K.trigger("error", p.ImageError.WRONG_FORMAT)
					};
					J.readAsDataURL(L)
				} else {
					return N(L.getAsDataURL())
				}
			}

			function s(K, W, R, T) {
				var X = this,
					O, N, U = 0,
					S = 0,
					Q, V, L, J;
				t = T;
				J = (this.meta && this.meta.tiff && this.meta.tiff.Orientation) || 1;
				if (i.inArray(J, [5, 6, 7, 8]) !== -1) {
					var P = K;
					K = W;
					W = P
				}
				Q = x();
				if (!R) {
					O = Math.min(K / Q.width, W / Q.height)
				} else {
					K = Math.min(K, Q.width);
					W = Math.min(W, Q.height);
					O = Math.max(K / Q.width, W / Q.height)
				}
				if (O > 1 && !R && T) {
					this.trigger("Resize");
					return
				}
				if (!A) {
					A = document.createElement("canvas")
				}
				V = Math.round(Q.width * O);
				L = Math.round(Q.height * O);
				if (R) {
					A.width = K;
					A.height = W;
					if (V > K) {
						U = Math.round((V - K) / 2)
					}
					if (L > W) {
						S = Math.round((L - W) / 2)
					}
				} else {
					A.width = V;
					A.height = L
				}
				if (!t) {
					y(A.width, A.height, J)
				}
				v.call(this, Q, A, -U, -S, V, L);
				this.width = A.width;
				this.height = A.height;
				I = true;
				X.trigger("Resize")
			}

			function v(N, O, J, Q, L, P) {
				if (l.OS === "iOS") {
					q.renderTo(N, O, {
						width: L,
						height: P,
						x: J,
						y: Q
					})
				} else {
					var K = O.getContext("2d");
					K.drawImage(N, J, Q, L, P)
				}
			}

			function y(N, J, L) {
				switch (L) {
					case 5:
					case 6:
					case 7:
					case 8:
						A.width = J;
						A.height = N;
						break;
					default:
						A.width = N;
						A.height = J
				}
				var K = A.getContext("2d");
				switch (L) {
					case 2:
						K.translate(N, 0);
						K.scale(-1, 1);
						break;
					case 3:
						K.translate(N, J);
						K.rotate(Math.PI);
						break;
					case 4:
						K.translate(0, J);
						K.scale(1, -1);
						break;
					case 5:
						K.rotate(0.5 * Math.PI);
						K.scale(1, -1);
						break;
					case 6:
						K.rotate(0.5 * Math.PI);
						K.translate(0, -J);
						break;
					case 7:
						K.rotate(0.5 * Math.PI);
						K.translate(N, -J);
						K.scale(-1, 1);
						break;
					case 8:
						K.rotate(-0.5 * Math.PI);
						K.translate(-N, 0);
						break
				}
			}

			function u() {
				if (G) {
					G.purge();
					G = null
				}
				w = B = A = E = null;
				I = false
			}
		}
		return (o.Image = n)
	});
	h("moxie/runtime/flash/Runtime", ["moxie/core/utils/Basic", "moxie/core/utils/Env", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/runtime/Runtime"], function(j, m, k, p, i) {
		var n = "flash",
			o = {};

		function l() {
			var r;
			try {
				r = navigator.plugins["Shockwave Flash"];
				r = r.description
			} catch (t) {
				try {
					r = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
				} catch (s) {
					r = "0.0"
				}
			}
			r = r.match(/\d+/g);
			return parseFloat(r[0] + "." + r[1])
		}

		function q(s) {
			var r = this,
				t;
			s = j.extend({
				swf_url: m.swf_url
			}, s);
			i.call(this, s, n, {
				access_binary: function(u) {
					return u && r.mode === "browser"
				},
				access_image_binary: function(u) {
					return u && r.mode === "browser"
				},
				display_media: i.capTrue,
				do_cors: i.capTrue,
				drag_and_drop: false,
				report_upload_progress: function() {
					return r.mode === "client"
				},
				resize_image: i.capTrue,
				return_response_headers: false,
				return_response_type: function(u) {
					if (u === "json" && !!window.JSON) {
						return true
					}
					return !j.arrayDiff(u, ["", "text", "document"]) || r.mode === "browser"
				},
				return_status_code: function(u) {
					return r.mode === "browser" || !j.arrayDiff(u, [200, 404])
				},
				select_file: i.capTrue,
				select_multiple: i.capTrue,
				send_binary_string: function(u) {
					return u && r.mode === "browser"
				},
				send_browser_cookies: function(u) {
					return u && r.mode === "browser"
				},
				send_custom_headers: function(u) {
					return u && r.mode === "browser"
				},
				send_multipart: i.capTrue,
				slice_blob: function(u) {
					return u && r.mode === "browser"
				},
				stream_upload: function(u) {
					return u && r.mode === "browser"
				},
				summon_file_dialog: false,
				upload_filesize: function(u) {
					return j.parseSizeStr(u) <= 2097152 || r.mode === "client"
				},
				use_http_method: function(u) {
					return !j.arrayDiff(u, ["GET", "POST"])
				}
			}, {
				access_binary: function(u) {
					return u ? "browser" : "client"
				},
				access_image_binary: function(u) {
					return u ? "browser" : "client"
				},
				report_upload_progress: function(u) {
					return u ? "browser" : "client"
				},
				return_response_type: function(u) {
					return j.arrayDiff(u, ["", "text", "json", "document"]) ? "browser" : ["client", "browser"]
				},
				return_status_code: function(u) {
					return j.arrayDiff(u, [200, 404]) ? "browser" : ["client", "browser"]
				},
				send_binary_string: function(u) {
					return u ? "browser" : "client"
				},
				send_browser_cookies: function(u) {
					return u ? "browser" : "client"
				},
				send_custom_headers: function(u) {
					return u ? "browser" : "client"
				},
				stream_upload: function(u) {
					return u ? "client" : "browser"
				},
				upload_filesize: function(u) {
					return j.parseSizeStr(u) >= 2097152 ? "client" : "browser"
				}
			}, "client");
			if (l() < 10) {
				this.mode = false
			}
			j.extend(this, {
				getShim: function() {
					return k.get(this.uid)
				},
				shimExec: function(v, w) {
					var u = [].slice.call(arguments, 2);
					return r.getShim().exec(this.uid, v, w, u)
				},
				init: function() {
					var v, w, u;
					u = this.getShimContainer();
					j.extend(u.style, {
						position: "absolute",
						top: "-8px",
						left: "-8px",
						width: "9px",
						height: "9px",
						overflow: "hidden"
					});
					v = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' + s.swf_url + '" ';
					if (m.browser === "IE") {
						v += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '
					}
					v += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + s.swf_url + '" /><param name="flashvars" value="uid=' + escape(this.uid) + "&target=" + m.global_event_dispatcher + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';
					if (m.browser === "IE") {
						w = document.createElement("div");
						u.appendChild(w);
						w.outerHTML = v;
						w = u = null
					} else {
						u.innerHTML = v
					}
					t = setTimeout(function() {
						if (r && !r.initialized) {
							r.trigger("Error", new p.RuntimeError(p.RuntimeError.NOT_INIT_ERR))
						}
					}, 5000)
				},
				destroy: (function(u) {
					return function() {
						u.call(r);
						clearTimeout(t);
						s = t = u = r = null
					}
				}(this.destroy))
			}, o)
		}
		i.addConstructor(n, q);
		return o
	});
	h("moxie/runtime/flash/file/Blob", ["moxie/runtime/flash/Runtime", "moxie/file/Blob"], function(j, k) {
		var i = {
			slice: function(n, p, l, o) {
				var m = this.getRuntime();
				if (p < 0) {
					p = Math.max(n.size + p, 0)
				} else {
					if (p > 0) {
						p = Math.min(p, n.size)
					}
				}
				if (l < 0) {
					l = Math.max(n.size + l, 0)
				} else {
					if (l > 0) {
						l = Math.min(l, n.size)
					}
				}
				n = m.shimExec.call(this, "Blob", "slice", p, l, o || "");
				if (n) {
					n = new k(m.uid, n)
				}
				return n
			}
		};
		return (j.Blob = i)
	});
	h("moxie/runtime/flash/file/FileInput", ["moxie/runtime/flash/Runtime"], function(i) {
		var j = {
			init: function(k) {
				this.getRuntime().shimExec.call(this, "FileInput", "init", {
					name: k.name,
					accept: k.accept,
					multiple: k.multiple
				});
				this.trigger("ready")
			}
		};
		return (i.FileInput = j)
	});
	h("moxie/runtime/flash/file/FileReader", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Encode"], function(l, i) {
		var j = "";

		function k(n, o) {
			switch (o) {
				case "readAsText":
					return i.atob(n, "utf8");
				case "readAsBinaryString":
					return i.atob(n);
				case "readAsDataURL":
					return n
			}
			return null
		}
		var m = {
			read: function(q, o) {
				var p = this,
					n = p.getRuntime();
				if (q === "readAsDataURL") {
					j = "data:" + (o.type || "") + ";base64,"
				}
				p.bind("Progress", function(s, r) {
					if (r) {
						j += k(r, q)
					}
				});
				return n.shimExec.call(this, "FileReader", "readAsBase64", o.uid)
			},
			getResult: function() {
				return j
			},
			destroy: function() {
				j = null
			}
		};
		return (l.FileReader = m)
	});
	h("moxie/runtime/flash/file/FileReaderSync", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Encode"], function(k, i) {
		function j(m, n) {
			switch (n) {
				case "readAsText":
					return i.atob(m, "utf8");
				case "readAsBinaryString":
					return i.atob(m);
				case "readAsDataURL":
					return m
			}
			return null
		}
		var l = {
			read: function(p, o) {
				var m, n = this.getRuntime();
				m = n.shimExec.call(this, "FileReaderSync", "readAsBase64", o.uid);
				if (!m) {
					return null
				}
				if (p === "readAsDataURL") {
					m = "data:" + (o.type || "") + ";base64," + m
				}
				return j(m, p, o.type)
			}
		};
		return (k.FileReaderSync = l)
	});
	h("moxie/runtime/flash/xhr/XMLHttpRequest", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Basic", "moxie/file/Blob", "moxie/file/File", "moxie/file/FileReaderSync", "moxie/xhr/FormData", "moxie/runtime/Transporter"], function(j, m, p, i, o, n, l) {
		var k = {
			send: function(x, s) {
				var u = this,
					y = u.getRuntime();

				function r() {
					x.transport = y.mode;
					y.shimExec.call(u, "XMLHttpRequest", "send", x, s)
				}

				function t(A, z) {
					y.shimExec.call(u, "XMLHttpRequest", "appendBlob", A, z.uid);
					s = null;
					r()
				}

				function v(A, z) {
					var B = new l();
					B.bind("TransportingComplete", function() {
						z(this.result)
					});
					B.transport(A.getSource(), A.type, {
						ruid: y.uid
					})
				}
				if (!m.isEmptyObj(x.headers)) {
					m.each(x.headers, function(z, A) {
						y.shimExec.call(u, "XMLHttpRequest", "setRequestHeader", A, z.toString())
					})
				}
				if (s instanceof n) {
					var w;
					s.each(function(A, z) {
						if (A instanceof p) {
							w = z
						} else {
							y.shimExec.call(u, "XMLHttpRequest", "append", z, A)
						}
					});
					if (!s.hasBlob()) {
						s = null;
						r()
					} else {
						var q = s.getBlob();
						if (q.isDetached()) {
							v(q, function(z) {
								q.destroy();
								t(w, z)
							})
						} else {
							t(w, q)
						}
					}
				} else {
					if (s instanceof p) {
						if (s.isDetached()) {
							v(s, function(z) {
								s.destroy();
								s = z.uid;
								r()
							})
						} else {
							s = s.uid;
							r()
						}
					} else {
						r()
					}
				}
			},
			getResponse: function(t) {
				var q, s, r = this.getRuntime();
				s = r.shimExec.call(this, "XMLHttpRequest", "getResponseAsBlob");
				if (s) {
					s = new i(r.uid, s);
					if ("blob" === t) {
						return s
					}
					try {
						q = new o();
						if (!!~m.inArray(t, ["", "text"])) {
							return q.readAsText(s)
						} else {
							if ("json" === t && !!window.JSON) {
								return JSON.parse(q.readAsText(s))
							}
						}
					} finally {
						s.destroy()
					}
				}
				return null
			},
			abort: function(r) {
				var q = this.getRuntime();
				q.shimExec.call(this, "XMLHttpRequest", "abort");
				this.dispatchEvent("readystatechange");
				this.dispatchEvent("abort")
			}
		};
		return (j.XMLHttpRequest = k)
	});
	h("moxie/runtime/flash/runtime/Transporter", ["moxie/runtime/flash/Runtime", "moxie/file/Blob"], function(i, k) {
		var j = {
			getAsBlob: function(n) {
				var m = this.getRuntime(),
					l = m.shimExec.call(this, "Transporter", "getAsBlob", n);
				if (l) {
					return new k(m.uid, l)
				}
				return null
			}
		};
		return (i.Transporter = j)
	});
	h("moxie/runtime/flash/image/Image", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Basic", "moxie/runtime/Transporter", "moxie/file/Blob", "moxie/file/FileReaderSync"], function(j, l, k, n, m) {
		var i = {
			loadFromBlob: function(r) {
				var q = this,
					p = q.getRuntime();

				function o(t) {
					p.shimExec.call(q, "Image", "loadFromBlob", t.uid);
					q = p = null
				}
				if (r.isDetached()) {
					var s = new k();
					s.bind("TransportingComplete", function() {
						o(s.result.getSource())
					});
					s.transport(r.getSource(), r.type, {
						ruid: p.uid
					})
				} else {
					o(r.getSource())
				}
			},
			loadFromImage: function(p) {
				var o = this.getRuntime();
				return o.shimExec.call(this, "Image", "loadFromImage", p.uid)
			},
			getAsBlob: function(q, r) {
				var p = this.getRuntime(),
					o = p.shimExec.call(this, "Image", "getAsBlob", q, r);
				if (o) {
					return new n(p.uid, o)
				}
				return null
			},
			getAsDataURL: function() {
				var q = this.getRuntime(),
					p = q.Image.getAsBlob.apply(this, arguments),
					o;
				if (!p) {
					return null
				}
				o = new m();
				return o.readAsDataURL(p)
			}
		};
		return (j.Image = i)
	});
	h("moxie/runtime/silverlight/Runtime", ["moxie/core/utils/Basic", "moxie/core/utils/Env", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/runtime/Runtime"], function(j, m, l, p, i) {
		var n = "silverlight",
			o = {};

		function q(z) {
			var C = false,
				v = null,
				r, s, t, B, u, x = 0;
			try {
				try {
					v = new ActiveXObject("AgControl.AgControl");
					if (v.IsVersionSupported(z)) {
						C = true
					}
					v = null
				} catch (y) {
					var w = navigator.plugins["Silverlight Plug-In"];
					if (w) {
						r = w.description;
						if (r === "1.0.30226.2") {
							r = "2.0.30226.2"
						}
						s = r.split(".");
						while (s.length > 3) {
							s.pop()
						}
						while (s.length < 4) {
							s.push(0)
						}
						t = z.split(".");
						while (t.length > 4) {
							t.pop()
						}
						do {
							B = parseInt(t[x], 10);
							u = parseInt(s[x], 10);
							x++
						} while (x < t.length && B === u);
						if (B <= u && !isNaN(B)) {
							C = true
						}
					}
				}
			} catch (A) {
				C = false
			}
			return C
		}

		function k(s) {
			var r = this,
				t;
			s = j.extend({
				xap_url: m.xap_url
			}, s);
			i.call(this, s, n, {
				access_binary: i.capTrue,
				access_image_binary: i.capTrue,
				display_media: i.capTrue,
				do_cors: i.capTrue,
				drag_and_drop: false,
				report_upload_progress: i.capTrue,
				resize_image: i.capTrue,
				return_response_headers: function(u) {
					return u && r.mode === "client"
				},
				return_response_type: function(u) {
					if (u !== "json") {
						return true
					} else {
						return !!window.JSON
					}
				},
				return_status_code: function(u) {
					return r.mode === "client" || !j.arrayDiff(u, [200, 404])
				},
				select_file: i.capTrue,
				select_multiple: i.capTrue,
				send_binary_string: i.capTrue,
				send_browser_cookies: function(u) {
					return u && r.mode === "browser"
				},
				send_custom_headers: function(u) {
					return u && r.mode === "client"
				},
				send_multipart: i.capTrue,
				slice_blob: i.capTrue,
				stream_upload: true,
				summon_file_dialog: false,
				upload_filesize: i.capTrue,
				use_http_method: function(u) {
					return r.mode === "client" || !j.arrayDiff(u, ["GET", "POST"])
				}
			}, {
				return_response_headers: function(u) {
					return u ? "client" : "browser"
				},
				return_status_code: function(u) {
					return j.arrayDiff(u, [200, 404]) ? "client" : ["client", "browser"]
				},
				send_browser_cookies: function(u) {
					return u ? "browser" : "client"
				},
				send_custom_headers: function(u) {
					return u ? "client" : "browser"
				},
				use_http_method: function(u) {
					return j.arrayDiff(u, ["GET", "POST"]) ? "client" : ["client", "browser"]
				}
			});
			if (!q("2.0.31005.0") || m.browser === "Opera") {
				this.mode = false
			}
			j.extend(this, {
				getShim: function() {
					return l.get(this.uid).content.Moxie
				},
				shimExec: function(v, w) {
					var u = [].slice.call(arguments, 2);
					return r.getShim().exec(this.uid, v, w, u)
				},
				init: function() {
					var u;
					u = this.getShimContainer();
					u.innerHTML = '<object id="' + this.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;"><param name="source" value="' + s.xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="uid=' + this.uid + ",target=" + m.global_event_dispatcher + '"/></object>';
					t = setTimeout(function() {
						if (r && !r.initialized) {
							r.trigger("Error", new p.RuntimeError(p.RuntimeError.NOT_INIT_ERR))
						}
					}, m.OS !== "Windows" ? 10000 : 5000)
				},
				destroy: (function(u) {
					return function() {
						u.call(r);
						clearTimeout(t);
						s = t = u = r = null
					}
				}(this.destroy))
			}, o)
		}
		i.addConstructor(n, k);
		return o
	});
	h("moxie/runtime/silverlight/file/Blob", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/Blob"], function(i, j, k) {
		return (i.Blob = j.extend({}, k))
	});
	h("moxie/runtime/silverlight/file/FileInput", ["moxie/runtime/silverlight/Runtime"], function(i) {
		var j = {
			init: function(l) {
				function k(n) {
					var o = "";
					for (var m = 0; m < n.length; m++) {
						o += (o !== "" ? "|" : "") + n[m].title + " | *." + n[m].extensions.replace(/,/g, ";*.")
					}
					return o
				}
				this.getRuntime().shimExec.call(this, "FileInput", "init", k(l.accept), l.name, l.multiple);
				this.trigger("ready")
			}
		};
		return (i.FileInput = j)
	});
	h("moxie/runtime/silverlight/file/FileDrop", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Dom", "moxie/core/utils/Events"], function(k, j, i) {
		var l = {
			init: function() {
				var n = this,
					m = n.getRuntime(),
					o;
				o = m.getShimContainer();
				i.addEvent(o, "dragover", function(p) {
					p.preventDefault();
					p.stopPropagation();
					p.dataTransfer.dropEffect = "copy"
				}, n.uid);
				i.addEvent(o, "dragenter", function(q) {
					q.preventDefault();
					var p = j.get(m.uid).dragEnter(q);
					if (p) {
						q.stopPropagation()
					}
				}, n.uid);
				i.addEvent(o, "drop", function(q) {
					q.preventDefault();
					var p = j.get(m.uid).dragDrop(q);
					if (p) {
						q.stopPropagation()
					}
				}, n.uid);
				return m.shimExec.call(this, "FileDrop", "init")
			}
		};
		return (k.FileDrop = l)
	});
	h("moxie/runtime/silverlight/file/FileReader", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/FileReader"], function(i, k, j) {
		return (i.FileReader = k.extend({}, j))
	});
	h("moxie/runtime/silverlight/file/FileReaderSync", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/FileReaderSync"], function(i, j, k) {
		return (i.FileReaderSync = j.extend({}, k))
	});
	h("moxie/runtime/silverlight/xhr/XMLHttpRequest", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/xhr/XMLHttpRequest"], function(i, k, j) {
		return (i.XMLHttpRequest = k.extend({}, j))
	});
	h("moxie/runtime/silverlight/runtime/Transporter", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/runtime/Transporter"], function(i, k, j) {
		return (i.Transporter = k.extend({}, j))
	});
	h("moxie/runtime/silverlight/image/Image", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/image/Image"], function(j, k, i) {
		return (j.Image = k.extend({}, i, {
			getInfo: function() {
				var m = this.getRuntime(),
					n = ["tiff", "exif", "gps"],
					o = {
						meta: {}
					},
					l = m.shimExec.call(this, "Image", "getInfo");
				if (l.meta) {
					k.each(n, function(q) {
						var u = l.meta[q],
							p, r, s, t;
						if (u && u.keys) {
							o.meta[q] = {};
							for (r = 0, s = u.keys.length; r < s; r++) {
								p = u.keys[r];
								t = u[p];
								if (t) {
									if (/^(\d|[1-9]\d+)$/.test(t)) {
										t = parseInt(t, 10)
									} else {
										if (/^\d*\.\d+$/.test(t)) {
											t = parseFloat(t)
										}
									}
									o.meta[q][p] = t
								}
							}
						}
					})
				}
				o.width = parseInt(l.width, 10);
				o.height = parseInt(l.height, 10);
				o.size = parseInt(l.size, 10);
				o.type = l.type;
				o.name = l.name;
				return o
			}
		}))
	});
	h("moxie/runtime/html4/Runtime", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/Runtime", "moxie/core/utils/Env"], function(o, i, l, k) {
		var n = "html4",
			m = {};

		function j(q) {
			var p = this,
				s = l.capTest,
				r = l.capTrue;
			l.call(this, q, n, {
				access_binary: s(window.FileReader || window.File && File.getAsDataURL),
				access_image_binary: false,
				display_media: s(m.Image && (k.can("create_canvas") || k.can("use_data_uri_over32kb"))),
				do_cors: false,
				drag_and_drop: false,
				filter_by_extension: s(function() {
					return (k.browser === "Chrome" && k.version >= 28) || (k.browser === "IE" && k.version >= 10)
				}()),
				resize_image: function() {
					return m.Image && p.can("access_binary") && k.can("create_canvas")
				},
				report_upload_progress: false,
				return_response_headers: false,
				return_response_type: function(t) {
					if (t === "json" && !!window.JSON) {
						return true
					}
					return !!~o.inArray(t, ["text", "document", ""])
				},
				return_status_code: function(t) {
					return !o.arrayDiff(t, [200, 404])
				},
				select_file: function() {
					return k.can("use_fileinput")
				},
				select_multiple: false,
				send_binary_string: false,
				send_custom_headers: false,
				send_multipart: true,
				slice_blob: false,
				stream_upload: function() {
					return p.can("select_file")
				},
				summon_file_dialog: s(function() {
					return (k.browser === "Firefox" && k.version >= 4) || (k.browser === "Opera" && k.version >= 12) || !!~o.inArray(k.browser, ["Chrome", "Safari"])
				}()),
				upload_filesize: r,
				use_http_method: function(t) {
					return !o.arrayDiff(t, ["GET", "POST"])
				}
			});
			o.extend(this, {
				init: function() {
					this.trigger("Init")
				},
				destroy: (function(t) {
					return function() {
						t.call(p);
						t = p = null
					}
				}(this.destroy))
			});
			o.extend(this.getShim(), m)
		}
		l.addConstructor(n, j);
		return m
	});
	h("moxie/runtime/html4/file/FileInput", ["moxie/runtime/html4/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function(m, o, l, j, k, i) {
		function n() {
			var s, q = [],
				t = [],
				p;

			function r() {
				var w = this,
					z = w.getRuntime(),
					y, x, u, B, v, A;
				A = o.guid("uid_");
				y = z.getShimContainer();
				if (s) {
					u = l.get(s + "_form");
					if (u) {
						o.extend(u.style, {
							top: "100%"
						})
					}
				}
				B = document.createElement("form");
				B.setAttribute("id", A + "_form");
				B.setAttribute("method", "post");
				B.setAttribute("enctype", "multipart/form-data");
				B.setAttribute("encoding", "multipart/form-data");
				o.extend(B.style, {
					overflow: "hidden",
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%"
				});
				v = document.createElement("input");
				v.setAttribute("id", A);
				v.setAttribute("type", "file");
				v.setAttribute("name", p.name || "Filedata");
				v.setAttribute("accept", t.join(","));
				o.extend(v.style, {
					fontSize: "999px",
					opacity: 0
				});
				B.appendChild(v);
				y.appendChild(B);
				o.extend(v.style, {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%"
				});
				if (i.browser === "IE" && i.version < 10) {
					o.extend(v.style, {
						filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"
					})
				}
				v.onchange = function() {
					var D;
					if (!this.value) {
						return
					}
					if (this.files) {
						D = this.files[0]
					} else {
						D = {
							name: this.value
						}
					}
					q = [D];
					this.onchange = function() {};
					r.call(w);
					w.bind("change", function C() {
						var E = l.get(A),
							G = l.get(A + "_form"),
							F;
						w.unbind("change", C);
						if (w.files.length && E && G) {
							F = w.files[0];
							E.setAttribute("id", F.uid);
							G.setAttribute("id", F.uid + "_form");
							G.setAttribute("target", F.uid + "_iframe")
						}
						E = G = null
					}, 998);
					v = B = null;
					w.trigger("change")
				};
				if (z.can("summon_file_dialog")) {
					x = l.get(p.browse_button);
					j.removeEvent(x, "click", w.uid);
					j.addEvent(x, "click", function(C) {
						if (v && !v.disabled) {
							v.click()
						}
						C.preventDefault()
					}, w.uid)
				}
				s = A;
				y = u = x = null
			}
			o.extend(this, {
				init: function(x) {
					var u = this,
						w = u.getRuntime(),
						v;
					p = x;
					t = x.accept.mimes || k.extList2mimes(x.accept, w.can("filter_by_extension"));
					v = w.getShimContainer();
					(function() {
						var y, A, z;
						y = l.get(x.browse_button);
						A = parseInt(l.getStyle(y, "z-index"), 10) || 0;
						if (w.can("summon_file_dialog")) {
							if (l.getStyle(y, "position") === "static") {
								y.style.position = "relative"
							}
							v.style.zIndex = A - 1
						} else {
							v.style.zIndex = A
						}
						z = w.can("summon_file_dialog") ? y : v;
						j.addEvent(z, "mouseover", function() {
							u.trigger("mouseenter")
						}, u.uid);
						j.addEvent(z, "mouseout", function() {
							u.trigger("mouseleave")
						}, u.uid);
						j.addEvent(z, "mousedown", function() {
							u.trigger("mousedown")
						}, u.uid);
						j.addEvent(l.get(x.container), "mouseup", function() {
							u.trigger("mouseup")
						}, u.uid);
						y = null
					}());
					r.call(this);
					v = null;
					u.trigger({
						type: "ready",
						async: true
					})
				},
				getFiles: function() {
					return q
				},
				disable: function(v) {
					var u;
					if ((u = l.get(s))) {
						u.disabled = !!v
					}
				},
				destroy: function() {
					var v = this.getRuntime(),
						w = v.getShim(),
						u = v.getShimContainer();
					j.removeAllEvents(u, this.uid);
					j.removeAllEvents(p && l.get(p.container), this.uid);
					j.removeAllEvents(p && l.get(p.browse_button), this.uid);
					if (u) {
						u.innerHTML = ""
					}
					w.removeInstance(this.uid);
					s = q = t = p = u = w = null
				}
			})
		}
		return (m.FileInput = n)
	});
	h("moxie/runtime/html4/file/FileReader", ["moxie/runtime/html4/Runtime", "moxie/runtime/html5/file/FileReader"], function(i, j) {
		return (i.FileReader = j)
	});
	h("moxie/runtime/html4/xhr/XMLHttpRequest", ["moxie/runtime/html4/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Url", "moxie/core/Exceptions", "moxie/core/utils/Events", "moxie/file/Blob", "moxie/xhr/FormData"], function(m, j, l, i, n, p, k, q) {
		function o() {
			var t, r, u;

			function s(v) {
				var A = this,
					y, z, w, x, B = false;
				if (!u) {
					return
				}
				y = u.id.replace(/_iframe$/, "");
				z = l.get(y + "_form");
				if (z) {
					w = z.getElementsByTagName("input");
					x = w.length;
					while (x--) {
						switch (w[x].getAttribute("type")) {
							case "hidden":
								w[x].parentNode.removeChild(w[x]);
								break;
							case "file":
								B = true;
								break
						}
					}
					w = [];
					if (!B) {
						z.parentNode.removeChild(z)
					}
					z = null
				}
				setTimeout(function() {
					p.removeEvent(u, "load", A.uid);
					if (u.parentNode) {
						u.parentNode.removeChild(u)
					}
					var C = A.getRuntime().getShimContainer();
					if (!C.children.length) {
						C.parentNode.removeChild(C)
					}
					C = u = null;
					v()
				}, 1)
			}
			j.extend(this, {
				send: function(D, x) {
					var z = this,
						C = z.getRuntime(),
						y, w, B, v;
					t = r = null;

					function A() {
						var E = C.getShimContainer() || document.body,
							F = document.createElement("div");
						F.innerHTML = '<iframe id="' + y + '_iframe" name="' + y + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
						u = F.firstChild;
						E.appendChild(u);
						p.addEvent(u, "load", function() {
							var H;
							try {
								H = u.contentWindow.document || u.contentDocument || window.frames[u.id].document;
								if (/^4(0[0-9]|1[0-7]|2[2346])\s/.test(H.title)) {
									t = H.title.replace(/^(\d+).*$/, "$1")
								} else {
									t = 200;
									r = j.trim(H.body.innerHTML);
									z.trigger({
										type: "progress",
										loaded: r.length,
										total: r.length
									});
									if (v) {
										z.trigger({
											type: "uploadprogress",
											loaded: v.size || 1025,
											total: v.size || 1025
										})
									}
								}
							} catch (G) {
								if (i.hasSameOrigin(D.url)) {
									t = 404
								} else {
									s.call(z, function() {
										z.trigger("error")
									});
									return
								}
							}
							s.call(z, function() {
								z.trigger("load")
							})
						}, z.uid)
					}
					if (x instanceof q && x.hasBlob()) {
						v = x.getBlob();
						y = v.uid;
						B = l.get(y);
						w = l.get(y + "_form");
						if (!w) {
							throw new n.DOMException(n.DOMException.NOT_FOUND_ERR)
						}
					} else {
						y = j.guid("uid_");
						w = document.createElement("form");
						w.setAttribute("id", y + "_form");
						w.setAttribute("method", D.method);
						w.setAttribute("enctype", "multipart/form-data");
						w.setAttribute("encoding", "multipart/form-data");
						w.setAttribute("target", y + "_iframe");
						C.getShimContainer().appendChild(w)
					}
					if (x instanceof q) {
						x.each(function(G, E) {
							if (G instanceof k) {
								if (B) {
									B.setAttribute("name", E)
								}
							} else {
								var F = document.createElement("input");
								j.extend(F, {
									type: "hidden",
									name: E,
									value: G
								});
								if (B) {
									w.insertBefore(F, B)
								} else {
									w.appendChild(F)
								}
							}
						})
					}
					w.setAttribute("action", D.url);
					A();
					w.submit();
					z.trigger("loadstart")
				},
				getStatus: function() {
					return t
				},
				getResponse: function(v) {
					if ("json" === v) {
						if (j.typeOf(r) === "string" && !!window.JSON) {
							try {
								return JSON.parse(r.replace(/^\s*<pre[^>]*>/, "").replace(/<\/pre>\s*$/, ""))
							} catch (w) {
								return null
							}
						}
					} else {
						if ("document" === v) {}
					}
					return r
				},
				abort: function() {
					var v = this;
					if (u && u.contentWindow) {
						if (u.contentWindow.stop) {
							u.contentWindow.stop()
						} else {
							if (u.contentWindow.document.execCommand) {
								u.contentWindow.document.execCommand("Stop")
							} else {
								u.src = "about:blank"
							}
						}
					}
					s.call(this, function() {
						v.dispatchEvent("abort")
					})
				}
			})
		}
		return (m.XMLHttpRequest = o)
	});
	h("moxie/runtime/html4/image/Image", ["moxie/runtime/html4/Runtime", "moxie/runtime/html5/image/Image"], function(j, i) {
		return (j.Image = i)
	});
	a(["moxie/core/utils/Basic", "moxie/core/I18n", "moxie/core/utils/Mime", "moxie/core/utils/Env", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/core/EventTarget", "moxie/core/utils/Encode", "moxie/runtime/Runtime", "moxie/runtime/RuntimeClient", "moxie/file/Blob", "moxie/file/File", "moxie/file/FileInput", "moxie/file/FileDrop", "moxie/runtime/RuntimeTarget", "moxie/file/FileReader", "moxie/core/utils/Url", "moxie/file/FileReaderSync", "moxie/xhr/FormData", "moxie/xhr/XMLHttpRequest", "moxie/runtime/Transporter", "moxie/image/Image", "moxie/core/utils/Events"])
})(this);
(function(a) {
	var d = {},
		c = a.moxie.core.utils.Basic.inArray;
	(function b(f) {
		var e, g;
		for (e in f) {
			g = typeof(f[e]);
			if (g === "object" && !~c(e, ["Exceptions", "Env", "Mime"])) {
				b(f[e])
			} else {
				if (g === "function") {
					d[e] = f[e]
				}
			}
		}
	})(a.moxie);
	d.Env = a.moxie.core.utils.Env;
	d.Mime = a.moxie.core.utils.Mime;
	d.Exceptions = a.moxie.core.Exceptions;
	a.mOxie = d;
	if (!a.o) {
		a.o = d
	}
	return d
})(this);
(function(f, h, e) {
	var d = f.setTimeout,
		g = {};

	function a(j) {
		var i = j.required_features,
			k = {};

		function l(n, o, m) {
			var p = {
				chunks: "slice_blob",
				jpgresize: "send_binary_string",
				pngresize: "send_binary_string",
				progress: "report_upload_progress",
				multi_selection: "select_multiple",
				dragdrop: "drag_and_drop",
				drop_element: "drag_and_drop",
				headers: "send_custom_headers",
				urlstream_upload: "send_binary_string",
				canSendBinary: "send_binary",
				triggerDialog: "summon_file_dialog"
			};
			if (p[n]) {
				k[p[n]] = o
			} else {
				if (!m) {
					k[n] = o
				}
			}
		}
		if (typeof(i) === "string") {
			c.each(i.split(/\s*,\s*/), function(m) {
				l(m, true)
			})
		} else {
			if (typeof(i) === "object") {
				c.each(i, function(n, m) {
					l(m, n)
				})
			} else {
				if (i === true) {
					if (j.chunk_size > 0) {
						k.slice_blob = true
					}
					if (j.resize.enabled || !j.multipart) {
						k.send_binary_string = true
					}
					c.each(j, function(n, m) {
						l(m, !!n, true)
					})
				}
			}
		}
		return k
	}
	var c = {
		VERSION: "2.1.2",
		STOPPED: 1,
		STARTED: 2,
		QUEUED: 1,
		UPLOADING: 2,
		FAILED: 4,
		DONE: 5,
		GENERIC_ERROR: -100,
		HTTP_ERROR: -200,
		IO_ERROR: -300,
		SECURITY_ERROR: -400,
		INIT_ERROR: -500,
		FILE_SIZE_ERROR: -600,
		FILE_EXTENSION_ERROR: -601,
		FILE_DUPLICATE_ERROR: -602,
		IMAGE_FORMAT_ERROR: -700,
		MEMORY_ERROR: -701,
		IMAGE_DIMENSIONS_ERROR: -702,
		mimeTypes: h.mimes,
		ua: h.ua,
		typeOf: h.typeOf,
		extend: h.extend,
		guid: h.guid,
		get: function b(m) {
			var k = [],
				l;
			if (h.typeOf(m) !== "array") {
				m = [m]
			}
			var j = m.length;
			while (j--) {
				l = h.get(m[j]);
				if (l) {
					k.push(l)
				}
			}
			return k.length ? k : null
		},
		each: h.each,
		getPos: h.getPos,
		getSize: h.getSize,
		xmlEncode: function(j) {
			var k = {
					"<": "lt",
					">": "gt",
					"&": "amp",
					'"': "quot",
					"'": "#39"
				},
				i = /[<>&\"\']/g;
			return j ? ("" + j).replace(i, function(l) {
				return k[l] ? "&" + k[l] + ";" : l
			}) : j
		},
		toArray: h.toArray,
		inArray: h.inArray,
		addI18n: h.addI18n,
		translate: h.translate,
		isEmptyObj: h.isEmptyObj,
		hasClass: h.hasClass,
		addClass: h.addClass,
		removeClass: h.removeClass,
		getStyle: h.getStyle,
		addEvent: h.addEvent,
		removeEvent: h.removeEvent,
		removeAllEvents: h.removeAllEvents,
		cleanName: function(j) {
			var k, l;
			l = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
			for (k = 0; k < l.length; k += 2) {
				j = j.replace(l[k], l[k + 1])
			}
			j = j.replace(/\s+/g, "_");
			j = j.replace(/[^a-z0-9_\-\.]+/gi, "");
			return j
		},
		buildUrl: function(j, i) {
			var k = "";
			c.each(i, function(m, l) {
				k += (k ? "&" : "") + encodeURIComponent(l) + "=" + encodeURIComponent(m)
			});
			if (k) {
				j += (j.indexOf("?") > 0 ? "&" : "?") + k
			}
			return j
		},
		formatSize: function(j) {
			if (j === e || /\D/.test(j)) {
				return c.translate("N/A")
			}

			function i(m, l) {
				return Math.round(m * Math.pow(10, l)) / Math.pow(10, l)
			}
			var k = Math.pow(1024, 4);
			if (j > k) {
				return i(j / k, 1) + " " + c.translate("tb")
			}
			if (j > (k /= 1024)) {
				return i(j / k, 1) + " " + c.translate("gb")
			}
			if (j > (k /= 1024)) {
				return i(j / k, 1) + " " + c.translate("mb")
			}
			if (j > 1024) {
				return Math.round(j / 1024) + " " + c.translate("kb")
			}
			return j + " " + c.translate("b")
		},
		parseSize: h.parseSizeStr,
		predictRuntime: function(k, j) {
			var i, l;
			i = new c.Uploader(k);
			l = h.Runtime.thatCan(i.getOption().required_features, j || k.runtimes);
			i.destroy();
			return l
		},
		addFileFilter: function(j, i) {
			g[j] = i
		}
	};
	c.addFileFilter("mime_types", function(k, j, i) {
		if (k.length && k.regexp && !k.regexp.test(j.name)) {
			this.trigger("Error", {
				code: c.FILE_EXTENSION_ERROR,
				message: c.translate("File extension error."),
				file: j
			});
			i(false)
		} else {
			i(true)
		}
	});
	c.addFileFilter("max_file_size", function(l, j, i) {
		var k;
		l = c.parseSize(l);
		if (j.size !== k && l && j.size > l) {
			this.trigger("Error", {
				code: c.FILE_SIZE_ERROR,
				message: c.translate("File size error."),
				file: j
			});
			i(false)
		} else {
			i(true)
		}
	});
	c.addFileFilter("prevent_duplicates", function(l, j, i) {
		if (l) {
			var k = this.files.length;
			while (k--) {
				if (j.name === this.files[k].name && j.size === this.files[k].size) {
					this.trigger("Error", {
						code: c.FILE_DUPLICATE_ERROR,
						message: c.translate("Duplicate file error."),
						file: j
					});
					i(false);
					return
				}
			}
		}
		i(true)
	});
	c.Uploader = function(l) {
		var t = c.guid(),
			G, p = [],
			x = {},
			F = [],
			w = [],
			C, J, n = false,
			v;

		function I() {
			var L, N = 0,
				K;
			if (this.state == c.STARTED) {
				for (K = 0; K < p.length; K++) {
					if (!L && p[K].status == c.QUEUED) {
						L = p[K];
						if (this.trigger("BeforeUpload", L)) {
							L.status = c.UPLOADING;
							this.trigger("UploadFile", L)
						}
					} else {
						N++
					}
				}
				if (N == p.length) {
					if (this.state !== c.STOPPED) {
						this.state = c.STOPPED;
						this.trigger("StateChanged")
					}
					this.trigger("UploadComplete", p)
				}
			}
		}

		function k(K) {
			K.percent = K.size > 0 ? Math.ceil(K.loaded / K.size * 100) : 100;
			j()
		}

		function j() {
			var L, K;
			J.reset();
			for (L = 0; L < p.length; L++) {
				K = p[L];
				if (K.size !== e) {
					J.size += K.origSize;
					J.loaded += K.loaded * K.origSize / K.size
				} else {
					J.size = e
				}
				if (K.status == c.DONE) {
					J.uploaded++
				} else {
					if (K.status == c.FAILED) {
						J.failed++
					} else {
						J.queued++
					}
				}
			}
			if (J.size === e) {
				J.percent = p.length > 0 ? Math.ceil(J.uploaded / p.length * 100) : 0
			} else {
				J.bytesPerSec = Math.ceil(J.loaded / ((+new Date() - C || 1) / 1000));
				J.percent = J.size > 0 ? Math.ceil(J.loaded / J.size * 100) : 0
			}
		}

		function H() {
			var K = F[0] || w[0];
			if (K) {
				return K.getRuntime().uid
			}
			return false
		}

		function E(L, K) {
			if (L.ruid) {
				var N = h.Runtime.getInfo(L.ruid);
				if (N) {
					return N.can(K)
				}
			}
			return false
		}

		function y() {
			this.bind("FilesAdded FilesRemoved", function(K) {
				K.trigger("QueueChanged");
				K.refresh()
			});
			this.bind("CancelUpload", i);
			this.bind("BeforeUpload", B);
			this.bind("UploadFile", D);
			this.bind("UploadProgress", u);
			this.bind("StateChanged", A);
			this.bind("QueueChanged", j);
			this.bind("Error", r);
			this.bind("FileUploaded", s);
			this.bind("Destroy", q)
		}

		function z(Q, N) {
			var O = this,
				L = 0,
				K = [];
			var P = {
				runtime_order: Q.runtimes,
				required_caps: Q.required_features,
				preferred_caps: x,
				swf_url: Q.flash_swf_url,
				xap_url: Q.silverlight_xap_url
			};
			c.each(Q.runtimes.split(/\s*,\s*/), function(R) {
				if (Q[R]) {
					P[R] = Q[R]
				}
			});
			if (Q.browse_button) {
				c.each(Q.browse_button, function(R) {
					K.push(function(S) {
						var T = new h.FileInput(c.extend({}, P, {
							accept: Q.filters.mime_types,
							name: Q.file_data_name,
							multiple: Q.multi_selection,
							container: Q.container,
							browse_button: R
						}));
						T.onready = function() {
							var U = h.Runtime.getInfo(this.ruid);
							h.extend(O.features, {
								chunks: U.can("slice_blob"),
								multipart: U.can("send_multipart"),
								multi_selection: U.can("select_multiple")
							});
							L++;
							F.push(this);
							S()
						};
						T.onchange = function() {
							O.addFile(this.files)
						};
						T.bind("mouseenter mouseleave mousedown mouseup", function(U) {
							if (!n) {
								if (Q.browse_button_hover) {
									if ("mouseenter" === U.type) {
										h.addClass(R, Q.browse_button_hover)
									} else {
										if ("mouseleave" === U.type) {
											h.removeClass(R, Q.browse_button_hover)
										}
									}
								}
								if (Q.browse_button_active) {
									if ("mousedown" === U.type) {
										h.addClass(R, Q.browse_button_active)
									} else {
										if ("mouseup" === U.type) {
											h.removeClass(R, Q.browse_button_active)
										}
									}
								}
							}
						});
						T.bind("mousedown", function() {
							O.trigger("Browse")
						});
						T.bind("error runtimeerror", function() {
							T = null;
							S()
						});
						T.init()
					})
				})
			}
			if (Q.drop_element) {
				c.each(Q.drop_element, function(R) {
					K.push(function(S) {
						var T = new h.FileDrop(c.extend({}, P, {
							drop_zone: R
						}));
						T.onready = function() {
							var U = h.Runtime.getInfo(this.ruid);
							O.features.dragdrop = U.can("drag_and_drop");
							L++;
							w.push(this);
							S()
						};
						T.ondrop = function() {
							O.addFile(this.files)
						};
						T.bind("error runtimeerror", function() {
							T = null;
							S()
						});
						T.init()
					})
				})
			}
			h.inSeries(K, function() {
				if (typeof(N) === "function") {
					N(L)
				}
			})
		}

		function o(N, P, K) {
			var L = new h.Image();
			try {
				L.onload = function() {
					if (P.width > this.width && P.height > this.height && P.quality === e && P.preserve_headers && !P.crop) {
						this.destroy();
						return K(N)
					}
					L.downsize(P.width, P.height, P.crop, P.preserve_headers)
				};
				L.onresize = function() {
					K(this.getAsBlob(N.type, P.quality));
					this.destroy()
				};
				L.onerror = function() {
					K(N)
				};
				L.load(N)
			} catch (O) {
				K(N)
			}
		}

		function m(N, P, Q) {
			var L = this,
				K = false;

			function O(S, T, U) {
				var R = G[S];
				switch (S) {
					case "max_file_size":
						if (S === "max_file_size") {
							G.max_file_size = G.filters.max_file_size = T
						}
						break;
					case "chunk_size":
						if (T = c.parseSize(T)) {
							G[S] = T;
							G.send_file_name = true
						}
						break;
					case "multipart":
						G[S] = T;
						if (!T) {
							G.send_file_name = true
						}
						break;
					case "unique_names":
						G[S] = T;
						if (T) {
							G.send_file_name = true
						}
						break;
					case "filters":
						if (c.typeOf(T) === "array") {
							T = {
								mime_types: T
							}
						}
						if (U) {
							c.extend(G.filters, T)
						} else {
							G.filters = T
						}
						if (T.mime_types) {
							G.filters.mime_types.regexp = (function(V) {
								var W = [];
								c.each(V, function(X) {
									X.extensions && c.each(X.extensions.split(/,/), function(Y) {
										if (/^\s*\*\s*$/.test(Y)) {
											W.push("\\.*")
										} else {
											W.push("\\." + Y.replace(new RegExp("[" + ("/^$.*+?|()[]{}\\".replace(/./g, "\\$&")) + "]", "g"), "\\$&"))
										}
									})
								});
								return new RegExp("(" + W.join("|") + ")$", "i")
							}(G.filters.mime_types))
						}
						break;
					case "resize":
						if (U) {
							c.extend(G.resize, T, {
								enabled: true
							})
						} else {
							G.resize = T
						}
						break;
					case "prevent_duplicates":
						G.prevent_duplicates = G.filters.prevent_duplicates = !!T;
						break;
					case "browse_button":
					case "drop_element":
						T = c.get(T);
					case "container":
					case "runtimes":
					case "multi_selection":
					case "flash_swf_url":
					case "silverlight_xap_url":
						G[S] = T;
						if (!U) {
							K = true
						}
						break;
					default:
						G[S] = T
				}
				if (!U) {
					L.trigger("OptionChanged", S, T, R)
				}
			}
			if (typeof(N) === "object") {
				c.each(N, function(S, R) {
					O(R, S, Q)
				})
			} else {
				O(N, P, Q)
			}
			if (Q) {
				G.required_features = a(c.extend({}, G));
				x = a(c.extend({}, G, {
					required_features: true
				}))
			} else {
				if (K) {
					L.trigger("Destroy");
					z.call(L, G, function(R) {
						if (R) {
							L.runtime = h.Runtime.getInfo(H()).type;
							L.trigger("Init", {
								runtime: L.runtime
							});
							L.trigger("PostInit")
						} else {
							L.trigger("Error", {
								code: c.INIT_ERROR,
								message: c.translate("Init error.")
							})
						}
					})
				}
			}
		}

		function B(K, L) {
			if (K.settings.unique_names) {
				var O = L.name.match(/\.([^.]+)$/),
					N = "part";
				if (O) {
					N = O[1]
				}
				L.target_name = L.id + "." + N
			}
		}

		function D(T, Q) {
			var N = T.settings.url,
				R = T.settings.chunk_size,
				U = T.settings.max_retries,
				O = T.features,
				S = 0,
				K;
			if (Q.loaded) {
				S = Q.loaded = R ? R * Math.floor(Q.loaded / R) : 0
			}

			function P() {
				if (U-- > 0) {
					d(L, 1000)
				} else {
					Q.loaded = S;
					T.trigger("Error", {
						code: c.HTTP_ERROR,
						message: c.translate("HTTP Error."),
						file: Q,
						response: v.responseText,
						status: v.status,
						responseHeaders: v.getAllResponseHeaders()
					})
				}
			}

			function L() {
				var X, W, V = {},
					Z;
				if (Q.status !== c.UPLOADING || T.state === c.STOPPED) {
					return
				}
				if (T.settings.send_file_name) {
					V.name = Q.target_name || Q.name
				}
				if (R && O.chunks && K.size > R) {
					Z = Math.min(R, K.size - S);
					X = K.slice(S, S + Z)
				} else {
					Z = K.size;
					X = K
				}
				if (R && O.chunks) {
					if (T.settings.send_chunk_number) {
						V.chunk = Math.ceil(S / R);
						V.chunks = Math.ceil(K.size / R)
					} else {
						V.offset = S;
						V.total = K.size
					}
				}
				v = new h.XMLHttpRequest();
				if (v.upload) {
					v.upload.onprogress = function(aa) {
						Q.loaded = Math.min(Q.size, S + aa.loaded);
						T.trigger("UploadProgress", Q)
					}
				}
				var Y = v;
				v.onload = function() {
					if (Y.status >= 400) {
						P();
						return
					}
					U = T.settings.max_retries;
					if (Z < K.size) {
						X.destroy();
						S += Z;
						Q.loaded = Math.min(S, K.size);
						T.trigger("ChunkUploaded", Q, {
							offset: Q.loaded,
							total: K.size,
							response: Y.responseText,
							status: Y.status,
							responseHeaders: Y.getAllResponseHeaders()
						});
						if (h.Env.browser === "Android Browser") {
							T.trigger("UploadProgress", Q)
						}
					} else {
						Q.loaded = Q.size
					}
					X = W = null;
					if (!S || S >= K.size) {
						if (Q.size != Q.origSize) {
							K.destroy();
							K = null
						}
						T.trigger("UploadProgress", Q);
						Q.status = c.DONE;
						T.trigger("FileUploaded", Q, {
							response: Y.responseText,
							status: Y.status,
							responseHeaders: Y.getAllResponseHeaders()
						})
					} else {
						d(L, 1)
					}
				};
				v.onerror = function() {
					P()
				};
				v.onloadend = function() {
					this.destroy();
					Y = null
				};
				if (T.settings.multipart && O.multipart) {
					v.open("post", N, true);
					c.each(T.settings.headers, function(ab, aa) {
						v.setRequestHeader(aa, ab)
					});
					W = new h.FormData();
					c.each(c.extend(V, T.settings.multipart_params), function(ab, aa) {
						W.append(aa, ab)
					});
					W.append(T.settings.file_data_name, X);
					v.send(W, {
						runtime_order: T.settings.runtimes,
						required_caps: T.settings.required_features,
						preferred_caps: x,
						swf_url: T.settings.flash_swf_url,
						xap_url: T.settings.silverlight_xap_url
					})
				} else {
					N = c.buildUrl(T.settings.url, c.extend(V, T.settings.multipart_params));
					v.open("post", N, true);
					v.setRequestHeader("Content-Type", "application/octet-stream");
					c.each(T.settings.headers, function(ab, aa) {
						v.setRequestHeader(aa, ab)
					});
					v.send(X, {
						runtime_order: T.settings.runtimes,
						required_caps: T.settings.required_features,
						preferred_caps: x,
						swf_url: T.settings.flash_swf_url,
						xap_url: T.settings.silverlight_xap_url
					})
				}
			}
			K = Q.getSource();
			if (T.settings.resize.enabled && E(K, "send_binary_string") && !!~h.inArray(K.type, ["image/jpeg", "image/png"])) {
				o.call(this, K, T.settings.resize, function(V) {
					K = V;
					Q.size = V.size;
					L()
				})
			} else {
				L()
			}
		}

		function u(K, L) {
			k(L)
		}

		function A(K) {
			if (K.state == c.STARTED) {
				C = (+new Date())
			} else {
				if (K.state == c.STOPPED) {
					for (var L = K.files.length - 1; L >= 0; L--) {
						if (K.files[L].status == c.UPLOADING) {
							K.files[L].status = c.QUEUED;
							j()
						}
					}
				}
			}
		}

		function i() {
			if (v) {
				v.abort()
			}
		}

		function s(K) {
			j();
			d(function() {
				I.call(K)
			}, 1)
		}

		function r(K, L) {
			if (L.code === c.INIT_ERROR) {
				K.destroy()
			} else {
				if (L.file) {
					L.file.status = c.FAILED;
					k(L.file);
					if (K.state == c.STARTED) {
						K.trigger("CancelUpload");
						d(function() {
							I.call(K)
						}, 1)
					}
				}
			}
		}

		function q(K) {
			K.stop();
			c.each(p, function(L) {
				L.destroy()
			});
			p = [];
			if (F.length) {
				c.each(F, function(L) {
					L.destroy()
				});
				F = []
			}
			if (w.length) {
				c.each(w, function(L) {
					L.destroy()
				});
				w = []
			}
			x = {};
			n = false;
			C = v = null;
			J.reset()
		}
		G = {
			runtimes: h.Runtime.order,
			max_retries: 0,
			chunk_size: 0,
			multipart: true,
			multi_selection: true,
			file_data_name: "file",
			flash_swf_url: "js/Moxie.swf",
			silverlight_xap_url: "js/Moxie.xap",
			filters: {
				mime_types: [],
				prevent_duplicates: false,
				max_file_size: 0
			},
			resize: {
				enabled: false,
				preserve_headers: true,
				crop: false
			},
			send_file_name: true,
			send_chunk_number: true
		};
		m.call(this, l, null, true);
		J = new c.QueueProgress();
		c.extend(this, {
			id: t,
			uid: t,
			state: c.STOPPED,
			features: {},
			runtime: null,
			files: p,
			settings: G,
			total: J,
			init: function() {
				var K = this;
				if (typeof(G.preinit) == "function") {
					G.preinit(K)
				} else {
					c.each(G.preinit, function(N, L) {
						K.bind(L, N)
					})
				}
				y.call(this);
				if (!G.browse_button || !G.url) {
					this.trigger("Error", {
						code: c.INIT_ERROR,
						message: c.translate("Init error.")
					});
					return
				}
				z.call(this, G, function(L) {
					if (typeof(G.init) == "function") {
						G.init(K)
					} else {
						c.each(G.init, function(O, N) {
							K.bind(N, O)
						})
					}
					if (L) {
						K.runtime = h.Runtime.getInfo(H()).type;
						K.trigger("Init", {
							runtime: K.runtime
						});
						K.trigger("PostInit")
					} else {
						K.trigger("Error", {
							code: c.INIT_ERROR,
							message: c.translate("Init error.")
						})
					}
				})
			},
			setOption: function(K, L) {
				m.call(this, K, L, !this.runtime)
			},
			getOption: function(K) {
				if (!K) {
					return G
				}
				return G[K]
			},
			refresh: function() {
				if (F.length) {
					c.each(F, function(K) {
						K.trigger("Refresh")
					})
				}
				this.trigger("Refresh")
			},
			start: function() {
				if (this.state != c.STARTED) {
					this.state = c.STARTED;
					this.trigger("StateChanged");
					I.call(this)
				}
			},
			stop: function() {
				if (this.state != c.STOPPED) {
					this.state = c.STOPPED;
					this.trigger("StateChanged");
					this.trigger("CancelUpload")
				}
			},
			disableBrowse: function() {
				n = arguments[0] !== e ? arguments[0] : true;
				if (F.length) {
					c.each(F, function(K) {
						K.disable(n)
					})
				}
				this.trigger("DisableBrowse", n)
			},
			getFile: function(L) {
				var K;
				for (K = p.length - 1; K >= 0; K--) {
					if (p[K].id === L) {
						return p[K]
					}
				}
			},
			addFile: function(Q, S) {
				var N = this,
					K = [],
					L = [],
					O;

				function R(V, U) {
					var T = [];
					h.each(N.settings.filters, function(X, W) {
						if (g[W]) {
							T.push(function(Y) {
								g[W].call(N, X, V, function(Z) {
									Y(!Z)
								})
							})
						}
					});
					h.inSeries(T, U)
				}

				function P(T) {
					var U = h.typeOf(T);
					if (T instanceof h.File) {
						if (!T.ruid && !T.isDetached()) {
							if (!O) {
								return false
							}
							T.ruid = O;
							T.connectRuntime(O)
						}
						P(new c.File(T))
					} else {
						if (T instanceof h.Blob) {
							P(T.getSource());
							T.destroy()
						} else {
							if (T instanceof c.File) {
								if (S) {
									T.name = S
								}
								K.push(function(V) {
									R(T, function(W) {
										if (!W) {
											p.push(T);
											L.push(T);
											N.trigger("FileFiltered", T)
										}
										d(V, 1)
									})
								})
							} else {
								if (h.inArray(U, ["file", "blob"]) !== -1) {
									P(new h.File(null, T))
								} else {
									if (U === "node" && h.typeOf(T.files) === "filelist") {
										h.each(T.files, P)
									} else {
										if (U === "array") {
											S = null;
											h.each(T, P)
										}
									}
								}
							}
						}
					}
				}
				O = H();
				P(Q);
				if (K.length) {
					h.inSeries(K, function() {
						if (L.length) {
							N.trigger("FilesAdded", L)
						}
					})
				}
			},
			removeFile: function(L) {
				var N = typeof(L) === "string" ? L : L.id;
				for (var K = p.length - 1; K >= 0; K--) {
					if (p[K].id === N) {
						return this.splice(K, 1)[0]
					}
				}
			},
			splice: function(O, K) {
				var L = p.splice(O === e ? 0 : O, K === e ? p.length : K);
				var N = false;
				if (this.state == c.STARTED) {
					c.each(L, function(P) {
						if (P.status === c.UPLOADING) {
							N = true;
							return false
						}
					});
					if (N) {
						this.stop()
					}
				}
				this.trigger("FilesRemoved", L);
				c.each(L, function(P) {
					P.destroy()
				});
				if (N) {
					this.start()
				}
				return L
			},
			bind: function(L, O, N) {
				var K = this;
				c.Uploader.prototype.bind.call(this, L, function() {
					var P = [].slice.call(arguments);
					P.splice(0, 1, K);
					return O.apply(this, P)
				}, 0, N)
			},
			destroy: function() {
				this.trigger("Destroy");
				G = J = null;
				this.unbindAll()
			}
		})
	};
	c.Uploader.prototype = h.EventTarget.instance;
	c.File = (function() {
		var j = {};

		function i(k) {
			c.extend(this, {
				id: c.guid(),
				name: k.name || k.fileName,
				type: k.type || "",
				size: k.size || k.fileSize,
				origSize: k.size || k.fileSize,
				loaded: 0,
				percent: 0,
				status: c.QUEUED,
				lastModifiedDate: k.lastModifiedDate || (new Date()).toLocaleString(),
				getNative: function() {
					var l = this.getSource().getSource();
					return h.inArray(h.typeOf(l), ["blob", "file"]) !== -1 ? l : null
				},
				getSource: function() {
					if (!j[this.id]) {
						return null
					}
					return j[this.id]
				},
				destroy: function() {
					var l = this.getSource();
					if (l) {
						l.destroy();
						delete j[this.id]
					}
				}
			});
			j[this.id] = k
		}
		return i
	}());
	c.QueueProgress = function() {
		var i = this;
		i.size = 0;
		i.loaded = 0;
		i.uploaded = 0;
		i.failed = 0;
		i.queued = 0;
		i.percent = 0;
		i.bytesPerSec = 0;
		i.reset = function() {
			i.size = i.loaded = i.uploaded = i.failed = i.queued = i.percent = i.bytesPerSec = 0
		}
	};
	f.plupload = c
}(window, mOxie));
if (window.M && typeof M.define == "function") {
	M.define("/js/plupload", function() {
		return window.plupload
	})
}
M.define("/js/module/uploader/Pluploader", function(f, d, g) {
	var e = f("/js/plupload"),
		b = 0;

	function c() {
		b += 1;
		return "_j_pluplader_btn_container_" + b
	}

	function a(j, i, m, k) {
		var n = $(j).parent(),
			o = n.attr("id"),
			h = o || c();
		j = $(j).get(0);
		if (!o) {
			n.attr("id", h)
		}
		var l = new e.Uploader(M.mix({
			multipart: "form-data",
			browse_button: j,
			container: h
		}, i));
		l.init();
		M.forEach(m, function(q, p) {
			l.bind(p, M.bind(q, k))
		});
		return l
	}
	return a
});
M.define("/js/qa/qa_module/PasteInEditor", function(a) {
	function b(d) {
		this.e = null;
		this.dealHtml = $.noop();
		$.extend(this, d);
		this.paste()
	}
	b.prototype = {
		paste: function() {
			if (!this.e) {
				throw new Error("The paste event arguments e must have!")
			}
			var e = (this.e.originalEvent || this.e).clipboardData;
			var d = "";
			if (e && e.getData) {
				d = this.dealPasteHtml(e)
			} else {
				this.dealPasteText();
				d = 1
			}
			if (d) {
				return true
			}
			if (this.dealHtml) {
				this.dealSinglePasteImg(e)
			}
		},
		dealPasteHtml: function(f) {
			var d = "";
			var e = f.types;
			if (((e instanceof DOMStringList) && e.contains("text/html")) || (e.indexOf && e.indexOf("text/html") !== -1)) {
				d = $.trim(f.getData("text/html"));
				if (d) {
					M.isFunction(this.dealHtml) && this.dealHtml(d)
				}
				return d
			} else {
				if (e.indexOf && e.indexOf("text/plain") !== -1) {
					d = this.replaceTextToHtml($.trim(f.getData("text/plain")));
					M.isFunction(this.dealHtml) && this.dealHtml(d);
					return d
				} else {}
			}
			return ""
		},
		dealPasteText: function() {
			var d = "";
			var e = window.clipboardData;
			if (e && e.getData) {
				d = this.replaceTextToHtml(e.getData("Text"));
				M.isFunction(this.dealHtml) && this.dealHtml(d)
			}
		},
		dealSinglePasteImg: function(d) {
			if (d.items && d.items.length) {
				M.forEach(d.items, $.proxy(function(e) {
					if (/image/.test(e.type)) {
						this.getImgReader(e.getAsFile(), $.proxy(function(f) {
							M.isFunction(this.dealHtml) && this.dealHtml('<img src="' + f + '">')
						}, this))
					}
				}, this))
			}
		},
		getImgReader: function(e, f) {
			var d = new FileReader();
			d.onload = function(g) {
				f && f(g.target.result)
			};
			d.readAsDataURL(e)
		},
		replaceTextToHtml: function(d) {
			d = d.replace(/\n/g, "<br>");
			return d.replace(/[\s\t]/g, function(f, e) {
				if (f == " ") {
					return "&nbsp;"
				} else {
					if (f == "\t") {
						return "&nbsp;&nbsp;&nbsp;&nbsp;"
					}
				}
				return ""
			})
		}
	};
	var c = function(d, f) {
		new b({
			e: d,
			dealHtml: f || $.noop(),
		})
	};
	return c
});
M.define("/js/qa/qa_module/FilterHtml", function(b) {
	function a(c) {
		this.needRemovedTags = ["script", "style", "noscript", "head", "meta", "title", "pre", "link"];
		this.allowedTags = ["br", "img", "b", "strong", "ol", "ul", "li", "h3"];
		this.needAddBrTags = ["p", "dt", "dd"];
		this.html = "";
		this.afterFilted = $.noop();
		this.filterImg = $.noop();
		$.extend(this, c);
		this.init()
	}
	a.prototype = {
		init: function() {
			if ((typeof this.html != "string") || this.html == "") {
				return false
			}
			var d = $("<div>" + this.html + "</div>");
			var c = this.stripNode(d.get(0));
			d.remove();
			this.afterFilted && this.afterFilted(c)
		},
		stripNode: function(j) {
			var h = "";
			var k = j.nodeName.toLowerCase();
			if (this.needRemove(k)) {
				return ""
			}
			var e = this.getAllowedHtml(j, k);
			if (e) {
				return e
			}
			var g = j.childNodes;
			if (g.length) {
				for (var f = 0, c = g.length; f < c; f++) {
					var d = g[f].nodeName.toLowerCase();
					if (d == "#text") {
						h += g[f].nodeValue
					} else {
						h += this.stripNode(g[f])
					}
				}
			} else {
				if (k == "#text") {
					h += j.nodeValue
				}
			}
			if ($.inArray(k, this.needAddBrTags) != -1 && !$(j).children("br").length) {
				h += "<br>"
			}
			return h
		},
		needRemove: function(c) {
			return $.inArray(c, this.needRemovedTags) != -1
		},
		getAllowedHtml: function(g, h) {
			var h = h ? h : g.nodeName.toLowerCase();
			var f = "";
			var d = $(g);
			if ($.inArray(h, this.allowedTags) != -1) {
				switch (h) {
					case "br":
						f += "<br>";
						break;
					case "img":
						this.filterImg && (f += this.filterImg(g));
						break;
					case "a":
						f += "<" + h + ' href="' + d.attr("href") + '">' + d.text() + "</" + h + ">";
						break;
					case "ul":
						var c = "";
						for (var e = 0; e < d.find("li").length; e++) {
							c += "<li>" + d.find("li").eq(e).text() + "</li>"
						}
						if (c) {
							f += "<ul>" + c + "</ul>"
						}
						break;
					case "ol":
						var c = "";
						for (var e = 0; e < d.find("li").length; e++) {
							c += "<li>" + d.find("li").eq(e).text() + "</li>"
						}
						if (c) {
							f += "<ol>" + c + "</ol>"
						}
						break;
					case "hr":
						f += "<hr>";
						break;
					default:
						f += "<" + h + ">" + d.text() + "</" + h + ">"
				}
			}
			return f
		}
	};
	return a
});
M.define("/js/qa/qa_module/selection", function(a) {
	var b = {
		selectAllRangs: function(e) {
			var e = $(e).get(0);
			var c, d;
			if (window.getSelection) {
				d = window.getSelection();
				c = document.createRange();
				c.selectNodeContents(e);
				d.removeAllRanges();
				d.addRange(c)
			} else {
				if (document.body.createTextRange) {
					c = document.body.createTextRange();
					c.moveToElementText(e);
					c.select()
				}
			}
		},
		movePointForwardNode: function(d, f) {
			var e, c;
			if (window.getSelection) {
				e = window.getSelection();
				c = e.getRangeAt(0);
				c.setStart(d, 0);
				c.setEnd(d, 0);
				e.removeAllRanges();
				e.addRange(c)
			} else {
				if (document.selection) {
					e = document.selection;
					if (e.type != "Control") {
						c = e.createRange();
						c.moveToElementText(d);
						c.collapse(true);
						c.select()
					}
				}
			}
			f && f()
		},
		movePointAfterNode: function(d) {
			var c, e;
			if (document.createRange) {
				c = document.createRange();
				c.selectNodeContents(d);
				c.collapse(false);
				e = window.getSelection();
				e.removeAllRanges();
				e.addRange(c)
			} else {
				if (document.selection) {
					c = document.body.createTextRange();
					c.moveToElementText(d);
					c.collapse(false);
					c.select()
				}
			}
		},
		selectedNodes: null,
		getNodeHtmlList: function(c) {
			var d = {
					content: [],
					tags: []
				},
				n = [];
			if ($.isArray(c) && c.length > 0) {
				var l = ["b", "strong", "li", "ol", "ul", "h3", "blockquote", "img", "br"];
				for (var h = 0; h < c.length; h++) {
					var f = c[h];
					if (f.nodeName == "#text") {
						var e = {
								content: "",
								tags: []
							},
							k = {},
							g = 0,
							m = "";
						while (1) {
							g++;
							if (f && f.nodeName && !$(f).hasClass("wysiwyg-editor")) {
								m = f.nodeName.toLowerCase();
								if (f.nodeName.toLowerCase() == "#text") {
									e.content = f.nodeValue;
									n.push(m)
								} else {
									if ($.inArray(m, l) >= 0) {
										e.tags.push(f.nodeName.toLowerCase());
										n.push(m)
									}
								}
								f = f.parentNode
							} else {
								break
							}
							if (g > 100) {
								break
							}
						}
						k[m] = e;
						d.content.push(k);
						d.tags = $.unique(n)
					} else {
						if (f.nodeName == "BR") {
							d.content.push({
								br: {
									content: "",
									tags: ["br"]
								}
							})
						}
					}
				}
			}
			return d
		}
	};
	return b
});
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(a) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], a)
	} else {
		if (typeof exports === "object") {
			module.exports = a
		} else {
			a(jQuery)
		}
	}
}(function(c) {
	var d = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		k = ("onwheel" in document || document.documentMode >= 9) ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		h = Array.prototype.slice,
		j, b;
	if (c.event.fixHooks) {
		for (var e = d.length; e;) {
			c.event.fixHooks[d[--e]] = c.event.mouseHooks
		}
	}
	var f = c.event.special.mousewheel = {
		version: "3.1.12",
		setup: function() {
			if (this.addEventListener) {
				for (var m = k.length; m;) {
					this.addEventListener(k[--m], l, false)
				}
			} else {
				this.onmousewheel = l
			}
			c.data(this, "mousewheel-line-height", f.getLineHeight(this));
			c.data(this, "mousewheel-page-height", f.getPageHeight(this))
		},
		teardown: function() {
			if (this.removeEventListener) {
				for (var m = k.length; m;) {
					this.removeEventListener(k[--m], l, false)
				}
			} else {
				this.onmousewheel = null
			}
			c.removeData(this, "mousewheel-line-height");
			c.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function(m) {
			var i = c(m),
				n = i["offsetParent" in c.fn ? "offsetParent" : "parent"]();
			if (!n.length) {
				n = c("body")
			}
			return parseInt(n.css("fontSize"), 10) || parseInt(i.css("fontSize"), 10) || 16
		},
		getPageHeight: function(i) {
			return c(i).height()
		},
		settings: {
			adjustOldDeltas: true,
			normalizeOffset: true
		}
	};
	c.fn.extend({
		mousewheel: function(i) {
			return i ? this.bind("mousewheel", i) : this.trigger("mousewheel")
		},
		unmousewheel: function(i) {
			return this.unbind("mousewheel", i)
		}
	});

	function l(i) {
		var o = i || window.event,
			u = h.call(arguments, 1),
			w = 0,
			q = 0,
			p = 0,
			t = 0,
			s = 0,
			r = 0;
		i = c.event.fix(o);
		i.type = "mousewheel";
		if ("detail" in o) {
			p = o.detail * -1
		}
		if ("wheelDelta" in o) {
			p = o.wheelDelta
		}
		if ("wheelDeltaY" in o) {
			p = o.wheelDeltaY
		}
		if ("wheelDeltaX" in o) {
			q = o.wheelDeltaX * -1
		}
		if ("axis" in o && o.axis === o.HORIZONTAL_AXIS) {
			q = p * -1;
			p = 0
		}
		w = p === 0 ? q : p;
		if ("deltaY" in o) {
			p = o.deltaY * -1;
			w = p
		}
		if ("deltaX" in o) {
			q = o.deltaX;
			if (p === 0) {
				w = q * -1
			}
		}
		if (p === 0 && q === 0) {
			return
		}
		if (o.deltaMode === 1) {
			var v = c.data(this, "mousewheel-line-height");
			w *= v;
			p *= v;
			q *= v
		} else {
			if (o.deltaMode === 2) {
				var n = c.data(this, "mousewheel-page-height");
				w *= n;
				p *= n;
				q *= n
			}
		}
		t = Math.max(Math.abs(p), Math.abs(q));
		if (!b || t < b) {
			b = t;
			if (a(o, t)) {
				b /= 40
			}
		}
		if (a(o, t)) {
			w /= 40;
			q /= 40;
			p /= 40
		}
		w = Math[w >= 1 ? "floor" : "ceil"](w / b);
		q = Math[q >= 1 ? "floor" : "ceil"](q / b);
		p = Math[p >= 1 ? "floor" : "ceil"](p / b);
		if (f.settings.normalizeOffset && this.getBoundingClientRect) {
			var m = this.getBoundingClientRect();
			s = i.clientX - m.left;
			r = i.clientY - m.top
		}
		i.deltaX = q;
		i.deltaY = p;
		i.deltaFactor = b;
		i.offsetX = s;
		i.offsetY = r;
		i.deltaMode = 0;
		u.unshift(i, w, q, p);
		if (j) {
			clearTimeout(j)
		}
		j = setTimeout(g, 200);
		return (c.event.dispatch || c.event.handle).apply(this, u)
	}

	function g() {
		b = null
	}

	function a(m, i) {
		return f.settings.adjustOldDeltas && m.type === "mousewheel" && i % 120 === 0
	}
}));
if (window.M && typeof window.M.define == "function") {
	window.M.define("jq-mousewheel", function() {
		return jQuery
	})
}
M.define("ScrollBar", function(a) {
	a("jq-mousewheel");
	var c = 15;

	function b(d) {
		this.wrap = null;
		this.container = null;
		this.dir = 1;
		this.barTPL = '<div style="position:absolute; top:0; right:0; padding:1px"><div style="width:7px; height:100%; background:#bbb"></div></div>';
		this.maxHeight = 0;
		M.mix(this, d);
		this.container = $(this.container);
		this.wrap = $(this.wrap);
		this.scrollBar = null;
		this.stopped = false;
		this.scrollToEnd = false;
		this.init()
	}
	b.prototype = {
		init: function() {
			if (!this.container.length) {
				M.error("ScrollBar init failed for no scroll container.");
				return false
			}
			this.posDir = this.dir === 0 ? "left" : "top";
			this.lengthDir = this.dir === 0 ? "width" : "height";
			this.scrollScale = this.dir === 0 ? "scrollWidth" : "scrollHeight";
			this.clientScale = this.dir === 0 ? "clientWidth" : "clientHeight";
			this.scrollDir = this.dir === 0 ? "scrollLeft" : "scrollTop";
			this.initWrap();
			this.bindEvents();
			this.setted = false
		},
		initWrap: function() {
			this.container.css({
				position: "relative"
			});
			if (this.dir == 1) {
				this.container.css({
					"overflow-y": "hidden"
				})
			} else {
				this.container.css({
					"overflow-x": "hidden"
				})
			}
			if (this.maxHeight && !isNaN(this.maxHeight)) {
				this.container.css("max-" + this.lengthDir, this.maxHeight).addClass("maxh")
			}
			if (!this.wrap.length) {
				this.container.wrap('<div style="position:relative"></div>');
				this.wrap = this.container.parent()
			} else {
				if (this.wrap.css("position") == "static") {
					this.wrap.css("position", "relative")
				}
			}
			this.createScrollBar();
			if (this.container.height() > 0) {
				this.setScrollBar()
			}
		},
		createScrollBar: function() {
			this.container[0][this.scrollDir] = 0;
			this.scrollBar = $(this.barTPL).css("opacity", 0).appendTo(this.wrap)
		},
		bindEvents: function() {
			this.wrap.bind("mouseenter", $.proxy(this.enterWrap, this)).bind("mouseleave", $.proxy(this.leaveWrap, this)).mousewheel($.proxy(this.rollWrap, this));
			this.scrollBar.mousedown($.proxy(this.holdBar, this));
			M.Event(this).on("contentchange", $.proxy(this.checkShowScrollBar, this))
		},
		setScrollBar: function() {
			this.checkShowScrollBar()
		},
		setDimension: function() {
			this.wrapStart = this.wrap.offset()[this.posDir]
		},
		checkShowScrollBar: function() {
			var e = this.container[0];
			this.wrap.css("height", this.container.height());
			this.wrapLength = this.dir === 0 ? this.wrap.width() : this.wrap.height();
			this.scrollLength = this.dir === 0 ? e.scrollWidth : e.scrollHeight;
			this.clientLength = this.dir === 0 ? e.clientWidth : e.clientHeight;
			var d = e[this.scrollDir];
			if (this.scrollLength > this.clientLength) {
				this.updateScrollBarLength();
				this.scrollBar.show();
				if (d <= this.scrollLength - this.clientLength) {
					this.scroll(d)
				} else {
					this.scroll(this.scrollLength - this.clientLength)
				}
			} else {
				this.scrollBar.hide()
			}
		},
		updateScrollBarLength: function() {
			this.barLength = this.wrapLength * (this.clientLength / this.scrollLength);
			this.barLength = this.barLength < c ? c : this.barLength;
			this.scrollBar.css((this.dir === 0 ? "width" : "height"), this.barLength);
			this.barLength = this.dir === 0 ? this.scrollBar.outerWidth() : this.scrollBar.outerHeight()
		},
		enterWrap: function() {
			if (!this.setted) {
				this.setScrollBar();
				this.setted = true
			}
			this.on = true;
			this.setDimension();
			this.scrollBar.stop(true, true).animate({
				opacity: 0.8
			}, 300)
		},
		leaveWrap: function() {
			this.on = false;
			if (!this.holded) {
				this.scrollBar.stop(true, true).animate({
					opacity: 0
				}, 300)
			}
		},
		stop: function() {
			this.stopped = true
		},
		start: function() {
			this.stopped = false
		},
		rollWrap: function(f, h) {
			if (this.stopped) {
				return true
			}
			var d = this.getScrollUnit(-h * f.deltaFactor);
			d = d < 0 ? Math.floor(d) : Math.ceil(d);
			var g = 0,
				e = this.container[0][this.scrollDir];
			if (e + d < 0) {
				g = 0
			} else {
				if (e + d + this.clientLength > this.scrollLength) {
					g = this.scrollLength - this.clientLength
				} else {
					g = e + d
				}
			}
			this.scroll(g);
			if (this.scrollBar.is(":visible")) {
				f.preventDefault();
				f.stopPropagation()
			}
		},
		getScrollUnit: function(d) {
			if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
				d = 30 * d
			}
			return d
		},
		holdBar: function(d) {
			this.holded = true;
			this.cursorPosition = this.dir === 0 ? d.clientX : d.clientY;
			this.startCursorOffset = this.cursorPosition - this.scrollBar.offset()[this.posDir];
			this.listenMouseMove();
			d.preventDefault()
		},
		listenMouseMove: function() {
			$(document).bind("mousemove", this.getMoveCursorHandler()).bind("mouseup", this.getReleaseCursorHandler())
		},
		stopListenMouseMove: function() {
			$(document).unbind("mousemove", this.getMoveCursorHandler()).unbind("mouseup", this.getReleaseCursorHandler())
		},
		getMoveCursorHandler: function() {
			if (!this.moveCursorHandler) {
				this.moveCursorHandler = $.proxy(this.moveCursor, this)
			}
			return this.moveCursorHandler
		},
		getReleaseCursorHandler: function() {
			if (!this.releaseCursorHandler) {
				this.releaseCursorHandler = $.proxy(this.releaseCursor, this)
			}
			return this.releaseCursorHandler
		},
		moveCursor: function(i) {
			if (this.holded) {
				var e = this.dir === 0 ? i.clientX : i.clientY,
					h = e - this.cursorPosition,
					j = this.cursorPosition - this.startCursorOffset - this.wrapStart,
					g = e - this.startCursorOffset - this.wrapStart,
					d = this.cursorPosition + (this.barLength - this.startCursorOffset) - this.wrapStart - this.wrapLength,
					f = e + (this.barLength - this.startCursorOffset) - this.wrapStart - this.wrapLength;
				if (g > 0 && f < 0 && h !== 0) {
					this.cursorPosition = e;
					this.moveScrollBar(h)
				} else {
					if (g <= 0 && j > 0 && h !== 0) {
						h = -j;
						this.cursorPosition = this.cursorPosition + h;
						this.moveScrollBar(h)
					} else {
						if (f >= 0 && d < 0 && h !== 0) {
							h = -d;
							this.cursorPosition = this.cursorPosition + h;
							this.moveScrollBar(h)
						}
					}
				}
			}
			i.preventDefault()
		},
		moveScrollBar: function(e) {
			var f = parseInt(this.scrollBar.css(this.posDir), 10),
				d = this.wrapLength - this.barLength - f;
			if (e < 0 && e > -f || e > 0 && e < d) {
				f = f + e
			} else {
				if (e < 0) {
					f = 0
				} else {
					if (e > 0) {
						f = f + d
					}
				}
			}
			this.scroll((f / (this.wrapLength - this.barLength)) * (this.scrollLength - this.clientLength))
		},
		scroll: function(d) {
			this.scrollBar.css(this.posDir, d * (this.wrapLength - this.barLength) / (this.scrollLength - this.clientLength));
			this.container[0][this.scrollDir] = d;
			M.Event(this).fire("scroll");
			if (d === 0) {
				M.Event(this).fire("scrollToTop");
				this.scrollToEnd = true
			} else {
				if (d + this.container[0][this.clientScale] >= this.container[0][this.scrollScale]) {
					M.Event(this).fire("scrollToBottom");
					this.scrollToEnd = true
				} else {
					this.scrollToEnd = false
				}
			}
		},
		scrollLength: function() {
			return this.container[0][this.scrollDir]
		},
		releaseCursor: function() {
			this.holded = false;
			this.stopListenMouseMove();
			if (!this.on) {
				this.scrollBar.stop(true, true).animate({
					opacity: 0
				}, 300)
			}
		}
	};
	return b
});
M.define("Storage", function(e, g, b) {
	var n = document;
	var d = c();
	var f = {
		_element: null,
		_expires: null,
		_file: document.location.hostname,
		init: function() {
			if (!this._element) {
				try {
					this._element = n.createElement("input");
					this._element.type = "hidden";
					this._element.addBehavior("#default#userData");
					n.body.appendChild(this._element);
					this.setItem("__detectUserDataStorage", 1);
					this.removeItem("__detectUserDataStorage");
					return {
						setItem: this.setItem,
						getItem: this.getItem,
						removeItem: this.removeItem
					}
				} catch (p) {
					M.error(p)
				}
			}
			return true
		},
		setItem: function(s, t, q) {
			var p = j(q);
			this._element.expires = p.toUTCString();
			this._element.load(this._file);
			var r = a(this._element.getAttribute(s)),
				u = i(t, +p);
			this._element.setAttribute(s, u);
			this._element.save(this._file);
			k({
				key: s,
				newValue: u,
				oldValue: r,
				url: window.location.href
			})
		},
		getItem: function(p) {
			this._element.load(this._file);
			var q = a(this._element.getAttribute(p));
			return q && q.value
		},
		removeItem: function(p) {
			this._element.load(this._file);
			this._element.removeAttribute(p);
			this._element.save(this._file)
		}
	};
	var l = {
		setItem: function(r, s, q) {
			if (!d) {
				return
			}
			var p = j(q);
			localStorage.setItem(r, i(s, +p))
		},
		getItem: function(p) {
			if (!d) {
				return
			}
			var r = +new Date(),
				q = a(localStorage.getItem(p));
			if (q) {
				if (r > q.timestamp) {
					localStorage.removeItem(p);
					q = null
				} else {
					q = q.value
				}
			}
			return q
		},
		removeItem: function(p) {
			if (!d) {
				return
			}
			localStorage.removeItem(p)
		}
	};
	var h = {},
		m = {
			on: function(q, r) {
				var p = h[q] || (h[q] = []);
				p.push(r)
			},
			off: function(q, r) {
				var p = h[q];
				if (!!p) {
					if (!!r) {
						M.forEach(p, function(t, s) {
							if (t == r) {
								p.splice(s, 1)
							}
						})
					} else {
						p = []
					}
				}
				return this
			}
		};
	M.mix(f, m);
	M.mix(l, m);
	if (window.addEventListener) {
		window.addEventListener("storage", k, false)
	} else {
		if (window.attachEvent) {
			window.attachEvent("onstorage", k)
		}
	}

	function k(u) {
		if (!u) {
			u = window.event
		}
		var p = M.mix({}, u),
			w = u.newValue && a(u.newValue),
			q = u.oldValue && a(u.oldValue),
			v = +new Date();
		p.newValue = w && w.value;
		if (!!q && v < q.timestamp) {
			p.oldValue = q.value
		} else {
			p.oldValue = null
		}
		var t = u.key,
			s = h[t],
			r = 0;
		if (!t || !s || 0 === s.length) {
			return
		}
		while (r < s.length) {
			s[r++].call(window, p)
		}
	}

	function j(p) {
		if (Object.prototype.toString.call(p) != "[object Date]") {
			var q = typeof p === "number" && p > 0 ? p : 86400;
			p = new Date();
			p.setTime(+p + q * 1000)
		}
		return p
	}

	function i(q, p) {
		var r = {
			value: q,
			timestamp: p
		};
		return JSON.stringify(r)
	}

	function a(p) {
		if (p) {
			try {
				p = JSON.parse(p);
				if (!("value" in p) || !("timestamp" in p)) {
					p = {
						value: p,
						timestamp: +j()
					}
				}
			} catch (q) {
				p = {
					value: p,
					timestamp: +j()
				}
			}
		}
		return p
	}

	function c() {
		if (window.localStorage) {
			try {
				localStorage.setItem("__detectLocalStorage", 1);
				localStorage.removeItem("__detectLocalStorage");
				return true
			} catch (p) {
				return false
			}
		}
		return false
	}
	var o = window.localStorage ? l : f.init();
	b.exports = M.mix(o, {
		isAvailable: c,
		isSupport: window.localStorage ? d : ("setItem" in o)
	})
});
(function($) {
	var supportedCSS, supportedCSSOrigin, styles = document.getElementsByTagName("head")[0].style,
		toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
	for (var a = 0; a < toCheck.length; a++) {
		if (styles[toCheck[a]] !== undefined) {
			supportedCSS = toCheck[a]
		}
	}
	if (supportedCSS) {
		supportedCSSOrigin = supportedCSS.replace(/[tT]ransform/, "TransformOrigin");
		if (supportedCSSOrigin[0] == "T") {
			supportedCSSOrigin[0] = "t"
		}
	}
	eval('IE = "v"=="\v"');
	jQuery.fn.extend({
		rotate: function(parameters) {
			if (this.length === 0 || typeof parameters == "undefined") {
				return
			}
			if (typeof parameters == "number") {
				parameters = {
					angle: parameters
				}
			}
			var returned = [];
			for (var i = 0, i0 = this.length; i < i0; i++) {
				var element = this.get(i);
				if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {
					var paramClone = $.extend(true, {}, parameters);
					var newRotObject = new Wilq32.PhotoEffect(element, paramClone)._rootObj;
					returned.push($(newRotObject))
				} else {
					element.Wilq32.PhotoEffect._handleRotation(parameters)
				}
			}
			return returned
		},
		getRotateAngle: function() {
			var ret = [];
			for (var i = 0, i0 = this.length; i < i0; i++) {
				var element = this.get(i);
				if (element.Wilq32 && element.Wilq32.PhotoEffect) {
					ret[i] = element.Wilq32.PhotoEffect._angle
				}
			}
			return ret
		},
		stopRotate: function() {
			for (var i = 0, i0 = this.length; i < i0; i++) {
				var element = this.get(i);
				if (element.Wilq32 && element.Wilq32.PhotoEffect) {
					clearTimeout(element.Wilq32.PhotoEffect._timer)
				}
			}
		}
	});
	Wilq32 = window.Wilq32 || {};
	Wilq32.PhotoEffect = (function() {
		if (supportedCSS) {
			return function(img, parameters) {
				img.Wilq32 = {
					PhotoEffect: this
				};
				this._img = this._rootObj = this._eventObj = img;
				this._handleRotation(parameters)
			}
		} else {
			return function(img, parameters) {
				this._img = img;
				this._onLoadDelegate = [parameters];
				this._rootObj = document.createElement("span");
				this._rootObj.style.display = "inline-block";
				this._rootObj.Wilq32 = {
					PhotoEffect: this
				};
				img.parentNode.insertBefore(this._rootObj, img);
				if (img.complete) {
					this._Loader()
				} else {
					var self = this;
					jQuery(this._img).bind("load", function() {
						self._Loader()
					})
				}
			}
		}
	})();
	Wilq32.PhotoEffect.prototype = {
		_setupParameters: function(parameters) {
			this._parameters = this._parameters || {};
			if (typeof this._angle !== "number") {
				this._angle = 0
			}
			if (typeof parameters.angle === "number") {
				this._angle = parameters.angle
			}
			this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);
			this._parameters.step = parameters.step || this._parameters.step || null;
			this._parameters.easing = parameters.easing || this._parameters.easing || this._defaultEasing;
			this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
			this._parameters.callback = parameters.callback || this._parameters.callback || this._emptyFunction;
			this._parameters.center = parameters.center || this._parameters.center || ["50%", "50%"];
			if (typeof this._parameters.center[0] == "string") {
				this._rotationCenterX = (parseInt(this._parameters.center[0], 10) / 100) * this._imgWidth * this._aspectW
			} else {
				this._rotationCenterX = this._parameters.center[0]
			}
			if (typeof this._parameters.center[1] == "string") {
				this._rotationCenterY = (parseInt(this._parameters.center[1], 10) / 100) * this._imgHeight * this._aspectH
			} else {
				this._rotationCenterY = this._parameters.center[1]
			}
			if (parameters.bind && parameters.bind != this._parameters.bind) {
				this._BindEvents(parameters.bind)
			}
		},
		_emptyFunction: function() {},
		_defaultEasing: function(x, t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b
		},
		_handleRotation: function(parameters, dontcheck) {
			if (!supportedCSS && !this._img.complete && !dontcheck) {
				this._onLoadDelegate.push(parameters);
				return
			}
			this._setupParameters(parameters);
			if (this._angle == this._parameters.animateTo) {
				this._rotate(this._angle)
			} else {
				this._animateStart()
			}
		},
		_BindEvents: function(events) {
			if (events && this._eventObj) {
				if (this._parameters.bind) {
					var oldEvents = this._parameters.bind;
					for (var a in oldEvents) {
						if (oldEvents.hasOwnProperty(a)) {
							jQuery(this._eventObj).unbind(a, oldEvents[a])
						}
					}
				}
				this._parameters.bind = events;
				for (var a in events) {
					if (events.hasOwnProperty(a)) {
						jQuery(this._eventObj).bind(a, events[a])
					}
				}
			}
		},
		_Loader: (function() {
			if (IE) {
				return function() {
					var width = this._img.width;
					var height = this._img.height;
					this._imgWidth = width;
					this._imgHeight = height;
					this._img.parentNode.removeChild(this._img);
					this._vimage = this.createVMLNode("image");
					this._vimage.src = this._img.src;
					this._vimage.style.height = height + "px";
					this._vimage.style.width = width + "px";
					this._vimage.style.position = "absolute";
					this._vimage.style.top = "0px";
					this._vimage.style.left = "0px";
					this._aspectW = this._aspectH = 1;
					this._container = this.createVMLNode("group");
					this._container.style.width = width;
					this._container.style.height = height;
					this._container.style.position = "absolute";
					this._container.style.top = "0px";
					this._container.style.left = "0px";
					this._container.setAttribute("coordsize", width - 1 + "," + (height - 1));
					this._container.appendChild(this._vimage);
					this._rootObj.appendChild(this._container);
					this._rootObj.style.position = "relative";
					this._rootObj.style.width = width + "px";
					this._rootObj.style.height = height + "px";
					this._rootObj.setAttribute("id", this._img.getAttribute("id"));
					this._rootObj.className = this._img.className;
					this._eventObj = this._rootObj;
					var parameters;
					while (parameters = this._onLoadDelegate.shift()) {
						this._handleRotation(parameters, true)
					}
				}
			} else {
				return function() {
					this._rootObj.setAttribute("id", this._img.getAttribute("id"));
					this._rootObj.className = this._img.className;
					this._imgWidth = this._img.naturalWidth;
					this._imgHeight = this._img.naturalHeight;
					var _widthMax = Math.sqrt((this._imgHeight) * (this._imgHeight) + (this._imgWidth) * (this._imgWidth));
					this._width = _widthMax * 3;
					this._height = _widthMax * 3;
					this._aspectW = this._img.offsetWidth / this._img.naturalWidth;
					this._aspectH = this._img.offsetHeight / this._img.naturalHeight;
					this._img.parentNode.removeChild(this._img);
					this._canvas = document.createElement("canvas");
					this._canvas.setAttribute("width", this._width);
					this._canvas.style.position = "relative";
					this._canvas.style.left = -this._img.height * this._aspectW + "px";
					this._canvas.style.top = -this._img.width * this._aspectH + "px";
					this._canvas.Wilq32 = this._rootObj.Wilq32;
					this._rootObj.appendChild(this._canvas);
					this._rootObj.style.width = this._img.width * this._aspectW + "px";
					this._rootObj.style.height = this._img.height * this._aspectH + "px";
					this._eventObj = this._canvas;
					this._cnv = this._canvas.getContext("2d");
					var parameters;
					while (parameters = this._onLoadDelegate.shift()) {
						this._handleRotation(parameters, true)
					}
				}
			}
		})(),
		_animateStart: function() {
			if (this._timer) {
				clearTimeout(this._timer)
			}
			this._animateStartTime = +new Date;
			this._animateStartAngle = this._angle;
			this._animate()
		},
		_animate: function() {
			var actualTime = +new Date;
			var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;
			if (checkEnd && !this._parameters.animatedGif) {
				clearTimeout(this._timer)
			} else {
				if (this._canvas || this._vimage || this._img) {
					var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
					this._rotate((~~(angle * 10)) / 10)
				}
				if (this._parameters.step) {
					this._parameters.step(this._angle)
				}
				var self = this;
				this._timer = setTimeout(function() {
					self._animate.call(self)
				}, 10)
			}
			if (this._parameters.callback && checkEnd) {
				this._angle = this._parameters.animateTo;
				this._rotate(this._angle);
				this._parameters.callback.call(this._rootObj)
			}
		},
		_rotate: (function() {
			var rad = Math.PI / 180;
			if (IE) {
				return function(angle) {
					this._angle = angle;
					this._container.style.rotation = (angle % 360) + "deg";
					this._vimage.style.top = -(this._rotationCenterY - this._imgHeight / 2) + "px";
					this._vimage.style.left = -(this._rotationCenterX - this._imgWidth / 2) + "px";
					this._container.style.top = this._rotationCenterY - this._imgHeight / 2 + "px";
					this._container.style.left = this._rotationCenterX - this._imgWidth / 2 + "px"
				}
			} else {
				if (supportedCSS) {
					return function(angle) {
						this._angle = angle;
						this._img.style[supportedCSS] = "rotate(" + (angle % 360) + "deg)";
						this._img.style[supportedCSSOrigin] = this._parameters.center.join(" ")
					}
				} else {
					return function(angle) {
						this._angle = angle;
						angle = (angle % 360) * rad;
						this._canvas.width = this._width;
						this._canvas.height = this._height;
						this._cnv.translate(this._imgWidth * this._aspectW, this._imgHeight * this._aspectH);
						this._cnv.translate(this._rotationCenterX, this._rotationCenterY);
						this._cnv.rotate(angle);
						this._cnv.translate(-this._rotationCenterX, -this._rotationCenterY);
						this._cnv.scale(this._aspectW, this._aspectH);
						this._cnv.drawImage(this._img, 0, 0)
					}
				}
			}
		})()
	};
	if (IE) {
		Wilq32.PhotoEffect.prototype.createVMLNode = (function() {
			document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
			try {
				!document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
				return function(tagName) {
					return document.createElement("<rvml:" + tagName + ' class="rvml">')
				}
			} catch (e) {
				return function(tagName) {
					return document.createElement("<" + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
				}
			}
		})()
	}
})(jQuery);
if (window.M && typeof window.M.define == "function") {
	window.M.define("jq-rotate", function() {
		return jQuery
	})
}
M.closure(function(o) {
	var u = $("#_js_editorText");
	if (!u.length) {
		return false
	}
	var s = u.closest("._js_editorWrap");
	var m = $("#_j_qa_upPics_tmpl");
	var z = detectIE(),
		A = null,
		f = $(window),
		n = {};
	o("/js/plugins/wysiwyg/wysiwyg");
	o("/js/jquery.scrollTo.js");
	var p = o("dialog/alert"),
		g = o("dialog/Dialog"),
		j = o("/js/module/uploader/Pluploader"),
		y = o("/js/qa/qa_module/PasteInEditor"),
		F = o("/js/qa/qa_module/FilterHtml"),
		G = o("/js/qa/qa_module/selection"),
		q = o("ScrollBar");
	var E = o("Storage"),
		l = window.Env.UID,
		a = $(".wrapper").data("qid"),
		r = a ? ("qa_detail_publish_answer:" + a + ":" + l) : ("qa_ask_question" + l),
		d = E.getItem(r);
	window.textareaFocused = false;
	M.loadIMG("http://" + window.Env.IMG_HOST + "/images/suggest-loading.gif");
	var k = 1000,
		c = {
			url: "/interface/up.php",
			runtimes: "html5,html4",
			flash_swf_url: "/swf/Moxie.swf",
			filters: {
				mime_types: "image/jpg,image/jpeg,image/png,image/gif,image/JPEG",
				max_file_size: "20000kb"
			},
			resize: {
				width: 4096,
				height: 4096,
				quality: 90
			}
		},
		w = null;

	function D() {
		o("jq-tmpl");
		o("jq-rotate");
		this.dialog = new g({
			content: $("#_j_qa_picUp_tmpl").tmpl(),
			impl: "qa_picUp_dialog",
			stackable: true
		});
		this.submitBtn = $("#_js_inserPics");
		this.picListCnt = this.dialog.getPanel().find("#_js_upPics");
		this.uploadPicDialogScrollBar = null;
		this.bindEvents()
	}
	D.prototype = {
		bindEvents: function() {
			M.Event.on("pic prepared", $.proxy(function(I) {
				var H = $("#_j_photo_" + I.file_id);
				H.removeClass("li_wait").addClass("li_bar");
				this.setUploaderPicCurrentIndex(H.index() + 1)
			}, this));
			M.Event.on("pic progress", $.proxy(function(I) {
				var H = $("#_j_photo_" + I.file_id);
				H.find("i").css("width", I.percent + "%").end().find(".per").text(I.percent + "%")
			}, this));
			M.Event.on("pic uploaded", $.proxy(function(I) {
				var H = $("#_j_photo_" + I.file_id),
					J = I.data;
				if (J && J.url) {
					H.data({
						key: J.url,
						file_id: J.file_id
					});
					H.prepend('<img data-value="" data-file="' + J.file_id + '" data-src="' + J.url + '" src="' + J.url + '" id="_j_image_' + I.file_id + '" />');
					M.loadIMG(J.url, function() {
						H.removeClass("li_bar").addClass("li_whirl")
					});
					H.children(".canvas_pre").remove()
				} else {
					H.removeClass("li_bar").addClass("li_failure")
				}
			}, this));
			M.Event.on("pic uploader complete", $.proxy(function(H) {
				this.submit()
			}, this));
			M.Event(this.dialog).on("afterclose", $.proxy(function() {
				this.picListCnt.empty();
				M.Event.fire("pic uploader dialog close")
			}, this));
			M.Event(this.dialog).on("aftershow", $.proxy(function() {
				this.setScrollBar();
				this.startUpPics($("#_js_inserPics"))
			}, this));
			M.Event(this.dialog).on("afterclose", $.proxy(function() {
				this.stop()
			}, this));
			this.dialog.getPanel().on("click", "._j_remove_up", $.proxy(function(J) {
				var K = $(J.currentTarget),
					H = K.closest("li"),
					I = H.data("file_id");
				H.remove();
				this.changeUploaderPicCounter(-1);
				M.Event.fire("pic uploader canceled", {
					file_id: I
				});
				M.Event(this.uploadPicDialogScrollBar).fire("contentchange")
			}, this)).on("click", "._j_stop_up", $.proxy(function(J) {
				var K = $(J.currentTarget),
					H = K.closest("li"),
					I = H.data("file_id");
				H.remove();
				this.changeUploaderPicCounter(-1);
				M.Event.fire("pic upload stopped", {
					file_id: I
				});
				M.Event(this.uploadPicDialogScrollBar).fire("contentchange")
			}, this)).on("click", "#_js_inserPics", $.proxy(function(H) {
				var J = $(H.currentTarget);
				var K = null;
				var I = [];
				if (J.hasClass("gray")) {
					p.pop("图片正在上传中，请稍后~");
					return
				}
				if (J.hasClass("_js_complete")) {
					K = this.picListCnt.children("li");
					K.each(function(L, N) {
						!$(N).hasClass("add_more_pics") && I.push({
							type: "image",
							file: $(N).data("key"),
							file_id: $(N).data("file_id")
						})
					});
					J.closest("._j_content").siblings("._j_close").trigger("click");
					J.removeClass("_js_complete");
					M.Event.fire("uploaded imgs insert textarea", {
						data: I
					})
				}
			}, this))
		},
		submit: function() {
			M.Event.fire("pic uploader dialog submit");
			this.submitBtn.addClass("_js_complete")
		},
		insertImgs: function() {},
		show: function(L) {
			var K = L.length + $($("#_js_editorText").data("wysiwyg").wysiwygeditor.getElement()).find("img").length;
			var N = '<li class="add_more_pics"><a><i></i></a></li>';
			var J = $(".add_more_pics");
			var H = m.tmpl({
				files: L
			});
			var I = this.dialog.getPanel();
			J.length ? H.insertBefore(J) : this.picListCnt.append(H);
			K < 50 && !J.length && this.picListCnt.append(N);
			J = $(".add_more_pics");
			if (this.picListCnt.is(":visible")) {
				this.changeUploaderPicCounter(L.length);
				this.setScrollBar();
				this.startUpPics($("#_js_inserPics"))
			} else {
				J.length && M.Event.fire("up pop is visible", {
					target: J.children("a")
				});
				I.find("._j_finishedindex").text(0).end().find("._j_totalcount").text(L.length).end()
			}
			this.preload(L);
			this.dialog.show()
		},
		preload: function(J) {
			var I = J.shift(),
				H = new mOxie.Image(),
				K = this;
			H.onload = function() {
				$("#_j_photo_" + I.id).append('<div id="' + this.uid + '" class="canvas_pre"></div>');
				this.embed(this.uid, {
					width: 1000,
					height: 100,
					crop: false,
					swf_url: "/swf/Moxie.swf"
				})
			};
			H.onembedded = function() {
				var N = $("#_j_photo_" + I.id + " .canvas_pre").children().eq(0);
				var L = N.attr("height");
				if (L < 100) {
					N.removeAttr("width").attr("height", 100)
				}
			};
			H.bind("embedded error", function() {
				this.destroy();
				setTimeout(function() {
					if (J.length) {
						K.preload(J)
					}
				}, 1)
			});
			H.load(I.getSource())
		},
		setScrollBar: function() {
			if (!this.uploadPicDialogScrollBar) {
				this.uploadPicDialogScrollBar = new q({
					container: this.picListCnt.parent(),
					wrap: this.picListCnt.parent().parent(),
					barTPL: '<div class="scrollbar" style="height: auto; position:absolute;right:-12px;top:0;width:5px;height:100px;background-color:#999;border-radius:10px;cursor:pointer"></div>'
				})
			}
			M.Event(this.uploadPicDialogScrollBar).fire("contentchange")
		},
		changeUploaderPicCounter: function(K) {
			var H = this.dialog.getPanel(),
				J = +H.find("._j_totalcount").text(),
				I = +H.find("._j_finishedindex").text();
			J += K;
			if (J > 0) {
				H.find("._j_totalcount").text(J);
				if (I > J) {
					I = J;
					H.find("._j_finishedindex").text(I)
				}
				H.find("._j_progress").width((100 * I / J) + "%")
			} else {
				this.hide()
			}
		},
		setUploaderPicCurrentIndex: function(I) {
			var H = this.dialog.getPanel(),
				J = +H.find("._j_totalcount").text();
			I = I > J ? J : I;
			H.find("._j_finishedindex").text(I);
			H.find("._j_progress").width((100 * I / J) + "%")
		},
		restoreUploaderPanel: function() {
			var H = this.dialog.getPanel();
			H.find("._j_progress").width(0);
			H.find("._j_finishedindex").html(0);
			H.find("#_js_inserPics").removeClass("_js_complete gray")
		},
		hide: function() {
			this.stop();
			this.dialog.close();
			this.restoreUploaderPanel()
		},
		stop: function() {
			this.submitBtn.removeClass("gray")
		},
		startUpPics: function(H) {
			H.addClass("gray");
			M.Event.fire("pic uploader started")
		}
	};

	function v(H) {
		this.upElem = null;
		$.extend(this, H);
		M.Event.on("up pop is visible", $.proxy(function(I) {
			this.initPicUp(I.target)
		}, this));
		this.initPicUp()
	}
	v.prototype = {
		upPicHandlers: {
			FilesAdded: function(H, K) {
				var I = $($("#_js_editorText").data("wysiwyg").wysiwygeditor.getElement()).find("img").length;
				var J = $("#_js_upPics").length ? $("#_js_upPics li").not(".add_more_pics").length : 0;
				I += J;
				if (I === k) {
					p.pop("您已经上传了" + k + "张照片了，不能再多传了哟！");
					return
				}
				var L = K.length + I;
				K = K.slice(0, k - I);
				this.createUpPicDialog(H, K);
				if (L > k) {
					p.pop("您上传的照片数超过单次" + k + "张的限制，超出的部分将不会被上传");
					H.splice(k - I, L - k);
					$("#_js_upPics .add_more_pics").length && $("#_js_upPics .add_more_pics").remove()
				}
			},
			BeforeUpload: function(H, I) {
				M.Event.fire("pic prepared", {
					file_id: I.id
				})
			},
			UploadProgress: function(H, I) {
				M.Event.fire("pic progress", {
					file_id: I.id,
					percent: I.percent
				})
			},
			FileUploaded: function(H, J, I) {
				var K = $.parseJSON(I.response);
				M.Event.fire("pic uploaded", {
					file_id: J.id,
					data: K
				})
			},
			UploadComplete: function() {
				M.Event.fire("pic uploader complete")
			},
			Error: function(H, I) {
				if (I.message == "File size error.") {
					p.pop("请上传小于20M的图片")
				}
				M.error(I)
			}
		},
		createUpPicDialog: function(I, H) {
			w = I;
			if (!this.picUploaderDialog) {
				this.picUploaderDialog = new D();
				M.Event.on("pic uploader started", function() {
					w.refresh();
					w.start()
				});
				M.Event.on("pic uploader canceled", function(J) {
					w.removeFile(J.file_id)
				});
				M.Event.on("pic uploader dialog close", function() {
					w.stop();
					w.splice(0);
					w.refresh()
				});
				M.Event.on("pic uploader dialog submit", $.proxy(function() {
					this.picUploaderDialog.stop()
				}, this));
				M.Event.on("uploaded imgs insert textarea", function(K) {
					var O = "",
						N = K.data;
					if (N && N.length) {
						for (var L = 0, J = N.length; L < J; L++) {
							N[L].type === "image" && (O += '<img alt="" src="' + N[L].file + '" data-file="' + N[L].file_id + '" class="_js_answerPic"><br/>')
						}
						$("#_js_editorText").data("wysiwyg").wysiwygeditor.insertHTML(O);
						$($("#_js_editorText").data("wysiwyg").wysiwygeditor.getElement()).trigger("focusin")
					}
				});
				M.Event.on("pic upload stopped", function(J) {
					w.stop();
					w.removeFile(J.file_id);
					w.start()
				})
			}
			this.picUploaderDialog.show(H)
		},
		initPicUp: function(H) {
			var H = H || this.upElem;
			new j(H, c, this.upPicHandlers, this)
		}
	};
	var h = new v({
		upElem: $("#_js_upPicBar")
	});

	function i(N, P, H) {
		P = P || 0;
		var H = H === undefined ? N.val() : H;
		var R = N.parents("._j_word");
		var K = Math.ceil(strlen(H));
		if (!R.data("max_num")) {
			R.data("max_num", parseInt(R.find("._j_max_num").html()))
		}
		var I = R.data("max_num");
		R.find("._j_word_num").html(K);
		var O = R.find("._j_min_num");
		var L = O.length ? parseInt(O.html()) : 0;
		var Q = R.find(".err-tips");
		var J = N.data("column") || "内容";
		if (N.data("not_necessary")) {
			return true
		}
		if (L && (K < L)) {
			if (Q.length > 0) {
				Q.html(J + "不能少于" + L + "字").show();
				N.addClass("err-input")
			} else {
				p.pop(J + "不能少于" + L + "字")
			}
			return false
		} else {
			if (K === 0 && P) {
				if (Q.length > 0) {
					Q.html("请输入" + J).show();
					N.addClass("err-input")
				} else {
					p.pop("请输入" + J)
				}
				return false
			} else {
				if (K > I) {
					if (Q.length > 0) {
						Q.html(J + "不能超过" + I + "字").show();
						N.addClass("err-input")
					} else {
						p.pop(J + "不能超过" + I + "字")
					}
					return false
				} else {
					Q.hide();
					N.removeClass("err-input");
					return true
				}
			}
		}
	}
	var b = {
		bold: function(J) {
			var H = $(J.currentTarget);
			var I = null;
			if (H.hasClass("_js_bold")) {
				H.toggleClass("bold");
				u.data("wysiwyg").wysiwygeditor.bold();
				if (H.hasClass("bold")) {
					I = u.data("wysiwyg").wysiwygeditor.getSelectedNodes();
					b.reBoldNode(I)
				}
			}
			$(J.delegateTarget).data("node", I)
		},
		reBoldNode: function(N) {
			if (N.length < 2 || N[0].parentNode !== N[1].parentNode) {
				return
			}
			var L = "";
			var I = $(N[0].parentNode);
			if (N[0].parentNode.nodeName.toLowerCase() == "div" || I.find("div").length) {
				return
			}
			var J = 0;
			for (var K = 0, H = N.length; K < H; K++) {
				if (N[K].nodeType == 3) {
					if (!J) {
						L += "<b>"
					}
					L += N[K].nodeValue;
					if (K == H) {
						L += "</b>"
					}
					J = 1
				} else {
					if (J) {
						L += "</b>"
					}
					L += N[K].outerHTML;
					J = 0
				}
			}
			I.replaceWith(L)
		},
		triggerBold: function(H) {
			var J = u.data("wysiwyg").wysiwygeditor.getSelectedNodes();
			var K = J.length && J[0].parentElement ? J[0].parentElement.nodeName.toLowerCase() : "";
			var I = H.find("._js_bold");
			if (K == "b" || (K == "strong") || (J.length && H.data("node") && (J[0] == H.data("node")[0])) || (I.hasClass("bold") && !J.length)) {
				I.addClass("bold");
				H.data("node", J)
			} else {
				I.removeClass("bold");
				H.data("node", null)
			}
		},
		dealNewLine: function(H) {
			var I = null;
			z && u.data("wysiwyg").wysiwygeditor.insertHTML("<br>");
			if (!H.length) {
				return
			}
			if ($.inArray(H[0].nodeName.toLowerCase(), ["b", "strong"]) != -1) {
				I = H[0]
			} else {
				if ($.inArray(H[0].parentNode.nodeName.toLowerCase(), ["b", "strong"]) != -1) {
					I = H[0].parentNode
				}
			}
			setTimeout(function() {
				b.formatNodeB(I)
			}, 100)
		},
		formatNodeB: function(J) {
			if (!J) {
				return
			}
			var I = $(J);
			if (I.find("br").length != 1) {
				return
			}
			var L = I.html();
			var P = "";
			var N = L.split(/<br\/?>/);
			var H = "_js_br" + new Date().getTime();
			for (var K = 0, O = N.length; K < O; K++) {
				N[K] != "" && (P += "<b>" + N[K] + "</b>");
				O > 1 && K != O - 1 && (P += '<br id="' + H + '">')
			}
			I.replaceWith(P);
			var Q = $("#" + H);
			G.movePointForwardNode(Q.get(0).nextSibling, function() {
				Q.removeAttr("id")
			})
		}
	};
	var t = {
		hideTurn: function(H) {
			var I = H.children("#_js_turnWrap");
			I.length && I.hide()
		},
		mouseEnterLeaveImg: function(K) {
			var L = $(K.currentTarget);
			if (L.hasClass("neednot_turn")) {
				return
			}
			var I = $(K.delegateTarget);
			var J = I.children("#_js_turnWrap");
			var H = L.width();
			var N = {};
			if (H < 80 || (L.height() < 80)) {
				L.addClass("neednot_turn");
				return
			}
			if (K.type == "mouseenter") {
				if (!J.length) {
					I.append('<div class="turn" id="_js_turnWrap"><i title="向左旋转" class="left _j_turn _j_turnleft"></i><i title="向右旋转" class="right _j_turn _j_turnright"></i></div>');
					J = I.children("#_js_turnWrap")
				}
				N = L.position();
				J.css({
					left: N.left + H - 64 + "px",
					top: N.top
				}).data("img", L).show()
			} else {
				J.data("timer", setTimeout(function() {
					J.hide()
				}, 100))
			}
		},
		turnImg: function(J) {
			var O = $(J.currentTarget);
			var H = O.parent().data("img");
			var I = H.data("file");
			if (!I) {
				return
			}
			var N = O.hasClass("_j_turnleft") ? -90 : 90;
			var K = O.closest("._j_answer_item").length ? O.closest("._j_answer_item").data("aid") : 0;
			var L = s.find("._j_submit_modify_answer");
			!L.length && (L = $("._j_publish_answer"));
			!L.length && (L = $("._j_publish"));
			L.addClass("turnning");
			$.post("/qa/ajax_answer.php", {
				action: "rotate_image",
				file: I,
				rotate: N,
				aid: K
			}, function(R) {
				var P = 0;
				var Q = "";
				if (R.payload && R.payload.ret) {
					P = R.payload.ret;
					if (P == 1) {
						M.loadIMG(R.payload.image, function() {
							L.removeClass("turnning");
							H.css({
								width: R.payload.size.width,
								height: "auto"
							}).data("file", R.payload.file)
						});
						H.attr("src", R.payload.image)
					} else {
						if (P == 2) {
							Q = "要登陆才能改哦"
						} else {
							if (P == 3) {
								Q = "不能改别人的图片"
							}
						}
					}
				} else {
					Q = "旋转失败"
				}
				if (Q) {
					p.pop(Q);
					L.removeClass("turnning")
				}
			}, "json")
		},
		delayHideTurn: function(H) {
			var I = $(H.currentTarget);
			if (H.type == "mouseenter") {
				if (I.data("timer")) {
					clearTimeout(I.data("timer"));
					I.data("timer", null)
				}
			} else {
				I.hide()
			}
		},
	};
	var x = {
		timerStorage: null,
		clickEvent: function(H) {
			H.preventDefault();
			b.triggerBold(s)
		},
		dblclickEvent: function(I) {
			var H = u.data("wysiwyg").wysiwygeditor.getSelectionParentNode();
			if (H) {
				switch (H.nodeName.toLowerCase()) {
					case "b":
					case "strong":
						G.selectAllRangs(H)
				}
			}
		},
		keyPress: function(I, K, H, J, N, L) {
			if (I == 13) {
				b.dealNewLine(u.data("wysiwyg").wysiwygeditor.getSelectedNodes());
				if (z) {
					return false
				}
			}
			return true
		},
		keyUp: function(H) {
			A = $(u.data("wysiwyg").wysiwygeditor.getElement());
			if (H == 8) {
				checkPicNum(A)
			}
			i(u, 0, A.text());
			x.verifyUploading(A);
			x.timerStorage && clearTimeout(x.timerStorage);
			x.timerStorage = setTimeout(function() {
				var I = A.html();
				E.setItem(r, I, 86400);
				if (a) {
					M.Event.fire("qa answer changed", {
						qid: a,
						content: I,
						uid: l
					})
				}
			}, 300);
			if (37 < H && (H < 41)) {
				setTimeout(function() {
					b.triggerBold(s)
				}, 1)
			}
		},
		mouseDown: function(H) {
			if (window.textareaFocused) {
				u.data("wysiwyg").wysiwygeditor.saveSelection()
			}
		},
		focusin: function(H) {
			addPlaceHolderBr(A);
			var I = $(H.currentTarget);
			window.textareaFocused = true;
			I.siblings(".wysiwyg-placeholder").hide();
			checkPicNum(I)
		},
		blur: function(H) {
			var I = $(H.currentTarget);
			window.textareaFocused = false;
			checkPicNum(I);
			if (!parseInt(s.find("._j_word_num").text()) && !parseInt(s.find("._j_pics_num").text())) {
				I.siblings(".wysiwyg-placeholder").show()
			}
		},
		verifyUploading: function(H) {
			M.forEach(n, function(J, I) {
				if (!H.find("." + I).length) {
					!H.find("#" + I).length && delete n[I]
				}
			})
		}
	};
	var C = {
		paste: function(J) {
			J.preventDefault();
			var I = $(J.currentTarget);
			var H = u.data("wysiwyg").wysiwygeditor;
			y(J, function(K) {
				new F({
					html: K,
					filterImg: function(O) {
						var L = $(O);
						var N = L.attr("src");
						if (isMFWPic(N)) {
							L.addClass("ignorePic").attr("style", "").removeAttr("data-src").removeAttr("data-originalpic").removeAttr("data-file")
						} else {
							if (/\.(?:jpg|gif|png)$/.test(N) || C.isBase64Pic(N)) {
								if (/^(file\:\/\/localhost\/)/.test(N)) {
									return ""
								} else {
									L.addClass("_js_needajax")
								}
							} else {
								return ""
							}
						}
						return L.get(0).outerHTML
					},
					afterFilted: function(L) {
						H.insertHTML(L);
						var N = I.find("._js_needajax");
						N.length && N.each(function(P, Q) {
							var O = $(Q);
							O.removeClass("_js_needajax");
							C.ajaxPasteImg(O)
						})
					}
				})
			})
		},
		ajaxPasteImg: function(L, P) {
			var L = $(L);
			var J = L.attr("src");
			var N = C.isBase64Pic(J);
			var K = C.getImageUrlId(J);
			var O = '<img src="http://' + window.Env.IMG_HOST + '/images/suggest-loading.gif" class="_js_editor_img_loading ' + K + '">';
			var I = u.data("wysiwyg").wysiwygeditor;
			var H = {
				url: "/ajax/upload_imgurl/base64uriToFileId",
				data: {
					file: J
				}
			};
			n[K] = 1;
			$(O).insertBefore(L);
			L.remove();
			H.data.type = N ? 1 : 2;
			$.post(H.url, H.data, function(R) {
				var T = $("." + K);
				if (R.error) {
					return T.remove()
				}
				if (!(K in n)) {
					return
				}
				var Q = '<img src="' + R.data.src + '" data-file="' + R.data.fileid + '" class="_js_answerPic ignorePic" id="' + K + '"><br>';
				T.length && $(Q).insertBefore(T);
				var S = $("#" + K).attr("id", "").next("br").get(0);
				N && G.movePointForwardNode(S);
				P && P();
				M.loadIMG(R.data.src, function() {
					T.remove();
					checkPicNum($(".wysiwyg-editor"))
				})
			})
		},
		isBase64Pic: function(H) {
			return H.match(/^data\:([^\;]+)\;base64\,(.+)$/)
		},
		getImageUrlId: function(I) {
			var J = "_l_" + (new Date()).getTime();
			var H = I.split(".");
			if (H.length < 2) {
				return J + Math.round(Math.random() * 1000)
			}
			H.shift();
			var K = H.shift();
			return J + K.slice(-5)
		}
	};
	u.wysiwyg({
		onKeyPress: x.keyPress,
		onKeyUp: x.keyUp
	});
	var A = $(u.data("wysiwyg").wysiwygeditor.getElement());
	setTimeout(function() {
		i(u, 0, A.text())
	}, 100);
	$("body").on("mousedown", x.mouseDown);
	if (d && (d.length > 0) && A.is(":visible") && !u.data("has_temporary")) {
		A.html(d).trigger("focus");
		A.find("#_js_turnWrap, ._js_editor_img_loading").remove()
	}
	addPlaceHolderBr(A);
	A.on("mouseenter mouseleave", "img", t.mouseEnterLeaveImg).on("click", "._j_turn", t.turnImg).on("mouseenter mouseleave", "#_js_turnWrap", t.delayHideTurn).on("click", x.clickEvent).on("dblclick", x.dblclickEvent).on("focusin", x.focusin).on("blur", x.blur).on("paste", C.paste);
	s.on("click", "._js_bold", b.bold);
	var e = $("._js_forFixTitle");
	f.scroll(function() {
		if (e.length && window.textareaFocused) {
			B(e)
		}
	});

	function B(J) {
		var N = J.offset().top;
		var L = J.children("._js_answerTitle");
		var K = 0;
		var I = 46;
		var O = N - $(window).scrollTop() - I;
		var H = A.height();
		if (O < 0) {
			if (H > 150) {
				if (H + O - 120 < 0) {
					if (!J.data("modifyTop")) {
						K = L.offset().top;
						L.css("top", K - N + "px");
						J.data("modifyTop", true)
					}
					J.removeClass("fixTitle")
				} else {
					if (J.data("modifyTop")) {
						L.css("top", "");
						J.data("modifyTop", false)
					}
					J.addClass("fixTitle")
				}
			} else {
				J.removeClass("fixTitle")
			}
		} else {
			J.removeClass("fixTitle")
		}
		J.data("gap", O)
	}
});

function strlen(c) {
	c = $.trim(c);
	var a = 0;
	for (var b = 0; b < c.length; b++) {
		a += c.charCodeAt(b) > 0 && c.charCodeAt(b) < 255 ? 0.5 : 1
	}
	return a
}

function detectIE() {
	var c = window.navigator.userAgent;
	var b = c.indexOf("MSIE ");
	if (b > 0) {
		return parseInt(c.substring(b + 5, c.indexOf(".", b)), 10)
	}
	var a = c.indexOf("Trident/");
	if (a > 0) {
		var e = c.indexOf("rv:");
		return parseInt(c.substring(e + 3, c.indexOf(".", e)), 10)
	}
	var d = c.indexOf("Edge/");
	if (d > 0) {
		return parseInt(c.substring(d + 5, c.indexOf(".", d)), 10)
	}
	return false
}

function isMFWPic(a) {
	return /http(s)?:\/\/[^\/]*.mafengwo.net\//i.test(a)
}

function checkPicNum(c) {
	var a = c.find("img").length;
	var b = c.closest("._j_word");
	b.find("._js_pics_count").show().children("._j_pics_num").html(a)
}

function addPlaceHolderBr(a) {
	if (a.html() === "") {
		a.html('<br class="_js_placeHolderBR">')
	}
}
M.define("FrequencyVerifyControl", function(c, b, d) {
	function a(e) {
		this.container = e.container;
		this.app = e.app;
		this.successHandler = $.noop;
		M.mix(this, e);
		this.init()
	}
	a.prototype = {
		init: function() {
			this.initData();
			this.refreshImg();
			this.verifyCon.delegate("img,._j_change_img", "click", $.proxy(function(e) {
				this.refreshImg()
			}, this));
			this.verifyCon.delegate("._j_fre_confirm", "click", $.proxy(function(h) {
				var g = this.verifyText.val();
				var f = g.length;
				if (f == 0) {
					this.showErro("您还没有输入验证码!");
					return false
				} else {
					if (f !== 6) {
						this.showErro("请输入正确的验证码!");
						return false
					}
				}
				var e = $(h.currentTarget);
				if (e.hasClass("waiting")) {
					return false
				}
				e.addClass("waiting");
				$.post("/user/captcha/verify", {
					sCode: g,
					iApp: this.app
				}, $.proxy(function(i) {
					if (i) {
						if (i.ret === 1) {
							this.successHandler(this.target);
							this.verifyCon.hide();
							this.hideErro()
						} else {
							if (i.ret === 0) {
								this.verifyText.val("");
								this.verifyText.focus();
								this.refreshImg();
								this.showErro("输入的验证码不正确!")
							} else {
								if (i.ret === -1) {
									this.showErro("错误次数过多，请稍候尝试")
								}
							}
						}
					}
					e.removeClass("waiting")
				}, this), "json")
			}, this));
			this.verifyCon.delegate("._j_fre_text", "keyup", $.proxy(function(e) {
				if (e.keyCode == 13) {
					this.verifyCon.find("._j_fre_confirm").trigger("click")
				}
			}, this))
		},
		showErro: function(e) {
			this.errorCon.html(e);
			this.errorCon.show()
		},
		hideErro: function() {
			this.errorCon.hide()
		},
		initData: function() {
			this.verifyCon = this.container;
			this.verifyPo = this.verifyCon.find(".protectedYZM");
			this.verifyImg = this.verifyCon.find("img");
			this.verifyText = this.verifyCon.find("._j_fre_text");
			this.errorCon = this.verifyPo.find(".n-error")
		},
		refreshImg: function() {
			var e = "/user/captcha/code?iApp=" + this.app + "&s=" + new Date().getTime();
			this.verifyImg.attr("src", e)
		}
	};
	d.exports = a
});
M.define("FrequencyAppVerify", function(e, c, f) {
	var b = e("FrequencyVerifyControl");
	var d = 0,
		g = '<div class="popYzm _j_fre_verify_',
		a = '"><div class="protectedYZM"><p>亲爱的蜂蜂，你发表速度有点像机器人<br>来证明下自己吧~</p><div class="YZMInput"><input class="_j_fre_text" type="text" placeHolder="验证码"></div><div class="YZMInput"><img src="http://images.mafengwo.net/images/home_new2015/verify.gif" width="150px" height="40px"><label><a href="javascript:void(0);" class="_j_change_img">看不清，换一张</a></label></div><div class="YZMSubmit"><a href="javascript:void(0);" class="_j_fre_confirm" title="确定">确定</a><span class="n-error">错误次数过多，请稍候尝试</span></div></div></div>';

	function h(i) {
		this.target = i.target;
		this.content = i.content;
		this.app = i.app;
		this.left = i.left;
		this.top = i.top;
		this.successHandler = $.noop;
		M.mix(this, i);
		this.init()
	}
	h.prototype = {
		init: function() {
			$("body").append(g + d + a);
			this.initData();
			this.initPostion();
			this._baseFrequency = new b({
				container: this.verifyCon,
				app: this.app,
				successHandler: $.proxy(function() {
					M.Event.fire("frequency:app:verify:success");
					this.verifyCon.remove();
					this.successHandler(this.target)
				}, this)
			});
			d++
		},
		initData: function() {
			this.verifyCon = $("._j_fre_verify_" + d);
			this.verifyCon.find("p").html(this.content);
			this.verifyPo = this.verifyCon.find(".protectedYZM")
		},
		initPostion: function() {
			var o = this.target.offset().left;
			if (typeof this.top === "undefined") {
				var i = this.target.offset().top
			} else {
				var i = this.top;
				this.verifyCon.css("position", "fixed")
			}
			var p = this.target.outerHeight();
			var l = this.target.outerWidth();
			this.verifyCon.css({
				left: o + "px",
				top: i + "px"
			});
			var j = $(document).width();
			var k = $(document).height();
			var q = "l";
			if (o > j / 2) {
				q = "r"
			}
			var n = "t";
			if (i > k / 2) {
				n = "b"
			}
			var m = "";
			if (q == "l" && n == "t") {
				if (i > 200) {
					m = "atTop"
				} else {
					this.verifyCon.css({
						top: (i + p + 5) + "px"
					})
				}
			} else {
				if (q == "r" && n == "t") {
					if (i > 200) {
						m = "atTopRight"
					} else {
						m = "atRight"
					}
					this.verifyCon.css({
						left: (o + l) + "px"
					})
				} else {
					if (q == "r" && n == "b") {
						m = "atTopRight";
						this.verifyCon.css({
							left: (o + l) + "px"
						})
					} else {
						m = "atTop"
					}
				}
			}
			if (m.length > 0) {
				this.verifyPo.addClass(m)
			}
		},
		show: function() {
			this.verifyCon.show();
			return this
		},
		hide: function() {
			this.verifyCon.hide();
			return this
		},
		refreshImg: function() {
			this._baseFrequency.refreshImg();
			return this
		},
		destroy: function() {
			this.verifyCon.undelegate();
			this.verifyCon.remove();
			this.verifyCon = null;
			M.Event(this).fire("afterdestroy")
		}
	};
	f.exports = h
});
M.closure(function(k) {
	k("jq-tmpl");
	k("/js/jquery.scrollTo.js");
	var e = k("Suggestion"),
		g = k("dialog/Dialog"),
		l = k("dialog/alert");
	var x = true;
	j();
	M.Event.on("mobile:bind:succ", function() {
		if (window.Env.publish_num <= 3 && window.Env.user_lv > 3) {
			window.Env.remain_num += 2
		}
		A.hide()
	});
	var r = $("._j_title");
	r.keyup(function() {
		o()
	}).blur(function() {
		o();
		d(r.val())
	});
	$("#_j_show_content").click(function(H) {
		$(H.currentTarget).toggleClass("active");
		$("#_js_answerText").slideToggle()
	});
	var a = $("#_qa_mdd_tmpl"),
		z = $("#_qa_select_mdds_list"),
		w = $("#_qa_select_mdds"),
		t = w.find("._qa_mddselect_position"),
		u = t.children("a"),
		y = t.children("span"),
		s = $("._qa_ajax_loading"),
		i = {},
		n = k("ScrollBar"),
		C = new n({
			container: ".qt-place",
			barTPL: '<div style="position:absolute; top:0; right:0; padding:1px"><div style="width:5px; height:100%; background:#ccc;border-radius: 10px;"></div></div>',
			maxHeight: "170px"
		}),
		m = $("._j_mdd"),
		D = {
			url: "/qa/ajax_qa/searchMdd",
			input: $("._j_mdd"),
			listItemHoverClass: "on",
			listContainer: $("._j_mdd_option"),
			listItemSelector: "._j_mdd_item",
			keyParamName: "key",
			dataType: "json",
			handleSuggest: function(K) {
				var I = K.data;
				this.input.data("droplist")["firstItemHover"] = true;
				if (I.length) {
					var H = [];
					for (var J = 0; J < I.length; J++) {
						H.push('<li data-mddid="' + I[J]["mddid"] + '" data-name="' + I[J]["mddname"] + '" class="_j_mdd_item"><span>' + I[J]["mddname"] + "</span>&nbsp;&nbsp;" + I[J]["pname"] + "</li>")
					}
					return H.join("")
				}
			},
			updateList: function(H) {
				this.listContainer.html(H)
			}
		},
		G = new e(D);
	M.forEach(window.Env.mdds, function(I, H) {
		i[H] = {
			name: I.name
		}
	});
	M.Event(G).on("itemselected", function(H) {
		if (H.item && $(H.item.get(0)).data("name")) {
			m.val($(H.item.get(0)).data("name"))
		}
	});
	m.keyup(function() {
		$("._j_mdd_list_div").hide()
	}).blur(function() {}).click(function(H) {
		H.stopPropagation();
		$("._j_mdd_list_div").show()
	});
	v("_qa_hot");
	w.on("click", "._j_mdd_tap_ul li", function(I) {
		I.stopPropagation();
		var J = $(I.currentTarget);
		var H = J.data("id");
		J.addClass("on").siblings(".on").removeClass("on");
		t.hide();
		if (H in window) {
			E(window[H])
		} else {
			v(H)
		}
	}).on("click", ".qt-place-item a", function(J) {
		J.stopPropagation();
		var K = $(J.currentTarget);
		var L = K.data("areaid");
		var H = "";
		var I = K.data("continentid");
		if (L) {
			p(L, I, K.text());
			H = "_qa_" + L;
			if (H in window) {
				E(window[H])
			} else {
				v("", L, I)
			}
		} else {
			m.val(K.text()).blur();
			$("._j_mdd_list_div").hide()
		}
	});
	$("#_qa_interest").delegate("._j_interest", "click", function() {
		var H = this;
		$("._j_interest.on").each(function(I, J) {
			if (J !== H) {
				$(J).removeClass("on")
			}
		});
		$(this).toggleClass("on")
	});
	$("._j_anonymous").click(function(H) {
		var I = $(H.currentTarget);
		if (I.hasClass("active")) {
			I.removeClass("active")
		} else {
			I.addClass("active")
		}
	});
	$("._j_mobile").click(function(H) {
		var I = $(H.currentTarget);
		I.toggleClass("active");
		if (I.hasClass("active")) {
			if (!$("._j_change_mobile").data("bind")) {
				I.removeClass("active");
				h(1)
			}
		}
	});
	$("._j_change_mobile").click(function() {
		h(1)
	});
	$("._j_publish").click(function() {
		var O = $(this);
		if (!O.hasClass("loading")) {
			if (!o(true)) {
				return
			}
			var P = $("._j_title").val();
			var H = $($("#_js_editorText").data("wysiwyg").wysiwygeditor.getElement());
			if (H.find(".loading").length) {
				l.pop("图片还在旋转中，请稍等下再提交");
				return
			}
			c(H);
			var K = H.html();
			if (B(m.val()) <= 0 && !$("._j_interest.on").length) {
				l.pop("目的地和兴趣标签必须有一个填写或选中!");
				return
			}
			var N = $("._j_mdd").val(),
				I = $("._j_interest.on").first().data("id"),
				L = $("._j_anonymous").hasClass("active") ? 1 : 0,
				J = $("._j_mobile").hasClass("active") ? 1 : 0;
			O.addClass("loading");
			$.post("/qa/ajax_qa/publish", {
				title: P,
				content: K,
				mdd_name: N,
				interests: I,
				sms_remind: J,
				ask_uid: $("._j_info").data("ask_uid"),
				anonymous: L
			}, function(Q) {
				O.removeClass("loading");
				if (Q) {
					if (Q.error) {
						if (Q.error.code == 10001) {
							var R = k("FrequencyAppVerify");
							new R({
								target: O,
								app: 11,
								content: "亲爱的蜂蜂，你提问的速度有点像机器人<br>来证明下自己吧~",
								successHandler: function() {
									O.trigger("click")
								}
							})
						} else {
							if (Q.error.code == 23) {
								h(0)
							} else {
								l.pop(Q.error.msg)
							}
						}
					} else {
						l.pop("恭喜,提问成功!", function() {
							window.location.href = "/wenda/detail-" + Q.data.qid + ".html"
						}, 3)
					}
				}
			}, "json")
		}
	});
	$("body").click(function() {
		$("._j_mdd_list_div").hide()
	});
	var A = null;

	function h(H) {
		window.location.href = "https://passport.mafengwo.cn/setting/security/mobile/?type=change";
		return;
		$.get("/qa/ajax_qa/bindMobileDialog", {
			flag: H
		}, function(I) {
			if (!I.error && I.data.html) {
				A = new g({
					content: I.data.html,
					stackable: false,
					background: "#000",
					bgOpacity: 0.7
				});
				A.show();
				M.Event(A).on("beforeclose", function() {
					j()
				})
			}
		}, "json")
	}

	function j() {
		if (x) {
			x = false;
			if (window.Env.user_lv <= 3) {
				if (window.Env.publish_num >= 3) {
					l.pop("今日提问次数已用完~明日再来哦~", function() {
						window.location.href = "/wenda/"
					})
				} else {
					if (!window.Env.bind_mobile) {
						h(1)
					}
				}
			} else {
				if (!window.Env.bind_mobile) {
					if (window.Env.publish_num >= 3) {
						h(0)
					} else {
						h(1)
					}
				} else {
					if (window.Env.publish_num >= 5) {
						l.pop("今日提问次数已用完~明日再来哦~", function() {
							window.location.href = "/wenda/"
						})
					}
				}
			}
		} else {
			if (window.Env.remain_num <= 0) {
				window.location.href = "/wenda/"
			}
		}
	}

	function o(J) {
		var I = B(r.val());
		$("._j_title_num").html(I);
		if (I < 10 || I > 80) {
			var H = I < 10 ? "标题不能少于10字" : "标题不能多于80字";
			$("._j_title_error").removeClass("hide").html(H);
			if (J) {
				l.pop(H, function() {
					$.scrollTo($("._j_title").offset().top - 50)
				});
				return false
			} else {
				return true
			}
		} else {
			$("._j_title_error").addClass("hide");
			return true
		}
	}

	function d(H) {
		$.get("/qa/ajax_qa/text2Tag", {
			text: H
		}, function(J) {
			if (!J.error && J.data) {
				if (J.data.match_mdd) {
					m.val(J.data.match_mdd)
				}
				if (J.data.topic_select_index) {
					var I = $('._j_interest[data-id="' + J.data.topic_select_index + '"]');
					if (I.length) {
						I.addClass("on").siblings(".on").removeClass("on")
					}
				}
			}
		}, "json")
	}

	function v(H, N, K) {
		var J = H != "_qa_hot" ? window.Env.mdds : window.Env.hotMdds;
		var I = "";
		var L = false;
		var O = "";
		if (H == "_qa_hot") {
			I = F({
				aMddInfos: J
			})
		}
		if (H == "_qa_china") {
			I = F({
				areaName: "国内",
				aMddInfos: J["17341"]["country_mdds"]["17348"]["province_mdds"]
			}, 1)
		} else {
			if (H == "_qa_international") {
				I = F({
					areaName: "国际",
					aMddInfos: i
				}, 1)
			} else {
				if (N) {
					if (N in J) {
						I = F({
							areaName: J[N].name,
							continentId: N,
							aMddInfos: J[N]["country_mdds"]
						}, 1)
					} else {
						if (N == 17348) {
							$('._j_mdd_tap_ul li[data-id="_qa_china"]').trigger("click");
							return
						}
						L = true;
						O = K ? J[K]["country_mdds"][N]["name"] : J["17341"]["country_mdds"]["17348"]["province_mdds"][N]["name"];
						f(N, O)
					}
					if (L) {
						return
					}
					H = "_qa_" + N
				}
			}
		}
		b(H, I)
	}

	function f(I, K, J) {
		var H = null;
		s.addClass("animationing").show();
		$.get("/qa/publish/getRegionMdd", {
			regionid: I
		}, function(L) {
			s.hide().removeClass("animationing");
			if (L) {
				if (L.data && L.data.length) {
					H = F({
						areaName: K,
						aMddInfos: L.data,
						can_add: "1"
					})
				} else {
					H = "抱歉，该地区还没有可用数据！"
				}
				b("_qa_" + I, H);
				J && J()
			}
		}, "json")
	}

	function b(H, I) {
		E(I);
		q(H, I)
	}

	function E(H) {
		setTimeout(function() {
			z.html(H);
			C.setScrollBar()
		}, 10)
	}

	function F(I, H) {
		M.forEach(I.aMddInfos, function(K, J) {
			H && (K.areaid = J)
		});
		return a.tmpl(I)
	}

	function q(H, I) {
		if (H in window || !H) {
			return
		} else {
			window[H] = I || z.html()
		}
	}

	function p(L, K, H, I) {
		var J = w.find("._qa_select_tab").children(".on");
		u.eq(0).text(J.text()).data("id", J.data("id"));
		y.eq(2).text(H);
		if (I) {
			u.eq(0).hide();
			y.eq(0).hide()
		} else {
			u.eq(0).show();
			y.eq(0).show()
		}
		if (L == 17348) {
			t.hide();
			return
		}
		if (K) {
			u.eq(1).html(window.Env.mdds[K].name).show().data("id", K);
			y.eq(1).show()
		} else {
			u.eq(1).hide();
			y.eq(1).hide()
		}
		t.show()
	}

	function B(J) {
		J = $.trim(J);
		var H = 0;
		for (var I = 0; I < J.length; I++) {
			H += J.charCodeAt(I) > 0 && J.charCodeAt(I) < 255 ? 0.5 : 1
		}
		return Math.ceil(H)
	}

	function c(H) {
		var I = H.find("._js_placeHolderBR");
		if (I.length) {
			I.each(function(J, K) {
				$(K).remove()
			})
		}
	}
});
M.define("PageAdmin", function(b) {
	var e = {},
		c = d();
	e.uuid = window.Env && window.Env.uPageId || a();

	function a() {
		var f = c();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(h) {
			var g = (f + Math.random() * 16) % 16 | 0;
			f = Math.floor(f / 16);
			return (h === "x" ? g : (g & 3 | 8)).toString(16)
		})
	}

	function d() {
		var f = window.performance || {},
			g = f.now || f.mozNow || f.msNow || f.oNow || f.webkitNow || Date.now || function() {
				return new Date().getTime()
			};
		return g
	}
	return e
});
M.define("Cookie", function(f, h, e) {
	var g = /\+/g;
	var i = navigator.cookieEnabled;
	if (!i) {
		document.cookie = "__detectCookieEnabled=1;";
		i = document.cookie.indexOf("__detectCookieEnabled") != -1 ? true : false;
		if (i) {
			document.cookie = "__detectCookieEnabled=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
		}
	}
	if (!i) {
		return {
			isSupport: false
		}
	}
	var d = {
		isSupport: true,
		set: function(m, n, k) {
			k = (typeof k == "object" && k !== null) ? k : {};
			if (typeof k.expires === "number") {
				var o = k.expires,
					l = k.expires = new Date();
				l.setTime(+l + o * 1000)
			}
			return (document.cookie = [j(m), "=", j(String(n)), k.expires ? "; expires=" + k.expires.toUTCString() : "", k.path ? "; path=" + k.path : "", k.domain ? "; domain=" + k.domain : "", k.secure ? "; secure" : ""].join(""))
		},
		get: function(q) {
			var k = q ? undefined : {};
			var r = document.cookie ? document.cookie.split("; ") : [];
			for (var p = 0, m = r.length; p < m; p++) {
				var s = r[p].split("=");
				var n = a(s.shift());
				var o = s.join("=");
				if (q && q === n) {
					k = b(o);
					break
				}
				if (!q && (o = b(o)) !== undefined) {
					k[n] = o
				}
			}
			return k
		},
		remove: function(l, k) {
			if (this.get(l) === undefined) {
				return false
			}
			k = (typeof k == "object" && k !== null) ? k : {};
			k.expires = -1;
			this.set(l, "", k)
		}
	};

	function j(k) {
		return encodeURIComponent(k)
	}

	function a(k) {
		return decodeURIComponent(k)
	}

	function c(k) {
		if (k.indexOf('"') === 0) {
			k = k.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
		}
		try {
			k = decodeURIComponent(k.replace(g, " "));
			return k
		} catch (l) {}
	}

	function b(k) {
		var l = c(k);
		return l
	}
	e.exports = d
});
M.define("ResourceKeeper", function(d) {
	var m = b();
	if (!m) {
		return {
			isSupport: false
		}
	}
	var c = [];
	if (window.addEventListener) {
		window.addEventListener("onbeforeunload", l, false)
	} else {
		if (window.attachEvent) {
			window.attachEvent("onbeforeunload", l)
		}
	}

	function l() {
		M.forEach(c, function(n) {
			n.release()
		})
	}
	var e = d("PageAdmin").uuid,
		j = "default_resource",
		h = "__resource_keeper",
		f = 1000,
		k = 2000;

	function a(n) {
		n = "" + n;
		n = n || j;
		this.keeping = false;
		this.resourceKeeperStorageKey = h + "_" + n;
		this.keepingRefreshInterval = 0;
		this._initStorageListener();
		c.push(this)
	}
	M.mix(a.prototype, {
		keep: function() {
			this._requestKeep();
			return this.keeping
		},
		forceKeep: function(n) {
			this._startKeep(n)
		},
		release: function() {
			if (this.keeping) {
				var n = +new Date(),
					o = g(this.resourceKeeperStorageKey);
				if (o.currentKeeperPageUUID == e && o.expire > n) {
					m.remove(this.resourceKeeperStorageKey);
					this._setKeeping(false)
				}
			}
		},
		_initStorageListener: function() {
			M.Event(m).on("resource_keeper_change", M.bind(function(n) {
				if (this.keeping && n.key == this.resourceKeeperStorageKey && n.pageUUID && n.pageUUID != e) {
					this._setKeeping(false)
				}
			}, this))
		},
		_requestKeep: function() {
			var n = +new Date(),
				o = g(this.resourceKeeperStorageKey);
			if (!o.currentKeeperPageUUID || o.currentKeeperPageUUID == e || o.expire <= n) {
				this._startKeep(n)
			} else {
				this._setKeeping(false)
			}
		},
		_startKeep: function(n) {
			n = n || +new Date();
			var o = n + k;
			m.set(this.resourceKeeperStorageKey, e + ":" + o);
			this._setKeeping(true)
		},
		_setKeeping: function(n) {
			this.keeping = n;
			if (this.keeping) {
				this._startKeepingRefreshRequest()
			} else {
				this._stopKeepingRefreshRequest()
			}
		},
		_startKeepingRefreshRequest: function() {
			clearInterval(this.keepingRefreshInterval);
			this.keepingRefreshInterval = setInterval(M.bind(this._requestKeep, this), f)
		},
		_stopKeepingRefreshRequest: function() {
			clearInterval(this.keepingRefreshInterval)
		}
	});

	function b() {
		var o = null,
			p = d("Storage");
		if (p && p.isSupport) {
			o = {
				set: M.bind(p.setItem, p),
				get: M.bind(p.getItem, p),
				remove: M.bind(p.removeItem, p)
			};
			if (window.addEventListener) {
				window.addEventListener("storage", function(r) {
					var q = r.key;
					if (q.indexOf(h) === 0) {
						var t = "";
						if (r.newValue) {
							var s = r.newValue.split(":");
							if (s.length == 2) {
								t = s[0]
							}
						}
						M.Event(o).fire("resource_keeper_change", {
							key: q,
							pageUUID: t
						})
					}
				}, false)
			}
		} else {
			var n = d("Cookie");
			if (n && n.isSupport) {
				o = {
					set: function(q, r) {
						return n.set(q, r, k)
					},
					get: M.bind(n.get, n),
					remove: M.bind(n.remove, n)
				}
			}
		}
		return o
	}

	function g(p) {
		var o = {
				currentKeeperPageUUID: "",
				expire: 0
			},
			n = m.get(p);
		if (n) {
			n = n.split(":");
			o.currentKeeperPageUUID = n[0];
			o.expire = +n[1]
		}
		return o
	}

	function i(o) {
		var n = new a(o);
		return {
			keep: M.bind(n.keep, n),
			forceKeep: M.bind(n.forceKeep, n),
			release: M.bind(n.release, n)
		}
	}
	i.isSupport = true;
	return i
});
(function(a) {
	a.jGrowl = function(b, c) {
		if (a("#jGrowl").size() == 0) {
			a('<div id="jGrowl"></div>').addClass((c && c.position) ? c.position : a.jGrowl.defaults.position).appendTo("body")
		}
		a("#jGrowl").jGrowl(b, c)
	};
	a.fn.jGrowl = function(b, d) {
		if (a.isFunction(this.each)) {
			var c = arguments;
			return this.each(function() {
				var e = this;
				if (a(this).data("jGrowl.instance") == undefined) {
					a(this).data("jGrowl.instance", a.extend(new a.fn.jGrowl(), {
						notifications: [],
						element: null,
						interval: null
					}));
					a(this).data("jGrowl.instance").startup(this)
				}
				if (a.isFunction(a(this).data("jGrowl.instance")[b])) {
					a(this).data("jGrowl.instance")[b].apply(a(this).data("jGrowl.instance"), a.makeArray(c).slice(1))
				} else {
					a(this).data("jGrowl.instance").create(b, d)
				}
			})
		}
	};
	a.extend(a.fn.jGrowl.prototype, {
		defaults: {
			pool: 0,
			header: "",
			group: "",
			sticky: false,
			position: "top-right",
			glue: "after",
			theme: "default",
			themeState: "highlight",
			corners: "10px",
			check: 250,
			life: 3000,
			closeDuration: "normal",
			openDuration: "normal",
			easing: "swing",
			closer: true,
			closeTemplate: "&times;",
			closerTemplate: "<div>[ 关闭 ]</div>",
			log: function(c, b, d) {},
			beforeOpen: function(c, b, d) {},
			afterOpen: function(c, b, d) {},
			open: function(c, b, d) {},
			beforeClose: function(c, b, d) {},
			close: function(c, b, d) {},
			animateOpen: {
				opacity: "show"
			},
			animateClose: {
				opacity: "hide"
			}
		},
		notifications: [],
		element: null,
		interval: null,
		create: function(b, c) {
			var c = a.extend({}, this.defaults, c);
			if (typeof c.speed !== "undefined") {
				c.openDuration = c.speed;
				c.closeDuration = c.speed
			}
			this.notifications.push({
				message: b,
				options: c
			});
			c.log.apply(this.element, [this.element, b, c])
		},
		render: function(d) {
			var b = this;
			var c = d.message;
			var e = d.options;
			var d = a('<div class="jGrowl-notification ' + e.themeState + " ui-corner-all" + ((e.group != undefined && e.group != "") ? " " + e.group : "") + '"><div class="jGrowl-close">' + e.closeTemplate + '</div><div class="jGrowl-header">' + e.header + '</div><div class="jGrowl-message">' + c + "</div></div>").data("jGrowl", e).addClass(e.theme).children("div.jGrowl-close").bind("click.jGrowl", function() {
				a(this).parent().trigger("jGrowl.close")
			}).parent();
			a(d).bind("mouseover.jGrowl", function() {
				a("div.jGrowl-notification", b.element).data("jGrowl.pause", true)
			}).bind("mouseout.jGrowl", function() {
				a("div.jGrowl-notification", b.element).data("jGrowl.pause", false)
			}).bind("jGrowl.beforeOpen", function() {
				if (e.beforeOpen.apply(d, [d, c, e, b.element]) != false) {
					a(this).trigger("jGrowl.open")
				}
			}).bind("jGrowl.open", function() {
				if (e.open.apply(d, [d, c, e, b.element]) != false) {
					if (e.glue == "after") {
						a("div.jGrowl-notification:last", b.element).after(d)
					} else {
						a("div.jGrowl-notification:first", b.element).before(d)
					}
					a(this).animate(e.animateOpen, e.openDuration, e.easing, function() {
						if (a.browser.msie && (parseInt(a(this).css("opacity"), 10) === 1 || parseInt(a(this).css("opacity"), 10) === 0)) {
							this.style.removeAttribute("filter")
						}
						a(this).data("jGrowl").created = new Date();
						a(this).trigger("jGrowl.afterOpen")
					})
				}
			}).bind("jGrowl.afterOpen", function() {
				e.afterOpen.apply(d, [d, c, e, b.element])
			}).bind("jGrowl.beforeClose", function() {
				if (e.beforeClose.apply(d, [d, c, e, b.element]) != false) {
					a(this).trigger("jGrowl.close")
				}
			}).bind("jGrowl.close", function() {
				a(this).data("jGrowl.pause", true);
				a(this).animate(e.animateClose, e.closeDuration, e.easing, function() {
					a(this).remove();
					var f = e.close.apply(d, [d, c, e, b.element]);
					if (a.isFunction(f)) {
						f.apply(d, [d, c, e, b.element])
					}
				})
			}).trigger("jGrowl.beforeOpen");
			if (e.corners != "" && a.fn.corner != undefined) {
				a(d).corner(e.corners)
			}
			if (a("div.jGrowl-notification:parent", b.element).size() > 1 && a("div.jGrowl-closer", b.element).size() == 0 && this.defaults.closer != false) {
				a(this.defaults.closerTemplate).addClass("jGrowl-closer ui-state-highlight ui-corner-all").addClass(this.defaults.theme).appendTo(b.element).animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing).bind("click.jGrowl", function() {
					a(this).siblings().trigger("jGrowl.beforeClose");
					if (a.isFunction(b.defaults.closer)) {
						b.defaults.closer.apply(a(this).parent()[0], [a(this).parent()[0]])
					}
				})
			}
		},
		update: function() {
			a(this.element).find("div.jGrowl-notification:parent").each(function() {
				if (a(this).data("jGrowl") != undefined && a(this).data("jGrowl").created != undefined && (a(this).data("jGrowl").created.getTime() + parseInt(a(this).data("jGrowl").life)) < (new Date()).getTime() && a(this).data("jGrowl").sticky != true && (a(this).data("jGrowl.pause") == undefined || a(this).data("jGrowl.pause") != true)) {
					a(this).trigger("jGrowl.beforeClose")
				}
			});
			if (this.notifications.length > 0 && (this.defaults.pool == 0 || a(this.element).find("div.jGrowl-notification:parent").size() < this.defaults.pool)) {
				this.render(this.notifications.shift())
			}
			if (a(this.element).find("div.jGrowl-notification:parent").size() < 2) {
				a(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose, this.defaults.speed, this.defaults.easing, function() {
					a(this).remove()
				})
			}
		},
		startup: function(b) {
			this.element = a(b).addClass("jGrowl").append('<div class="jGrowl-notification"></div>');
			this.interval = setInterval(function() {
				a(b).data("jGrowl.instance").update()
			}, parseInt(this.defaults.check));
			if (a.browser.msie && parseInt(a.browser.version) < 7 && !window.XMLHttpRequest) {
				a(this.element).addClass("ie6")
			}
		},
		shutdown: function() {
			a(this.element).removeClass("jGrowl").find("div.jGrowl-notification").remove();
			clearInterval(this.interval)
		},
		close: function() {
			a(this.element).find("div.jGrowl-notification").each(function() {
				a(this).trigger("jGrowl.beforeClose")
			})
		}
	});
	a.jGrowl.defaults = a.fn.jGrowl.prototype.defaults
})(jQuery);
if (window.M && typeof window.M.define == "function") {
	window.M.define("jq-jgrowl", function() {
		return jQuery
	})
}
M.closure(function(e) {
	var j = e("ResourceKeeper"),
		t = j.isSupport ? new j("new_msg_loop") : null,
		s = e("Storage"),
		b = 1000,
		r = 10000,
		u = 40000,
		d = 120000;
	var v = (function() {
		if (j.isSupport) {
			return $.proxy(t.keep, t)
		} else {
			return function() {
				return M.windowFocused
			}
		}
	}());
	var k = function() {
		if (j.isSupport) {
			t.forceKeep()
		}
	};
	if ("addEventListener" in window) {
		window.addEventListener("focus", k, false)
	} else {
		if ("attachEvent" in document) {
			document.attachEvent("onfocusin", k)
		}
	}
	$(function() {
		if (window.Env && window.Env.UID > 0 || window.__mfw_uid > 0) {
			setTimeout(n, b)
		} else {
			setTimeout(l, r)
		}
		$("body").delegate(".jGrowl-closer", "click", function(x) {
			$.getJSON("/ajax/ajax_msg.php", {
				a: "closetip"
			});
			s.setItem("jgrowl_close_time", +new Date())
		});
		M.Event.on("update msg", function() {
			setTimeout(function() {
				w();
				s.setItem("update_msg", +new Date())
			}, 1)
		});
		s.on("update_msg", function(x) {
			w()
		});

		function w() {
			if (window.Env && window.Env.UID > 0 || window.__mfw_uid > 0) {
				p("msgdisplay")
			} else {
				p("nologinfeed")
			}
		}
	});

	function n() {
		setInterval(function() {
			v() && p("msgdisplay")
		}, u)
	}

	function l() {
		var x, w = 1;
		v() && p("nologinfeed");
		x = setInterval(function() {
			v() && p("nologinfeed");
			w++;
			if (w == 3) {
				clearInterval(x)
			}
		}, d)
	}

	function p(w) {
		$.get("/ajax/ajax_msg.php?a=" + w, function(x) {
			if (x) {
				o(x)
			}
		}, "json")
	}

	function o(w) {
		g();
		M.Event.fire("get new msg", w);
		if (w.msg) {
			m()
		}
		if (w.tips && !i()) {
			a(w)
		}
	}
	e("jq-jgrowl");

	function a(w) {
		var x = w.tips.split(w.split_char);
		M.forEach(x, function(z, y) {
			if (z) {
				setTimeout(function() {
					$.jGrowl(z, {
						header: "新鲜事：",
						closer: false,
						life: 20000
					})
				}, 2000 * y + 10)
			}
		})
	}

	function i() {
		var x = s.getItem("jgrowl_close_time"),
			w = +new Date();
		if (x && w - x < 24 * 60 * 60 * 1000) {
			return true
		}
		return false
	}
	var c, f = 0,
		h = 1000,
		q = document.title;

	function m() {
		g();
		c = setInterval(function() {
			if (v()) {
				f++;
				document.title = f % 2 === 0 ? "【　　　】 - " + q : "【新消息】 - " + q
			} else {
				document.title = q
			}
		}, h)
	}

	function g() {
		clearInterval(c);
		document.title = q
	}
});
M.define("FrequencySystemVerify", function(f, e, g) {
	var b = f("dialog/Dialog"),
		h = f("dialog/Layer"),
		d = f("FrequencyVerifyControl");
	var a = '<div class="popYzm" style="z-index:inherit;position: relative;width:350px;height: 250px"><div class="protectedYZM" style="border: none;box-shadow: none;padding:25px 15px;"><p>亲爱的蜂蜂，你操作的速度有点像机器人<br>来证明下自己吧~</p><div class="YZMInput"><input class="_j_fre_text" type="text" placeHolder="验证码"></div><div class="YZMInput"><img src="http://images.mafengwo.net/images/home_new2015/verify.gif" width="150px" height="40px"><label><a href="javascript:void(0);" class="_j_change_img">看不清，换一张</a></label></div><div class="YZMSubmit"><a href="javascript:void(0);" class="_j_fre_confirm" title="确定">确定</a><span class="n-error">错误次数过多，请稍候尝试</span></div></div></div>';

	function c(i) {
		this.app = i.app;
		this.init()
	}
	c.prototype = {
		init: function() {
			var i = new b({
				content: a
			});
			if (h.getActive()) {
				i.getLayer().setZIndex(h.getActive().getZIndex() + 1)
			}
			i.show();
			var j = i.getPanel().find(".popYzm");
			new d({
				container: j,
				app: this.app,
				successHandler: $.proxy(function() {
					M.Event.fire("frequency:system:verify:success");
					i.close()
				}, this)
			})
		}
	};
	g.exports = c
});
M.closure(function(d) {
	var b = d("dialog/Dialog"),
		c = d("FrequencySystemVerify");
	window.show_login = a;
	$.ajaxSetup({
		dataFilter: function(h, g) {
			try {
				var j = $.parseJSON(h);
				if (j && j.unsafe == 1) {
					window.location.href = "http://www.mafengwo.cn";
					return "{}"
				}
				if (j && j.error && j.error.msg == "login:required") {
					M.Event.fire("login:required");
					return "{}"
				}
				if (j && j.resource && j.resource.onload && j.resource.onload.length) {
					if (j.resource.onload[0] == 'K.fire("login:required");') {
						M.Event.fire("login:required");
						return "{}"
					}
				}
				if (j && j.error) {
					var f = 0;
					var k = 0;
					if (typeof(j.error.errno) !== "undefined") {
						f = j.error.errno;
						k = j.error.error
					} else {
						if (typeof(j.error.code) !== "undefined") {
							f = j.error.code;
							k = j.error.msg
						}
					}
					if (f === 10000) {
						M.Event.fire("frequency:verify", k);
						return "{}"
					}
				}
			} catch (i) {}
			return h
		},
		error: function(f) {
			if (f.status == 401) {
				if (f.responseJSON && f.responseJSON.data && f.responseJSON.data.auth_type == "login") {
					M.Event.fire("login:required")
				}
			}
		}
	});
	var e = null;

	function a() {
		if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
			document.location.href = (window.Env && window.Env.P_HTTP) || "https://passport.mafengwo.cn";
			return
		}
		if (!e) {
			e = new b({
				PANEL_CLASS: "login_pop",
				content: '<iframe frameborder="no" border="0" scrolling="no" width="580" height="292" allowtransparency="true"></iframe>',
				background: "#aaa",
				bgOpacity: 0.6,
				reposition: true,
				impl: "logindialog"
			})
		}
		e.show();
		if (!e.getPanel().find("iframe").attr("src")) {
			M.Event(e).once("aftershow", function() {
				var f = window.Env.P_HTTP || "https://passport.mafengwo.cn";
				e.getPanel().find("iframe").attr("src", f + "/login-popup.html")
			})
		}
	}
	M.Event.on("login:required", a);
	M.Event.on("frequency:verify", function(f) {
		new c({
			app: f
		})
	});
	if (M.Event.isFired("login:required")) {
		a()
	}
});
M.define("ScrollObserver", function(e, g, c) {
	var h = 0,
		f = {},
		a = false,
		b, d = true;
	g.addObserver = function(k) {
		var j = "ScrollObserver_" + h;
		h++;
		f[j] = k;
		d = false;
		return j
	};
	g.removeObserver = function(j) {
		delete f[j];
		if (M.isEmpty(f)) {
			d = true
		}
	};

	function i() {
		for (var j in f) {
			if (f.hasOwnProperty(j)) {
				f[j]()
			}
		}
	}
	$(window).scroll(function() {
		if (d) {
			return
		}
		if (!a) {
			b = setInterval(function() {
				if (a) {
					a = false;
					clearTimeout(b);
					i()
				}
			}, 50)
		}
		a = true
	});
	return g
});
M.define("QRCode", function(b, a, c) {
	c.exports = {
		gen: function(e, d) {
			var d = {
				text: e,
				size: d.size || 200,
				eclevel: d.evlevel || "H",
				logo: d.logo || "",
				__stk__: window.Env.CSTK
			};
			return "http://" + window.Env.WWW_HOST + "/qrcode.php?" + $.param(d)
		}
	}
});
M.closure(function(b) {
	var l = b("ScrollObserver"),
		m = b("Storage"),
		d = window.Env || {},
		f = $("#_j_mfwtoolbar"),
		h = f.height(),
		a = $(window).height(),
		k = $(document).height(),
		g = $("#footer"),
		e = g.outerHeight();
	$("body").css("position", "relative");
	$(window).resize(function() {
		a = $(window).height();
		k = $(document).height()
	});
	setInterval(function() {
		var n = $(document).height();
		if (n != k) {
			k = n;
			$(window).trigger("scroll")
		}
	}, 2000);
	if (!d.hideToolbar) {
		if (!d.showToolbarDownArrow) {
			f.children(".toolbar-item-down").remove()
		} else {
			f.children(".toolbar-item-down").show()
		}
		f.show();
		c();
		l.addObserver(c);
		f.on("click", "._j_gotop", i);
		f.on("click", "._j_gobottom", j);
		f.children(".toolbar-item-code").mouseenter(function() {
			$(this).addClass("hover")
		});
		f.children(".toolbar-item-code").mouseleave(function() {
			$(this).removeClass("hover")
		})
	}

	function c() {
		var n = $(window).scrollTop();
		if (n > 500) {
			f.children(".toolbar-item-top").show()
		} else {
			f.children(".toolbar-item-top").hide()
		}
		if (g.length) {
			if (n + a > g.offset().top) {
				f.css({
					position: "absolute",
					bottom: e + 20
				})
			} else {
				f.css({
					position: "",
					bottom: ""
				})
			}
		}
	}

	function i() {
		$("html, body").animate({
			scrollTop: 0
		}, 500, function() {
			M.Event.fire("scroll to top")
		})
	}

	function j() {
		$("html, body").animate({
			scrollTop: k - a
		}, 500, function() {
			M.Event.fire("scroll to bottom")
		})
	}
});
(function() {
	var a = document.createElement("script"),
		b = window.Env && window.Env.CNZZID || 30065558;
	a.type = "text/javascript";
	a.async = true;
	a.charset = "utf-8";
	a.src = document.location.protocol + "//w.cnzz.com/c.php?id=" + b + "&async=1";
	var c = document.getElementsByTagName("script")[0];
	c.parentNode.insertBefore(a, c)
})();
M.closure(function(a) {
	M.log("只要你有梦想，就加入我们\n你即将见证互联网最新趋势的快速成长\n马蜂窝的一切资源都会成为你成长路上的最大助力\n你可以和马蜂窝一起书写互联网的风云奇迹\n在这里有一群和你一样，疯狂地热爱互联网和旅行的人们\n马蜂窝能为你实现梦想提供最广阔的平台");
	M.log("请将简历发送至 %csuperhr@mafengwo.com%c（ 邮件标题请以“_console”结尾）", "color:#4ae;", "color:inherit;");
	M.log("职位介绍：http://www.mafengwo.cn/s/hr.html")
});
M.closure(function(a) {
	$.get("/ajax/ajax_page_onload.php", {
		href: document.location.href,
		_t: +new Date()
	}, function(b) {
		if (b.payload && b.payload.apps) {
			var c = b.payload.apps;
			if (!M.isEmpty(c)) {
				var d = {
					css_list: c.css || []
				};
				M.loadCssJsListSeq(d, function() {
					if (c.html) {
						$("body").append(c.html)
					}
					if (c.js && c.js.length) {
						M.loadResource(c.js)
					}
				})
			}
		}
	}, "json")
});