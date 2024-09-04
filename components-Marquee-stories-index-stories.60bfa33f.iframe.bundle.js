/*! For license information please see components-Marquee-stories-index-stories.60bfa33f.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[287],{"./src/components/Marquee/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,WithPauseOnHover:()=>WithPauseOnHover,WithReverseSpeed:()=>WithReverseSpeed,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),selectOne=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),Component=__webpack_require__("./src/base/Component/index.ts");function wrap(min,max,value){const range=max-min;return function conditionalReturn(value,func){return value||0===value?func(value):func}(value,(val=>(range+(val-min)%range)%range+min))}var onResize=__webpack_require__("./src/utils/listeners/onResize.ts"),AnimationFrame=__webpack_require__("./src/components/AnimationFrame/index.ts"),getApp=__webpack_require__("./src/utils/internal/getApp.ts");class Marquee extends Component.u{_getDefaultProps(){return{...super._getDefaultProps(),container:`#${this.prefix}`,viewportTarget:"width",resizeDebounce:0,speed:1,isEnabled:!0,pauseOnHover:!1,prependWhitespace:!0,isFpsNormalized:!0}}get prefix(){return`${(0,getApp.S)().prefix}marquee`}get container(){return this._container}constructor(initialProps,canInit=!0){if(super(initialProps,!1),this._container=(0,selectOne.J)(this.props.container),!(this._container instanceof HTMLElement))throw new Error("No container");this.toggleClassName(this._container,this.className(""),!0),this._initialHTML=this._container.innerHTML,this._quantity=0,this._items=[],this._itemWidth=0,this._xCoord=0,this._canPlay=!0,this.resize(),canInit&&this.init()}_init(){super._init(),this._setEvents()}_onPropsMutate(){super._onPropsMutate(),this.props.isEnabled?this._animationFrame?.play():this._animationFrame?.pause()}_setEvents(){const{container,props}=this,{viewportTarget,resizeDebounce}=props;this._animationFrame=new AnimationFrame.K,this._animationFrame.addCallback("frame",(()=>this._render())),this.addDestroyableAction((()=>this._animationFrame?.destroy())),this.props.isEnabled&&this._animationFrame.play(),this.addEventListener(container,"mouseenter",(()=>{this.props.pauseOnHover&&(this._canPlay=!1)})),this.addEventListener(container,"mouseleave",(()=>{this._canPlay=!0}));const resizeHandler=(0,onResize.E)({onResize:()=>this.resize(),element:this.container,viewportTarget,resizeDebounce,hasBothEvents:!0});this.addDestroyableAction((()=>resizeHandler.remove())),(0,getApp.S)().onPageLoad().then((()=>this.resize())).catch((()=>{}))}resize(){this.isDestroyed||this._createItems()}_createItems(){this._disconnectMutations();const{container}=this;this._quantity=0,this._items=[],this.container.innerHTML="",container.style.position="relative",container.style.display="block",container.style.width="100%",container.style.overflow="hidden",container.style.whiteSpace="nowrap";let itemWidth=this._createItem(!0).clientWidth;itemWidth<=0&&(itemWidth=window.innerWidth),this._itemWidth=itemWidth,itemWidth<container.clientWidth&&(this._quantity=Math.ceil((container.clientWidth+itemWidth)/itemWidth)),this._quantity=Math.max(this._quantity,4);for(let index=1;index<this._quantity;index+=1)this._createItem(!1);this._render(0),this._observeMutations()}_createItem(isFirst=!1){const element=document.createElement("div");element.classList.add(this.className("__element")),isFirst||element.setAttribute("aria-hidden","true");const prefix=""+(this.props.prependWhitespace?"&nbsp;":""),body=this._initialHTML;return element.innerHTML=`${prefix}${body}`,isFirst||(element.style.position="absolute",element.style.top="0",element.style.left="0"),element.style.display="inline-block",this.container.appendChild(element),this._items.push(element),element}_observeMutations(){if(this._mutationObserver)return;this._mutationObserver=new MutationObserver((mutationsList=>{mutationsList.forEach((mutation=>{"childList"===mutation.type&&(this._initialHTML=this.container.innerHTML,this._createItems())}))})),this._mutationObserver.observe(this.container,{childList:!0})}_disconnectMutations(){this._mutationObserver?.disconnect(),this._mutationObserver=void 0}render(speed=this.props.speed){this._render(speed)}_render(speedProp){if(!this._canPlay)return;const{_quantity:qunantity,_itemWidth:itemWidth,props}=this,{isFpsNormalized}=props,fpsMultiplier=isFpsNormalized?this._animationFrame?.easeMultiplier??1:1,defaultSpeed=props.speed*fpsMultiplier,speed=speedProp??defaultSpeed;this._xCoord-=speed;const totalWidth=itemWidth*(qunantity-1);for(let index=0;index<qunantity;index+=1){const element=this._items[index],x=wrap(-itemWidth,totalWidth,this._xCoord+itemWidth*index);element.style.transform=`matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, 0, 0,1)`}this.callbacks.tbt("render",void 0)}_destroy(){super._destroy(),this._disconnectMutations(),this.container.innerHTML=this._initialHTML}}Marquee.displayName="Marquee";var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const stories_Component=props=>{const ref=(0,react.useRef)(null),[width,setWidth]=(0,react.useState)(400),[marquee,setMarquee]=(0,react.useState)();return(0,react.useEffect)((()=>{if(!ref.current)return;const instance=new Marquee({...props,container:ref.current});return setMarquee(instance),()=>instance.destroy()}),[props]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>setWidth((val=>val+20)),children:"Rezize (changes parent width)"}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>marquee?.changeProps({isEnabled:!0}),children:"Play"}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>marquee?.changeProps({isEnabled:!1}),children:"Pause"}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>marquee?.render(),children:"Manual render"}),(0,jsx_runtime.jsx)("br",{}),(0,jsx_runtime.jsx)("br",{}),(0,jsx_runtime.jsx)("div",{style:{background:"#ccc",width},children:(0,jsx_runtime.jsx)("span",{ref,children:"Marquee"})})]})};try{stories_Component.displayName="Component",stories_Component.__docgenInfo={description:"",displayName:"Component",props:{speed:{defaultValue:{value:"1"},description:"Marquee speed",name:"speed",required:!1,type:{name:"number"}},isEnabled:{defaultValue:{value:"true"},description:"Enable animation",name:"isEnabled",required:!1,type:{name:"boolean"}},pauseOnHover:{defaultValue:{value:"false"},description:"Pause on hover",name:"pauseOnHover",required:!1,type:{name:"boolean"}},isFpsNormalized:{defaultValue:{value:"true"},description:"On different screens with different FPS, animation may be slower or faster.\nThis property is to normalize animation speed across different screens.",name:"isFpsNormalized",required:!1,type:{name:"boolean"}},__fixHelperChangeableProps:{defaultValue:null,description:"",name:"__fixHelperChangeableProps",required:!1,type:{name:"any"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Marquee/stories/index.tsx#Component"]={docgenInfo:stories_Component.__docgenInfo,name:"Component",path:"src/components/Marquee/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/Marquee",component:stories_Component},Default={args:{}},WithPauseOnHover={args:{pauseOnHover:!0}},WithReverseSpeed={args:{speed:-1}};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {}\n}",...Default.parameters?.docs?.source}}},WithPauseOnHover.parameters={...WithPauseOnHover.parameters,docs:{...WithPauseOnHover.parameters?.docs,source:{originalSource:"{\n  args: {\n    pauseOnHover: true\n  }\n}",...WithPauseOnHover.parameters?.docs?.source}}},WithReverseSpeed.parameters={...WithReverseSpeed.parameters,docs:{...WithReverseSpeed.parameters?.docs,source:{originalSource:"{\n  args: {\n    speed: -1\n  }\n}",...WithReverseSpeed.parameters?.docs?.source}}};const __namedExportsOrder=["Default","WithPauseOnHover","WithReverseSpeed"]},"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.n{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/Callbacks/index.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class Module{_getDefaultProps(){return{}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)())throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_1__.n,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_2__.P(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init())}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.q)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{P:()=>MutableProps});var _utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=()=>{},_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)(),{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/AnimationFrame/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>AnimationFrame});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class AnimationFrame extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.u{_getDefaultProps(){return{...super._getDefaultProps(),fps:"auto",autoFpsFrames:10,isEnabled:!1}}get isPlaying(){return this._isPlaying}get computedFPS(){return this._computedFPS}get easeMultiplier(){return 60/this.computedFPS}constructor(initialProps,canInit=!0){super(initialProps,!1),this._isPlaying=!1,this._frame=null,this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this._frameDurations=[],this._computedFPS="auto"!==this.props.fps?this.props.fps:60,canInit&&this.init()}_init(){super._init(),this.props.isEnabled&&this.play()}_onPropsMutate(){super._onPropsMutate(),this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this.props.isEnabled?this._play():this._pause()}play(){this.isDestroyed||this.props.isEnabled||this.changeProps({isEnabled:!0})}_play(){this.isPlaying||(this._isPlaying=!0,this.callbacks.tbt("play",void 0),this.callbacks.tbt("toggle",void 0),this._frame=window.requestAnimationFrame(this._animate.bind(this)))}pause(){this.props.isEnabled&&this.changeProps({isEnabled:!1})}_pause(){this.isPlaying&&(this._frame&&(window.cancelAnimationFrame(this._frame),this._frame=null),this._isPlaying=!1,this.callbacks.tbt("pause",void 0),this.callbacks.tbt("toggle",void 0))}_animate(){if(!this._isPlaying)return;this._frame=window.requestAnimationFrame(this._animate.bind(this));const startTime=+new Date;null===this._firstFrameTime&&(this._firstFrameTime=startTime);const minFrameDuration="auto"===this.props.fps?1:1e3/this.props.fps,newFrameIndex=Math.floor((startTime-this._firstFrameTime)/minFrameDuration);newFrameIndex<=this._frameIndex||(this._frameIndex=newFrameIndex,this._computeFPS(startTime),this.callbacks.tbt("frame",void 0),this._lastFrameTime=startTime)}_computeFPS(startTime){const lastFrameDuration=startTime-(this._lastFrameTime??startTime);if(lastFrameDuration<=0||lastFrameDuration>250)return;if(this._frameDurations.push(lastFrameDuration),this._frameDurations.length<this.props.autoFpsFrames)return;const approximateFrameDuration=this._frameDurations.reduce(((prev,curr)=>prev+curr))/this._frameDurations.length,computedFPS=Math.floor(1e3/approximateFrameDuration),normalizedFPS=10*Math.round(computedFPS/10);this._computedFPS=normalizedFPS,this._frameDurations=[]}_destroy(){this.pause(),super._destroy()}}},"./src/utils/listeners/onResize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function onResize({onResize:handleResize,element,viewportTarget="any",hasBothEvents=!1,resizeDebounce=0}){let timeout,resizeObserver,viewportCallback,isFirstResizeObserverCallback=!0;const debounceResize=(props,delay)=>{timeout&&clearTimeout(timeout),timeout=setTimeout((()=>handleResize(props??{trigger:"unknown"})),delay??resizeDebounce)};return element&&(element instanceof Element||Array.isArray(element))&&"ResizeObserver"in window&&(resizeObserver=new ResizeObserver((()=>{isFirstResizeObserverCallback?isFirstResizeObserverCallback=!1:debounceResize({trigger:"ResizeObserver"},window.vevetApp.props.resizeDebounce+resizeDebounce)})),Array.isArray(element)?element.forEach((item=>resizeObserver?.observe(item))):resizeObserver.observe(element)),!hasBothEvents&&resizeObserver||(viewportCallback=window.vevetApp.viewport.add(viewportTarget,(()=>debounceResize({trigger:"Viewport"})))),{remove:()=>{timeout&&clearTimeout(timeout),resizeObserver?.disconnect(),viewportCallback?.remove()},resize:()=>handleResize({trigger:"unknown"}),debounceResize:()=>debounceResize(),hasResizeObserver:!!resizeObserver}}__webpack_require__.d(__webpack_exports__,{E:()=>onResize})},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./node_modules/vevet-dom/dist/es/isElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isElement(el){return el instanceof HTMLElement||el instanceof Element}__webpack_require__.d(__webpack_exports__,{v:()=>isElement})},"./node_modules/vevet-dom/dist/es/isWindow.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isWindow(el){return el instanceof Window}__webpack_require__.d(__webpack_exports__,{l:()=>isWindow})},"./node_modules/vevet-dom/dist/es/selectOne.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>selectOne});var _isElement__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),_isWindow__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/vevet-dom/dist/es/isWindow.js");function selectOne(selector,parent){if((0,_isWindow__WEBPACK_IMPORTED_MODULE_0__.l)(selector))return selector;if((0,_isElement__WEBPACK_IMPORTED_MODULE_1__.v)(selector))return selector;if(void 0!==parent){const parenEl=selectOne(parent);if(parenEl)return parenEl.querySelector(selector)}return document.querySelector(selector)}}}]);