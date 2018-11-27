/**
 * google map api v3 to amap v1.1
 * author wanghui
 */
function MfwMapLoad(callback, timeout, debug){
	this.callback = callback;
	this.timeout = (typeof(timeout)=='number' && timeout>0) ? timeout : 5000;
	this.debug = debug;
	this.cb_name = '__google_map_loaded_stop_amap';
	this.timer = 0;	
	this._init();
}
MfwMapLoad.prototype._init = function(){
	var $this = this;
	window[this.cb_name] = function(){
		$this.log('google map load success');
		clearTimeout($this.timer);
		$this.callback();
	}
};
MfwMapLoad.prototype.loadGoogleMap = function(){
  if (window['offlinemap']) {
    window[this.cb_name]();
    return;
  }
  var script = document.createElement("script"),
      googleMapKey = window.Env && window.Env.GOOGLE_MAP_KEY || 'AIzaSyD-Su0x_rPy1xehlMBcMyTqWkU49Bk53nQ';
	script.type = "text/javascript";
	script.src = (location.protocol ? location.protocol : 'http:') + "//ditu.google.cn/maps/api/js?sensor=false&key="+googleMapKey+"&libraries=geometry&language=zh-CN&callback=" + this.cb_name;
	script.charset = "utf-8";
	document.body.appendChild(script);		
};
MfwMapLoad.prototype.autoLoadMap = function(){
	this.log('auto load map');
	var $this = this;
	this.timer = setTimeout(function(){
		$this.log('google map load timeout');
		$this.loadAmap.apply($this, arguments);
	}, this.timeout);
	this.loadGoogleMap();
};
MfwMapLoad.prototype.log = function(message){
	if(this.debug && window.console && window.console.log){
		window.console.log(message);
	}
};
MfwMapLoad.prototype.loadAmap = function(){
	//AMap API 1.1 不支持异步加载，只能模拟异步加载
	var script = document.createElement("script");
	var $this = this;
	script.type = "text/javascript";
	script.src = "http://api.amap.com/webapi/init?v=1.1";
	document.body.appendChild(script);
	if (document.all) { //如果是IE
		script.onreadystatechange = function () {
			if (script.readyState == 'loaded' || script.readyState == 'complete') {
				$this.google2amap(window);
				$this.log('load amap success');
				$this.callback();
			}
		}
	} else {
		script.onload = function () {
			$this.google2amap(window);
			$this.log('load amap success');
			$this.callback();
		}
	}
};
MfwMapLoad.prototype.google2amap = function(_G,CFG){
	if(_G.___G2A___)return;
	CFG = CFG || {silence:true};
	var _ = function(o){return o._impl ? o._impl : o;};
	var INTERNAL = function(x)	{return "_"+x+"_";};
	//globals	
	var DEBUG = false,EMPTY_FN = function(){};
	_gprivate = {maps:[],activeMap:null,version:0.1};
	_G.___G2A___ = _gprivate;
	_G.google = {};
	_G.google.maps = function(){};
	google.maps.MapTypeId = {};
	google.maps.MapTypeId.ROADMAP = '';
	google.maps.Animation = {};
	google.maps.Animation.BOUNCE = '';
	//properties updating
	_gprivate.objs = [];
	_gprivate.updateProperties = function(){
		for(var i = 0;i<_gprivate.objs.length;++i){
			_gprivate.objs[i]();
		}
	};
	
	function _registerUpdater(callback){
		if(callback && typeof(callback)==="function"){
			_gprivate.objs.push(callback);
		}
	}

	function log(message){
		if(DEBUG && _G.console && _G.console.log){
			_G.console.log(message);
		}
	}
	var _$ = DEBUG ? log : EMPTY_FN;

	function Const(name,v,scope){
		(scope || _G)[name] = v;
	}
	
	function Klass(name,fn,father,inherit){
		if(father && father.length>0){
			if(father.splice){
				father = father[0];
			}
			//base class of current class
			Klass.f = father;
		}
		if(typeof(fn)=="function"){
			var fun = fn.toString();
			//exports to global namespace
			_G.google.maps[name] = fn;
			//current defining class
			Klass.c = eval('_G.google.maps.'+name);
		}else{
			_G.google.maps[name] = fn;
			Klass.c = fn;
		}

		//name of current class
		Klass.c.__name__ = name;
		if(inherit){
			Klass.c.prototype = new Klass.f();
		}		
		_$("<class name='"+name+"'>");		
		return Klass;
	}

	function Typedef(name,type,scope){
		var t = (scope || _G.google.maps)[name] = type;
		return t;
	}
	
	/**
	 * add a empty method
	 */
	Klass.dummy = function(){
		for(var i = 0; i < arguments.length; ++i){
			var f = arguments[i];
			_$("  <method type='dummy' name='"+f+"' />");
			Klass.c.prototype[f] = EMPTY_FN;
		}
		return Klass;
	};
	

	Klass.same = function(){
		for(var i = 0; i < arguments.length; ++i){
			var f = arguments[i];
			_$("  <method type='same' name='"+f+"' />");
			(function(f){
				Klass.c.prototype[f] = function(){
					return this._impl[f].apply(this._impl,arguments);				
				};
			})(f);
		}
		return Klass;
	};
	
	Klass.alias = function(a,b){
		Klass.c.prototype[a] = Klass.c.prototype[b];
		return Klass;
	};
	
	Klass.reimpl = function(name,fn){
		_$("  <method type='reimp' name='"+name+"' />");
		if(Klass.c.prototype[name]){
			Klass.c.prototype[INTERNAL(name)] = Klass.c.prototype[name];
		}
		Klass.c.prototype[name] = fn;
		return Klass;
	};
	
	Klass.impl = function(name,fn){
		_$("  <method type='impl' name='"+name+"' />");
		Klass.c.prototype[name] = fn;
		return Klass;
	};
	Klass.override = Klass.impl;
	
	Klass.noimpl = function(){		
		for(var i = 0;i<arguments.length; ++i){
			var f = arguments[i];
			if(Klass.c.prototype[f]){
				log("! "+f+" has already been defined !");
				continue;
			}
			_$("  <method type='noimpl' name='"+f+"' />");
			(function(f){				
				Klass.c.prototype[f] = function(){
					if(!CFG.silence)
						throw Error(f+" is not implemented!");
				};
			})(f);
		}
		return Klass;
	};
	
	Klass.statik = function(name,v){
		_$("  <method type='static' name='"+name+"' />");
		if(Klass.c[name]){
			Klass.c[INTERNAL(name)] = Klass.c[name];
		}
		Klass.c[name] = v;
		return Klass;
	};

	Klass.end = function(){
		_$("</class>");
	};
	
	GLog = {write:log,writeUrl:log,writeHtml:log};

	/**
	 * GLatLng
	 */	
	Klass("LatLng",function(lat,lng){
		if(typeof(lng)==="string"){
			lng = parseFloat(lng);
		}
		if(typeof(lat)==="string"){
			lat = parseFloat(lat);
		}
		this._impl = new AMap.LngLat(lng, lat);
	},[
		AMap.LngLat
	])
	.impl("lat",function(){
		return this._impl.lat;
	})
	.impl("lng",function(){
		return this._impl.lng;
	})
	.same("toString")
	.end();

	/**
	 * Map
	 */
	Klass("Map",function(e,opt){
		_formatMapOpt(opt);
		//console.log(opt);
		this._impl = new AMap.Map(e, opt);
		(function(amap){
		amap.plugin(["AMap.ToolBar"], function(){
				tool = new AMap.ToolBar({
				direction : false,//隐藏方向导航
				ruler : true
				});
				amap.addControl(tool);
			});
		})(this._impl);
		_gprivate.maps.push(this);
		_gprivate.activeMap = this;
	},[
		AMap.Map
	])
	.impl("setCenter",function(latlng){
		latlng = latlng._impl;
		this._impl.setCenter(latlng);
	})
	.end();

	function _formatMapOpt(opt){
		if(opt.center){
			opt.center = opt.center._impl;
		}
		if(opt.mapTypeId){
			delete opt.mapTypeId;
		}
		if(opt.zoom){
			opt.level = opt.zoom;
			delete opt.zoom;
		}
		if(opt.minZoom){
			var minZoom = opt.minZoom>=3 ? opt.minZoom : 3;
			delete opt.minZoom;
		} else {
			var minZoom = 3;	
		}
		if(opt.maxZoom){
			var maxZoom = opt.maxZoom<=18 ? opt.maxZoom : 18;
			delete opt.maxZoom;
		} else {
			var maxZoom = 18;	
		}
		/*
		if(opt.scaleControl==undefined){
			
		}*/
		opt.zooms = [minZoom, maxZoom];
	}

	/**
	 * Marker
	 */
	Klass("Marker",function(opt){
		_formatMarkerOpt(opt);
		this._impl = new AMap.Marker(opt);
	},[
		AMap.Marker
	])
	.impl("setMap",function(map){
		if(map){
			map._impl.addOverlays(this._impl);
		} else {
			_gprivate.activeMap._impl.removeOverlays(this._impl.id);
		}
	})
	.same('getPosition')
	.noimpl('setAnimation')
	.end();
	
	function _formatMarkerOpt(opt){
		if(opt.position){
			opt.position = opt.position._impl;
		}
		if(opt.title){
			//opt.content = opt.title;
			delete opt.title;
		}
		if(typeof(opt.icon)=='object'){
			opt.icon = opt.icon._impl;
		} else if(opt.icon==undefined){
			opt.icon = 'http://api.amap.com/webapi/static/Images/marker_sprite.png';	
		}
		opt.offset = new AMap.Pixel(-16,-32);
	}
	
	/**
	 * MarkerImage
	 */
	Klass("MarkerImage",function(url, size, origin, anchor, scaledSize){
		var opt = {
			size : new AMap.Size(32,34),
			imageOffset : new AMap.Pixel(0,0),
			image : url
		}
		this._impl = new AMap.Icon(opt);
	},[
		AMap.MarkerImage
	])
	.end();

	/**
	 * InfoWindow 
	 */
	Klass("InfoWindow",function(opt){
		opt.autoMove = true;
		this._impl = new AMap.InfoWindow(opt);
	},[
		AMap.Pixel
	])
	.impl('getPosition', function(){
		var pos = this._impl.getPosition();
		return new google.maps.LatLng(pos.lat, pos.lng);
	 })
	.impl('open', function(map, marker){
		this._impl.open(map._impl, marker._impl.getPosition());
	 })
	.impl('close', function(){
		if(this._impl.getIsOpen()){
			this._impl.close();
		}
	 })
	.end();	
	
	/**
	 * event 
	 */
	Klass("event",function(opt){
		this._impl = _gprivate.activeMap._impl;
	},[
		AMap.Map
	])
	.statik("addListener",function(obj, e, fn){
		_gprivate.activeMap._impl.bind(obj._impl, e, fn);
	})
	.end();	
	
	/**
	 * Size
	 */
	Klass("Size",function(w, h){
		this._impl = new AMap.Size(w, h);
	},[
		AMap.Size
	])
	.end();
	
	/**
	 * Point
	 */
	Klass("Point",function(x, y){
		this._impl = new AMap.Pixel(x, y);
	},[
		AMap.Pixel
	])
	.end();	

	/**
	 * KmlLayer
	 */
	Klass("KmlLayer",function(file, opt){
	},[])
	.noimpl("setMap")
	.end();
};

if(window.M && typeof window.M.define == 'function') {
    window.M.define('/js/google2amap', function() {
        return MfwMapLoad;
    });
}
