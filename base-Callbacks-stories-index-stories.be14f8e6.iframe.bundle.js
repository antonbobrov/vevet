"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[780],{"./src/base/Callbacks/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),Callbacks=__webpack_require__("./src/base/Callbacks/index.ts");const Component=()=>((0,react.useEffect)((()=>{const callbacks=new Callbacks.n,renderSimple=callbacks.add("render",(()=>{}),{name:"render simple"}),emptySimple=callbacks.add("empty",(()=>{}),{name:"empty simple"});callbacks.add("empty",(()=>{}),{isOnce:!0,name:"empty once"});const emptyProtected=callbacks.add("empty",(()=>{}),{isProtected:!0,name:"empty protected"});return callbacks.add("empty",(()=>{}),{isProtected:!0,isOnce:!0,name:"empty protected and once"}),callbacks.tbt("empty",void 0),callbacks.tbt("render",{fps:10}),console.log(callbacks.callbacks.map((({name})=>name))),renderSimple.remove(),emptySimple.remove(),emptyProtected.remove(),console.log(callbacks.callbacks.map((({name})=>name))),()=>callbacks.destroy()}),[]),null);try{Component.displayName="Component",Component.__docgenInfo={description:"",displayName:"Component",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/base/Callbacks/stories/index.tsx#Component"]={docgenInfo:Component.__docgenInfo,name:"Component",path:"src/base/Callbacks/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Base/Callbacks",component:Component},Default={};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]}}]);