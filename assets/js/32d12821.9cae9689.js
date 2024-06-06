"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[5588],{494:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>u,default:()=>p,frontMatter:()=>c,metadata:()=>m,toc:()=>g});var r=t(4848),a=t(8453),i=t(5696);const s='{\n  "processedLabel": "gmail2gdrive/client-test",\n  "sleepTime": 100,\n  "maxRuntime": 280,\n  "newerThan": "2m",\n  "timezone": "GMT",\n  "rules": [\n    {\n      "filter": "to:my.name+scans@gmail.com",\n      "folder": "\'Scans\'-yyyy-MM-dd"\n    }\n  ]\n}\n',o='function migrationMinConvert() {\n  const oldConfig = {\n    processedLabel: "gmail2gdrive/client-test",\n    sleepTime: 100,\n    maxRuntime: 280,\n    newerThan: "2m",\n    timezone: "GMT",\n    rules: [\n      {\n        filter: "to:my.name+scans@gmail.com",\n        folder: "\'Scans\'-yyyy-MM-dd",\n      },\n    ],\n  }\n\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}\n';var l=t(7669);const c={id:"migrationMin",title:"Minimal Migration",description:"Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format."},u=void 0,m={id:"examples/migrations/migrationMin",title:"Minimal Migration",description:"Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",source:"@site/docs/examples/migrations/migrationMin.mdx",sourceDirName:"examples/migrations",slug:"/examples/migrations/migrationMin",permalink:"/gmail-processor/docs/examples/migrations/migrationMin",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/migrations/migrationMin.mdx",tags:[],version:"current",frontMatter:{id:"migrationMin",title:"Minimal Migration",description:"Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format."},sidebar:"docsSidebar",previous:{title:"Advanced Migration",permalink:"/gmail-processor/docs/examples/migrations/migrationAdvanced"},next:{title:"Regressions",permalink:"/gmail-processor/docs/examples/regressions/"}},d={},g=[];function f(e){const n={p:"p",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"This is a minimal Gmail2GDrive v1.x configuration example to demonstrate the conversion to the Gmail Processor v2.x config format."}),"\n",(0,r.jsx)(i.A,{info:l.pq,config:s,script:o})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(f,{...e})}):f(e)}},9365:(e,n,t)=>{t.r(n),t.d(n,{default:()=>s});t(6540);var r=t(4164);const a={tabItem:"tabItem_Ymn6"};var i=t(4848);function s(e){let{children:n,hidden:t,className:s}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,r.A)(a.tabItem,s),hidden:t,children:n})}},1470:(e,n,t)=>{t.r(n),t.d(n,{default:()=>I});var r=t(6540),a=t(4164),i=t(3104),s=t(6347),o=t(205),l=t(7485),c=t(1682),u=t(679);function m(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function d(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return m(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:a}}=e;return{value:n,label:t,attributes:r,default:a}}))}(t);return function(e){const n=(0,c.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function g(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:t}=e;const a=(0,s.W6)(),i=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(i),(0,r.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(a.location.search);n.set(i,e),a.replace({...a.location,search:n.toString()})}),[i,a])]}function p(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,i=d(e),[s,l]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!g({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:i}))),[c,m]=f({queryString:t,groupId:a}),[p,h]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,i]=(0,u.Dv)(t);return[a,(0,r.useCallback)((e=>{t&&i.set(e)}),[t,i])]}({groupId:a}),b=(()=>{const e=c??p;return g({value:e,tabValues:i})?e:null})();(0,o.A)((()=>{b&&l(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!g({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);l(e),m(e),h(e)}),[m,h,i]),tabValues:i}}var h=t(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=t(4848);function x(e){let{className:n,block:t,selectedValue:r,selectValue:s,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,i.a_)(),u=e=>{const n=e.currentTarget,t=l.indexOf(n),a=o[t].value;a!==r&&(c(n),s(a))},m=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":t},n),children:o.map((e=>{let{value:n,label:t,attributes:i}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>l.push(e),onKeyDown:m,onClick:u,...i,className:(0,a.A)("tabs__item",b.tabItem,i?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function y(e){let{lazy:n,children:t,selectedValue:a}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function M(e){const n=p(e);return(0,v.jsxs)("div",{className:(0,a.A)("tabs-container",b.tabList),children:[(0,v.jsx)(x,{...n,...e}),(0,v.jsx)(y,{...n,...e})]})}function I(e){const n=(0,h.A)();return(0,v.jsx)(M,{...e,children:m(e.children)},String(n))}},5696:(e,n,t)=>{t.d(n,{A:()=>g});var r=t(8774),a=t(1432),i=t(9365),s=t(1470),o=(t(6540),t(301)),l=t(4848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",u="https://github.com/ahochsteger/gmail-processor/issues",m="https://github.com/ahochsteger/gmail-processor/pull";function d(e,n,t){let r=[];return t&&t.length>0&&(r=[(0,l.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(t?.map(((e,t,r)=>(0,l.jsxs)("span",{children:[(0,l.jsxs)("a",{href:`${n}/${e}`,children:["#",e]}),t<r.length-1?" ":""]},e)))),r.push((0,l.jsx)("span",{}))),r}function g(e){let{info:n,config:t,script:g}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,l.jsx)(r.A,{href:`/playground?example=${n.name}`,children:"playground"}),n.variant===o.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,l.jsxs)(s.default,{children:[(0,l.jsx)(i.default,{value:"config",label:"Config",default:!0,children:(0,l.jsx)(a.default,{language:"js",showLineNumbers:!0,children:t})}),(0,l.jsx)(i.default,{value:"script",label:"Script",children:(0,l.jsx)(a.default,{language:"js",showLineNumbers:!0,children:g})})]}),(0,l.jsxs)("p",{children:[(0,l.jsxs)("span",{children:["Source: ",(0,l.jsxs)("a",{href:`${c}/${n.category}/${n.name}`,children:[n.name,".ts"]})]}),d("Issues",u,n.issues),d("PRs",m,n.pullRequests)]})]})}},301:(e,n,t)=>{t.d(n,{bk:()=>a,lI:()=>r,sE:()=>i});let r=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),a=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),i=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},7669:(e,n,t)=>{t.d(n,{Fw:()=>s,pq:()=>a});var r=t(301);const a={name:"migrationMin",title:"Minimal Migration",description:"Migrate a minimal Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",category:r.lI.MIGRATIONS,variant:r.sE.MIGRATION_V1},i={processedLabel:"gmail2gdrive/client-test",sleepTime:100,maxRuntime:280,newerThan:"2m",timezone:"GMT",rules:[{filter:"to:my.name+scans@gmail.com",folder:"'Scans'-yyyy-MM-dd"}]},s={info:a,migrationConfig:i}}}]);