"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[305],{6259:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>c,metadata:()=>a,toc:()=>m});var i=n(5893),r=n(1151),s=n(2991);const c={id:"community",sidebar_position:70},o="Community",a={id:"community/community",title:"Community",description:"",source:"@site/docs/community/index.md",sourceDirName:"community",slug:"/community/",permalink:"/gmail-processor/docs/community/",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/community/index.md",tags:[],version:"current",sidebarPosition:70,frontMatter:{id:"community",sidebar_position:70},sidebar:"docsSidebar",previous:{title:"FAQs",permalink:"/gmail-processor/docs/faqs"},next:{title:"Contributing",permalink:"/gmail-processor/docs/community/contributing"}},d={},m=[];function u(t){const e={h1:"h1",...(0,r.a)(),...t.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"community",children:"Community"}),"\n","\n","\n",(0,i.jsx)(s.Z,{})]})}function l(t={}){const{wrapper:e}={...(0,r.a)(),...t.components};return e?(0,i.jsx)(e,{...t,children:(0,i.jsx)(u,{...t})}):u(t)}},2991:(t,e,n)=>{n.d(e,{Z:()=>y});n(7294);var i=n(512),r=n(3438),s=n(9960),c=n(3919),o=n(5999),a=n(2503);const d={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var m=n(5893);function u(t){let{href:e,children:n}=t;return(0,m.jsx)(s.Z,{href:e,className:(0,i.Z)("card padding--lg",d.cardContainer),children:n})}function l(t){let{href:e,icon:n,title:r,description:s}=t;return(0,m.jsxs)(u,{href:e,children:[(0,m.jsxs)(a.Z,{as:"h2",className:(0,i.Z)("text--truncate",d.cardTitle),title:r,children:[n," ",r]}),s&&(0,m.jsx)("p",{className:(0,i.Z)("text--truncate",d.cardDescription),title:s,children:s})]})}function p(t){let{item:e}=t;const n=(0,r.LM)(e);return n?(0,m.jsx)(l,{href:n,icon:"\ud83d\uddc3\ufe0f",title:e.label,description:e.description??(0,o.translate)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:e.items.length})}):null}function f(t){let{item:e}=t;const n=(0,c.Z)(e.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",i=(0,r.xz)(e.docId??void 0);return(0,m.jsx)(l,{href:e.href,icon:n,title:e.label,description:e.description??i?.description})}function h(t){let{item:e}=t;switch(e.type){case"link":return(0,m.jsx)(f,{item:e});case"category":return(0,m.jsx)(p,{item:e});default:throw new Error(`unknown item type ${JSON.stringify(e)}`)}}function x(t){let{className:e}=t;const n=(0,r.jA)();return(0,m.jsx)(y,{items:n.items,className:e})}function y(t){const{items:e,className:n}=t;if(!e)return(0,m.jsx)(x,{...t});const s=(0,r.MN)(e);return(0,m.jsx)("section",{className:(0,i.Z)("row",n),children:s.map(((t,e)=>(0,m.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,m.jsx)(h,{item:t})},e)))})}},1151:(t,e,n)=>{n.d(e,{Z:()=>o,a:()=>c});var i=n(7294);const r={},s=i.createContext(r);function c(t){const e=i.useContext(s);return i.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function o(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(r):t.components||r:c(t.components),i.createElement(s.Provider,{value:e},t.children)}}}]);