/*! For license information please see 4885.b8eda02b.js.LICENSE.txt */
(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[4885],{8420:(t,e,r)=>{"use strict";r.d(e,{v:()=>o});var n=r(1916);function o(t){return void 0===t&&(t={}),function(e,r){n.s.addExposeMetadata({target:e instanceof Function?e:e.constructor,propertyName:r,options:t})}}},5136:(t,e,r)=>{"use strict";r.d(e,{Z:()=>o});var n=r(1916);function o(t,e){return void 0===e&&(e={}),function(r,o){var i=Reflect.getMetadata("design:type",r,o);n.s.addTypeMetadata({target:r.constructor,propertyName:o,reflectedType:i,typeFunction:t,options:e})}}},2110:(t,e,r)=>{"use strict";var n;r.d(e,{_:()=>n}),function(t){t[t.PLAIN_TO_CLASS=0]="PLAIN_TO_CLASS",t[t.CLASS_TO_PLAIN=1]="CLASS_TO_PLAIN",t[t.CLASS_TO_CLASS=2]="CLASS_TO_CLASS"}(n||(n={}))},5698:(t,e,r)=>{"use strict";r.d(e,{bj:()=>f});var n=r(1916),o=r(2110);var i=function(t,e,r){if(r||2===arguments.length)for(var n,o=0,i=e.length;o<i;o++)!n&&o in e||(n||(n=Array.prototype.slice.call(e,0,o)),n[o]=e[o]);return t.concat(n||Array.prototype.slice.call(e))};var a=function(){function t(t,e){this.transformationType=t,this.options=e,this.recursionStack=new Set}return t.prototype.transform=function(t,e,i,a,s,u){var c,f=this;if(void 0===u&&(u=0),Array.isArray(e)||e instanceof Set){var p=a&&this.transformationType===o._.PLAIN_TO_CLASS?function(t){var e=new t;return e instanceof Set||"push"in e?e:[]}(a):[];return e.forEach((function(e,r){var n=t?t[r]:void 0;if(f.options.enableCircularCheck&&f.isCircular(e))f.transformationType===o._.CLASS_TO_CLASS&&(p instanceof Set?p.add(e):p.push(e));else{var a=void 0;if("function"!=typeof i&&i&&i.options&&i.options.discriminator&&i.options.discriminator.property&&i.options.discriminator.subTypes){if(f.transformationType===o._.PLAIN_TO_CLASS){a=i.options.discriminator.subTypes.find((function(t){return t.name===e[i.options.discriminator.property]}));var s={newObject:p,object:e,property:void 0},c=i.typeFunction(s);a=void 0===a?c:a.value,i.options.keepDiscriminatorProperty||delete e[i.options.discriminator.property]}f.transformationType===o._.CLASS_TO_CLASS&&(a=e.constructor),f.transformationType===o._.CLASS_TO_PLAIN&&(e[i.options.discriminator.property]=i.options.discriminator.subTypes.find((function(t){return t.value===e.constructor})).name)}else a=i;var l=f.transform(n,e,a,void 0,e instanceof Map,u+1);p instanceof Set?p.add(l):p.push(l)}})),p}if(i!==String||s){if(i!==Number||s){if(i!==Boolean||s){if((i===Date||e instanceof Date)&&!s)return e instanceof Date?new Date(e.valueOf()):null==e?e:new Date(e);if(("undefined"!=typeof globalThis?globalThis:void 0!==r.g?r.g:"undefined"!=typeof window?window:"undefined"!=typeof self?self:void 0).Buffer&&(i===Buffer||e instanceof Buffer)&&!s)return null==e?e:Buffer.from(e);if(null===(c=e)||"object"!=typeof c||"function"!=typeof c.then||s){if(s||null===e||"object"!=typeof e||"function"!=typeof e.then){if("object"==typeof e&&null!==e){i||e.constructor===Object||(Array.isArray(e)||e.constructor!==Array)&&(i=e.constructor),!i&&t&&(i=t.constructor),this.options.enableCircularCheck&&this.recursionStack.add(e);var l=this.getKeys(i,e,s),d=t||{};t||this.transformationType!==o._.PLAIN_TO_CLASS&&this.transformationType!==o._.CLASS_TO_CLASS||(d=s?new Map:i?new i:{});for(var y=function(r){if("__proto__"===r||"constructor"===r)return"continue";var a=r,c=r,f=r;if(!h.options.ignoreDecorators&&i)if(h.transformationType===o._.PLAIN_TO_CLASS)(p=n.s.findExposeMetadataByCustomName(i,r))&&(f=p.propertyName,c=p.propertyName);else if(h.transformationType===o._.CLASS_TO_PLAIN||h.transformationType===o._.CLASS_TO_CLASS){var p;(p=n.s.findExposeMetadata(i,r))&&p.options&&p.options.name&&(c=p.options.name)}var l=void 0;l=h.transformationType===o._.PLAIN_TO_CLASS?e[a]:e instanceof Map?e.get(a):e[a]instanceof Function?e[a]():e[a];var y=void 0,v=l instanceof Map;if(i&&s)y=i;else if(i){var m=n.s.findTypeMetadata(i,f);if(m){var _={newObject:d,object:e,property:f},g=m.typeFunction?m.typeFunction(_):m.reflectedType;m.options&&m.options.discriminator&&m.options.discriminator.property&&m.options.discriminator.subTypes?e[a]instanceof Array?y=m:(h.transformationType===o._.PLAIN_TO_CLASS&&(y=void 0===(y=m.options.discriminator.subTypes.find((function(t){if(l&&l instanceof Object&&m.options.discriminator.property in l)return t.name===l[m.options.discriminator.property]})))?g:y.value,m.options.keepDiscriminatorProperty||l&&l instanceof Object&&m.options.discriminator.property in l&&delete l[m.options.discriminator.property]),h.transformationType===o._.CLASS_TO_CLASS&&(y=l.constructor),h.transformationType===o._.CLASS_TO_PLAIN&&l&&(l[m.options.discriminator.property]=m.options.discriminator.subTypes.find((function(t){return t.value===l.constructor})).name)):y=g,v=v||m.reflectedType===Map}else if(h.options.targetMaps)h.options.targetMaps.filter((function(t){return t.target===i&&!!t.properties[f]})).forEach((function(t){return y=t.properties[f]}));else if(h.options.enableImplicitConversion&&h.transformationType===o._.PLAIN_TO_CLASS){var w=Reflect.getMetadata("design:type",i.prototype,f);w&&(y=w)}}var S=Array.isArray(e[a])?h.getReflectedType(i,f):void 0,T=t?t[a]:void 0;if(d.constructor.prototype){var O=Object.getOwnPropertyDescriptor(d.constructor.prototype,c);if((h.transformationType===o._.PLAIN_TO_CLASS||h.transformationType===o._.CLASS_TO_CLASS)&&(O&&!O.set||d[c]instanceof Function))return"continue"}if(h.options.enableCircularCheck&&h.isCircular(l)){if(h.transformationType===o._.CLASS_TO_CLASS){b=l;(void 0!==(b=h.applyCustomTransformations(b,i,r,e,h.transformationType))||h.options.exposeUnsetFields)&&(d instanceof Map?d.set(c,b):d[c]=b)}}else{var A=h.transformationType===o._.PLAIN_TO_CLASS?c:r,b=void 0;h.transformationType===o._.CLASS_TO_PLAIN?(b=e[A],b=h.applyCustomTransformations(b,i,A,e,h.transformationType),b=e[A]===b?l:b,b=h.transform(T,b,y,S,v,u+1)):void 0===l&&h.options.exposeDefaultValues?b=d[c]:(b=h.transform(T,l,y,S,v,u+1),b=h.applyCustomTransformations(b,i,A,e,h.transformationType)),(void 0!==b||h.options.exposeUnsetFields)&&(d instanceof Map?d.set(c,b):d[c]=b)}},h=this,v=0,m=l;v<m.length;v++){y(m[v])}return this.options.enableCircularCheck&&this.recursionStack.delete(e),d}return e}return e}return new Promise((function(t,r){e.then((function(e){return t(f.transform(void 0,e,i,void 0,void 0,u+1))}),r)}))}return null==e?e:Boolean(e)}return null==e?e:Number(e)}return null==e?e:String(e)},t.prototype.applyCustomTransformations=function(t,e,r,o,i){var a=this,s=n.s.findTransformMetadatas(e,r,this.transformationType);return void 0!==this.options.version&&(s=s.filter((function(t){return!t.options||a.checkVersion(t.options.since,t.options.until)}))),(s=this.options.groups&&this.options.groups.length?s.filter((function(t){return!t.options||a.checkGroups(t.options.groups)})):s.filter((function(t){return!t.options||!t.options.groups||!t.options.groups.length}))).forEach((function(e){t=e.transformFn({value:t,key:r,obj:o,type:i,options:a.options})})),t},t.prototype.isCircular=function(t){return this.recursionStack.has(t)},t.prototype.getReflectedType=function(t,e){if(t){var r=n.s.findTypeMetadata(t,e);return r?r.reflectedType:void 0}},t.prototype.getKeys=function(t,e,r){var a=this,s=n.s.getStrategy(t);"none"===s&&(s=this.options.strategy||"exposeAll");var u=[];if(("exposeAll"===s||r)&&(u=e instanceof Map?Array.from(e.keys()):Object.keys(e)),r)return u;if(this.options.ignoreDecorators&&this.options.excludeExtraneousValues&&t){var c=n.s.getExposedProperties(t,this.transformationType),f=n.s.getExcludedProperties(t,this.transformationType);u=i(i([],c,!0),f,!0)}if(!this.options.ignoreDecorators&&t){c=n.s.getExposedProperties(t,this.transformationType);this.transformationType===o._.PLAIN_TO_CLASS&&(c=c.map((function(e){var r=n.s.findExposeMetadata(t,e);return r&&r.options&&r.options.name?r.options.name:e}))),u=this.options.excludeExtraneousValues?c:u.concat(c);var p=n.s.getExcludedProperties(t,this.transformationType);p.length>0&&(u=u.filter((function(t){return!p.includes(t)}))),void 0!==this.options.version&&(u=u.filter((function(e){var r=n.s.findExposeMetadata(t,e);return!r||!r.options||a.checkVersion(r.options.since,r.options.until)}))),u=this.options.groups&&this.options.groups.length?u.filter((function(e){var r=n.s.findExposeMetadata(t,e);return!r||!r.options||a.checkGroups(r.options.groups)})):u.filter((function(e){var r=n.s.findExposeMetadata(t,e);return!(r&&r.options&&r.options.groups&&r.options.groups.length)}))}return this.options.excludePrefixes&&this.options.excludePrefixes.length&&(u=u.filter((function(t){return a.options.excludePrefixes.every((function(e){return t.substr(0,e.length)!==e}))}))),u=u.filter((function(t,e,r){return r.indexOf(t)===e}))},t.prototype.checkVersion=function(t,e){var r=!0;return r&&t&&(r=this.options.version>=t),r&&e&&(r=this.options.version<e),r},t.prototype.checkGroups=function(t){return!t||this.options.groups.some((function(e){return t.includes(e)}))},t}(),s={enableCircularCheck:!1,enableImplicitConversion:!1,excludeExtraneousValues:!1,excludePrefixes:void 0,exposeDefaultValues:!1,exposeUnsetFields:!0,groups:void 0,ignoreDecorators:!1,strategy:void 0,targetMaps:void 0,version:void 0},u=function(){return u=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},u.apply(this,arguments)},c=new(function(){function t(){}return t.prototype.instanceToPlain=function(t,e){return new a(o._.CLASS_TO_PLAIN,u(u({},s),e)).transform(void 0,t,void 0,void 0,void 0,void 0)},t.prototype.classToPlainFromExist=function(t,e,r){return new a(o._.CLASS_TO_PLAIN,u(u({},s),r)).transform(e,t,void 0,void 0,void 0,void 0)},t.prototype.plainToInstance=function(t,e,r){return new a(o._.PLAIN_TO_CLASS,u(u({},s),r)).transform(void 0,e,t,void 0,void 0,void 0)},t.prototype.plainToClassFromExist=function(t,e,r){return new a(o._.PLAIN_TO_CLASS,u(u({},s),r)).transform(t,e,void 0,void 0,void 0,void 0)},t.prototype.instanceToInstance=function(t,e){return new a(o._.CLASS_TO_CLASS,u(u({},s),e)).transform(void 0,t,void 0,void 0,void 0,void 0)},t.prototype.classToClassFromExist=function(t,e,r){return new a(o._.CLASS_TO_CLASS,u(u({},s),r)).transform(e,t,void 0,void 0,void 0,void 0)},t.prototype.serialize=function(t,e){return JSON.stringify(this.instanceToPlain(t,e))},t.prototype.deserialize=function(t,e,r){var n=JSON.parse(e);return this.plainToInstance(t,n,r)},t.prototype.deserializeArray=function(t,e,r){var n=JSON.parse(e);return this.plainToInstance(t,n,r)},t}());function f(t,e,r){return c.plainToInstance(t,e,r)}},1916:(t,e,r)=>{"use strict";r.d(e,{s:()=>o});var n=r(2110),o=new(function(){function t(){this._typeMetadatas=new Map,this._transformMetadatas=new Map,this._exposeMetadatas=new Map,this._excludeMetadatas=new Map,this._ancestorsMap=new Map}return t.prototype.addTypeMetadata=function(t){this._typeMetadatas.has(t.target)||this._typeMetadatas.set(t.target,new Map),this._typeMetadatas.get(t.target).set(t.propertyName,t)},t.prototype.addTransformMetadata=function(t){this._transformMetadatas.has(t.target)||this._transformMetadatas.set(t.target,new Map),this._transformMetadatas.get(t.target).has(t.propertyName)||this._transformMetadatas.get(t.target).set(t.propertyName,[]),this._transformMetadatas.get(t.target).get(t.propertyName).push(t)},t.prototype.addExposeMetadata=function(t){this._exposeMetadatas.has(t.target)||this._exposeMetadatas.set(t.target,new Map),this._exposeMetadatas.get(t.target).set(t.propertyName,t)},t.prototype.addExcludeMetadata=function(t){this._excludeMetadatas.has(t.target)||this._excludeMetadatas.set(t.target,new Map),this._excludeMetadatas.get(t.target).set(t.propertyName,t)},t.prototype.findTransformMetadatas=function(t,e,r){return this.findMetadatas(this._transformMetadatas,t,e).filter((function(t){return!t.options||(!0===t.options.toClassOnly&&!0===t.options.toPlainOnly||(!0===t.options.toClassOnly?r===n._.CLASS_TO_CLASS||r===n._.PLAIN_TO_CLASS:!0!==t.options.toPlainOnly||r===n._.CLASS_TO_PLAIN))}))},t.prototype.findExcludeMetadata=function(t,e){return this.findMetadata(this._excludeMetadatas,t,e)},t.prototype.findExposeMetadata=function(t,e){return this.findMetadata(this._exposeMetadatas,t,e)},t.prototype.findExposeMetadataByCustomName=function(t,e){return this.getExposedMetadatas(t).find((function(t){return t.options&&t.options.name===e}))},t.prototype.findTypeMetadata=function(t,e){return this.findMetadata(this._typeMetadatas,t,e)},t.prototype.getStrategy=function(t){var e=this._excludeMetadatas.get(t),r=e&&e.get(void 0),n=this._exposeMetadatas.get(t),o=n&&n.get(void 0);return r&&o||!r&&!o?"none":r?"excludeAll":"exposeAll"},t.prototype.getExposedMetadatas=function(t){return this.getMetadata(this._exposeMetadatas,t)},t.prototype.getExcludedMetadatas=function(t){return this.getMetadata(this._excludeMetadatas,t)},t.prototype.getExposedProperties=function(t,e){return this.getExposedMetadatas(t).filter((function(t){return!t.options||(!0===t.options.toClassOnly&&!0===t.options.toPlainOnly||(!0===t.options.toClassOnly?e===n._.CLASS_TO_CLASS||e===n._.PLAIN_TO_CLASS:!0!==t.options.toPlainOnly||e===n._.CLASS_TO_PLAIN))})).map((function(t){return t.propertyName}))},t.prototype.getExcludedProperties=function(t,e){return this.getExcludedMetadatas(t).filter((function(t){return!t.options||(!0===t.options.toClassOnly&&!0===t.options.toPlainOnly||(!0===t.options.toClassOnly?e===n._.CLASS_TO_CLASS||e===n._.PLAIN_TO_CLASS:!0!==t.options.toPlainOnly||e===n._.CLASS_TO_PLAIN))})).map((function(t){return t.propertyName}))},t.prototype.clear=function(){this._typeMetadatas.clear(),this._exposeMetadatas.clear(),this._excludeMetadatas.clear(),this._ancestorsMap.clear()},t.prototype.getMetadata=function(t,e){var r,n=t.get(e);n&&(r=Array.from(n.values()).filter((function(t){return void 0!==t.propertyName})));for(var o=[],i=0,a=this.getAncestors(e);i<a.length;i++){var s=a[i],u=t.get(s);if(u){var c=Array.from(u.values()).filter((function(t){return void 0!==t.propertyName}));o.push.apply(o,c)}}return o.concat(r||[])},t.prototype.findMetadata=function(t,e,r){var n=t.get(e);if(n){var o=n.get(r);if(o)return o}for(var i=0,a=this.getAncestors(e);i<a.length;i++){var s=a[i],u=t.get(s);if(u){var c=u.get(r);if(c)return c}}},t.prototype.findMetadatas=function(t,e,r){var n,o=t.get(e);o&&(n=o.get(r));for(var i=[],a=0,s=this.getAncestors(e);a<s.length;a++){var u=s[a],c=t.get(u);c&&c.has(r)&&i.push.apply(i,c.get(r))}return i.slice().reverse().concat((n||[]).slice().reverse())},t.prototype.getAncestors=function(t){if(!t)return[];if(!this._ancestorsMap.has(t)){for(var e=[],r=Object.getPrototypeOf(t.prototype.constructor);void 0!==r.prototype;r=Object.getPrototypeOf(r.prototype.constructor))e.push(r);this._ancestorsMap.set(t,e)}return this._ancestorsMap.get(t)},t}())},5508:(t,e,r)=>{var n;!function(t){!function(e){var n="object"==typeof globalThis?globalThis:"object"==typeof r.g?r.g:"object"==typeof self?self:"object"==typeof this?this:function(){try{return Function("return this;")()}catch(t){}}()||function(){try{return(0,eval)("(function() { return this; })()")}catch(t){}}(),o=i(t);function i(t,e){return function(r,n){Object.defineProperty(t,r,{configurable:!0,writable:!0,value:n}),e&&e(r,n)}}void 0!==n.Reflect&&(o=i(n.Reflect,o)),function(t,e){var r=Object.prototype.hasOwnProperty,n="function"==typeof Symbol,o=n&&void 0!==Symbol.toPrimitive?Symbol.toPrimitive:"@@toPrimitive",i=n&&void 0!==Symbol.iterator?Symbol.iterator:"@@iterator",a="function"==typeof Object.create,s={__proto__:[]}instanceof Array,u=!a&&!s,c={create:a?function(){return pt(Object.create(null))}:s?function(){return pt({__proto__:null})}:function(){return pt({})},has:u?function(t,e){return r.call(t,e)}:function(t,e){return e in t},get:u?function(t,e){return r.call(t,e)?t[e]:void 0}:function(t,e){return t[e]}},f=Object.getPrototypeOf(Function),p="function"==typeof Map&&"function"==typeof Map.prototype.entries?Map:ut(),l="function"==typeof Set&&"function"==typeof Set.prototype.entries?Set:ct(),d="function"==typeof WeakMap?WeakMap:ft(),y=n?Symbol.for("@reflect-metadata:registry"):void 0,h=ot(),v=it(h);function m(t,e,r,n){if(F(r)){if(!H(t))throw new TypeError;if(!Z(e))throw new TypeError;return k(t,e)}if(!H(t))throw new TypeError;if(!K(e))throw new TypeError;if(!K(n)&&!F(n)&&!R(n))throw new TypeError;return R(n)&&(n=void 0),C(t,e,r=W(r),n)}function _(t,e){function r(r,n){if(!K(r))throw new TypeError;if(!F(n)&&!$(n))throw new TypeError;j(t,e,r,n)}return r}function g(t,e,r,n){if(!K(r))throw new TypeError;return F(n)||(n=W(n)),j(t,e,r,n)}function w(t,e,r){if(!K(e))throw new TypeError;return F(r)||(r=W(r)),E(t,e,r)}function S(t,e,r){if(!K(e))throw new TypeError;return F(r)||(r=W(r)),x(t,e,r)}function T(t,e,r){if(!K(e))throw new TypeError;return F(r)||(r=W(r)),P(t,e,r)}function O(t,e,r){if(!K(e))throw new TypeError;return F(r)||(r=W(r)),L(t,e,r)}function A(t,e){if(!K(t))throw new TypeError;return F(e)||(e=W(e)),I(t,e)}function b(t,e){if(!K(t))throw new TypeError;return F(e)||(e=W(e)),N(t,e)}function M(t,e,r){if(!K(e))throw new TypeError;if(F(r)||(r=W(r)),!K(e))throw new TypeError;F(r)||(r=W(r));var n=st(e,r,!1);return!F(n)&&n.OrdinaryDeleteMetadata(t,e,r)}function k(t,e){for(var r=t.length-1;r>=0;--r){var n=(0,t[r])(e);if(!F(n)&&!R(n)){if(!Z(n))throw new TypeError;e=n}}return e}function C(t,e,r,n){for(var o=t.length-1;o>=0;--o){var i=(0,t[o])(e,r,n);if(!F(i)&&!R(i)){if(!K(i))throw new TypeError;n=i}}return n}function E(t,e,r){if(x(t,e,r))return!0;var n=rt(e);return!R(n)&&E(t,n,r)}function x(t,e,r){var n=st(e,r,!1);return!F(n)&&G(n.OrdinaryHasOwnMetadata(t,e,r))}function P(t,e,r){if(x(t,e,r))return L(t,e,r);var n=rt(e);return R(n)?void 0:P(t,n,r)}function L(t,e,r){var n=st(e,r,!1);if(!F(n))return n.OrdinaryGetOwnMetadata(t,e,r)}function j(t,e,r,n){st(r,n,!0).OrdinaryDefineOwnMetadata(t,e,r,n)}function I(t,e){var r=N(t,e),n=rt(t);if(null===n)return r;var o=I(n,e);if(o.length<=0)return r;if(r.length<=0)return o;for(var i=new l,a=[],s=0,u=r;s<u.length;s++){var c=u[s];i.has(c)||(i.add(c),a.push(c))}for(var f=0,p=o;f<p.length;f++){c=p[f];i.has(c)||(i.add(c),a.push(c))}return a}function N(t,e){var r=st(t,e,!1);return r?r.OrdinaryOwnMetadataKeys(t,e):[]}function D(t){if(null===t)return 1;switch(typeof t){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return null===t?1:6;default:return 6}}function F(t){return void 0===t}function R(t){return null===t}function z(t){return"symbol"==typeof t}function K(t){return"object"==typeof t?null!==t:"function"==typeof t}function V(t,e){switch(D(t)){case 0:case 1:case 2:case 3:case 4:case 5:return t}var r=3===e?"string":5===e?"number":"default",n=Q(t,o);if(void 0!==n){var i=n.call(t,r);if(K(i))throw new TypeError;return i}return B(t,"default"===r?"number":r)}function B(t,e){if("string"===e){var r=t.toString;if(J(r))if(!K(o=r.call(t)))return o;if(J(n=t.valueOf))if(!K(o=n.call(t)))return o}else{var n;if(J(n=t.valueOf))if(!K(o=n.call(t)))return o;var o,i=t.toString;if(J(i))if(!K(o=i.call(t)))return o}throw new TypeError}function G(t){return!!t}function U(t){return""+t}function W(t){var e=V(t,3);return z(e)?e:U(e)}function H(t){return Array.isArray?Array.isArray(t):t instanceof Object?t instanceof Array:"[object Array]"===Object.prototype.toString.call(t)}function J(t){return"function"==typeof t}function Z(t){return"function"==typeof t}function $(t){switch(D(t)){case 3:case 4:return!0;default:return!1}}function q(t,e){return t===e||t!=t&&e!=e}function Q(t,e){var r=t[e];if(null!=r){if(!J(r))throw new TypeError;return r}}function X(t){var e=Q(t,i);if(!J(e))throw new TypeError;var r=e.call(t);if(!K(r))throw new TypeError;return r}function Y(t){return t.value}function tt(t){var e=t.next();return!e.done&&e}function et(t){var e=t.return;e&&e.call(t)}function rt(t){var e=Object.getPrototypeOf(t);if("function"!=typeof t||t===f)return e;if(e!==f)return e;var r=t.prototype,n=r&&Object.getPrototypeOf(r);if(null==n||n===Object.prototype)return e;var o=n.constructor;return"function"!=typeof o||o===t?e:o}function nt(){var t,r,n,o;F(y)||void 0===e.Reflect||y in e.Reflect||"function"!=typeof e.Reflect.defineMetadata||(t=at(e.Reflect));var i=new d,a={registerProvider:s,getProvider:c,setProvider:h};return a;function s(e){if(!Object.isExtensible(a))throw new Error("Cannot add provider to a frozen registry.");switch(!0){case t===e:break;case F(r):r=e;break;case r===e:break;case F(n):n=e;break;case n===e:break;default:void 0===o&&(o=new l),o.add(e)}}function u(e,i){if(!F(r)){if(r.isProviderFor(e,i))return r;if(!F(n)){if(n.isProviderFor(e,i))return r;if(!F(o))for(var a=X(o);;){var s=tt(a);if(!s)return;var u=Y(s);if(u.isProviderFor(e,i))return et(a),u}}}if(!F(t)&&t.isProviderFor(e,i))return t}function c(t,e){var r,n=i.get(t);return F(n)||(r=n.get(e)),F(r)?(F(r=u(t,e))||(F(n)&&(n=new p,i.set(t,n)),n.set(e,r)),r):r}function f(t){if(F(t))throw new TypeError;return r===t||n===t||!F(o)&&o.has(t)}function h(t,e,r){if(!f(r))throw new Error("Metadata provider not registered.");var n=c(t,e);if(n!==r){if(!F(n))return!1;var o=i.get(t);F(o)&&(o=new p,i.set(t,o)),o.set(e,r)}return!0}}function ot(){var t;return!F(y)&&K(e.Reflect)&&Object.isExtensible(e.Reflect)&&(t=e.Reflect[y]),F(t)&&(t=nt()),!F(y)&&K(e.Reflect)&&Object.isExtensible(e.Reflect)&&Object.defineProperty(e.Reflect,y,{enumerable:!1,configurable:!1,writable:!1,value:t}),t}function it(t){var e=new d,r={isProviderFor:function(t,r){var n=e.get(t);return!F(n)&&n.has(r)},OrdinaryDefineOwnMetadata:a,OrdinaryHasOwnMetadata:o,OrdinaryGetOwnMetadata:i,OrdinaryOwnMetadataKeys:s,OrdinaryDeleteMetadata:u};return h.registerProvider(r),r;function n(n,o,i){var a=e.get(n),s=!1;if(F(a)){if(!i)return;a=new p,e.set(n,a),s=!0}var u=a.get(o);if(F(u)){if(!i)return;if(u=new p,a.set(o,u),!t.setProvider(n,o,r))throw a.delete(o),s&&e.delete(n),new Error("Wrong provider for target.")}return u}function o(t,e,r){var o=n(e,r,!1);return!F(o)&&G(o.has(t))}function i(t,e,r){var o=n(e,r,!1);if(!F(o))return o.get(t)}function a(t,e,r,o){n(r,o,!0).set(t,e)}function s(t,e){var r=[],o=n(t,e,!1);if(F(o))return r;for(var i=X(o.keys()),a=0;;){var s=tt(i);if(!s)return r.length=a,r;var u=Y(s);try{r[a]=u}catch(c){try{et(i)}finally{throw c}}a++}}function u(t,r,o){var i=n(r,o,!1);if(F(i))return!1;if(!i.delete(t))return!1;if(0===i.size){var a=e.get(r);F(a)||(a.delete(o),0===a.size&&e.delete(a))}return!0}}function at(t){var e=t.defineMetadata,r=t.hasOwnMetadata,n=t.getOwnMetadata,o=t.getOwnMetadataKeys,i=t.deleteMetadata,a=new d;return{isProviderFor:function(t,e){var r=a.get(t);return!(F(r)||!r.has(e))||!!o(t,e).length&&(F(r)&&(r=new l,a.set(t,r)),r.add(e),!0)},OrdinaryDefineOwnMetadata:e,OrdinaryHasOwnMetadata:r,OrdinaryGetOwnMetadata:n,OrdinaryOwnMetadataKeys:o,OrdinaryDeleteMetadata:i}}function st(t,e,r){var n=h.getProvider(t,e);if(!F(n))return n;if(r){if(h.setProvider(t,e,v))return v;throw new Error("Illegal state.")}}function ut(){var t={},e=[],r=function(){function t(t,e,r){this._index=0,this._keys=t,this._values=e,this._selector=r}return t.prototype["@@iterator"]=function(){return this},t.prototype[i]=function(){return this},t.prototype.next=function(){var t=this._index;if(t>=0&&t<this._keys.length){var r=this._selector(this._keys[t],this._values[t]);return t+1>=this._keys.length?(this._index=-1,this._keys=e,this._values=e):this._index++,{value:r,done:!1}}return{value:void 0,done:!0}},t.prototype.throw=function(t){throw this._index>=0&&(this._index=-1,this._keys=e,this._values=e),t},t.prototype.return=function(t){return this._index>=0&&(this._index=-1,this._keys=e,this._values=e),{value:t,done:!0}},t}();return function(){function e(){this._keys=[],this._values=[],this._cacheKey=t,this._cacheIndex=-2}return Object.defineProperty(e.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),e.prototype.has=function(t){return this._find(t,!1)>=0},e.prototype.get=function(t){var e=this._find(t,!1);return e>=0?this._values[e]:void 0},e.prototype.set=function(t,e){var r=this._find(t,!0);return this._values[r]=e,this},e.prototype.delete=function(e){var r=this._find(e,!1);if(r>=0){for(var n=this._keys.length,o=r+1;o<n;o++)this._keys[o-1]=this._keys[o],this._values[o-1]=this._values[o];return this._keys.length--,this._values.length--,q(e,this._cacheKey)&&(this._cacheKey=t,this._cacheIndex=-2),!0}return!1},e.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=t,this._cacheIndex=-2},e.prototype.keys=function(){return new r(this._keys,this._values,n)},e.prototype.values=function(){return new r(this._keys,this._values,o)},e.prototype.entries=function(){return new r(this._keys,this._values,a)},e.prototype["@@iterator"]=function(){return this.entries()},e.prototype[i]=function(){return this.entries()},e.prototype._find=function(t,e){if(!q(this._cacheKey,t)){this._cacheIndex=-1;for(var r=0;r<this._keys.length;r++)if(q(this._keys[r],t)){this._cacheIndex=r;break}}return this._cacheIndex<0&&e&&(this._cacheIndex=this._keys.length,this._keys.push(t),this._values.push(void 0)),this._cacheIndex},e}();function n(t,e){return t}function o(t,e){return e}function a(t,e){return[t,e]}}function ct(){return function(){function t(){this._map=new p}return Object.defineProperty(t.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),t.prototype.has=function(t){return this._map.has(t)},t.prototype.add=function(t){return this._map.set(t,t),this},t.prototype.delete=function(t){return this._map.delete(t)},t.prototype.clear=function(){this._map.clear()},t.prototype.keys=function(){return this._map.keys()},t.prototype.values=function(){return this._map.keys()},t.prototype.entries=function(){return this._map.entries()},t.prototype["@@iterator"]=function(){return this.keys()},t.prototype[i]=function(){return this.keys()},t}()}function ft(){var t=16,e=c.create(),n=o();return function(){function t(){this._key=o()}return t.prototype.has=function(t){var e=i(t,!1);return void 0!==e&&c.has(e,this._key)},t.prototype.get=function(t){var e=i(t,!1);return void 0!==e?c.get(e,this._key):void 0},t.prototype.set=function(t,e){return i(t,!0)[this._key]=e,this},t.prototype.delete=function(t){var e=i(t,!1);return void 0!==e&&delete e[this._key]},t.prototype.clear=function(){this._key=o()},t}();function o(){var t;do{t="@@WeakMap@@"+u()}while(c.has(e,t));return e[t]=!0,t}function i(t,e){if(!r.call(t,n)){if(!e)return;Object.defineProperty(t,n,{value:c.create()})}return t[n]}function a(t,e){for(var r=0;r<e;++r)t[r]=255*Math.random()|0;return t}function s(t){if("function"==typeof Uint8Array){var e=new Uint8Array(t);return"undefined"!=typeof crypto?crypto.getRandomValues(e):"undefined"!=typeof msCrypto?msCrypto.getRandomValues(e):a(e,t),e}return a(new Array(t),t)}function u(){var e=s(t);e[6]=79&e[6]|64,e[8]=191&e[8]|128;for(var r="",n=0;n<t;++n){var o=e[n];4!==n&&6!==n&&8!==n||(r+="-"),o<16&&(r+="0"),r+=o.toString(16).toLowerCase()}return r}}function pt(t){return t.__=void 0,delete t.__,t}t("decorate",m),t("metadata",_),t("defineMetadata",g),t("hasMetadata",w),t("hasOwnMetadata",S),t("getMetadata",T),t("getOwnMetadata",O),t("getMetadataKeys",A),t("getOwnMetadataKeys",b),t("deleteMetadata",M)}(o,n),void 0===n.Reflect&&(n.Reflect=t)}()}(n||(n={}))},4729:(t,e,r)=>{"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t){return function(t){if(Array.isArray(t))return t}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.d(e,{A:()=>a});var i=r(1999);function a(t,e,r,n){var o=s();if(n)for(var i=0;i<n.length;i++)o=n[i](o);var a=e((function(t){o.initializeInstanceElements(t,l.elements)}),r),l=o.decorateClass(function(t){for(var e=[],r=function(t){return"method"===t.kind&&t.key===i.key&&t.placement===i.placement},n=0;n<t.length;n++){var o,i=t[n];if("method"===i.kind&&(o=e.find(r)))if(p(i.descriptor)||p(o.descriptor)){if(f(i)||f(o))throw new ReferenceError("Duplicated methods ("+i.key+") can't be decorated.");o.descriptor=i.descriptor}else{if(f(i)){if(f(o))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+i.key+").");o.decorators=i.decorators}c(i,o)}else e.push(i)}return e}(a.d.map(u)),t);return o.initializeClassElements(a.F,l.elements),o.runClassFinishers(a.F,l.finishers)}function s(){s=function(){return t};var t={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(t,e){["method","field"].forEach((function(r){e.forEach((function(e){e.kind===r&&"own"===e.placement&&this.defineClassElement(t,e)}),this)}),this)},initializeClassElements:function(t,e){var r=t.prototype;["method","field"].forEach((function(n){e.forEach((function(e){var o=e.placement;if(e.kind===n&&("static"===o||"prototype"===o)){var i="static"===o?t:r;this.defineClassElement(i,e)}}),this)}),this)},defineClassElement:function(t,e){var r=e.descriptor;if("field"===e.kind){var n=e.initializer;r={enumerable:r.enumerable,writable:r.writable,configurable:r.configurable,value:void 0===n?void 0:n.call(t)}}Object.defineProperty(t,e.key,r)},decorateClass:function(t,e){var r=[],n=[],o={static:[],prototype:[],own:[]};if(t.forEach((function(t){this.addElementPlacement(t,o)}),this),t.forEach((function(t){if(!f(t))return r.push(t);var e=this.decorateElement(t,o);r.push(e.element),r.push.apply(r,e.extras),n.push.apply(n,e.finishers)}),this),!e)return{elements:r,finishers:n};var i=this.decorateConstructor(r,e);return n.push.apply(n,i.finishers),i.finishers=n,i},addElementPlacement:function(t,e,r){var n=e[t.placement];if(!r&&-1!==n.indexOf(t.key))throw new TypeError("Duplicated element ("+t.key+")");n.push(t.key)},decorateElement:function(t,e){for(var r=[],n=[],o=t.decorators,i=o.length-1;i>=0;i--){var a=e[t.placement];a.splice(a.indexOf(t.key),1);var s=this.fromElementDescriptor(t),u=this.toElementFinisherExtras((0,o[i])(s)||s);t=u.element,this.addElementPlacement(t,e),u.finisher&&n.push(u.finisher);var c=u.extras;if(c){for(var f=0;f<c.length;f++)this.addElementPlacement(c[f],e);r.push.apply(r,c)}}return{element:t,finishers:n,extras:r}},decorateConstructor:function(t,e){for(var r=[],n=e.length-1;n>=0;n--){var o=this.fromClassDescriptor(t),i=this.toClassDescriptor((0,e[n])(o)||o);if(void 0!==i.finisher&&r.push(i.finisher),void 0!==i.elements){t=i.elements;for(var a=0;a<t.length-1;a++)for(var s=a+1;s<t.length;s++)if(t[a].key===t[s].key&&t[a].placement===t[s].placement)throw new TypeError("Duplicated element ("+t[a].key+")")}}return{elements:t,finishers:r}},fromElementDescriptor:function(t){var e={kind:t.kind,key:t.key,placement:t.placement,descriptor:t.descriptor};return Object.defineProperty(e,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===t.kind&&(e.initializer=t.initializer),e},toElementDescriptors:function(t){if(void 0!==t)return o(t).map((function(t){var e=this.toElementDescriptor(t);return this.disallowProperty(t,"finisher","An element descriptor"),this.disallowProperty(t,"extras","An element descriptor"),e}),this)},toElementDescriptor:function(t){var e=String(t.kind);if("method"!==e&&"field"!==e)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+e+'"');var r=(0,i.A)(t.key),n=String(t.placement);if("static"!==n&&"prototype"!==n&&"own"!==n)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+n+'"');var o=t.descriptor;this.disallowProperty(t,"elements","An element descriptor");var a={kind:e,key:r,placement:n,descriptor:Object.assign({},o)};return"field"!==e?this.disallowProperty(t,"initializer","A method descriptor"):(this.disallowProperty(o,"get","The property descriptor of a field descriptor"),this.disallowProperty(o,"set","The property descriptor of a field descriptor"),this.disallowProperty(o,"value","The property descriptor of a field descriptor"),a.initializer=t.initializer),a},toElementFinisherExtras:function(t){return{element:this.toElementDescriptor(t),finisher:l(t,"finisher"),extras:this.toElementDescriptors(t.extras)}},fromClassDescriptor:function(t){var e={kind:"class",elements:t.map(this.fromElementDescriptor,this)};return Object.defineProperty(e,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),e},toClassDescriptor:function(t){var e=String(t.kind);if("class"!==e)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+e+'"');this.disallowProperty(t,"key","A class descriptor"),this.disallowProperty(t,"placement","A class descriptor"),this.disallowProperty(t,"descriptor","A class descriptor"),this.disallowProperty(t,"initializer","A class descriptor"),this.disallowProperty(t,"extras","A class descriptor");var r=l(t,"finisher");return{elements:this.toElementDescriptors(t.elements),finisher:r}},runClassFinishers:function(t,e){for(var r=0;r<e.length;r++){var n=(0,e[r])(t);if(void 0!==n){if("function"!=typeof n)throw new TypeError("Finishers must return a constructor.");t=n}}return t},disallowProperty:function(t,e,r){if(void 0!==t[e])throw new TypeError(r+" can't have a ."+e+" property.")}};return t}function u(t){var e,r=(0,i.A)(t.key);"method"===t.kind?e={value:t.value,writable:!0,configurable:!0,enumerable:!1}:"get"===t.kind?e={get:t.value,configurable:!0,enumerable:!1}:"set"===t.kind?e={set:t.value,configurable:!0,enumerable:!1}:"field"===t.kind&&(e={configurable:!0,writable:!0,enumerable:!0});var n={kind:"field"===t.kind?"field":"method",key:r,placement:t.static?"static":"field"===t.kind?"own":"prototype",descriptor:e};return t.decorators&&(n.decorators=t.decorators),"field"===t.kind&&(n.initializer=t.value),n}function c(t,e){void 0!==t.descriptor.get?e.descriptor.get=t.descriptor.get:e.descriptor.set=t.descriptor.set}function f(t){return t.decorators&&t.decorators.length}function p(t){return void 0!==t&&!(void 0===t.value&&void 0===t.writable)}function l(t,e){var r=t[e];if(void 0!==r&&"function"!=typeof r)throw new TypeError("Expected '"+e+"' to be a function");return r}}}]);