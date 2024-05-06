"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[5588],{1386:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>f,frontMatter:()=>o,metadata:()=>u,toc:()=>m});var r=n(4848),a=n(8453),i=n(7669),s=n(5696);const o={id:"migrationMin",title:"Minimal Migration"},l=void 0,u={id:"examples/migrations/migrationMin",title:"Minimal Migration",description:"\x3c!--",source:"@site/docs/examples/migrations/migrationMin.mdx",sourceDirName:"examples/migrations",slug:"/examples/migrations/migrationMin",permalink:"/gmail-processor/docs/examples/migrations/migrationMin",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/migrations/migrationMin.mdx",tags:[],version:"current",frontMatter:{id:"migrationMin",title:"Minimal Migration"},sidebar:"docsSidebar",previous:{title:"Advanced Migration",permalink:"/gmail-processor/docs/examples/migrations/migrationAdvanced"},next:{title:"Reference",permalink:"/gmail-processor/docs/reference/"}},c={},m=[];function d(e){const t={p:"p",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format."}),"\n",(0,r.jsx)(s.A,{path:"src/examples/migrations/migrationMin.ts",example:i.JC})]})}function f(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},9365:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});n(6540);var r=n(4164);const a={tabItem:"tabItem_Ymn6"};var i=n(4848);function s(e){let{children:t,hidden:n,className:s}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,r.A)(a.tabItem,s),hidden:n,children:t})}},1470:(e,t,n)=>{n.r(t),n.d(t,{default:()=>w});var r=n(6540),a=n(4164),i=n(3104),s=n(6347),o=n(205),l=n(7485),u=n(1682),c=n(9466);function m(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function d(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return m(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}(n);return function(e){const t=(0,u.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function f(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function g(e){let{queryString:t=!1,groupId:n}=e;const a=(0,s.W6)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l.aZ)(i),(0,r.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(a.location.search);t.set(i,e),a.replace({...a.location,search:t.toString()})}),[i,a])]}function p(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,i=d(e),[s,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!f({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:i}))),[u,m]=g({queryString:n,groupId:a}),[p,h]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,i]=(0,c.Dv)(n);return[a,(0,r.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:a}),b=(()=>{const e=u??p;return f({value:e,tabValues:i})?e:null})();(0,o.A)((()=>{b&&l(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!f({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);l(e),m(e),h(e)}),[m,h,i]),tabValues:i}}var h=n(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=n(4848);function x(e){let{className:t,block:n,selectedValue:r,selectValue:s,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:u}=(0,i.a_)(),c=e=>{const t=e.currentTarget,n=l.indexOf(t),a=o[n].value;a!==r&&(u(t),s(a))},m=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:i}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:m,onClick:c,...i,className:(0,a.A)("tabs__item",b.tabItem,i?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function y(e){let{lazy:t,children:n,selectedValue:a}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function j(e){const t=p(e);return(0,v.jsxs)("div",{className:(0,a.A)("tabs-container",b.tabList),children:[(0,v.jsx)(x,{...t,...e}),(0,v.jsx)(y,{...t,...e})]})}function w(e){const t=(0,h.A)();return(0,v.jsx)(j,{...e,children:m(e.children)},String(t))}},5696:(e,t,n)=>{n.d(t,{A:()=>d});var r=n(8774),a=n(1432),i=n(9365),s=n(1470),o=(n(6540),n(4848));const l="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",u="https://github.com/ahochsteger/gmail-processor/issues",c="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,n){let r=[];return n&&n.length>0&&(r=[(0,o.jsxs)("span",{children:[" (",e,": "]},`${e}-0`)].concat(n?.map(((e,n,r)=>(0,o.jsxs)("span",{children:[(0,o.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),n<r.length-1?",":""]},e)))),r.push((0,o.jsx)("span",{children:")"}))),r}function d(e){let{example:t}=e;const n=t.info,d=`${t.info.category}/${t.info.name}.ts`,f=t.config,g=`${n.name}.ts`;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,o.jsx)(r.A,{href:`/playground?example=${n.name}`,children:"playground"}),"v1"===n.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,o.jsxs)(s.default,{children:[(0,o.jsx)(i.default,{value:"config",label:"Config",default:!0,children:(0,o.jsx)(a.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(f,null,2)})}),(0,o.jsx)(i.default,{value:"script",label:"Script",children:(0,o.jsx)(a.default,{language:"jsx",showLineNumbers:!0,children:"v1"===n.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(f,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,o.jsxs)("p",{children:["Source: ",(0,o.jsx)("a",{href:`${l}/${d}`,children:g}),m("Issues",u,t.info.issues),m("PRs",c,t.info.pullRequests)]})]})}},7669:(e,t,n)=>{n.d(t,{JC:()=>i});const r={name:"migrationMin",title:"Minimal Migration",description:"This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format.",category:"migrations",generate:["docs","test-e2e","test-spec"],schemaVersion:"v1"},a={processedLabel:"gmail2gdrive/client-test",sleepTime:100,maxRuntime:280,newerThan:"2m",timezone:"GMT",rules:[{filter:"to:my.name+scans@gmail.com",folder:"'Scans'-yyyy-MM-dd"}]},i={info:r,config:a}}}]);