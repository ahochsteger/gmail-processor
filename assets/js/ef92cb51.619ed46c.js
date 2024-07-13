"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[5954],{5455:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>m,contentTitle:()=>u,default:()=>p,frontMatter:()=>c,metadata:()=>d,toc:()=>h});var n=t(4848),r=t(8453),s=t(5696);const o='{\n  "description": "The action `thread.removeLabel` removes a label from a thread.",\n  "global": {\n    "thread": {\n      "match": {\n        "query": "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionThreadRemoveLabel\'"\n      }\n    }\n  },\n  "settings": {\n    "markProcessedMethod": "custom"\n  },\n  "threads": [\n    {\n      "match": {\n        "query": "subject:([GmailProcessor-Test] actionThreadRemoveLabel)"\n      },\n      "actions": [\n        {\n          "name": "thread.addLabel",\n          "processingStage": "pre-main",\n          "args": {\n            "name": "accounting-process"\n          }\n        },\n        {\n          "name": "thread.markRead",\n          "processingStage": "post-main"\n        },\n        {\n          "name": "thread.removeLabel",\n          "processingStage": "post-main",\n          "args": {\n            "name": "accounting-process"\n          }\n        },\n        {\n          "name": "thread.addLabel",\n          "processingStage": "post-main",\n          "args": {\n            "name": "accounting-autoinvoice"\n          }\n        }\n      ]\n    }\n  ]\n}\n',l='function actionThreadRemoveLabelRun() {\n  const config = {\n    description:\n      "The action `thread.removeLabel` removes a label from a thread.",\n    global: {\n      thread: {\n        match: {\n          query:\n            "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionThreadRemoveLabel\'",\n        },\n      },\n    },\n    settings: {\n      markProcessedMethod: "custom",\n    },\n    threads: [\n      {\n        match: {\n          query: "subject:([GmailProcessor-Test] actionThreadRemoveLabel)",\n        },\n        actions: [\n          {\n            name: "thread.addLabel",\n            processingStage: "pre-main",\n            args: {\n              name: "accounting-process",\n            },\n          },\n          {\n            name: "thread.markRead",\n            processingStage: "post-main",\n          },\n          {\n            name: "thread.removeLabel",\n            processingStage: "post-main",\n            args: {\n              name: "accounting-process",\n            },\n          },\n          {\n            name: "thread.addLabel",\n            processingStage: "post-main",\n            args: {\n              name: "accounting-autoinvoice",\n            },\n          },\n        ],\n      },\n    ],\n  }\n\n  return GmailProcessorLib.run(config, "dry-run")\n}\n';var i=t(2671);const c={id:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread."},u=void 0,d={id:"examples/actions/actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread.",source:"@site/docs/examples/actions/actionThreadRemoveLabel.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionThreadRemoveLabel",permalink:"/gmail-processor/docs/examples/actions/actionThreadRemoveLabel",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionThreadRemoveLabel.mdx",tags:[],version:"current",frontMatter:{id:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread."},sidebar:"docsSidebar",previous:{title:"Export Thread/Message",permalink:"/gmail-processor/docs/examples/actions/actionExport"},next:{title:"Advanced",permalink:"/gmail-processor/docs/examples/advanced/"}},m={},h=[];function g(e){const a={code:"code",p:"p",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(a.p,{children:["This example demonstrates the usage of the action ",(0,n.jsx)(a.code,{children:"thread.removeLabel"}),".\nIt is also used to test a possible behavioral change for certain characters in label names (e.g. ",(0,n.jsx)(a.code,{children:"-"})," vs. ",(0,n.jsx)(a.code,{children:"/"}),")."]}),"\n",(0,n.jsx)(s.A,{info:i.pq,config:o,script:l})]})}function p(e={}){const{wrapper:a}={...(0,r.R)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},9365:(e,a,t)=>{t.r(a),t.d(a,{default:()=>o});t(6540);var n=t(4164);const r={tabItem:"tabItem_Ymn6"};var s=t(4848);function o(e){let{children:a,hidden:t,className:o}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,n.A)(r.tabItem,o),hidden:t,children:a})}},1470:(e,a,t)=>{t.r(a),t.d(a,{default:()=>A});var n=t(6540),r=t(4164),s=t(3104),o=t(6347),l=t(205),i=t(7485),c=t(1682),u=t(679);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:a}=e;return!!a&&"object"==typeof a&&"value"in a}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:a,children:t}=e;return(0,n.useMemo)((()=>{const e=a??function(e){return d(e).map((e=>{let{props:{value:a,label:t,attributes:n,default:r}}=e;return{value:a,label:t,attributes:n,default:r}}))}(t);return function(e){const a=(0,c.X)(e,((e,a)=>e.value===a.value));if(a.length>0)throw new Error(`Docusaurus error: Duplicate values "${a.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[a,t])}function h(e){let{value:a,tabValues:t}=e;return t.some((e=>e.value===a))}function g(e){let{queryString:a=!1,groupId:t}=e;const r=(0,o.W6)(),s=function(e){let{queryString:a=!1,groupId:t}=e;if("string"==typeof a)return a;if(!1===a)return null;if(!0===a&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:a,groupId:t});return[(0,i.aZ)(s),(0,n.useCallback)((e=>{if(!s)return;const a=new URLSearchParams(r.location.search);a.set(s,e),r.replace({...r.location,search:a.toString()})}),[s,r])]}function p(e){const{defaultValue:a,queryString:t=!1,groupId:r}=e,s=m(e),[o,i]=(0,n.useState)((()=>function(e){let{defaultValue:a,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(a){if(!h({value:a,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${a}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return a}const n=t.find((e=>e.default))??t[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:a,tabValues:s}))),[c,d]=g({queryString:t,groupId:r}),[p,f]=function(e){let{groupId:a}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(a),[r,s]=(0,u.Dv)(t);return[r,(0,n.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:r}),b=(()=>{const e=c??p;return h({value:e,tabValues:s})?e:null})();(0,l.A)((()=>{b&&i(b)}),[b]);return{selectedValue:o,selectValue:(0,n.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),f(e)}),[d,f,s]),tabValues:s}}var f=t(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=t(4848);function T(e){let{className:a,block:t,selectedValue:n,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.a_)(),u=e=>{const a=e.currentTarget,t=i.indexOf(a),r=l[t].value;r!==n&&(c(a),o(r))},d=e=>{let a=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=i.indexOf(e.currentTarget)+1;a=i[t]??i[0];break}case"ArrowLeft":{const t=i.indexOf(e.currentTarget)-1;a=i[t]??i[i.length-1];break}}a?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":t},a),children:l.map((e=>{let{value:a,label:t,attributes:s}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:n===a?0:-1,"aria-selected":n===a,ref:e=>i.push(e),onKeyDown:d,onClick:u,...s,className:(0,r.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":n===a}),children:t??a},a)}))})}function S(e){let{lazy:a,children:t,selectedValue:r}=e;const s=(Array.isArray(t)?t:[t]).filter(Boolean);if(a){const e=s.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:s.map(((e,a)=>(0,n.cloneElement)(e,{key:a,hidden:e.props.value!==r})))})}function y(e){const a=p(e);return(0,v.jsxs)("div",{className:(0,r.A)("tabs-container",b.tabList),children:[(0,v.jsx)(T,{...a,...e}),(0,v.jsx)(S,{...a,...e})]})}function A(e){const a=(0,f.A)();return(0,v.jsx)(y,{...e,children:d(e.children)},String(a))}},5696:(e,a,t)=>{t.d(a,{A:()=>h});var n=t(8774),r=t(1432),s=t(9365),o=t(1470),l=(t(6540),t(301)),i=t(4848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",u="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function m(e,a,t){let n=[];return t&&t.length>0&&(n=[(0,i.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(t?.map(((e,t,n)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${a}/${e}`,children:["#",e]}),t<n.length-1?" ":""]},e)))),n.push((0,i.jsx)("span",{}))),n}function h(e){let{info:a,config:t,script:h}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(n.A,{href:`/playground?example=${a.name}`,children:"playground"}),a.variant===l.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(o.default,{children:[(0,i.jsx)(s.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:t})}),(0,i.jsx)(s.default,{value:"script",label:"Script",children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:h})})]}),(0,i.jsxs)("p",{children:[(0,i.jsxs)("span",{children:["Source: ",(0,i.jsxs)("a",{href:`${c}/${a.category}/${a.name}`,children:[a.name,".ts"]})]}),m("Issues",u,a.issues),m("PRs",d,a.pullRequests)]})]})}},301:(e,a,t)=>{t.d(a,{bk:()=>r,lI:()=>n,sE:()=>s});let n=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),r=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),s=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},2671:(e,a,t)=>{t.d(a,{Fw:()=>c,pq:()=>l});var n=t(7694),r=t(301),s=(t(2744),t(4460)),o=t(6407);const l={name:"actionThreadRemoveLabel",title:"Remove Thread Label",description:"The action `thread.removeLabel` removes a label from a thread.",category:r.lI.ACTIONS,issues:[303]},i={description:l.description,global:{thread:{match:{query:`from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${n.L.EMAIL_SUBJECT_PREFIX}${l.name}'`}}},settings:{markProcessedMethod:o.Pn.CUSTOM},threads:[{match:{query:`subject:([GmailProcessor-Test] ${l.name})`},actions:[{name:"thread.addLabel",processingStage:s.Sg.PRE_MAIN,args:{name:"accounting-process"}},{name:"thread.markRead",processingStage:s.Sg.POST_MAIN},{name:"thread.removeLabel",processingStage:s.Sg.POST_MAIN,args:{name:"accounting-process"}},{name:"thread.addLabel",processingStage:s.Sg.POST_MAIN,args:{name:"accounting-autoinvoice"}}]}]},c={info:l,config:i}},2744:(e,a,t)=>{t.d(a,{Ah:()=>r,GS:()=>o,KI:()=>s,jV:()=>n});let n=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),r=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function s(e,a,t,n,r){return{deprecationInfo:r,description:n,title:t,type:e,value:a}}let o=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},4460:(e,a,t)=>{t.d(a,{Sg:()=>l,ej:()=>h,jG:()=>m,kj:()=>u,mt:()=>g,v1:()=>c,wf:()=>d});var n=t(4729),r=t(8420),s=t(5698),o=(t(5508),t(7158));let l=function(e){return e.PRE_MAIN="pre-main",e.MAIN="main",e.POST_MAIN="post-main",e}({}),i=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",decorators:[(0,r.v)()],key:"args",value:void 0},{kind:"field",decorators:[(0,r.v)()],key:"description",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"name",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"processingStage",value:()=>l.POST_MAIN}]}}));class c extends i{}class u extends i{}class d extends i{}function m(e){var a;return e=(0,o.I)(e,(a={name:"thread.noop"},(0,s.bj)(c,a,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function h(e){var a;return e=(0,o.I)(e,(a={name:"message.noop"},(0,s.bj)(u,a,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function g(e){var a;return e=(0,o.I)(e,(a={name:"attachment.noop"},(0,s.bj)(d,a,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}},6407:(e,a,t)=>{t.d(a,{$b:()=>c,GJ:()=>h,Pn:()=>u,c1:()=>p,we:()=>g});var n=t(4729),r=t(4467),s=t(8420),o=t(5136),l=t(5698),i=(t(5508),t(7158));let c=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({}),u=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class d{constructor(){(0,r.A)(this,"name",""),(0,r.A)(this,"title",""),(0,r.A)(this,"value",void 0),(0,r.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),h=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,s.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,s.v)(),(0,o.Z)((()=>d))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,s.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,s.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedMethod",value:()=>u.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"timezone",value:()=>"default"}]}}));function g(e){return void 0===e&&(e={}),(0,l.bj)(h,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function p(e){return e=(0,i.I)(e,g(),{},["markProcessedMethod"])}},7694:(e,a,t)=>{t.d(a,{L:()=>r});var n=t(4467);class r{}(0,n.A)(r,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,n.A)(r,"EMAIL_SLEEP_TIME_MS",1e4),(0,n.A)(r,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,n.A)(r,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,n.A)(r,"GIT_REPO_BRANCH","main"),(0,n.A)(r,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,a,t)=>{function n(e,a,t,n){return void 0===t&&(t={}),void 0===n&&(n=[]),n=n.concat([]),Object.keys(e).forEach((r=>{const s=function(e,a){return Array.isArray(e)&&a?e=e.map((e=>a(e))):"object"==typeof e&&a&&(e=a(e)),e}(e[r],t[r]),o=JSON.stringify(s);n.includes(r)||null!==s&&o!==JSON.stringify(a[r])&&"[]"!==o&&"{}"!==o||delete e[r]})),e}t.d(a,{I:()=>n})}}]);