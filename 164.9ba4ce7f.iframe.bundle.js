"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[164],{"./src/base/Component/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>Component});var _Module__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Module/index.ts");class Component extends _Module__WEBPACK_IMPORTED_MODULE_0__.n{addPlugin(plugin){void 0===this._plugins&&(this._plugins=[]),this._plugins.push(plugin),plugin.component=this,plugin.init()}_destroyPlugins(){this._plugins?.forEach((plugin=>plugin.destroy()))}_destroy(){super._destroy(),this._destroyPlugins()}}},"./src/base/Module/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>Module});var vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_MutableProps__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/base/MutableProps/index.ts"),_Callbacks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/base/Callbacks/index.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class Module{_getDefaultProps(){return{}}get props(){return this._mutableProps.props}get callbacks(){return this._callbacks}get name(){return this.constructor.name}get prefix(){return""}_isInitialized=!1;get isInitialized(){return this._isInitialized}_isDestroyed=!1;get isDestroyed(){return this._isDestroyed}constructor(initialProps,canInit=!0){if(!(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)())throw new Error('Vevet.Application does not exist yet. Call "new Vevet.Application()" before using all the stuff');this._callbacks=new _Callbacks__WEBPACK_IMPORTED_MODULE_1__.n,this._listeners=[],this._destroyableActions=[],this._classNamesToRemove=[];const props={...this._getDefaultProps(),...initialProps||{}};this._mutableProps=new _MutableProps__WEBPACK_IMPORTED_MODULE_2__.P(props,(()=>this._onPropsMutate()),this.name),canInit&&this.init()}addResponsiveProps(rules){if(this.isInitialized)throw new Error("Responsive properties cannot be added after `init` is called");this._mutableProps.addResponsiveProps(rules)}changeProps(props){this.isDestroyed||(this._mutableProps.changeProps(props),this._callbacks.tbt("propsChange",void 0))}_onPropsMutate(){this._callbacks.tbt("propsMutate",void 0)}init(){this.isInitialized||(this._isInitialized=!0,this._init())}_init(){}addDestroyableAction(action){this._destroyableActions.push(action)}addViewportCallback(target,action,data={}){const callback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.callbacks.add(target,action,{...data,name:this.constructor.name});this.addDestroyableAction((()=>callback.remove()))}addCallback(target,action,settings={}){return this.callbacks.add(target,action,settings)}addEventListener(el,target,callback,options){const listener=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.q)(el,target,callback,options);return this._listeners.push(listener),{...listener,remove:()=>(this._listeners=this._listeners.filter((item=>item.id!==listener.id)),listener.remove())}}className(...classNames){return classNames.map((value=>`${this.prefix}${value}`)).join(" ")}toggleClassName(element,className,isActive){const isAlreadyExists=element.classList.contains(className);element.classList.toggle(className,isActive),isAlreadyExists||this._classNamesToRemove.push({element,className})}destroy(){this.isDestroyed||this._destroy()}_destroy(){this._callbacks.tbt("destroy",void 0),this._callbacks.destroy(),this._mutableProps.destroy(),this._destroyableActions.forEach((action=>action())),this._listeners.forEach((listener=>listener.remove())),this._classNamesToRemove.forEach((({element,className})=>element.classList.remove(className))),this._isDestroyed=!0}}},"./src/base/MutableProps/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{P:()=>MutableProps});var _utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/internal/getApp.ts");class MutableProps{_responsiveRules=[];get props(){return this._props}constructor(_initProps,_onMutate=()=>{},_name="Responsive Props"){this._initProps=_initProps,this._onMutate=_onMutate,this._name=_name,this._refProps={..._initProps},this._props={..._initProps},this._activeBreakpoints=[]}addResponsiveProps(rules){this._responsiveRules.push(rules),this._responseProps(),void 0===this._viewportCallback&&(this._viewportCallback=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)().viewport.callbacks.add("width",this._responseProps.bind(this),{name:this._name}))}_responseProps(){const app=(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_0__.S)(),{viewport}=app;let newProps=!1;const statProp={...this._refProps},prevActiveBreakpointsString=[...this._activeBreakpoints].join("_");this._activeBreakpoints=[],this._responsiveRules.forEach((({settings,breakpoint})=>{"number"==typeof breakpoint?viewport.width<=breakpoint&&(this._activeBreakpoints.push(breakpoint),newProps={...statProp,...settings}):"string"==typeof breakpoint&&(("viewport_desktop"===breakpoint&&viewport.isDesktop||"viewport_tablet"===breakpoint&&viewport.isTablet||"viewport_phone"===breakpoint&&viewport.isPhone)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}),("device_phone"===breakpoint&&app.isPhone||"device_tablet"===breakpoint&&app.isTablet||"device_mobile"===breakpoint&&app.isMobile)&&(this._activeBreakpoints.push(breakpoint),newProps={...newProps||statProp,...settings}))}));const isPropsChanged=this._activeBreakpoints.join("_")!==prevActiveBreakpointsString;this._props=newProps?{...this._props,...newProps}:{...this._props,...this._refProps},isPropsChanged&&this._onMutate()}changeProps(props){this._props={...this._props,...props},this._refProps={...this._refProps,...props},this._onMutate()}destroy(){this._viewportCallback&&this._viewportCallback.remove()}}},"./src/components/AnimationFrame/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>AnimationFrame});var _base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts");class AnimationFrame extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.u{_getDefaultProps(){return{...super._getDefaultProps(),fps:"auto",autoFpsFrames:10,isEnabled:!1}}get isPlaying(){return this._isPlaying}get computedFPS(){return this._computedFPS}get easeMultiplier(){return 60/this.computedFPS}constructor(initialProps,canInit=!0){super(initialProps,!1),this._isPlaying=!1,this._frame=null,this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this._frameDurations=[],this._computedFPS="auto"!==this.props.fps?this.props.fps:60,canInit&&this.init()}_init(){super._init(),this.props.isEnabled&&this.play()}_onPropsMutate(){super._onPropsMutate(),this._frameIndex=-1,this._firstFrameTime=null,this._lastFrameTime=null,this.props.isEnabled?this._play():this._pause()}play(){this.isDestroyed||this.props.isEnabled||this.changeProps({isEnabled:!0})}_play(){this.isPlaying||(this._isPlaying=!0,this.callbacks.tbt("play",void 0),this.callbacks.tbt("toggle",void 0),this._frame=window.requestAnimationFrame(this._animate.bind(this)))}pause(){this.props.isEnabled&&this.changeProps({isEnabled:!1})}_pause(){this.isPlaying&&(this._frame&&(window.cancelAnimationFrame(this._frame),this._frame=null),this._isPlaying=!1,this.callbacks.tbt("pause",void 0),this.callbacks.tbt("toggle",void 0))}_animate(){if(!this._isPlaying)return;this._frame=window.requestAnimationFrame(this._animate.bind(this));const startTime=+new Date;null===this._firstFrameTime&&(this._firstFrameTime=startTime);const minFrameDuration="auto"===this.props.fps?1:1e3/this.props.fps,newFrameIndex=Math.floor((startTime-this._firstFrameTime)/minFrameDuration);newFrameIndex<=this._frameIndex||(this._frameIndex=newFrameIndex,this._computeFPS(startTime),this.callbacks.tbt("frame",void 0),this._lastFrameTime=startTime)}_computeFPS(startTime){const lastFrameDuration=startTime-(this._lastFrameTime??startTime);if(lastFrameDuration<=0||lastFrameDuration>250)return;if(this._frameDurations.push(lastFrameDuration),this._frameDurations.length<this.props.autoFpsFrames)return;const approximateFrameDuration=this._frameDurations.reduce(((prev,curr)=>prev+curr))/this._frameDurations.length,computedFPS=Math.floor(1e3/approximateFrameDuration),normalizedFPS=10*Math.round(computedFPS/10);this._computedFPS=normalizedFPS,this._frameDurations=[]}_destroy(){this.pause(),super._destroy()}}},"./src/components/SmoothScroll/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>SmoothScroll});var selectOne=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),Component=__webpack_require__("./src/base/Component/index.ts"),clamp=__webpack_require__("./src/utils/math/clamp.ts"),lerp=__webpack_require__("./src/utils/math/lerp.ts"),normalizeWheel=__webpack_require__("./src/utils/scroll/normalizeWheel.ts"),createElement=__webpack_require__("./node_modules/vevet-dom/dist/es/createElement.js"),selectAll=__webpack_require__("./node_modules/vevet-dom/dist/es/selectAll.js");class Elements{get wrapper(){return this._wrapper}get elements(){return this._elements}get props(){return this._props}constructor(_props){this._props=_props,this._createWrapper(),this._createElements()}_createWrapper(){const{wrapperClassName,container}=this.props,existingWrapper=(0,selectOne.J)(`.${wrapperClassName}`,container);if(existingWrapper instanceof HTMLElement)return this._wrapper=existingWrapper,void(this._wrapperInitiallyExists=!0);this._wrapper=(0,createElement.n)("div",{class:wrapperClassName,parent:container,children:Array.from(container.children)}),this._wrapperInitiallyExists=!1}_createElements(){this.props.elements?this._elements=Array.from((0,selectAll.U)(this.props.elements,this.props.container)):this._elements=[this._wrapper],this.props.hasWillChange&&this._elements.forEach((element=>{element.style.willChange="transform"}))}updateElementsProp(scrollLeft,scrollTop){for(let index=0;index<this.elements.length;index+=1){const element=this.elements[index];element.smoothScrollLeft=scrollLeft,element.smoothScrollTop=scrollTop;const lerpAttr=element.getAttribute("data-smooth-scroll-lerp");lerpAttr&&(element.smoothScrollLerp=parseFloat(lerpAttr))}}_getToFixed(value){const{translatePrecision}=this.props;return"number"==typeof translatePrecision?parseFloat(value.toFixed(translatePrecision)):value}render(){for(let index=0;index<this.elements.length;index+=1){const element=this._elements[index],x=this._getToFixed(-element.smoothScrollLeft),y=this._getToFixed(-element.smoothScrollTop);element.style.transform=`matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, ${y}, 0,1)`}}checkAllScrollValuesEqual(){const array=this.elements;return array.every((({smoothScrollLeft,smoothScrollTop})=>smoothScrollLeft===array[0].smoothScrollLeft&&smoothScrollTop===array[0].smoothScrollTop))}destroy(){if(!this._wrapperInitiallyExists){for(;this.wrapper.firstChild;)this.props.container.appendChild(this.wrapper.firstChild);this._wrapper.remove()}this._elements.forEach((element=>{element.style.transform="",element.style.willChange=""}))}}Elements.displayName="Elements";var components_AnimationFrame=__webpack_require__("./src/components/AnimationFrame/index.ts");class AnimationFrame{get animationFrame(){return this.props.outerAnimationFrame||this._innerAnimationFrame}get easeMultiplier(){return this.animationFrame.easeMultiplier}get props(){return this._props}constructor(_props){this._props=_props}enable(){this.props.outerAnimationFrame?this._animationFrameEvent||(this._animationFrameEvent=this.props.outerAnimationFrame.addCallback("frame",(()=>this.props.callback()),{name:"SmoothScroll"})):(this._innerAnimationFrame||(this._innerAnimationFrame=new components_AnimationFrame.K({fps:"auto"}),this._innerAnimationFrame.addCallback("frame",(()=>this.props.callback()))),this._innerAnimationFrame.play())}disable(){this._animationFrameEvent?.remove(),this._animationFrameEvent=void 0,this._innerAnimationFrame?.pause()}destroy(){this.disable(),this._innerAnimationFrame?.destroy()}}var onResize=__webpack_require__("./src/utils/listeners/onResize.ts"),getApp=__webpack_require__("./src/utils/internal/getApp.ts");class SmoothScroll extends Component.u{_getDefaultProps(){return{...super._getDefaultProps(),container:`#${this.prefix}`,elements:!1,animationFrame:!1,viewportTarget:"any",resizeDebounce:0,hasWillChange:!0,translatePrecision:2,isEnabled:!0,hasWheel:!0,direction:"vertical",isInversedHandlerDirection:!1,shouldAutoStop:!0,hasStopPropagation:!0,lerp:.1,isFpsNormalized:!0,lerpApproximation:.1}}get prefix(){return`${(0,getApp.S)().prefix}smooth-scroll`}get container(){return this._container}get wrapper(){return this._elements.wrapper}get targetLeft(){return this._targetLeft}set targetLeft(value){this.setTargetLeft(value),this._enable()}setTargetLeft(value){this._targetLeft=(0,clamp.q)(value,[0,this.maxScrollableWidth])}get targetTop(){return this._targetTop}set targetTop(value){this.setTargetTop(value),this._enable()}setTargetTop(value){this._targetTop=(0,clamp.q)(value,[0,this.maxScrollableHeight])}get scrollLeft(){return this._scrollLeft}set scrollLeft(value){this.setTargetLeft(value),this._scrollLeft=this._targetLeft,this._isInstant=!0,this._isEqualLerp=!0,this._enable()}get scrollTop(){return this._scrollTop}set scrollTop(value){this.setTargetTop(value),this._scrollTop=this._targetTop,this._isInstant=!0,this._isEqualLerp=!0,this._enable()}get scrollWidth(){return this._scrollWidth}get scrollHeight(){return this._scrollHeight}get clientWidth(){return this._clientWidth}get clientHeight(){return this._clientHeight}get maxScrollableWidth(){return this.scrollWidth-this.clientWidth}get maxScrollableHeight(){return this.scrollHeight-this.clientHeight}get hasScroll(){return this.maxScrollableHeight>0||this.maxScrollableWidth>0}get isSmoothScroll(){return!0}constructor(initialProps,canInit=!0){super(initialProps,!1),this._targetLeft=0,this._targetTop=0,this._scrollLeft=0,this._scrollTop=0,this._scrollWidth=0,this._scrollHeight=0,this._clientWidth=0,this._clientHeight=0,this._wrapperWidth=0,this._wrapperHeight=0,this._frameIndex=0,this._isEqualLerp=!1;const{container,elements,hasWillChange,animationFrame,translatePrecision}=this.props;if(this._container=(0,selectOne.J)(container),!(this._container instanceof HTMLElement))throw new Error(`${container} is not a HTMLElement`);this.toggleClassName(this._container,this.className(""),!0),this._elements=new Elements({container:this._container,wrapperClassName:this.className("__wrapper"),elements,hasWillChange,translatePrecision}),this._setDirectionClassNames(!0),this._animationFrame=new AnimationFrame({callback:()=>this.render(),outerAnimationFrame:animationFrame}),canInit&&this.init()}_init(){super._init(),this._setEvents(),this._toggle()}_setDirectionClassNames(isActive){const{direction}=this.props,isHorizontal="horizontal"===direction&&isActive,isVertical="vertical"===direction&&isActive;this.wrapper.classList.toggle(this.className("_horizontal"),isHorizontal),this.wrapper.classList.toggle(this.className("_vertical"),isVertical)}_setEvents(){this._setResize(),this.addEventListener(this.container,"wheel",(event=>this.handleWheel(event))),this.addEventListener(this.container,"scroll",(()=>{this.container.scrollTop=0,this.container.scrollLeft=0}))}_setResize(){const{viewportTarget,resizeDebounce}=this.props,resizeHandler=(0,onResize.E)({onResize:({trigger})=>this.resize("ResizeObserver"!==trigger),element:[this.container,this.wrapper],viewportTarget,resizeDebounce,hasBothEvents:!0});this.addDestroyableAction((()=>resizeHandler.remove())),resizeHandler.resize(),resizeHandler.hasResizeObserver||this.addCallback("render",(()=>{this._frameIndex%10==0&&this._recalculateScrollSizes()}),{isProtected:!0,name:this.name})}_onPropsMutate(){super._onPropsMutate(),this._setDirectionClassNames(!0),this.resize(),this._toggle()}_recalculateScrollSizes(){const{wrapper}=this,height=wrapper.clientHeight,width=wrapper.clientWidth;height===this._wrapperHeight&&width===this._wrapperWidth||this.resize(!1)}resize(isNative=!1){this._resize(isNative),this.callbacks.tbt("resize",void 0),this._enable()}_resize(isNative=!1){const{container,wrapper}=this;this._clientWidth=container.clientWidth,this._clientHeight=container.clientHeight,this._wrapperWidth=wrapper.clientWidth,this._wrapperHeight=wrapper.clientHeight,this._scrollWidth=(0,clamp.q)(this._wrapperWidth,[this.clientWidth,1/0]),this._scrollHeight=(0,clamp.q)(this._wrapperHeight,[this.clientHeight,1/0]),isNative&&(this._isInstant=!0),isNative&&(this.setTargetLeft(parseInt(this.targetLeft.toFixed(0),10)),this.setTargetTop(parseInt(this.targetTop.toFixed(0),10))),container.classList.toggle(this.className("_has-scroll"),this.hasScroll),container.classList.toggle(this.className("_no-scroll"),!this.hasScroll),this._elements.updateElementsProp(this.scrollLeft,this.scrollTop)}handleWheel(event){const{isEnabled,hasWheel,hasStopPropagation,isInversedHandlerDirection}=this.props;if(!isEnabled||!hasWheel||!this.hasScroll)return;(hasStopPropagation||this.scrollTop>0&&this.scrollTop<this.maxScrollableHeight||this.scrollLeft>0&&this.scrollLeft<this.maxScrollableWidth)&&(event.stopImmediatePropagation(),event.stopPropagation(),event.preventDefault());const{pixelX,pixelY}=(0,normalizeWheel.j)(event),leftIterator=isInversedHandlerDirection?pixelY:pixelX,topIterator=isInversedHandlerDirection?pixelX:pixelY;this.setTargetLeft(this.targetLeft+leftIterator),this.setTargetTop(this.targetTop+topIterator),this._enable(),this.callbacks.tbt("wheel",{event})}_toggle(){this.props.isEnabled?this._enable():this._disable()}_enable(){this.props.isEnabled&&this._animationFrame.enable()}_disable(){this._animationFrame.disable()}render(){this._frameIndex+=1,this._calcScrollValues(),this._calcElementsValues(),this._elements.render(),this._isInstant&&(this._isInstant=!1),this._isEqualLerp=!1,this.callbacks.tbt("render",void 0),this._checkAutoStop()}_calcScrollValues(){this._scrollLeft=this._lerp(this.scrollLeft,this.targetLeft),this._scrollTop=this._lerp(this.scrollTop,this.targetTop)}_calcElementsValues(){const{elements}=this._elements;for(let index=0;index<elements.length;index+=1){const element=elements[index],elementLerp=this._getLerp(element);element.smoothScrollLeft=this._lerp(element.smoothScrollLeft,this._targetLeft,elementLerp),element.smoothScrollTop=this._lerp(element.smoothScrollTop,this._targetTop,elementLerp)}}_checkAutoStop(){if(!this.props.shouldAutoStop)return;const yDiff=Math.abs(this.targetTop-this.scrollTop),isGlobalInterpolated=0===Math.abs(this.targetLeft-this.scrollLeft)&&0===yDiff,isInnerInterpolated=this._elements.checkAllScrollValuesEqual();isGlobalInterpolated&&isInnerInterpolated&&this._disable()}_lerp(current,target,ease=this._getLerp()){const{lerpApproximation}=this.props,currentEase=this._isInstant?1:ease;return(0,lerp.C)(current,target,currentEase,lerpApproximation)}_getLerp(element){const{lerp:lerpEase,isFpsNormalized}=this.props,fpsMultiplier=isFpsNormalized?this._animationFrame.easeMultiplier:1;return this._isEqualLerp||!element?lerpEase*fpsMultiplier:(element.smoothScrollLerp??lerpEase)*fpsMultiplier}scrollTo({top,left,behavior}){void 0!==left&&("smooth"===behavior?this.setTargetLeft(left):this.scrollLeft=left),void 0!==top&&("smooth"===behavior?this.setTargetTop(top):this.scrollTop=top),"smooth"===behavior&&this._enable()}_destroy(){super._destroy(),this._disable(),this._elements.destroy(),this._animationFrame.destroy(),this._setDirectionClassNames(!1),this._container.classList.remove(this.className("_has-scroll")),this._container.classList.remove(this.className("_no-scroll"))}}SmoothScroll.displayName="SmoothScroll"},"./src/utils/listeners/onResize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function onResize({onResize:handleResize,element,viewportTarget="any",hasBothEvents=!1,resizeDebounce=0}){let timeout,resizeObserver,viewportCallback,isFirstResizeObserverCallback=!0;const debounceResize=(props,delay)=>{timeout&&clearTimeout(timeout),timeout=setTimeout((()=>handleResize(props??{trigger:"unknown"})),delay??resizeDebounce)};return element&&(element instanceof Element||Array.isArray(element))&&"ResizeObserver"in window&&(resizeObserver=new ResizeObserver((()=>{isFirstResizeObserverCallback?isFirstResizeObserverCallback=!1:debounceResize({trigger:"ResizeObserver"},window.vevetApp.props.resizeDebounce+resizeDebounce)})),Array.isArray(element)?element.forEach((item=>resizeObserver?.observe(item))):resizeObserver.observe(element)),!hasBothEvents&&resizeObserver||(viewportCallback=window.vevetApp.viewport.callbacks.add(viewportTarget,(()=>debounceResize({trigger:"Viewport"})))),{remove:()=>{timeout&&clearTimeout(timeout),resizeObserver?.disconnect(),viewportCallback?.remove()},resize:()=>handleResize({trigger:"unknown"}),debounceResize:()=>debounceResize(),hasResizeObserver:!!resizeObserver}}__webpack_require__.d(__webpack_exports__,{E:()=>onResize})},"./src/utils/math/clamp.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function clamp(val,scope=[0,1]){return val<scope[0]?scope[0]:val>scope[1]?scope[1]:val}__webpack_require__.d(__webpack_exports__,{q:()=>clamp})},"./src/utils/math/lerp.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function lerp(current,target,ease,approximationLeft=.001){const value=current*(1-ease)+target*ease;return Math.abs(target-value)<=approximationLeft?target:value}__webpack_require__.d(__webpack_exports__,{C:()=>lerp})},"./src/utils/scroll/normalizeWheel.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{j:()=>normalizeWheel});var normalize_wheel__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/normalize-wheel/index.js"),normalize_wheel__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(normalize_wheel__WEBPACK_IMPORTED_MODULE_0__);function normalizeWheel(event){return normalize_wheel__WEBPACK_IMPORTED_MODULE_0___default()(event)}}}]);