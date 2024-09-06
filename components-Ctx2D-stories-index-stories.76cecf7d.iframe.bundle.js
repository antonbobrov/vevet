/*! For license information please see components-Ctx2D-stories-index-stories.76cecf7d.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[738],{"./src/components/Ctx2D/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),Ctx2D=__webpack_require__("./src/components/Ctx2D/index.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Component=()=>{const containerRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{if(!containerRef.current)return;const instance=new Ctx2D.W({container:containerRef.current,hasResize:!0}),render=({ctx,width,height})=>{ctx.beginPath(),ctx.fillStyle="#ccc",ctx.fillRect(0,0,width,height),ctx.closePath(),ctx.beginPath(),ctx.fillStyle="#000",ctx.fillRect(10,10,50,50),ctx.closePath()};return instance.render(render),instance.addCallback("resize",(()=>instance.render(render))),()=>instance.destroy()}),[]),(0,jsx_runtime.jsx)("div",{ref:containerRef,style:{position:"relative",width:300,height:300}})};Component.displayName="Component";try{Component.displayName="Component",Component.__docgenInfo={description:"",displayName:"Component",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Ctx2D/stories/index.tsx#Component"]={docgenInfo:Component.__docgenInfo,name:"Component",path:"src/components/Ctx2D/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/Ctx2D",component:Component},Default={};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]},"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.n{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/Callbacks/index.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class Module{_getDefaultProps(){return{}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)())throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_1__.n,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_2__.P(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init())}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.callbacks.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.q)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{P:()=>MutableProps});var _utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=()=>{},_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.callbacks.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)(),{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/Ctx2D/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>Ctx2D});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts"),_utils_listeners_onResize__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/utils/listeners/onResize.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/utils/internal/getApp.ts");class Ctx2D extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.u{_getDefaultProps(){return{...super._getDefaultProps(),container:!1,shouldAppend:!0,hasInitialResize:!0,hasResize:!1,viewportTarget:"any",resizeDebounce:0,width:"auto",height:"auto",dpr:"auto"}}get container(){return this.props.container}get canvas(){return this._canvas}get ctx(){return this._ctx}get width(){return this._width}get clientWidth(){return this.width/this.dpr}get height(){return this._height}get clientHeight(){return this.height/this.dpr}get dpr(){return this._dpr}get canRender(){return this.width>0&&this.height>0}constructor(initialProps,canInit=!0){super(initialProps,!1);const{shouldAppend,container}=this.props;this._width=0,this._height=0,this._dpr=1,this._canvas=document.createElement("canvas"),this._canvas.style.position="absolute",this._canvas.style.top="0",this._canvas.style.left="0",this._canvas.style.width="100%",this._canvas.style.height="100%",shouldAppend&&container instanceof Element&&(container.append(this._canvas),this.addDestroyableAction((()=>this.canvas.remove()))),this._ctx=this._canvas.getContext("2d"),canInit&&this.init()}_onPropsMutate(){super._onPropsMutate(),this.resize()}_init(){super._init(),this._setResize()}_setResize(){const{hasInitialResize,hasResize,viewportTarget,resizeDebounce}=this.props;if(!hasResize)return;const resizeHandler=(0,_utils_listeners_onResize__WEBPACK_IMPORTED_MODULE_1__.E)({onResize:()=>this.resize(),element:this.container,viewportTarget,resizeDebounce});this.addDestroyableAction((()=>resizeHandler.remove())),hasInitialResize&&resizeHandler.resize()}resize(){const{props,canvas}=this;if(!canvas)return;const{viewport}=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_2__.S)();"number"==typeof props.dpr?this._dpr=props.dpr:this._dpr=viewport.dpr;let newWidth=0,newHeight=0;"number"==typeof props.width&&"number"==typeof props.height?(newWidth=props.width,newHeight=props.height):this.container?(newWidth=this.container.clientWidth,newHeight=this.container.clientHeight):(newWidth=viewport.width,newHeight=viewport.height),newWidth*=this._dpr,newHeight*=this._dpr,this._width=newWidth,this._height=newHeight,canvas.width=newWidth,canvas.height=newHeight,this._handleResize(),this.callbacks.tbt("resize",void 0)}_handleResize(){}render(renderProp){this.canRender&&renderProp({ctx:this.ctx,width:this.width,height:this.height,dpr:this.dpr,clientWidth:this.clientWidth,clientHeight:this.clientHeight,canvas:this.canvas})}}Ctx2D.displayName="Ctx2D"},"./src/utils/listeners/onResize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function onResize({onResize:handleResize,element,viewportTarget="any",hasBothEvents=!1,resizeDebounce=0}){let timeout,resizeObserver,viewportCallback,isFirstResizeObserverCallback=!0;const debounceResize=(props,delay)=>{timeout&&clearTimeout(timeout),timeout=setTimeout((()=>handleResize(props??{trigger:"unknown"})),delay??resizeDebounce)};return element&&(element instanceof Element||Array.isArray(element))&&"ResizeObserver"in window&&(resizeObserver=new ResizeObserver((()=>{isFirstResizeObserverCallback?isFirstResizeObserverCallback=!1:debounceResize({trigger:"ResizeObserver"},window.vevetApp.props.resizeDebounce+resizeDebounce)})),Array.isArray(element)?element.forEach((item=>resizeObserver?.observe(item))):resizeObserver.observe(element)),!hasBothEvents&&resizeObserver||(viewportCallback=window.vevetApp.viewport.callbacks.add(viewportTarget,(()=>debounceResize({trigger:"Viewport"})))),{remove:()=>{timeout&&clearTimeout(timeout),resizeObserver?.disconnect(),viewportCallback?.remove()},resize:()=>handleResize({trigger:"unknown"}),debounceResize:()=>debounceResize(),hasResizeObserver:!!resizeObserver}}__webpack_require__.d(__webpack_exports__,{E:()=>onResize})},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);