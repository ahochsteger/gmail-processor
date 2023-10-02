"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[162],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>g});var a=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,o=function(e,t){if(null==e)return{};var r,a,o={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(r),u=o,g=d["".concat(s,".").concat(u)]||d[u]||m[u]||n;return r?a.createElement(g,i(i({ref:t},c),{},{components:r})):a.createElement(g,i({ref:t},c))}));function g(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,i=new Array(n);i[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[d]="string"==typeof e?e:o,i[1]=l;for(var p=2;p<n;p++)i[p]=r[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},9390:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>n,metadata:()=>l,toc:()=>p});var a=r(7462),o=(r(7294),r(3905));const n={sidebar_position:20},i="Getting Started",l={unversionedId:"getting-started",id:"getting-started",title:"Getting Started",description:"There are different ways to get started with GmailProcessor in your Google Apps Script project:",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started",permalink:"/gmail-processor/docs/getting-started",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/getting-started.md",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20},sidebar:"docsSidebar",previous:{title:"Documentation",permalink:"/gmail-processor/docs/"},next:{title:"Config Reference",permalink:"/gmail-processor/docs/reference/"}},s={},p=[{value:"Use a Library Reference (recommended)",id:"use-a-library-reference-recommended",level:2},{value:"Copy the Library Code (advanced)",id:"copy-the-library-code-advanced",level:2},{value:"Migrate from GMail2GDrive",id:"migrate-from-gmail2gdrive",level:2},{value:"Required API Permissions",id:"required-api-permissions",level:2}],c={toc:p},d="wrapper";function m(e){let{components:t,...r}=e;return(0,o.kt)(d,(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"getting-started"},"Getting Started"),(0,o.kt)("p",null,"There are different ways to get started with GmailProcessor in your Google Apps Script project:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#use-a-library-reference-recommended"},(0,o.kt)("strong",{parentName:"a"},"Use")," a library reference (recommended)"),": Use this, if you just want to use the library, get easy updates and don't want to fiddle with the library code at all."),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#copy-the-library-code-advanced"},(0,o.kt)("strong",{parentName:"a"},"Copy")," the library code (advanced)"),": Use this if you want full control over what's being executed or if you want to use your own modified library versions."),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#migrate-from-gmail2gdrive"},(0,o.kt)("strong",{parentName:"a"},"Migrate")," from GMail2GDrive"),": Use this, if you've used GMail2GDrive before and want to migrate to Gmail Processor.")),(0,o.kt)("h2",{id:"use-a-library-reference-recommended"},"Use a Library Reference (recommended)"),(0,o.kt)("p",null,"To use the Gmail Processor library directly within Google Apps Script, you can choose from three available release channels with the associated script IDs - depending on your needs:"),(0,o.kt)("p",null,"Follow these steps:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Open ",(0,o.kt)("a",{parentName:"li",href:"https://script.google.com/home?hl=en"},"Google Apps Script"),"."),(0,o.kt)("li",{parentName:"ol"},"Create an empty project and give it a name (e.g. ",(0,o.kt)("inlineCode",{parentName:"li"},"MyGmailProcessor"),") or select an existing one."),(0,o.kt)("li",{parentName:"ol"},"Add the library in the Libraries section using the \uff0b icon and insert this Script ID:",(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-text"},"1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB\n"))),(0,o.kt)("li",{parentName:"ol"},'Press "Look up" and select the desired release number as ',(0,o.kt)("strong",{parentName:"li"},"version"),' (recommended for stability) or "HEAD (Development Mode)" (recommended for automatically staying up-to-date with the potential risk of broken updates).',(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"See the ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/ahochsteger/gmail-processor/releases"},"Gmail Processor Release Notes")," for their corresponding Google Apps Script library version."),(0,o.kt)("li",{parentName:"ul"},"Or use this URL to verify the release version of a Google Apps Script Library: ",(0,o.kt)("a",{parentName:"li",href:"https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/%7BlibVersion%7D"},"https://script.google.com/macros/library/d/1Qvk0v7ggfW-TJ84dlYPlDzJG8y-Dif-j9kdA1aWv4wzxE_IOkeV2juLB/{libVersion}")," (replace ",(0,o.kt)("inlineCode",{parentName:"li"},"{libVersion}")," with the number from the drop-down in Google Apps Script)."))),(0,o.kt)("li",{parentName:"ol"},"Set the ",(0,o.kt)("strong",{parentName:"li"},"identifier")," to ",(0,o.kt)("inlineCode",{parentName:"li"},"GmailProcessorLib")," (any name will do, but we will use this identifier as a reference in all ",(0,o.kt)("a",{parentName:"li",href:"/gmail-processor/docs/examples"},"examples")," and documentation)"),(0,o.kt)("li",{parentName:"ol"},"Replace the contents of the initially created file ",(0,o.kt)("inlineCode",{parentName:"li"},"Code.gs")," with the code from the ",(0,o.kt)("a",{parentName:"li",href:"/gmail-processor/docs/examples#gettingstartedjs"},"Getting Started Example")," and save the changes."),(0,o.kt)("li",{parentName:"ol"},"Perform an initial execution of the function ",(0,o.kt)("inlineCode",{parentName:"li"},"run")," to grant all required permissions (see ",(0,o.kt)("a",{parentName:"li",href:"#required-api-permissions"},"Required API Permissions")," for more details):",(0,o.kt)("ol",{parentName:"li"},(0,o.kt)("li",{parentName:"ol"},"Select your account you want to grant access for"),(0,o.kt)("li",{parentName:"ol"},'When the message "Google did not verify the app" click on "Advanced" and "Go to ..." to proceed'),(0,o.kt)("li",{parentName:"ol"},'Grant access to all listed apps by clicking "Allow"')))),(0,o.kt)("p",null,"Now you can start using the Gmail Processor Library in your script file (e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"Code.gs"),") of your Google Apps Script project as follows:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'var config = {\n  settings: {\n    // Decide the mark processed method to be used:\n    markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.MY_CHOSEN_METHOD,\n  },\n  threads: [{}],\n  // Define your configuration JSON\n}\n\nfunction run() {\n  // NOTE: Switch to "safe-mode" after testing the config\n  GmailProcessorLib.run(config, "dry-run")\n}\n')),(0,o.kt)("p",null,"Adjust the configuration (see section ",(0,o.kt)("a",{parentName:"p",href:"/gmail-processor/docs/reference/"},"Configuration Reference"),") to your needs. It's always recommended to test config changes using a ",(0,o.kt)("em",{parentName:"p"},"dry-run")," by passing ",(0,o.kt)("inlineCode",{parentName:"p"},"dry-run")," as the 2nd parameter to the ",(0,o.kt)("inlineCode",{parentName:"p"},"run")," function. That doesn't touch anything (neither in GMail nor GDrive) but produces a log that shows what would have been done. This way any change in your configuration or an upgrade to a newer version of the library can be tested without any risk of data-loss."),(0,o.kt)("p",null,"If you're satisfied with the results change the run mode from ",(0,o.kt)("inlineCode",{parentName:"p"},"dry-run")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"safe-mode")," to actually do the processing and execute the ",(0,o.kt)("inlineCode",{parentName:"p"},"run")," function again.\nFor automatic triggering you can create a ",(0,o.kt)("a",{parentName:"p",href:"https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually"},"time-based trigger")," that runs at certain intervals (e.g. once per day or every hour)."),(0,o.kt)("h2",{id:"copy-the-library-code-advanced"},"Copy the Library Code (advanced)"),(0,o.kt)("p",null,"To use a copy of the library code in your project simply replace steps 3-5 from above with the following steps:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},'Create a new file using the + icon at "Files" and selecting "Script"'),(0,o.kt)("li",{parentName:"ol"},"Give it a name (e.g. ",(0,o.kt)("inlineCode",{parentName:"li"},"GmailProcessorLib")," resulting in the file ",(0,o.kt)("inlineCode",{parentName:"li"},"GmailProcessorLib.gs")," to be created)"),(0,o.kt)("li",{parentName:"ol"},"Replace the contents of the file with the library code of the release asset ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/ahochsteger/gmail-processor/releases/latest/download/GmailProcessorLib.js"},(0,o.kt)("inlineCode",{parentName:"a"},"GmailProcessorLib.js"))," from the latest release or your own built version from ",(0,o.kt)("inlineCode",{parentName:"li"},"build/gas/lib/GmailProcessorLib.js"),".")),(0,o.kt)("p",null,"Follow the remaining steps from step 6 onwards from above."),(0,o.kt)("h2",{id:"migrate-from-gmail2gdrive"},"Migrate from GMail2GDrive"),(0,o.kt)("p",null,"Make sure, you've done the initial steps above (e.g. ",(0,o.kt)("a",{parentName:"p",href:"#use-a-library-reference-recommended"},"use a library reference"),") before migrating the old configuration to the new format."),(0,o.kt)("p",null,"The ",(0,o.kt)("a",{parentName:"p",href:"/playground"},"Playground")," provides a convenient way to migrate your old GMail2GDrive configuration to the new format of Gmail Processor by following these steps:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Copy the JSON configuration from GMail2GDrive (just the config, not the full code!) to the clipboard."),(0,o.kt)("li",{parentName:"ol"},"Use the paste action (\ud83d\udccb) in the config toolbar to paste the config into the editor."),(0,o.kt)("li",{parentName:"ol"},"Convert the config using the convert action (\ud83d\udd04) to transform the configuration into the new Gmail Processor format."),(0,o.kt)("li",{parentName:"ol"},"Copy the full executable code (\ud83d\ude80) and paste it into ",(0,o.kt)("inlineCode",{parentName:"li"},"Code.gs")," of Google Apps Script.")),(0,o.kt)("p",null,"If you want to manually convert your configuration or need to understand how the transformation is done have a look at ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/config/v1/V1ToV2Converter.ts"},"V1ToV2Converter.ts")," that implements the conversion logic."),(0,o.kt)("h2",{id:"required-api-permissions"},"Required API Permissions"),(0,o.kt)("p",null,"To enable full processing of the emails the following ",(0,o.kt)("a",{parentName:"p",href:"https://developers.google.com/identity/protocols/oauth2/scopes#script"},"OAuth Scopes for Google APIs")," are requested and need to be granted:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://mail.google.com/"),": Access Gmail API to process emails"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://www.googleapis.com/auth/drive"),": Access Google Drive API to store files"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://www.googleapis.com/auth/script.external_request"),": Used for end-to-end tests to fetch example attachments via HTTP"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://www.googleapis.com/auth/script.send_mail"),": Used for end-to-end tests to send example emails"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://www.googleapis.com/auth/spreadsheets"),": Access Google Spreadsheets API to store logs of processed emails"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"https://www.googleapis.com/auth/userinfo.email"),": Get the user's email address to be used in the configuration")))}m.isMDXComponent=!0}}]);