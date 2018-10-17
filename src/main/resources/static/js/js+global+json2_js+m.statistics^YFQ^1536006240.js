if (typeof JSON !== "object") {
	JSON = {}
}(function() {
	function f(n) {
		return n < 10 ? "0" + n : n
	}
	if (typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function() {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
			return this.valueOf()
		}
	}
	var cx, escapable, gap, indent, meta, rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
			var c = meta[a];
			return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + string + '"'
	}

	function str(key, holder) {
		var i, k, v, length, mind = gap,
			partial, value = holder[key];
		if (value && typeof value === "object" && typeof value.toJSON === "function") {
			value = value.toJSON(key)
		}
		if (typeof rep === "function") {
			value = rep.call(holder, key, value)
		}
		switch (typeof value) {
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
			case "null":
				return String(value);
			case "object":
				if (!value) {
					return "null"
				}
				gap += indent;
				partial = [];
				if (Object.prototype.toString.apply(value) === "[object Array]") {
					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || "null"
					}
					v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
					gap = mind;
					return v
				}
				if (rep && typeof rep === "object") {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === "string") {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v)
							}
						}
					}
				} else {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v)
							}
						}
					}
				}
				v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
				gap = mind;
				return v
		}
	}
	if (typeof JSON.stringify !== "function") {
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		meta = {
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		};
		JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " "
				}
			} else {
				if (typeof space === "string") {
					indent = space
				}
			}
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify")
			}
			return str("", {
				"": value
			})
		}
	}
	if (typeof JSON.parse !== "function") {
		cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		JSON.parse = function(text, reviver) {
			var j;

			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v
							} else {
								delete value[k]
							}
						}
					}
				}
				return reviver.call(holder, key, value)
			}
			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function(a) {
					return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				})
			}
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return typeof reviver === "function" ? walk({
					"": j
				}, "") : j
			}
			throw new SyntaxError("JSON.parse")
		}
	}
}());
if (!window.M) {
	window.M = {}
}
if (!window.Env) {
	window.Env = {}
}
if (!window.mLogImg) {
	window.mLogImg = []
}
if (!window.mLogPost) {
	window.mLogPost = []
}

