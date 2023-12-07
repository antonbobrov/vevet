"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[7785],{"./src/components/SlideProgress/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),Component=__webpack_require__("./src/base/Component/index.ts"),clamp=__webpack_require__("./src/utils/math/clamp.ts"),lerp=__webpack_require__("./src/utils/math/lerp.ts"),normalizeWheel=__webpack_require__("./src/utils/scroll/normalizeWheel.ts"),AnimationFrame=__webpack_require__("./src/components/AnimationFrame/index.ts"),DraggerMove=__webpack_require__("./src/components/DraggerMove/index.ts"),Timeline=__webpack_require__("./src/components/Timeline/index.ts");class SlideProgress extends Component.w{_getDefaultProps(){return{...super._getDefaultProps(),min:0,max:3,step:1,ease:.1,friction:.5,hasDrag:!0,dragSpeed:1,dragDirection:"y",hasWheel:!0,wheelSpeed:1}}_progressLerp={current:0,target:0};get progress(){return this._progressLerp.current}get steppedProgress(){return this._getNearestStep(this._progressLerp.current)}constructor(initialProps,canInit=!0){super(initialProps,!1);const{container}=this.props;this._animationFrame=new AnimationFrame.$,this._animationFrame.addCallback("frame",(()=>this._handleAnimationFrame())),this._dragger=new DraggerMove.J({container}),this._dragger.addCallback("move",(event=>this._handleDrag(event))),this._dragger.addCallback("start",(event=>event.event.stopPropagation())),this.addEventListener(container,"wheel",(event=>this._handleWheel(event))),canInit&&this.init()}_onPropsMutate(){super._onPropsMutate(),this._dragger.changeProps({isEnabled:this.props.hasDrag})}_handleWheel(event){if(this._timelineTo||!this.props.hasWheel)return;const{_progressLerp:progress}=this,{container,min,max,wheelSpeed}=this.props,y=(0,normalizeWheel.f)(event).pixelY/container.clientHeight*wheelSpeed;progress.target=(0,clamp.u)(progress.target+y,[min,max]),this._animationFrame.play()}_handleDrag({step}){if(this._timelineTo)return;const{_progressLerp:progress}=this,{container,dragSpeed,hasDrag,dragDirection,min,max}=this.props;if(!hasDrag)return;const iterator=("y"===dragDirection?step.y:step.x)*dragSpeed/container.clientHeight;progress.target=(0,clamp.u)(progress.target-iterator,[min,max]),this._animationFrame.play()}_getNearestStep(value){return Math.round(value/this.props.step)*this.props.step}_handleAnimationFrame(){const{_progressLerp:progress}=this,{ease,friction,step}=this.props,{easeMultiplier}=this._animationFrame,nearestSteppedProgress=this._getNearestStep(progress.target);this._timelineTo||(progress.target=(0,lerp.t)(progress.target,nearestSteppedProgress,friction*ease*easeMultiplier),this._updateCurrentProgress(ease*easeMultiplier),progress.current===progress.target&&progress.current%step==0&&this._animationFrame.pause()),this.render()}render(){this.callbacks.tbt("render",void 0)}_updateCurrentProgress(ease){const progress=this._progressLerp,prevSteppedProgress=this._getNearestStep(progress.current);progress.current=(0,lerp.t)(progress.current,progress.target,ease);prevSteppedProgress!==this._getNearestStep(progress.current)&&this.callbacks.tbt("step",void 0)}to({value,duration=500,onProgress,onEnd}){const startValue=this._progressLerp.current,timeline=new Timeline.T({duration});this._timelineTo=timeline,timeline.addCallback("progress",(data=>{this._progressLerp.target=(0,lerp.t)(startValue,value,data.easing),this._updateCurrentProgress(1),onProgress?.(data)})),timeline.addCallback("end",(()=>{this._timelineTo?.destroy(),this._timelineTo=void 0,onEnd?.()})),timeline.play(),this._animationFrame.play()}_destroy(){super._destroy(),this._animationFrame.destroy(),this._dragger.destroy(),this._timelineTo?.destroy()}}SlideProgress.displayName="SlideProgress";var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const stories_Component=()=>{const containerRef=(0,react.useRef)(null),colors=["#A8E6CF","#DCEDC1","#FFD3B6","#FFAAA5","#FF8B94"],{length}=colors;return(0,react.useEffect)((()=>{if(!containerRef.current)return;const instance=new SlideProgress({container:containerRef.current,min:0,max:length-1,step:.5}),elements=Array.from(containerRef.current.children);return instance.addCallback("render",(()=>{elements.forEach(((element,index)=>{const y=-100*instance.progress+100*index;element.style.transform=`translate(0, ${y}%)`}))})),instance.render(),()=>instance.destroy()}),[length]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("p",{children:"Scroll the block below"}),(0,jsx_runtime.jsx)("div",{ref:containerRef,style:{position:"relative",width:300,height:300,overflow:"hidden"},children:colors.map((color=>(0,jsx_runtime.jsx)("div",{style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:color}},color)))})]})};try{stories_Component.displayName="Component",stories_Component.__docgenInfo={description:"",displayName:"Component",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/SlideProgress/stories/index.tsx#Component"]={docgenInfo:stories_Component.__docgenInfo,name:"Component",path:"src/components/SlideProgress/stories/index.tsx#Component"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/SlideProgress",component:stories_Component},Default={};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]},"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{w:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.Y{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Callbacks/index.ts");class Module{_getDefaultProps(){return{parent:null}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get app(){return this._app}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!window.vevetApp)throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._app=window.vevetApp,this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_0__.Y,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_1__.l(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init(),this.props.parent&&this.props.parent.addCallback("destroy",(()=>this.destroy()),{isProtected:!0,name:this.name}))}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=this._app.viewport.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.O)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l:()=>MutableProps});class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=(()=>{}),_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._app=window.vevetApp,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=this._app.viewport.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=this._app,{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/AnimationFrame/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>AnimationFrame});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class AnimationFrame extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.w{_getDefaultProps(){return{...super._getDefaultProps(),fps:"auto",autoFpsFrames:10,isEnabled:!1}}get isPlaying(){return this._isPlaying}get computedFPS(){return this._computedFPS}get easeMultiplier(){return 60/this.computedFPS}constructor(initialProps,canInit=!0){super(initialProps,!1),this._isPlaying=!1,this._frame=null,this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this._frameDurations=[],this._computedFPS="auto"!==this.props.fps?this.props.fps:60,canInit&&this.init()}_init(){super._init(),this.props.isEnabled&&this.play()}_onPropsMutate(){super._onPropsMutate(),this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this.props.isEnabled?this._play():this._pause()}play(){this.isDestroyed||this.props.isEnabled||this.changeProps({isEnabled:!0})}_play(){this.isPlaying||(this._isPlaying=!0,this.callbacks.tbt("play",void 0),this.callbacks.tbt("toggle",void 0),this._frame=window.requestAnimationFrame(this._animate.bind(this)))}pause(){this.props.isEnabled&&this.changeProps({isEnabled:!1})}_pause(){this.isPlaying&&(this._frame&&(window.cancelAnimationFrame(this._frame),this._frame=null),this._isPlaying=!1,this.callbacks.tbt("pause",void 0),this.callbacks.tbt("toggle",void 0))}_animate(){if(!this._isPlaying)return;this._frame=window.requestAnimationFrame(this._animate.bind(this));const startTime=+new Date;null===this._firstFrameTime&&(this._firstFrameTime=startTime);const minFrameDuration="auto"===this.props.fps?1:1e3/this.props.fps,newFrameIndex=Math.floor((startTime-this._firstFrameTime)/minFrameDuration);newFrameIndex<=this._frameIndex||(this._frameIndex=newFrameIndex,this._computeFPS(startTime),this.callbacks.tbt("frame",void 0),this._lastFrameTime=startTime)}_computeFPS(startTime){const lastFrameDuration=startTime-(this._lastFrameTime??startTime);if(lastFrameDuration<=0||lastFrameDuration>250)return;if(this._frameDurations.push(lastFrameDuration),this._frameDurations.length<this.props.autoFpsFrames)return;const approximateFrameDuration=this._frameDurations.reduce(((prev,curr)=>prev+curr))/this._frameDurations.length,computedFPS=Math.floor(1e3/approximateFrameDuration),normalizedFPS=10*Math.round(computedFPS/10);this._computedFPS=normalizedFPS,this._frameDurations=[]}_destroy(){this.pause(),super._destroy()}}},"./src/components/BaseTimeline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{X:()=>BaseTimeline});var Component=__webpack_require__("./src/base/Component/index.ts"),es=__webpack_require__("./node_modules/easing-progress/dist/es/index.js");var clampScope=__webpack_require__("./src/utils/math/clampScope.ts"),uid=__webpack_require__("./src/utils/common/uid.ts");class BaseTimeline extends Component.w{_getDefaultProps(){return{...super._getDefaultProps(),easing:this.app.props.easing,scope:[0,1],hasNestedEasingProgress:!1}}get progress(){return this._progress}set progress(val){this._progress=val,this._handleProgressUpdate()}get easing(){return this._easing}constructor(initialProps,canInit=!0){super(initialProps,!1),this._progress=0,this._easing=0,this._nestedTimelines=[],canInit&&this.init()}addNestedTimeline(timeline){const id=(0,uid.h)();return this._nestedTimelines.push({id,timeline}),{remove:()=>{this._nestedTimelines=this._nestedTimelines.filter((({id:nestedTimelineId})=>nestedTimelineId!==id))}}}_handleProgressUpdate(){this._easing=((progress,easingType=window.vevetApp?.props.easing??!1)=>(0,es.Z)(progress,easingType))(this._progress,this.props.easing),this.callbacks.tbt("progress",{progress:this._progress,easing:this._easing}),this._renderNestedTimelines()}_renderNestedTimelines(){const{length}=this._nestedTimelines;if(0===length)return;const progressForNestedTimeline=this.props.hasNestedEasingProgress?this.easing:this.progress;this._nestedTimelines.forEach((({timeline})=>{const timelineProgress=(0,clampScope.r)(progressForNestedTimeline,timeline.props.nestedScope,[0,1]);timeline.progress=timelineProgress}))}_destroy(){super._destroy(),this._nestedTimelines.forEach((({timeline})=>timeline.destroy()))}}},"./src/components/DraggerBase/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S:()=>DraggerBase});var vevet_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/isWindow.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class DraggerBase extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.w{_getDefaultProps(){return{...super._getDefaultProps(),container:`#${this.prefix}`,isPassive:!1,isEnabled:!0}}get prefix(){return`${this.app.prefix}dragger`}get container(){return this._container}get isDragging(){return this._runtimeListeners.length>0}get pointerID(){return this._pointerID}get coords(){return this._coords}set coords(value){this._coords=value}get prevCoords(){return this._prevCoords}set prevCoords(value){this._prevCoords=value}get startCoords(){return this._startCoords}get type(){return this._type}constructor(initialProps,canInit=!0){if(super(initialProps,!1),this._container=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.z)(this.props.container),!(0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.k)(this._container)&&!(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.F)(this._container))throw new Error("No container");this._runtimeListeners=[],this._pointerID=null,this._coords={x:0,y:0},this._prevCoords={x:0,y:0},this._startCoords={x:0,y:0},canInit&&this.init()}_init(){super._init(),this._setEvents()}_setEvents(){this.addEventListener(this.container,"mousedown",(event=>this._handleStart(event)),{passive:this.props.isPassive}),this.addEventListener(this.container,"touchstart",(event=>this._handleStart(event)),{passive:this.props.isPassive})}_addRuntimeEvents(){const{isPassive}=this.props;this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_4__.O)(window,"mouseup",(event=>this.handleEnd(event)),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_4__.O)(window,"touchend",(event=>this.handleEnd(event)),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_4__.O)(window,"touchcancel",(()=>this.cancel()),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_4__.O)(window,"blur",(()=>this.cancel()),{passive:isPassive}))}_removeRuntimeEvents(){this._runtimeListeners.forEach((listener=>listener.remove())),this._runtimeListeners=[]}_getEventCoords(event){if(event.type.includes("touch")){const evt=event,touch=evt.targetTouches[0]||evt.changedTouches[0];return{x:touch.clientX,y:touch.clientY,pointerId:touch.identifier}}const evt=event;return{x:evt.clientX,y:evt.clientY,pointerId:null}}_handleStart(event){if(!this.props.isEnabled||this.isDragging)return!1;if("touchstart"===event.type?this._type="touch":this._type="mouse","mousedown"===event.type){if(1!==event.which)return!1;event.stopPropagation()}const{x,y,pointerId}=this._getEventCoords(event);return this._coords={x,y},this._prevCoords={x,y},this._startCoords={x,y},this._pointerID=pointerId,this._addRuntimeEvents(),this.callbacks.tbt("start",{event,start:this.startCoords,coords:this.coords}),!0}handleEnd(event){this._handleEndTimeout||(this._handleEndTimeout=setTimeout((()=>{const{pointerId}=this._getEventCoords(event);this.isDragging&&pointerId===this.pointerID&&(this._handleEnd(event),this._handleEndTimeout=void 0)}),1))}_handleEnd(event){this.cancel()}cancel(){this._removeRuntimeEvents(),this.callbacks.tbt("end",void 0)}_destroy(){this.cancel(),super._destroy(),this._removeRuntimeEvents(),this._handleEndTimeout&&clearTimeout(this._handleEndTimeout)}}},"./src/components/DraggerMove/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DraggerMove});var vevet_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_DraggerBase__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/DraggerBase/index.ts");class DraggerMove extends _DraggerBase__WEBPACK_IMPORTED_MODULE_0__.S{_getDefaultProps(){return{...super._getDefaultProps(),disablePointerEventsAt:!1}}get stepCoords(){return{x:this.coords.x-this.prevCoords.x,y:this.coords.y-this.prevCoords.y}}get diffCoords(){return{x:this.coords.x-this.startCoords.x,y:this.coords.y-this.startCoords.y}}_addRuntimeEvents(){super._addRuntimeEvents();const{isPassive}=this.props;this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.O)(window,"mousemove",(event=>{"mouse"===this.type&&this._handleMove(event)}),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.O)(window,"touchmove",(event=>{"touch"===this.type&&this._handleMove(event)}),{passive:isPassive}))}_handleMove(event){const{x,y,pointerId}=this._getEventCoords(event);return!(!this.isDragging||pointerId!==this.pointerID)&&(this.prevCoords={x:this.coords.x,y:this.coords.y},this.coords={x,y},this._togglePointerEvents(!1),this.callbacks.tbt("move",{event,start:this.startCoords,coords:this.coords,step:this.stepCoords,diff:this.diffCoords}),!0)}_handleEnd(event){super._handleEnd(event),this._togglePointerEvents(!0)}_togglePointerEvents(isEnabledProp){if("number"!=typeof this.props.disablePointerEventsAt)return;if(!(this.container instanceof HTMLElement))return;const isEnabled=Math.abs(this.diffCoords.x)<this.props.disablePointerEventsAt&&Math.abs(this.diffCoords.y)<this.props.disablePointerEventsAt||isEnabledProp;this.container.style.pointerEvents=isEnabled?"":"none"}_destroy(){super._destroy()}}},"./src/components/Timeline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>Timeline});var _utils_math__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/utils/math/clamp.ts"),_BaseTimeline__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/BaseTimeline/index.ts");class Timeline extends _BaseTimeline__WEBPACK_IMPORTED_MODULE_0__.X{_getDefaultProps(){return{...super._getDefaultProps(),duration:1e3,shouldDestroyOnEnd:!1}}get isPlaying(){return void 0!==this._animationFrame}get isReversed(){return this._isReversed}get isPaused(){return this._isPaused}constructor(initialProps,canInit=!0){super(initialProps,!1),this._animationFrame=void 0,this._animationFrameLastTime=0,this._isReversed=!1,this._isPaused=!1,canInit&&this.init()}play(){this.isDestroyed||1===this.progress||(this._isReversed=!1,this._isPaused=!1,this.isPlaying||(this._animationFrameLastTime=+new Date,this._animate()))}reverse(){this.isDestroyed||0===this.progress||(this._isReversed=!0,this._isPaused=!1,this.isPlaying||(this._animationFrameLastTime=+new Date,this._animate()))}pause(){this.isDestroyed||(this._isPaused=!0,this._animationFrame&&window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)}reset(){this.isDestroyed||(this.pause(),this.progress=0)}_animate(){if(this.isPaused)return;const{isReversed}=this,currentTime=+new Date,frameDiff=Math.abs(this._animationFrameLastTime-currentTime);this._animationFrameLastTime=currentTime;const progressIterator=frameDiff/this.props.duration/(isReversed?-1:1),progressTarget=(0,_utils_math__WEBPACK_IMPORTED_MODULE_1__.u)(this.progress+progressIterator,[0,1]);if(this.progress=progressTarget,1===progressTarget&&!isReversed||0===progressTarget&&isReversed)return this._isReversed=!1,this._isPaused=!1,void(this._animationFrame=void 0);this._animationFrame=window.requestAnimationFrame(this._animate.bind(this))}_handleProgressUpdate(){super._handleProgressUpdate(),0!==this.progress?1===this.progress&&(this.callbacks.tbt("end",void 0),this.props.shouldDestroyOnEnd&&this.destroy()):this.callbacks.tbt("start",void 0)}_destroy(){this.pause(),super._destroy()}}},"./src/utils/math/clamp.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function clamp(val,scope=[0,1]){return val<scope[0]?scope[0]:val>scope[1]?scope[1]:val}__webpack_require__.d(__webpack_exports__,{u:()=>clamp})},"./src/utils/math/clampScope.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{r:()=>clampScope});var clamp=__webpack_require__("./src/utils/math/clamp.ts");function clampScope(value,scopeProp=[0,1],clampProp=[0,1]){return(0,clamp.u)(function scoped(val,scopeValue=[0,1]){return(val-scopeValue[0])/(scopeValue[1]-scopeValue[0])}(value,scopeProp),clampProp)}},"./src/utils/math/lerp.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function lerp(current,target,ease,approximationLeft=.001){const value=current*(1-ease)+target*ease;return Math.abs(target-value)<=approximationLeft?target:value}__webpack_require__.d(__webpack_exports__,{t:()=>lerp})},"./src/utils/scroll/normalizeWheel.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>normalizeWheel});var normalize_wheel__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/normalize-wheel/index.js"),normalize_wheel__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(normalize_wheel__WEBPACK_IMPORTED_MODULE_0__);function normalizeWheel(event){return normalize_wheel__WEBPACK_IMPORTED_MODULE_0___default()(event)}}}]);