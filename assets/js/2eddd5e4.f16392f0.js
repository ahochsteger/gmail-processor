"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[9046],{65628:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>d,contentTitle:()=>u,default:()=>g,frontMatter:()=>m,metadata:()=>t,toc:()=>f});const t=JSON.parse('{"id":"examples/migrations/migrationAdvanced","title":"Advanced Migration","description":"Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.","source":"@site/docs/examples/migrations/migrationAdvanced.mdx","sourceDirName":"examples/migrations","slug":"/examples/migrations/migrationAdvanced","permalink":"/gmail-processor/docs/examples/migrations/migrationAdvanced","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/migrations/migrationAdvanced.mdx","tags":[],"version":"current","frontMatter":{"id":"migrationAdvanced","title":"Advanced Migration","description":"Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format."},"sidebar":"docsSidebar","previous":{"title":"GMail2GDrive Migration","permalink":"/gmail-processor/docs/examples/migrations/"},"next":{"title":"Minimal Migration","permalink":"/gmail-processor/docs/examples/migrations/migrationMin"}}');var r=n(74848),l=n(28453),i=n(25696);const o='{\n  "globalFilter": "has:attachment -in:trash -in:drafts -in:spam",\n  "processedLabel": "gmail2gdrive/client-test",\n  "sleepTime": 100,\n  "maxRuntime": 280,\n  "newerThan": "1d",\n  "timezone": "GMT",\n  "rules": [\n    {\n      "filter": "to:my.name+scans@gmail.com",\n      "folder": "\'Scans\'-yyyy-MM-dd"\n    },\n    {\n      "filter": "from:example1@example.com",\n      "folder": "\'Examples/example1\'"\n    },\n    {\n      "filter": "from:example2@example.com",\n      "folder": "\'Examples/example2\'",\n      "filenameFromRegexp": ".*.pdf$"\n    },\n    {\n      "filter": "(from:example3a@example.com OR from:example3b@example.com)",\n      "folder": "\'Examples/example3ab\'",\n      "filenameTo": "\'file-\'yyyy-MM-dd-\'%s.txt\'",\n      "archive": true\n    },\n    {\n      "filter": "label:PDF",\n      "saveThreadPDF": true,\n      "folder": "\'PDF Emails\'"\n    },\n    {\n      "filter": "from:example4@example.com",\n      "folder": "\'Examples/example4\'",\n      "filenameFrom": "file.txt",\n      "filenameTo": "\'file-\'yyyy-MM-dd-\'%s.txt\'"\n    }\n  ]\n}\n',s='function migrationAdvancedConvert() {\n  const oldConfig = {\n    globalFilter: "has:attachment -in:trash -in:drafts -in:spam",\n    processedLabel: "gmail2gdrive/client-test",\n    sleepTime: 100,\n    maxRuntime: 280,\n    newerThan: "1d",\n    timezone: "GMT",\n    rules: [\n      {\n        filter: "to:my.name+scans@gmail.com",\n        folder: "\'Scans\'-yyyy-MM-dd",\n      },\n      {\n        filter: "from:example1@example.com",\n        folder: "\'Examples/example1\'",\n      },\n      {\n        filter: "from:example2@example.com",\n        folder: "\'Examples/example2\'",\n        filenameFromRegexp: ".*.pdf$",\n      },\n      {\n        filter: "(from:example3a@example.com OR from:example3b@example.com)",\n        folder: "\'Examples/example3ab\'",\n        filenameTo: "\'file-\'yyyy-MM-dd-\'%s.txt\'",\n        archive: true,\n      },\n      {\n        filter: "label:PDF",\n        saveThreadPDF: true,\n        folder: "\'PDF Emails\'",\n      },\n      {\n        filter: "from:example4@example.com",\n        folder: "\'Examples/example4\'",\n        filenameFrom: "file.txt",\n        filenameTo: "\'file-\'yyyy-MM-dd-\'%s.txt\'",\n      },\n    ],\n  }\n\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n  return migratedConfig\n}\n';var c=n(42915);const m={id:"migrationAdvanced",title:"Advanced Migration",description:"Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format."},u=void 0,d={},f=[];function p(e){const a={p:"p",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.p,{children:"This Gmail2GDrive v1.x configuration example demonstrates the conversion to the Gmail Processor v2.x config format."}),"\n",(0,r.jsx)(i.A,{info:c.pq,config:o,script:s})]})}function g(e={}){const{wrapper:a}={...(0,l.R)(),...e.components};return a?(0,r.jsx)(a,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},19365:(e,a,n)=>{n.r(a),n.d(a,{default:()=>i});n(96540);var t=n(34164);const r={tabItem:"tabItem_Ymn6"};var l=n(74848);function i(e){let{children:a,hidden:n,className:i}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,t.A)(r.tabItem,i),hidden:n,children:a})}},11470:(e,a,n)=>{n.r(a),n.d(a,{default:()=>M});var t=n(96540),r=n(34164),l=n(23104),i=n(56347),o=n(205),s=n(57485),c=n(31682),m=n(70679);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:a}=e;return!!a&&"object"==typeof a&&"value"in a}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function d(e){const{values:a,children:n}=e;return(0,t.useMemo)((()=>{const e=a??function(e){return u(e).map((e=>{let{props:{value:a,label:n,attributes:t,default:r}}=e;return{value:a,label:n,attributes:t,default:r}}))}(n);return function(e){const a=(0,c.XI)(e,((e,a)=>e.value===a.value));if(a.length>0)throw new Error(`Docusaurus error: Duplicate values "${a.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[a,n])}function f(e){let{value:a,tabValues:n}=e;return n.some((e=>e.value===a))}function p(e){let{queryString:a=!1,groupId:n}=e;const r=(0,i.W6)(),l=function(e){let{queryString:a=!1,groupId:n}=e;if("string"==typeof a)return a;if(!1===a)return null;if(!0===a&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:a,groupId:n});return[(0,s.aZ)(l),(0,t.useCallback)((e=>{if(!l)return;const a=new URLSearchParams(r.location.search);a.set(l,e),r.replace({...r.location,search:a.toString()})}),[l,r])]}function g(e){const{defaultValue:a,queryString:n=!1,groupId:r}=e,l=d(e),[i,s]=(0,t.useState)((()=>function(e){let{defaultValue:a,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(a){if(!f({value:a,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${a}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return a}const t=n.find((e=>e.default))??n[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:a,tabValues:l}))),[c,u]=p({queryString:n,groupId:r}),[g,x]=function(e){let{groupId:a}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(a),[r,l]=(0,m.Dv)(n);return[r,(0,t.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:r}),h=(()=>{const e=c??g;return f({value:e,tabValues:l})?e:null})();(0,o.A)((()=>{h&&s(h)}),[h]);return{selectedValue:i,selectValue:(0,t.useCallback)((e=>{if(!f({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);s(e),u(e),x(e)}),[u,x,l]),tabValues:l}}var x=n(92303);const h={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=n(74848);function b(e){let{className:a,block:n,selectedValue:t,selectValue:i,tabValues:o}=e;const s=[],{blockElementScrollPositionUntilNextRender:c}=(0,l.a_)(),m=e=>{const a=e.currentTarget,n=s.indexOf(a),r=o[n].value;r!==t&&(c(a),i(r))},u=e=>{let a=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":{const n=s.indexOf(e.currentTarget)+1;a=s[n]??s[0];break}case"ArrowLeft":{const n=s.indexOf(e.currentTarget)-1;a=s[n]??s[s.length-1];break}}a?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":n},a),children:o.map((e=>{let{value:a,label:n,attributes:l}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:t===a?0:-1,"aria-selected":t===a,ref:e=>s.push(e),onKeyDown:u,onClick:m,...l,className:(0,r.A)("tabs__item",h.tabItem,l?.className,{"tabs__item--active":t===a}),children:n??a},a)}))})}function y(e){let{lazy:a,children:n,selectedValue:l}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(a){const e=i.find((e=>e.props.value===l));return e?(0,t.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:i.map(((e,a)=>(0,t.cloneElement)(e,{key:a,hidden:e.props.value!==l})))})}function T(e){const a=g(e);return(0,v.jsxs)("div",{className:(0,r.A)("tabs-container",h.tabList),children:[(0,v.jsx)(b,{...a,...e}),(0,v.jsx)(y,{...a,...e})]})}function M(e){const a=(0,x.A)();return(0,v.jsx)(T,{...e,children:u(e.children)},String(a))}},25696:(e,a,n)=>{n.d(a,{A:()=>f});var t=n(28774),r=n(21432),l=n(19365),i=n(11470),o=(n(96540),n(20301)),s=n(74848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",m="https://github.com/ahochsteger/gmail-processor/issues",u="https://github.com/ahochsteger/gmail-processor/pull";function d(e,a,n){let t=[];return n&&n.length>0&&(t=[(0,s.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(n?.map(((e,n,t)=>(0,s.jsxs)("span",{children:[(0,s.jsxs)("a",{href:`${a}/${e}`,children:["#",e]}),n<t.length-1?" ":""]},e)))),t.push((0,s.jsx)("span",{}))),t}function f(e){let{info:a,config:n,script:f}=e;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,s.jsx)(t.A,{href:`/playground?example=${a.name}`,children:"playground"}),a.variant===o.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,s.jsxs)(i.default,{children:[(0,s.jsx)(l.default,{value:"config",label:"Config",default:!0,children:(0,s.jsx)(r.default,{language:"js",showLineNumbers:!0,children:n})}),(0,s.jsx)(l.default,{value:"script",label:"Script",children:(0,s.jsx)(r.default,{language:"js",showLineNumbers:!0,children:f})})]}),(0,s.jsxs)("p",{children:[(0,s.jsxs)("span",{children:["Source: ",(0,s.jsxs)("a",{href:`${c}/${a.category}/${a.name}`,children:[a.name,".ts"]})]}),d("Issues",m,a.issues),d("PRs",u,a.pullRequests)]})]})}},20301:(e,a,n)=>{n.d(a,{bk:()=>r,lI:()=>t,sE:()=>l});let t=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),r=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),l=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},42915:(e,a,n)=>{n.d(a,{Fw:()=>i,pq:()=>r});var t=n(20301);const r={name:"migrationAdvanced",title:"Advanced Migration",description:"Migrate a complex Gmail2GDrive v1.x configuration to the new Gmail Processor v2.x config format.",category:t.lI.MIGRATIONS,variant:t.sE.MIGRATION_V1},l={globalFilter:"has:attachment -in:trash -in:drafts -in:spam",processedLabel:"gmail2gdrive/client-test",sleepTime:100,maxRuntime:280,newerThan:"1d",timezone:"GMT",rules:[{filter:"to:my.name+scans@gmail.com",folder:"'Scans'-yyyy-MM-dd"},{filter:"from:example1@example.com",folder:"'Examples/example1'"},{filter:"from:example2@example.com",folder:"'Examples/example2'",filenameFromRegexp:".*.pdf$"},{filter:"(from:example3a@example.com OR from:example3b@example.com)",folder:"'Examples/example3ab'",filenameTo:"'file-'yyyy-MM-dd-'%s.txt'",archive:!0},{filter:"label:PDF",saveThreadPDF:!0,folder:"'PDF Emails'"},{filter:"from:example4@example.com",folder:"'Examples/example4'",filenameFrom:"file.txt",filenameTo:"'file-'yyyy-MM-dd-'%s.txt'"}]},i={info:r,migrationConfig:l}}}]);