"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[374],{"./src/components/SectionScrollProgress/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,WithCustomScroll:()=>WithCustomScroll,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),SmoothScroll=__webpack_require__("./src/components/SmoothScroll/index.ts"),selectOne=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),Component=__webpack_require__("./src/base/Component/index.ts"),clampScope=__webpack_require__("./src/utils/math/clampScope.ts"),onScroll=__webpack_require__("./src/utils/scroll/onScroll.ts"),getScrollValues=__webpack_require__("./src/utils/scroll/getScrollValues.ts"),onResize=__webpack_require__("./src/utils/listeners/onResize.ts"),getApp=__webpack_require__("./src/utils/internal/getApp.ts");class SectionScrollProgress extends Component.w{_getDefaultProps(){return{...super._getDefaultProps(),container:window,viewportTarget:"any",resizeTimeout:0}}get scrollContainer(){return this._scrollContainer}get section(){return this._section}get scopeGlobal(){return this._scopeGlobal}get scopeIn(){return this._scopeIn}get scopeMove(){return this._scopeMove}get scopeOut(){return this._scopeOut}get progressGlobal(){return this._progressGlobal}set progressGlobal(value){this._progressGlobal=value}constructor(initialProps,canInit=!0){super(initialProps,!1);const{container,section}=this.props;this._scrollContainer="string"==typeof container?(0,selectOne.z)(container):container,this._section=(0,selectOne.z)(section),this._prevProgressGlobal=-.001,this._progressGlobal=-.001,this._scopeGlobal=[0,0],this._scopeIn=[0,0],this._scopeMove=[0,0],this._scopeOut=[0,0],this._frameThrottleIndex=0,canInit&&this.init()}_init(){super._init(),this._setEvents()}_setEvents(){const{viewportTarget,resizeDebounce}=this.props,resizeHandler=(0,onResize.i)({onResize:()=>this.resize(),element:this.section,viewportTarget,hasBothEvents:!0,resizeDebounce}),loadEvent=(0,getApp.M)().onPageLoad();loadEvent.then((()=>resizeHandler.debounceResize())).catch((()=>{}));const scrollEvent=(0,onScroll.g)({container:this.scrollContainer,callback:data=>this._render(data)});this.addDestroyableAction((()=>{resizeHandler.remove(),loadEvent.cancel(),scrollEvent.remove()}))}_onPropsMutate(){super._onPropsMutate(),this.resize()}get progressIn(){return(0,clampScope.r)(this.progressGlobal,this.scopeIn)||0}get progressOut(){return(0,clampScope.r)(this.progressGlobal,this.scopeOut)||0}get progressMove(){return(0,clampScope.r)(this.progressGlobal,this.scopeMove)||0}resize(){const scrollValues=(0,getScrollValues.O)(this.scrollContainer);scrollValues&&(this.callbacks.tbt("resize",void 0),this._render(scrollValues,!0))}_calculateScopes({scrollTop}){const{height:vHeight}=(0,getApp.M)().viewport,sectionBounding=this.section.getBoundingClientRect(),inStart=scrollTop+sectionBounding.top-vHeight,moveEnd=scrollTop+sectionBounding.top+sectionBounding.height,scrollLine=moveEnd-inStart;this._scopeGlobal=[inStart,moveEnd],this._scopeIn=[0,vHeight/scrollLine],this._scopeOut=[1-vHeight/scrollLine,1],this._scopeMove=[this._scopeIn[1],this._scopeOut[0]]}_canRender(isForce=!1){return isForce||this.progressGlobal!==this._prevProgressGlobal}_render(scrollValues,isForce=!1){this._frameThrottleIndex+=1,(this._frameThrottleIndex%60==0||isForce)&&this._calculateScopes(scrollValues),this._prevProgressGlobal=this.progressGlobal,this.progressGlobal=(0,clampScope.r)(scrollValues.scrollTop,this._scopeGlobal),this._canRender(isForce)&&this.callbacks.tbt("render",void 0)}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const WithCustomScrollComponent=()=>{const containerRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{if(!containerRef.current)return;const smoothScroll=new SmoothScroll.X({container:containerRef.current}),sections=containerRef.current.querySelectorAll(".js-section"),sectionHandlers=Array.from(sections).map((section=>{const handler=new SectionScrollProgress({container:smoothScroll,section}),render=()=>{section.innerHTML=`\n          <p>progressGlobal: ${handler.progressGlobal.toFixed(2)}</p>\n          <p>progressIn: ${handler.progressIn.toFixed(2)}</p>\n          <p>progressMove: ${handler.progressMove.toFixed(2)}</p>\n          <p>progressOut: ${handler.progressOut.toFixed(2)}</p>\n        `};return render(),handler.addCallback("render",(()=>render())),handler}));return()=>{smoothScroll.destroy(),sectionHandlers.forEach((handler=>handler.destroy()))}}),[]),(0,jsx_runtime.jsx)("div",{ref:containerRef,className:"v-smooth-scroll",style:{height:"100vh",backgroundColor:"#ccc"},children:(0,jsx_runtime.jsxs)("div",{className:"v-smooth-scroll__wrapper",children:[(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100vh",backgroundColor:"#a00"}}),(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"150vh",backgroundColor:"#0a0"}}),(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100vh",backgroundColor:"#00a"}})]})})};WithCustomScrollComponent.displayName="WithCustomScrollComponent";try{WithCustomScrollComponent.displayName="WithCustomScrollComponent",WithCustomScrollComponent.__docgenInfo={description:"",displayName:"WithCustomScrollComponent",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/SectionScrollProgress/stories/WithCustomScroll.tsx#WithCustomScrollComponent"]={docgenInfo:WithCustomScrollComponent.__docgenInfo,name:"WithCustomScrollComponent",path:"src/components/SectionScrollProgress/stories/WithCustomScroll.tsx#WithCustomScrollComponent"})}catch(__react_docgen_typescript_loader_error){}const DefalultComponent=()=>((0,react.useEffect)((()=>{const sections=document.querySelectorAll(".js-section"),sectionHandlers=Array.from(sections).map((section=>{const handler=new SectionScrollProgress({section}),render=()=>{section.innerHTML=`\n          <p>progressGlobal: ${handler.progressGlobal.toFixed(2)}</p>\n          <p>progressIn: ${handler.progressIn.toFixed(2)}</p>\n          <p>progressMove: ${handler.progressMove.toFixed(2)}</p>\n          <p>progressOut: ${handler.progressOut.toFixed(2)}</p>\n        `};return render(),handler.addCallback("render",(()=>render())),handler}));return()=>{sectionHandlers.forEach((handler=>handler.destroy()))}}),[]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100vh",backgroundColor:"#a00"}}),(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"150vh",backgroundColor:"#0a0"}}),(0,jsx_runtime.jsx)("div",{className:"js-section",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100vh",backgroundColor:"#00a"}})]}));try{DefalultComponent.displayName="DefalultComponent",DefalultComponent.__docgenInfo={description:"",displayName:"DefalultComponent",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/SectionScrollProgress/stories/Default.tsx#DefalultComponent"]={docgenInfo:DefalultComponent.__docgenInfo,name:"DefalultComponent",path:"src/components/SectionScrollProgress/stories/Default.tsx#DefalultComponent"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/SectionScrollProgress"},Default=props=>(0,jsx_runtime.jsx)(DefalultComponent,{...props});Default.displayName="Default";const WithCustomScroll=props=>(0,jsx_runtime.jsx)(WithCustomScrollComponent,{...props});WithCustomScroll.displayName="WithCustomScroll",Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"props => <DefalultComponent {...props} />",...Default.parameters?.docs?.source}}},WithCustomScroll.parameters={...WithCustomScroll.parameters,docs:{...WithCustomScroll.parameters?.docs,source:{originalSource:"props => <WithCustomScrollComponent {...props} />",...WithCustomScroll.parameters?.docs?.source}}};const __namedExportsOrder=["Default","WithCustomScroll"]},"./src/utils/math/clampScope.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{r:()=>clampScope});var clamp=__webpack_require__("./src/utils/math/clamp.ts");function clampScope(value,scopeProp=[0,1],clampProp=[0,1]){return(0,clamp.u)(function scoped(val,scopeValue=[0,1]){return(val-scopeValue[0])/(scopeValue[1]-scopeValue[0])}(value,scopeProp),clampProp)}},"./src/utils/scroll/getScrollValues.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function getScrollValues(selector=window){if(!selector)return;return{scrollTop:selector instanceof Window?selector.pageYOffset:selector.scrollTop,scrollLeft:selector instanceof Window?selector.pageXOffset:selector.scrollLeft}}__webpack_require__.d(__webpack_exports__,{O:()=>getScrollValues})},"./src/utils/scroll/onScroll.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{g:()=>onScroll});var vevet_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_common__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/common/uid.ts"),_getScrollValues__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/scroll/getScrollValues.ts");let instances=[];function onScroll({container,callback,isPassive=!1}){let instance=instances.find((data=>data.container===container&&data.isPassive===isPassive));const callbackId=(0,_common__WEBPACK_IMPORTED_MODULE_0__.h)("scroll-event");if(instance)instance.callbacks.push({id:callbackId,callback});else if(instance={id:(0,_common__WEBPACK_IMPORTED_MODULE_0__.h)("scroll-event-instance"),container,callbacks:[{id:callbackId,callback}],isPassive,listeners:[]},instances.push(instance),"object"==typeof container&&"isSmoothScroll"in container)instance.listeners.push(container.addCallback("render",(()=>{const{scrollTop,scrollLeft}=container;instance.callbacks.forEach((item=>item.callback({scrollTop,scrollLeft})))}),{name:"onScroll"}));else{const domContainer=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.z)(container);instance.listeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.O)(domContainer,"scroll",(()=>{const data=(0,_getScrollValues__WEBPACK_IMPORTED_MODULE_3__.O)(domContainer);data&&instance.callbacks.forEach((item=>item.callback(data)))}),{passive:isPassive}))}return{remove:()=>{const newCallbacks=instance.callbacks.filter((item=>item.id!==callbackId));instance.callbacks=newCallbacks,0===newCallbacks.length&&(instance.listeners.forEach((listener=>listener.remove())),instances=instances.filter((item=>item.id!==instance.id)))}}}}}]);