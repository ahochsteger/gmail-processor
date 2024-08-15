"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[1338],{313:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>u,default:()=>f,frontMatter:()=>l,metadata:()=>d,toc:()=>h});var n=a(4848),s=a(8453),r=a(5696);const o='{\n  "description": "Define custom logic as actions that can be executed during processing.",\n  "settings": {\n    "markProcessedMethod": "mark-read"\n  },\n  "global": {\n    "thread": {\n      "match": {\n        "query": "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:\\"[GmailProcessor-Test] customActions\\""\n      }\n    }\n  },\n  "threads": [\n    {\n      "match": {\n        "query": "from:${user.email}"\n      },\n      "messages": [\n        {\n          "actions": [\n            {\n              "name": "custom.mylog",\n              "args": {\n                "arg1": "value1",\n                "arg2": "value2"\n              }\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n',i='function customActionsRun() {\n  const config = {\n    description:\n      "Define custom logic as actions that can be executed during processing.",\n    settings: {\n      markProcessedMethod: "mark-read",\n    },\n    global: {\n      thread: {\n        match: {\n          query:\n            \'has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] customActions"\',\n        },\n      },\n    },\n    threads: [\n      {\n        match: {\n          query: "from:${user.email}",\n        },\n        messages: [\n          {\n            actions: [\n              {\n                name: "custom.mylog",\n                args: {\n                  arg1: "value1",\n                  arg2: "value2",\n                },\n              },\n            ],\n          },\n        ],\n      },\n    ],\n  }\n\n  const customActions = [\n    {\n      name: "mylog",\n      action: (ctx, args) =>\n        ctx.log.info(`Called with args \'${JSON.stringify(args)}\' ...`),\n    },\n  ]\n  return GmailProcessorLib.run(config, "dry-run", customActions)\n}\n';var c=a(2492);const l={id:"customActions",title:"Custom Actions",description:"Define custom logic as actions that can be executed during processing."},u=void 0,d={id:"examples/advanced/customActions",title:"Custom Actions",description:"Define custom logic as actions that can be executed during processing.",source:"@site/docs/examples/advanced/customActions.mdx",sourceDirName:"examples/advanced",slug:"/examples/advanced/customActions",permalink:"/gmail-processor/docs/examples/advanced/customActions",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/advanced/customActions.mdx",tags:[],version:"current",frontMatter:{id:"customActions",title:"Custom Actions",description:"Define custom logic as actions that can be executed during processing."},sidebar:"docsSidebar",previous:{title:"Advanced",permalink:"/gmail-processor/docs/examples/advanced/"},next:{title:"LogSheet Logging",permalink:"/gmail-processor/docs/examples/advanced/logSheetLogging"}},m={},h=[];function g(e){const t={p:"p",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"This is an example to demonstrate custom actions."}),"\n",(0,n.jsx)(r.A,{info:c.pq,config:o,script:i})]})}function f(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},9365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});a(6540);var n=a(4164);const s={tabItem:"tabItem_Ymn6"};var r=a(4848);function o(e){let{children:t,hidden:a,className:o}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,n.A)(s.tabItem,o),hidden:a,children:t})}},1470:(e,t,a)=>{a.r(t),a.d(t,{default:()=>S});var n=a(6540),s=a(4164),r=a(3104),o=a(6347),i=a(205),c=a(7485),l=a(1682),u=a(679);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:s}}=e;return{value:t,label:a,attributes:n,default:s}}))}(a);return function(e){const t=(0,l.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function h(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function g(e){let{queryString:t=!1,groupId:a}=e;const s=(0,o.W6)(),r=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,c.aZ)(r),(0,n.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(s.location.search);t.set(r,e),s.replace({...s.location,search:t.toString()})}),[r,s])]}function f(e){const{defaultValue:t,queryString:a=!1,groupId:s}=e,r=m(e),[o,c]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:r}))),[l,d]=g({queryString:a,groupId:s}),[f,p]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,r]=(0,u.Dv)(a);return[s,(0,n.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:s}),b=(()=>{const e=l??f;return h({value:e,tabValues:r})?e:null})();(0,i.A)((()=>{b&&c(b)}),[b]);return{selectedValue:o,selectValue:(0,n.useCallback)((e=>{if(!h({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),d(e),p(e)}),[d,p,r]),tabValues:r}}var p=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=a(4848);function A(e){let{className:t,block:a,selectedValue:n,selectValue:o,tabValues:i}=e;const c=[],{blockElementScrollPositionUntilNextRender:l}=(0,r.a_)(),u=e=>{const t=e.currentTarget,a=c.indexOf(t),s=i[a].value;s!==n&&(l(t),o(s))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const a=c.indexOf(e.currentTarget)+1;t=c[a]??c[0];break}case"ArrowLeft":{const a=c.indexOf(e.currentTarget)-1;t=c[a]??c[c.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":a},t),children:i.map((e=>{let{value:t,label:a,attributes:r}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:n===t?0:-1,"aria-selected":n===t,ref:e=>c.push(e),onKeyDown:d,onClick:u,...r,className:(0,s.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":n===t}),children:a??t},t)}))})}function y(e){let{lazy:t,children:a,selectedValue:r}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:(0,s.A)("margin-top--md",e.props.className)}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function x(e){const t=f(e);return(0,v.jsxs)("div",{className:(0,s.A)("tabs-container",b.tabList),children:[(0,v.jsx)(A,{...t,...e}),(0,v.jsx)(y,{...t,...e})]})}function S(e){const t=(0,p.A)();return(0,v.jsx)(x,{...e,children:d(e.children)},String(t))}},5696:(e,t,a)=>{a.d(t,{A:()=>h});var n=a(8774),s=a(1432),r=a(9365),o=a(1470),i=(a(6540),a(301)),c=a(4848);const l="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",u="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,a){let n=[];return a&&a.length>0&&(n=[(0,c.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(a?.map(((e,a,n)=>(0,c.jsxs)("span",{children:[(0,c.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<n.length-1?" ":""]},e)))),n.push((0,c.jsx)("span",{}))),n}function h(e){let{info:t,config:a,script:h}=e;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,c.jsx)(n.A,{href:`/playground?example=${t.name}`,children:"playground"}),t.variant===i.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,c.jsxs)(o.default,{children:[(0,c.jsx)(r.default,{value:"config",label:"Config",default:!0,children:(0,c.jsx)(s.default,{language:"js",showLineNumbers:!0,children:a})}),(0,c.jsx)(r.default,{value:"script",label:"Script",children:(0,c.jsx)(s.default,{language:"js",showLineNumbers:!0,children:h})})]}),(0,c.jsxs)("p",{children:[(0,c.jsxs)("span",{children:["Source: ",(0,c.jsxs)("a",{href:`${l}/${t.category}/${t.name}`,children:[t.name,".ts"]})]}),m("Issues",u,t.issues),m("PRs",d,t.pullRequests)]})]})}},301:(e,t,a)=>{a.d(t,{bk:()=>s,lI:()=>n,sE:()=>r});let n=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),s=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),r=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},2492:(e,t,a)=>{a.d(t,{Fw:()=>c,pq:()=>o});a(2744);var n=a(6407),s=a(301),r=a(7694);const o={name:"customActions",title:"Custom Actions",description:"Define custom logic as actions that can be executed during processing.",category:s.lI.ADVANCED,variant:s.sE.CUSTOM_ACTIONS},i={description:o.description,settings:{markProcessedMethod:n.Pn.MARK_MESSAGE_READ},global:{thread:{match:{query:`has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} is:unread subject:"${r.L.EMAIL_SUBJECT_PREFIX}${o.name}"`}}},threads:[{match:{query:"from:${user.email}"},messages:[{actions:[{name:"custom.mylog",args:{arg1:"value1",arg2:"value2"}}]}]}]},c={info:o,config:i,customActions:[{name:"mylog",action:(e,t)=>e.log.info(`Called with args '${JSON.stringify(t)}' ...`)}]}},2744:(e,t,a)=>{a.d(t,{Ah:()=>s,GS:()=>o,KI:()=>r,jV:()=>n});let n=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),s=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function r(e,t,a,n,s){return{deprecationInfo:s,description:n,title:a,type:e,value:t}}let o=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},6407:(e,t,a)=>{a.d(t,{$b:()=>l,GJ:()=>h,Pn:()=>u,c1:()=>f,we:()=>g});var n=a(4729),s=a(4467),r=a(8420),o=a(5136),i=a(5698),c=(a(5508),a(7158));let l=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({}),u=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class d{constructor(){(0,s.A)(this,"name",""),(0,s.A)(this,"title",""),(0,s.A)(this,"value",void 0),(0,s.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),h=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,r.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,r.v)(),(0,o.Z)((()=>d))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>l.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,r.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,r.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedMethod",value:()=>u.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"timezone",value:()=>"default"}]}}));function g(e){return void 0===e&&(e={}),(0,i.bj)(h,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function f(e){return e=(0,c.I)(e,g(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>s});var n=a(4467);class s{}(0,n.A)(s,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,n.A)(s,"EMAIL_SLEEP_TIME_MS",1e4),(0,n.A)(s,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,n.A)(s,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,n.A)(s,"GIT_REPO_BRANCH","main"),(0,n.A)(s,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function n(e,t,a,n){return void 0===a&&(a={}),void 0===n&&(n=[]),n=n.concat([]),Object.keys(e).forEach((s=>{const r=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[s],a[s]),o=JSON.stringify(r);n.includes(s)||null!==r&&o!==JSON.stringify(t[s])&&"[]"!==o&&"{}"!==o||delete e[s]})),e}a.d(t,{I:()=>n})}}]);