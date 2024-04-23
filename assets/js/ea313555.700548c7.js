"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[1011],{2362:(e,o,i)=>{i.r(o),i.d(o,{assets:()=>c,contentTitle:()=>t,default:()=>m,frontMatter:()=>s,metadata:()=>a,toc:()=>d});var n=i(4848),r=i(8453);const s={id:"faqs",sidebar_position:60},t="FAQs",a={id:"faqs",title:"FAQs",description:"How do I test my configuration without risking unwanted changes to Gmail or GDrive?",source:"@site/docs/faq.mdx",sourceDirName:".",slug:"/faqs",permalink:"/gmail-processor/docs/faqs",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/faq.mdx",tags:[],version:"current",sidebarPosition:60,frontMatter:{id:"faqs",sidebar_position:60},sidebar:"docsSidebar",previous:{title:"Migrating from Gmail2GDrive",permalink:"/gmail-processor/docs/migrating"},next:{title:"Development",permalink:"/gmail-processor/docs/development/"}},c={},d=[{value:"How do I test my configuration without risking unwanted changes to Gmail or GDrive?",id:"how-do-i-test-my-configuration-without-risking-unwanted-changes-to-gmail-or-gdrive",level:2},{value:"How do I migrate my configuration from GMail2GDrive to Gmail Processor?",id:"how-do-i-migrate-my-configuration-from-gmail2gdrive-to-gmail-processor",level:2},{value:"How do I use my own customized version of the Gmail Processor library?",id:"how-do-i-use-my-own-customized-version-of-the-gmail-processor-library",level:2},{value:"How do I use multiple configurations within a single Google Apps Script project?",id:"how-do-i-use-multiple-configurations-within-a-single-google-apps-script-project",level:2},{value:"How do I store GDrive attachments in emails?",id:"how-do-i-store-gdrive-attachments-in-emails",level:2}];function l(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"faqs",children:"FAQs"}),"\n",(0,n.jsx)(o.h2,{id:"how-do-i-test-my-configuration-without-risking-unwanted-changes-to-gmail-or-gdrive",children:"How do I test my configuration without risking unwanted changes to Gmail or GDrive?"}),"\n",(0,n.jsxs)(o.p,{children:["Use the ",(0,n.jsx)(o.code,{children:"dry-run"})," mode:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-javascript",children:'function run() {\n  // NOTE: Switch to "safe-mode" after testing the config\n  GmailProcessorLib.run(config, "dry-run")\n}\n'})}),"\n",(0,n.jsx)(o.h2,{id:"how-do-i-migrate-my-configuration-from-gmail2gdrive-to-gmail-processor",children:"How do I migrate my configuration from GMail2GDrive to Gmail Processor?"}),"\n",(0,n.jsxs)(o.p,{children:["Use the ",(0,n.jsx)(o.a,{href:"/playground",children:"playground"}),". See ",(0,n.jsx)(o.a,{href:"/gmail-processor/docs/migrating",children:"Migrating from GMail2GDrive"})," for details."]}),"\n",(0,n.jsx)(o.h2,{id:"how-do-i-use-my-own-customized-version-of-the-gmail-processor-library",children:"How do I use my own customized version of the Gmail Processor library?"}),"\n",(0,n.jsxs)(o.p,{children:["See ",(0,n.jsx)(o.a,{href:"/gmail-processor/docs/getting-started#copy-the-library-code-advanced",children:"Getting Started - Copy the Library Code"}),"."]}),"\n",(0,n.jsx)(o.h2,{id:"how-do-i-use-multiple-configurations-within-a-single-google-apps-script-project",children:"How do I use multiple configurations within a single Google Apps Script project?"}),"\n",(0,n.jsxs)(o.p,{children:["Make sure to give all variables and functions unique names since they all share the same namespace - even if located in different ",(0,n.jsx)(o.code,{children:"*.gs"})," files:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-javascript",children:"var config1 = {...}\nfunction run1() {\n  GmailProcessorLib.run(config1, ...)\n}\n\nvar config2 = {...}\nfunction run2() {\n  GmailProcessorLib.run(config2, ...)\n}\n"})}),"\n",(0,n.jsx)(o.h2,{id:"how-do-i-store-gdrive-attachments-in-emails",children:"How do I store GDrive attachments in emails?"}),"\n",(0,n.jsxs)(o.p,{children:["Use the following config snippet to extract the fileId and filename of the GDrive attachment from the email body and use it for the download URL of the ",(0,n.jsx)(o.code,{children:"message.storeFromURL"})," action:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-json",children:'  {\n    "match": {\n      "body": "(?s)<a href=\\"https://drive.google.com/file/d/(?<fileId>[^/]+)/view\\\\?usp=drivesdk\\".*<span [^>]+>(?<filename>[^<]+)</span>"\n    },\n    "actions": [\n      {\n        "name": "message.storeFromURL",\n        "args": {\n          "url": "https://drive.google.com/uc?id=${message.body.match.fileId}&export=download",\n          "location": "/some-path/${message.body.match.filename}",\n        }\n      }\n    ]\n  }\n'})})]})}function m(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},8453:(e,o,i)=>{i.d(o,{R:()=>t,x:()=>a});var n=i(6540);const r={},s=n.createContext(r);function t(e){const o=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),n.createElement(s.Provider,{value:o},e.children)}}}]);