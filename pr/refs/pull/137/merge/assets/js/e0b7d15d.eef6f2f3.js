"use strict";(self.webpackChunkdocs_new=self.webpackChunkdocs_new||[]).push([[283],{3905:(e,t,i)=>{i.d(t,{Zo:()=>l,kt:()=>f});var a=i(7294);function r(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function n(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,a)}return i}function s(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?n(Object(i),!0).forEach((function(t){r(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function o(e,t){if(null==e)return{};var i,a,r=function(e,t){if(null==e)return{};var i,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)i=n[a],t.indexOf(i)>=0||(r[i]=e[i]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)i=n[a],t.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(r[i]=e[i])}return r}var c=a.createContext({}),d=function(e){var t=a.useContext(c),i=t;return e&&(i="function"==typeof e?e(t):s(s({},t),e)),i},l=function(e){var t=d(e.components);return a.createElement(c.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var i=e.components,r=e.mdxType,n=e.originalType,c=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),p=d(i),h=r,f=p["".concat(c,".").concat(h)]||p[h]||m[h]||n;return i?a.createElement(f,s(s({ref:t},l),{},{components:i})):a.createElement(f,s({ref:t},l))}));function f(e,t){var i=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=i.length,s=new Array(n);s[0]=h;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[p]="string"==typeof e?e:r,s[1]=o;for(var d=2;d<n;d++)s[d]=i[d];return a.createElement.apply(null,s)}return a.createElement.apply(null,i)}h.displayName="MDXCreateElement"},8137:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>p,contentTitle:()=>d,default:()=>g,frontMatter:()=>c,metadata:()=>l,toc:()=>m});var a=i(7462),r=(i(7294),i(3905)),n=i(8385),s=i(8570),o=i.n(s);const c={sidebar_position:31},d="Config Schema",l={unversionedId:"reference/config-schema",id:"reference/config-schema",title:"Config Schema",description:"",source:"@site/docs/reference/config-schema.mdx",sourceDirName:"reference",slug:"/reference/config-schema",permalink:"/gmail-processor/docs/reference/config-schema",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/reference/config-schema.mdx",tags:[],version:"current",sidebarPosition:31,frontMatter:{sidebar_position:31},sidebar:"docsSidebar",previous:{title:"Config Reference",permalink:"/gmail-processor/docs/reference/"},next:{title:"Enum Types",permalink:"/gmail-processor/docs/reference/enum-types"}},p={},m=[],h={toc:m},f="wrapper";function g(e){let{components:t,...i}=e;return(0,r.kt)(f,(0,a.Z)({},h,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"config-schema"},"Config Schema"),(0,r.kt)(o(),{schema:n,mdxType:"JSONSchemaViewer"}))}g.isMDXComponent=!0},8385:e=>{e.exports=JSON.parse('{"$schema":"http://json-schema.org/draft-07/schema#","additionalProperties":false,"definitions":{"AttachmentActionConfig":{"additionalProperties":false,"description":"Represents a config to perform a actions for a GMail attachment.","properties":{"args":{"additionalProperties":{},"description":"The arguments for a certain action","title":"args","type":"object"},"description":{"default":"","description":"The description for the action","title":"description","type":"string"},"name":{"default":"","description":"The name of the action to be executed","enum":["","attachment.store","global.log","global.panic","global.sheetLog","message.forward","message.markRead","message.markUnread","message.moveToTrash","message.star","message.storePDF","message.unstar","thread.addLabel","thread.markImportant","thread.markRead","thread.markUnimportant","thread.markUnread","thread.moveToArchive","thread.moveToInbox","thread.moveToSpam","thread.moveToTrash","thread.removeLabel","thread.storePDF"],"title":"name","type":"string"},"processingStage":{"description":"The processing stage in which the action should run (during main processing stage or pre-main/post-main)","enum":["main","post-main","pre-main"],"title":"processingStage","type":"string"}},"required":["name"],"title":"AttachmentActionConfig","type":"object"},"AttachmentConfig":{"additionalProperties":false,"description":"Represents a config to handle a certain GMail attachment","properties":{"actions":{"default":[],"description":"The list actions to be executed for their respective handler scopes","items":{"$ref":"#/definitions/AttachmentActionConfig"},"title":"actions","type":"array"},"description":{"default":"","description":"The description of the attachment handler config","title":"description","type":"string"},"match":{"$ref":"#/definitions/AttachmentMatchConfig","description":"Specifies which attachments match for further processing","title":"match"},"name":{"default":"","description":"The unique name of the attachment config (will be generated if not set)","title":"name","type":"string"}},"title":"AttachmentConfig","type":"object"},"AttachmentMatchConfig":{"additionalProperties":false,"description":"Represents a config to match a certain GMail attachment","properties":{"contentType":{"default":".*","description":"A RegEx matching the content type of the attachment","title":"contentType","type":"string"},"includeAttachments":{"default":true,"description":"Should regular attachments be included in attachment processing (default: true)","title":"includeAttachments","type":"boolean"},"includeInlineImages":{"default":true,"description":"Should inline images be included in attachment processing (default: true)","title":"includeInlineImages","type":"boolean"},"largerThan":{"default":-1,"description":"Only include attachments larger than the given size in bytes.\\nSet to `-1` to ignore it.","title":"largerThan","type":"number"},"name":{"default":"(.*)","description":"A RegEx matching the name of the attachment","title":"name","type":"string"},"smallerThan":{"default":-1,"description":"Only include attachments smaller than the given size in bytes.\\nSet to `-1` to ignore it.","title":"smallerThan","type":"number"}},"title":"AttachmentMatchConfig","type":"object"},"GlobalConfig":{"additionalProperties":false,"description":"The global configuration defines matching and actions for all threads, messages or attachments.","properties":{"attachment":{"$ref":"#/definitions/AttachmentConfig","description":"The global attachment config affecting each attachment.","title":"attachment"},"message":{"$ref":"#/definitions/MessageConfig","description":"The global message config affecting each message.","title":"message"},"thread":{"$ref":"#/definitions/ThreadConfig","description":"The list of global thread affecting each thread.","title":"thread"},"variables":{"default":[],"description":"A list of variable entries to be used in substitutions to simplify configurations.","items":{"$ref":"#/definitions/VariableEntry"},"title":"variables","type":"array"}},"title":"GlobalConfig","type":"object"},"MessageActionConfig":{"additionalProperties":false,"description":"Represents a config to perform a actions for a GMail message.","properties":{"args":{"additionalProperties":{},"description":"The arguments for a certain action","title":"args","type":"object"},"description":{"default":"","description":"The description for the action","title":"description","type":"string"},"name":{"default":"","description":"The name of the action to be executed","enum":["","global.log","global.panic","global.sheetLog","message.forward","message.markRead","message.markUnread","message.moveToTrash","message.star","message.storePDF","message.unstar","thread.addLabel","thread.markImportant","thread.markRead","thread.markUnimportant","thread.markUnread","thread.moveToArchive","thread.moveToInbox","thread.moveToSpam","thread.moveToTrash","thread.removeLabel","thread.storePDF"],"title":"name","type":"string"},"processingStage":{"description":"The processing stage in which the action should run (during main processing stage or pre-main/post-main)","enum":["main","post-main","pre-main"],"title":"processingStage","type":"string"}},"required":["name"],"title":"MessageActionConfig","type":"object"},"MessageConfig":{"additionalProperties":false,"description":"Represents a config to handle a certain GMail message","properties":{"actions":{"default":[],"description":"The list actions to be executed for their respective handler scopes","items":{"$ref":"#/definitions/MessageActionConfig"},"title":"actions","type":"array"},"attachments":{"default":[],"description":"The list of handler that define the way attachments are processed","items":{"$ref":"#/definitions/AttachmentConfig"},"title":"attachments","type":"array"},"description":{"default":"","description":"The description of the message handler config","title":"description","type":"string"},"match":{"$ref":"#/definitions/MessageMatchConfig","description":"Specifies which attachments match for further processing","title":"match"},"name":{"default":"","description":"The unique name of the message config (will be generated if not set)","title":"name","type":"string"}},"title":"MessageConfig","type":"object"},"MessageFlag":{"description":"A flag to match messages with certain properties.","enum":["read","starred","unread","unstarred"],"title":"MessageFlag","type":"string"},"MessageMatchConfig":{"additionalProperties":false,"description":"Represents a config to match a certain GMail message","properties":{"from":{"default":".*","description":"A RegEx matching the sender email address of messages","title":"from","type":"string"},"is":{"default":[],"description":"A list of properties matching messages should have","items":{"$ref":"#/definitions/MessageFlag"},"title":"is","type":"array"},"newerThan":{"default":"","description":"An RFC 3339 date/time format matching messages older than the given date/time","title":"newerThan","type":"string"},"olderThan":{"default":"","description":"An RFC 3339 date/time format matching messages older than the given date/time","title":"olderThan","type":"string"},"subject":{"default":".*","description":"A RegEx matching the subject of messages","title":"subject","type":"string"},"to":{"default":".*","description":"A RegEx matching the recipient email address of messages","title":"to","type":"string"}},"title":"MessageMatchConfig","type":"object"},"SettingsConfig":{"additionalProperties":false,"description":"Represents a settings config that affect the way GmailProcessor works.","properties":{"logSheetLocation":{"default":"","description":"Path of the spreadsheet log file. Enables logging to a spreadsheet if not empty.\\nExample: `GmailProcessor/logsheet-${date.now:format:yyyy-MM}`","title":"logSheetLocation","type":"string"},"markProcessedLabel":{"default":"","description":"The label to be added to processed GMail threads (only for markProcessedMode=\\"label\\", deprecated - only for compatibility to v1)","title":"markProcessedLabel","type":"string"},"markProcessedMethod":{"description":"The method to mark processed threads/messages.","enum":["add-label","custom","mark-read"],"title":"markProcessedMethod","type":"string"},"maxBatchSize":{"default":10,"description":"The maximum batch size of threads to process in a single run to respect Google processing limits","title":"maxBatchSize","type":"number"},"maxRuntime":{"default":280,"description":"The maximum runtime in seconds for a single run to respect Google processing limits","title":"maxRuntime","type":"number"},"sleepTimeAttachments":{"default":0,"description":"The sleep time in milliseconds between processing each attachment","title":"sleepTimeAttachments","type":"number"},"sleepTimeMessages":{"default":0,"description":"The sleep time in milliseconds between processing each message","title":"sleepTimeMessages","type":"number"},"sleepTimeThreads":{"default":100,"description":"The sleep time in milliseconds between processing each thread","title":"sleepTimeThreads","type":"number"},"timezone":{"default":"default","description":"The timezone to be used for date/time operations.\\nValue `default` uses the <a href=\\"https://developers.google.com/apps-script/reference/base/session#getscripttimezone\\">script timezone</a>.","title":"timezone","type":"string"}},"title":"SettingsConfig","type":"object"},"ThreadActionConfig":{"additionalProperties":false,"description":"Represents a config to perform a actions for a GMail thread.","properties":{"args":{"additionalProperties":{},"description":"The arguments for a certain action","title":"args","type":"object"},"description":{"default":"","description":"The description for the action","title":"description","type":"string"},"name":{"default":"","description":"The name of the action to be executed","enum":["","global.log","global.panic","global.sheetLog","thread.addLabel","thread.markImportant","thread.markRead","thread.markUnimportant","thread.markUnread","thread.moveToArchive","thread.moveToInbox","thread.moveToSpam","thread.moveToTrash","thread.removeLabel","thread.storePDF"],"title":"name","type":"string"},"processingStage":{"description":"The processing stage in which the action should run (during main processing stage or pre-main/post-main)","enum":["main","post-main","pre-main"],"title":"processingStage","type":"string"}},"required":["name"],"title":"ThreadActionConfig","type":"object"},"ThreadConfig":{"additionalProperties":false,"description":"Represents a config handle a certain GMail thread","properties":{"actions":{"default":[],"description":"The list actions to be executed for their respective handler scopes","items":{"$ref":"#/definitions/ThreadActionConfig"},"title":"actions","type":"array"},"attachments":{"default":[],"description":"The list of handler that define the way attachments are processed","items":{"$ref":"#/definitions/AttachmentConfig"},"title":"attachments","type":"array"},"description":{"default":"","description":"The description of the thread handler config","title":"description","type":"string"},"match":{"$ref":"#/definitions/ThreadMatchConfig","description":"Specifies which threads match for further processing","title":"match"},"messages":{"default":[],"description":"The list of handler that define the way nested messages or attachments are processed","items":{"$ref":"#/definitions/MessageConfig"},"title":"messages","type":"array"},"name":{"default":"","description":"The unique name of the thread config (will be generated if not set)","title":"name","type":"string"}},"title":"ThreadConfig","type":"object"},"ThreadMatchConfig":{"additionalProperties":false,"description":"Represents a config to match a certain GMail thread","properties":{"firstMessageSubject":{"default":".*","description":"The regex to match `firstMessageSubject`","title":"firstMessageSubject","type":"string"},"labels":{"default":".*","description":"The regex to match at least one label","title":"labels","type":"string"},"maxMessageCount":{"default":-1,"description":"The maximum number of messages a matching thread is allowed to have.\\nSet to `-1` to ignore it.","title":"maxMessageCount","type":"number"},"minMessageCount":{"default":1,"description":"The minimum number of messages a matching thread must have.\\nSet to `-1` to ignore it.","title":"minMessageCount","type":"number"},"query":{"default":"","description":"The GMail search query additional to the global query to find threads to be processed.\\nSee [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.","title":"query","type":"string"}},"title":"ThreadMatchConfig","type":"object"},"VariableEntry":{"additionalProperties":false,"description":"A variable entry available for string substitution (using `${variables.<varName>}`)","properties":{"key":{"title":"key","type":"string"},"value":{"title":"value","type":"string"}},"required":["key","value"],"title":"VariableEntry","type":"object"}},"description":"The input configuration for Gmail Processor.","properties":{"attachments":{"default":[],"description":"The list of handler that define the way attachments are processed","items":{"$ref":"#/definitions/AttachmentConfig"},"title":"attachments","type":"array"},"description":{"default":"","description":"The description of the GmailProcessor config","title":"description","type":"string"},"global":{"$ref":"#/definitions/GlobalConfig","description":"The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.","title":"global"},"messages":{"default":[],"description":"The list of handler that define the way nested messages or attachments are processed","items":{"$ref":"#/definitions/MessageConfig"},"title":"messages","type":"array"},"settings":{"$ref":"#/definitions/SettingsConfig","description":"Represents a settings config that affect the way GmailProcessor works.","title":"settings"},"threads":{"default":[],"description":"The list of handler that define the way nested threads, messages or attachments are processed","items":{"$ref":"#/definitions/ThreadConfig"},"title":"threads","type":"array"}},"type":"object"}')}}]);