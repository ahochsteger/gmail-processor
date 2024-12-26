"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[7399],{37399:(t,e,n)=>{n.d(e,{In:()=>Pt});var o=n(96540);const r=Object.freeze({left:0,top:0,width:16,height:16}),i=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),c=Object.freeze({...r,...i}),s=Object.freeze({...c,body:"",hidden:!1});function a(t,e){const n=function(t,e){const n={};!t.hFlip!=!e.hFlip&&(n.hFlip=!0),!t.vFlip!=!e.vFlip&&(n.vFlip=!0);const o=((t.rotate||0)+(e.rotate||0))%4;return o&&(n.rotate=o),n}(t,e);for(const o in s)o in i?o in t&&!(o in n)&&(n[o]=i[o]):o in e?n[o]=e[o]:o in t&&(n[o]=t[o]);return n}function f(t,e,n){const o=t.icons,r=t.aliases||Object.create(null);let i={};function c(t){i=a(o[t]||r[t],i)}return c(e),n.forEach(c),a(t,i)}function l(t,e){const n=[];if("object"!=typeof t||"object"!=typeof t.icons)return n;t.not_found instanceof Array&&t.not_found.forEach((t=>{e(t,null),n.push(t)}));const o=function(t){const e=t.icons,n=t.aliases||Object.create(null),o=Object.create(null);return Object.keys(e).concat(Object.keys(n)).forEach((function t(r){if(e[r])return o[r]=[];if(!(r in o)){o[r]=null;const e=n[r]&&n[r].parent,i=e&&t(e);i&&(o[r]=[e].concat(i))}return o[r]})),o}(t);for(const r in o){const i=o[r];i&&(e(r,f(t,r,i)),n.push(r))}return n}const u={provider:"",aliases:{},not_found:{},...r};function d(t,e){for(const n in e)if(n in t&&typeof t[n]!=typeof e[n])return!1;return!0}function p(t){if("object"!=typeof t||null===t)return null;const e=t;if("string"!=typeof e.prefix||!t.icons||"object"!=typeof t.icons)return null;if(!d(t,u))return null;const n=e.icons;for(const r in n){const t=n[r];if(!r||"string"!=typeof t.body||!d(t,s))return null}const o=e.aliases||Object.create(null);for(const r in o){const t=o[r],e=t.parent;if(!r||"string"!=typeof e||!n[e]&&!o[e]||!d(t,s))return null}return e}const h=/^[a-z0-9]+(-[a-z0-9]+)*$/,g=(t,e,n,o="")=>{const r=t.split(":");if("@"===t.slice(0,1)){if(r.length<2||r.length>3)return null;o=r.shift().slice(1)}if(r.length>3||!r.length)return null;if(r.length>1){const t=r.pop(),n=r.pop(),i={provider:r.length>0?r[0]:o,prefix:n,name:t};return e&&!m(i)?null:i}const i=r[0],c=i.split("-");if(c.length>1){const t={provider:o,prefix:c.shift(),name:c.join("-")};return e&&!m(t)?null:t}if(n&&""===o){const t={provider:o,prefix:"",name:i};return e&&!m(t,n)?null:t}return null},m=(t,e)=>!!t&&!(!(e&&""===t.prefix||t.prefix)||!t.name),b=Object.create(null);function y(t,e){const n=b[t]||(b[t]=Object.create(null));return n[e]||(n[e]=function(t,e){return{provider:t,prefix:e,icons:Object.create(null),missing:new Set}}(t,e))}function v(t,e){return p(e)?l(e,((e,n)=>{n?t.icons[e]=n:t.missing.add(e)})):[]}let x=!1;function w(t){return"boolean"==typeof t&&(x=t),x}function k(t){const e="string"==typeof t?g(t,!0,x):t;if(e){const t=y(e.provider,e.prefix),n=e.name;return t.icons[n]||(t.missing.has(n)?null:void 0)}}function j(t,e){if("object"!=typeof t)return!1;if("string"!=typeof e&&(e=t.provider||""),x&&!e&&!t.prefix){let e=!1;return p(t)&&(t.prefix="",l(t,((t,n)=>{(function(t,e){const n=g(t,!0,x);if(!n)return!1;const o=y(n.provider,n.prefix);return e?function(t,e,n){try{if("string"==typeof n.body)return t.icons[e]={...n},!0}catch(o){}return!1}(o,n.name,e):(o.missing.add(n.name),!0)})(t,n)&&(e=!0)}))),e}const n=t.prefix;if(!m({provider:e,prefix:n,name:"a"}))return!1;return!!v(y(e,n),t)}const S=Object.freeze({width:null,height:null}),O=Object.freeze({...S,...i}),E=/(-?[0-9.]*[0-9]+[0-9.]*)/g,M=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function I(t,e,n){if(1===e)return t;if(n=n||100,"number"==typeof t)return Math.ceil(t*e*n)/n;if("string"!=typeof t)return t;const o=t.split(E);if(null===o||!o.length)return t;const r=[];let i=o.shift(),c=M.test(i);for(;;){if(c){const t=parseFloat(i);isNaN(t)?r.push(i):r.push(Math.ceil(t*e*n)/n)}else r.push(i);if(i=o.shift(),void 0===i)return r.join("");c=!c}}const T=/\sid="(\S+)"/g,F="IconifyId"+Date.now().toString(16)+(16777216*Math.random()|0).toString(16);let C=0;function L(t,e=F){const n=[];let o;for(;o=T.exec(t);)n.push(o[1]);if(!n.length)return t;const r="suffix"+(16777216*Math.random()|Date.now()).toString(16);return n.forEach((n=>{const o="function"==typeof e?e(n):e+(C++).toString(),i=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");t=t.replace(new RegExp('([#;"])('+i+')([")]|\\.[a-z])',"g"),"$1"+o+r+"$3")})),t=t.replace(new RegExp(r,"g"),"")}const _=Object.create(null);function z(t,e){_[t]=e}function N(t){return _[t]||_[""]}function R(t){let e;if("string"==typeof t.resources)e=[t.resources];else if(e=t.resources,!(e instanceof Array&&e.length))return null;return{resources:e,path:t.path||"/",maxURL:t.maxURL||500,rotate:t.rotate||750,timeout:t.timeout||5e3,random:!0===t.random,index:t.index||0,dataAfterTimeout:!1!==t.dataAfterTimeout}}const A=Object.create(null),P=["https://api.simplesvg.com","https://api.unisvg.com"],$=[];for(;P.length>0;)1===P.length||Math.random()>.5?$.push(P.shift()):$.push(P.pop());function D(t,e){const n=R(e);return null!==n&&(A[t]=n,!0)}function U(t){return A[t]}A[""]=R({resources:["https://api.iconify.design"].concat($)});let q=(()=>{let t;try{if(t=fetch,"function"==typeof t)return t}catch(e){}})();const H={prepare:(t,e,n)=>{const o=[],r=function(t,e){const n=U(t);if(!n)return 0;let o;if(n.maxURL){let t=0;n.resources.forEach((e=>{const n=e;t=Math.max(t,n.length)}));const r=e+".json?icons=";o=n.maxURL-t-n.path.length-r.length}else o=0;return o}(t,e),i="icons";let c={type:i,provider:t,prefix:e,icons:[]},s=0;return n.forEach(((n,a)=>{s+=n.length+1,s>=r&&a>0&&(o.push(c),c={type:i,provider:t,prefix:e,icons:[]},s=n.length),c.icons.push(n)})),o.push(c),o},send:(t,e,n)=>{if(!q)return void n("abort",424);let o=function(t){if("string"==typeof t){const e=U(t);if(e)return e.path}return"/"}(e.provider);switch(e.type){case"icons":{const t=e.prefix,n=e.icons.join(",");o+=t+".json?"+new URLSearchParams({icons:n}).toString();break}case"custom":{const t=e.uri;o+="/"===t.slice(0,1)?t.slice(1):t;break}default:return void n("abort",400)}let r=503;q(t+o).then((t=>{const e=t.status;if(200===e)return r=501,t.json();setTimeout((()=>{n(function(t){return 404===t}(e)?"abort":"next",e)}))})).then((t=>{"object"==typeof t&&null!==t?setTimeout((()=>{n("success",t)})):setTimeout((()=>{404===t?n("abort",t):n("next",r)}))})).catch((()=>{n("next",r)}))}};function J(t,e){t.forEach((t=>{const n=t.loaderCallbacks;n&&(t.loaderCallbacks=n.filter((t=>t.id!==e)))}))}let Q=0;var B={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function W(t,e,n,o){const r=t.resources.length,i=t.random?Math.floor(Math.random()*r):t.index;let c;if(t.random){let e=t.resources.slice(0);for(c=[];e.length>1;){const t=Math.floor(Math.random()*e.length);c.push(e[t]),e=e.slice(0,t).concat(e.slice(t+1))}c=c.concat(e)}else c=t.resources.slice(i).concat(t.resources.slice(0,i));const s=Date.now();let a,f="pending",l=0,u=null,d=[],p=[];function h(){u&&(clearTimeout(u),u=null)}function g(){"pending"===f&&(f="aborted"),h(),d.forEach((t=>{"pending"===t.status&&(t.status="aborted")})),d=[]}function m(t,e){e&&(p=[]),"function"==typeof t&&p.push(t)}function b(){f="failed",p.forEach((t=>{t(void 0,a)}))}function y(){d.forEach((t=>{"pending"===t.status&&(t.status="aborted")})),d=[]}function v(){if("pending"!==f)return;h();const o=c.shift();if(void 0===o)return d.length?void(u=setTimeout((()=>{h(),"pending"===f&&(y(),b())}),t.timeout)):void b();const r={status:"pending",resource:o,callback:(e,n)=>{!function(e,n,o){const r="success"!==n;switch(d=d.filter((t=>t!==e)),f){case"pending":break;case"failed":if(r||!t.dataAfterTimeout)return;break;default:return}if("abort"===n)return a=o,void b();if(r)return a=o,void(d.length||(c.length?v():b()));if(h(),y(),!t.random){const n=t.resources.indexOf(e.resource);-1!==n&&n!==t.index&&(t.index=n)}f="completed",p.forEach((t=>{t(o)}))}(r,e,n)}};d.push(r),l++,u=setTimeout(v,t.rotate),n(o,e,r.callback)}return"function"==typeof o&&p.push(o),setTimeout(v),function(){return{startTime:s,payload:e,status:f,queriesSent:l,queriesPending:d.length,subscribe:m,abort:g}}}function X(t){const e={...B,...t};let n=[];function o(){n=n.filter((t=>"pending"===t().status))}return{query:function(t,r,i){const c=W(e,t,r,((t,e)=>{o(),i&&i(t,e)}));return n.push(c),c},find:function(t){return n.find((e=>t(e)))||null},setIndex:t=>{e.index=t},getIndex:()=>e.index,cleanup:o}}function G(){}const K=Object.create(null);function V(t,e,n){let o,r;if("string"==typeof t){const e=N(t);if(!e)return n(void 0,424),G;r=e.send;const i=function(t){if(!K[t]){const e=U(t);if(!e)return;const n={config:e,redundancy:X(e)};K[t]=n}return K[t]}(t);i&&(o=i.redundancy)}else{const e=R(t);if(e){o=X(e);const n=N(t.resources?t.resources[0]:"");n&&(r=n.send)}}return o&&r?o.query(e,r,n)().abort:(n(void 0,424),G)}const Y="iconify2",Z="iconify",tt=Z+"-count",et=Z+"-version",nt=36e5;function ot(t,e){try{return t.getItem(e)}catch(n){}}function rt(t,e,n){try{return t.setItem(e,n),!0}catch(o){}}function it(t,e){try{t.removeItem(e)}catch(n){}}function ct(t,e){return rt(t,tt,e.toString())}function st(t){return parseInt(ot(t,tt))||0}const at={local:!0,session:!0},ft={local:new Set,session:new Set};let lt=!1;let ut="undefined"==typeof window?{}:window;function dt(t){const e=t+"Storage";try{if(ut&&ut[e]&&"number"==typeof ut[e].length)return ut[e]}catch(n){}at[t]=!1}function pt(t,e){const n=dt(t);if(!n)return;const o=ot(n,et);if(o!==Y){if(o){const t=st(n);for(let e=0;e<t;e++)it(n,Z+e.toString())}return rt(n,et,Y),void ct(n,0)}const r=Math.floor(Date.now()/nt)-168,i=t=>{const o=Z+t.toString(),i=ot(n,o);if("string"==typeof i){try{const n=JSON.parse(i);if("object"==typeof n&&"number"==typeof n.cached&&n.cached>r&&"string"==typeof n.provider&&"object"==typeof n.data&&"string"==typeof n.data.prefix&&e(n,t))return!0}catch(c){}it(n,o)}};let c=st(n);for(let s=c-1;s>=0;s--)i(s)||(s===c-1?(c--,ct(n,c)):ft[t].add(s))}function ht(){if(!lt){lt=!0;for(const t in at)pt(t,(t=>{const e=t.data,n=y(t.provider,e.prefix);if(!v(n,e).length)return!1;const o=e.lastModified||-1;return n.lastModifiedCached=n.lastModifiedCached?Math.min(n.lastModifiedCached,o):o,!0}))}}function gt(t,e){function n(n){let o;if(!at[n]||!(o=dt(n)))return;const r=ft[n];let i;if(r.size)r.delete(i=Array.from(r).shift());else if(i=st(o),i>=50||!ct(o,i+1))return;const c={cached:Math.floor(Date.now()/nt),provider:t.provider,data:e};return rt(o,Z+i.toString(),JSON.stringify(c))}lt||ht(),e.lastModified&&!function(t,e){const n=t.lastModifiedCached;if(n&&n>=e)return n===e;if(t.lastModifiedCached=e,n)for(const o in at)pt(o,(n=>{const o=n.data;return n.provider!==t.provider||o.prefix!==t.prefix||o.lastModified===e}));return!0}(t,e.lastModified)||Object.keys(e.icons).length&&(e.not_found&&delete(e=Object.assign({},e)).not_found,n("local")||n("session"))}function mt(){}function bt(t){t.iconsLoaderFlag||(t.iconsLoaderFlag=!0,setTimeout((()=>{t.iconsLoaderFlag=!1,function(t){t.pendingCallbacksFlag||(t.pendingCallbacksFlag=!0,setTimeout((()=>{t.pendingCallbacksFlag=!1;const e=t.loaderCallbacks?t.loaderCallbacks.slice(0):[];if(!e.length)return;let n=!1;const o=t.provider,r=t.prefix;e.forEach((e=>{const i=e.icons,c=i.pending.length;i.pending=i.pending.filter((e=>{if(e.prefix!==r)return!0;const c=e.name;if(t.icons[c])i.loaded.push({provider:o,prefix:r,name:c});else{if(!t.missing.has(c))return n=!0,!0;i.missing.push({provider:o,prefix:r,name:c})}return!1})),i.pending.length!==c&&(n||J([t],e.id),e.callback(i.loaded.slice(0),i.missing.slice(0),i.pending.slice(0),e.abort))}))})))}(t)})))}function yt(t,e,n,o){function r(){const n=t.pendingIcons;e.forEach((e=>{n&&n.delete(e),t.icons[e]||t.missing.add(e)}))}if(n&&"object"==typeof n)try{if(!v(t,n).length)return void r();o&&gt(t,n)}catch(i){console.error(i)}r(),bt(t)}function vt(t,e){t instanceof Promise?t.then((t=>{e(t)})).catch((()=>{e(null)})):e(t)}function xt(t,e){t.iconsToLoad?t.iconsToLoad=t.iconsToLoad.concat(e).sort():t.iconsToLoad=e,t.iconsQueueFlag||(t.iconsQueueFlag=!0,setTimeout((()=>{t.iconsQueueFlag=!1;const{provider:e,prefix:n}=t,o=t.iconsToLoad;if(delete t.iconsToLoad,!o||!o.length)return;const r=t.loadIcon;if(t.loadIcons&&(o.length>1||!r))return void vt(t.loadIcons(o,n,e),(e=>{yt(t,o,e,!1)}));if(r)return void o.forEach((o=>{vt(r(o,n,e),(e=>{yt(t,[o],e?{prefix:n,icons:{[o]:e}}:null,!1)}))}));const{valid:i,invalid:c}=function(t){const e=[],n=[];return t.forEach((t=>{(t.match(h)?e:n).push(t)})),{valid:e,invalid:n}}(o);if(c.length&&yt(t,c,null,!1),!i.length)return;const s=n.match(h)?N(e):null;if(!s)return void yt(t,i,null,!1);s.prepare(e,n,i).forEach((n=>{V(e,n,(e=>{yt(t,n.icons,e,!0)}))}))})))}const wt=(t,e)=>{const n=function(t,e=!0,n=!1){const o=[];return t.forEach((t=>{const r="string"==typeof t?g(t,e,n):t;r&&o.push(r)})),o}(t,!0,w()),o=function(t){const e={loaded:[],missing:[],pending:[]},n=Object.create(null);t.sort(((t,e)=>t.provider!==e.provider?t.provider.localeCompare(e.provider):t.prefix!==e.prefix?t.prefix.localeCompare(e.prefix):t.name.localeCompare(e.name)));let o={provider:"",prefix:"",name:""};return t.forEach((t=>{if(o.name===t.name&&o.prefix===t.prefix&&o.provider===t.provider)return;o=t;const r=t.provider,i=t.prefix,c=t.name,s=n[r]||(n[r]=Object.create(null)),a=s[i]||(s[i]=y(r,i));let f;f=c in a.icons?e.loaded:""===i||a.missing.has(c)?e.missing:e.pending;const l={provider:r,prefix:i,name:c};f.push(l)})),e}(n);if(!o.pending.length){let t=!0;return e&&setTimeout((()=>{t&&e(o.loaded,o.missing,o.pending,mt)})),()=>{t=!1}}const r=Object.create(null),i=[];let c,s;return o.pending.forEach((t=>{const{provider:e,prefix:n}=t;if(n===s&&e===c)return;c=e,s=n,i.push(y(e,n));const o=r[e]||(r[e]=Object.create(null));o[n]||(o[n]=[])})),o.pending.forEach((t=>{const{provider:e,prefix:n,name:o}=t,i=y(e,n),c=i.pendingIcons||(i.pendingIcons=new Set);c.has(o)||(c.add(o),r[e][n].push(o))})),i.forEach((t=>{const e=r[t.provider][t.prefix];e.length&&xt(t,e)})),e?function(t,e,n){const o=Q++,r=J.bind(null,n,o);if(!e.pending.length)return r;const i={id:o,icons:e,callback:t,abort:r};return n.forEach((t=>{(t.loaderCallbacks||(t.loaderCallbacks=[])).push(i)})),r}(e,o,i):mt};const kt=/[\s,]+/;function jt(t,e){e.split(kt).forEach((e=>{switch(e.trim()){case"horizontal":t.hFlip=!0;break;case"vertical":t.vFlip=!0}}))}function St(t,e=0){const n=t.replace(/^-?[0-9.]*/,"");function o(t){for(;t<0;)t+=4;return t%4}if(""===n){const e=parseInt(t);return isNaN(e)?0:o(e)}if(n!==t){let e=0;switch(n){case"%":e=25;break;case"deg":e=90}if(e){let r=parseFloat(t.slice(0,t.length-n.length));return isNaN(r)?0:(r/=e,r%1==0?o(r):0)}}return e}let Ot;function Et(t){return void 0===Ot&&function(){try{Ot=window.trustedTypes.createPolicy("iconify",{createHTML:t=>t})}catch(t){Ot=null}}(),Ot?Ot.createHTML(t):t}const Mt={...O,inline:!1},It={xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink","aria-hidden":!0,role:"img"},Tt={display:"inline-block"},Ft={backgroundColor:"currentColor"},Ct={backgroundColor:"transparent"},Lt={Image:"var(--svg)",Repeat:"no-repeat",Size:"100% 100%"},_t={WebkitMask:Ft,mask:Ft,background:Ct};for(const Dt in _t){const t=_t[Dt];for(const e in Lt)t[Dt+e]=Lt[e]}const zt={...Mt,inline:!0};function Nt(t){return t+(t.match(/^[-0-9.]+$/)?"px":"")}const Rt=(t,e,n)=>{const r=e.inline?zt:Mt,i=function(t,e){const n={...t};for(const o in e){const t=e[o],r=typeof t;o in S?(null===t||t&&("string"===r||"number"===r))&&(n[o]=t):r===typeof n[o]&&(n[o]="rotate"===o?t%4:t)}return n}(r,e),s=e.mode||"svg",a={},f=e.style||{},l={..."svg"===s?It:{}};if(n){const t=g(n,!1,!0);if(t){const e=["iconify"],n=["provider","prefix"];for(const o of n)t[o]&&e.push("iconify--"+t[o]);l.className=e.join(" ")}}for(let o in e){const t=e[o];if(void 0!==t)switch(o){case"icon":case"style":case"children":case"onLoad":case"mode":case"ssr":break;case"_ref":l.ref=t;break;case"className":l[o]=(l[o]?l[o]+" ":"")+t;break;case"inline":case"hFlip":case"vFlip":i[o]=!0===t||"true"===t||1===t;break;case"flip":"string"==typeof t&&jt(i,t);break;case"color":a.color=t;break;case"rotate":"string"==typeof t?i[o]=St(t):"number"==typeof t&&(i[o]=t);break;case"ariaHidden":case"aria-hidden":!0!==t&&"true"!==t&&delete l["aria-hidden"];break;default:void 0===r[o]&&(l[o]=t)}}const u=function(t,e){const n={...c,...t},o={...O,...e},r={left:n.left,top:n.top,width:n.width,height:n.height};let i=n.body;[n,o].forEach((t=>{const e=[],n=t.hFlip,o=t.vFlip;let c,s=t.rotate;switch(n?o?s+=2:(e.push("translate("+(r.width+r.left).toString()+" "+(0-r.top).toString()+")"),e.push("scale(-1 1)"),r.top=r.left=0):o&&(e.push("translate("+(0-r.left).toString()+" "+(r.height+r.top).toString()+")"),e.push("scale(1 -1)"),r.top=r.left=0),s<0&&(s-=4*Math.floor(s/4)),s%=4,s){case 1:c=r.height/2+r.top,e.unshift("rotate(90 "+c.toString()+" "+c.toString()+")");break;case 2:e.unshift("rotate(180 "+(r.width/2+r.left).toString()+" "+(r.height/2+r.top).toString()+")");break;case 3:c=r.width/2+r.left,e.unshift("rotate(-90 "+c.toString()+" "+c.toString()+")")}s%2==1&&(r.left!==r.top&&(c=r.left,r.left=r.top,r.top=c),r.width!==r.height&&(c=r.width,r.width=r.height,r.height=c)),e.length&&(i=function(t,e,n){const o=function(t,e="defs"){let n="";const o=t.indexOf("<"+e);for(;o>=0;){const r=t.indexOf(">",o),i=t.indexOf("</"+e);if(-1===r||-1===i)break;const c=t.indexOf(">",i);if(-1===c)break;n+=t.slice(r+1,i).trim(),t=t.slice(0,o).trim()+t.slice(c+1)}return{defs:n,content:t}}(t);return r=o.defs,i=e+o.content+n,r?"<defs>"+r+"</defs>"+i:i;var r,i}(i,'<g transform="'+e.join(" ")+'">',"</g>"))}));const s=o.width,a=o.height,f=r.width,l=r.height;let u,d;null===s?(d=null===a?"1em":"auto"===a?l:a,u=I(d,f/l)):(u="auto"===s?f:s,d=null===a?I(u,l/f):"auto"===a?l:a);const p={},h=(t,e)=>{(t=>"unset"===t||"undefined"===t||"none"===t)(e)||(p[t]=e.toString())};h("width",u),h("height",d);const g=[r.left,r.top,f,l];return p.viewBox=g.join(" "),{attributes:p,viewBox:g,body:i}}(t,i),d=u.attributes;if(i.inline&&(a.verticalAlign="-0.125em"),"svg"===s){l.style={...a,...f},Object.assign(l,d);let t=0,n=e.id;return"string"==typeof n&&(n=n.replace(/-/g,"_")),l.dangerouslySetInnerHTML={__html:Et(L(u.body,n?()=>n+"ID"+t++:"iconifyReact"))},(0,o.createElement)("svg",l)}const{body:p,width:h,height:m}=t,b="mask"===s||"bg"!==s&&-1!==p.indexOf("currentColor"),y=function(t,e){let n=-1===t.indexOf("xlink:")?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in e)n+=" "+o+'="'+e[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+n+">"+t+"</svg>"}(p,{...d,width:h+"",height:m+""});var v;return l.style={...a,"--svg":(v=y,'url("'+function(t){return"data:image/svg+xml,"+function(t){return t.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}(t)}(v)+'")'),width:Nt(d.width),height:Nt(d.height),...Tt,...b?Ft:Ct,...f},(0,o.createElement)("span",l)};if(w(!0),z("",H),"undefined"!=typeof document&&"undefined"!=typeof window){ht();const t=window;if(void 0!==t.IconifyPreload){const e=t.IconifyPreload,n="Invalid IconifyPreload syntax.";"object"==typeof e&&null!==e&&(e instanceof Array?e:[e]).forEach((t=>{try{("object"!=typeof t||null===t||t instanceof Array||"object"!=typeof t.icons||"string"!=typeof t.prefix||!j(t))&&console.error(n)}catch(e){console.error(n)}}))}if(void 0!==t.IconifyProviders){const e=t.IconifyProviders;if("object"==typeof e&&null!==e)for(let t in e){const n="IconifyProviders["+t+"] is invalid.";try{const o=e[t];if("object"!=typeof o||!o||void 0===o.resources)continue;D(t,o)||console.error(n)}catch($t){console.error(n)}}}}function At(t){const[e,n]=(0,o.useState)(!!t.ssr),[r,i]=(0,o.useState)({});const[s,a]=(0,o.useState)(function(e){if(e){const e=t.icon;if("object"==typeof e)return{name:"",data:e};const n=k(e);if(n)return{name:e,data:n}}return{name:""}}(!!t.ssr));function f(){const t=r.callback;t&&(t(),i({}))}function l(t){if(JSON.stringify(s)!==JSON.stringify(t))return f(),a(t),!0}function u(){var e;const n=t.icon;if("object"==typeof n)return void l({name:"",data:n});const o=k(n);if(l({name:n,data:o}))if(void 0===o){const t=wt([n],u);i({callback:t})}else o&&(null===(e=t.onLoad)||void 0===e||e.call(t,n))}(0,o.useEffect)((()=>(n(!0),f)),[]),(0,o.useEffect)((()=>{e&&u()}),[t.icon,e]);const{name:d,data:p}=s;return p?Rt({...c,...p},t,d):t.children?t.children:(0,o.createElement)("span",{})}const Pt=(0,o.forwardRef)(((t,e)=>At({...t,_ref:e})));(0,o.forwardRef)(((t,e)=>At({inline:!0,...t,_ref:e})))}}]);