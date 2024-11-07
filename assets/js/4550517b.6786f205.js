"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[8092],{3692:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>c,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"examples/features/features","title":"Features","description":"These examples demonstrate different features of Gmail Processor.","source":"@site/docs/examples/features/index.mdx","sourceDirName":"examples/features","slug":"/examples/features/","permalink":"/gmail-processor/docs/examples/features/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/features/index.mdx","tags":[],"version":"current","frontMatter":{"id":"features","description":"These examples demonstrate different features of Gmail Processor."},"sidebar":"docsSidebar","previous":{"title":"Store Attachment","permalink":"/gmail-processor/docs/examples/basics/simple"},"next":{"title":"Convert to Google","permalink":"/gmail-processor/docs/examples/features/convertToGoogle"}}');var n=r(4848),o=r(8453),a=r(3514);const c={id:"features",description:"These examples demonstrate different features of Gmail Processor."},i="Features",l={},u=[];function d(e){const t={h1:"h1",header:"header",p:"p",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"features",children:"Features"})}),"\n",(0,n.jsx)(t.p,{children:"These examples demonstrate different features of Gmail Processor."}),"\n",(0,n.jsx)(a.A,{})]})}function m(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3514:(e,t,r)=>{r.d(t,{A:()=>j});r(6540);var s=r(4164),n=r(6972),o=r(8774),a=r(5846),c=r(6654),i=r(1312),l=r(1107);const u={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var d=r(4848);function m(e){let{href:t,children:r}=e;return(0,d.jsx)(o.A,{href:t,className:(0,s.A)("card padding--lg",u.cardContainer),children:r})}function f(e){let{href:t,icon:r,title:n,description:o}=e;return(0,d.jsxs)(m,{href:t,children:[(0,d.jsxs)(l.A,{as:"h2",className:(0,s.A)("text--truncate",u.cardTitle),title:n,children:[r," ",n]}),o&&(0,d.jsx)("p",{className:(0,s.A)("text--truncate",u.cardDescription),title:o,children:o})]})}function p(e){let{item:t}=e;const r=(0,n.Nr)(t),s=function(){const{selectMessage:e}=(0,a.W)();return t=>e(t,(0,i.translate)({message:"1 item|{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return r?(0,d.jsx)(f,{href:r,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??s(t.items.length)}):null}function h(e){let{item:t}=e;const r=(0,c.A)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",s=(0,n.cC)(t.docId??void 0);return(0,d.jsx)(f,{href:t.href,icon:r,title:t.label,description:t.description??s?.description})}function x(e){let{item:t}=e;switch(t.type){case"link":return(0,d.jsx)(h,{item:t});case"category":return(0,d.jsx)(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function g(e){let{className:t}=e;const r=(0,n.$S)();return(0,d.jsx)(j,{items:r.items,className:t})}function j(e){const{items:t,className:r}=e;if(!t)return(0,d.jsx)(g,{...e});const o=(0,n.d1)(t);return(0,d.jsx)("section",{className:(0,s.A)("row",r),children:o.map(((e,t)=>(0,d.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,d.jsx)(x,{item:e})},t)))})}},5846:(e,t,r)=>{r.d(t,{W:()=>l});var s=r(6540),n=r(4586);const o=["zero","one","two","few","many","other"];function a(e){return o.filter((t=>e.includes(t)))}const c={locale:"en",pluralForms:a(["one","other"]),select:e=>1===e?"one":"other"};function i(){const{i18n:{currentLocale:e}}=(0,n.A)();return(0,s.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:a(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),c}}),[e])}function l(){const e=i();return{selectMessage:(t,r)=>function(e,t,r){const s=e.split("|");if(1===s.length)return s[0];s.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${s.length}: ${e}`);const n=r.select(t),o=r.pluralForms.indexOf(n);return s[Math.min(o,s.length-1)]}(r,t,e)}}},8453:(e,t,r)=>{r.d(t,{R:()=>a,x:()=>c});var s=r(6540);const n={},o=s.createContext(n);function a(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);