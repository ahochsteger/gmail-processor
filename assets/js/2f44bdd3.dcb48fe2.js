"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[98],{6070:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var a=s(4848),r=s(8453),o=s(3343),n=s(5696);const i={id:"actionExport",title:"Export Thread/Message"},c=void 0,l={id:"examples/actions/actionExport",title:"Export Thread/Message",description:"// NOTE: Do not edit this auto-generated file!",source:"@site/docs/examples/actions/actionExport.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionExport",permalink:"/gmail-processor/docs/examples/actions/actionExport",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionExport.mdx",tags:[],version:"current",frontMatter:{id:"actionExport",title:"Export Thread/Message"},sidebar:"docsSidebar",previous:{title:"attachment.extractText",permalink:"/gmail-processor/docs/examples/actions/actionAttachmentExtractText"},next:{title:"thread.removeLabel",permalink:"/gmail-processor/docs/examples/actions/actionThreadRemoveLabel"}},d={},m=[];function u(e){const t={p:"p",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"// NOTE: Do not edit this auto-generated file!\n// Template: src/examples/_templates/docs.tmpl\n// Source: src/examples/actions/actionExport.ts"}),"\n","\n",(0,a.jsx)(n.A,{path:"src/examples/actions/actionExport.ts",example:o.rp})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},5696:(e,t,s)=>{s.d(t,{A:()=>u});var a=s(8774),r=s(1432),o=s(9365),n=s(1470),i=(s(6540),s(4848));const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",l="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,s){let a=[];return s&&s.length>0&&(a=[(0,i.jsxs)("span",{children:[" (",e,": "]},`${e}-0`)].concat(s?.map(((e,s,a)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),s<a.length-1?",":""]},e)))),a.push((0,i.jsx)("span",{children:")"}))),a}function u(e){let{example:t}=e;const s=t.info,u=`${t.info.category}/${t.info.name}.ts`,p=t.config,g=`${s.name}.ts`;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{children:s.description}),(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(a.A,{href:`/playground?example=${s.name}`,children:"playground"}),"v1"===s.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(n.default,{children:[(0,i.jsx)(o.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(r.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(p,null,2)})}),(0,i.jsx)(o.default,{value:"script",label:"Script",children:(0,i.jsx)(r.default,{language:"jsx",showLineNumbers:!0,children:"v1"===s.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(p,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,i.jsxs)("p",{children:["Source: ",(0,i.jsx)("a",{href:`${c}/${u}`,children:g}),m("Issues",l,t.info.issues),m("PRs",d,t.info.pullRequests)]})]})}},3343:(e,t,s)=>{s.d(t,{rp:()=>i});var a=s(2485),r=s(6407);const o={name:"actionExport",title:"Export Thread/Message",description:"This is a simple example to start with Gmail Processor.",category:"actions",generate:["docs","test-e2e"],pullRequests:[291],schemaVersion:"v2"},n={description:o.description,settings:{logSheetLocation:"/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",markProcessedMethod:r.Pn.MARK_MESSAGE_READ},global:{thread:{match:{query:"-in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd}",maxMessageCount:-1,minMessageCount:1},actions:[{name:"thread.exportAsHtml",args:{location:"/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.html",conflictStrategy:a.c2.REPLACE}},{name:"thread.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",conflictStrategy:a.c2.REPLACE}}]},message:{actions:[{name:"message.exportAsHtml",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",conflictStrategy:a.c2.REPLACE}},{name:"message.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",conflictStrategy:a.c2.REPLACE}}]}},threads:[{match:{query:"from:${user.email} to:${user.email} subject:'GmailProcessor-Test'"}}]},i={info:o,config:n}},2744:(e,t,s)=>{s.d(t,{GS:()=>r,jV:()=>a});let a=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({});let r=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},2485:(e,t,s)=>{s.d(t,{c2:()=>a});s(2744);let a=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},6407:(e,t,s)=>{s.d(t,{GJ:()=>c,Pn:()=>i,c1:()=>l});var a=s(4729),r=s(8420),o=s(5698),n=(s(5508),s(7158));let i=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({}),c=(0,a.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,r.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,r.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedMethod",value:()=>i.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"timezone",value:()=>"default"}]}}));function l(e){var t;return e=(0,n.I)(e,(void 0===t&&(t={}),(0,o.bj)(c,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})),{},["markProcessedMethod"])}},7158:(e,t,s)=>{function a(e,t,s,a){return void 0===s&&(s={}),void 0===a&&(a=[]),a=a.concat([]),Object.keys(e).forEach((r=>{const o=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[r],s[r]),n=JSON.stringify(o);a.includes(r)||null!==o&&n!==JSON.stringify(t[r])&&"[]"!==n&&"{}"!==n||delete e[r]})),e}s.d(t,{I:()=>a})}}]);