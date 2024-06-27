"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[98],{5377:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>d,default:()=>g,frontMatter:()=>c,metadata:()=>u,toc:()=>h});var s=a(4848),r=a(8453),n=a(5696);const o='{\n  "description": "Export a thread or message as HTML or PDF.",\n  "settings": {\n    "logSheetLocation": "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",\n    "markProcessedMethod": "mark-read"\n  },\n  "global": {\n    "thread": {\n      "match": {\n        "query": "-in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionExport\'",\n        "maxMessageCount": -1,\n        "minMessageCount": 1\n      },\n      "actions": [\n        {\n          "name": "thread.exportAsHtml",\n          "args": {\n            "location": "/GmailProcessor-Tests/actions/actionExport/thread-${thread.id}-${thread.firstMessageSubject}.html",\n            "conflictStrategy": "replace"\n          }\n        },\n        {\n          "name": "thread.exportAsPdf",\n          "args": {\n            "location": "/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",\n            "conflictStrategy": "replace"\n          }\n        }\n      ]\n    },\n    "message": {\n      "actions": [\n        {\n          "name": "message.exportAsHtml",\n          "args": {\n            "location": "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",\n            "conflictStrategy": "replace"\n          }\n        },\n        {\n          "name": "message.exportAsPdf",\n          "args": {\n            "location": "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",\n            "conflictStrategy": "replace"\n          }\n        }\n      ]\n    }\n  },\n  "threads": [\n    {\n      "match": {\n        "query": "from:${user.email} to:${user.email} subject:\'GmailProcessor-Test\'"\n      }\n    }\n  ]\n}\n',l='function actionExportRun() {\n  const config = {\n    description: "Export a thread or message as HTML or PDF.",\n    settings: {\n      logSheetLocation:\n        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",\n      markProcessedMethod: "mark-read",\n    },\n    global: {\n      thread: {\n        match: {\n          query:\n            "-in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} subject:\'[GmailProcessor-Test] actionExport\'",\n          maxMessageCount: -1,\n          minMessageCount: 1,\n        },\n        actions: [\n          {\n            name: "thread.exportAsHtml",\n            args: {\n              location:\n                "/GmailProcessor-Tests/actions/actionExport/thread-${thread.id}-${thread.firstMessageSubject}.html",\n              conflictStrategy: "replace",\n            },\n          },\n          {\n            name: "thread.exportAsPdf",\n            args: {\n              location:\n                "/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",\n              conflictStrategy: "replace",\n            },\n          },\n        ],\n      },\n      message: {\n        actions: [\n          {\n            name: "message.exportAsHtml",\n            args: {\n              location:\n                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",\n              conflictStrategy: "replace",\n            },\n          },\n          {\n            name: "message.exportAsPdf",\n            args: {\n              location:\n                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",\n              conflictStrategy: "replace",\n            },\n          },\n        ],\n      },\n    },\n    threads: [\n      {\n        match: {\n          query:\n            "from:${user.email} to:${user.email} subject:\'GmailProcessor-Test\'",\n        },\n      },\n    ],\n  }\n\n  GmailProcessorLib.run(config, "dry-run")\n}\n';var i=a(3343);const c={id:"actionExport",title:"Export Thread/Message",description:"Export a thread or message as HTML or PDF."},d=void 0,u={id:"examples/actions/actionExport",title:"Export Thread/Message",description:"Export a thread or message as HTML or PDF.",source:"@site/docs/examples/actions/actionExport.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionExport",permalink:"/gmail-processor/docs/examples/actions/actionExport",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionExport.mdx",tags:[],version:"current",frontMatter:{id:"actionExport",title:"Export Thread/Message",description:"Export a thread or message as HTML or PDF."},sidebar:"docsSidebar",previous:{title:"Extract Attachment Text",permalink:"/gmail-processor/docs/examples/actions/actionAttachmentExtractText"},next:{title:"Remove Thread Label",permalink:"/gmail-processor/docs/examples/actions/actionThreadRemoveLabel"}},m={},h=[];function p(e){const t={code:"code",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"This example demonstrates how to export messages or threads to HTML or PDF documents."}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"message.exportAsHtml"}),": Exports a message to an HTML document."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"message.exportAsPdf"}),": Exports a message to a PDF document."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"thread.exportAsHtml"}),": Exports a thread to an HTML document."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"thread.exportAsPdf"}),": Exports a thread to a PDF document."]}),"\n"]}),"\n",(0,s.jsx)(n.A,{info:i.pq,config:o,script:l})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},9365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});a(6540);var s=a(4164);const r={tabItem:"tabItem_Ymn6"};var n=a(4848);function o(e){let{children:t,hidden:a,className:o}=e;return(0,n.jsx)("div",{role:"tabpanel",className:(0,s.A)(r.tabItem,o),hidden:a,children:t})}},1470:(e,t,a)=>{a.r(t),a.d(t,{default:()=>v});var s=a(6540),r=a(4164),n=a(3104),o=a(6347),l=a(205),i=a(7485),c=a(1682),d=a(679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:a}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:a,attributes:s,default:r}}=e;return{value:t,label:a,attributes:s,default:r}}))}(a);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function h(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:a}=e;const r=(0,o.W6)(),n=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,i.aZ)(n),(0,s.useCallback)((e=>{if(!n)return;const t=new URLSearchParams(r.location.search);t.set(n,e),r.replace({...r.location,search:t.toString()})}),[n,r])]}function g(e){const{defaultValue:t,queryString:a=!1,groupId:r}=e,n=m(e),[o,i]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=a.find((e=>e.default))??a[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:n}))),[c,u]=p({queryString:a,groupId:r}),[g,f]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,n]=(0,d.Dv)(a);return[r,(0,s.useCallback)((e=>{a&&n.set(e)}),[a,n])]}({groupId:r}),A=(()=>{const e=c??g;return h({value:e,tabValues:n})?e:null})();(0,l.A)((()=>{A&&i(A)}),[A]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:n}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),f(e)}),[u,f,n]),tabValues:n}}var f=a(2303);const A={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=a(4848);function x(e){let{className:t,block:a,selectedValue:s,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,n.a_)(),d=e=>{const t=e.currentTarget,a=i.indexOf(t),r=l[a].value;r!==s&&(c(t),o(r))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;t=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;t=i[a]??i[i.length-1];break}}t?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":a},t),children:l.map((e=>{let{value:t,label:a,attributes:n}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>i.push(e),onKeyDown:u,onClick:d,...n,className:(0,r.A)("tabs__item",A.tabItem,n?.className,{"tabs__item--active":s===t}),children:a??t},t)}))})}function E(e){let{lazy:t,children:a,selectedValue:r}=e;const n=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=n.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:n.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function y(e){const t=g(e);return(0,b.jsxs)("div",{className:(0,r.A)("tabs-container",A.tabList),children:[(0,b.jsx)(x,{...t,...e}),(0,b.jsx)(E,{...t,...e})]})}function v(e){const t=(0,f.A)();return(0,b.jsx)(y,{...e,children:u(e.children)},String(t))}},5696:(e,t,a)=>{a.d(t,{A:()=>h});var s=a(8774),r=a(1432),n=a(9365),o=a(1470),l=(a(6540),a(301)),i=a(4848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",d="https://github.com/ahochsteger/gmail-processor/issues",u="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,a){let s=[];return a&&a.length>0&&(s=[(0,i.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(a?.map(((e,a,s)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<s.length-1?" ":""]},e)))),s.push((0,i.jsx)("span",{}))),s}function h(e){let{info:t,config:a,script:h}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(s.A,{href:`/playground?example=${t.name}`,children:"playground"}),t.variant===l.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(o.default,{children:[(0,i.jsx)(n.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:a})}),(0,i.jsx)(n.default,{value:"script",label:"Script",children:(0,i.jsx)(r.default,{language:"js",showLineNumbers:!0,children:h})})]}),(0,i.jsxs)("p",{children:[(0,i.jsxs)("span",{children:["Source: ",(0,i.jsxs)("a",{href:`${c}/${t.category}/${t.name}`,children:[t.name,".ts"]})]}),m("Issues",d,t.issues),m("PRs",u,t.pullRequests)]})]})}},301:(e,t,a)=>{a.d(t,{bk:()=>r,lI:()=>s,sE:()=>n});let s=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),r=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),n=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},3343:(e,t,a)=>{a.d(t,{Fw:()=>c,pq:()=>l});var s=a(8158),r=a(6407),n=a(7694),o=a(301);const l={name:"actionExport",title:"Export Thread/Message",description:"Export a thread or message as HTML or PDF.",category:o.lI.ACTIONS,skipGenerate:[o.bk.TEST_SPEC],pullRequests:[291]},i={description:l.description,settings:{logSheetLocation:"/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",markProcessedMethod:r.Pn.MARK_MESSAGE_READ},global:{thread:{match:{query:`-in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${n.L.EMAIL_SUBJECT_PREFIX}${l.name}'`,maxMessageCount:-1,minMessageCount:1},actions:[{name:"thread.exportAsHtml",args:{location:`/GmailProcessor-Tests/${l.category}/${l.name}/thread-\${thread.id}-\${thread.firstMessageSubject}.html`,conflictStrategy:s.c2.REPLACE}},{name:"thread.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",conflictStrategy:s.c2.REPLACE}}]},message:{actions:[{name:"message.exportAsHtml",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",conflictStrategy:s.c2.REPLACE}},{name:"message.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",conflictStrategy:s.c2.REPLACE}}]}},threads:[{match:{query:"from:${user.email} to:${user.email} subject:'GmailProcessor-Test'"}}]},c={info:l,config:i}},2744:(e,t,a)=>{a.d(t,{Ah:()=>r,GS:()=>o,KI:()=>n,jV:()=>s});let s=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),r=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function n(e,t,a,s,r){return{deprecationInfo:r,description:s,title:a,type:e,value:t}}let o=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},8158:(e,t,a)=>{a.d(t,{c2:()=>z});a(2744);var s=a(3359),r=a(7937),n=a(8118),o=a(8828),l=a(3380),i=a(5449),c=a(120),d=a(7736),u=a(575),m=a(7890),h=a(1634),p=a(8220),g=a(7102),f=a(738),A=a(9259),b=a(8305),x=a(506),E=a(1827),y=a(3757),v=a(8772),T=a(9596),S=a(8655),j=a(8016),M=a(655),$=a(2497),P=a(721),k=a(4313),R=a(7036),I=a(6143),L=a(7072),_=a(783),G=a(9953),C=a(9678),D=a(9113),w=a(8275),N=a(6191),V=a(2685),O=a(2950),F=a(2469),H=a(399),U=a(2163),q=a(7569),B=a(8375),K=a(6898);a(2882),a(5067),a(3711);s.A,r.A,n.A,o.A,l.A,i.A,c.A,d.A,u.A,m.A,h.A,p.A,g.A,f.A,A.A,b.A,x.A,E.A,y.A,v.A,T.A,S.A,j.A,M.A,$.A,P.A,k.A,R.A,I.A,L.A,_.A,G.A,C.A,D.A,w.A,N.A,V.A,O.A,F.A,H.A,U.A,q.A,B.A,K.A;let z=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},6407:(e,t,a)=>{a.d(t,{$b:()=>c,GJ:()=>h,Pn:()=>d,c1:()=>g,we:()=>p});var s=a(4729),r=a(4467),n=a(8420),o=a(5136),l=a(5698),i=(a(5508),a(7158));let c=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({}),d=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class u{constructor(){(0,r.A)(this,"name",""),(0,r.A)(this,"title",""),(0,r.A)(this,"value",void 0),(0,r.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),h=(0,s.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,n.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,n.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,n.v)(),(0,o.Z)((()=>u))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,n.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,n.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,n.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,n.v)()],key:"markProcessedMethod",value:()=>d.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,n.v)()],key:"timezone",value:()=>"default"}]}}));function p(e){return void 0===e&&(e={}),(0,l.bj)(h,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function g(e){return e=(0,i.I)(e,p(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>r});var s=a(4467);class r{}(0,s.A)(r,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,s.A)(r,"EMAIL_SLEEP_TIME_MS",1e4),(0,s.A)(r,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,s.A)(r,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,s.A)(r,"GIT_REPO_BRANCH","main"),(0,s.A)(r,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function s(e,t,a,s){return void 0===a&&(a={}),void 0===s&&(s=[]),s=s.concat([]),Object.keys(e).forEach((r=>{const n=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[r],a[r]),o=JSON.stringify(n);s.includes(r)||null!==n&&o!==JSON.stringify(t[r])&&"[]"!==o&&"{}"!==o||delete e[r]})),e}a.d(t,{I:()=>s})}}]);