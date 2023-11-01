"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[156],{9174:(e,s,a)=>{a.r(s),a.d(s,{assets:()=>m,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var t=a(5893),r=a(1151),n=a(5878);const i=JSON.parse('{"description":"This is a simple configuration example.","settings":{"markProcessedMethod":"mark-read","maxBatchSize":10,"maxRuntime":280,"sleepTimeThreads":100,"sleepTimeMessages":0,"sleepTimeAttachments":0,"timezone":"UTC"},"global":{"thread":{"match":{"query":"has:attachment -in:trash -in:drafts -in:spam newer_than:1d","maxMessageCount":-1,"minMessageCount":1},"actions":[]}},"threads":[{"description":"Store all attachments sent to my.name+scans@gmail.com to the folder \'Scans\'","match":{"query":"to:my.name+scans@gmail.com"},"actions":[{"name":"thread.storePDF","args":{"location":"GmailProcessor-Tests/${thread.firstMessageSubject}.pdf","conflictStrategy":"keep"}}]}]}'),o={},c="example01",l={id:"examples/example01",title:"example01",description:"",source:"@site/docs/examples/example01.mdx",sourceDirName:"examples",slug:"/examples/example01",permalink:"/gmail-processor/docs/examples/example01",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/examples/example01.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Examples",permalink:"/gmail-processor/docs/examples/"},next:{title:"example02",permalink:"/gmail-processor/docs/examples/example02"}},m={},p=[];function d(e){const s={code:"code",h1:"h1",...(0,r.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"example01",children:(0,t.jsx)(s.code,{children:"example01"})}),"\n",(0,t.jsx)(n.Z,{name:"example01",config:i})]})}function h(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},5878:(e,s,a)=>{a.d(s,{Z:()=>o});var t=a(9960),r=a(9286),n=(a(7294),a(5893));const i="https://github.com/ahochsteger/gmail-processor/blob/main/src/gas/examples/";function o(e){let{name:s,config:a,title:o=s}=e;const c=s+".json",l=s+".js";return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("p",{children:a?.description}),(0,n.jsxs)("p",{children:["NOTE: Copy the example and paste it into the ",(0,n.jsx)(t.Z,{href:"/playground",children:"playground"})," to modify it."]}),(0,n.jsx)(r.default,{language:"jsx",showLineNumbers:!0,title:c,children:JSON.stringify(a,null,2)}),(0,n.jsxs)("p",{children:["Source files: ",(0,n.jsx)("a",{href:`${i}/${c}`,children:c}),", ",(0,n.jsx)("a",{href:`${i}/${l}`,children:l})]})]})}}}]);