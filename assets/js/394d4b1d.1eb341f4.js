"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[2006],{8570:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>c,metadata:()=>a,toc:()=>u});var n=s(4848),r=s(8453),o=s(3514);const c={id:"basics",description:"These examples demonstrate basic functionality of Gmail Processor."},i="Basics",a={id:"examples/basics/basics",title:"Basics",description:"These examples demonstrate basic functionality of Gmail Processor.",source:"@site/docs/examples/basics/index.mdx",sourceDirName:"examples/basics",slug:"/examples/basics/",permalink:"/gmail-processor/docs/examples/basics/",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/basics/index.mdx",tags:[],version:"current",frontMatter:{id:"basics",description:"These examples demonstrate basic functionality of Gmail Processor."},sidebar:"docsSidebar",previous:{title:"Regular Expressions",permalink:"/gmail-processor/docs/examples/advanced/regularExpressions"},next:{title:"Store Attachment",permalink:"/gmail-processor/docs/examples/basics/simple"}},l={},u=[];function d(e){const t={h1:"h1",p:"p",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"basics",children:"Basics"}),"\n",(0,n.jsx)(t.p,{children:"These examples demonstrate basic functionality of Gmail Processor."}),"\n",(0,n.jsx)(o.A,{})]})}function m(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3514:(e,t,s)=>{s.d(t,{A:()=>b});s(6540);var n=s(4164),r=s(4142),o=s(8774),c=s(5846),i=s(6654),a=s(1312),l=s(1107);const u={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var d=s(4848);function m(e){let{href:t,children:s}=e;return(0,d.jsx)(o.A,{href:t,className:(0,n.A)("card padding--lg",u.cardContainer),children:s})}function p(e){let{href:t,icon:s,title:r,description:o}=e;return(0,d.jsxs)(m,{href:t,children:[(0,d.jsxs)(l.A,{as:"h2",className:(0,n.A)("text--truncate",u.cardTitle),title:r,children:[s," ",r]}),o&&(0,d.jsx)("p",{className:(0,n.A)("text--truncate",u.cardDescription),title:o,children:o})]})}function f(e){let{item:t}=e;const s=(0,r.Nr)(t),n=function(){const{selectMessage:e}=(0,c.W)();return t=>e(t,(0,a.translate)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription.plurals",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t}))}();return s?(0,d.jsx)(p,{href:s,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??n(t.items.length)}):null}function h(e){let{item:t}=e;const s=(0,i.A)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",n=(0,r.cC)(t.docId??void 0);return(0,d.jsx)(p,{href:t.href,icon:s,title:t.label,description:t.description??n?.description})}function x(e){let{item:t}=e;switch(t.type){case"link":return(0,d.jsx)(h,{item:t});case"category":return(0,d.jsx)(f,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function g(e){let{className:t}=e;const s=(0,r.$S)();return(0,d.jsx)(b,{items:s.items,className:t})}function b(e){const{items:t,className:s}=e;if(!t)return(0,d.jsx)(g,{...e});const o=(0,r.d1)(t);return(0,d.jsx)("section",{className:(0,n.A)("row",s),children:o.map(((e,t)=>(0,d.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,d.jsx)(x,{item:e})},t)))})}},5846:(e,t,s)=>{s.d(t,{W:()=>l});var n=s(6540),r=s(4586);const o=["zero","one","two","few","many","other"];function c(e){return o.filter((t=>e.includes(t)))}const i={locale:"en",pluralForms:c(["one","other"]),select:e=>1===e?"one":"other"};function a(){const{i18n:{currentLocale:e}}=(0,r.A)();return(0,n.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:c(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),i}}),[e])}function l(){const e=a();return{selectMessage:(t,s)=>function(e,t,s){const n=e.split("|");if(1===n.length)return n[0];n.length>s.pluralForms.length&&console.error(`For locale=${s.locale}, a maximum of ${s.pluralForms.length} plural forms are expected (${s.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);const r=s.select(t),o=s.pluralForms.indexOf(r);return n[Math.min(o,n.length-1)]}(s,t,e)}}},8453:(e,t,s)=>{s.d(t,{R:()=>c,x:()=>i});var n=s(6540);const r={},o=n.createContext(r);function c(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);