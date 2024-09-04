/*! For license information please see components-CustomCursor-stories-index-stories.1c21546e.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[632],{"./src/components/CustomCursor/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),selectOne=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),createElement=__webpack_require__("./node_modules/vevet-dom/dist/es/createElement.js"),listeners=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),AnimationFrame=__webpack_require__("./src/components/AnimationFrame/index.ts"),Component=__webpack_require__("./src/base/Component/index.ts"),lerp=__webpack_require__("./src/utils/math/lerp.ts"),getApp=__webpack_require__("./src/utils/internal/getApp.ts");class CustomCursor extends Component.u{_getDefaultProps(){return{...super._getDefaultProps(),container:window,isEnabled:!0,isNativeCursorHidden:!1,width:36,height:36,lerp:.2,isFpsNormalized:!0,shouldAutoStop:!0}}get prefix(){return`${(0,getApp.S)().prefix}custom-cursor`}get container(){return this._container}get domContainer(){return this.container instanceof Window?(0,getApp.S)().body:this.container}get outerElement(){return this._outerElement}get innerElement(){return this._innerElement}get hoveredElement(){return this._hoveredElement}set hoveredElement(value){this._hoveredElement=value}get coords(){return this._coords}get targetCoords(){const{hoveredElement,props}=this;let{x,y}=this._targetCoords,{width,height}=props,padding=0;if(hoveredElement){const bounding=hoveredElement.element.getBoundingClientRect();hoveredElement.isSticky&&(x=bounding.left+bounding.width/2,y=bounding.top+bounding.height/2),"auto"===hoveredElement.width?width=bounding.width:"number"==typeof hoveredElement.width&&(width=hoveredElement.width),"auto"===hoveredElement.height?height=bounding.height:"number"==typeof hoveredElement.height&&(height=hoveredElement.height),padding=hoveredElement.padding??0}return width+=2*padding,height+=2*padding,{x,y,width,height}}constructor(initialProps,canInit=!0){super(initialProps,!1);const container=(0,selectOne.J)(this.props.container);if(!container)throw new Error(`No cursor container for ${this.props.container}`);this._container=container,this._isContainerWindow=container instanceof Window;const{width,height}=this.props;this._coords={x:0,y:0,width,height},this._targetCoords={x:0,y:0,width,height},canInit&&this.init()}_init(){super._init(),this._createCursor(),this._setEvents(),this.props.isEnabled&&this._enable()}_onPropsMutate(){super._onPropsMutate(),this.props.isEnabled?this._enable():this._disable()}_createCursor(){const{container,domContainer}=this;this.props.isNativeCursorHidden&&(domContainer.style.cursor="none",domContainer.classList.add(this.className("-hide-defaut-cursor"))),domContainer.classList.add(this.className("-container")),this._outerElement=(0,createElement.n)("div",{class:this.className("",container instanceof Window?"-in-window":"-in-element","-disabled"),parent:domContainer}),this._innerElement=(0,createElement.n)("div",{class:this.className("__inner","-disabled"),parent:this._outerElement}),this.callbacks.tbt("create",{outerElement:this.outerElement,innerElement:this.innerElement}),this.addDestroyableAction((()=>{domContainer.style.cursor="",domContainer.classList.remove(this.className("-hide-defaut-cursor")),domContainer.classList.remove(this.className("-container")),this._outerElement.remove(),this._innerElement.remove()}))}_setEvents(){const{domContainer}=this;this._animationFrame=new AnimationFrame.K,this._animationFrame.addCallback("frame",(()=>this.render())),this.addDestroyableAction((()=>this._animationFrame.destroy())),this.addEventListener(domContainer,"mouseenter",this._handleMouseEnter.bind(this)),this.addEventListener(domContainer,"mouseleave",this._handleMouseLeave.bind(this)),this.addEventListener(domContainer,"mousemove",this._handleMouseMove.bind(this)),this.addEventListener(domContainer,"mousedown",this._handleMouseDown.bind(this)),this.addEventListener(domContainer,"mouseup",this._handleMouseUp.bind(this)),this.addEventListener(window,"blur",this._handleWindowBlur.bind(this))}_handleMouseEnter(evt){this._coords.x=evt.clientX,this._coords.y=evt.clientY,this._targetCoords.x=evt.clientX,this._targetCoords.y=evt.clientY,this.outerElement.classList.add(this.className("-in-action"))}_handleMouseLeave(){this.outerElement.classList.remove(this.className("-in-action"))}_handleMouseMove(evt){this._targetCoords.x=evt.clientX,this._targetCoords.y=evt.clientY,this.outerElement.classList.add(this.className("-in-action")),this.props.isEnabled&&this._animationFrame.play()}_handleMouseDown(evt){1===evt.which&&(this.outerElement.classList.add(this.className("-click")),this.innerElement.classList.add(this.className("-click")))}_handleMouseUp(){this.outerElement.classList.remove(this.className("-click")),this.innerElement.classList.remove(this.className("-click"))}_handleWindowBlur(){this._handleMouseUp()}addHoverElement(settingsProp,enterTimeout=100){const settings={width:"auto",height:"auto",...settingsProp},{element}=settings;let timeout;const mouseEnter=(0,listeners.q)(element,"mouseenter",(()=>{timeout=setTimeout((()=>{this.hoveredElement={...settings}}),enterTimeout)})),mouseLeave=(0,listeners.q)(element,"mouseleave",(()=>{timeout&&clearTimeout(timeout),this.hoveredElement=void 0})),remove=()=>{this.hoveredElement?.element===element&&(this.hoveredElement=void 0),mouseEnter.remove(),mouseLeave.remove(),timeout&&clearTimeout(timeout)};return this.addDestroyableAction((()=>remove())),{remove}}get isCoordsInterpolated(){const{coords,targetCoords}=this;return coords.x===targetCoords.x&&coords.y===targetCoords.y&&coords.width===targetCoords.width&&coords.height===targetCoords.height}render(){const{props}=this;this._calculateCoords();const realCoords=this._renderElements();props.shouldAutoStop&&this.isCoordsInterpolated&&this._animationFrame.pause(),this.callbacks.tbt("render",realCoords)}_calculateCoords(){const{targetCoords,_coords:coords}=this;coords.x=this._lerp(coords.x,targetCoords.x),coords.y=this._lerp(coords.y,targetCoords.y),coords.width=this._lerp(coords.width,targetCoords.width),coords.height=this._lerp(coords.height,targetCoords.height)}_lerp(current,target){const{isFpsNormalized,lerp:ease}=this.props,fpsMultiplier=isFpsNormalized?this._animationFrame.easeMultiplier:1;return(0,lerp.C)(current,target,ease*fpsMultiplier,.02)}_renderElements(){const{domContainer,outerElement}=this;let{x,y}=this.coords;const{width,height}=this.coords;if(!this._isContainerWindow){const bounding=domContainer.getBoundingClientRect();x-=bounding.left,y-=bounding.top}return outerElement.style.transform=`translate(${x}px, ${y}px)`,outerElement.style.setProperty("--cursor-w",`${width}px`),outerElement.style.setProperty("--cursor-h",`${height}px`),{x,y,width,height}}_enable(){this.outerElement.classList.remove(this.className("-disabled")),this.innerElement.classList.remove(this.className("-disabled")),this._animationFrame.play()}_disable(){this.outerElement.classList.add(this.className("-disabled")),this.innerElement.classList.add(this.className("-disabled")),this._animationFrame.pause()}}CustomCursor.displayName="CustomCursor";var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const stories_Component=()=>{const ref=(0,react.useRef)(null),refWithSize=(0,react.useRef)(null),refWithSticky=(0,react.useRef)(null);return(0,react.useEffect)((()=>{if(!ref.current)return;const instance=new CustomCursor({container:ref.current});return window.instance=instance,refWithSize.current&&instance.addHoverElement({element:refWithSize.current,width:"auto",height:"auto",padding:10}),refWithSticky.current&&instance.addHoverElement({element:refWithSticky.current,width:"auto",height:"auto",padding:10,isSticky:!0}),()=>instance.destroy()}),[]),(0,jsx_runtime.jsxs)("div",{ref,style:{position:"relative"},children:[(0,jsx_runtime.jsx)("p",{children:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt voluptate provident ratione, libero explicabo illum iusto minima, fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio sequi culpa harum!"}),(0,jsx_runtime.jsx)("button",{ref:refWithSize,type:"button",children:"Change size on hover"}),(0,jsx_runtime.jsx)("p",{children:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt voluptate provident ratione, libero explicabo illum iusto minima, fugiat sint nemo iure? Enim debitis, quidem id repudiandae distinctio sequi culpa harum!"}),(0,jsx_runtime.jsx)("button",{ref:refWithSticky,type:"button",children:"Sticky on hover"})]})};stories_Component.displayName="Component";try{stories_Component.displayName="Component",stories_Component.__docgenInfo={description:"",displayName:"Component",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/CustomCursor/stories/index.tsx#Component"]={docgenInfo:stories_Component.__docgenInfo,name:"Component",path:"src/components/CustomCursor/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/CustomCursor",component:stories_Component},Default={};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]},"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.n{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/Callbacks/index.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class Module{_getDefaultProps(){return{}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)())throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_1__.n,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_2__.P(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init())}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.q)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{P:()=>MutableProps});var _utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=()=>{},_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)(),{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/AnimationFrame/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>AnimationFrame});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class AnimationFrame extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.u{_getDefaultProps(){return{...super._getDefaultProps(),fps:"auto",autoFpsFrames:10,isEnabled:!1}}get isPlaying(){return this._isPlaying}get computedFPS(){return this._computedFPS}get easeMultiplier(){return 60/this.computedFPS}constructor(initialProps,canInit=!0){super(initialProps,!1),this._isPlaying=!1,this._frame=null,this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this._frameDurations=[],this._computedFPS="auto"!==this.props.fps?this.props.fps:60,canInit&&this.init()}_init(){super._init(),this.props.isEnabled&&this.play()}_onPropsMutate(){super._onPropsMutate(),this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this.props.isEnabled?this._play():this._pause()}play(){this.isDestroyed||this.props.isEnabled||this.changeProps({isEnabled:!0})}_play(){this.isPlaying||(this._isPlaying=!0,this.callbacks.tbt("play",void 0),this.callbacks.tbt("toggle",void 0),this._frame=window.requestAnimationFrame(this._animate.bind(this)))}pause(){this.props.isEnabled&&this.changeProps({isEnabled:!1})}_pause(){this.isPlaying&&(this._frame&&(window.cancelAnimationFrame(this._frame),this._frame=null),this._isPlaying=!1,this.callbacks.tbt("pause",void 0),this.callbacks.tbt("toggle",void 0))}_animate(){if(!this._isPlaying)return;this._frame=window.requestAnimationFrame(this._animate.bind(this));const startTime=+new Date;null===this._firstFrameTime&&(this._firstFrameTime=startTime);const minFrameDuration="auto"===this.props.fps?1:1e3/this.props.fps,newFrameIndex=Math.floor((startTime-this._firstFrameTime)/minFrameDuration);newFrameIndex<=this._frameIndex||(this._frameIndex=newFrameIndex,this._computeFPS(startTime),this.callbacks.tbt("frame",void 0),this._lastFrameTime=startTime)}_computeFPS(startTime){const lastFrameDuration=startTime-(this._lastFrameTime??startTime);if(lastFrameDuration<=0||lastFrameDuration>250)return;if(this._frameDurations.push(lastFrameDuration),this._frameDurations.length<this.props.autoFpsFrames)return;const approximateFrameDuration=this._frameDurations.reduce(((prev,curr)=>prev+curr))/this._frameDurations.length,computedFPS=Math.floor(1e3/approximateFrameDuration),normalizedFPS=10*Math.round(computedFPS/10);this._computedFPS=normalizedFPS,this._frameDurations=[]}_destroy(){this.pause(),super._destroy()}}},"./src/utils/math/lerp.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function lerp(current,target,ease,approximationLeft=.001){const value=current*(1-ease)+target*ease;return Math.abs(target-value)<=approximationLeft?target:value}__webpack_require__.d(__webpack_exports__,{C:()=>lerp})},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./node_modules/vevet-dom/dist/es/createElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function setElClass(e,classNames,action){const names=classNames.split(" ");for(let i=0;i<names.length;i++)void 0===action?e.classList.toggle(names[i]):action?e.classList.add(names[i]):e.classList.remove(names[i])}function createElement(selector,prop={}){const el=document.createElement(selector);if(prop.class&&function addClass(el,classNames){if(el instanceof Element)setElClass(el,classNames,!0);else for(let i=0;i<el.length;i++)setElClass(el[i],classNames,!0)}(el,prop.class),prop.id&&el.setAttribute("id",prop.id),prop.attr)for(let i=0,l=prop.attr.length;i<l;i++){const attrInfo=prop.attr[i];el.setAttribute(attrInfo[0],attrInfo[1])}if(prop.parent&&prop.parent.appendChild(el),prop.html&&(el.innerHTML=prop.html),prop.children)for(let i=0,l=prop.children.length;i<l;i++)el.appendChild(prop.children[i]);return el}__webpack_require__.d(__webpack_exports__,{n:()=>createElement})},"./node_modules/vevet-dom/dist/es/isElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isElement(el){return el instanceof HTMLElement||el instanceof Element}__webpack_require__.d(__webpack_exports__,{v:()=>isElement})},"./node_modules/vevet-dom/dist/es/isWindow.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isWindow(el){return el instanceof Window}__webpack_require__.d(__webpack_exports__,{l:()=>isWindow})},"./node_modules/vevet-dom/dist/es/selectOne.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>selectOne});var _isElement__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),_isWindow__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/vevet-dom/dist/es/isWindow.js");function selectOne(selector,parent){if((0,_isWindow__WEBPACK_IMPORTED_MODULE_0__.l)(selector))return selector;if((0,_isElement__WEBPACK_IMPORTED_MODULE_1__.v)(selector))return selector;if(void 0!==parent){const parenEl=selectOne(parent);if(parenEl)return parenEl.querySelector(selector)}return document.querySelector(selector)}}}]);