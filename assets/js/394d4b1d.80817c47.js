"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[2006],{43335:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>m,frontMatter:()=>i,metadata:()=>r,toc:()=>u});const r=JSON.parse('{"id":"examples/basics/basics","title":"Basics","description":"These examples demonstrate basic functionality of Gmail Processor.","source":"@site/docs/examples/basics/index.mdx","sourceDirName":"examples/basics","slug":"/examples/basics/","permalink":"/gmail-processor/docs/examples/basics/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/basics/index.mdx","tags":[],"version":"current","frontMatter":{"id":"basics","description":"These examples demonstrate basic functionality of Gmail Processor."},"sidebar":"docsSidebar","previous":{"title":"Regular Expressions","permalink":"/gmail-processor/docs/examples/advanced/regularExpressions"},"next":{"title":"Store Attachment","permalink":"/gmail-processor/docs/examples/basics/simple"}}');var n=s(74848),o=s(28453),c=s(3514);const i={id:"basics",description:"These examples demonstrate basic functionality of Gmail Processor."},a="Basics",l={},u=[];function d(e){const t={h1:"h1",header:"header",p:"p",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"basics",children:"Basics"})}),"\n",(0,n.jsx)(t.p,{children:"These examples demonstrate basic functionality of Gmail Processor."}),"\n",(0,n.jsx)(c.A,{})]})}function m(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3514:(e,t,s)=>{s.d(t,{A:()=>b});s(96540);var r=s(34164),n=s(26972),o=s(28774),c=s(53465),i=s(16654),a=s(21312),l=s(51107);const u={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var d=s(74848);function m(e){let{href:t,children:s}=e;return(0,d.jsx)(o.A,{href:t,className:(0,r.A)("card padding--lg",u.cardContainer),children:s})}function p(e){let{href:t,icon:s,title:n,description:o}=e;return(0,d.jsxs)(m,{href:t,children:[(0,d.jsxs)(l.A,{as:"h2",className:(0,r.A)("text--truncate",u.cardTitle),title:n,children:[s," ",n]}),o&&(0,d.jsx)("p",{className:(0,r.A)("text--truncate",u.cardDescription),title:o,children:o})]})}function f(e){let{item:t}=e;const s=(0,n.Nr)(t),r=function(){const{selectMessage:e}=(0,c.W)();return t=>e(t,(0,a.translate)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return s?(0,d.jsx)(p,{href:s,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??r(t.items.length)}):null}function h(e){let{item:t}=e;const s=(0,i.A)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",r=(0,n.cC)(t.docId??void 0);return(0,d.jsx)(p,{href:t.href,icon:s,title:t.label,description:t.description??r?.description})}function x(e){let{item:t}=e;switch(t.type){case"link":return(0,d.jsx)(h,{item:t});case"category":return(0,d.jsx)(f,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function g(e){let{className:t}=e;const s=(0,n.$S)();return(0,d.jsx)(b,{items:s.items,className:t})}function b(e){const{items:t,className:s}=e;if(!t)return(0,d.jsx)(g,{...e});const o=(0,n.d1)(t);return(0,d.jsx)("section",{className:(0,r.A)("row",s),children:o.map(((e,t)=>(0,d.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,d.jsx)(x,{item:e})},t)))})}},53465:(e,t,s)=>{s.d(t,{W:()=>l});var r=s(96540),n=s(44586);const o=["zero","one","two","few","many","other"];function c(e){return o.filter((t=>e.includes(t)))}const i={locale:"en",pluralForms:c(["one","other"]),select:e=>1===e?"one":"other"};function a(){const{i18n:{currentLocale:e}}=(0,n.A)();return(0,r.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:c(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),i}}),[e])}function l(){const e=a();return{selectMessage:(t,s)=>function(e,t,s){const r=e.split("|");if(1===r.length)return r[0];r.length>s.pluralForms.length&&console.error(`For locale=${s.locale}, a maximum of ${s.pluralForms.length} plural forms are expected (${s.pluralForms.join(",")}), but the message contains ${r.length}: ${e}`);const n=s.select(t),o=s.pluralForms.indexOf(n);return r[Math.min(o,r.length-1)]}(s,t,e)}}},28453:(e,t,s)=>{s.d(t,{R:()=>c,x:()=>i});var r=s(96540);const n={},o=r.createContext(n);function c(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:c(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);