

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require,exports,module);
  } else {
    root.ouibounce = factory();
  }
}(this, function(require,exports,module) {

return function ouibounce(el, custom_config) {
  "use strict";

  var config     = custom_config || {},
    aggressive   = config.aggressive || false,
    sensitivity  = setDefault(config.sensitivity, 20),
    timer        = setDefault(config.timer, 1000),
    delay        = setDefault(config.delay, 0),
    callback     = config.callback || function() {},
    cookieExpire = setDefaultCookieExpire(config.cookieExpire) || '',
    cookieDomain = config.cookieDomain ? ';domain=' + config.cookieDomain : '',
    cookieName   = config.cookieName ? config.cookieName : 'viewedOuibounceModal',
    sitewide     = config.sitewide === true ? ';path=/' : '',
    _delayTimer  = null,
    _html        = document.documentElement;

  function setDefault(_property, _default) {
    return typeof _property === 'undefined' ? _default : _property;
  }

  function setDefaultCookieExpire(days) {
    // transform days to milliseconds
    var ms = days*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  setTimeout(attachOuiBounce, timer);
  function attachOuiBounce() {
    if (isDisabled()) { return; }

    _html.addEventListener('mouseleave', handleMouseleave);
    _html.addEventListener('mouseenter', handleMouseenter);
    _html.addEventListener('keydown', handleKeydown);
  }

  function handleMouseleave(e) {
    if (e.clientY > sensitivity) { return; }

    _delayTimer = setTimeout(fire, delay);
  }


  function handleMouseenter() {
    if (_delayTimer) {
      clearTimeout(_delayTimer);
      _delayTimer = null;
    }
  }

  var disableKeydown = false;
  function handleKeydown(e) {
    if (disableKeydown) { return; }
    else if(!e.metaKey || e.keyCode !== 76) { return; }

    disableKeydown = true;
    _delayTimer = setTimeout(fire, delay);
  }

  function checkCookieValue(cookieName, value) {
    return parseCookies()[cookieName] === value;
  }

  function parseCookies() {
    // cookies are separated by '; '
    var cookies = document.cookie.split('; ');

    var ret = {};
    for (var i = cookies.length - 1; i >= 0; i--) {
      var el = cookies[i].split('=');
      ret[el[0]] = el[1];
    }
    return ret;
  }

  function isDisabled() {
    return checkCookieValue(cookieName, 'true') && !aggressive;
  }

  // You can use ouibounce without passing an element
  // https://github.com/carlsednaoui/ouibounce/issues/30
function fire() {
    if (isDisabled()) { return; }

    if (el) { el.style.display = 'flex'; }

    callback();
    disable();
  }

  function disable(custom_options) {
    var options = custom_options || {};

    // you can pass a specific cookie expiration when using the OuiBounce API
    // ex: _ouiBounce.disable({ cookieExpire: 5 });
    if (typeof options.cookieExpire !== 'undefined') {
      cookieExpire = setDefaultCookieExpire(options.cookieExpire);
    }

    // you can pass use sitewide cookies too
    // ex: _ouiBounce.disable({ cookieExpire: 5, sitewide: true });
    if (options.sitewide === true) {
      sitewide = ';path=/';
    }

    // you can pass a domain string when the cookie should be read subdomain-wise
    // ex: _ouiBounce.disable({ cookieDomain: '.example.com' });
    if (typeof options.cookieDomain !== 'undefined') {
      cookieDomain = ';domain=' + options.cookieDomain;
    }

    if (typeof options.cookieName !== 'undefined') {
      cookieName = options.cookieName;
    }

    document.cookie = cookieName + '=true' + cookieExpire + cookieDomain + sitewide;

    // remove listeners
    _html.removeEventListener('mouseleave', handleMouseleave);
    _html.removeEventListener('mouseenter', handleMouseenter);
    _html.removeEventListener('keydown', handleKeydown);
  }

  return {
    fire: fire,
    disable: disable,
    isDisabled: isDisabled
  };
}

/*exported ouibounce */
;

}));
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
!function(){"use strict";var t=!1;window.JQClass=function(){},JQClass.classes={},JQClass.extend=function e(n){function a(){!t&&this._init&&this._init.apply(this,arguments)}var s=this.prototype;t=!0;var i=new this;t=!1;for(var r in n)if("function"==typeof n[r]&&"function"==typeof s[r])i[r]=function(t,e){return function(){var n=this._super;this._super=function(e){return s[t].apply(this,e||[])};var a=e.apply(this,arguments);return this._super=n,a}}(r,n[r]);else if("object"==typeof n[r]&&"object"==typeof s[r]&&"defaultOptions"===r){var o,u=s[r],c=n[r],h={};for(o in u)h[o]=u[o];for(o in c)h[o]=c[o];i[r]=h}else i[r]=n[r];return a.prototype=i,a.prototype.constructor=a,a.extend=e,a}}(),function($){"use strict";function camelCase(t){return t.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()})}JQClass.classes.JQPlugin=JQClass.extend({name:"plugin",defaultOptions:{},regionalOptions:{},deepMerge:!0,_getMarker:function(){return"is-"+this.name},_init:function(){$.extend(this.defaultOptions,this.regionalOptions&&this.regionalOptions[""]||{});var t=camelCase(this.name);$[t]=this,$.fn[t]=function(e){var n=Array.prototype.slice.call(arguments,1),a=this,s=this;return this.each(function(){if("string"==typeof e){if("_"===e[0]||!$[t][e])throw"Unknown method: "+e;var i=$[t][e].apply($[t],[this].concat(n));if(i!==a&&void 0!==i)return s=i,!1}else $[t]._attach(this,e)}),s}},setDefaults:function(t){$.extend(this.defaultOptions,t||{})},_attach:function(t,e){if(!(t=$(t)).hasClass(this._getMarker())){t.addClass(this._getMarker()),e=$.extend(this.deepMerge,{},this.defaultOptions,this._getMetadata(t),e||{});var n=$.extend({name:this.name,elem:t,options:e},this._instSettings(t,e));t.data(this.name,n),this._postAttach(t,n),this.option(t,e)}},_instSettings:function(t,e){return{}},_postAttach:function(t,e){},_getMetadata:function(elem){try{var data=elem.data(this.name.toLowerCase())||"";data=data.replace(/(\\?)'/g,function(t,e){return e?"'":'"'}).replace(/([a-zA-Z0-9]+):/g,function(t,e,n){var a=data.substring(0,n).match(/"/g);return a&&a.length%2!=0?e+":":'"'+e+'":'}).replace(/\\:/g,":"),data=$.parseJSON("{"+data+"}");for(var key in data)if(data.hasOwnProperty(key)){var value=data[key];"string"==typeof value&&value.match(/^new Date\(([-0-9,\s]*)\)$/)&&(data[key]=eval(value))}return data}catch(t){return{}}},_getInst:function(t){return $(t).data(this.name)||{}},option:function(t,e,n){var a=(t=$(t)).data(this.name),s=e||{};if(!e||"string"==typeof e&&void 0===n)return(s=(a||{}).options)&&e?s[e]:s;t.hasClass(this._getMarker())&&("string"==typeof e&&((s={})[e]=n),this._optionsChanged(t,a,s),$.extend(a.options,s))},_optionsChanged:function(t,e,n){},destroy:function(t){(t=$(t)).hasClass(this._getMarker())&&(this._preDestroy(t,this._getInst(t)),t.removeData(this.name).removeClass(this._getMarker()))},_preDestroy:function(t,e){}}),$.JQPlugin={createPlugin:function(t,e){"object"==typeof t&&(e=t,t="JQPlugin"),t=camelCase(t);var n=camelCase(e.name);JQClass.classes[n]=JQClass.classes[t].extend(e),new JQClass.classes[n]}}}(jQuery);
!function(e){"use strict";e.JQPlugin.createPlugin({name:"countdown",defaultOptions:{until:null,since:null,timezone:null,serverSync:null,format:"dHMS",layout:"",compact:!1,padZeroes:!1,significant:0,description:"",expiryUrl:"",expiryText:"",alwaysExpire:!1,onExpiry:null,onTick:null,tickInterval:1},regionalOptions:{"":{labels:["Years","Months","Weeks","Days","Hours","Minutes","Seconds"],labels1:["Year","Month","Week","Day","Hour","Minute","Second"],compactLabels:["y","m","w","d"],whichLabels:null,digits:["0","1","2","3","4","5","6","7","8","9"],timeSeparator:":",isRTL:!1}},_rtlClass:"countdown-rtl",_sectionClass:"countdown-section",_amountClass:"countdown-amount",_periodClass:"countdown-period",_rowClass:"countdown-row",_holdingClass:"countdown-holding",_showClass:"countdown-show",_descrClass:"countdown-descr",_timerElems:[],_init:function(){function t(e){var a=e<1e12?n?window.performance.now()+window.performance.timing.navigationStart:s():e||s();a-r>=1e3&&(i._updateElems(),r=a),o(t)}var i=this;this._super(),this._serverSyncs=[];var s="function"==typeof Date.now?Date.now:function(){return(new Date).getTime()},n=window.performance&&"function"==typeof window.performance.now,o=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null,r=0;!o||e.noRequestAnimationFrame?(e.noRequestAnimationFrame=null,e.countdown._timer=setInterval(function(){i._updateElems()},1e3)):(r=window.animationStartTime||window.webkitAnimationStartTime||window.mozAnimationStartTime||window.oAnimationStartTime||window.msAnimationStartTime||s(),o(t))},UTCDate:function(e,t,i,s,n,o,r,a){"object"==typeof t&&t instanceof Date&&(a=t.getMilliseconds(),r=t.getSeconds(),o=t.getMinutes(),n=t.getHours(),s=t.getDate(),i=t.getMonth(),t=t.getFullYear());var l=new Date;return l.setUTCFullYear(t),l.setUTCDate(1),l.setUTCMonth(i||0),l.setUTCDate(s||1),l.setUTCHours(n||0),l.setUTCMinutes((o||0)-(Math.abs(e)<30?60*e:e)),l.setUTCSeconds(r||0),l.setUTCMilliseconds(a||0),l},periodsToSeconds:function(e){return 31557600*e[0]+2629800*e[1]+604800*e[2]+86400*e[3]+3600*e[4]+60*e[5]+e[6]},resync:function(){var t=this;e("."+this._getMarker()).each(function(){var i=e.data(this,t.name);if(i.options.serverSync){for(var s=null,n=0;n<t._serverSyncs.length;n++)if(t._serverSyncs[n][0]===i.options.serverSync){s=t._serverSyncs[n];break}if(t._eqNull(s[2])){var o=e.isFunction(i.options.serverSync)?i.options.serverSync.apply(this,[]):null;s[2]=(o?(new Date).getTime()-o.getTime():0)-s[1]}i._since&&i._since.setMilliseconds(i._since.getMilliseconds()+s[2]),i._until.setMilliseconds(i._until.getMilliseconds()+s[2])}});for(var i=0;i<t._serverSyncs.length;i++)t._eqNull(t._serverSyncs[i][2])||(t._serverSyncs[i][1]+=t._serverSyncs[i][2],delete t._serverSyncs[i][2])},_instSettings:function(e,t){return{_periods:[0,0,0,0,0,0,0]}},_addElem:function(e){this._hasElem(e)||this._timerElems.push(e)},_hasElem:function(t){return e.inArray(t,this._timerElems)>-1},_removeElem:function(t){this._timerElems=e.map(this._timerElems,function(e){return e===t?null:e})},_updateElems:function(){for(var e=this._timerElems.length-1;e>=0;e--)this._updateCountdown(this._timerElems[e])},_optionsChanged:function(t,i,s){s.layout&&(s.layout=s.layout.replace(/&lt;/g,"<").replace(/&gt;/g,">")),this._resetExtraLabels(i.options,s);var n=i.options.timezone!==s.timezone;e.extend(i.options,s),this._adjustSettings(t,i,!this._eqNull(s.until)||!this._eqNull(s.since)||n);var o=new Date;(i._since&&i._since<o||i._until&&i._until>o)&&this._addElem(t[0]),this._updateCountdown(t,i)},_updateCountdown:function(t,i){if(t=t.jquery?t:e(t),i=i||this._getInst(t)){if(t.html(this._generateHTML(i)).toggleClass(this._rtlClass,i.options.isRTL),"pause"!==i._hold&&e.isFunction(i.options.onTick)){var s="lap"!==i._hold?i._periods:this._calculatePeriods(i,i._show,i.options.significant,new Date);1!==i.options.tickInterval&&this.periodsToSeconds(s)%i.options.tickInterval!=0||i.options.onTick.apply(t[0],[s])}if("pause"!==i._hold&&(i._since?i._now.getTime()<i._since.getTime():i._now.getTime()>=i._until.getTime())&&!i._expiring){if(i._expiring=!0,this._hasElem(t[0])||i.options.alwaysExpire){if(this._removeElem(t[0]),e.isFunction(i.options.onExpiry)&&i.options.onExpiry.apply(t[0],[]),i.options.expiryText){var n=i.options.layout;i.options.layout=i.options.expiryText,this._updateCountdown(t[0],i),i.options.layout=n}i.options.expiryUrl&&(window.location=i.options.expiryUrl)}i._expiring=!1}else"pause"===i._hold&&this._removeElem(t[0])}},_resetExtraLabels:function(e,t){var i=null;for(i in t)i.match(/[Ll]abels[02-9]|compactLabels1/)&&(e[i]=t[i]);for(i in e)i.match(/[Ll]abels[02-9]|compactLabels1/)&&void 0===t[i]&&(e[i]=null)},_eqNull:function(e){return void 0===e||null===e},_adjustSettings:function(t,i,s){for(var n=null,o=0;o<this._serverSyncs.length;o++)if(this._serverSyncs[o][0]===i.options.serverSync){n=this._serverSyncs[o][1];break}var r=null,a=null;if(this._eqNull(n)){var l=e.isFunction(i.options.serverSync)?i.options.serverSync.apply(t[0],[]):null;r=new Date,a=l?r.getTime()-l.getTime():0,this._serverSyncs.push([i.options.serverSync,a])}else r=new Date,a=i.options.serverSync?n:0;var _=i.options.timezone;_=this._eqNull(_)?-r.getTimezoneOffset():_,(s||!s&&this._eqNull(i._until)&&this._eqNull(i._since))&&(i._since=i.options.since,this._eqNull(i._since)||(i._since=this.UTCDate(_,this._determineTime(i._since,null)),i._since&&a&&i._since.setMilliseconds(i._since.getMilliseconds()+a)),i._until=this.UTCDate(_,this._determineTime(i.options.until,r)),a&&i._until.setMilliseconds(i._until.getMilliseconds()+a)),i._show=this._determineShow(i)},_preDestroy:function(e,t){this._removeElem(e[0]),e.empty()},pause:function(e){this._hold(e,"pause")},lap:function(e){this._hold(e,"lap")},resume:function(e){this._hold(e,null)},toggle:function(t){this[(e.data(t,this.name)||{})._hold?"resume":"pause"](t)},toggleLap:function(t){this[(e.data(t,this.name)||{})._hold?"resume":"lap"](t)},_hold:function(t,i){var s=e.data(t,this.name);if(s){if("pause"===s._hold&&!i){s._periods=s._savePeriods;var n=s._since?"-":"+";s[s._since?"_since":"_until"]=this._determineTime(n+s._periods[0]+"y"+n+s._periods[1]+"o"+n+s._periods[2]+"w"+n+s._periods[3]+"d"+n+s._periods[4]+"h"+n+s._periods[5]+"m"+n+s._periods[6]+"s"),this._addElem(t)}s._hold=i,s._savePeriods="pause"===i?s._periods:null,e.data(t,this.name,s),this._updateCountdown(t,s)}},getTimes:function(t){var i=e.data(t,this.name);return i?"pause"===i._hold?i._savePeriods:i._hold?this._calculatePeriods(i,i._show,i.options.significant,new Date):i._periods:null},_determineTime:function(e,t){var i=this,s=this._eqNull(e)?t:"string"==typeof e?function(e){e=e.toLowerCase();for(var t=new Date,s=t.getFullYear(),n=t.getMonth(),o=t.getDate(),r=t.getHours(),a=t.getMinutes(),l=t.getSeconds(),_=/([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g,p=_.exec(e);p;){switch(p[2]||"s"){case"s":l+=parseInt(p[1],10);break;case"m":a+=parseInt(p[1],10);break;case"h":r+=parseInt(p[1],10);break;case"d":o+=parseInt(p[1],10);break;case"w":o+=7*parseInt(p[1],10);break;case"o":n+=parseInt(p[1],10),o=Math.min(o,i._getDaysInMonth(s,n));break;case"y":s+=parseInt(p[1],10),o=Math.min(o,i._getDaysInMonth(s,n))}p=_.exec(e)}return new Date(s,n,o,r,a,l,0)}(e):"number"==typeof e?function(e){var t=new Date;return t.setTime(t.getTime()+1e3*e),t}(e):e;return s&&s.setMilliseconds(0),s},_getDaysInMonth:function(e,t){return 32-new Date(e,t,32).getDate()},_normalLabels:function(e){return e},_generateHTML:function(t){var i=this;t._periods=t._hold?t._periods:this._calculatePeriods(t,t._show,t.options.significant,new Date);var s=!1,n=0,o=t.options.significant,r=e.extend({},t._show),a=null;for(a=0;a<=6;a++)s=s||"?"===t._show[a]&&t._periods[a]>0,r[a]="?"!==t._show[a]||s?t._show[a]:null,n+=r[a]?1:0,o-=t._periods[a]>0?1:0;var l=[!1,!1,!1,!1,!1,!1,!1];for(a=6;a>=0;a--)t._show[a]&&(t._periods[a]?l[a]=!0:(l[a]=o>0,o--));var _=t.options.compact?t.options.compactLabels:t.options.labels,p=t.options.whichLabels||this._normalLabels,c=function(e){var s=t.options["compactLabels"+p(t._periods[e])];return r[e]?i._translateDigits(t,t._periods[e])+(s?s[e]:_[e])+" ":""},u=t.options.padZeroes?2:1,d=function(e){var s=t.options["labels"+p(t._periods[e])];return!t.options.significant&&r[e]||t.options.significant&&l[e]?'<span class="'+i._sectionClass+'"><span class="'+i._amountClass+'">'+i._minDigits(t,t._periods[e],u)+'</span><span class="'+i._periodClass+'">'+(s?s[e]:_[e])+"</span></span>":""};return t.options.layout?this._buildLayout(t,r,t.options.layout,t.options.compact,t.options.significant,l):(t.options.compact?'<span class="'+this._rowClass+" "+this._amountClass+(t._hold?" "+this._holdingClass:"")+'">'+c(0)+c(1)+c(2)+c(3)+(r[4]?this._minDigits(t,t._periods[4],2):"")+(r[5]?(r[4]?t.options.timeSeparator:"")+this._minDigits(t,t._periods[5],2):"")+(r[6]?(r[4]||r[5]?t.options.timeSeparator:"")+this._minDigits(t,t._periods[6],2):""):'<span class="'+this._rowClass+" "+this._showClass+(t.options.significant||n)+(t._hold?" "+this._holdingClass:"")+'">'+d(0)+d(1)+d(2)+d(3)+d(4)+d(5)+d(6))+"</span>"+(t.options.description?'<span class="'+this._rowClass+" "+this._descrClass+'">'+t.options.description+"</span>":"")},_buildLayout:function(t,i,s,n,o,r){for(var a=t.options[n?"compactLabels":"labels"],l=t.options.whichLabels||this._normalLabels,_=function(e){return(t.options[(n?"compactLabels":"labels")+l(t._periods[e])]||a)[e]},p=function(e,i){return t.options.digits[Math.floor(e/i)%10]},c={desc:t.options.description,sep:t.options.timeSeparator,yl:_(0),yn:this._minDigits(t,t._periods[0],1),ynn:this._minDigits(t,t._periods[0],2),ynnn:this._minDigits(t,t._periods[0],3),y1:p(t._periods[0],1),y10:p(t._periods[0],10),y100:p(t._periods[0],100),y1000:p(t._periods[0],1e3),ol:_(1),on:this._minDigits(t,t._periods[1],1),onn:this._minDigits(t,t._periods[1],2),onnn:this._minDigits(t,t._periods[1],3),o1:p(t._periods[1],1),o10:p(t._periods[1],10),o100:p(t._periods[1],100),o1000:p(t._periods[1],1e3),wl:_(2),wn:this._minDigits(t,t._periods[2],1),wnn:this._minDigits(t,t._periods[2],2),wnnn:this._minDigits(t,t._periods[2],3),w1:p(t._periods[2],1),w10:p(t._periods[2],10),w100:p(t._periods[2],100),w1000:p(t._periods[2],1e3),dl:_(3),dn:this._minDigits(t,t._periods[3],1),dnn:this._minDigits(t,t._periods[3],2),dnnn:this._minDigits(t,t._periods[3],3),d1:p(t._periods[3],1),d10:p(t._periods[3],10),d100:p(t._periods[3],100),d1000:p(t._periods[3],1e3),hl:_(4),hn:this._minDigits(t,t._periods[4],1),hnn:this._minDigits(t,t._periods[4],2),hnnn:this._minDigits(t,t._periods[4],3),h1:p(t._periods[4],1),h10:p(t._periods[4],10),h100:p(t._periods[4],100),h1000:p(t._periods[4],1e3),ml:_(5),mn:this._minDigits(t,t._periods[5],1),mnn:this._minDigits(t,t._periods[5],2),mnnn:this._minDigits(t,t._periods[5],3),m1:p(t._periods[5],1),m10:p(t._periods[5],10),m100:p(t._periods[5],100),m1000:p(t._periods[5],1e3),sl:_(6),sn:this._minDigits(t,t._periods[6],1),snn:this._minDigits(t,t._periods[6],2),snnn:this._minDigits(t,t._periods[6],3),s1:p(t._periods[6],1),s10:p(t._periods[6],10),s100:p(t._periods[6],100),s1000:p(t._periods[6],1e3)},u=s,d=0;d<=6;d++){var h="yowdhms".charAt(d),m=new RegExp("\\{"+h+"<\\}([\\s\\S]*)\\{"+h+">\\}","g");u=u.replace(m,!o&&i[d]||o&&r[d]?"$1":"")}return e.each(c,function(e,t){var i=new RegExp("\\{"+e+"\\}","g");u=u.replace(i,t)}),u},_minDigits:function(e,t,i){return(t=""+t).length>=i?this._translateDigits(e,t):(t="0000000000"+t,this._translateDigits(e,t.substr(t.length-i)))},_translateDigits:function(e,t){return(""+t).replace(/[0-9]/g,function(t){return e.options.digits[t]})},_determineShow:function(e){var t=e.options.format,i=[];return i[0]=t.match("y")?"?":t.match("Y")?"!":null,i[1]=t.match("o")?"?":t.match("O")?"!":null,i[2]=t.match("w")?"?":t.match("W")?"!":null,i[3]=t.match("d")?"?":t.match("D")?"!":null,i[4]=t.match("h")?"?":t.match("H")?"!":null,i[5]=t.match("m")?"?":t.match("M")?"!":null,i[6]=t.match("s")?"?":t.match("S")?"!":null,i},_calculatePeriods:function(e,t,i,s){e._now=s,e._now.setMilliseconds(0);var n=new Date(e._now.getTime());e._since?s.getTime()<e._since.getTime()?e._now=s=n:s=e._since:(n.setTime(e._until.getTime()),s.getTime()>e._until.getTime()&&(e._now=s=n));var o=[0,0,0,0,0,0,0];if(t[0]||t[1]){var r=this._getDaysInMonth(s.getFullYear(),s.getMonth()),a=this._getDaysInMonth(n.getFullYear(),n.getMonth()),l=n.getDate()===s.getDate()||n.getDate()>=Math.min(r,a)&&s.getDate()>=Math.min(r,a),_=function(e){return 60*(60*e.getHours()+e.getMinutes())+e.getSeconds()},p=Math.max(0,12*(n.getFullYear()-s.getFullYear())+n.getMonth()-s.getMonth()+(n.getDate()<s.getDate()&&!l||l&&_(n)<_(s)?-1:0));o[0]=t[0]?Math.floor(p/12):0,o[1]=t[1]?p-12*o[0]:0;var c=(s=new Date(s.getTime())).getDate()===r,u=this._getDaysInMonth(s.getFullYear()+o[0],s.getMonth()+o[1]);s.getDate()>u&&s.setDate(u),s.setFullYear(s.getFullYear()+o[0]),s.setMonth(s.getMonth()+o[1]),c&&s.setDate(u)}var d=Math.floor((n.getTime()-s.getTime())/1e3),h=null,m=function(e,i){o[e]=t[e]?Math.floor(d/i):0,d-=o[e]*i};if(m(2,604800),m(3,86400),m(4,3600),m(5,60),m(6,1),d>0&&!e._since){var g=[1,12,4.3482,7,24,60,60],w=6,f=1;for(h=6;h>=0;h--)t[h]&&(o[w]>=f&&(o[w]=0,d=1),d>0&&(o[h]++,d=0,w=h,f=1)),f*=g[h]}if(i)for(h=0;h<=6;h++)i&&o[h]?i--:i||(o[h]=0);return o}})}(jQuery);
!function(t){"use strict";t.countdown.regionalOptions.ru={labels:["Лет","Месяцев","Недель","Дней","Часов","Минут","Секунд"],labels1:["Год","Месяц","Неделя","День","Час","Минута","Секунда"],labels2:["Года","Месяца","Недели","Дня","Часа","Минуты","Секунды"],compactLabels:["л","м","н","д"],compactLabels1:["г","м","н","д"],whichLabels:function(t){var o=t%10,a=Math.floor(t%100/10);return 1===t?1:o>=2&&o<=4&&1!==a?2:1===o&&1!==a?1:0},digits:["0","1","2","3","4","5","6","7","8","9"],timeSeparator:":",isRTL:!1},t.countdown.setDefaults(t.countdown.regionalOptions.ru)}(jQuery);
/*! jQuery Validation Plugin - v1.16.0 - 12/2/2016
 * http://jqueryvalidation.org/
 * Copyright (c) 2016 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return!c.settings.submitHandler||(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e&&e)}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,b||(d=d.concat(c.errorList))}),c.errorList=d),b},rules:function(b,c){var d,e,f,g,h,i,j=this[0];if(null!=j&&null!=j.form){if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}}),a.extend(a.expr.pseudos||a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){var c=a(b).val();return null!==c&&!!a.trim(""+c)},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:void 0===c?b:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",pendingClass:"pending",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||a.inArray(c.keyCode,d)!==-1||(b.name in this.submitted||b.name in this.invalid)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}."),step:a.validator.format("Please enter a multiple of {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){!this.form&&this.hasAttribute("contenteditable")&&(this.form=a(this).closest("form")[0]);var c=a.data(this.form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!a(this).is(e.ignore)&&e[d].call(c,this,b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c,d,e=this.clean(b),f=this.validationTargetFor(e),g=this,h=!0;return void 0===f?delete this.invalid[e.name]:(this.prepareElement(f),this.currentElements=a(f),d=this.groups[f.name],d&&a.each(this.groups,function(a,b){b===d&&a!==f.name&&(e=g.validationTargetFor(g.clean(g.findByName(a))),e&&e.name in g.invalid&&(g.currentElements.push(e),h=g.check(e)&&h))}),c=this.check(f)!==!1,h=h&&c,c?this.invalid[f.name]=!1:this.invalid[f.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),a(b).attr("aria-invalid",!c)),h},showErrors:function(b){if(b){var c=this;a.extend(this.errorMap,b),this.errorList=a.map(this.errorMap,function(a,b){return{message:a,element:c.findByName(b)[0]}}),this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.invalid={},this.submitted={},this.prepareForm(),this.hideErrors();var b=this.elements().removeData("previousValue").removeAttr("aria-invalid");this.resetElements(b)},resetElements:function(a){var b;if(this.settings.unhighlight)for(b=0;a[b];b++)this.settings.unhighlight.call(this,a[b],this.settings.errorClass,""),this.findByName(a[b].name).removeClass(this.settings.validClass);else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)a[b]&&c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){var d=this.name||a(this).attr("name");return!d&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.hasAttribute("contenteditable")&&(this.form=a(this).closest("form")[0]),!(d in c||!b.objectLength(a(this).rules()))&&(c[d]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},resetInternals:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([])},reset:function(){this.resetInternals(),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d,e=a(b),f=b.type;return"radio"===f||"checkbox"===f?this.findByName(b.name).filter(":checked").val():"number"===f&&"undefined"!=typeof b.validity?b.validity.badInput?"NaN":e.val():(c=b.hasAttribute("contenteditable")?e.text():e.val(),"file"===f?"C:\\fakepath\\"===c.substr(0,12)?c.substr(12):(d=c.lastIndexOf("/"),d>=0?c.substr(d+1):(d=c.lastIndexOf("\\"),d>=0?c.substr(d+1):c)):"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);if("function"==typeof f.normalizer){if(i=f.normalizer.call(b,i),"string"!=typeof i)throw new TypeError("The normalizer should return a string value.");delete f.normalizer}for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j instanceof TypeError&&(j.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]},defaultMessage:function(b,c){"string"==typeof c&&(c={method:c});var d=this.findDefined(this.customMessage(b.name,c.method),this.customDataMessage(b,c.method),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c.method],"<strong>Warning: No message defined for "+b.name+"</strong>"),e=/\$?\{(\d+)\}/g;return"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),d},formatAndAdd:function(a,b){var c=this.defaultMessage(a,b);this.errorList.push({message:c,element:a,method:b.method}),this.errorMap[a.name]=c,this.submitted[a.name]=c},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g,h=this.errorsFor(b),i=this.idOrName(b),j=a(b).attr("aria-describedby");h.length?(h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),h.html(c)):(h=a("<"+this.settings.errorElement+">").attr("id",i+"-error").addClass(this.settings.errorClass).html(c||""),d=h,this.settings.wrapper&&(d=h.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement.call(this,d,a(b)):d.insertAfter(b),h.is("label")?h.attr("for",i):0===h.parents("label[for='"+this.escapeCssMeta(i)+"']").length&&(f=h.attr("id"),j?j.match(new RegExp("\\b"+this.escapeCssMeta(f)+"\\b"))||(j+=" "+f):j=f,a(b).attr("aria-describedby",j),e=this.groups[b.name],e&&(g=this,a.each(g.groups,function(b,c){c===e&&a("[name='"+g.escapeCssMeta(b)+"']",g.currentForm).attr("aria-describedby",h.attr("id"))})))),!c&&this.settings.success&&(h.text(""),"string"==typeof this.settings.success?h.addClass(this.settings.success):this.settings.success(h,b)),this.toShow=this.toShow.add(h)},errorsFor:function(b){var c=this.escapeCssMeta(this.idOrName(b)),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+this.escapeCssMeta(d).replace(/\s+/g,", #")),this.errors().filter(e)},escapeCssMeta:function(a){return a.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g,"\\$1")},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+this.escapeCssMeta(b)+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return!this.dependTypes[typeof a]||this.dependTypes[typeof a](a,b)},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){this.pending[b.name]||(this.pendingRequest++,a(b).addClass(this.settings.pendingClass),this.pending[b.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],a(b).removeClass(this.settings.pendingClass),c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b,c){return c="string"==typeof c&&c||"remote",a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,{method:c})})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max|step/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0===e.param||e.param:(a.data(c.form,"validator").resetElements(a(c)),delete b[d])}}),a.each(b,function(d,e){b[d]=a.isFunction(e)&&"normalizer"!==d?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e<=d},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||a<=c},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},step:function(b,c,d){var e,f=a(c).attr("type"),g="Step attribute on input type "+f+" is not supported.",h=["text","number","range"],i=new RegExp("\\b"+f+"\\b"),j=f&&!i.test(h.join()),k=function(a){var b=(""+a).match(/(?:\.(\d+))?$/);return b&&b[1]?b[1].length:0},l=function(a){return Math.round(a*Math.pow(10,e))},m=!0;if(j)throw new Error(g);return e=k(d),(k(b)>e||l(b)%l(d)!==0)&&(m=!1),this.optional(c)||m},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.not(".validate-equalTo-blur").length&&e.addClass("validate-equalTo-blur").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d,e){if(this.optional(c))return"dependency-mismatch";e="string"==typeof e&&e||"remote";var f,g,h,i=this.previousValue(c,e);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),i.originalMessage=i.originalMessage||this.settings.messages[c.name][e],this.settings.messages[c.name][e]=i.message,d="string"==typeof d&&{url:d}||d,h=a.param(a.extend({data:b},d.data)),i.old===h?i.valid:(i.old=h,f=this,this.startRequest(c),g={},g[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:g,context:f.currentForm,success:function(a){var d,g,h,j=a===!0||"true"===a;f.settings.messages[c.name][e]=i.originalMessage,j?(h=f.formSubmitted,f.resetInternals(),f.toHide=f.errorsFor(c),f.formSubmitted=h,f.successList.push(c),f.invalid[c.name]=!1,f.showErrors()):(d={},g=a||f.defaultMessage(c,{method:e,parameters:b}),d[c.name]=i.message=g,f.invalid[c.name]=!0,f.showErrors(d)),i.valid=j,f.stopRequest(c,j)}},d)),"pending")}}});var b,c={};return a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)}),a});
/*!
 * jQuery.scrollTo
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler ○ gmail • com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @projectDescription Lightweight, cross-browser and highly customizable animated scrolling with jQuery
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global
		factory(jQuery);
	}
})(function($) {
	'use strict';

	var $scrollTo = $.scrollTo = function(target, duration, settings) {
		return $(window).scrollTo(target, duration, settings);
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: 0,
		limit:true
	};

	function isWin(elem) {
		return !elem.nodeName ||
			$.inArray(elem.nodeName.toLowerCase(), ['iframe','#document','html','body']) !== -1;
	}		

	$.fn.scrollTo = function(target, duration, settings) {
		if (typeof duration === 'object') {
			settings = duration;
			duration = 0;
		}
		if (typeof settings === 'function') {
			settings = { onAfter:settings };
		}
		if (target === 'max') {
			target = 9e9;
		}

		settings = $.extend({}, $scrollTo.defaults, settings);
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.duration;
		// Make sure the settings are given right
		var queue = settings.queue && settings.axis.length > 1;
		if (queue) {
			// Let's keep the overall duration
			duration /= 2;
		}
		settings.offset = both(settings.offset);
		settings.over = both(settings.over);

		return this.each(function() {
			// Null target yields nothing, just like jQuery does
			if (target === null) return;

			var win = isWin(this),
				elem = win ? this.contentWindow || window : this,
				$elem = $(elem),
				targ = target, 
				attr = {},
				toff;

			switch (typeof targ) {
				// A number will pass the regex
				case 'number':
				case 'string':
					if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						// We are done
						break;
					}
					// Relative/Absolute selector
					targ = win ? $(targ) : $(targ, elem);
					/* falls through */
				case 'object':
					if (targ.length === 0) return;
					// DOMElement / jQuery
					if (targ.is || targ.style) {
						// Get the real position of the target
						toff = (targ = $(targ)).offset();
					}
			}

			var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

			$.each(settings.axis.split(''), function(i, axis) {
				var Pos	= axis === 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					prev = $elem[key](),
					max = $scrollTo.max(elem, axis);

				if (toff) {// jQuery / DOMElement
					attr[key] = toff[pos] + (win ? 0 : prev - $elem.offset()[pos]);

					// If it's a dom element, reduce the margin
					if (settings.margin) {
						attr[key] -= parseInt(targ.css('margin'+Pos), 10) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width'), 10) || 0;
					}

					attr[key] += offset[pos] || 0;

					if (settings.over[pos]) {
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis === 'x'?'width':'height']() * settings.over[pos];
					}
				} else {
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) === '%' ?
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if (settings.limit && /^\d+$/.test(attr[key])) {
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
				}

				// Don't waste time animating, if there's no need.
				if (!i && settings.axis.length > 1) {
					if (prev === attr[key]) {
						// No animation needed
						attr = {};
					} else if (queue) {
						// Intermediate animation
						animate(settings.onAfterFirst);
						// Don't animate this axis again in the next iteration.
						attr = {};
					}
				}
			});

			animate(settings.onAfter);

			function animate(callback) {
				var opts = $.extend({}, settings, {
					// The queue setting conflicts with animate()
					// Force it to always be true
					queue: true,
					duration: duration,
					complete: callback && function() {
						callback.call(elem, targ, settings);
					}
				});
				$elem.animate(attr, opts);
			}
		});
	};

	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function(elem, axis) {
		var Dim = axis === 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;

		if (!isWin(elem))
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();

		var size = 'client' + Dim,
			doc = elem.ownerDocument || elem.document,
			html = doc.documentElement,
			body = doc.body;

		return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
	};

	function both(val) {
		return $.isFunction(val) || $.isPlainObject(val) ? val : { top:val, left:val };
	}

	// Add special hooks so that window scroll properties can be animated
	$.Tween.propHooks.scrollLeft = 
	$.Tween.propHooks.scrollTop = {
		get: function(t) {
			return $(t.elem)[t.prop]();
		},
		set: function(t) {
			var curr = this.get(t);
			// If interrupt is true and user scrolled, stop animating
			if (t.options.interrupt && t._last && t._last !== curr) {
				return $(t.elem).stop();
			}
			var next = Math.round(t.now);
			// Don't waste CPU
			// Browsers don't render floating point scroll
			if (curr !== next) {
				$(t.elem)[t.prop](next);
				t._last = this.get(t);
			}
		}
	};

	// AMD requirement
	return $scrollTo;
});
(function($,doc,win) {
	win.App = win.App || {};
	var google=false;
	var yandex=false;
	if($('body').data('google') && typeof ga == 'function'){
		google=true;
		ga('create', $('body').data('google'));
	}
	if($('body').data('yandex') && typeof reachGoal =='function' && typeof Ya === 'object'){
		yandex=true
		var ya = 'yaCounter'+$('body').data('yandex');
	}
	$.extend(true, App, {
		_q: [],
		window: $(win),
		document: $(doc),
		page: $('html, body'), 
		body: $('body'),
		_currentNiche: App._currentNiche || 0,
		mounth_names: {
			gb: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			fr: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Ottobre","Novembre","Décembre"],
			de: ["Januar","Februar","März","April","Kann","Juni","Juli","August","September","Oktober","November","Dezember"],
			pl: ["Styczeń","Luty","Marzec","Kwiecień","Może","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],
			it: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Potrebbe", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
			es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			ro: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
			sk: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "Septembra", "Október", "November", "December"],
			bg: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
			no: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
			gr: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
			nl: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
			dk: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
			hu: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
			pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
			fi: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Saattaa", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
			cz: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
			se: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
			lv: ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"],
			lt: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželio mėn", "Liepos mėn", "Rugpjūtis", "Rugsėjis", "Spalio mėn", "Lapkričio mėn", "Gruodžio mėn"],
			ee: ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"]
		},
		getURLParameter: function(url, name) {
			return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
		},
		lock_scroll_body:function($contain){
			var scrollTop=$(win).scrollTop();
			App.body.css('margin-top', '-'+scrollTop+'px')
			App.body.data('scroll', scrollTop)
			App.body.addClass('scroll_lock');
			var selScrollable = $contain;
			$(document).on('touchmove',function(e){
				e.preventDefault();
			});
			App.body.on('touchstart', selScrollable, function(e) {
				if (e.currentTarget.scrollTop === 0) {
					e.currentTarget.scrollTop = 1;
				} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
					e.currentTarget.scrollTop -= 1;
				}
			});
			App.body.on('touchmove', selScrollable, function(e) {
				e.stopPropagation();
			}); 
			$($contain).focus();
		},
		unlock_scroll_body: function(){
			App.body.removeAttr('style')
			App.body.removeClass('scroll_lock')
			$(win).scrollTop(App.body.data('scroll')) 
			$(document).off('touchmove');
			App.body.off('touchstart');
			App.body.off('touchmove');
		},
		initTime: function(){
			var lang = $('html').attr('lang');
			var d = new Date();
			current_lang=App.mounth_names[lang];
			warning='.warning';
			if($(warning).length){
				warning_text=$(warning).find("p:first").html();
				warning_text=warning_text.replace('52', '<i class="date">52</i>'); 
				$(warning).find("p:first").html(warning_text)
				if(typeof current_lang != 'undefined'){
					$(warning).find('i.date:first').html(current_lang[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear())
				}
			}

		},
		initMobile: function(){
			if(App.body.hasClass('cart_mobile')){
				var ww = window.screen.width;
				var mw = 320; // min width of site
				var ratio =  ww / mw; //calculate ratio
				var viewport_meta_tag = document.getElementById('viewport');
				viewport_meta_tag.setAttribute('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=no, width=' + mw);
				$(doc).on('click', '.order_now', function(e){
					e.preventDefault();
					$('html, body').animate({
						 scrollTop: $('.sidebar_side').offset().top-15
					}, 700);
				});
			}
		},
		initWarning: function(){
			warning='.warning';
			if($.cookie('warning')=='closed'){
				$(warning).remove()
			}
			$(doc).on('click', warning+' .close', function(e){
				e.preventDefault();
				$(this).parents(warning).hide()
				$.cookie('warning', 'closed');
			});
		},
		initPopupClose: function(){ 
			disable_popup=App.getURLParameter(window.location.href, 'bp') || 1;
			$(win).on('load', function(){
				if($('#step_1').length && App.body.hasClass('page_home') && disable_popup!=0){
					var _ouibounce = ouibounce(document.getElementById('step_1'), {
							aggressive: true,
							timer: 0,
							callback: function(){
								if(yandex){
									window[ya].reachGoal('popup1_60percent_open');
								}
								if(google){
									ga('send', 'event', 'popup', 'open', 'popup1_60percent');
								}
							}
					});
					$('#step_1 img').on('click', function(){
						if(yandex){
							window[ya].reachGoal('popup1_60percent_click');
						}
						if(google){
							ga('send', 'event', 'popup', 'click', 'popup1_60percent')
						}
					})
				}
			})
		},
		initPopup: function(){
			$(doc).on('click','[data-popup]',function(e){
				e.preventDefault()
				if($($(this).data('popup')).length){
					App.lock_scroll_body($(this).data('popup'));
					$($(this).data('popup')).fadeIn('slow', function(){
						$(this).addClass('opened'); 
					}).css('display', 'flex');
				}
			});
			$(doc).on('click','.popup .close, .popup .close_btn, .popup .close_container, .popup .discount_popup__close', function(e) {
				e.preventDefault();
				var t=$(this);
				App.unlock_scroll_body('slow')
				t.parents('.popup').fadeOut();
				t.parents('.popup').removeClass('opened');
			});
		},
		initUpsell: function(){
			var getCleanUrl = function(url) {
				return url.replace(/#.*$/, '').replace(/\?.*$/, '');
			};
			if(App.body.hasClass('page_upsell')){
				if (!App.body.hasClass('disable_ajax')) {
					App.body.addClass('disable_ajax');
					var from=App.getURLParameter(window.location.href, 'from');
					$.ajax({
						url: 'cart.php',
						type: 'GET',
						data: 'ajax=true&action=upsell&from='+from,
						success:function(html){
							App.body.removeClass('disable_ajax');
							App.body.append(html)
							$timer_container=$('.timer strong');
							if($timer_container.length){
								var now = new Date();
								var time = now.getTime();
								time += 3600 * 1000;
								now.setTime(time);
								if($.cookie('timerDate')){
									now= new Date($.cookie('timerDate'));
								} else {
									$.cookie('timerDate', now, {expires: 1});
								}
								//console.log(austDay)
								var austDay = new Date();
									austDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
								
								$timer_container.each(function(index, el) {
									$(this).countdown({
										until: austDay,
										layout: '00:{mnn}:{snn}',
										compact: true
									}); 
								});
							}
							var upsell_container=$('.popup#upsell');
							if($('body').data('yandex') && typeof reachGoal =='function' && typeof Ya === 'object'){
						 		window[ya] = new Ya.Metrika({id: App.body.data('yandex')});
						 	}

							upsell_container.fadeIn('slow', function(){
								App.lock_scroll_body('#upsell');
								$(this).addClass('opened');

								if(yandex){
									window[ya].reachGoal('popup5_upsell_open'); 
								}
								if(google){
									ga('send', 'event', 'popup', 'open', 'popup5');
								}
							}).css('display', 'flex');
							$('.popup#upsell .close_container, .popup#upsell .close').on('click', function(e){
								e.preventDefault()
								$('.fixed_upsell').addClass('animated')
							})
							$('.popup#upsell .popup_container .timer_container .cart_button, .popup#upsell .popup_container .timer_container .close_popup').on('click', function(e){
								App.unlock_scroll_body()
								e.preventDefault()
								upsell_container.fadeOut();
								if(yandex){
									window[ya].reachGoal('popup5_upsell_click');
								}
								if(google){
									ga('send', 'event', 'popup', 'click', 'popup5');
								}
								$('.fixed_upsell').addClass('animated')
							})
						}
					});
				
					var order_id=App.getURLParameter(window.location.href, 'orderID');

					if(order_id && !$.cookie('orderID')){
						$.cookie('orderID', order_id, {expires: 1});
					}
				} 
			}
		},
		initPage: function(){
			if(!App.body.hasClass('page_upsell')){
				var session=App.getURLParameter(window.location.href, 'session');
				var aff_id=App.getURLParameter(window.location.href, 'aff_id');
				var fbid=App.getURLParameter(window.location.href, 'fbid');
				var px=App.getURLParameter(window.location.href, 'px');
				var aff_sub=App.getURLParameter(window.location.href, 'aff_sub');
				var aff_sub2=App.getURLParameter(window.location.href, 'aff_sub2');
				var aff_sub3=App.getURLParameter(window.location.href, 'aff_sub3');
				var aff_sub4=App.getURLParameter(window.location.href, 'aff_sub4');
				var aff_sub5=App.getURLParameter(window.location.href, 'aff_sub5');


				if(aff_sub){
					$.cookie('aff_sub', aff_sub);
				}
				if(aff_sub2){
					$.cookie('aff_sub2', aff_sub2);
				}
				if(aff_sub3){
					$.cookie('aff_sub3', aff_sub3);
				}
				if(aff_sub4){
					$.cookie('aff_sub4', aff_sub4);
				}
				if(aff_sub5){
					$.cookie('aff_sub5', aff_sub5);
				}

				if(session && aff_id){
					$.cookie('session', session);
					$.cookie('aff_id', aff_id);
				}
				if(px && px!='{px}'){
					$.cookie('px', px);
				}
				if(fbid && px!='{fbid}'){
					$.cookie('fbid', fbid);
				}
			} else {
				$.removeCookie('session');
				$.removeCookie('aff_id');
			}
			if($('input[name="phone"]').length){
				$.ajax({
					url: '/gb/cart.php',
					type: 'GET',
					data: 'get_phone_code=1',
					success: function (data) {
						data = $.parseJSON(data);
						if (data.code) {
							$('[name="phone"]').parent().find('.example, .field_ex').each(function(){
								$(this).text($(this).text().replace('+490', data.code));
							})
							$('[name="phone"]').each(function(){
								var t= $(this),
									code_input=t.parents('form').find('input[name=phone_code]');
								if(code_input.length){
									t.parents('form').find('input[name=phone_code]')
										.val(data.code)
										.attr('placeholder', data.code)
								}
							})
						}
					}
				});
			}
		},
		initCOD: function(){
			if(App.body.hasClass('page_cod') || App.body.hasClass('page_cod2')){
 				$(doc).on('click', '.fixed_widget__container .top_line__close' , function(e){
					e.preventDefault();
					clearTimeout(App.body.data('interval'));
					clearTimeout(App.body.data('timeout'));
					$('.fixed_widget__container').remove();
				});
 

				var wbn=(function(){
					var module={}

					function compareRandom(a, b) {
						return Math.random() - 0.5;
					}
					function mb_strlen (s) {
						return ~-encodeURI(s).split(/%..|./).length;
					}
					$(doc).on('click', '.fixed_widget__container .top_line__close',function(e){
						e.preventDefault();
						wbn.Stop();
					})
					module.Start=function(callback){
						$.ajax({
							url: 'cart.php',
							type: 'POST',
							data: 'widget_buy_now=show&getData=1',
							success: function(html){
								if(html.indexOf('exit')<=0){
									data=JSON.parse(html);
									console.log('widget start');
									if(data.city.length!=0 || data.names.length!=0){
										module.insertCss();
										setTimeout(function(){
											module.init(data);
											interval=setInterval(function(){
												module.init(data);
											}, 20000);
											App.body.data('interval', interval);
										}, 10000)
									} else {
										console.log('widget stoped data.city.length!=0 || data.names.length!=0')
									}
								} else {
									console.log('widget stoped data.price not found')
								}
								//l(JSON.parse(html));
							}
						});
					}
					module.Stop=function(message){
						interval=App.body.data('interval');
						clearTimeout(interval);
						$('.fixed_widget__update__box').remove();
						console.log('widget stoped: '+message);
					}
					module.getRandom=function(array){
						var new_array=[];
						if(typeof array == 'object'){
							x=0;
							$.each(array, function(index, val) {
								for(i=0; i<val; i++){ 
									x++;
									new_array[x] = index; 
								}
							});
							new_array.sort(compareRandom);
						}
						return new_array;
					}
					module.insertCss=function(){
						$.ajax({
							url: 'cart.php',
							type: 'POST',
							data: 'widget_buy_now=show&getCss=1',
							success: function(css){
								App.body.append(css);
							}
						});
					}
					module.insertTpl=function(data){
						var template= module.Tpl(data);
						//Add template
						if(!$('.fixed_widget__update__box').length){
							App.body.append('<div class="fixed_widget__update__box">'+template+'</div>');
						} else {
							//Update template
							$('.fixed_widget__update__box').html(template);
							
						}
						var height_line=$('.fixed_upsell').outerHeight();
						if(!height_line) height_line=0;
						height_line=height_line+10;
						bottom_before= height_line+'px';
						bottom_after='80px';
						if($(window).innerWidth()<768){
							bottom_before= '0px';
							bottom_after='-80px';
						}
						$('.fixed_widget__container .fixed_widget').animate({
							opacity: 1,
							bottom: bottom_before}, 800
						);
						var timeout=setTimeout(function(){
							if($('.fixed_widget__container .fixed_widget').length){
								$('.fixed_widget__container .fixed_widget').animate({
									opacity: 0,
									bottom: bottom_after},
									800);
							}
						}, 8*1000);
						App.body.data('timeout', timeout);
						return template;
					}
					//module.
					module.Tpl=function(data){
						if(data.count==7){
							data.image_count=6;
						} else {
							data.image_count=data.count;
						}
						$tpl = "\n\t\t\t\t\t\t\t\t<div class=\"fixed_widget__container\">\n\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget__image\">\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"" + data.image_url + "product_" + data.image_count + ".png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget__info\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget__info__top_line\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span>" + data.text.last_order + "</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"top_line__close\"></div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget_info__user\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget_info__user__name\">" + data.name.first_name + " " + data.name.second_name + " <span class=\"fixed_widget__hidden_mobile\">" + data.text.from + "</span> </div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"fixed_widget_info__user__city\">" + data.city + "</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div><strong>" + data.text.ordered + " <span class=\"fixed_widget_info__user__count\">" + data.count + " " + data.text.pcs + " " + data.text.at + " " + data.currency + data.price + "</span></strong></div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>";
						return $tpl;
					}
					module.getCount=function(object){
						if(typeof object =='object'){
							result=module.getRandom(object);
							return result[0];
						} else {
							return null;
						}
					}
					module.HideText=function(name, chars){
						strlen=mb_strlen(name, 'UTF-8');
						stars=strlen-chars;
						text='';
						for (i=0; i < stars; i++) { 
							text+='*';
						}
						return name.substr(0, chars)+text;
					}
					module.getName=function(names, gender){
						if(typeof names =='object' && names.length){
							randomedGender=module.getRandom(gender);
							resultNames=names.filter(function(el){
								return el.gender==randomedGender[0];
							});
							resultNames.sort(compareRandom);
							return {
								first_name: resultNames[0].first_name , 
								second_name: module.HideText(resultNames[0].second_name, 2)};
						} else {
							module.Stop('getName is null');
							return ' ';
						}
					}
					module.getCity=function(object){
						if(typeof object =='object' && object.length){
							object.sort(compareRandom);
							return object[0].name;
						} else {
							module.Stop('getCity is null');
							return ' ';
						}
					}

					module.init=function(data){
						pcs_count=module.getCount(data.price.procent);
						tpl_data={
							currency: data.currency,
							image_url: data.image_url,
							city: module.getCity(data.city),
							price: data.price.price[pcs_count],
							count: pcs_count,
							name: module.getName(data.names, data.gender),
							text: data.text,
						}
						module.insertTpl(tpl_data);
						
					}
					return module;
				})();
 
				wbn.Start();
 

				
				var lang=$('html').attr('lang');
				current_lang=App.mounth_names[lang];
				$(doc).on('keyup keypress',"input[name=name]", function(e){
					if (e.keyCode == 8 || e.keyCode == 46) {
						console.log('not matched')
					} else{
						var letters='+-()1234567890{}?^%$#@!_[]|~';
						return (letters.indexOf(String.fromCharCode(e.which))==-1);
					}
				})
				$(doc).on('keyup keypress',"input[name=phone]", function(e){
					if (e.keyCode == 8 || e.keyCode == 46) {
						console.log('not matched')
					} else{
						var letters='+-()1234567890';
						return (letters.indexOf(String.fromCharCode(e.which))!=-1);
					}
				})

				var monthNames=App.mounth_names;

				$('[data-date]').each(function(index, el) {
					var t=$(this),
					day_add=t.data('day'),
					today = new Date(),
					newdate = new Date();
					newdate.setDate(today.getDate()+day_add);
					day=newdate.getDate();
					month=newdate.getMonth();
					year=newdate.getMonth();
					if(typeof current_lang != 'undefined'){
						t.html(newdate.getDate()+' '+current_lang[newdate.getMonth()]+' '+newdate.getFullYear());
					}
				});
				$(win).on('load', function(){
					$timer_container=$('.fixed_upsell .timer strong');
					if($timer_container.length){
						var austDay = new Date();
						austDay.setHours(0);
						austDay.setMinutes(0);
						austDay.setSeconds(1);
						austDay.setDate(austDay.getDate() + 1);

						$timer_container.each(function(index, el) {
							$(this).countdown({
								until: austDay,
								layout: '{hnn}:{mnn}:{snn}',
								compact: true
							});
						});
					}
				})

				$timer=$('[data-timer]');

				if($timer.length){
					var austDay = new Date();
					austDay.setHours(0);
					austDay.setMinutes(0);
					austDay.setSeconds(1);
					austDay.setDate(austDay.getDate() + 1);

					$timer.each(function(index, el) {
						var $new_html='';
						$(this).find('.unit').each(function(index, el) {
							var $t = $(this),
								$t_html=$t.html();
							$new_html+='<div class="'+$t.attr('class')+'">'+$t_html.replace('00', $t.data('pattern'))+'</div>'
						});
						$(this).countdown({
							until: austDay,
							layout: $new_html,
							compact: true
						});
					});
				}

				$.validator.addMethod("regex", function(value, element, regexpr) {
					return regexpr.test(value); 
				}, "");
				
				function send_data_ajax($ajax_form, $remove_message){
					if($ajax_form.length){
						$ajax_form.append('<input type="hidden" name="spam_checker">');
						$ajax_form.find('input[name=name], input[name=phone]').on('keyup keypress click', function(){
							$ajax_form.find('input[name=spam_checker]').val('is_real_user');
						});
						add_paremtr='';
						disable_popup=App.getURLParameter(window.location.href, 'bp') || 1;
						if (disable_popup==0) add_paremtr='&bp=0'
						if($remove_message!=true){
							error_name=$ajax_form.data('errorname');
							error_phone=$ajax_form.data('errorphone');
							errorphonenum_first=$ajax_form.data('errorphonenum_first');
							errorphonenum_last=$ajax_form.data('errorphonenum_last');
							errorphonenum=errorphonenum_first+'7'+errorphonenum_last;
						} else {
							error_name='';
							error_phone='';
							errorphonenum=''
						}
						var settings_validate={
						  rules: {
						    name:{
						      required: true
						    },
						    phone:{
						      required: true,
						      minlength: 7,
						      regex: /^[0-9+-/(/) ]*$/
						    }
						  },
						  messages: {
						    name:{
						      required: error_name
						    },
						    phone:{
						      required: error_phone,
						      minlength: errorphonenum,
						      regex: error_phone
						    }
						  },
						  submitHandler: function (form) {
						    if (!App.body.hasClass('disable_ajax')) {
						      App.body.addClass('disable_ajax');
						      if($.cookie('_ga')){
						        client_id=$.cookie('_ga');
						      } else {
						        client_id=false;
						      }
						      $.ajax({
						        url: 'cart.php',
						        type: 'POST',
						        data: $(form).serialize()+'&action=cod_form&client_id='+client_id,
						        success: function(html){
						          console.log(html)
						          App.body.removeClass('disable_ajax');
						          html = html.replace(/\s/g, "");
						          $.cookie('user_id', html);
						          current_url=window.location.href; 
						          window.location.href='//' + window.location.hostname + window.location.pathname+'?page=thanks'+add_paremtr+'&name='+$(form).find('input[name=name]').val();
						        }
						      });
						    }
						    return false;
						  }
						}
						if(App.body.hasClass('page_cod2') && $remove_message==true){
						  settings_validate.showErrors= function(errorMap, errorList) {
						   console.log(errorMap)
						   console.log(errorList)
						   $ajax_form.find('.field').removeClass('error')
						   errorList.map(function(index, elem) {
						    console.log(index)
						      $(index.element).parents('.field').addClass('error');
						      return true;
						   })
						  }
						}
						$ajax_form.validate(settings_validate)
					}
				}
				if(App.body.hasClass('page_cod2')){
					send_data_ajax($('form#ajax_form_cod'), true)
					send_data_ajax($('form#ajax_form_cod_2'), true)
					send_data_ajax($('form#ajax_form_cod_popup'), false)
				} else {
					send_data_ajax($('form#ajax_form_cod'), false)
					send_data_ajax($('form#ajax_form_cod_2'), false)
					send_data_ajax($('form#ajax_form_cod_popup'), false)
				}
				
				
			}
		},
		initApp: function() {
			//App.initMobile();
			App.initCOD();
			App.initPage();
			App.initUpsell();
			App.initTime();
			App.initPopup();
			App.initPopupClose();
			App.initWarning();
		}
	});
	$(document).ready(function(){
		App.initApp();
		
		body = $('body');
		$(win).on('scroll', function() {
			
			if (FormIsInVision('#form', true) || FormIsInVision('#form2', false)) {
					body.addClass('screen_on_form')
			} else {
					body.removeClass('screen_on_form')
			}
		}).scroll();

		function FormIsInVision(container, $revers) {
			$item=$(container);
			if ($item.length > 0) {
				if($revers){
					var windowBottom = $(window).scrollTop() + $(window).height();
					var itemTop = $item.offset().top + 200;
					var itemBottom = $item.offset().top + $item.height() + 200;
					return (windowBottom >= itemTop);
				} else {
					var windowBottom = $(window).scrollTop();
					var itemBottom = $item.offset().top + $item.height() - 300;
					var itemTop = $item.offset().top - 300;
					return (windowBottom <= itemBottom) && (windowBottom >= itemTop)
				};
			};
		};

		// smooth scroll to form after clicking on cod button, if second form is exist
		$("body.page_cod, body.page_cod2").on("click","a.scroll_to_button", function (event) {
			event.preventDefault();
			var id  = $(this).attr('href'),
				top = $(id).offset().top;		
			if (!$('#form2').length) {
				$('body,html').animate({scrollTop: top}, 1);
			} else {
				$('body,html').animate({scrollTop: top}, 1000);
			}
		});
	});

})(jQuery,document,window);

//App._q.push(function(){
// App.init();
//});
