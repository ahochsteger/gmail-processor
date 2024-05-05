"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[6710],{8807:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>g});var s=a(4848),o=a(8453),n=a(6172),l=a(5696);const i={id:"logSheetLogging",title:"LogSheet Logging"},r=void 0,c={id:"examples/advanced/logSheetLogging",title:"LogSheet Logging",description:"\x3c!--",source:"@site/docs/examples/advanced/logSheetLogging.mdx",sourceDirName:"examples/advanced",slug:"/examples/advanced/logSheetLogging",permalink:"/gmail-processor/docs/examples/advanced/logSheetLogging",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/advanced/logSheetLogging.mdx",tags:[],version:"current",frontMatter:{id:"logSheetLogging",title:"LogSheet Logging"},sidebar:"docsSidebar",previous:{title:"Advanced",permalink:"/gmail-processor/docs/examples/advanced/"},next:{title:"Regular Expressions",permalink:"/gmail-processor/docs/examples/advanced/regularExpressions"}},d={},g=[];function m(e){const t={code:"code",li:"li",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"This example demonstrates the advanced logging possibilities to a Google Spreadsheet."}),"\n",(0,s.jsxs)(t.p,{children:["The following ",(0,s.jsx)(t.code,{children:"settings"})," are used to configure the logging behafior:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"logSheetLocation"}),": The location of the spreadsheet document to be logged into."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"logFields"}),": The list of log fields which are used to log into a separate column in the given order."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"logSheetTracing"}),": Logs additional tracing logs into the log sheet."]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["The action ",(0,s.jsx)(t.code,{children:"global.sheetLog"})," is then used to log certain messages into the logsheet at the given ",(0,s.jsx)(t.code,{children:"processingStage"}),"s."]}),"\n",(0,s.jsx)(l.A,{path:"src/examples/advanced/logSheetLogging.ts",example:n.Zy})]})}function u(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},5696:(e,t,a)=>{a.d(t,{A:()=>m});var s=a(8774),o=a(1432),n=a(9365),l=a(1470),i=(a(6540),a(4848));const r="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",c="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function g(e,t,a){let s=[];return a&&a.length>0&&(s=[(0,i.jsxs)("span",{children:[" (",e,": "]},`${e}-0`)].concat(a?.map(((e,a,s)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<s.length-1?",":""]},e)))),s.push((0,i.jsx)("span",{children:")"}))),s}function m(e){let{example:t}=e;const a=t.info,m=`${t.info.category}/${t.info.name}.ts`,u=t.config,h=`${a.name}.ts`;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(s.A,{href:`/playground?example=${a.name}`,children:"playground"}),"v1"===a.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(l.default,{children:[(0,i.jsx)(n.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(u,null,2)})}),(0,i.jsx)(n.default,{value:"script",label:"Script",children:(0,i.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:"v1"===a.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(u,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,i.jsxs)("p",{children:["Source: ",(0,i.jsx)("a",{href:`${r}/${m}`,children:h}),g("Issues",c,t.info.issues),g("PRs",d,t.info.pullRequests)]})]})}},6172:(e,t,a)=>{a.d(t,{Zy:()=>d});a(2744);var s=a(6407),o=a(9361),n=a(7216),l=a(4460),i=a(7694);const r={name:"logSheetLogging",title:"LogSheet Logging",description:"Demonstrates logging to a Google Spreadsheet.",category:"advanced",generate:["docs","test-e2e"],schemaVersion:"v2"},c={description:r.description,settings:{markProcessedMethod:s.Pn.MARK_MESSAGE_READ,logSheetLocation:"/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",logSheetTracing:!0,logFields:["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl","context.type"]},threads:[{match:{query:`from:\${user.email} subject:'${i.L.EMAIL_SUBJECT_PREFIX}${r.name}'`},actions:[{name:"global.sheetLog",args:{level:o.$.INFO,message:"Thread log (pre-main): ${thread.id}"},processingStage:l.Sg.PRE_MAIN},{name:"global.sheetLog",args:{level:o.$.INFO,message:"Thread log (main): ${thread.id}"},processingStage:l.Sg.MAIN},{name:"global.sheetLog",args:{level:o.$.INFO,message:"Thread log (post-main): ${thread.id}"},processingStage:l.Sg.POST_MAIN}],messages:[{actions:[{name:"global.sheetLog",args:{level:o.$.WARN,message:"Message log (pre-main): ${message.id}"},processingStage:l.Sg.PRE_MAIN},{name:"global.sheetLog",args:{level:o.$.WARN,message:"Message log (main): ${message.id}"},processingStage:l.Sg.MAIN},{name:"global.sheetLog",args:{level:o.$.WARN,message:"Message log (post-main): ${message.id}"},processingStage:l.Sg.POST_MAIN}],attachments:[{actions:[{name:"global.sheetLog",args:{level:o.$.ERROR,message:"Attachment log (pre-main): ${attachment.hash}"},processingStage:l.Sg.PRE_MAIN},{name:"attachment.store",args:{conflictStrategy:n.c2.UPDATE,location:`${i.L.DRIVE_TESTS_BASE_PATH}/${r.name}/\${attachment.name}`}},{name:"global.sheetLog",args:{level:o.$.ERROR,message:"Attachment log (post-main): ${attachment.hash}"},processingStage:l.Sg.POST_MAIN}]}]}]}]},d={info:r,config:c}},2744:(e,t,a)=>{a.d(t,{Ah:()=>o,GS:()=>l,KI:()=>n,jV:()=>s});let s=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),o=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function n(e,t,a,s,o){return{deprecationInfo:o,description:s,title:a,type:e,value:t}}let l=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},7216:(e,t,a)=>{a.d(t,{c2:()=>z});a(2744);var s=a(3359),o=a(7937),n=a(8118),l=a(8828),i=a(3380),r=a(5449),c=a(120),d=a(7736),g=a(575),m=a(7890),u=a(1634),h=a(8220),p=a(7102),A=a(738),f=a(9259),v=a(8305),S=a(506),x=a(1827),b=a(3757),j=a(8772),E=a(9596),y=a(8655),k=a(8016),L=a(655),R=a(2497),T=a(721),$=a(4313),M=a(7036),_=a(6143),I=a(7072),N=a(783),P=a(9953),O=a(9678),D=a(9113),U=a(8275),F=a(6191),G=a(2685),V=a(2950),C=a(2469),w=a(399),B=a(2163),J=a(7569),H=a(8375),K=a(6898);a(2882),a(5067),a(3711);s.A,o.A,n.A,l.A,i.A,r.A,c.A,d.A,g.A,m.A,u.A,h.A,p.A,A.A,f.A,v.A,S.A,x.A,b.A,j.A,E.A,y.A,k.A,L.A,R.A,T.A,$.A,M.A,_.A,I.A,N.A,P.A,O.A,D.A,U.A,F.A,G.A,V.A,C.A,w.A,B.A,J.A,H.A,K.A;let z=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},4460:(e,t,a)=>{a.d(t,{Sg:()=>i,ej:()=>u,jG:()=>m,kj:()=>d,mt:()=>h,v1:()=>c,wf:()=>g});var s=a(4729),o=a(8420),n=a(5698),l=(a(5508),a(7158));let i=function(e){return e.PRE_MAIN="pre-main",e.MAIN="main",e.POST_MAIN="post-main",e}({}),r=(0,s.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",decorators:[(0,o.v)()],key:"args",value:void 0},{kind:"field",decorators:[(0,o.v)()],key:"description",value:()=>""},{kind:"field",decorators:[(0,o.v)()],key:"name",value:()=>""},{kind:"field",decorators:[(0,o.v)()],key:"processingStage",value:()=>i.POST_MAIN}]}}));class c extends r{}class d extends r{}class g extends r{}function m(e){var t;return e=(0,l.I)(e,(t={name:"thread.noop"},(0,n.bj)(c,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function u(e){var t;return e=(0,l.I)(e,(t={name:"message.noop"},(0,n.bj)(d,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function h(e){var t;return e=(0,l.I)(e,(t={name:"attachment.noop"},(0,n.bj)(g,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}},6407:(e,t,a)=>{a.d(t,{GJ:()=>u,Pn:()=>d,c1:()=>p,we:()=>h});var s=a(4729),o=a(4467),n=a(8420),l=a(5136),i=a(5698),r=(a(5508),a(7158)),c=a(9361);let d=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class g{constructor(){(0,o.A)(this,"name",""),(0,o.A)(this,"title",""),(0,o.A)(this,"value",void 0),(0,o.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),u=(0,s.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,n.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,n.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,n.v)(),(0,l.Z)((()=>g))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.$.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,n.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,n.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,n.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,n.v)()],key:"markProcessedMethod",value:()=>d.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,n.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,n.v)()],key:"timezone",value:()=>"default"}]}}));function h(e){return void 0===e&&(e={}),(0,i.bj)(u,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function p(e){return e=(0,r.I)(e,h(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>o});var s=a(4467);class o{}(0,s.A)(o,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,s.A)(o,"EMAIL_SLEEP_TIME_MS",1e4),(0,s.A)(o,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,s.A)(o,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,s.A)(o,"GIT_REPO_BRANCH","main"),(0,s.A)(o,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function s(e,t,a,s){return void 0===a&&(a={}),void 0===s&&(s=[]),s=s.concat([]),Object.keys(e).forEach((o=>{const n=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[o],a[o]),l=JSON.stringify(n);s.includes(o)||null!==n&&l!==JSON.stringify(t[o])&&"[]"!==l&&"{}"!==l||delete e[o]})),e}a.d(t,{I:()=>s})},9361:(e,t,a)=>{a.d(t,{$:()=>s});a(6407);let s=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({});Object.values(s)}}]);