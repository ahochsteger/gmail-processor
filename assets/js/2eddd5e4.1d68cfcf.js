"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[9046],{8894:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var r=a(4848),n=a(8453),s=a(2915),i=a(5696);const o={id:"migrationAdvanced",title:"Advanced Migration"},l=void 0,c={id:"examples/migrations/migrationAdvanced",title:"Advanced Migration",description:"// NOTE: Do not edit this auto-generated file!",source:"@site/docs/examples/migrations/migrationAdvanced.mdx",sourceDirName:"examples/migrations",slug:"/examples/migrations/migrationAdvanced",permalink:"/gmail-processor/docs/examples/migrations/migrationAdvanced",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/migrations/migrationAdvanced.mdx",tags:[],version:"current",frontMatter:{id:"migrationAdvanced",title:"Advanced Migration"},sidebar:"docsSidebar",previous:{title:"GMail2GDrive Migration",permalink:"/gmail-processor/docs/examples/migrations/"},next:{title:"Minimal Migration",permalink:"/gmail-processor/docs/examples/migrations/migrationMin"}},u={},d=[];function m(e){const t={p:"p",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"// NOTE: Do not edit this auto-generated file!\n// Template: src/examples/_templates/docs.tmpl\n// Source: src/examples/migrations/migrationAdvanced.ts"}),"\n","\n",(0,r.jsx)(i.A,{path:"src/examples/migrations/migrationAdvanced.ts",example:s.zp})]})}function p(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},9365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>i});a(6540);var r=a(4164);const n={tabItem:"tabItem_Ymn6"};var s=a(4848);function i(e){let{children:t,hidden:a,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.A)(n.tabItem,i),hidden:a,children:t})}},1470:(e,t,a)=>{a.r(t),a.d(t,{default:()=>A});var r=a(6540),n=a(4164),s=a(3104),i=a(6347),o=a(205),l=a(7485),c=a(1682),u=a(9466);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:r,default:n}}=e;return{value:t,label:a,attributes:r,default:n}}))}(a);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function p(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:a}=e;const n=(0,i.W6)(),s=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,l.aZ)(s),(0,r.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(n.location.search);t.set(s,e),n.replace({...n.location,search:t.toString()})}),[s,n])]}function g(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,s=m(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=a.find((e=>e.default))??a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:s}))),[c,d]=f({queryString:a,groupId:n}),[g,h]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,s]=(0,u.Dv)(a);return[n,(0,r.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:n}),b=(()=>{const e=c??g;return p({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{b&&l(b)}),[b]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),h(e)}),[d,h,s]),tabValues:s}}var h=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=a(4848);function v(e){let{className:t,block:a,selectedValue:r,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.a_)(),u=e=>{const t=e.currentTarget,a=l.indexOf(t),n=o[a].value;n!==r&&(c(t),i(n))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const a=l.indexOf(e.currentTarget)+1;t=l[a]??l[0];break}case"ArrowLeft":{const a=l.indexOf(e.currentTarget)-1;t=l[a]??l[l.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,n.A)("tabs",{"tabs--block":a},t),children:o.map((e=>{let{value:t,label:a,attributes:s}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:d,onClick:u,...s,className:(0,n.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":r===t}),children:a??t},t)}))})}function y(e){let{lazy:t,children:a,selectedValue:n}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===n));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==n})))})}function j(e){const t=g(e);return(0,x.jsxs)("div",{className:(0,n.A)("tabs-container",b.tabList),children:[(0,x.jsx)(v,{...e,...t}),(0,x.jsx)(y,{...e,...t})]})}function A(e){const t=(0,h.A)();return(0,x.jsx)(j,{...e,children:d(e.children)},String(t))}},5696:(e,t,a)=>{a.d(t,{A:()=>c});var r=a(8774),n=a(1432),s=a(9365),i=a(1470),o=(a(6540),a(4848));const l="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples/";function c(e){let{example:t}=e;const a=t.info,c=t.config,u=`${a.name}.ts`;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{children:a.description}),(0,o.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,o.jsx)(r.A,{href:`/playground?example=${a.name}`,children:"playground"}),"v1"===a.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,o.jsxs)(i.default,{children:[(0,o.jsx)(s.default,{value:"config",label:"Config",default:!0,children:(0,o.jsx)(n.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(c,null,2)})}),(0,o.jsx)(s.default,{value:"script",label:"Script",children:(0,o.jsx)(n.default,{language:"jsx",showLineNumbers:!0,children:"v1"===a.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(c,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,o.jsxs)("p",{children:["Source: ",(0,o.jsx)("a",{href:`${l}/${u}`,children:u})]}),(0,o.jsxs)("p",{children:["Issues: ",t.info.issues?.map((e=>(0,o.jsxs)("a",{href:`https://github.com/ahochsteger/gmail-processor/issues/${e}`,children:["#",e]},e))).join(", ")]}),(0,o.jsxs)("p",{children:["PRs: ",t.info.pullRequests?.map((e=>(0,o.jsxs)("a",{href:`https://github.com/ahochsteger/gmail-processor/pull/${e}`,children:["#",e]},e))).join(", ")]})]})}},2915:(e,t,a)=>{a.d(t,{zp:()=>s});const r={name:"migrationAdvanced",title:"Advanced Migration",description:"This Gmail2GDrive v1.x configuration example demonstrates the conversion to the Gmail Processor v2.x config format.",category:"migrations",generate:["docs","test-e2e","test-spec"],schemaVersion:"v1"},n={globalFilter:"has:attachment -in:trash -in:drafts -in:spam",processedLabel:"gmail2gdrive/client-test",sleepTime:100,maxRuntime:280,newerThan:"1d",timezone:"GMT",rules:[{filter:"to:my.name+scans@gmail.com",folder:"'Scans'-yyyy-MM-dd"},{filter:"from:example1@example.com",folder:"'Examples/example1'"},{filter:"from:example2@example.com",folder:"'Examples/example2'",filenameFromRegexp:".*.pdf$"},{filter:"(from:example3a@example.com OR from:example3b@example.com)",folder:"'Examples/example3ab'",filenameTo:"'file-'yyyy-MM-dd-'%s.txt'",archive:!0},{filter:"label:PDF",saveThreadPDF:!0,folder:"'PDF Emails'"},{filter:"from:example4@example.com",folder:"'Examples/example4'",filenameFrom:"file.txt",filenameTo:"'file-'yyyy-MM-dd-'%s.txt'"}]},s={info:r,config:n}}}]);