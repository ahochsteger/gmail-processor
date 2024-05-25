"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[5954],{8971:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>d,default:()=>p,frontMatter:()=>c,metadata:()=>u,toc:()=>h});var n=a(4848),r=a(8453),s=a(5696);const o='{\n  "description": "The action `thread.removeLabel` removes a label from a thread.",\n  "global": {\n    "thread": {\n      "match": {\n        "query": "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionThreadRemoveLabel\'"\n      }\n    }\n  },\n  "settings": {\n    "markProcessedMethod": "custom"\n  },\n  "threads": [\n    {\n      "match": {\n        "query": "subject:([GmailProcessor-Test] actionThreadRemoveLabel)"\n      },\n      "actions": [\n        {\n          "name": "thread.addLabel",\n          "processingStage": "pre-main",\n          "args": {\n            "name": "accounting-process"\n          }\n        },\n        {\n          "name": "thread.markRead",\n          "processingStage": "post-main"\n        },\n        {\n          "name": "thread.removeLabel",\n          "processingStage": "post-main",\n          "args": {\n            "name": "accounting-process"\n          }\n        },\n        {\n          "name": "thread.addLabel",\n          "processingStage": "post-main",\n          "args": {\n            "name": "accounting-autoinvoice"\n          }\n        }\n      ]\n    }\n  ]\n}\n',l='function actionThreadRemoveLabelRun() {\n  const config = {\n    description:\n      "The action `thread.removeLabel` removes a label from a thread.",\n    global: {\n      thread: {\n        match: {\n          query:\n            "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionThreadRemoveLabel\'",\n        },\n      },\n    },\n    settings: {\n      markProcessedMethod: "custom",\n    },\n    threads: [\n      {\n        match: {\n          query: "subject:([GmailProcessor-Test] actionThreadRemoveLabel)",\n        },\n        actions: [\n          {\n            name: "thread.addLabel",\n            processingStage: "pre-main",\n            args: {\n              name: "accounting-process",\n            },\n          },\n          {\n            name: "thread.markRead",\n            processingStage: "post-main",\n          },\n          {\n            name: "thread.removeLabel",\n            processingStage: "post-main",\n            args: {\n              name: "accounting-process",\n            },\n          },\n          {\n            name: "thread.addLabel",\n            processingStage: "post-main",\n            args: {\n              name: "accounting-autoinvoice",\n            },\n          },\n        ],\n      },\n    ],\n  }\n\n  GmailProcessorLib.run(config, "dry-run")\n}\n';var i=a(2671);const c={id:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread."},d=void 0,u={id:"examples/actions/actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread.",source:"@site/docs/examples/actions/actionThreadRemoveLabel.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionThreadRemoveLabel",permalink:"/gmail-processor/docs/examples/actions/actionThreadRemoveLabel",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionThreadRemoveLabel.mdx",tags:[],version:"current",frontMatter:{id:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread."},sidebar:"docsSidebar",previous:{title:"Export Thread/Message",permalink:"/gmail-processor/docs/examples/actions/actionExport"},next:{title:"Advanced",permalink:"/gmail-processor/docs/examples/advanced/"}},m={},h=[];function g(e){const t={code:"code",p:"p",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.p,{children:["This example demonstrates the usage of the action ",(0,n.jsx)(t.code,{children:"thread.removeLabel"}),".\nIt is also used to test a possible behavioral change for certain characters in label names (e.g. ",(0,n.jsx)(t.code,{children:"-"})," vs. ",(0,n.jsx)(t.code,{children:"/"}),")."]}),"\n",(0,n.jsx)(s.A,{info:i.pq,config:o,script:l})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},9365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});a(6540);var n=a(4164);const r={tabItem:"tabItem_Ymn6"};var s=a(4848);function o(e){let{children:t,hidden:a,className:o}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,n.A)(r.tabItem,o),hidden:a,children:t})}},1470:(e,t,a)=>{a.r(t),a.d(t,{default:()=>A});var n=a(6540),r=a(4164),s=a(3104),o=a(6347),l=a(205),i=a(7485),c=a(1682),d=a(9466);function u(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}(a);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function h(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function g(e){let{queryString:t=!1,groupId:a}=e;const r=(0,o.W6)(),s=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,i.aZ)(s),(0,n.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(r.location.search);t.set(s,e),r.replace({...r.location,search:t.toString()})}),[s,r])]}function p(e){const{defaultValue:t,queryString:a=!1,groupId:r}=e,s=m(e),[o,i]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:s}))),[c,u]=g({queryString:a,groupId:r}),[p,f]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,s]=(0,d.Dv)(a);return[r,(0,n.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:r}),b=(()=>{const e=c??p;return h({value:e,tabValues:s})?e:null})();(0,l.A)((()=>{b&&i(b)}),[b]);return{selectedValue:o,selectValue:(0,n.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),f(e)}),[u,f,s]),tabValues:s}}var f=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=a(4848);function T(e){let{className:t,block:a,selectedValue:n,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.a_)(),d=e=>{const t=e.currentTarget,a=i.indexOf(t),r=l[a].value;r!==n&&(c(t),o(r))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;t=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;t=i[a]??i[i.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":a},t),children:l.map((e=>{let{value:t,label:a,attributes:s}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:n===t?0:-1,"aria-selected":n===t,ref:e=>i.push(e),onKeyDown:u,onClick:d,...s,className:(0,r.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":n===t}),children:a??t},t)}))})}function y(e){let{lazy:t,children:a,selectedValue:r}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function S(e){const t=p(e);return(0,v.jsxs)("div",{className:(0,r.A)("tabs-container",b.tabList),children:[(0,v.jsx)(T,{...t,...e}),(0,v.jsx)(y,{...t,...e})]})}function A(e){const t=(0,f.A)();return(0,v.jsx)(S,{...e,children:u(e.children)},String(t))}},5696:(e,t,a)=>{a.d(t,{A:()=>h});var n=a(8774),r=a(1432),s=a(9365),o=a(1470),l=(a(6540),a(301)),i=a(4848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",d="https://github.com/ahochsteger/gmail-processor/issues",u="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,a){let n=[];return a&&a.length>0&&(n=[(0,i.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(a?.map(((e,a,n)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<n.length-1?" ":""]},e)))),n.push((0,i.jsx)("span",{}))),n}function h(e){let{info:t,config:a,script:h}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(n.A,{href:`/playground?example=${t.name}`,children:"playground"}),t.variant===l.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(o.default,{children:[(0,i.jsx)(s.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:a})}),(0,i.jsx)(s.default,{value:"script",label:"Script",children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:h})})]}),(0,i.jsxs)("p",{children:[(0,i.jsxs)("span",{children:["Source: ",(0,i.jsxs)("a",{href:`${c}/${t.category}/${t.name}`,children:[t.name,".ts"]})]}),m("Issues",d,t.issues),m("PRs",u,t.pullRequests)]})]})}},301:(e,t,a)=>{a.d(t,{bk:()=>r,lI:()=>n,sE:()=>s});let n=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),r=function(e){return e.CONFIG="config",e.GAS_CODE="gas-code",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.TEST_E2E="test-e2e",e.TEST_SPEC="test-spec",e}({}),s=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},2671:(e,t,a)=>{a.d(t,{Fw:()=>c,pq:()=>l});var n=a(7694),r=a(301),s=(a(2744),a(4460)),o=a(6407);const l={name:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread.",category:r.lI.ACTIONS,issues:[303]},i={description:l.description,global:{thread:{match:{query:`from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${n.L.EMAIL_SUBJECT_PREFIX}${l.name}'`}}},settings:{markProcessedMethod:o.Pn.CUSTOM},threads:[{match:{query:`subject:([GmailProcessor-Test] ${l.name})`},actions:[{name:"thread.addLabel",processingStage:s.Sg.PRE_MAIN,args:{name:"accounting-process"}},{name:"thread.markRead",processingStage:s.Sg.POST_MAIN},{name:"thread.removeLabel",processingStage:s.Sg.POST_MAIN,args:{name:"accounting-process"}},{name:"thread.addLabel",processingStage:s.Sg.POST_MAIN,args:{name:"accounting-autoinvoice"}}]}]},c={info:l,config:i}},2744:(e,t,a)=>{a.d(t,{Ah:()=>r,GS:()=>o,KI:()=>s,jV:()=>n});let n=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),r=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function s(e,t,a,n,r){return{deprecationInfo:r,description:n,title:a,type:e,value:t}}let o=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},4460:(e,t,a)=>{a.d(t,{Sg:()=>l,ej:()=>h,jG:()=>m,kj:()=>d,mt:()=>g,v1:()=>c,wf:()=>u});var n=a(4729),r=a(8420),s=a(5698),o=(a(5508),a(7158));let l=function(e){return e.PRE_MAIN="pre-main",e.MAIN="main",e.POST_MAIN="post-main",e}({}),i=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",decorators:[(0,r.v)()],key:"args",value:void 0},{kind:"field",decorators:[(0,r.v)()],key:"description",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"name",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"processingStage",value:()=>l.POST_MAIN}]}}));class c extends i{}class d extends i{}class u extends i{}function m(e){var t;return e=(0,o.I)(e,(t={name:"thread.noop"},(0,s.bj)(c,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function h(e){var t;return e=(0,o.I)(e,(t={name:"message.noop"},(0,s.bj)(d,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function g(e){var t;return e=(0,o.I)(e,(t={name:"attachment.noop"},(0,s.bj)(u,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}},6407:(e,t,a)=>{a.d(t,{GJ:()=>h,Pn:()=>d,c1:()=>p,we:()=>g});var n=a(4729),r=a(4467),s=a(8420),o=a(5136),l=a(5698),i=(a(5508),a(7158)),c=a(9361);let d=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class u{constructor(){(0,r.A)(this,"name",""),(0,r.A)(this,"title",""),(0,r.A)(this,"value",void 0),(0,r.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),h=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,s.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,s.v)(),(0,o.Z)((()=>u))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.$.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,s.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,s.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedMethod",value:()=>d.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"timezone",value:()=>"default"}]}}));function g(e){return void 0===e&&(e={}),(0,l.bj)(h,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function p(e){return e=(0,i.I)(e,g(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>r});var n=a(4467);class r{}(0,n.A)(r,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,n.A)(r,"EMAIL_SLEEP_TIME_MS",1e4),(0,n.A)(r,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,n.A)(r,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,n.A)(r,"GIT_REPO_BRANCH","main"),(0,n.A)(r,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function n(e,t,a,n){return void 0===a&&(a={}),void 0===n&&(n=[]),n=n.concat([]),Object.keys(e).forEach((r=>{const s=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[r],a[r]),o=JSON.stringify(s);n.includes(r)||null!==s&&o!==JSON.stringify(t[r])&&"[]"!==o&&"{}"!==o||delete e[r]})),e}a.d(t,{I:()=>n})},9361:(e,t,a)=>{a.d(t,{$:()=>n});a(6407);let n=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({});Object.values(n)}}]);