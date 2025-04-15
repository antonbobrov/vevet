"use strict";(self.webpackChunkmy_docs=self.webpackChunkmy_docs||[]).push([[94],{9799:(e,n,l)=>{l.r(n),l.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>a});const d=JSON.parse('{"id":"components/Preloader/index","title":"Preloader","description":"Page preloader component that manages the visibility and lifecycle of a loading screen. The module does not provide styling for the container.","source":"@site/docs/components/Preloader/index.mdx","sourceDirName":"components/Preloader","slug":"/components/Preloader/","permalink":"/vevet/docs/components/Preloader/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/components/Preloader/index.mdx","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Pointers","permalink":"/vevet/docs/components/Pointers/"},"next":{"title":"ProgressPreloader","permalink":"/vevet/docs/components/ProgressPreloader/"}}');var s=l(4848),i=l(8453);const r={},o="Preloader",c={},a=[{value:"Example",id:"example",level:2},{value:"Props",id:"props",level:2},{value:"Static Props",id:"static-props",level:3},{value:"Mutable Props",id:"mutable-props",level:3},{value:"Accessors",id:"accessors",level:2},{value:"isHidden",id:"ishidden",level:3},{value:"Methods",id:"methods",level:2},{value:"hide",id:"hide",level:3},{value:"onHidden",id:"onhidden",level:3},{value:"onHide",id:"onhide",level:3},{value:"Callbacks",id:"callbacks",level:2},{value:"loaded",id:"loaded",level:3},{value:"hide",id:"hide-1",level:3},{value:"hidden",id:"hidden",level:3}];function t(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"preloader",children:"Preloader"})}),"\n",(0,s.jsx)(n.p,{children:"Page preloader component that manages the visibility and lifecycle of a loading screen. The module does not provide styling for the container."}),"\n",(0,s.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,s.jsx)(n.p,{children:"Explore a live example in CodePen:"}),"\n",(0,s.jsx)("iframe",{height:"600",style:{width:"100%"},scrolling:"no",title:"Vevet Example",src:"https://codepen.io/anton-bobrov/embed/VYYZdyB?default-tab=result",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true",children:(0,s.jsxs)(n.p,{children:["See the Pen ",(0,s.jsx)("a",{href:"https://codepen.io/anton-bobrov/pen/VYYZdyB",children:"Vevet Example"})," by Anton Bobrov."]})}),"\n",(0,s.jsx)(n.h2,{id:"props",children:"Props"}),"\n",(0,s.jsx)(n.h3,{id:"static-props",children:"Static Props"}),"\n",(0,s.jsx)(n.p,{children:"Static properties are set during initialization and cannot be modified later."}),"\n",(0,s.jsxs)("table",{children:[(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"Name"}),(0,s.jsx)("th",{children:"Description"}),(0,s.jsx)("th",{children:"Type"}),(0,s.jsx)("th",{children:"Default Value"})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:"container"}),(0,s.jsxs)("td",{children:["The container for the preloader. Set it to ",(0,s.jsx)(n.code,{children:"null"})," if you only need the preloader logic."]}),(0,s.jsx)("td",{children:(0,s.jsx)("code",{children:"HTMLElement | null"})}),(0,s.jsx)("td",{})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:"hide"}),(0,s.jsxs)("td",{children:[(0,s.jsx)(n.p,{children:"Defines whether to automatically hide the preloader container."}),(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"false"}),": Disables the hiding animation, allowing you to manage it manually."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"number"}),": Specifies the animation duration in milliseconds."]}),"\n"]}),(0,s.jsx)(n.p,{children:"This works only if the container is an HTML element."})]}),(0,s.jsx)("td",{children:(0,s.jsx)("code",{children:"false | number"})}),(0,s.jsx)("td",{children:(0,s.jsx)("code",{children:"250"})})]})]}),"\n",(0,s.jsx)(n.h3,{id:"mutable-props",children:"Mutable Props"}),"\n",(0,s.jsxs)(n.p,{children:["Mutable properties can be updated at runtime using ",(0,s.jsx)(n.code,{children:".updateProps()"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"accessors",children:"Accessors"}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["All ",(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"/docs/base/Module/#accessors",children:"Module's accessors"})})," are available in this class."]})}),"\n",(0,s.jsx)(n.h3,{id:"ishidden",children:"isHidden"}),"\n",(0,s.jsxs)(n.p,{children:["Type: ",(0,s.jsx)(n.code,{children:"boolean"})]}),"\n",(0,s.jsx)(n.p,{children:"Returns whether the preloader is currently hidden."}),"\n",(0,s.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["All ",(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"/docs/base/Module/#methods",children:"Module's methods"})})," are available in this class."]})}),"\n",(0,s.jsx)(n.h3,{id:"hide",children:"hide"}),"\n",(0,s.jsx)(n.p,{children:"Hides the preloader with a custom animation duration."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const cancelCallback = instance.hide(500, () => console.log('hide'));\n\n// If need to cancel the callback\ncancelCallback?.();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"onhidden",children:"onHidden"}),"\n",(0,s.jsx)(n.p,{children:"Registers a callback for when the preloader is fully hidden."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const cancel = instance.onHidden(() => console.log('hidden'));\n\n// If need to cancel the callback\ncancel?.();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"onhide",children:"onHide"}),"\n",(0,s.jsx)(n.p,{children:"Registers a callback for when the preloader starts hiding."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const cancel = instance.onHide(() => console.log('hide'));\n\n// If need to cancel the callback\ncancel?.();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"callbacks",children:"Callbacks"}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["All ",(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"/docs/base/Module/#callbacks",children:"Module's callbacks"})})," are available in this class."]})}),"\n",(0,s.jsx)(n.h3,{id:"loaded",children:"loaded"}),"\n",(0,s.jsx)(n.p,{children:"Triggered when the page is fully loaded."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('loaded', () => console.log('loaded'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"hide-1",children:"hide"}),"\n",(0,s.jsx)(n.p,{children:"Triggered when the preloader starts hiding."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('hide', () => console.log('hide'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"hidden",children:"hidden"}),"\n",(0,s.jsx)(n.p,{children:"Triggered when the preloader is completely hidden."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('hidden', () => console.log('hidden'));\n\n// Cancel the callback\ndestruct();\n"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(t,{...e})}):t(e)}},8453:(e,n,l)=>{l.d(n,{R:()=>r,x:()=>o});var d=l(6540);const s={},i=d.createContext(s);function r(e){const n=d.useContext(i);return d.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),d.createElement(i.Provider,{value:n},e.children)}}}]);