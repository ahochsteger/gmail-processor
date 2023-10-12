"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[749],{3905:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=n.createContext({}),m=function(e){var t=n.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=m(e.components);return n.createElement(d.Provider,{value:t},e.children)},p="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,d=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),p=m(a),c=r,h=p["".concat(d,".").concat(c)]||p[c]||k[c]||l;return a?n.createElement(h,o(o({ref:t},s),{},{components:a})):n.createElement(h,o({ref:t},s))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=c;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i[p]="string"==typeof e?e:r,o[1]=i;for(var m=2;m<l;m++)o[m]=a[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},2692:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>k,frontMatter:()=>l,metadata:()=>i,toc:()=>m});var n=a(7462),r=(a(7294),a(3905));const l={id:"actions",sidebar_position:33},o="Actions",i={unversionedId:"reference/actions",id:"reference/actions",title:"Actions",description:"Overview",source:"@site/docs/reference/actions.md",sourceDirName:"reference",slug:"/reference/actions",permalink:"/gmail-processor/docs/reference/actions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/reference/actions.md",tags:[],version:"current",sidebarPosition:33,frontMatter:{id:"actions",sidebar_position:33},sidebar:"docsSidebar",previous:{title:"Enum Types",permalink:"/gmail-processor/docs/reference/enum-types"},next:{title:"Placeholder",permalink:"/gmail-processor/docs/reference/placeholder"}},d={},m=[{value:"Overview",id:"overview",level:2},{value:"Attachment Actions",id:"attachment-actions",level:2},{value:"<code>attachment.store</code>",id:"attachmentstore",level:3},{value:"Global Actions",id:"global-actions",level:2},{value:"<code>global.log</code>",id:"globallog",level:3},{value:"<code>global.panic</code>",id:"globalpanic",level:3},{value:"<code>global.sheetLog</code>",id:"globalsheetlog",level:3},{value:"Message Actions",id:"message-actions",level:2},{value:"<code>message.forward</code>",id:"messageforward",level:3},{value:"<code>message.markRead</code>",id:"messagemarkread",level:3},{value:"<code>message.markUnread</code>",id:"messagemarkunread",level:3},{value:"<code>message.moveToTrash</code>",id:"messagemovetotrash",level:3},{value:"<code>message.star</code>",id:"messagestar",level:3},{value:"<code>message.storeFromURL</code>",id:"messagestorefromurl",level:3},{value:"<code>message.storePDF</code>",id:"messagestorepdf",level:3},{value:"<code>message.unstar</code>",id:"messageunstar",level:3},{value:"Thread Actions",id:"thread-actions",level:2},{value:"<code>thread.addLabel</code>",id:"threadaddlabel",level:3},{value:"<code>thread.markImportant</code>",id:"threadmarkimportant",level:3},{value:"<code>thread.markRead</code>",id:"threadmarkread",level:3},{value:"<code>thread.markUnimportant</code>",id:"threadmarkunimportant",level:3},{value:"<code>thread.markUnread</code>",id:"threadmarkunread",level:3},{value:"<code>thread.moveToArchive</code>",id:"threadmovetoarchive",level:3},{value:"<code>thread.moveToInbox</code>",id:"threadmovetoinbox",level:3},{value:"<code>thread.moveToSpam</code>",id:"threadmovetospam",level:3},{value:"<code>thread.moveToTrash</code>",id:"threadmovetotrash",level:3},{value:"<code>thread.removeLabel</code>",id:"threadremovelabel",level:3},{value:"<code>thread.storePDF</code>",id:"threadstorepdf",level:3}],s={toc:m},p="wrapper";function k(e){let{components:t,...a}=e;return(0,r.kt)(p,(0,n.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"actions"},"Actions"),(0,r.kt)("h2",{id:"overview"},"Overview"),(0,r.kt)("p",null,"The actions can be only be triggered in valid processing scopes:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#global-actions"},(0,r.kt)("inlineCode",{parentName:"a"},"global.*")),": Globally available, can be placed anywhere in the configuration."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#thread-actions"},(0,r.kt)("inlineCode",{parentName:"a"},"thread.*")),": Run in the context of a thread (includes ",(0,r.kt)("inlineCode",{parentName:"li"},"message")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"attachment")," context)."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#message-actions"},(0,r.kt)("inlineCode",{parentName:"a"},"message.*")),": Run in the context of a message (includes ",(0,r.kt)("inlineCode",{parentName:"li"},"attachment")," context)."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#attachment-actions"},(0,r.kt)("inlineCode",{parentName:"a"},"attachment.*")),": Run in the context of an attachment.")),(0,r.kt)("h2",{id:"attachment-actions"},"Attachment Actions"),(0,r.kt)("h3",{id:"attachmentstore"},(0,r.kt)("inlineCode",{parentName:"h3"},"attachment.store")),(0,r.kt)("p",null,"Store an attachment to a Google Drive location."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"conflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"ConflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},"The strategy to be used in case a file already exists at the desired location. See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#conflictstrategy"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"ConflictStrategy"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"description")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The description to be attached to the Google Drive file.",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"location")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The location (path + filename) of the Google Drive file.",(0,r.kt)("br",null),"For shared folders or Team Drives prepend the location with the folder ID like ",(0,r.kt)("inlineCode",{parentName:"td"},"{id:<folderId>}/..."),".",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")))),(0,r.kt)("h2",{id:"global-actions"},"Global Actions"),(0,r.kt)("h3",{id:"globallog"},(0,r.kt)("inlineCode",{parentName:"h3"},"global.log")),(0,r.kt)("p",null,"Create a log entry."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"level")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"LogLevel")),(0,r.kt)("td",{parentName:"tr",align:null},"The level of the log message (default: ",(0,r.kt)("inlineCode",{parentName:"td"},"info"),"). See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#loglevel"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"LogLevel"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"message")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The message to be logged.")))),(0,r.kt)("h3",{id:"globalpanic"},(0,r.kt)("inlineCode",{parentName:"h3"},"global.panic")),(0,r.kt)("p",null,"Terminate processing due to an error."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"message")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The message to be logged before termination.")))),(0,r.kt)("h3",{id:"globalsheetlog"},(0,r.kt)("inlineCode",{parentName:"h3"},"global.sheetLog")),(0,r.kt)("p",null,"Create a log entry in the log spreadsheet."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"level")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"LogLevel")),(0,r.kt)("td",{parentName:"tr",align:null},"The level of the log message (default: info). See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#loglevel"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"LogLevel"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"message")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The message to be logged.")))),(0,r.kt)("h2",{id:"message-actions"},"Message Actions"),(0,r.kt)("h3",{id:"messageforward"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.forward")),(0,r.kt)("p",null,"Forwards this message."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"to")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The recipient of the forwarded message.")))),(0,r.kt)("h3",{id:"messagemarkread"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.markRead")),(0,r.kt)("p",null,"Marks the message as read."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"messagemarkunread"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.markUnread")),(0,r.kt)("p",null,"Marks the message as unread."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"messagemovetotrash"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.moveToTrash")),(0,r.kt)("p",null,"Moves the message to the trash."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"messagestar"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.star")),(0,r.kt)("p",null,"Adds a star to a message."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"messagestorefromurl"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.storeFromURL")),(0,r.kt)("p",null,"Store a document referenced by a URL contained in the message body to GDrive."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"conflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"ConflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},"The strategy to be used in case a file already exists at the desired location. See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#conflictstrategy"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"ConflictStrategy"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"description")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The description to be attached to the Google Drive file.",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"headers")),(0,r.kt)("td",{parentName:"tr",align:null},"``"),(0,r.kt)("td",{parentName:"tr",align:null},"The header to pass to the URL. May be used to pass an authentication token.",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"location")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The location (path + filename) of the Google Drive file.",(0,r.kt)("br",null),"For shared folders or Team Drives prepend the location with ",(0,r.kt)("inlineCode",{parentName:"td"},"{id:<folderId>}"),".",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"url")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The URL of the document to be stored.",(0,r.kt)("br",null),"To extract the URL from the message body use a message body matcher like ",(0,r.kt)("inlineCode",{parentName:"td"},'"(?<url>https://...)"')," and ",(0,r.kt)("inlineCode",{parentName:"td"},'"${message.body.match.url}"')," as the URL value.",(0,r.kt)("br",null),"NOTE: Take care to narrow down the regex as good as possible to extract valid URLs.",(0,r.kt)("br",null),"Use tools like ",(0,r.kt)("a",{parentName:"td",href:"https://regex101.com"},"regex101.com")," for testing on example messages.")))),(0,r.kt)("h3",{id:"messagestorepdf"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.storePDF")),(0,r.kt)("p",null,"Generate a PDF document from the message and store it to GDrive."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"conflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"ConflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},"The strategy to be used in case a file already exists at the desired location. See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#conflictstrategy"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"ConflictStrategy"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"description")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The description to be attached to the Google Drive file.",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"location")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The location (path + filename) of the Google Drive file.",(0,r.kt)("br",null),"For shared folders or Team Drives prepend the location with ",(0,r.kt)("inlineCode",{parentName:"td"},"{id:<folderId>}"),".",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"skipHeader")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("td",{parentName:"tr",align:null},"Skip the header if ",(0,r.kt)("inlineCode",{parentName:"td"},"true"),".")))),(0,r.kt)("h3",{id:"messageunstar"},(0,r.kt)("inlineCode",{parentName:"h3"},"message.unstar")),(0,r.kt)("p",null,"Removes the star from a message."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h2",{id:"thread-actions"},"Thread Actions"),(0,r.kt)("h3",{id:"threadaddlabel"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.addLabel")),(0,r.kt)("p",null,"Add a label to the thread."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"name")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The name of the label.")))),(0,r.kt)("h3",{id:"threadmarkimportant"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.markImportant")),(0,r.kt)("p",null,"Mark the thread as important."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmarkread"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.markRead")),(0,r.kt)("p",null,"Mark the thread as read."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmarkunimportant"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.markUnimportant")),(0,r.kt)("p",null,"Mark the thread as unimportant."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmarkunread"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.markUnread")),(0,r.kt)("p",null,"Mark the thread as unread."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmovetoarchive"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.moveToArchive")),(0,r.kt)("p",null,"Move the thread to the archive."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmovetoinbox"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.moveToInbox")),(0,r.kt)("p",null,"Move the thread to the inbox."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmovetospam"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.moveToSpam")),(0,r.kt)("p",null,"Move the thread to spam."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadmovetotrash"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.moveToTrash")),(0,r.kt)("p",null,"Move the thread to trash."),(0,r.kt)("p",null,"This acton takes no arguments."),(0,r.kt)("h3",{id:"threadremovelabel"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.removeLabel")),(0,r.kt)("p",null,"Remove a label from the thread."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"name")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The name of the label.")))),(0,r.kt)("h3",{id:"threadstorepdf"},(0,r.kt)("inlineCode",{parentName:"h3"},"thread.storePDF")),(0,r.kt)("p",null,"Generate a PDF document for the whole thread and store it to GDrive."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Arguments"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"conflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"ConflictStrategy")),(0,r.kt)("td",{parentName:"tr",align:null},"The strategy to be used in case a file already exists at the desired location. See ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/enum-types#conflictstrategy"},"Enum Type ",(0,r.kt)("inlineCode",{parentName:"a"},"ConflictStrategy"))," for valid values.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"description")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The description to be attached to the Google Drive file.",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"location")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"The location (path + filename) of the Google Drive file.",(0,r.kt)("br",null),"For shared folders or Team Drives prepend the location with ",(0,r.kt)("inlineCode",{parentName:"td"},"{id:<folderId>}"),".",(0,r.kt)("br",null),"Supports ",(0,r.kt)("a",{parentName:"td",href:"/gmail-processor/docs/reference/placeholder"},"placeholder")," substitution.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"skipHeader")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("td",{parentName:"tr",align:null},"Skip the header if ",(0,r.kt)("inlineCode",{parentName:"td"},"true"),".")))))}k.isMDXComponent=!0}}]);