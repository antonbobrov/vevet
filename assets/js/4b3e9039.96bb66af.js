"use strict";(self.webpackChunkmy_docs=self.webpackChunkmy_docs||[]).push([[406],{2470:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>t,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>o});const r=JSON.parse('{"id":"components/Marquee/index","title":"Marquee","description":"A custom marquee component that smoothly scrolls its child elements.","source":"@site/docs/components/Marquee/index.mdx","sourceDirName":"components/Marquee","slug":"/components/Marquee/","permalink":"/vevet/docs/components/Marquee/","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/components/Marquee/index.mdx","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"InView","permalink":"/vevet/docs/components/InView/"},"next":{"title":"Pointers","permalink":"/vevet/docs/components/Pointers/"}}');var d=n(4848),l=n(8453);const i={},t="Marquee",c={},o=[{value:"Examples",id:"examples",level:2},{value:"Default Marquee",id:"default-marquee",level:3},{value:"Draggable Marquee",id:"draggable-marquee",level:3},{value:"Scrollable Marquee",id:"scrollable-marquee",level:3},{value:"Props",id:"props",level:2},{value:"Static Props",id:"static-props",level:3},{value:"Mutable Props",id:"mutable-props",level:3},{value:"Accessors",id:"accessors",level:2},{value:"totalWidth",id:"totalwidth",level:3},{value:"x",id:"x",level:3},{value:"Methods",id:"methods",level:2},{value:"render",id:"render",level:3},{value:"resize",id:"resize",level:3},{value:"updateProps",id:"updateprops",level:3},{value:"destroy",id:"destroy",level:3},{value:"Callbacks",id:"callbacks",level:2},{value:"render",id:"render-1",level:3},{value:"resize",id:"resize-1",level:3}];function a(e){const s={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,l.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.header,{children:(0,d.jsx)(s.h1,{id:"marquee",children:"Marquee"})}),"\n",(0,d.jsx)(s.p,{children:"A custom marquee component that smoothly scrolls its child elements."}),"\n",(0,d.jsx)(s.p,{children:"This component is designed to loop elements horizontally within a container, with support for customization such as speed, gap, pause on hover, and more."}),"\n",(0,d.jsx)(s.h2,{id:"examples",children:"Examples"}),"\n",(0,d.jsx)(s.p,{children:"Explore live examples in CodeSandbox:"}),"\n",(0,d.jsx)(s.h3,{id:"default-marquee",children:"Default Marquee"}),"\n",(0,d.jsx)("iframe",{src:"https://codesandbox.io/embed/ln53pl?view=preview",style:{width:"100%",height:"500px",border:"0",borderRadius:"4px",overflow:"hidden"},title:"CodeSandbox Embed",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}),"\n",(0,d.jsx)(s.h3,{id:"draggable-marquee",children:"Draggable Marquee"}),"\n",(0,d.jsx)("iframe",{src:"https://codesandbox.io/embed/jsg3nx?view=preview",style:{width:"100%",height:"500px",border:"0",borderRadius:"4px",overflow:"hidden"},title:"CodeSandbox Embed",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}),"\n",(0,d.jsx)(s.h3,{id:"scrollable-marquee",children:"Scrollable Marquee"}),"\n",(0,d.jsx)("iframe",{src:"https://codesandbox.io/embed/2xs68h?view=preview",style:{width:"100%",height:"500px",border:"0",borderRadius:"4px",overflow:"hidden"},title:"CodeSandbox Embed",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}),"\n",(0,d.jsx)(s.h2,{id:"props",children:"Props"}),"\n",(0,d.jsx)(s.h3,{id:"static-props",children:"Static Props"}),"\n",(0,d.jsx)(s.p,{children:"Static properties are set during initialization and cannot be modified later."}),"\n",(0,d.jsxs)("table",{children:[(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"Name"}),(0,d.jsx)("th",{children:"Description"}),(0,d.jsx)("th",{children:"Type"}),(0,d.jsx)("th",{children:"Default Value"})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"container"}),(0,d.jsx)("td",{children:"The container element that holds the marquee content."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"HTMLElement"})}),(0,d.jsx)("td",{})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"resizeDebounce"}),(0,d.jsx)("td",{children:"The debounce delay for the resize event in milliseconds."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"number"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"0"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"hasWillChange"}),(0,d.jsxs)("td",{children:["Determines whether to apply the ",(0,d.jsx)(s.code,{children:"will-change"})," CSS property to the marquee elements to optimize rendering. Setting this to ",(0,d.jsx)(s.code,{children:"true"})," may improve performance."]}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"true"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"cloneNodes"}),(0,d.jsxs)("td",{children:["Indicates whether to clone the marquee nodes. Can be set to ",(0,d.jsx)(s.code,{children:"false"})," if DOM cloning is not preferred."]}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"true"})})]})]}),"\n",(0,d.jsx)(s.h3,{id:"mutable-props",children:"Mutable Props"}),"\n",(0,d.jsxs)(s.p,{children:["Mutable properties can be updated at runtime using ",(0,d.jsx)(s.code,{children:".updateProps()"}),"."]}),"\n",(0,d.jsxs)("table",{children:[(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"Name"}),(0,d.jsx)("th",{children:"Description"}),(0,d.jsx)("th",{children:"Type"}),(0,d.jsx)("th",{children:"Default Value"})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"speed"}),(0,d.jsxs)("td",{children:["The speed of the marquee animation. Supports css units like ",(0,d.jsx)(s.code,{children:"px"}),", ",(0,d.jsx)(s.code,{children:"rem"}),", ",(0,d.jsx)(s.code,{children:"vw"}),", ",(0,d.jsx)(s.code,{children:"vh"}),", ",(0,d.jsx)(s.code,{children:"svh"}),"."]}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"number | string"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"1"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"gap"}),(0,d.jsxs)("td",{children:["The gap between the marquee elements. Supports css units like ",(0,d.jsx)(s.code,{children:"px"}),", ",(0,d.jsx)(s.code,{children:"rem"}),", ",(0,d.jsx)(s.code,{children:"vw"}),", ",(0,d.jsx)(s.code,{children:"vh"}),", ",(0,d.jsx)(s.code,{children:"svh"}),"."]}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"number | string"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"0"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"enabled"}),(0,d.jsxs)("td",{children:["Enables or disables the marquee animation. When ",(0,d.jsx)(s.code,{children:"false"}),", the marquee will be paused."]}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"true"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"pauseOnHover"}),(0,d.jsx)("td",{children:"Pauses the marquee when the mouse hovers over it."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"false"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"centered"}),(0,d.jsx)("td",{children:"Centers the marquee content within the container."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"false"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"adjustSpeed"}),(0,d.jsx)("td",{children:"When need to use dynamic FPS factor to adjust the speed of the marquee."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"true"})})]}),(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:"pauseOnOut"}),(0,d.jsx)("td",{children:"Pauses the marquee when the mouse leaves the viewport."}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"boolean"})}),(0,d.jsx)("td",{children:(0,d.jsx)("code",{children:"true"})})]})]}),"\n",(0,d.jsx)(s.h2,{id:"accessors",children:"Accessors"}),"\n",(0,d.jsx)(s.admonition,{type:"note",children:(0,d.jsxs)(s.p,{children:["All ",(0,d.jsx)(s.strong,{children:(0,d.jsx)(s.a,{href:"/docs/base/Module/#accessors",children:"Module's accessors"})})," are available in this class."]})}),"\n",(0,d.jsx)(s.h3,{id:"totalwidth",children:"totalWidth"}),"\n",(0,d.jsxs)(s.p,{children:["Type: ",(0,d.jsx)(s.code,{children:"number"})]}),"\n",(0,d.jsx)(s.p,{children:"Total width of all elements in the marquee"}),"\n",(0,d.jsx)(s.h3,{id:"x",children:"x"}),"\n",(0,d.jsxs)(s.p,{children:["Type: ",(0,d.jsx)(s.code,{children:"number"})]}),"\n",(0,d.jsx)(s.p,{children:"The current X coordinate of the marquee."}),"\n",(0,d.jsx)(s.h2,{id:"methods",children:"Methods"}),"\n",(0,d.jsx)(s.admonition,{type:"note",children:(0,d.jsxs)(s.p,{children:["All ",(0,d.jsx)(s.strong,{children:(0,d.jsx)(s.a,{href:"/docs/base/Module/#methods",children:"Module's methods"})})," are available in this class."]})}),"\n",(0,d.jsx)(s.h3,{id:"render",children:"render"}),"\n",(0,d.jsx)(s.p,{children:"Renders the marquee, adjusting element positions."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"instance.render(2); // with step 2\ninstance.render(-1); // with step -1\n"})}),"\n",(0,d.jsx)(s.h3,{id:"resize",children:"resize"}),"\n",(0,d.jsx)(s.p,{children:"Resizes the marquee, recalculating element positions and cloning if necessary."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"instance.resize();\n"})}),"\n",(0,d.jsx)(s.h3,{id:"updateprops",children:"updateProps"}),"\n",(0,d.jsx)(s.p,{children:"Dynamically updates instance properties."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"instance.updateProps({\n  enabled: false,\n});\n"})}),"\n",(0,d.jsx)(s.h3,{id:"destroy",children:"destroy"}),"\n",(0,d.jsx)(s.p,{children:"Destroys the instance and cleans up resources."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"instance.destroy();\n"})}),"\n",(0,d.jsx)(s.h2,{id:"callbacks",children:"Callbacks"}),"\n",(0,d.jsx)(s.admonition,{type:"note",children:(0,d.jsxs)(s.p,{children:["All ",(0,d.jsx)(s.strong,{children:(0,d.jsx)(s.a,{href:"/docs/base/Module/#callbacks",children:"Module's callbacks"})})," are available in this class."]})}),"\n",(0,d.jsx)(s.h3,{id:"render-1",children:"render"}),"\n",(0,d.jsx)(s.p,{children:"Called during marquee rendering."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"const destruct = instance.on('render', () => console.log('render'));\n\n// Cancel the callback\ndestruct();\n"})}),"\n",(0,d.jsx)(s.h3,{id:"resize-1",children:"resize"}),"\n",(0,d.jsx)(s.p,{children:"Called on marquee resize"}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"const destruct = instance.on('resize', () => console.log('resize'));\n\n// Cancel the callback\ndestruct();\n"})})]})}function h(e={}){const{wrapper:s}={...(0,l.R)(),...e.components};return s?(0,d.jsx)(s,{...e,children:(0,d.jsx)(a,{...e})}):a(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>t});var r=n(6540);const d={},l=r.createContext(d);function i(e){const s=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:i(e.components),r.createElement(l.Provider,{value:s},e.children)}}}]);