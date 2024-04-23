"use strict";(self.webpackChunkgmail_processor_docs=self.webpackChunkgmail_processor_docs||[]).push([[4127],{9278:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var s=t(4848),i=t(8453);const r={},o="Devbox Environment",c={id:"development/devbox",title:"Devbox Environment",description:"Getting Started",source:"@site/docs/development/devbox.md",sourceDirName:"development",slug:"/development/devbox",permalink:"/gmail-processor/docs/development/devbox",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/devbox.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Development",permalink:"/gmail-processor/docs/development/"},next:{title:"Community",permalink:"/gmail-processor/docs/community/"}},l={},d=[{value:"Getting Started",id:"getting-started",level:2},{value:"Scripts",id:"scripts",level:2},{value:"Shell Init Hook",id:"shell-init-hook",level:2},{value:"Packages",id:"packages",level:2},{value:"Script Details",id:"script-details",level:2},{value:"devbox run npm",id:"devbox-run-npm",level:3}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"devbox-environment",children:"Devbox Environment"}),"\n",(0,s.jsx)(n.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,s.jsxs)(n.p,{children:["This project uses ",(0,s.jsx)(n.a,{href:"https://github.com/jetify-com/devbox",children:"devbox"})," to manage its development environment."]}),"\n",(0,s.jsx)(n.p,{children:"Install devbox:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"curl -fsSL https://get.jetpack.io/devbox | bash\n"})}),"\n",(0,s.jsx)(n.p,{children:"Start the devbox shell:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"devbox shell\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run a script in the devbox environment:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"devbox run <script>\n"})}),"\n",(0,s.jsx)(n.h2,{id:"scripts",children:"Scripts"}),"\n",(0,s.jsx)(n.p,{children:"Scripts are custom commands that can be run using this project's environment. This project has the following scripts:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#devbox-run-npm",children:"npm"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"shell-init-hook",children:"Shell Init Hook"}),"\n",(0,s.jsxs)(n.p,{children:["The Shell Init Hook is a script that runs whenever the devbox environment is instantiated. It runs on ",(0,s.jsx)(n.code,{children:"devbox shell"})," and on ",(0,s.jsx)(n.code,{children:"devbox run"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:'test -z $DEVBOX_COREPACK_ENABLED || corepack enable --install-directory "/home/a13870/private/ws/github/ahochsteger/gmail-processor/.devbox/virtenv/nodejs/corepack-bin/"\ntest -z $DEVBOX_COREPACK_ENABLED || export PATH="/home/a13870/private/ws/github/ahochsteger/gmail-processor/.devbox/virtenv/nodejs/corepack-bin/:$PATH"\necho \'Welcome to gmail-processor devbox!\' > /dev/null\n'})}),"\n",(0,s.jsx)(n.h2,{id:"packages",children:"Packages"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.nixhub.io/packages/nodejs",children:"nodejs@20"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.nixhub.io/packages/gojq",children:"gojq@0"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.nixhub.io/packages/gh",children:"gh@2"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.nixhub.io/packages/gomplate",children:"gomplate@3"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://www.nixhub.io/packages/gettext",children:"gettext@0"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"script-details",children:"Script Details"}),"\n",(0,s.jsx)(n.h3,{id:"devbox-run-npm",children:"devbox run npm"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:'npm run "${@}"\n'})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>c});var s=t(6540);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);