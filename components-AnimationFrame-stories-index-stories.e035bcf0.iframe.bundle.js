/*! For license information please see components-AnimationFrame-stories-index-stories.e035bcf0.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[1495],{"./src/components/AnimationFrame/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,ExactFPS:()=>ExactFPS,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),AnimationFrame=__webpack_require__("./src/components/AnimationFrame/index.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Component=({fps})=>{const[animationFrame,setAnimationFrame]=(0,react.useState)(),[targetFps,setTargetFps]=(0,react.useState)(0),[computedFps,setComputedFps]=(0,react.useState)(0),[time,setTime]=(0,react.useState)(0),[isPlaying,setIsPlaying]=(0,react.useState)(!1);return(0,react.useEffect)((()=>{const frame=new AnimationFrame.$({fps},!1);return frame.addResponsiveProps({breakpoint:"viewport_phone",settings:{fps:10}}),frame.init(),frame.init(),setAnimationFrame(frame),setTargetFps(frame.props.fps),frame.addCallback("propsMutate",(()=>setTargetFps(frame.props.fps))),frame.addCallback("frame",(()=>{setComputedFps(frame.computedFPS),setTime(+new Date)})),frame.addCallback("toggle",(()=>setIsPlaying(frame.isPlaying))),frame.addCallback("destroy",(()=>{console.log("destroy")})),()=>frame.destroy()}),[fps]),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>animationFrame?.play(),disabled:isPlaying,children:"Play"}),(0,jsx_runtime.jsx)("button",{type:"button",onClick:()=>animationFrame?.pause(),disabled:!isPlaying,children:"Pause"}),(0,jsx_runtime.jsxs)("ul",{children:[(0,jsx_runtime.jsxs)("li",{children:["Target FPS: ",targetFps]}),(0,jsx_runtime.jsxs)("li",{children:["Computed FPS: ",computedFps]}),(0,jsx_runtime.jsxs)("li",{children:["Time: ",time]})]})]})};Component.displayName="Component";try{Component.displayName="Component",Component.__docgenInfo={description:"",displayName:"Component",props:{fps:{defaultValue:null,description:"",name:"fps",required:!0,type:{name:'number | "auto"'}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/AnimationFrame/stories/index.tsx#Component"]={docgenInfo:Component.__docgenInfo,name:"Component",path:"src/components/AnimationFrame/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/AnimationFrame",component:Component},Default={args:{fps:"auto"},argTypes:{fps:{control:"text"}}},ExactFPS={args:{fps:20}};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    fps: 'auto'\n  },\n  argTypes: {\n    fps: {\n      control: 'text'\n    }\n  }\n}",...Default.parameters?.docs?.source}}},ExactFPS.parameters={...ExactFPS.parameters,docs:{...ExactFPS.parameters?.docs,source:{originalSource:"{\n  args: {\n    fps: 20\n  }\n}",...ExactFPS.parameters?.docs?.source}}};const __namedExportsOrder=["Default","ExactFPS"]},"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{w:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.Y{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Callbacks/index.ts");class Module{_getDefaultProps(){return{parent:null}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get app(){return this._app}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!window.vevetApp)throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._app=window.vevetApp,this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_0__.Y,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_1__.l(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init(),this.props.parent&&this.props.parent.addCallback("destroy",(()=>this.destroy()),{isProtected:!0,name:this.name}))}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=this._app.viewport.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.O)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l:()=>MutableProps});class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=(()=>{}),_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._app=window.vevetApp,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=this._app.viewport.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=this._app,{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/AnimationFrame/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>AnimationFrame});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class AnimationFrame extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.w{_getDefaultProps(){return{...super._getDefaultProps(),fps:"auto",autoFpsFrames:10,isEnabled:!1}}get isPlaying(){return this._isPlaying}get computedFPS(){return this._computedFPS}get easeMultiplier(){return 60/this.computedFPS}constructor(initialProps,canInit=!0){super(initialProps,!1),this._isPlaying=!1,this._frame=null,this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this._frameDurations=[],this._computedFPS="auto"!==this.props.fps?this.props.fps:60,canInit&&this.init()}_init(){super._init(),this.props.isEnabled&&this.play()}_onPropsMutate(){super._onPropsMutate(),this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this.props.isEnabled?this._play():this._pause()}play(){this.isDestroyed||this.props.isEnabled||this.changeProps({isEnabled:!0})}_play(){this.isPlaying||(this._isPlaying=!0,this.callbacks.tbt("play",void 0),this.callbacks.tbt("toggle",void 0),this._frame=window.requestAnimationFrame(this._animate.bind(this)))}pause(){this.props.isEnabled&&this.changeProps({isEnabled:!1})}_pause(){this.isPlaying&&(this._frame&&(window.cancelAnimationFrame(this._frame),this._frame=null),this._isPlaying=!1,this.callbacks.tbt("pause",void 0),this.callbacks.tbt("toggle",void 0))}_animate(){if(!this._isPlaying)return;this._frame=window.requestAnimationFrame(this._animate.bind(this));const startTime=+new Date;null===this._firstFrameTime&&(this._firstFrameTime=startTime);const minFrameDuration="auto"===this.props.fps?1:1e3/this.props.fps,newFrameIndex=Math.floor((startTime-this._firstFrameTime)/minFrameDuration);newFrameIndex<=this._frameIndex||(this._frameIndex=newFrameIndex,this._computeFPS(startTime),this.callbacks.tbt("frame",void 0),this._lastFrameTime=startTime)}_computeFPS(startTime){const lastFrameDuration=startTime-(this._lastFrameTime??startTime);if(lastFrameDuration<=0||lastFrameDuration>250)return;if(this._frameDurations.push(lastFrameDuration),this._frameDurations.length<this.props.autoFpsFrames)return;const approximateFrameDuration=this._frameDurations.reduce(((prev,curr)=>prev+curr))/this._frameDurations.length,computedFPS=Math.floor(1e3/approximateFrameDuration),normalizedFPS=10*Math.round(computedFPS/10);this._computedFPS=normalizedFPS,this._frameDurations=[]}_destroy(){this.pause(),super._destroy()}}},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);