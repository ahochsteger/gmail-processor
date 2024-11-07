"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[2690],{6808:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>d,default:()=>g,frontMatter:()=>u,metadata:()=>s,toc:()=>p});const s=JSON.parse('{"id":"examples/advanced/regularExpressions","title":"Regular Expressions","description":"Regular expressions allow to define patterns and extract values to simplify the configuration.","source":"@site/docs/examples/advanced/regularExpressions.mdx","sourceDirName":"examples/advanced","slug":"/examples/advanced/regularExpressions","permalink":"/gmail-processor/docs/examples/advanced/regularExpressions","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/advanced/regularExpressions.mdx","tags":[],"version":"current","frontMatter":{"id":"regularExpressions","title":"Regular Expressions","description":"Regular expressions allow to define patterns and extract values to simplify the configuration."},"sidebar":"docsSidebar","previous":{"title":"LogSheet Logging","permalink":"/gmail-processor/docs/examples/advanced/logSheetLogging"},"next":{"title":"Basics","permalink":"/gmail-processor/docs/examples/basics/"}}');var n=a(4848),r=a(8453),o=a(5696);const l='{\n  "description": "Regular expressions allow to define patterns and extract values to simplify the configuration.",\n  "settings": {\n    "markProcessedMethod": "mark-read"\n  },\n  "global": {\n    "thread": {\n      "match": {\n        "query": "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:\\"[GmailProcessor-Test] regularExpressions\\""\n      }\n    }\n  },\n  "threads": [\n    {\n      "match": {\n        "query": "from:${user.email}"\n      },\n      "messages": [\n        {\n          "name": "extract-message-fields-from-subject",\n          "match": {\n            "subject": "regularExpressions (?<school>[^-]+)-(?<reportType>[^-]+)-(?<reportSubType>[^-]+)-(?<date>[0-9-]+)"\n          },\n          "attachments": [\n            {\n              "match": {\n                "name": "^sample\\\\.docx$"\n              },\n              "actions": [\n                {\n                  "name": "attachment.store",\n                  "args": {\n                    "location": "/GmailProcessor-Tests/e2e/regularExpressions/Reports/${message.subject.match.school}/All Reports/${message.subject.match.reportType}/${message.subject.match.reportSubType}/${message.subject.match.date}-${attachment.name}",\n                    "conflictStrategy": "update"\n                  }\n                }\n              ]\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n',i='function regularExpressionsRun() {\n  const config = {\n    description:\n      "Regular expressions allow to define patterns and extract values to simplify the configuration.",\n    settings: {\n      markProcessedMethod: "mark-read",\n    },\n    global: {\n      thread: {\n        match: {\n          query:\n            \'has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] regularExpressions"\',\n        },\n      },\n    },\n    threads: [\n      {\n        match: {\n          query: "from:${user.email}",\n        },\n        messages: [\n          {\n            name: "extract-message-fields-from-subject",\n            match: {\n              subject:\n                "regularExpressions (?<school>[^-]+)-(?<reportType>[^-]+)-(?<reportSubType>[^-]+)-(?<date>[0-9-]+)",\n            },\n            attachments: [\n              {\n                match: {\n                  name: "^sample\\\\.docx$",\n                },\n                actions: [\n                  {\n                    name: "attachment.store",\n                    args: {\n                      location:\n                        "/GmailProcessor-Tests/e2e/regularExpressions/Reports/${message.subject.match.school}/All Reports/${message.subject.match.reportType}/${message.subject.match.reportSubType}/${message.subject.match.date}-${attachment.name}",\n                      conflictStrategy: "update",\n                    },\n                  },\n                ],\n              },\n            ],\n          },\n        ],\n      },\n    ],\n  }\n\n  return GmailProcessorLib.run(config, "dry-run")\n}\n';var c=a(3367);const u={id:"regularExpressions",title:"Regular Expressions",description:"Regular expressions allow to define patterns and extract values to simplify the configuration."},d=void 0,m={},p=[];function h(e){const t={code:"code",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"This example demonstrates how to use regular expressions in the configuration."}),"\n",(0,n.jsx)(t.p,{children:"It does to following with the message subject:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Ignores a common subject prefix"}),"\n",(0,n.jsxs)(t.li,{children:["Captures the school name using the capture group ",(0,n.jsx)(t.code,{children:"(?<school>...)"})]}),"\n",(0,n.jsxs)(t.li,{children:["Captures the report type using the capture group ",(0,n.jsx)(t.code,{children:"(?<reportType>...)"})]}),"\n",(0,n.jsxs)(t.li,{children:["Captures the report sub type using the capture group ",(0,n.jsx)(t.code,{children:"(?<reportSubType>...)"})]}),"\n",(0,n.jsxs)(t.li,{children:["Capture the date as the final part of the subject using the capture group ",(0,n.jsx)(t.code,{children:"(?<date>...)"})]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["The extracted data is finally used to dynamically define the location of the attachment to be stored using:\n",(0,n.jsx)(t.code,{children:".../Reports/${message.subject.match.school}/All Reports/${message.subject.match.reportType}/${message.subject.match.reportSubType}/${message.subject.match.date}-${attachment.name}"})]}),"\n",(0,n.jsx)(o.A,{info:c.pq,config:l,script:i})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},9365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});a(6540);var s=a(4164);const n={tabItem:"tabItem_Ymn6"};var r=a(4848);function o(e){let{children:t,hidden:a,className:o}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(n.tabItem,o),hidden:a,children:t})}},1470:(e,t,a)=>{a.r(t),a.d(t,{default:()=>j});var s=a(6540),n=a(4164),r=a(3104),o=a(6347),l=a(205),i=a(7485),c=a(1682),u=a(679);function d(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:a}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:s,default:n}}=e;return{value:t,label:a,attributes:s,default:n}}))}(a);return function(e){const t=(0,c.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function p(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function h(e){let{queryString:t=!1,groupId:a}=e;const n=(0,o.W6)(),r=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,i.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(n.location.search);t.set(r,e),n.replace({...n.location,search:t.toString()})}),[r,n])]}function g(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,r=m(e),[o,i]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=a.find((e=>e.default))??a[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:r}))),[c,d]=h({queryString:a,groupId:n}),[g,f]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,r]=(0,u.Dv)(a);return[n,(0,s.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:n}),b=(()=>{const e=c??g;return p({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{b&&i(b)}),[b]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),f(e)}),[d,f,r]),tabValues:r}}var f=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=a(4848);function y(e){let{className:t,block:a,selectedValue:s,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.a_)(),u=e=>{const t=e.currentTarget,a=i.indexOf(t),n=l[a].value;n!==s&&(c(t),o(n))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;t=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;t=i[a]??i[i.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,n.A)("tabs",{"tabs--block":a},t),children:l.map((e=>{let{value:t,label:a,attributes:r}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>i.push(e),onKeyDown:d,onClick:u,...r,className:(0,n.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":s===t}),children:a??t},t)}))})}function v(e){let{lazy:t,children:a,selectedValue:r}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,n.A)("margin-top--md",e.props.className)}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function E(e){const t=g(e);return(0,x.jsxs)("div",{className:(0,n.A)("tabs-container",b.tabList),children:[(0,x.jsx)(y,{...t,...e}),(0,x.jsx)(v,{...t,...e})]})}function j(e){const t=(0,f.A)();return(0,x.jsx)(E,{...e,children:d(e.children)},String(t))}},5696:(e,t,a)=>{a.d(t,{A:()=>p});var s=a(8774),n=a(1432),r=a(9365),o=a(1470),l=(a(6540),a(301)),i=a(4848);const c="https://github.com/ahochsteger/gmail-processor/blob/main/src/examples",u="https://github.com/ahochsteger/gmail-processor/issues",d="https://github.com/ahochsteger/gmail-processor/pull";function m(e,t,a){let s=[];return a&&a.length>0&&(s=[(0,i.jsxs)("span",{children:[" | ",e,": "]},`${e}-0`)].concat(a?.map(((e,a,s)=>(0,i.jsxs)("span",{children:[(0,i.jsxs)("a",{href:`${t}/${e}`,children:["#",e]}),a<s.length-1?" ":""]},e)))),s.push((0,i.jsx)("span",{}))),s}function p(e){let{info:t,config:a,script:p}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["\ud83d\udc49 Edit this example in the ",(0,i.jsx)(s.A,{href:`/playground?example=${t.name}`,children:"playground"}),t.variant===l.sE.MIGRATION_V1?" and automatically migrate it to the v2 format using the convert button":"","."]}),(0,i.jsxs)(o.default,{children:[(0,i.jsx)(r.default,{value:"config",label:"Config",default:!0,children:(0,i.jsx)(n.default,{language:"js",showLineNumbers:!0,children:a})}),(0,i.jsx)(r.default,{value:"script",label:"Script",children:(0,i.jsx)(n.default,{language:"js",showLineNumbers:!0,children:p})})]}),(0,i.jsxs)("p",{children:[(0,i.jsxs)("span",{children:["Source: ",(0,i.jsxs)("a",{href:`${c}/${t.category}/${t.name}`,children:[t.name,".ts"]})]}),m("Issues",u,t.issues),m("PRs",d,t.pullRequests)]})]})}},301:(e,t,a)=>{a.d(t,{bk:()=>n,lI:()=>s,sE:()=>r});let s=function(e){return e.ACTIONS="actions",e.ADVANCED="advanced",e.BASICS="basics",e.FEATURES="features",e.MIGRATIONS="migrations",e.REGRESSIONS="regressions",e}({}),n=function(e){return e.CONFIG="config",e.DOCS="docs",e.DOCS_INDEX="docs-index",e.GAS_CODE="gas-code",e.GAS_TEST="gas-test",e.TEST_SPEC="test-spec",e}({}),r=function(e){return e.CUSTOM_ACTIONS="custom-actions",e.MIGRATION_V1="migration-v1",e}({})},3367:(e,t,a)=>{a.d(t,{Fw:()=>c,pq:()=>l});a(2744);var s=a(8158),n=a(6407),r=a(7694),o=a(301);const l={name:"regularExpressions",title:"Regular Expressions",description:"Regular expressions allow to define patterns and extract values to simplify the configuration.",category:o.lI.ADVANCED,skipGenerate:[o.bk.TEST_SPEC]},i=(l.name,{description:l.description,settings:{markProcessedMethod:n.Pn.MARK_MESSAGE_READ},global:{thread:{match:{query:`has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} is:unread subject:"${r.L.EMAIL_SUBJECT_PREFIX}${l.name}"`}}},threads:[{match:{query:"from:${user.email}"},messages:[{name:"extract-message-fields-from-subject",match:{subject:`${l.name} (?<school>[^-]+)-(?<reportType>[^-]+)-(?<reportSubType>[^-]+)-(?<date>[0-9-]+)`},attachments:[{match:{name:"^sample\\.docx$"},actions:[{name:"attachment.store",args:{location:`${r.L.DRIVE_TESTS_BASE_PATH}/${l.name}/Reports/\${message.subject.match.school}/All Reports/\${message.subject.match.reportType}/\${message.subject.match.reportSubType}/\${message.subject.match.date}-\${attachment.name}`,conflictStrategy:s.c2.UPDATE}}]}]}]}]}),c={info:l,config:i}},2744:(e,t,a)=>{a.d(t,{Ah:()=>n,GS:()=>o,KI:()=>r,jV:()=>s});let s=function(e){return e.DRY_RUN="dry-run",e.SAFE_MODE="safe-mode",e.DANGEROUS="dangerous",e}({}),n=function(e){return e.BOOLEAN="boolean",e.DATE="date",e.NUMBER="number",e.STRING="string",e.VARIABLE="variable",e}({});function r(e,t,a,s,n){return{deprecationInfo:n,description:s,title:a,type:e,value:t}}let o=function(e){return e.ERROR="error",e.OK="ok",e}({});Error},8158:(e,t,a)=>{a.d(t,{c2:()=>W});a(2744);var s=a(9749),n=a(857),r=a(7015),o=a(6749),l=a(3863),i=a(641),c=a(4773),u=a(2511),d=a(53),m=a(7456),p=a(6712),h=a(262),g=a(2695),f=a(5940),b=a(4844),x=a(9772),y=a(8908),v=a(7256),E=a(739),j=a(3365),A=a(4912),S=a(2829),T=a(5668),R=a(8274),k=a(341),$=a(5076),I=a(297),_=a(3572),w=a(9446),M=a(7616),N=a(2190),D=a(9585),V=a(6672),L=a(7244),C=a(4138),P=a(7376),O=a(8933),G=a(2702),U=a(1906),q=a(6560),B=a(7038),F=a(9590),K=a(2745),H=a(5407),z=a(3945),J=a(6014);a(4712),a(4758),a(3711);s.D,n.z,r.F,o.g,l.f,i.V,c.p,u.j,d.x,m.o,p.o,h.Q,g.B,f.o,b.d,x.K,y.W,v.E,E.T,j.j,A.u,S.R,T.u,R.G,k.H,$.M,I.N,_._,w.D,M.W,N.i,D.N,V.G,L.o,C.M,P.Q,O.b,G.w,U.c,q.w,B.a,F.a,K.R,H.R,z.D,J.K;let W=function(e){return e.BACKUP="backup",e.ERROR="error",e.KEEP="keep",e.REPLACE="replace",e.SKIP="skip",e.UPDATE="update",e}({})},6407:(e,t,a)=>{a.d(t,{$b:()=>c,GJ:()=>p,Pn:()=>u,c1:()=>g,we:()=>h});var s=a(4729),n=a(4467),r=a(8420),o=a(5136),l=a(5698),i=(a(5508),a(7158));let c=function(e){return e.TRACE="trace",e.DEBUG="debug",e.INFO="info",e.WARN="warn",e.ERROR="error",e}({}),u=function(e){return e.ADD_THREAD_LABEL="add-label",e.CUSTOM="custom",e.MARK_MESSAGE_READ="mark-read",e}({});class d{constructor(){(0,n.A)(this,"name",""),(0,n.A)(this,"title",""),(0,n.A)(this,"value",void 0),(0,n.A)(this,"ctxValues",{})}}let m=function(e){return e.NONE="none",e.AUTO="auto",e.ALL="all",e}({}),p=(0,s.A)(null,(function(e){return{F:class{constructor(){e(this)}},d:[{kind:"field",key:"defaultTimestampFormat",value:()=>"yyyy-MM-dd HH:mm:ss"},{kind:"field",key:"defaultArrayJoinSeparator",value:()=>","},{kind:"field",decorators:[(0,r.v)()],key:"logSheetLocation",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"logFields",value:()=>["log.timestamp","log.level","log.location","log.message","object.id","object.date","object.subject","object.from","object.url","attachment.name","attachment.size","attachment.contentType","stored.location","stored.url","stored.downloadUrl"]},{kind:"field",decorators:[(0,r.v)(),(0,o.Z)((()=>d))],key:"logConfig",value:()=>[{name:"log.timestamp",title:"Timestamp",value:"${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}"},{name:"log.level",title:"Log Level"},{name:"log.message",title:"Log Message"},{name:"context.type",title:"Context Type"},{name:"object.id",title:"ID",ctxValues:{attachment:"${attachment.hash}",message:"${message.id}",thread:"${thread.id}"}},{name:"object.url",title:"GMail URL",ctxValues:{attachment:"${message.url}",message:"${message.url}",thread:"${thread.url}"}},{name:"object.date",title:"Message Date",ctxValues:{attachment:"${message.date}",message:"${message.date}",thread:"${thread.lastMessageDate}"}},{name:"object.subject",title:"Subject",ctxValues:{attachment:"${message.subject}",message:"${message.subject}",thread:"${thread.firstMessageSubject}"}},{name:"object.from",title:"From",ctxValues:{attachment:"${message.from}",message:"${message.from}"}},{name:"attachment.name",title:"Attachment Name"},{name:"attachment.contentType",title:"Content Type"},{name:"attachment.size",title:"Attachment Size"},{name:"stored.location",title:"Stored Location",ctxValues:{attachment:"${attachment.stored.location}"}},{name:"stored.url",title:"Stored URL",ctxValues:{attachment:"${attachment.stored.url}"}},{name:"stored.downloadUrl",title:"Download URL",ctxValues:{attachment:"${attachment.stored.downloadUrl}"}}]},{kind:"field",key:"logLevel",value:()=>c.INFO},{kind:"field",key:"logSensitiveRedactionMode",value:()=>m.AUTO},{kind:"field",key:"logSheetTracing",value:()=>!1},{kind:"field",decorators:[(0,r.v)()],key:"maxBatchSize",value:()=>10},{kind:"field",decorators:[(0,r.v)()],key:"maxRuntime",value:()=>280},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedLabel",value:()=>""},{kind:"field",decorators:[(0,r.v)()],key:"markProcessedMethod",value:()=>u.MARK_MESSAGE_READ},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeThreads",value:()=>100},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeMessages",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"sleepTimeAttachments",value:()=>0},{kind:"field",decorators:[(0,r.v)()],key:"timezone",value:()=>"default"}]}}));function h(e){return void 0===e&&(e={}),(0,l.bj)(p,e,{exposeDefaultValues:!0,exposeUnsetFields:!1})}function g(e){return e=(0,i.I)(e,h(),{},["markProcessedMethod"])}},7694:(e,t,a)=>{a.d(t,{L:()=>n});var s=a(4467);class n{}(0,s.A)(n,"DRIVE_TESTS_BASE_PATH","/GmailProcessor-Tests/e2e"),(0,s.A)(n,"EMAIL_SLEEP_TIME_MS",1e4),(0,s.A)(n,"EMAIL_SUBJECT_PREFIX","[GmailProcessor-Test] "),(0,s.A)(n,"GIT_REPO_BASE_URL","https://raw.githubusercontent.com/ahochsteger/gmail-processor"),(0,s.A)(n,"GIT_REPO_BRANCH","main"),(0,s.A)(n,"GIT_REPO_TEST_FILES_PATH","src/e2e-test/files")},7158:(e,t,a)=>{function s(e,t,a,s){return void 0===a&&(a={}),void 0===s&&(s=[]),s=s.concat([]),Object.keys(e).forEach((n=>{const r=function(e,t){return Array.isArray(e)&&t?e=e.map((e=>t(e))):"object"==typeof e&&t&&(e=t(e)),e}(e[n],a[n]),o=JSON.stringify(r);s.includes(n)||null!==r&&o!==JSON.stringify(t[n])&&"[]"!==o&&"{}"!==o||delete e[n]})),e}a.d(t,{I:()=>s})}}]);