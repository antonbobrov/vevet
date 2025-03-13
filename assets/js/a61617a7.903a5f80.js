"use strict";(self.webpackChunkmy_docs=self.webpackChunkmy_docs||[]).push([[243],{6031:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>d,metadata:()=>i,toc:()=>t});const i=JSON.parse('{"id":"components/CanvasMedia/index","title":"CanvasMedia","description":"The CanvasMedia class enables pre-rendering of media assets (such as images and videos) onto a canvas. This technique optimizes performance by reducing payload size and preparing media for further efficient use.","source":"@site/docs/components/CanvasMedia/index.mdx","sourceDirName":"components/CanvasMedia","slug":"/components/CanvasMedia/","permalink":"/vevet/docs/components/CanvasMedia/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/components/CanvasMedia/index.mdx","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Canvas","permalink":"/vevet/docs/components/Canvas/"},"next":{"title":"Cursor","permalink":"/vevet/docs/components/Cursor/"}}');var r=s(4848),a=s(8453);const d={},l="CanvasMedia",c={},t=[{value:"Example",id:"example",level:2},{value:"Props",id:"props",level:2},{value:"Static Props",id:"static-props",level:3},{value:"Mutable Props",id:"mutable-props",level:3},{value:"Accessors",id:"accessors",level:2},{value:"Methods",id:"methods",level:2},{value:"render",id:"render",level:3},{value:"Callbacks",id:"callbacks",level:2},{value:"render",id:"render-1",level:3}];function o(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"canvasmedia",children:"CanvasMedia"})}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.strong,{children:"CanvasMedia"})," class enables pre-rendering of media assets (such as images and videos) onto a canvas. This technique optimizes performance by reducing payload size and preparing media for further efficient use."]}),"\n",(0,r.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.p,{children:"Explore a live example in CodeSandbox:"}),"\n",(0,r.jsx)("iframe",{src:"https://codesandbox.io/embed/k3w98w?view=preview",style:{width:"100%",height:"500px",border:"0",borderRadius:"4px",overflow:"hidden"},title:"CodeSandbox Embed",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}),"\n",(0,r.jsx)(n.h2,{id:"props",children:"Props"}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["All ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.a,{href:"/docs/components/Canvas/#props",children:"Canvas' props"})})," are available in this class."]})}),"\n",(0,r.jsx)(n.h3,{id:"static-props",children:"Static Props"}),"\n",(0,r.jsx)(n.p,{children:"Static properties are set during initialization and cannot be modified later."}),"\n",(0,r.jsxs)("table",{children:[(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Name"}),(0,r.jsx)("th",{children:"Description"}),(0,r.jsx)("th",{children:"Type"}),(0,r.jsx)("th",{children:"Default Value"})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:"media"}),(0,r.jsx)("td",{children:"The media element to be rendered. Accepts a Canvas instance or common media elements like images and videos."}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"Canvas"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"HTMLImageElement"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"SVGImageElement"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"HTMLVideoElement"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"HTMLCanvasElement"})}),"\n"]})}),(0,r.jsx)("td",{})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:"autoRenderVideo"}),(0,r.jsxs)("td",{children:["If ",(0,r.jsx)(n.code,{children:"true"}),", video elements will automatically render on each frame update."]}),(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"boolean"})}),(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"true"})})]})]}),"\n",(0,r.jsx)(n.h3,{id:"mutable-props",children:"Mutable Props"}),"\n",(0,r.jsxs)(n.p,{children:["Mutable properties may be changed in runtime via ",(0,r.jsx)(n.a,{href:"#updateprops",children:".updateProps"})]}),"\n",(0,r.jsxs)("table",{children:[(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Name"}),(0,r.jsx)("th",{children:"Description"}),(0,r.jsx)("th",{children:"Type"}),(0,r.jsx)("th",{children:"Default Value"})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:"rule"}),(0,r.jsx)("td",{children:"Defines how the media element is positioned within the canvas."}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"cover"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"contain"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"top-left"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"top-right"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"bottom-left"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"bottom-right"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"center"})}),"\n"]})}),(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"'cover'"})})]})]}),"\n",(0,r.jsx)(n.h2,{id:"accessors",children:"Accessors"}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["All ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.a,{href:"/docs/components/Canvas/#accessors",children:"Canvas' accessors"})})," are available in this class."]})}),"\n",(0,r.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["All ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.a,{href:"/docs/components/Canvas/#methods",children:"Canvas' methods"})})," are available in this class."]})}),"\n",(0,r.jsx)(n.h3,{id:"render",children:"render"}),"\n",(0,r.jsx)(n.p,{children:"Pre-renders the media resource onto the canvas."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"instance.render();\n"})}),"\n",(0,r.jsx)(n.h2,{id:"callbacks",children:"Callbacks"}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["All ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.a,{href:"/docs/components/Canvas/#callbacks",children:"Canvas' callbacks"})})," are available in this class."]})}),"\n",(0,r.jsx)(n.h3,{id:"render-1",children:"render"}),"\n",(0,r.jsx)(n.p,{children:"Fires after the media element has been rendered onto the canvas."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('render', () => console.log('Canvas rendered'));\n\n// Cancel the callback\ndestruct();\n"})})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>l});var i=s(6540);const r={},a=i.createContext(r);function d(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);