"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[4127],{82239:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"development/devbox","title":"Devbox Environment","description":"Getting Started","source":"@site/docs/development/devbox.md","sourceDirName":"development","slug":"/development/devbox","permalink":"/gmail-processor/docs/development/devbox","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/devbox.md","tags":[],"version":"current","frontMatter":{},"sidebar":"docsSidebar","previous":{"title":"Development","permalink":"/gmail-processor/docs/development/"},"next":{"title":"Community","permalink":"/gmail-processor/docs/community/"}}');var r=s(74848),i=s(28453);const o={},c="Devbox Environment",l={},d=[{value:"Getting Started",id:"getting-started",level:2},{value:"Scripts",id:"scripts",level:2},{value:"Shell Init Hook",id:"shell-init-hook",level:2},{value:"Packages",id:"packages",level:2},{value:"Script Details",id:"script-details",level:2},{value:"devbox run npm",id:"devbox-run-npm",level:3}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"devbox-environment",children:"Devbox Environment"})}),"\n",(0,r.jsx)(n.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,r.jsxs)(n.p,{children:["This project uses ",(0,r.jsx)(n.a,{href:"https://github.com/jetify-com/devbox",children:"devbox"})," to manage its development environment."]}),"\n",(0,r.jsx)(n.p,{children:"Install devbox:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"curl -fsSL https://get.jetpack.io/devbox | bash\n"})}),"\n",(0,r.jsx)(n.p,{children:"Start the devbox shell:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"devbox shell\n"})}),"\n",(0,r.jsx)(n.p,{children:"Run a script in the devbox environment:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"devbox run <script>\n"})}),"\n",(0,r.jsx)(n.h2,{id:"scripts",children:"Scripts"}),"\n",(0,r.jsx)(n.p,{children:"Scripts are custom commands that can be run using this project's environment. This project has the following scripts:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#devbox-run-npm",children:"npm"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"shell-init-hook",children:"Shell Init Hook"}),"\n",(0,r.jsxs)(n.p,{children:["The Shell Init Hook is a script that runs whenever the devbox environment is instantiated. It runs on ",(0,r.jsx)(n.code,{children:"devbox shell"})," and on ",(0,r.jsx)(n.code,{children:"devbox run"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:'test -z $DEVBOX_COREPACK_ENABLED || corepack enable --install-directory "/home/a13870/private/ws/github/ahochsteger/gmail-processor/.devbox/virtenv/nodejs/corepack-bin/"\ntest -z $DEVBOX_COREPACK_ENABLED || export PATH="/home/a13870/private/ws/github/ahochsteger/gmail-processor/.devbox/virtenv/nodejs/corepack-bin/:$PATH"\necho \'Welcome to gmail-processor devbox!\' > /dev/null\n'})}),"\n",(0,r.jsx)(n.h2,{id:"packages",children:"Packages"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.nixhub.io/packages/nodejs",children:"nodejs@20"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.nixhub.io/packages/gojq",children:"gojq@0"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.nixhub.io/packages/gh",children:"gh@2"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.nixhub.io/packages/gomplate",children:"gomplate@3"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.nixhub.io/packages/gettext",children:"gettext@0"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"script-details",children:"Script Details"}),"\n",(0,r.jsx)(n.h3,{id:"devbox-run-npm",children:"devbox run npm"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:'npm run "${@}"\n'})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>c});var t=s(96540);const r={},i=t.createContext(r);function o(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);