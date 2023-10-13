"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[156],{3905:(e,t,r)=>{r.d(t,{Zo:()=>m,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),i=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},m=function(e){var t=i(e.components);return n.createElement(c.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=i(r),d=a,f=p["".concat(c,".").concat(d)]||p[d]||u[d]||o;return r?n.createElement(f,s(s({ref:t},m),{},{components:r})):n.createElement(f,s({ref:t},m))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[p]="string"==typeof e?e:a,s[1]=l;for(var i=2;i<o;i++)s[i]=r[i];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5878:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(9960),a=r(614),o=r(7294);const s="https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/";function l(e){let{name:t,config:r,title:l=t}=e;const c=t+".json",i=t+".js";return o.createElement(o.Fragment,null,o.createElement("p",null,r?.description),o.createElement("p",null,"NOTE: Copy the example and paste it into the ",o.createElement(n.Z,{href:"/playground"},"playground")," to modify it."),o.createElement(a.default,{language:"jsx",showLineNumbers:!0,title:c},JSON.stringify(r,null,2)),o.createElement("p",null,"Source files: ",o.createElement("a",{href:`${s}/${c}`},c),", ",o.createElement("a",{href:`${s}/${i}`},i)))}},1424:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>m,contentTitle:()=>c,default:()=>f,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var n=r(7462),a=(r(7294),r(3905)),o=r(5878);const s=JSON.parse('{"description":"This is a simple configuration example.","settings":{"markProcessedMethod":"mark-read","maxBatchSize":10,"maxRuntime":280,"sleepTimeThreads":100,"sleepTimeMessages":0,"sleepTimeAttachments":0,"timezone":"UTC"},"global":{"thread":{"match":{"query":"has:attachment -in:trash -in:drafts -in:spam newer_than:1d","maxMessageCount":-1,"minMessageCount":1},"actions":[]}},"threads":[{"description":"Store all attachments sent to my.name+scans@gmail.com to the folder \'Scans\'","match":{"query":"to:my.name+scans@gmail.com"},"actions":[{"name":"thread.storePDF","args":{"folder":"Scans-${message.date:format:yyyy-MM-dd}"}}]}]}'),l={},c="example01",i={unversionedId:"examples/example01",id:"examples/example01",title:"example01",description:"",source:"@site/docs/examples/example01.mdx",sourceDirName:"examples",slug:"/examples/example01",permalink:"/gmail-processor/docs/examples/example01",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/example01.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Examples",permalink:"/gmail-processor/docs/examples/"},next:{title:"example02",permalink:"/gmail-processor/docs/examples/example02"}},m={},p=[],u={toc:p},d="wrapper";function f(e){let{components:t,...r}=e;return(0,a.kt)(d,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"example01"},(0,a.kt)("inlineCode",{parentName:"h1"},"example01")),(0,a.kt)(o.Z,{name:"example01",config:s,mdxType:"ExampleConfig"}))}f.isMDXComponent=!0}}]);