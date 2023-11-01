"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[971],{9925:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var n=t(5893),i=t(1151);const r={id:"about",sidebar_position:10},a="About Gmail Processor",o={id:"about",title:"About Gmail Processor",description:"Gmail Processor is an open-source Google Apps Script library that automates the processing of Gmail messages and attachments by executing actions (e.g. store attachments in a GDrive folder, log information into a spreadsheet) depending on powerful matching criteria.",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/gmail-processor/docs/",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/index.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{id:"about",sidebar_position:10},sidebar:"docsSidebar",next:{title:"Getting Started",permalink:"/gmail-processor/docs/getting-started"}},l={},c=[{value:"Key Features",id:"key-features",level:2},{value:"How it Works",id:"how-it-works",level:2},{value:"More Information",id:"more-information",level:2}];function d(e){const s={a:"a",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"about-gmail-processor",children:"About Gmail Processor"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"https://github.com/ahochsteger/gmail-processor",children:"Gmail Processor"})})," is an open-source ",(0,n.jsx)(s.a,{href:"https://www.google.com/script/start/",children:"Google Apps Script"})," library that automates the processing of Gmail messages and attachments by executing actions (e.g. store attachments in a GDrive folder, log information into a spreadsheet) depending on powerful matching criteria."]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"Dall-e generated image: A friendly smiling robot sitting on a table, sorting mails into three paper trays, colorful flat style, white background",src:t(6121).Z+"",width:"320",height:"240"})}),"\n",(0,n.jsxs)(s.p,{children:["It is the successor of ",(0,n.jsx)(s.a,{href:"https://github.com/ahochsteger/gmail-processor/tree/1.x",children:"Gmail2GDrive"})," with vastly enhanced functionality, completely re-written in ",(0,n.jsx)(s.a,{href:"https://www.typescriptlang.org/",children:"TypeScript"})," with extensibility and stability in mind, using a modern development setup and automation all over the place (dependency updates, tests, documentation, releases, deployments). There's a convenient migration available to convert your old configuration to the new format (see ",(0,n.jsx)(s.a,{href:"#migrate-from-gmail2gdrive",children:"Getting Started: Migrating from GMail2GDrive v1"}),")."]}),"\n",(0,n.jsx)(s.h2,{id:"key-features",children:"Key Features"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["\ud83e\udd16 ",(0,n.jsx)(s.strong,{children:"Extensive Automation"}),": Automate email processing using the provided configuration to match threads, messages, and attachments, and trigger actions accordingly."]}),"\n",(0,n.jsxs)(s.li,{children:["\ud83d\udcc1 ",(0,n.jsx)(s.strong,{children:"Google Drive Integration"}),": Store files such as attachments, PDFs of messages, or entire threads into any location within Google Drive, providing easy organization and accessibility."]}),"\n",(0,n.jsxs)(s.li,{children:["\ud83d\udcc4 ",(0,n.jsx)(s.strong,{children:"Google Spreadsheet Logging"}),": Keep track of processed threads, messages, and attachments by logging valuable information into a Google Spreadsheet."]}),"\n",(0,n.jsxs)(s.li,{children:["\ud83d\udd27 ",(0,n.jsx)(s.strong,{children:"Flexible Configuration"}),": Gmail Processor operates based on a JSON configuration that allows you to define matching rules and specify corresponding actions to be executed."]}),"\n",(0,n.jsxs)(s.li,{children:["\ud83d\udcd0 ",(0,n.jsx)(s.strong,{children:"Extensible Architecture"}),": Designed with extensibility in mind, Gmail Processor enables seamless addition of new actions and integrations in the future to adapt to evolving requirements."]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"how-it-works",children:"How it Works"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"https://github.com/ahochsteger/gmail-processor",children:"Gmail Processor"})})," is fed with a JSON configuration that defines a hierarchical list of matching configurations (for threads, containing messages and containing attachments) as well as a list of actions on each level (e.g. export the thread as PDF to Google Drive, add a label to a thread, mark a message as read, store an attachment to a Google Drive folder, ...)."]}),"\n",(0,n.jsx)(s.p,{children:"To remember, which threads or messages have already been processed the following methods are currently supported (more to come if there is some demand):"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.strong,{children:"Mark processed threads by attaching a label"}),": This is recommended for simple cases without multiple mail messages in a single thread","\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"PROS: Keeps processed messages in an unread state."}),"\n",(0,n.jsx)(s.li,{children:"CONS: Cannot process additional messages that may be added after a thread has already been processed."}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.strong,{children:"Mark processed messages as read"}),": This is the recommended way because it also can deal with multiple messages per thread.","\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"PROS: Can process additional messages within the same thread even after a thread has already been processed."}),"\n",(0,n.jsx)(s.li,{children:"CONS: Marks the processed messages as read, which may be surprising if not paying attention to."}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.strong,{children:"Custom"}),": Leaves the decision on how to remember processed threads/messages to the user of the library using actions","\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"PROS: Most flexible, can deal with edge cases"}),"\n",(0,n.jsx)(s.li,{children:"CONS: Great care has to be taken that the matching configuration and the actions to mark entities as processed fit together. Otherwise they may get processed over and over again."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"more-information",children:"More Information"}),"\n",(0,n.jsx)(s.p,{children:"The following pages provide all required information to successfully use Gmail Processor:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["The ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"/gmail-processor/docs/getting-started",children:"Getting Started Guide"})})," shows how to setup Gmail Processor in Google Apps Script and quickly get it up and running."]}),"\n",(0,n.jsxs)(s.li,{children:["The ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"/gmail-processor/docs/reference/",children:"Config Reference"})})," provides detailed information about the Gmail Processor configuration."]}),"\n",(0,n.jsxs)(s.li,{children:["The ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"/gmail-processor/docs/examples/",children:"Examples"})})," show different ways of using Gmail Processor."]}),"\n",(0,n.jsxs)(s.li,{children:["The ",(0,n.jsx)(s.strong,{children:(0,n.jsx)(s.a,{href:"/playground",children:"Playground"})})," helps to create the configuration in a schema-aware online editor with a visual schema guide on the side."]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,i.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},6121:(e,s,t)=>{t.d(s,{Z:()=>n});const n=t.p+"assets/images/gmail-processor-robot-320-dc19d73004f0e24473dd5c834f7d3792.png"},1151:(e,s,t)=>{t.d(s,{Z:()=>o,a:()=>a});var n=t(7294);const i={},r=n.createContext(i);function a(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);