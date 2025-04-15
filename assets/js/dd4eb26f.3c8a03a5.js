"use strict";(self.webpackChunkmy_docs=self.webpackChunkmy_docs||[]).push([[622],{3949:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>o});const a=JSON.parse('{"id":"components/Raf/index","title":"Raf","description":"Manages an animation frame loop with configurable FPS and playback controls.","source":"@site/docs/components/Raf/index.mdx","sourceDirName":"components/Raf","slug":"/components/Raf/","permalink":"/vevet/docs/components/Raf/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/components/Raf/index.mdx","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"ProgressPreloader","permalink":"/vevet/docs/components/ProgressPreloader/"},"next":{"title":"ScrollProgress","permalink":"/vevet/docs/components/ScrollProgress/"}}');var l=s(4848),r=s(8453);const t={},i="Raf",c={},o=[{value:"Example",id:"example",level:2},{value:"Props",id:"props",level:2},{value:"Mutable Props",id:"mutable-props",level:3},{value:"Accessors",id:"accessors",level:2},{value:"duration",id:"duration",level:3},{value:"fps",id:"fps",level:3},{value:"fpsFactor",id:"fpsfactor",level:3},{value:"index",id:"index",level:3},{value:"isPlaying",id:"isplaying",level:3},{value:"timestamp",id:"timestamp",level:3},{value:"Methods",id:"methods",level:2},{value:"lerpFactor",id:"lerpfactor",level:3},{value:"pause",id:"pause",level:3},{value:"play",id:"play",level:3},{value:"Callbacks",id:"callbacks",level:2},{value:"play",id:"play-1",level:3},{value:"pause",id:"pause-1",level:3},{value:"toggle",id:"toggle",level:3},{value:"frame",id:"frame",level:3}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"raf",children:"Raf"})}),"\n",(0,l.jsx)(n.p,{children:"Manages an animation frame loop with configurable FPS and playback controls."}),"\n",(0,l.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,l.jsx)(n.p,{children:"Explore a live example in CodePen:"}),"\n",(0,l.jsx)("iframe",{height:"600",style:{width:"100%"},scrolling:"no",title:"Vevet Example",src:"https://codepen.io/anton-bobrov/embed/EaaYREw?default-tab=result",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true",children:(0,l.jsxs)(n.p,{children:["See the Pen ",(0,l.jsx)("a",{href:"https://codepen.io/anton-bobrov/pen/EaaYREw",children:"Vevet Example"})," by Anton Bobrov."]})}),"\n",(0,l.jsx)(n.h2,{id:"props",children:"Props"}),"\n",(0,l.jsx)(n.h3,{id:"mutable-props",children:"Mutable Props"}),"\n",(0,l.jsxs)(n.p,{children:["Mutable properties can be updated at runtime using ",(0,l.jsx)(n.code,{children:".updateProps()"}),"."]}),"\n",(0,l.jsxs)("table",{children:[(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Name"}),(0,l.jsx)("th",{children:"Description"}),(0,l.jsx)("th",{children:"Type"}),(0,l.jsx)("th",{children:"Default Value"})]}),(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:"fps"}),(0,l.jsx)("td",{children:"Frames per second (FPS) for the animation. Set to 'auto' for dynamic adjustment."}),(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:"'auto' | number"})}),(0,l.jsx)("td",{children:"'auto'"})]}),(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:"enabled"}),(0,l.jsx)("td",{children:"Enables or disables the Raf animation loop."}),(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:"boolean"})}),(0,l.jsx)("td",{children:(0,l.jsx)("code",{children:"false"})})]})]}),"\n",(0,l.jsx)(n.h2,{id:"accessors",children:"Accessors"}),"\n",(0,l.jsx)(n.admonition,{type:"note",children:(0,l.jsxs)(n.p,{children:["All ",(0,l.jsx)(n.strong,{children:(0,l.jsx)(n.a,{href:"/docs/base/Module/#accessors",children:"Module's accessors"})})," are available in this class."]})}),"\n",(0,l.jsx)(n.h3,{id:"duration",children:"duration"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"number"})]}),"\n",(0,l.jsx)(n.p,{children:"Duration of the last frame in ms"}),"\n",(0,l.jsx)(n.h3,{id:"fps",children:"fps"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"number"})]}),"\n",(0,l.jsx)(n.p,{children:"Real-time FPS"}),"\n",(0,l.jsx)(n.h3,{id:"fpsfactor",children:"fpsFactor"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"number"})]}),"\n",(0,l.jsx)(n.p,{children:"Scaling coefficient based on a 60 FPS target"}),"\n",(0,l.jsx)(n.h3,{id:"index",children:"index"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"number"})]}),"\n",(0,l.jsx)(n.p,{children:"Current frame index"}),"\n",(0,l.jsx)(n.h3,{id:"isplaying",children:"isPlaying"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"boolean"})]}),"\n",(0,l.jsx)(n.p,{children:"Playback state of the animation frame"}),"\n",(0,l.jsx)(n.h3,{id:"timestamp",children:"timestamp"}),"\n",(0,l.jsxs)(n.p,{children:["Type: ",(0,l.jsx)(n.code,{children:"number"})]}),"\n",(0,l.jsx)(n.p,{children:"Timestamp of the current frame"}),"\n",(0,l.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,l.jsx)(n.admonition,{type:"note",children:(0,l.jsxs)(n.p,{children:["All ",(0,l.jsx)(n.strong,{children:(0,l.jsx)(n.a,{href:"/docs/base/Module/#methods",children:"Module's methods"})})," are available in this class."]})}),"\n",(0,l.jsx)(n.h3,{id:"lerpfactor",children:"lerpFactor"}),"\n",(0,l.jsx)(n.p,{children:"Calculate linear interpolation factor to make animations run the same regardless of FPS"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const ease = instance.lerpFactor(0.1);\n\n// and use it in your lerp\nlerp(from, to, ease);\n"})}),"\n",(0,l.jsx)(n.h3,{id:"pause",children:"pause"}),"\n",(0,l.jsx)(n.p,{children:"Pause the animation loop"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"instance.pause();\n"})}),"\n",(0,l.jsx)(n.h3,{id:"play",children:"play"}),"\n",(0,l.jsx)(n.p,{children:"Start the animation loop"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"instance.play();\n"})}),"\n",(0,l.jsx)(n.h2,{id:"callbacks",children:"Callbacks"}),"\n",(0,l.jsx)(n.admonition,{type:"note",children:(0,l.jsxs)(n.p,{children:["All ",(0,l.jsx)(n.strong,{children:(0,l.jsx)(n.a,{href:"/docs/base/Module/#callbacks",children:"Module's callbacks"})})," are available in this class."]})}),"\n",(0,l.jsx)(n.h3,{id:"play-1",children:"play"}),"\n",(0,l.jsx)(n.p,{children:"Triggered when the animation starts"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('play', () => console.log('play'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,l.jsx)(n.h3,{id:"pause-1",children:"pause"}),"\n",(0,l.jsx)(n.p,{children:"Triggered when the animation is paused"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('pause', () => console.log('pause'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,l.jsx)(n.h3,{id:"toggle",children:"toggle"}),"\n",(0,l.jsx)(n.p,{children:"Triggered when play/pause state toggles"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('toggle', () => console.log('toggle'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,l.jsx)(n.h3,{id:"frame",children:"frame"}),"\n",(0,l.jsx)(n.p,{children:"Triggered on every animation frame"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const destruct = instance.on('frame', ({ fps, fpsFactor, duration }) => {\n  console.log('current FPS', fps);\n  console.log('scaling coefficient based on a 60 FPS target', fpsFactor);\n  console.log('duration of the last frame in ms', duration);\n});\n\n// Cancel the callback\ndestruct();\n"})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>i});var a=s(6540);const l={},r=a.createContext(l);function t(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);