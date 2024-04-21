"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[7772],{3813:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>c,metadata:()=>d,toc:()=>m});var n=a(4848),s=a(8453),r=a(6908),o=a(5696);const c={id:"actionAttachmentExtractText",title:"attachment.extractText"},i=void 0,d={id:"examples/actions/actionAttachmentExtractText",title:"attachment.extractText",description:"// NOTE: Do not edit this auto-generated file!",source:"@site/docs/examples/actions/actionAttachmentExtractText.mdx",sourceDirName:"examples/actions",slug:"/examples/actions/actionAttachmentExtractText",permalink:"/gmail-processor/docs/examples/actions/actionAttachmentExtractText",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/actions/actionAttachmentExtractText.mdx",tags:[],version:"current",frontMatter:{id:"actionAttachmentExtractText",title:"attachment.extractText"},sidebar:"docsSidebar",previous:{title:"Actions",permalink:"/gmail-processor/docs/examples/actions/"},next:{title:"Export Thread/Message",permalink:"/gmail-processor/docs/examples/actions/actionExport"}},l={},m=[];function u(e){const t={p:"p",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"// NOTE: Do not edit this auto-generated file!\n// Template: src/examples/_templates/docs.tmpl\n// Source: src/examples/actions/actionAttachmentExtractText.ts"}),"\n","\n",(0,n.jsx)(o.A,{path:"src/examples/actions/actionAttachmentExtractText.ts",example:r.Qm})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(u,{...e})}):u(e)}},5696:(e,t,a)=>{a.d(t,{A:()=>d});var n=a(8774),s=a(1432),r=a(9365),o=a(1470),c=(a(6540),a(4848));const i="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples/";function d(e){let{example:t}=e;const a=t.info,d=t.config,l=`${a.name}.ts`;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("p",{children:a.description}),(0,c.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,c.jsx)(n.A,{href:`/playground?example=${a.name}`,children:"playground"}),"v1"===a.schemaVersion?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,c.jsxs)(o.default,{children:[(0,c.jsx)(r.default,{value:"config",label:"Config",default:!0,children:(0,c.jsx)(s.default,{language:"jsx",showLineNumbers:!0,children:JSON.stringify(d,null,2)})}),(0,c.jsx)(r.default,{value:"script",label:"Script",children:(0,c.jsx)(s.default,{language:"jsx",showLineNumbers:!0,children:"v1"===a.schemaVersion?'function migrateConfig() {"{"}\n  const oldConfig = {JSON.stringify(config,null,2)}\n  const migratedConfig = GmailProcessorLib.convertV1Config(oldConfig)\n  console.log(JSON.stringify(migratedConfig, null, 2))\n}':`function run() {\n  const config = ${JSON.stringify(d,null,2).split("\n").map((e=>`  ${e}`)).join("\n").trim()}\n  GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN)\n}`})})]}),(0,c.jsxs)("p",{children:["Source: ",(0,c.jsx)("a",{href:`${i}/${l}`,children:l})]}),(0,c.jsxs)("p",{children:["Issues: ",t.info.issues?.map((e=>(0,c.jsxs)("a",{href:`https://github.com/ahochsteger/gmail-processor/issues/${e}`,children:["#",e]},e))).join(", ")]}),(0,c.jsxs)("p",{children:["PRs: ",t.info.pullRequests?.map((e=>(0,c.jsxs)("a",{href:`https://github.com/ahochsteger/gmail-processor/pull/${e}`,children:["#",e]},e))).join(", ")]})]})}},6908:(e,t,a)=>{a.d(t,{Qm:()=>d});var n=a(7694),s=(a(2744),a(2485)),r=a(4460),o=a(6407);const c={name:"actionAttachmentExtractText",title:"attachment.extractText",description:"This example demonstrates the use of the action `attachment.extractText` to extract matching text from the content of an attachment for use in later actions (e.g. use as part of the filename for `attachment.store`).",category:"actions",generate:["docs","test-e2e","test-spec"],pullRequests:[319],schemaVersion:"v2"},i={description:c.description,global:{thread:{match:{query:"has:attachment -in:trash -in:drafts -in:spam from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd}"}}},settings:{markProcessedMethod:o.Pn.MARK_MESSAGE_READ},threads:[{match:{query:`subject:([GmailProcessor-Test] ${c.name})`},attachments:[{description:"Process all attachments named 'invoice*.pdf'",match:{name:"(?<basename>invoice.*)\\.pdf$"},actions:[{description:"Extract the text from the body of the PDF attachment using language auto-detection.",name:"attachment.extractText",args:{docsFileLocation:`${n.L.DRIVE_TESTS_BASE_PATH}/${c.name}/\${attachment.name.match.basename} (Google Docs)`,extract:"Invoice date:\\s*(?<invoiceDate>[A-Za-z]{3} [0-9]{1,2}, [0-9]{4})\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)\\s*Payment due:\\s(?<paymentDueDays>[0-9]+)\\sdays after invoice date"},processingStage:r.Sg.PRE_MAIN},{description:"Store the attachment using extracted values for `invoiceNumber` and `invoiceDate`",name:"attachment.store",args:{conflictStrategy:s.c2.UPDATE,location:`${n.L.DRIVE_TESTS_BASE_PATH}/${c.name}/\${attachment.name.match.basename}-number-\${attachment.extracted.match.invoiceNumber}-date-\${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}-due-\${attachment.extracted.match.paymentDueDays}-days.pdf`,description:"Invoice number: ${attachment.extracted.match.invoiceNumber}\nInvoice date: ${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}\nPayment due: ${attachment.extracted.match.paymentDueDays} days"}}]}]}]},d={info:c,config:i}},2744:(e,t,a)=>{a.d(t,{GS:()=>s,jV:()=>n});let n=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({});let s=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},2485:(e,t,a)=>{a.d(t,{c2:()=>n});a(2744);let n=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},4460:(e,t,a)=>{a.d(t,{Sg:()=>c,ej:()=>h,jG:()=>u,kj:()=>l,mt:()=>p,v1:()=>d,wf:()=>m});var n=a(4729),s=a(8420),r=a(5698),o=(a(5508),a(7158));let c=function(e){return e.PRE_MAIN="pre-main",e.MAIN="main",e.POST_MAIN="post-main",e}({}),i=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",decorators:[(0,s.v)()],key:"args",value:void 0},{kind:"field",decorators:[(0,s.v)()],key:"description",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"name",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"processingStage",value:()=>c.POST_MAIN}]}}));class d extends i{}class l extends i{}class m extends i{}function u(e){var t;return e=(0,o.I)(e,(t={name:"thread.noop"},(0,r.bj)(d,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function h(e){var t;return e=(0,o.I)(e,(t={name:"message.noop"},(0,r.bj)(l,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}function p(e){var t;return e=(0,o.I)(e,(t={name:"attachment.noop"},(0,r.bj)(m,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})))}},6407:(e,t,a)=>{a.d(t,{GJ:()=>i,Pn:()=>c,c1:()=>d});var n=a(4729),s=a(8420),r=a(5698),o=(a(5508),a(7158));let c=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({}),i=(0,n.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,s.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,s.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,s.v)()],key:"markProcessedMethod",value:()=>c.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,s.v)()],key:"timezone",value:()=>"default"}]}}));function d(e){var t;return e=(0,o.I)(e,(void 0===t&&(t={}),(0,r.bj)(i,t,{exposeDefaultValues:!0,exposeUnsetFields:!1})),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>s});var n=a(4467);class s{}(0,n.A)(s,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,n.A)(s,"EMAIL_SLEEP_TIME_MS",5e3),(0,n.A)(s,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,n.A)(s,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,n.A)(s,"GIT_REPO_BRANCH","main"),(0,n.A)(s,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function n(e,t,a,n){return void 0===a&&(a={}),void 0===n&&(n=[]),n=n.concat([]),Object.keys(e).forEach((s=>{const r=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[s],a[s]),o=JSON.stringify(r);n.includes(s)||null!==r&&o!==JSON.stringify(t[s])&&"[]"!==o&&"{}"!==o||delete e[s]})),e}a.d(t,{I:()=>n})}}]);