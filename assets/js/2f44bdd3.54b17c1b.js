"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[98],{6070:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>g,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var s=a(4848),o=a(8453),r=a(3343),n=a(5696);const i={id:"actionExport",title:"Export Thread/Message"},c=void 0,l={id:"examples/actions/actionExport",title:"Export Thread/Message",description:"\x3c!--",source:"@site/docs/examples/actions/actionExport.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionExport",permalink:"/gmail-processor/docs/examples/actions/actionExport",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionExport.mdx",tags:[],version:"current",frontMatter:{id:"actionExport",title:"Export Thread/Message"},sidebar:"docsSidebar",previous:{title:"attachment.extractText",permalink:"/gmail-processor/docs/examples/actions/actionAttachmentExtractText"},next:{title:"thread.removeLabel",permalink:"/gmail-processor/docs/examples/actions/actionThreadRemoveLabel"}},d={},m=[];function u(e){return(0,s.jsx)(n.A,{path:"src/examples/actions/actionExport.ts",example:r.rp})}function g(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u()}},5696:(e,t,a)=>{a.d(t,{A:()=>u});var s=a(8774),o=a(1432),r=a(9365),n=a(1470),i=(a(6540),a(4848));const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",l="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,a){let s=[];return a&&a.length>0&&(s=[(0,i.jsxs)("span",{children:[" (",e,": "]},`${e}-0`)].concat(a?.map(((e,a,s)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<s.length-1?",":""]},e)))),s.push((0,i.jsx)("span",{children:")"}))),s}function u(e){let{example:t}=e;const a=t.info,u=`${t.info.category}/${t.info.name}.ts`,g=t.config,h=`${a.name}.ts`;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{children:a.description}),(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(s.A,{href:`/playground?example=${a.name}`,children:"playground"}),"v1"===a.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(n.default,{children:[(0,i.jsx)(r.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(g,null,2)})}),(0,i.jsx)(r.default,{value:"script",label:"Script",children:(0,i.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:"v1"===a.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(g,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,i.jsxs)("p",{children:["Source: ",(0,i.jsx)("a",{href:`${c}/${u}`,children:h}),m("Issues",l,t.info.issues),m("PRs",d,t.info.pullRequests)]})]})}},3343:(e,t,a)=>{a.d(t,{rp:()=>c});var s=a(7216),o=a(6407),r=a(7694);const n={name:"actionExport",title:"Export Thread/Message",description:"This is a simple example to start with Gmail Processor.",category:"actions",generate:["docs","test-e2e"],pullRequests:[291],schemaVersion:"v2"},i={description:n.description,settings:{logSheetLocation:"/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",markProcessedMethod:o.Pn.MARK_MESSAGE_READ},global:{thread:{match:{query:`-in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${r.L.EMAIL_SUBJECT_PREFIX}${n.name}'`,maxMessageCount:-1,minMessageCount:1},actions:[{name:"thread.exportAsHtml",args:{location:"/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.html",conflictStrategy:s.c2.REPLACE}},{name:"thread.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",conflictStrategy:s.c2.REPLACE}}]},message:{actions:[{name:"message.exportAsHtml",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",conflictStrategy:s.c2.REPLACE}},{name:"message.exportAsPdf",args:{location:"/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",conflictStrategy:s.c2.REPLACE}}]}},threads:[{match:{query:"from:${user.email} to:${user.email} subject:'GmailProcessor-Test'"}}]},c={info:n,config:i}},2744:(e,t,a)=>{a.d(t,{Ah:()=>o,GS:()=>n,KI:()=>r,jV:()=>s});let s=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),o=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function r(e,t,a,s,o){return{deprecationInfo:o,description:s,title:a,type:e,value:t}}let n=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},7216:(e,t,a)=>{a.d(t,{c2:()=>z});a(2744);var s=a(3359),o=a(7937),r=a(8118),n=a(8828),i=a(3380),c=a(5449),l=a(120),d=a(7736),m=a(575),u=a(7890),g=a(1634),h=a(8220),p=a(7102),A=a(738),f=a(9259),x=a(8305),E=a(506),y=a(1827),v=a(3757),b=a(8772),k=a(9596),S=a(8655),R=a(8016),j=a(655),T=a(2497),$=a(721),M=a(4313),P=a(7036),L=a(6143),_=a(7072),C=a(783),O=a(9953),G=a(9678),I=a(9113),N=a(8275),U=a(6191),D=a(2685),V=a(2950),w=a(2469),B=a(399),F=a(2163),H=a(7569),J=a(8375),K=a(6898);a(2882),a(5067),a(3711);s.A,o.A,r.A,n.A,i.A,c.A,l.A,d.A,m.A,u.A,g.A,h.A,p.A,A.A,f.A,x.A,E.A,y.A,v.A,b.A,k.A,S.A,R.A,j.A,T.A,$.A,M.A,P.A,L.A,_.A,C.A,O.A,G.A,I.A,N.A,U.A,D.A,V.A,w.A,B.A,F.A,H.A,J.A,K.A;let z=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},6407:(e,t,a)=>{a.d(t,{GJ:()=>g,Pn:()=>d,c1:()=>p,we:()=>h});var s=a(4729),o=a(4467),r=a(8420),n=a(5136),i=a(5698),c=(a(5508),a(7158)),l=a(9361);let d=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class m{constructor(){(0,o.A)(this,"name",""),(0,o.A)(this,"title",""),(0,o.A)(this,"value",void 0),(0,o.A)(this,"ctxValues",{})}}let u=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),g=(0,s.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,r.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,r.v)(),(0,n.Z)((()=>m))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>l.$.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>u.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,r.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,r.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedMethod",value:()=>d.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"timezone",value:()=>"default"}]}}));function h(e){return void 0===e&&(e={}),(0,i.bj)(g,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function p(e){return e=(0,c.I)(e,h(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>o});var s=a(4467);class o{}(0,s.A)(o,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,s.A)(o,"EMAIL_SLEEP_TIME_MS",1e4),(0,s.A)(o,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,s.A)(o,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,s.A)(o,"GIT_REPO_BRANCH","main"),(0,s.A)(o,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function s(e,t,a,s){return void 0===a&&(a={}),void 0===s&&(s=[]),s=s.concat([]),Object.keys(e).forEach((o=>{const r=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[o],a[o]),n=JSON.stringify(r);s.includes(o)||null!==r&&n!==JSON.stringify(t[o])&&"[]"!==n&&"{}"!==n||delete e[o]})),e}a.d(t,{I:()=>s})},9361:(e,t,a)=>{a.d(t,{$:()=>s});a(6407);let s=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({});Object.values(s)}}]);