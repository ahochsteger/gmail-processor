"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[2857],{6942:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>h});var r=s(4848),o=s(8453),i=s(4153),n=s(5696);const a={sidebar_position:20},l="Getting Started",c={id:"getting-started",title:"Getting Started",description:"There are different ways to get started with GmailProcessor in your Google Apps Script project:",source:"@site/docs/getting-started.mdx",sourceDirName:".",slug:"/getting-started",permalink:"/gmail-processor/docs/getting-started",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/getting-started.mdx",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20},sidebar:"docsSidebar",previous:{title:"About Gmail Processor",permalink:"/gmail-processor/docs/"},next:{title:"Examples",permalink:"/gmail-processor/docs/examples/"}},d={},h=[{value:"Use a Library Reference (recommended)",id:"use-a-library-reference-recommended",level:2},{value:"Copy the Library Code (advanced)",id:"copy-the-library-code-advanced",level:2},{value:"Required API Permissions",id:"required-api-permissions",level:2}];function m(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components},{Details:s}=t;return s||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"getting-started",children:"Getting Started"}),"\n",(0,r.jsx)(t.p,{children:"There are different ways to get started with GmailProcessor in your Google Apps Script project:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsxs)(t.a,{href:"#use-a-library-reference-recommended",children:[(0,r.jsx)(t.strong,{children:"Use"})," a library reference (recommended)"]}),": Use this, if you just want to use the library, get easy updates and don't want to fiddle with the library code at all."]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsxs)(t.a,{href:"#copy-the-library-code-advanced",children:[(0,r.jsx)(t.strong,{children:"Copy"})," the library code (advanced)"]}),": Use this if you want full control over what's being executed or use your own modified library."]}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"use-a-library-reference-recommended",children:"Use a Library Reference (recommended)"}),"\n",(0,r.jsx)(t.p,{children:"To use the Gmail Processor library directly within Google Apps Script, you can choose from three available release channels with the associated script IDs - depending on your needs:"}),"\n",(0,r.jsx)(t.p,{children:"Follow these steps:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:["Open ",(0,r.jsx)(t.a,{href:"https://script.google.com/home?hl=en",children:"Google Apps Script"}),"."]}),"\n",(0,r.jsxs)(t.li,{children:["Create an empty project and give it a name (e.g. ",(0,r.jsx)(t.code,{children:"MyGmailProcessor"}),") or select an existing one."]}),"\n",(0,r.jsx)(t.li,{children:"Add the library in the Libraries section using the \uff0b icon and insert this Script ID:"}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-text",children:"1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB\n"})}),"\n",(0,r.jsxs)(t.ol,{start:"4",children:["\n",(0,r.jsxs)(t.li,{children:['Press "Look up" and select the desired release number as ',(0,r.jsx)(t.strong,{children:"version"}),' (recommended for stability) or "HEAD (Development Mode)" (recommended for automatically staying up-to-date with the potential risk of broken updates).',"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["See the ",(0,r.jsx)(t.a,{href:"https://github.com/ahochsteger/gmail-processor/releases",children:"Gmail Processor Release Notes"})," for their corresponding Google Apps Script library version."]}),"\n",(0,r.jsxs)(t.li,{children:["Or use this URL to verify the release version of a Google Apps Script Library: ",(0,r.jsx)(t.a,{href:"https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/%7BlibVersion%7D",children:"https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/{libVersion}"})," (replace ",(0,r.jsx)(t.code,{children:"{libVersion}"})," with the number from the drop-down in Google Apps Script)."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["Set the ",(0,r.jsx)(t.strong,{children:"identifier"})," to ",(0,r.jsx)(t.code,{children:"GmailProcessorLib"})," (any name will do, but we will use this identifier as a reference in all ",(0,r.jsx)(t.a,{href:"/gmail-processor/docs/examples/",children:"examples"})," and documentation)"]}),"\n",(0,r.jsxs)(t.li,{children:["Replace the contents of the initially created file ",(0,r.jsx)(t.code,{children:"Code.gs"})," with the following code, take the config from the ",(0,r.jsx)(t.a,{href:"/gmail-processor/docs/examples/basics/simple",children:"Simple Example"})," and save the changes:"]}),"\n"]}),"\n",(0,r.jsxs)(s,{children:[(0,r.jsx)("summary",{children:"Expand example"}),(0,r.jsx)(n.A,{path:"src/examples/basics/simple.ts",example:i.B3})]}),"\n",(0,r.jsxs)(t.ol,{start:"7",children:["\n",(0,r.jsxs)(t.li,{children:["Perform an initial execution of the function ",(0,r.jsx)(t.code,{children:"run"})," to grant all required permissions (see ",(0,r.jsx)(t.a,{href:"#required-api-permissions",children:"Required API Permissions"})," for more details):","\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Select your account you want to grant access for"}),"\n",(0,r.jsx)(t.li,{children:'When the message "Google did not verify the app" click on "Advanced" and "Go to ..." to proceed'}),"\n",(0,r.jsx)(t.li,{children:'Grant access to all listed apps by clicking "Allow"'}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Adjust the configuration (see section ",(0,r.jsx)(t.a,{href:"/gmail-processor/docs/reference/",children:"Configuration Reference"}),") to your needs. It's always recommended to test config changes using the run mode ",(0,r.jsx)(t.code,{children:"dry-run"})," (2nd parameter to the ",(0,r.jsx)(t.code,{children:"run()"})," function). That doesn't touch anything (GMail, GDrive, Google Sheets) but produces a log that shows what would have been done. This way any change in your configuration or an upgrade to a newer version of the library can be tested without any risk of data-loss."]}),"\n",(0,r.jsxs)(t.p,{children:["If you're satisfied with the results change the run mode from ",(0,r.jsx)(t.code,{children:"dry-run"})," to ",(0,r.jsx)(t.code,{children:"safe-mode"})," to actually do the processing and execute the ",(0,r.jsx)(t.code,{children:"run"})," function again.\nFor automatic triggering you can create a ",(0,r.jsx)(t.a,{href:"https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually",children:"time-based trigger"})," that runs at certain intervals (e.g. once per day or every hour)."]}),"\n",(0,r.jsx)(t.p,{children:"Should you run into any problems please create an issue and put the configuration as well as the log output there. Make sure to remove any sensitive information before doing so, since the issue contents will be publicly visible."}),"\n",(0,r.jsx)(t.h2,{id:"copy-the-library-code-advanced",children:"Copy the Library Code (advanced)"}),"\n",(0,r.jsx)(t.p,{children:"To use a copy of the library code in your project simply replace steps 3-5 from above with the following steps:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:'Create a new file using the + icon at "Files" and selecting "Script"'}),"\n",(0,r.jsxs)(t.li,{children:["Give it a name (e.g. ",(0,r.jsx)(t.code,{children:"GmailProcessorLib"})," resulting in the file ",(0,r.jsx)(t.code,{children:"GmailProcessorLib.gs"})," to be created)"]}),"\n",(0,r.jsxs)(t.li,{children:["Replace the contents of the file with the library code of the release asset ",(0,r.jsx)(t.a,{href:"https://github.com/ahochsteger/gmail-processor/releases/latest/download/GmailProcessorLib.js",children:(0,r.jsx)(t.code,{children:"GmailProcessorLib.js"})})," from the latest release or your own built version from ",(0,r.jsx)(t.code,{children:"build/gas/lib/GmailProcessorLib.js"}),"."]}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Follow the remaining steps from step 6 onwards from above."}),"\n",(0,r.jsx)(t.h2,{id:"required-api-permissions",children:"Required API Permissions"}),"\n",(0,r.jsxs)(t.p,{children:["To enable full processing of the emails the following ",(0,r.jsx)(t.a,{href:"https://developers.google.com/identity/protocols/oauth2/scopes#script",children:"OAuth Scopes for Google APIs"})," are requested and need to be granted:"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://mail.google.com/"}),": Access Gmail API to process emails"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://www.googleapis.com/auth/drive"}),": Access Google Drive API to store files"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://www.googleapis.com/auth/script.external_request"}),": Used for end-to-end tests to fetch example attachments via HTTP"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://www.googleapis.com/auth/script.send_mail"}),": Used for end-to-end tests to send example emails"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://www.googleapis.com/auth/spreadsheets"}),": Access Google Spreadsheets API to store logs of processed emails"]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"https://www.googleapis.com/auth/userinfo.email"}),": Get the user's email address to be used in the configuration"]}),"\n"]})]})}function u(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},5696:(e,t,s)=>{s.d(t,{A:()=>m});var r=s(8774),o=s(1432),i=s(9365),n=s(1470),a=(s(6540),s(4848));const l="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",c="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function h(e,t,s){let r=[];return s&&s.length>0&&(r=[(0,a.jsxs)("span",{children:[" (",e,": "]},`${e}-0`)].concat(s?.map(((e,s,r)=>(0,a.jsxs)("span",{children:[(0,a.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),s<r.length-1?",":""]},e)))),r.push((0,a.jsx)("span",{children:")"}))),r}function m(e){let{example:t}=e;const s=t.info,m=`${t.info.category}/${t.info.name}.ts`,u=t.config,p=`${s.name}.ts`;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("p",{children:s.description}),(0,a.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,a.jsx)(r.A,{href:`/playground?example=${s.name}`,children:"playground"}),"v1"===s.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,a.jsxs)(n.default,{children:[(0,a.jsx)(i.default,{value:"config",label:"Config",default:!0,children:(0,a.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(u,null,2)})}),(0,a.jsx)(i.default,{value:"script",label:"Script",children:(0,a.jsx)(o.default,{language:"jsx",showLineNumbers:!0,children:"v1"===s.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(u,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,a.jsxs)("p",{children:["Source: ",(0,a.jsx)("a",{href:`${l}/${m}`,children:p}),h("Issues",c,t.info.issues),h("PRs",d,t.info.pullRequests)]})]})}},4153:(e,t,s)=>{s.d(t,{B3:()=>l});s(2744);var r=s(7216),o=s(6407),i=s(7694);const n={name:"simple",title:"Simple",description:"This is a simple example to start with Gmail Processor.",category:"basics",generate:["docs","test-e2e","test-spec"],schemaVersion:"v2"},a={description:n.description,settings:{markProcessedMethod:o.Pn.ADD_THREAD_LABEL,markProcessedLabel:"GmailProcessor/processed"},global:{thread:{match:{query:`has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${i.L.EMAIL_SUBJECT_PREFIX}${n.name}'`}}},threads:[{match:{query:"from:${user.email}"},messages:[{attachments:[{match:{name:"^invoice\\.pdf$"},actions:[{name:"attachment.store",args:{location:`${i.L.DRIVE_TESTS_BASE_PATH}/${n.name}/\${message.date:date::yyyy-MM-dd}/\${message.subject}-\${attachment.name.match.fileid}.pdf`,conflictStrategy:r.c2.KEEP}}]}]}]}]},l={info:n,config:a}},2744:(e,t,s)=>{s.d(t,{Ah:()=>o,GS:()=>n,KI:()=>i,jV:()=>r});let r=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),o=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function i(e,t,s,r,o){return{deprecationInfo:o,description:r,title:s,type:e,value:t}}let n=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},7216:(e,t,s)=>{s.d(t,{c2:()=>z});s(2744);var r=s(3359),o=s(7937),i=s(8118),n=s(8828),a=s(3380),l=s(5449),c=s(120),d=s(7736),h=s(575),m=s(7890),u=s(1634),p=s(8220),g=s(7102),f=s(738),x=s(9259),j=s(8305),y=s(506),A=s(1827),b=s(3757),v=s(8772),w=s(9596),k=s(8655),S=s(8016),E=s(655),P=s(2497),G=s(721),R=s(4313),L=s(7036),T=s(6143),_=s(7072),$=s(783),D=s(9953),I=s(9678),M=s(9113),O=s(8275),U=s(6191),C=s(2685),N=s(2950),V=s(2469),B=s(399),F=s(2163),J=s(7569),q=s(8375),H=s(6898);s(2882),s(5067),s(3711);r.A,o.A,i.A,n.A,a.A,l.A,c.A,d.A,h.A,m.A,u.A,p.A,g.A,f.A,x.A,j.A,y.A,A.A,b.A,v.A,w.A,k.A,S.A,E.A,P.A,G.A,R.A,L.A,T.A,_.A,$.A,D.A,I.A,M.A,O.A,U.A,C.A,N.A,V.A,B.A,F.A,J.A,q.A,H.A;let z=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},6407:(e,t,s)=>{s.d(t,{GJ:()=>u,Pn:()=>d,c1:()=>g,we:()=>p});var r=s(4729),o=s(4467),i=s(8420),n=s(5136),a=s(5698),l=(s(5508),s(7158)),c=s(9361);let d=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class h{constructor(){(0,o.A)(this,"name",""),(0,o.A)(this,"title",""),(0,o.A)(this,"value",void 0),(0,o.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),u=(0,r.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,i.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,i.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,i.v)(),(0,n.Z)((()=>h))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.$.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,i.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,i.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,i.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,i.v)()],key:"markProcessedMethod",value:()=>d.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,i.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,i.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,i.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,i.v)()],key:"timezone",value:()=>"default"}]}}));function p(e){return void 0===e&&(e={}),(0,a.bj)(u,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function g(e){return e=(0,l.I)(e,p(),{},["markProcessedMethod"])}},7694:(e,t,s)=>{s.d(t,{L:()=>o});var r=s(4467);class o{}(0,r.A)(o,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,r.A)(o,"EMAIL_SLEEP_TIME_MS",1e4),(0,r.A)(o,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,r.A)(o,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,r.A)(o,"GIT_REPO_BRANCH","main"),(0,r.A)(o,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,s)=>{function r(e,t,s,r){return void 0===s&&(s={}),void 0===r&&(r=[]),r=r.concat([]),Object.keys(e).forEach((o=>{const i=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[o],s[o]),n=JSON.stringify(i);r.includes(o)||null!==i&&n!==JSON.stringify(t[o])&&"[]"!==n&&"{}"!==n||delete e[o]})),e}s.d(t,{I:()=>r})},9361:(e,t,s)=>{s.d(t,{$:()=>r});s(6407);let r=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({});Object.values(r)}}]);