function mxPageGuid() {}
mxPageGuid.generate = function() {
	var a = mxPageGuid._getRandomInt,
		c = mxPageGuid._hexAligner;
	return c(a(32), 8) + "-" + c(a(16), 4) + "-" + c(16384 | a(12), 4) + "-" + c(32768 | a(14), 4) + "-" + c(a(48), 12)
};
mxPageGuid._getRandomInt = function(a) {
	return 0 > a ? NaN : 30 >= a ? 0 | Math.random() * (1 << a) : 53 >= a ? (0 | 1073741824 * Math.random()) + 1073741824 * (0 | Math.random() * (1 << a - 30)) : NaN
};
mxPageGuid._getIntAligner = function(a) {
	return function(c, b) {
		for (var d = c.toString(a), e = b - d.length, f = "0"; 0 < e; e >>>= 1, f += f) {
			e & 1 && (d = f + d)
		}
		return d
	}
};
mxPageGuid._hexAligner = mxPageGuid._getIntAligner(16);
window.Env.uPageId = mxPageGuid.generate();
var xstringify = (function() {
	var e = Object.prototype.toString;
	var c = Array.isArray || function(g) {
		return e.call(g) === "[object Array]"
	};
	var b = {
		'"': '\\"',
		"\\": "\\\\",
		"\b": "\\b",
		"\f": "\\f",
		"\n": "\\n",
		"\r": "\\r",
		"\t": "\\t"
	};
	var a = function(g) {
		return b[g] || "\\u" + (g.charCodeAt(0) + 65536).toString(16).substr(1)
	};
	var d = /[\\"\u0000-\u001F\u2028\u2029]/g;
	return function f(m) {
		if (m == null) {
			return "null"
		} else {
			if (typeof m === "number") {
				return isFinite(m) ? m.toString() : "null"
			} else {
				if (typeof m === "boolean") {
					return m.toString()
				} else {
					if (typeof m === "object") {
						if (typeof m.toJSON === "function") {
							return f(m.toJSON())
						} else {
							if (c(m)) {
								var l = "[";
								for (var j = 0; j < m.length; j++) {
									l += (j ? ", " : "") + f(m[j])
								}
								return l + "]"
							} else {
								if (e.call(m) === "[object Object]") {
									var h = [];
									for (var g in m) {
										if (m.hasOwnProperty(g)) {
											h.push(f(g) + ":" + f(m[g]))
										}
									}
									return "{" + h.join(", ") + "}"
								}
							}
						}
					}
				}
			}
		}
		return '"' + m.toString().replace(d, a) + '"'
	}
})();
var mfwCommonEnv = {};
mfwCommonEnv.aIncludes = function(b, a) {
	return b.indexOf(a) !== -1
};
mfwCommonEnv.getDevice = function(a) {
	if (/Windows Phone/i.test(a) || /WPDesktop/.test(a)) {
		return "Windows Phone"
	} else {
		if (/iPad/.test(a)) {
			return "iPad"
		} else {
			if (/iPod/.test(a)) {
				return "iPod Touch"
			} else {
				if (/iPhone/.test(a)) {
					return "iPhone"
				} else {
					if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
						return "BlackBerry"
					} else {
						if (/Android/.test(a)) {
							return "Android"
						} else {
							return "unknown"
						}
					}
				}
			}
		}
	}
};
mfwCommonEnv.getOs = function(a) {
	if (/Windows/i.test(a)) {
		if (/Phone/.test(a) || /WPDesktop/.test(a)) {
			return "Windows Phone"
		}
		return "Windows"
	} else {
		if (/(iPhone|iPad|iPod)/.test(a)) {
			return "iOS"
		} else {
			if (/Android/.test(a)) {
				return "Android"
			} else {
				if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
					return "BlackBerry"
				} else {
					if (/Mac/i.test(a)) {
						return "Mac OS X"
					} else {
						if (/Linux/.test(a)) {
							return "Linux"
						} else {
							return "unknown"
						}
					}
				}
			}
		}
	}
};
mfwCommonEnv.getBrowser = function(b, c, a) {
	c = c || "";
	if (a || this.aIncludes(b, " OPR/")) {
		if (this.aIncludes(b, "Mini")) {
			return "Opera Mini"
		}
		return "Opera"
	} else {
		if (/(BlackBerry|PlayBook|BB10)/i.test(b)) {
			return "BlackBerry"
		} else {
			if (this.aIncludes(b, "IEMobile") || this.aIncludes(b, "WPDesktop")) {
				return "Internet Explorer Mobile"
			} else {
				if (this.aIncludes(b, "Edge")) {
					return "Microsoft Edge"
				} else {
					if (this.aIncludes(b, "FBIOS")) {
						return "Facebook Mobile"
					} else {
						if (this.aIncludes(b, "Chrome")) {
							return "Chrome"
						} else {
							if (this.aIncludes(b, "CriOS")) {
								return "Chrome iOS"
							} else {
								if (this.aIncludes(b, "FxiOS")) {
									return "Firefox iOS"
								} else {
									if (this.aIncludes(c, "Apple")) {
										if (this.aIncludes(b, "Mobile")) {
											return "Mobile Safari"
										}
										return "Safari"
									} else {
										if (this.aIncludes(b, "Android")) {
											return "Android Mobile"
										} else {
											if (this.aIncludes(b, "Konqueror")) {
												return "Konqueror"
											} else {
												if (this.aIncludes(b, "Firefox")) {
													return "Firefox"
												} else {
													if (this.aIncludes(b, "MSIE") || this.aIncludes(b, "Trident/")) {
														return "Internet Explorer"
													} else {
														if (this.aIncludes(b, "Gecko")) {
															return "Mozilla"
														} else {
															return "unknown"
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
mfwCommonEnv.getOsVersion = function(c) {
	var a = "unknow";
	if (/Windows/i.test(c)) {
		if (/Phone/.test(c)) {
			a = c.substr(c.indexOf("Phone") + 6, c.indexOf(";", c.indexOf("Phone")) - c.indexOf("Phone") - 6)
		} else {
			if (/WPDesktop/.test(c)) {
				a = "WPDesktop_unknow"
			} else {
				a = "Windows_unknow"
			}
		}
	} else {
		if (/(iPhone|iPad|iPod)/.test(c)) {
			var d = /OS [\d._]*/ig;
			var b = c.match(d);
			a = (b + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".")
		} else {
			if (/Android/.test(c)) {
				a = c.substr(c.indexOf("Android") + 8, c.indexOf(";", c.indexOf("Android")) - c.indexOf("Android") - 8)
			} else {
				if (/(BlackBerry|PlayBook|BB10)/i.test(c)) {
					if (/BB10/.test(c)) {
						a = c.substr(c.indexOf("BB10") + 5, c.indexOf(";", c.indexOf("BB10")) - c.indexOf("BB10") - 5)
					} else {
						a = "BlackBerry_unknow"
					}
				} else {
					if (/Mac OS X/i.test(c)) {
						var d = /OS X [\d._]*/ig;
						var b = c.match(d);
						a = (b + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".")
					} else {
						a = "Linux_unknow"
					}
				}
			}
		}
	}
	return a
};
mfwCommonEnv.getBrowserVersion = function(f, g, a) {
	var c = this.getBrowser(f, g, a);
	var b = {
		"Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
		"Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
		Chrome: /Chrome\/(\d+(\.\d+)?)/,
		"Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
		Safari: /Version\/(\d+(\.\d+)?)/,
		"Mobile Safari": /Version\/(\d+(\.\d+)?)/,
		Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
		Firefox: /Firefox\/(\d+(\.\d+)?)/,
		"Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
		Konqueror: /Konqueror:(\d+(\.\d+)?)/,
		BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
		"Android Mobile": /android\s(\d+(\.\d+)?)/,
		"Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
		Mozilla: /rv:(\d+(\.\d+)?)/
	};
	var d = b[c];
	if (d === undefined) {
		return "unknown"
	}
	var e = f.match(d);
	if (!e) {
		return "unknown"
	}
	return parseFloat(e[e.length - 2])
};
mfwCommonEnv.getCliInfo = function() {
	var b = b || {};
	var c = window.navigator;
	var a = c.userAgent;
	b.brn = this.getBrowser(a, c.vendor, window.opera);
	b.brv = this.getBrowserVersion(a, c.vendor, window.opera);
	b.dev = this.getDevice(a);
	b.os_name = this.getOs(a);
	b.os_ver = this.getOsVersion(a);
	return b
};
var mfwSendLog = {};
mfwSendLog._compelete = 0;
mfwSendLog._receive = 0;
mfwSendLog.checkEnviroment = function() {
	if (!window) {
		return "window"
	}
	if (!document) {
		return "document"
	}
	if (!navigator) {
		return "navigator"
	}
	if (!screen) {
		return "screen"
	}
};
mfwSendLog.postDataFormat = function(c) {
	if (typeof FormData == "function") {
		var a = new FormData();
		for (var b in c) {
			a.append(b, c[b])
		}
		return a
	} else {
		var a = new Array();
		for (var b in c) {
			a.push(b + "=" + c[b])
		}
		return a.join("&")
	}
};
mfwSendLog.getDataFormat = function(c) {
	var a = new Array();
	for (var b in c) {
		a.push(b + "=" + c[b])
	}
	return a.join("&")
};
mfwSendLog.sendByImg = function(g, b, k) {
	var i = new Image(1, 1),
		j = "mfw_" + Math.floor(2147483648 * Math.random()).toString(36);
	window.mLogImg[j] = i;
	i.onload = i.onerror = function() {
		i.onload = i.onerror = null;
		i = window.mLogImg[j] = null;
		if (typeof k == "function") {
			k()
		}
	};
	var f = String(new Date().getTime()) + String(Math.random());
	var h = b || {};
	h._nocache = f;
	h._method = "img";
	var a = g + "?" + this.getDataFormat(h);
	i.src = a
};
mfwSendLog.sendByBeacon = function(d, a, f) {
	var b = String(new Date().getTime()) + String(Math.random());
	var e = a || {};
	e._nocache = b;
	e._method = "beacon";
	if (typeof FormData == "function") {
		return window.navigator.sendBeacon ? window.navigator.sendBeacon(d, this.postDataFormat(e)) ? (f(), !0) : !1 : !1
	} else {
		return window.navigator.sendBeacon ? window.navigator.sendBeacon(d + "?" + this.getDataFormat(e)) ? (f(), !0) : !1 : !1
	}
};
mfwSendLog.sendByPost = function(f, a, j) {
	var i = window.XMLHttpRequest,
		b = String(new Date().getTime()) + String(Math.random());
	if (!i) {
		return !1
	}
	var h = new i;
	window.mLogPost[b] = h;
	if (!("withCredentials" in h)) {
		return !1
	}
	var g = a || {};
	g._nocache = b;
	g._method = "post";
	h.open("POST", f, !0);
	h.withCredentials = !0;
	if (typeof FormData == "undefined") {
		h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	}
	h.onreadystatechange = function() {
		4 == h.readyState && (j(), h = window.mLogPost[b] = null)
	};
	h.send(this.postDataFormat(g));
	return !0
};
mfwSendLog.init = function(b, a, d) {
	d = d || function() {};
	this.sendByPost(b, a, d) || this.sendByBeacon(b, a, d) || this.sendByImg(b, a, d)
};
var mfwPageEvent = (function() {
	return function(o, j, d, l) {
		var i = encodeURIComponent;
		var m = document.URL;
		var a = document.referrer;
		var p = parseInt((+new Date()) / 1000, 10);
		o = i(o);
		j = i(j);
		m = i(m);
		a = i(a);
		d = i(xstringify(d));
		var k = mfwCommonEnv.getCliInfo();
		k = i(xstringify(k));
		var h = Math.floor(2443463648 * Math.random());
		var g = window.Env.uPageId;
		if (o && j) {
			if (mfwSendLog.checkEnviroment()) {
				return false
			}
			var e = {
				ac: o,
				ec: j,
				u: m,
				r: a,
				ex: k,
				ar: d,
				t: p,
				pid: g,
				rn: h
			};
			var n = window.Env.TONGJI_HOST ? window.Env.TONGJI_HOST : "tongji.mafengwo.cn";
			var b = ("https:" == document.location.protocol ? "https://" : "http://") + n + "/track_event.gif";
			mfwSendLog.init(b, e, l)
		}
	}
})();
var MFWSTAT = {
	_getFlash: function() {
		var d, e;
		if (window.ActiveXObject) {
			for (d = 12; d > 0; d--) {
				try {
					e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + d);
					return d + ".0"
				} catch (f) {}
			}
		} else {
			if (navigator.plugins && navigator.plugins.length) {
				for (d = 0; d < navigator.plugins.length; d++) {
					if (navigator.plugins[d].name.indexOf("Shockwave Flash") != -1) {
						return navigator.plugins[d].description.split(" ")[2]
					}
				}
			}
		}
		return "Not enabled"
	},
	_getCururl: function() {
		var a = document.URL;
		return encodeURIComponent(a)
	},
	_getDomain: function() {
		var b = "",
			d = window.location.hostname,
			c = d.replace(/\.(com|net|org|cn$)\.?.*/, "");
		if (c.lastIndexOf(".") == -1) {
			b = "." + d
		} else {
			c = c.substring(c.lastIndexOf("."));
			b = d.substring(d.lastIndexOf(c))
		}
		return b
	},
	_getRandomInt: function(a) {
		return 0 > a ? NaN : 30 >= a ? 0 | Math.random() * (1 << a) : 53 >= a ? (0 | 1073741824 * Math.random()) + 1073741824 * (0 | Math.random() * (1 << a - 30)) : NaN
	},
	_getWindowSize: function() {
		var a = -1,
			c = -1;
		"number" == typeof window.innerWidth ? (a = window.innerWidth, c = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (a = document.documentElement.clientWidth, c = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (a = document.body.clientWidth, c = document.body.clientHeight);
		return a + "x" + c
	},
	_getScreenSize: function() {
		return screen ? screen.width + "x" + screen.height : "-1x-1"
	},
	_getSystemLang: function() {
		return navigator.userLanguage ? navigator.userLanguage : navigator.language ? navigator.language : navigator.browserLanguage ? navigator.browserLanguage : "unknown"
	},
	_getChartset: function() {
		var a;
		a = document.characterSet || document.charset || "unknown";
		return a
	},
	_includes: function(b, a) {
		return b.indexOf(a) !== -1
	},
	_setCookie: function(j, h, g) {
		var i = "";
		var e = this._getDomain();
		if (g) {
			i = new Date((new Date()).getTime() + g * 3600000);
			i = "; expires=" + i.toGMTString()
		}
		document.cookie = j + "=" + encodeURIComponent(h) + i + ";domain=" + e + ";path=/; "
	},
	_getCookie: function(f) {
		var h = "";
		var d = f + "=";
		if (document.cookie.length > 0) {
			var g = document.cookie.indexOf(d);
			if (g != -1) {
				g += d.length;
				var e = document.cookie.indexOf(";", g);
				if (e == -1) {
					e = document.cookie.length
				}
				h = decodeURIComponent(document.cookie.substring(g, e))
			}
		}
		return h
	},
	_getVisitn: function() {
		var a = this._getCookie("__mfwvn");
		if (isNaN(a)) {
			a = 0
		}
		return a
	},
	_getTimeOnPage: function() {
		var a = this._getCookie("__mfwlt");
		var b = parseInt((+new Date()) / 1000, 10);
		if (isNaN(a)) {
			a = 0
		}
		var c = parseInt(b - a);
		this._setCookie("__mfwlt", b, 24 * 365);
		return c
	},
	_getVisitlv: function() {
		var b = this._getCookie("__mfwlv");
		var a = this._getVisitn();
		if (isNaN(b)) {
			b = 0
		}
		if ((+new Date() / 1000) - b > 7200) {
			b = parseInt(+new Date() / 1000, 10);
			a++;
			this._setCookie("__mfwlv", b, 24 * 365);
			this._setCookie("__mfwvn", a, 24 * 365)
		}
		return b
	},
	_run: function() {
		if (mfwSendLog.checkEnviroment()) {
			return false
		}
		var c = this._getParams();
		var a = window.Env.TONGJI_HOST ? window.Env.TONGJI_HOST : "tongji.mafengwo.cn";
		var b = ("https:" == document.location.protocol ? "https://" : "http://") + a + "/stat_click.gif";
		mfwSendLog.init(b, c)
	},
	_getCliInfo: function() {
		return mfwCommonEnv.getCliInfo()
	},
	_getParams: function() {
		var p = document,
			k = window.location,
			g = parseInt((+new Date()) / 1000, 10);
		var w = "1.2";
		var n = encodeURIComponent(k.host) || "-";
		var f = encodeURIComponent(p.referrer) || "direct";
		var r = encodeURIComponent(p.title);
		var o = this._getWindowSize();
		var m = this._getScreenSize();
		var j = this._getSystemLang();
		var i = this._getRandomInt(32);
		var x = this._getCururl() || "-";
		var b = this._getFlash();
		var u = this._getVisitlv();
		var h = this._getVisitn() || "1";
		var s = this._getChartset();
		var e = this._getTimeOnPage() || "0";
		var a = this._getCliInfo();
		var c = window.Env.uPageId;
		var v = window.Env.salesId || "0";
		var q = {
			t: g,
			hn: n,
			u: x,
			r: f,
			lv: u,
			vn: h,
			ws: o,
			sc: m,
			sl: j,
			fl: b,
			cs: s,
			dt: r,
			sts: e,
			pid: c,
			brn: a.brn,
			brv: a.brv,
			dev: a.dev,
			os: a.os_name,
			os_ver: a.os_ver,
			sid: v,
			ver: w,
			rdm: i
		};
		return q
	}
};
if (!window.Env.statistics_loaded) {
	MFWSTAT._run();
	window.Env.statistics_loaded = true
}
var mfwCheckLogData = (function() {
	return function() {
		var e = encodeURIComponent;
		var c = parseInt((+new Date()) / 1000, 10);
		var b = document.URL;
		var d = document.referrer;
		var a = {
			t: c,
			u: e(b),
			r: e(d),
			pid: window.Env.uPageId
		};
		return xstringify(a)
	}
})();
(function() {
	var c = {
		events: [],
		opening: parseInt((+new Date()) / 1000, 10),
		scrolls: 0,
		clicks: 0,
		blurTime: 0,
		closing: 0,
		submitted: false
	};
	var b = {
		track: {
			focus: true,
			blur: true,
			click: true,
			scroll: true
		}
	};

	function d(f) {
		f = f || window.event;
		var e = {};
		e.type = f.type;
		e.timeStamp = parseInt(+new Date());
		c.events.push(e)
	}
	var a = {
		init: function(e) {
			for (var f in b.track) {
				if (b.track[f]) {
					a.addEvent(window, f, d)
				}
			}
			a.addEvent(window, "beforeunload", a.save);
			a.addEvent(document, "pagehide", a.save);
			a.addEvent(window, "unload", a.save);
			a.addEvent(document, "click", a.saveClickArea);
			a.addEvent(window, "load", a.savePageLoadTime);
			a.guid = a.createGuid()
		},
		save: function() {
			if (c.submitted) {
				return
			}
			c.submitted = true;
			c.closing = parseInt((+new Date()) / 1000, 10);
			c.events = a.compress(c.events);
			var g = xstringify,
				i = encodeURIComponent,
				h = (new Date()).getTimezoneOffset() / 60,
				k = c.closing - c.opening,
				j = k - c.blurTime,
				e = e || {};
			e = {
				scrolls: c.scrolls,
				clicks: c.clicks,
				opening: c.opening,
				closing: c.closing,
				time_on_page: k,
				time_focus: j,
				tz: h,
				referrer: i(document.referrer) || "direct"
			};
			!!mfwPageEvent && mfwPageEvent("page_behavior", "page_behaviors", e)
		},
		compress: function() {
			var g = [],
				h = 0,
				e = 0,
				k = 0;
			for (var f = 0; f < c.events.length; f++) {
				var j = c.events[f];
				if (!j.timeStamp) {
					return
				}
				if (j.type === "click") {
					if (j.timeStamp - e > 1000) {
						g.push(j);
						c.clicks++
					}
					e = j.timeStamp
				} else {
					if (j.type === "scroll") {
						if (j.timeStamp - h > 1000) {
							g.push(j);
							c.scrolls++
						}
						h = j.timeStamp
					} else {
						if (j.type === "blur") {
							if (k === 0) {
								k = j.timeStamp
							}
							g.push(j)
						} else {
							if (j.type === "focus") {
								if (k !== 0) {
									c.blurTime += parseInt((j.timeStamp - k) / 1000);
									k = 0
								}
								g.push(j)
							}
						}
					}
				}
			}
			if (k !== 0) {
				c.blurTime += (c.closing - parseInt(k / 1000))
			}
			return g
		},
		addEvent: function(g, e, f) {
			if (document.attachEvent) {
				if (g) {
					g.attachEvent("on" + e, f)
				} else {
					window.attachEvent("on" + e, f)
				}
			} else {
				if (document.addEventListener) {
					if (g) {
						g.addEventListener(e, f, false)
					} else {
						window.addEventListener(e, f, false)
					}
				}
			}
		},
		getClickStat: function(h) {
			if (!window.jQuery) {
				return {
					cst: "",
					csp: "",
					csl: "",
					csd: ""
				}
			}
			var f = $(h);
			var g = f.closest("[data-cs-t]").data("cs-t") || "";
			var i = f.closest("[data-cs-p]").data("cs-p") || "";
			var e = f.closest("[data-cs-l]").data("cs-l") || "";
			var j = f.closest("[data-cs-d]").data("cs-d") || "";
			return {
				cst: g,
				csp: i,
				csl: e,
				csd: j
			}
		},
		sortEvents: function(f, e) {
			if (!f.timeStamp) {
				return -1
			}
			if (!e.timeStamp) {
				return 1
			}
			if (f.timeStamp < e.timeStamp) {
				return -1
			}
			if (f.timeStamp >= e.timeStamp) {
				return 1
			}
		},
		getXpath: function(l) {
			var i = [];
			for (; l && l.nodeType == 1; l = l.parentNode) {
				var g = 0;
				for (var k = l.previousSibling; k; k = k.previousSibling) {
					if (k.tagName == l.tagName) {
						++g
					}
				}
				var h = l.tagName.toLowerCase();
				var j = (g ? "[" + (g + 1) + "]" : "");
				i.splice(0, 0, h + j)
			}
			return i.length ? "/" + i.join("/") + "/" : null
		},
		savePageLoadTime: function() {
			var e = 0;
			var i = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
			var h = {};
			if (i && i.timing) {
				var g = i.timing;
				var f = new Date().getTime();
				h.loadPage = (f - g.navigationStart) / 1000;
				h.domReady = (g.domComplete - g.responseEnd) / 1000;
				h.connect = (g.connectEnd - g.connectStart) / 1000;
				h.request = (g.responseEnd - g.requestStart) / 1000;
				h.redirect = (g.redirectEnd - g.redirectStart) / 1000;
				h.reqPrepareTime = (g.connectEnd - g.navigationStart) / 1000;
				h.pageLoadingTime = (f - g.domLoading) / 1000;
				h.dnsTime = (g.domainLookupEnd - g.domainLookupStart) / 1000;
				h.whitePageTime = (g.responseEnd - g.navigationStart) / 1000;
				h.navigationStart = g.navigationStart;
				h.redirectStart = g.redirectStart;
				h.redirectEnd = g.redirectEnd;
				h.fetchStart = g.fetchStart;
				h.domainLookupStart = g.domainLookupStart;
				h.domainLookupEnd = g.domainLookupEnd;
				h.connectStart = g.connectStart;
				h.connectEnd = g.connectEnd;
				h.requestStart = g.requestStart;
				h.requestEnd = g.requestEnd;
				h.responseStart = g.responseStart;
				h.responseEnd = g.responseEnd;
				h.domLoading = g.domLoading;
				h.domInteractive = g.domInteractive;
				h.domContentLoad = g.domContentLoad;
				h.domComplete = g.domComplete;
				h.loadEventStart = g.loadEventStart;
				h.loadEventEnd = g.loadEventEnd;
				h.loadPage = (h.loadPage > 100 || h.loadPage < 0) ? 0 : h.loadPage;
				h.domReady = (h.domReady > 100 || h.domReady < 0) ? 0 : h.domReady;
				h.connect = (h.connect > 100 || h.connect < 0) ? 0 : h.connect;
				h.request = (h.request > 100 || h.request < 0) ? 0 : h.request;
				h.redirect = (h.redirect > 100 || h.redirect < 0) ? 0 : h.redirect;
				h.reqPrepareTime = (h.reqPrepareTime > 100 || h.reqPrepareTime < 0) ? 0 : h.reqPrepareTime;
				h.pageLoadingTime = (h.pageLoadingTime > 100 || h.pageLoadingTime < 0) ? 0 : h.pageLoadingTime;
				h.dnsTime = (h.dnsTime > 100 || h.dnsTime < 0) ? 0 : h.dnsTime;
				h.whitePageTime = (h.whitePageTime > 100 || h.whitePageTime < 0) ? 0 : h.whitePageTime;
				h.guid = a.guid;
				!!mfwPageEvent && mfwPageEvent("default", "performance", h)
			}
		},
		saveResourceTime: function() {
			var e = 0;
			var m = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
			var l = new Array;
			var h = encodeURIComponent;
			if (m && typeof m.getEntries === "function") {
				var g = m.getEntries();
				if (g instanceof Array) {
					for (var k in g) {
						var i = g[k];
						var j = {};
						if (i !== undefined) {
							j.name = i.name;
							j.entryType = i.entryType;
							if (i.duration !== undefined) {
								j.duration = i.duration.toFixed(2)
							}
							j.initiatorType = i.initiatorType;
							j.guid = a.guid;
							l.push(j)
						}
					}
				}
			}
			if (l.length > 0) {
				!!mfwPageEvent && mfwPageEvent("default", "resource", l)
			}
		},
		saveClickArea: function(m) {
			var r, u, s, l, w;
			if (!m) {
				m = window.event
			}
			r = m.srcElement || m.target || null;
			try {
				s = r.tagName.toLowerCase()
			} catch (m) {
				return
			}
			if (s && r.parentNode && r.parentNode.tagName) {
				l = r.parentNode.tagName.toLowerCase()
			}
			if (l && r.parentNode.parentNode && r.parentNode.parentNode.tagName) {
				var k = r.parentNode.parentNode.tagName;
				w = k ? k.toLowerCase() : ""
			}
			var q = 0;
			if ("a" == s || "input" == s || "button" == s || "object" == s || "embed" == s || "img" == s) {
				q = 1
			} else {
				if ("a" == l || "button" == l) {
					q = 1;
					r = r.parentNode
				} else {
					if ("a" == w || "button" == w) {
						q = 1;
						r = r.parentNode.parentNode
					}
				}
			}
			var j = j || {};
			if (q) {
				var p = "",
					v = "",
					e = encodeURIComponent;
				p = r.getAttribute("data-href") || r.href || "";
				if ("" == p) {
					p = r.data
				}
				if ("" == v) {
					v = r.getAttribute("title") || ""
				}
				var o = e(a.getXpath(r));
				var n = a.getClickStat(r);
				if (!n.csl || n.csl.length === 0) {
					n.csl = p
				}
				if (!n.csd || n.csd.length === 0) {
					n.csd = v
				}
				j = {
					xpath: o,
					lc: p,
					text: n.csd ? "" : v,
					tagname: s || l,
					referer: e(document.referrer) || "direct"
				};
				var i;
				if (window.jQuery) {
					i = $.extend({}, j, n)
				} else {
					i = j
				}!!mfwPageEvent && mfwPageEvent("default", "click_area", i)
			}
		},
		createGuid: function() {
			function e() {
				return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
			}
			return (e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e())
		}
	};
	a.init()
})();