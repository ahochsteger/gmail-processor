"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[6721],{1746:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>a,frontMatter:()=>n,metadata:()=>c,toc:()=>h});var d=r(4848),t=r(8453);const n={id:"enum-types",sidebar_position:32},i="Enum Types",c={id:"reference/enum-types",title:"Enum Types",description:"These are the supported enum types and the possible values that can be used in the configuration.",source:"@site/docs/reference/enum-types.mdx",sourceDirName:"reference",slug:"/reference/enum-types",permalink:"/gmail-processor/docs/reference/enum-types",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/reference/enum-types.mdx",tags:[],version:"current",sidebarPosition:32,frontMatter:{id:"enum-types",sidebar_position:32},sidebar:"docsSidebar",previous:{title:"Config Schema",permalink:"/gmail-processor/docs/reference/config-schema"},next:{title:"Actions",permalink:"/gmail-processor/docs/reference/actions"}},l={},h=[{value:"AttachmentOrderField",id:"attachmentorderfield",level:2},{value:"ConflictStrategy",id:"conflictstrategy",level:2},{value:"ContextType",id:"contexttype",level:2},{value:"E2EStatus",id:"e2estatus",level:2},{value:"LogLevel",id:"loglevel",level:2},{value:"LogRedactionMode",id:"logredactionmode",level:2},{value:"MarkProcessedMethod",id:"markprocessedmethod",level:2},{value:"MessageFlag",id:"messageflag",level:2},{value:"MessageOrderField",id:"messageorderfield",level:2},{value:"MetaInfoType",id:"metainfotype",level:2},{value:"OrderDirection",id:"orderdirection",level:2},{value:"PlaceholderModifierType",id:"placeholdermodifiertype",level:2},{value:"PlaceholderType",id:"placeholdertype",level:2},{value:"ProcessingStage",id:"processingstage",level:2},{value:"ProcessingStatus",id:"processingstatus",level:2},{value:"RunMode",id:"runmode",level:2},{value:"ThreadOrderField",id:"threadorderfield",level:2}];function o(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,t.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.h1,{id:"enum-types",children:"Enum Types"}),"\n",(0,d.jsx)(s.p,{children:"These are the supported enum types and the possible values that can be used in the configuration."}),"\n",(0,d.jsx)(s.h2,{id:"attachmentorderfield",children:"AttachmentOrderField"}),"\n",(0,d.jsx)(s.p,{children:"Represents an attachment field to be ordered by for processing."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"contentType"})}),(0,d.jsx)(s.td,{children:"Order by the content type of the attachment."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"hash"})}),(0,d.jsx)(s.td,{children:"Order by the hash of the attachment."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"name"})}),(0,d.jsx)(s.td,{children:"Order by the name of the attachment."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"conflictstrategy",children:"ConflictStrategy"}),"\n",(0,d.jsx)(s.p,{children:"Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"backup"})}),(0,d.jsx)(s.td,{children:"Create a backup of the existing file by renaming it."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"error"})}),(0,d.jsx)(s.td,{children:"Terminate processing with an error."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"keep"})}),(0,d.jsx)(s.td,{children:"Keep the existing file and create the new one with the same name."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"replace"})}),(0,d.jsx)(s.td,{children:"Replace the existing file with the new one."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"skip"})}),(0,d.jsx)(s.td,{children:"Skip creating the new file and keep the existing one."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"update"})}),(0,d.jsx)(s.td,{children:"Update the existing file with the contents of the new one (keep it's file ID)."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"contexttype",children:"ContextType"}),"\n",(0,d.jsx)(s.p,{children:"A type of context."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"attachment"})}),(0,d.jsx)(s.td,{children:"A context holding the attachment configuration and information about the currently processed attachment."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"env"})}),(0,d.jsx)(s.td,{children:"A context holding all environment information and references to environment objects."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"message"})}),(0,d.jsx)(s.td,{children:"A context holding the message configuration and information about the currently processed message."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"proc"})}),(0,d.jsx)(s.td,{children:"A context holding all processing information like the configuration, integration adapters, action registry and timer."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"thread"})}),(0,d.jsx)(s.td,{children:"A context holding the thread configuration and information about the currently processed thread."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"e2estatus",children:"E2EStatus"}),"\n",(0,d.jsx)(s.p,{children:"Status of end-to-end tests"}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"error"})}),(0,d.jsx)(s.td,{children:"An end-to-end test produced an error while executing."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"failed"})}),(0,d.jsx)(s.td,{children:"The end-to-end test failed."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"skipped"})}),(0,d.jsx)(s.td,{children:"The end-to-end test has been skipped."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"success"})}),(0,d.jsx)(s.td,{children:"The end-to-end test was successful."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"loglevel",children:"LogLevel"}),"\n",(0,d.jsx)(s.p,{children:"Levels of log messages used for marking and filtering."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"debug"})}),(0,d.jsx)(s.td,{children:"Log level for debugging messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"error"})}),(0,d.jsx)(s.td,{children:"Log level for error messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"info"})}),(0,d.jsx)(s.td,{children:"Log level for info messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"trace"})}),(0,d.jsx)(s.td,{children:"Log level for execution tracing"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"warn"})}),(0,d.jsx)(s.td,{children:"Log level for warning messages."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"logredactionmode",children:"LogRedactionMode"}),"\n",(0,d.jsx)(s.p,{children:"Specifies how sensitive data should be redacted for logging."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"all"})}),(0,d.jsx)(s.td,{children:"Redact all possibly sensitive data"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"auto"})}),(0,d.jsx)(s.td,{children:"Automatically detect sensitive data to be redacted"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"none"})}),(0,d.jsx)(s.td,{children:"Do not redact sensitive data at all."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"markprocessedmethod",children:"MarkProcessedMethod"}),"\n",(0,d.jsx)(s.p,{children:"The method to mark processed threads/messages/attachments."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"add-label"})}),(0,d.jsxs)(s.td,{children:["Adds the label defined in the setting ",(0,d.jsx)(s.code,{children:"markProcessedLabel"})," to each processed thread.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"NOTE:"}),(0,d.jsx)("br",{}),"- Automatically appends the action ",(0,d.jsx)(s.code,{children:"thread.addLabel"})," to the list of global thread actions",(0,d.jsx)("br",{}),"- Automatically appends ",(0,d.jsx)(s.code,{children:"-label:<markProcessedLabel>"})," to the global thread match query config",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"Limitations:"}),(0,d.jsx)("br",{}),"- It cannot handle multiple messages per thread properly."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"custom"})}),(0,d.jsxs)(s.td,{children:["Doesn't do anything to mark threads, messages or attachments as processed and leaves this task to the user.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"NOTE:"}),(0,d.jsx)("br",{}),"- Use actions on the desired level (threads, messages or attachments) to mark them as processed.",(0,d.jsx)("br",{}),"- Take care to exclude them from queries in the thread match config, to prevent re-processing over and over again.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"Limitations:"}),(0,d.jsx)("br",{}),"- Is more complex since you have to take care to"]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"mark-read"})}),(0,d.jsxs)(s.td,{children:["Marks processed messages as read, which is more flexible than adding a thread label.",(0,d.jsx)("br",{}),"But it comes at the cost of marking messages as read, which may not be expected.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"NOTE:"}),(0,d.jsx)("br",{}),"- Automatically appends the action ",(0,d.jsx)(s.code,{children:"message.markRead"})," to the list of global message actions",(0,d.jsx)("br",{}),"- Automatically appends ",(0,d.jsx)(s.code,{children:"-is:read"})," to the global thread match query config",(0,d.jsx)("br",{}),"- Automatically adds ",(0,d.jsx)(s.code,{children:'is: ["unread"]'})," to the global message match config",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"Limitations:"}),(0,d.jsx)("br",{}),"- Since it marks messages as read it may not be applicable in all cases."]})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"messageflag",children:"MessageFlag"}),"\n",(0,d.jsx)(s.p,{children:"A flag to match messages with certain properties."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"read"})}),(0,d.jsx)(s.td,{children:"Matches read messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"starred"})}),(0,d.jsx)(s.td,{children:"Matches starred messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"unread"})}),(0,d.jsx)(s.td,{children:"Matches unread messages."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"unstarred"})}),(0,d.jsx)(s.td,{children:"Matches un-starred messages."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"messageorderfield",children:"MessageOrderField"}),"\n",(0,d.jsx)(s.p,{children:"Represents a message field to be ordered by for processing."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"date"})}),(0,d.jsx)(s.td,{children:"Order by the date of the message."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"from"})}),(0,d.jsx)(s.td,{children:"Order by the sender of the message."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"id"})}),(0,d.jsx)(s.td,{children:"Order by the ID of the message."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"subject"})}),(0,d.jsx)(s.td,{children:"Order by the subject of the message."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"metainfotype",children:"MetaInfoType"}),"\n",(0,d.jsx)(s.p,{children:"The type of meta information used for context substitution placeholders."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"boolean"})}),(0,d.jsxs)(s.td,{children:["Boolean type substituted to ",(0,d.jsx)(s.code,{children:"true"})," or ",(0,d.jsx)(s.code,{children:"false"}),"."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"date"})}),(0,d.jsxs)(s.td,{children:["Date/time type. For substitution a format string can be given using ",(0,d.jsx)(s.code,{children:"${<placeholder>:date:<expression>:<format>}"}),"."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"number"})}),(0,d.jsx)(s.td,{children:"A numeric data type."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"string"})}),(0,d.jsx)(s.td,{children:"A string data type."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"variable"})}),(0,d.jsx)(s.td,{children:"A custom configuration variable."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"orderdirection",children:"OrderDirection"}),"\n",(0,d.jsx)(s.p,{children:"Represents the direction a list should be ordered."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"asc"})}),(0,d.jsx)(s.td,{children:"Order ascending."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"desc"})}),(0,d.jsx)(s.td,{children:"Order descending."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"placeholdermodifiertype",children:"PlaceholderModifierType"}),"\n",(0,d.jsx)(s.p,{children:"The modifiers for placeholder expressions."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"date"})}),(0,d.jsxs)(s.td,{children:["The ",(0,d.jsx)(s.code,{children:"date"})," placeholder modifier converts the value of the given placeholder to a ",(0,d.jsx)(s.code,{children:"Date"})," and allows date/time calculations on it.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),"Syntax: ",(0,d.jsx)(s.code,{children:"${<placeholder>:date:[[<date-expression>][:<format>]]}"}),(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"<date-expression> = [<date-fns-function>][<+/-><parse-duration>]"}),": If no expression is given, the date of the placeholder is used unmodified.",(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"<date-fns-function>"}),": a supported ",(0,d.jsxs)(s.a,{href:"https://date-fns.org/docs/format",children:[(0,d.jsx)(s.code,{children:"date-fns"})," function"]})," as defined by the constant ",(0,d.jsxs)(s.a,{href:"https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/utils/DateUtils.ts",children:[(0,d.jsx)(s.code,{children:"DATE_FNS_FUNCTIONS"})," in DateUtils.ts"]}),(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"<parse-duration>"}),": a relative duration in the form of a ",(0,d.jsx)(s.a,{href:"https://github.com/jkroso/parse-duration#api",children:"parse-duration format string"}),(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"<format>"}),": Format the resulting date/time using a ",(0,d.jsx)(s.a,{href:"https://date-fns.org/docs/format",children:"date-fns format string"}),". If no format is given the setting ",(0,d.jsx)(s.code,{children:"defaultTimestampFormat"})," is used.",(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),"Examples:",(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"${message.date:date:lastDayOfMonth-1d:yyyy-MM-DD}"}),": evaluates to the 2nd last day of the month in which the message has been sent.",(0,d.jsx)("br",{}),"* ",(0,d.jsx)(s.code,{children:"${message.body.match.invoiceDate:date:startOfMonth+4d+1month:yyyy-MM-DD}"}),": evaluates to the 5th day of the month following the invoice date (extracted using a regex from the message body)"]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"format"})}),(0,d.jsxs)(s.td,{children:["Use ",(0,d.jsx)(s.code,{children:"${<placeholder>:format:<format>}"})," to format the date/time using a ",(0,d.jsx)(s.a,{href:"https://date-fns.org/docs/format",children:"date-fns format string"}),".",(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"DEPRECATED"}),": Use ",(0,d.jsx)(s.code,{children:"${<placeholder>:date::<format>}"})," instead. Note the double colon if no date modification expression is required."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"join"})}),(0,d.jsxs)(s.td,{children:["Use ",(0,d.jsx)(s.code,{children:"${<placeholder>:join[:<separator>]}"})," to join the values of an array into a string (default: ",(0,d.jsx)(s.code,{children:","}),")."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:"``"}),(0,d.jsx)(s.td,{children:"No modifier"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"offset-format"})}),(0,d.jsxs)(s.td,{children:["Use ",(0,d.jsx)(s.code,{children:"${<placeholder>:offset-format:<offset>[:<format>]}"})," to calculate the date/time offset using a ",(0,d.jsx)(s.a,{href:"https://github.com/jkroso/parse-duration#parsestr-formatms",children:"parse-duration format string"})," and then format the resulting date/time using a ",(0,d.jsx)(s.a,{href:"https://date-fns.org/docs/format",children:"date-fns format strings"}),".",(0,d.jsx)("br",{}),(0,d.jsx)(s.strong,{children:"DEPRECATED"}),": Use ",(0,d.jsx)(s.code,{children:"${<placeholder>:date:<offset>[:<format>]}"})," instead."]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"unsupported"})}),(0,d.jsx)(s.td,{children:"Unsupported placeholder modifier type given."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"placeholdertype",children:"PlaceholderType"}),"\n",(0,d.jsx)(s.p,{children:"The type of a placeholder."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"attachment"})}),(0,d.jsx)(s.td,{children:"An attachment placeholder type."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"message"})}),(0,d.jsx)(s.td,{children:"A message placeholder type."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"thread"})}),(0,d.jsx)(s.td,{children:"A thread placeholder type."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"processingstage",children:"ProcessingStage"}),"\n",(0,d.jsx)(s.p,{children:"The stage of action processing"}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"main"})}),(0,d.jsx)(s.td,{children:"The stage during processing the main object (thread, message, attachment)"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"post-main"})}),(0,d.jsx)(s.td,{children:"The stage after processing the main object (thread, message, attachment)"})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"pre-main"})}),(0,d.jsx)(s.td,{children:"The stage before processing the main object (thread, message, attachment)"})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"processingstatus",children:"ProcessingStatus"}),"\n",(0,d.jsx)(s.p,{children:"The result status of processing a config or an action."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"error"})}),(0,d.jsx)(s.td,{children:"An error has occurred."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"ok"})}),(0,d.jsx)(s.td,{children:"The processing was successful."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"runmode",children:"RunMode"}),"\n",(0,d.jsx)(s.p,{children:"The runtime mode in which processing takes place."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"dangerous"})}),(0,d.jsxs)(s.td,{children:["This run-mode will execute all configured actions including possibly destructive actions like overwriting files or removing threads or messages.",(0,d.jsx)("br",{}),"ATTENTION: Use this only if you know exactly what you're doing and won't complain if something goes wrong!"]})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"dry-run"})}),(0,d.jsx)(s.td,{children:"This run-mode skips execution of writing actions. Use this for testing config changes or library upgrades."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"safe-mode"})}),(0,d.jsx)(s.td,{children:"This run-mode can be used for normal operation but will skip possibly destructive actions like overwriting files or removing threads or messages."})]})]})]}),"\n",(0,d.jsx)(s.h2,{id:"threadorderfield",children:"ThreadOrderField"}),"\n",(0,d.jsx)(s.p,{children:"Represents a thread field to be ordered by for processing."}),"\n",(0,d.jsxs)(s.table,{children:[(0,d.jsx)(s.thead,{children:(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.th,{children:"Value"}),(0,d.jsx)(s.th,{children:"Description"})]})}),(0,d.jsxs)(s.tbody,{children:[(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"lastMessageDate"})}),(0,d.jsx)(s.td,{children:"Order by the date of the last message in the thread."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"id"})}),(0,d.jsx)(s.td,{children:"Order by the ID of the thread."})]}),(0,d.jsxs)(s.tr,{children:[(0,d.jsx)(s.td,{children:(0,d.jsx)(s.code,{children:"firstMessageSubject"})}),(0,d.jsx)(s.td,{children:"Order by the subject of the first message in the thread."})]})]})]})]})}function a(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,d.jsx)(s,{...e,children:(0,d.jsx)(o,{...e})}):o(e)}},8453:(e,s,r)=>{r.d(s,{R:()=>i,x:()=>c});var d=r(6540);const t={},n=d.createContext(t);function i(e){const s=d.useContext(n);return d.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),d.createElement(n.Provider,{value:s},e.children)}}}]);