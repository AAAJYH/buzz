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
M.define("dialog/confirm", function(c, e) {
	var g = c("dialog/Dialog"),
		a = '<div id="popup_container" class="popup-box new-popbox"><a class="close-btn _j_close _j_false"><i></i></a><div class="pop-ico" id="popup_icon"><i class="i2"></i></div><div class="pop-ctn"><p class="hd _j_content"></p><p class="bd _j_detail"></p></div><div class="pop-btns"><a role="button" tabindex="0" class="popbtn popbtn-cancel popbtn-half _j_close _j_false">&nbsp;取消&nbsp;</a><a role="button" tabindex="0" class="popbtn popbtn-submit popbtn-half _j_close _j_true">&nbsp;确定&nbsp;</a></div></div>',
		h = M.extend(function(k) {
			var j = {
				width: 420,
				content: "请输入内容",
				background: "#000",
				bgOpacity: 0.7,
				PANEL_CLASS: "pop_no_margin",
				reposition: true,
				impl: "Confirm",
				layerZIndex: 10000
			};
			k = M.mix(j, k);
			h.$parent.call(this, k);
			this.bindEvents()
		}, g),
		d = null,
		b = $.noop,
		i = $.noop,
		f = false;
	M.mix(h.prototype, {
		tpl: a,
		setConfirmTitle: function(j) {
			this.setContent(j)
		},
		setConfirmContent: function(j) {
			this.getPanel().find("._j_detail").text(j)
		},
		bindEvents: function() {
			this.getPanel().on("click", "._j_false", function() {
				f = false
			}).on("click", "._j_true", function() {
				f = true
			}).on("keydown", "._j_false", function(j) {
				if (j.keyCode == 13) {
					$(this).trigger("click")
				} else {
					if (j.keyCode == 39) {
						$(this).next().focus()
					}
				}
			}).on("keydown", "._j_true", function(j) {
				if (j.keyCode == 13) {
					$(this).trigger("click")
				} else {
					if (j.keyCode == 37) {
						$(this).prev().focus()
					}
				}
			})
		}
	});
	e.pop = function(k, j, l) {
		if (!d) {
			d = new h();
			M.Event(d).on("afterhide", function() {
				if (f) {
					b()
				} else {
					i()
				}
			});
			M.Event(d).on("aftershow", function() {
				d.getPanel().find("._j_true").focus()
			})
		}
		d.getLayer().toFront();
		if (M.isObject(k)) {
			d.setConfirmTitle(k.title);
			d.setConfirmContent(k.content)
		} else {
			d.setConfirmTitle(k);
			d.setConfirmContent("")
		}
		if (typeof j == "function") {
			b = j
		} else {
			b = $.noop
		}
		if (typeof l == "function") {
			i = l
		} else {
			i = $.noop
		}
		d.show();
		return d
	}
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