"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[6721],{8054:(e,d,s)=>{s.r(d),s.d(d,{assets:()=>h,contentTitle:()=>c,default:()=>a,frontMatter:()=>i,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"reference/enum-types","title":"Enum Types","description":"These are the supported enum types with their keys (only used for development) and values that can be used in the configuration.","source":"@site/docs/reference/enum-types.mdx","sourceDirName":"reference","slug":"/reference/enum-types","permalink":"/gmail-processor/docs/reference/enum-types","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/reference/enum-types.mdx","tags":[],"version":"current","sidebarPosition":32,"frontMatter":{"id":"enum-types","sidebar_position":32},"sidebar":"docsSidebar","previous":{"title":"Config Schema","permalink":"/gmail-processor/docs/reference/config-schema"},"next":{"title":"Actions","permalink":"/gmail-processor/docs/reference/actions"}}');var t=s(4848),n=s(8453);const i={id:"enum-types",sidebar_position:32},c="Enum Types",h={},l=[{value:"AttachmentOrderField",id:"attachmentorderfield",level:2},{value:"ConflictStrategy",id:"conflictstrategy",level:2},{value:"ContextType",id:"contexttype",level:2},{value:"E2EStatus",id:"e2estatus",level:2},{value:"LogLevel",id:"loglevel",level:2},{value:"LogRedactionMode",id:"logredactionmode",level:2},{value:"MarkProcessedMethod",id:"markprocessedmethod",level:2},{value:"MessageFlag",id:"messageflag",level:2},{value:"MessageOrderField",id:"messageorderfield",level:2},{value:"MetaInfoType",id:"metainfotype",level:2},{value:"OrderDirection",id:"orderdirection",level:2},{value:"PlaceholderModifierType",id:"placeholdermodifiertype",level:2},{value:"PlaceholderType",id:"placeholdertype",level:2},{value:"ProcessingStage",id:"processingstage",level:2},{value:"ProcessingStatus",id:"processingstatus",level:2},{value:"RunMode",id:"runmode",level:2},{value:"ThreadOrderField",id:"threadorderfield",level:2}];function o(e){const d={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.header,{children:(0,t.jsx)(d.h1,{id:"enum-types",children:"Enum Types"})}),"\n",(0,t.jsx)(d.p,{children:"These are the supported enum types with their keys (only used for development) and values that can be used in the configuration."}),"\n",(0,t.jsx)(d.h2,{id:"attachmentorderfield",children:"AttachmentOrderField"}),"\n",(0,t.jsx)(d.p,{children:"Represents an attachment field to be ordered by for processing."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"CONTENT_TYPE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"contentType"})}),(0,t.jsx)(d.td,{children:"Order by the content type of the attachment."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"HASH"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"hash"})}),(0,t.jsx)(d.td,{children:"Order by the hash of the attachment."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"NAME"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"name"})}),(0,t.jsx)(d.td,{children:"Order by the name of the attachment."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"conflictstrategy",children:"ConflictStrategy"}),"\n",(0,t.jsx)(d.p,{children:"Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"BACKUP"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"backup"})}),(0,t.jsx)(d.td,{children:"Create a backup of the existing file by renaming it."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ERROR"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"error"})}),(0,t.jsx)(d.td,{children:"Terminate processing with an error."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"KEEP"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"keep"})}),(0,t.jsx)(d.td,{children:"Keep the existing file and create the new one with the same name."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"REPLACE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"replace"})}),(0,t.jsx)(d.td,{children:"Replace the existing file with the new one."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"SKIP"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"skip"})}),(0,t.jsx)(d.td,{children:"Skip creating the new file and keep the existing one."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"UPDATE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"update"})}),(0,t.jsx)(d.td,{children:"Update the existing file with the contents of the new one (keep it's file ID)."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"contexttype",children:"ContextType"}),"\n",(0,t.jsx)(d.p,{children:"A type of context."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ATTACHMENT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"attachment"})}),(0,t.jsx)(d.td,{children:"A context holding the attachment configuration and information about the currently processed attachment."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ENV"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"env"})}),(0,t.jsx)(d.td,{children:"A context holding all environment information and references to environment objects."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"MESSAGE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"message"})}),(0,t.jsx)(d.td,{children:"A context holding the message configuration and information about the currently processed message."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"PROCESSING"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"proc"})}),(0,t.jsx)(d.td,{children:"A context holding all processing information like the configuration, integration adapters, action registry and timer."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"THREAD"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"thread"})}),(0,t.jsx)(d.td,{children:"A context holding the thread configuration and information about the currently processed thread."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"e2estatus",children:"E2EStatus"}),"\n",(0,t.jsx)(d.p,{children:"Status of end-to-end tests"}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ERROR"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"error"})}),(0,t.jsx)(d.td,{children:"An end-to-end test produced an error while executing."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"FAILED"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"failed"})}),(0,t.jsx)(d.td,{children:"The end-to-end test failed."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"SKIPPED"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"skipped"})}),(0,t.jsx)(d.td,{children:"The end-to-end test has been skipped."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"SUCCESS"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"success"})}),(0,t.jsx)(d.td,{children:"The end-to-end test was successful."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"loglevel",children:"LogLevel"}),"\n",(0,t.jsx)(d.p,{children:"Levels of log messages used for marking and filtering."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DEBUG"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"debug"})}),(0,t.jsx)(d.td,{children:"Log level for debugging messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ERROR"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"error"})}),(0,t.jsx)(d.td,{children:"Log level for error messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"INFO"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"info"})}),(0,t.jsx)(d.td,{children:"Log level for info messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"TRACE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"trace"})}),(0,t.jsx)(d.td,{children:"Log level for execution tracing"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"WARN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"warn"})}),(0,t.jsx)(d.td,{children:"Log level for warning messages."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"logredactionmode",children:"LogRedactionMode"}),"\n",(0,t.jsx)(d.p,{children:"Specifies how sensitive data should be redacted for logging."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ALL"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"all"})}),(0,t.jsx)(d.td,{children:"Redact all possibly sensitive data"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"AUTO"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"auto"})}),(0,t.jsx)(d.td,{children:"Automatically detect sensitive data to be redacted"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"NONE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"none"})}),(0,t.jsx)(d.td,{children:"Do not redact sensitive data at all."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"markprocessedmethod",children:"MarkProcessedMethod"}),"\n",(0,t.jsx)(d.p,{children:"The method to mark processed threads/messages/attachments."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ADD_THREAD_LABEL"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"add-label"})}),(0,t.jsxs)(d.td,{children:["Adds the label defined in the setting ",(0,t.jsx)(d.code,{children:"markProcessedLabel"})," to each processed thread.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"NOTE:"}),(0,t.jsx)("br",{}),"- Automatically appends the action ",(0,t.jsx)(d.code,{children:"thread.addLabel"})," to the list of global thread actions",(0,t.jsx)("br",{}),"- Automatically appends ",(0,t.jsx)(d.code,{children:"-label:<markProcessedLabel>"})," to the global thread match query config",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"Limitations:"}),(0,t.jsx)("br",{}),"- It cannot handle multiple messages per thread properly."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"CUSTOM"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"custom"})}),(0,t.jsxs)(d.td,{children:["Doesn't do anything to mark threads, messages or attachments as processed and leaves this task to the user.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"NOTE:"}),(0,t.jsx)("br",{}),"- Use actions on the desired level (threads, messages or attachments) to mark them as processed.",(0,t.jsx)("br",{}),"- Take care to exclude them from queries in the thread match config, to prevent re-processing over and over again.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"Limitations:"}),(0,t.jsx)("br",{}),"- Is more complex since you have to take care to"]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"MARK_MESSAGE_READ"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"mark-read"})}),(0,t.jsxs)(d.td,{children:["Marks processed messages as read, which is more flexible than adding a thread label.",(0,t.jsx)("br",{}),"But it comes at the cost of marking messages as read, which may not be expected.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"NOTE:"}),(0,t.jsx)("br",{}),"- Automatically appends the action ",(0,t.jsx)(d.code,{children:"message.markRead"})," to the list of global message actions",(0,t.jsx)("br",{}),"- Automatically appends ",(0,t.jsx)(d.code,{children:"-is:read"})," to the global thread match query config",(0,t.jsx)("br",{}),"- Automatically adds ",(0,t.jsx)(d.code,{children:'is: ["unread"]'})," to the global message match config",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"Limitations:"}),(0,t.jsx)("br",{}),"- Since it marks messages as read it may not be applicable in all cases."]})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"messageflag",children:"MessageFlag"}),"\n",(0,t.jsx)(d.p,{children:"A flag to match messages with certain properties."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"READ"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"read"})}),(0,t.jsx)(d.td,{children:"Matches read messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"STARRED"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"starred"})}),(0,t.jsx)(d.td,{children:"Matches starred messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"UNREAD"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"unread"})}),(0,t.jsx)(d.td,{children:"Matches unread messages."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"UNSTARRED"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"unstarred"})}),(0,t.jsx)(d.td,{children:"Matches un-starred messages."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"messageorderfield",children:"MessageOrderField"}),"\n",(0,t.jsx)(d.p,{children:"Represents a message field to be ordered by for processing."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DATE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"date"})}),(0,t.jsx)(d.td,{children:"Order by the date of the message."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"FROM"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"from"})}),(0,t.jsx)(d.td,{children:"Order by the sender of the message."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ID"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"id"})}),(0,t.jsx)(d.td,{children:"Order by the ID of the message."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"SUBJECT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"subject"})}),(0,t.jsx)(d.td,{children:"Order by the subject of the message."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"metainfotype",children:"MetaInfoType"}),"\n",(0,t.jsx)(d.p,{children:"The type of meta information used for context substitution placeholders."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"BOOLEAN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"boolean"})}),(0,t.jsxs)(d.td,{children:["Boolean type substituted to ",(0,t.jsx)(d.code,{children:"true"})," or ",(0,t.jsx)(d.code,{children:"false"}),"."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DATE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"date"})}),(0,t.jsxs)(d.td,{children:["Date/time type. For substitution a format string can be given using ",(0,t.jsx)(d.code,{children:"${<placeholder>:date:<expression>:<format>}"}),"."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"NUMBER"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"number"})}),(0,t.jsx)(d.td,{children:"A numeric data type."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"STRING"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"string"})}),(0,t.jsx)(d.td,{children:"A string data type."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"VARIABLE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"variable"})}),(0,t.jsx)(d.td,{children:"A custom configuration variable."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"orderdirection",children:"OrderDirection"}),"\n",(0,t.jsx)(d.p,{children:"Represents the direction a list should be ordered."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ASC"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"asc"})}),(0,t.jsx)(d.td,{children:"Order ascending."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DESC"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"desc"})}),(0,t.jsx)(d.td,{children:"Order descending."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"placeholdermodifiertype",children:"PlaceholderModifierType"}),"\n",(0,t.jsx)(d.p,{children:"The modifiers for placeholder expressions."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DATE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"date"})}),(0,t.jsxs)(d.td,{children:["The ",(0,t.jsx)(d.code,{children:"date"})," placeholder modifier converts the value of the given placeholder to a ",(0,t.jsx)(d.code,{children:"Date"})," and allows date/time calculations on it.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),"Syntax: ",(0,t.jsx)(d.code,{children:"${<placeholder>:date:[[<date-expression>][:<format>]]}"}),(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"<date-expression> = [<date-fns-function>][<+/-><parse-duration>]"}),": If no expression is given, the date of the placeholder is used unmodified.",(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"<date-fns-function>"}),": a supported ",(0,t.jsxs)(d.a,{href:"https://date-fns.org/docs/format",children:[(0,t.jsx)(d.code,{children:"date-fns"})," function"]})," as defined by the constant ",(0,t.jsxs)(d.a,{href:"https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/utils/DateUtils.ts",children:[(0,t.jsx)(d.code,{children:"DATE_FNS_FUNCTIONS"})," in DateUtils.ts"]}),(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"<parse-duration>"}),": a relative duration in the form of a ",(0,t.jsx)(d.a,{href:"https://github.com/jkroso/parse-duration#api",children:"parse-duration format string"}),(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"<format>"}),": Format the resulting date/time using a ",(0,t.jsx)(d.a,{href:"https://date-fns.org/docs/format",children:"date-fns format string"}),". If no format is given the setting ",(0,t.jsx)(d.code,{children:"defaultTimestampFormat"})," is used.",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),"Examples:",(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"${message.date:date:lastDayOfMonth-1d:yyyy-MM-DD}"}),": evaluates to the 2nd last day of the month in which the message has been sent.",(0,t.jsx)("br",{}),"* ",(0,t.jsx)(d.code,{children:"${message.body.match.invoiceDate:date:startOfMonth+4d+1month:yyyy-MM-DD}"}),": evaluates to the 5th day of the month following the invoice date (extracted using a regex from the message body)"]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"FORMAT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"format"})}),(0,t.jsxs)(d.td,{children:["Use ",(0,t.jsx)(d.code,{children:"${<placeholder>:format:<format>}"})," to format the date/time using a ",(0,t.jsx)(d.a,{href:"https://date-fns.org/docs/format",children:"date-fns format string"}),".",(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"DEPRECATED"}),": Use ",(0,t.jsx)(d.code,{children:"${<placeholder>:date::<format>}"})," instead. Note the double colon if no date modification expression is required."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"JOIN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"join"})}),(0,t.jsxs)(d.td,{children:["Use ",(0,t.jsx)(d.code,{children:"${<placeholder>:join[:<separator>]}"})," to join the values of an array into a string (default: ",(0,t.jsx)(d.code,{children:","}),")."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"NONE"})}),(0,t.jsx)(d.td,{children:"``"}),(0,t.jsx)(d.td,{children:"No modifier"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"OFFSET_FORMAT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"offset-format"})}),(0,t.jsxs)(d.td,{children:["Use ",(0,t.jsx)(d.code,{children:"${<placeholder>:offset-format:<offset>[:<format>]}"})," to calculate the date/time offset using a ",(0,t.jsx)(d.a,{href:"https://github.com/jkroso/parse-duration#parsestr-formatms",children:"parse-duration format string"})," and then format the resulting date/time using a ",(0,t.jsx)(d.a,{href:"https://date-fns.org/docs/format",children:"date-fns format strings"}),".",(0,t.jsx)("br",{}),(0,t.jsx)(d.strong,{children:"DEPRECATED"}),": Use ",(0,t.jsx)(d.code,{children:"${<placeholder>:date:<offset>[:<format>]}"})," instead."]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"UNSUPPORTED"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"unsupported"})}),(0,t.jsx)(d.td,{children:"Unsupported placeholder modifier type given."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"placeholdertype",children:"PlaceholderType"}),"\n",(0,t.jsx)(d.p,{children:"The type of a placeholder."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ATTACHMENT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"attachment"})}),(0,t.jsx)(d.td,{children:"An attachment placeholder type."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"MESSAGE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"message"})}),(0,t.jsx)(d.td,{children:"A message placeholder type."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"THREAD"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"thread"})}),(0,t.jsx)(d.td,{children:"A thread placeholder type."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"processingstage",children:"ProcessingStage"}),"\n",(0,t.jsx)(d.p,{children:"The stage of action processing"}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"MAIN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"main"})}),(0,t.jsx)(d.td,{children:"The stage during processing the main object (thread, message, attachment)"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"POST_MAIN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"post-main"})}),(0,t.jsx)(d.td,{children:"The stage after processing the main object (thread, message, attachment)"})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"PRE_MAIN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"pre-main"})}),(0,t.jsx)(d.td,{children:"The stage before processing the main object (thread, message, attachment)"})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"processingstatus",children:"ProcessingStatus"}),"\n",(0,t.jsx)(d.p,{children:"The result status of processing a config or an action."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ERROR"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"error"})}),(0,t.jsx)(d.td,{children:"An error has occurred."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"OK"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ok"})}),(0,t.jsx)(d.td,{children:"The processing was successful."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"runmode",children:"RunMode"}),"\n",(0,t.jsx)(d.p,{children:"The runtime mode in which processing takes place."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DANGEROUS"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"dangerous"})}),(0,t.jsxs)(d.td,{children:["This run-mode will execute all configured actions including possibly destructive actions like overwriting files or removing threads or messages.",(0,t.jsx)("br",{}),"ATTENTION: Use this only if you know exactly what you're doing and won't complain if something goes wrong!"]})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"DRY_RUN"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"dry-run"})}),(0,t.jsx)(d.td,{children:"This run-mode skips execution of writing actions. Use this for testing config changes or library upgrades."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"SAFE_MODE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"safe-mode"})}),(0,t.jsx)(d.td,{children:"This run-mode can be used for normal operation but will skip possibly destructive actions like overwriting files or removing threads or messages."})]})]})]}),"\n",(0,t.jsx)(d.h2,{id:"threadorderfield",children:"ThreadOrderField"}),"\n",(0,t.jsx)(d.p,{children:"Represents a thread field to be ordered by for processing."}),"\n",(0,t.jsxs)(d.table,{children:[(0,t.jsx)(d.thead,{children:(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.th,{children:"Key"}),(0,t.jsx)(d.th,{children:"Value"}),(0,t.jsx)(d.th,{children:"Description"})]})}),(0,t.jsxs)(d.tbody,{children:[(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"FIRST_MESSAGE_SUBJECT"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"firstMessageSubject"})}),(0,t.jsx)(d.td,{children:"Order by the subject of the first message in the thread."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"ID"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"id"})}),(0,t.jsx)(d.td,{children:"Order by the ID of the thread."})]}),(0,t.jsxs)(d.tr,{children:[(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"LAST_MESSAGE_DATE"})}),(0,t.jsx)(d.td,{children:(0,t.jsx)(d.code,{children:"lastMessageDate"})}),(0,t.jsx)(d.td,{children:"Order by the date of the last message in the thread."})]})]})]})]})}function a(e={}){const{wrapper:d}={...(0,n.R)(),...e.components};return d?(0,t.jsx)(d,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},8453:(e,d,s)=>{s.d(d,{R:()=>i,x:()=>c});var r=s(6540);const t={},n=r.createContext(t);function i(e){const d=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(d):{...d,...e}}),[d,e])}function c(e){let d;return d=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),r.createElement(n.Provider,{value:d},e.children)}}}]);