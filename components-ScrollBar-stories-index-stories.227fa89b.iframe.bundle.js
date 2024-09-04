"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[77],{"./src/components/ScrollBar/stories/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,WithInnerScroll:()=>WithInnerScroll,WithSmoothScroll:()=>WithSmoothScroll,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),times=__webpack_require__("./src/utils/common/times.ts"),SmoothScroll=__webpack_require__("./src/components/SmoothScroll/index.ts"),selectOne=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),listeners=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),DraggerMove=__webpack_require__("./src/components/DraggerMove/index.ts"),onScroll=__webpack_require__("./src/utils/scroll/onScroll.ts"),clamp=__webpack_require__("./src/utils/math/clamp.ts"),getScrollValues=__webpack_require__("./src/utils/scroll/getScrollValues.ts");class Bar{get outer(){return this._outer}get thumb(){return this._thumb}get prefix(){return this.props.prefix}get isHorizontal(){return"x"===this.props.direction}get isVertical(){return!this.isHorizontal}get scrollElement(){return this.props.container instanceof Window?document.documentElement:this.props.container}get scrollLine(){const{scrollElement}=this;return this.isHorizontal?scrollElement.scrollWidth-scrollElement.clientWidth:scrollElement.scrollHeight-scrollElement.clientHeight}get scrollWidth(){return this.scrollElement.scrollWidth}get scrollHeight(){return this.scrollElement.scrollHeight}get props(){return this._props}constructor(_props){this._props=_props;const{direction,domParent,container,canAutoHide}=_props;this._outerHeight=0,this._outerWidth=0,this._thumbHeight=0,this._thumbWidth=0,this._prevScrollValue=0,this._coordsAtDragStart={scrollLeft:0,scrollTop:0};const outer=document.createElement("div");this._outer=outer,outer.classList.add(this.className("")),outer.classList.add(this.className(`_${direction}`)),container instanceof Window&&outer.classList.add(this.className("_in-window")),outer.classList.toggle(this.className("_auto-hide"),canAutoHide),domParent.append(outer);const thumb=document.createElement("div");this._thumb=thumb,thumb.classList.add(this.className("__thumb")),thumb.classList.add(this.className(`__thumb_${direction}`)),outer.append(thumb),this._setEvents()}className(value){return`${this.props.prefix}${value}`}_setEvents(){this._listeners||(this._listeners=[]);const{outer,thumb,props}=this;this._listeners.push((0,listeners.q)(outer,"mouseenter",(()=>this._handleHover(!0)))),this._listeners.push((0,listeners.q)(outer,"mouseleave",(()=>this._handleHover(!1)))),this._scrollEvent=(0,onScroll.n)({container:props.container,callback:data=>this._handleScroll(data)}),this.props.isDraggable&&(this._dragger=new DraggerMove.O({container:thumb}),this._dragger.addCallback("start",(()=>{this._coordsAtDragStart=(0,getScrollValues.Q)(this.props.container)})),this._dragger.addCallback("move",(data=>this._handleThumbDrag(data))))}_removeEvents(){this._listeners?.forEach((listener=>listener.remove())),this._scrollEvent?.remove(),this._dragger?.destroy()}_handleHover(isHovered){const className=this.className("_is-hovered");this.outer.classList.toggle(className,isHovered)}_handleScroll({scrollLeft,scrollTop}){let hasChanged=!1;if(this.isHorizontal?(hasChanged=scrollLeft!==this._prevScrollValue,this._prevScrollValue=scrollLeft):(hasChanged=scrollTop!==this._prevScrollValue,this._prevScrollValue=scrollTop),hasChanged){if(this.props.canAutoHide&&hasChanged){const actionClassName=this.className("_in-action");this.outer.classList.add(actionClassName),this._actionTimeout&&clearTimeout(this._actionTimeout),this._actionTimeout=setTimeout((()=>this.outer.classList.remove(actionClassName)),500)}this._renderThumb()}}_handleThumbDrag({event,coords,start}){event.preventDefault();const{scrollLine}=this,{container}=this.props,leftIterator=(coords.x-start.x)/(this._outerWidth-this._thumbWidth)*scrollLine,topIterator=(coords.y-start.y)/(this._outerHeight-this._thumbHeight)*scrollLine;let{scrollLeft,scrollTop}=this._coordsAtDragStart;this.isHorizontal?scrollLeft+=leftIterator:scrollTop+=topIterator,container.scrollTo({top:scrollTop,left:scrollLeft,behavior:"isSmoothScroll"in this.props.container?this.props.scrollBehavior:"auto"})}_renderThumb(){const progress=(0,clamp.q)(this._prevScrollValue/this.scrollLine,[0,1]),x=this.isHorizontal?(this._outerWidth-this._thumbWidth)*progress:0,y=this.isVertical?(this._outerHeight-this._thumbHeight)*progress:0;this._thumb.style.transform=`translate(${x}px, ${y}px)`}resize(){const{outer,thumb,scrollLine,scrollWidth,scrollHeight,isHorizontal}=this,{minSize,shouldAutoSize}=this.props;if(outer.classList.toggle(this.className("_is-empty"),0===scrollLine),this._outerHeight=outer.clientHeight,this._outerWidth=outer.clientWidth,shouldAutoSize)if(isHorizontal){const barSize=(0,clamp.q)(this._outerWidth/(scrollWidth/(scrollWidth-scrollLine)),[minSize,1/0]);thumb.style.width=`${barSize}px`}else{const barSize=(0,clamp.q)(this._outerHeight/(scrollHeight/(scrollHeight-scrollLine)),[minSize,1/0]);thumb.style.height=`${barSize}px`}this._thumbHeight=thumb.clientHeight,this._thumbWidth=thumb.clientWidth,this._renderThumb()}destroy(){this._removeEvents(),this._actionTimeout&&clearTimeout(this._actionTimeout),this._outer.remove()}}var Component=__webpack_require__("./src/base/Component/index.ts"),onResize=__webpack_require__("./src/utils/listeners/onResize.ts"),getApp=__webpack_require__("./src/utils/internal/getApp.ts");class ScrollBar extends Component.u{_getDefaultProps(){return{...super._getDefaultProps(),container:window,domParent:!1,resizeDebounce:16,isDraggable:!0,shouldAutoSize:!0,canAutoHide:!0,minSize:50,scrollBehavior:"smooth"}}get prefix(){return`${(0,getApp.S)().prefix}scrollbar`}get container(){return this._container}get scrollableElement(){const{container}=this;return container instanceof Window?(0,getApp.S)().body:container instanceof Element?container:container.container}get domParent(){const{domParent}=this.props;if(domParent)return domParent;const{container}=this;return container instanceof Window?(0,getApp.S)().body:container instanceof Element?container:container.container}constructor(initialProps,canInit=!0){super(initialProps,!1);const{container}=this.props;if("string"==typeof container){const element=(0,selectOne.J)(container);if(!element)throw new Error("No scroll container");this._container=element}else this._container=container;const barProps={...this.props,container:this.container,domParent:this.domParent,prefix:this.prefix};this._xBar=new Bar({...barProps,direction:"x"}),this._yBar=new Bar({...barProps,direction:"y"}),this.toggleClassName(this.scrollableElement,this.className("-parent"),!0),canInit&&this.init()}_init(){super._init(),this._setEvents()}_setEvents(){const{container,props}=this,resizeHandler=(0,onResize.E)({onResize:()=>this.resize(),element:[this._xBar.outer,this._yBar.outer],viewportTarget:"any",hasBothEvents:!0,resizeDebounce:props.resizeDebounce}),smoothScrollResize="isSmoothScroll"in container?container.addCallback("resize",(()=>resizeHandler.debounceResize()),{name:this.name}):void 0;this.addDestroyableAction((()=>{resizeHandler.remove(),smoothScrollResize?.remove()})),resizeHandler.resize()}_onPropsMutate(){super._onPropsMutate(),this.resize()}resize(){this._xBar.resize(),this._yBar.resize()}_destroy(){super._destroy(),this._xBar.destroy(),this._yBar.destroy()}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const WithSmoothScrollComponent=()=>{const containerRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{if(!containerRef.current)return;const scroll=new SmoothScroll.W({container:containerRef.current}),scrollBar=new ScrollBar({container:scroll});return()=>{scrollBar.destroy(),scroll.destroy()}}),[]),(0,jsx_runtime.jsx)("div",{ref:containerRef,className:"v-smooth-scroll",style:{height:500,maxWidth:500,backgroundColor:"#eee"},children:(0,jsx_runtime.jsx)("div",{className:"v-smooth-scroll__wrapper",children:(0,times.H)((index=>(0,jsx_runtime.jsx)("div",{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quibusdam fugit at quos. Quod repellendus placeat provident. Iste saepe veniam iure, reiciendis a dolor in commodi dolores placeat mollitia illum?"},index)),40)})})};WithSmoothScrollComponent.displayName="WithSmoothScrollComponent";try{WithSmoothScrollComponent.displayName="WithSmoothScrollComponent",WithSmoothScrollComponent.__docgenInfo={description:"",displayName:"WithSmoothScrollComponent",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ScrollBar/stories/WithSmoothScrollComponent.tsx#WithSmoothScrollComponent"]={docgenInfo:WithSmoothScrollComponent.__docgenInfo,name:"WithSmoothScrollComponent",path:"src/components/ScrollBar/stories/WithSmoothScrollComponent.tsx#WithSmoothScrollComponent"})}catch(__react_docgen_typescript_loader_error){}const WithInnerScrollComponent=()=>{const containerRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{if(!containerRef.current)return;const scrollBar=new ScrollBar({container:containerRef.current,domParent:document.body});return()=>scrollBar.destroy()}),[]),(0,jsx_runtime.jsx)("div",{ref:containerRef,style:{height:500,maxWidth:500,backgroundColor:"#eee",overflow:"auto"},children:(0,times.H)((index=>(0,jsx_runtime.jsx)("div",{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quibusdam fugit at quos. Quod repellendus placeat provident. Iste saepe veniam iure, reiciendis a dolor in commodi dolores placeat mollitia illum?"},index)),40)})};WithInnerScrollComponent.displayName="WithInnerScrollComponent";try{WithInnerScrollComponent.displayName="WithInnerScrollComponent",WithInnerScrollComponent.__docgenInfo={description:"",displayName:"WithInnerScrollComponent",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ScrollBar/stories/WithInnerScroll.tsx#WithInnerScrollComponent"]={docgenInfo:WithInnerScrollComponent.__docgenInfo,name:"WithInnerScrollComponent",path:"src/components/ScrollBar/stories/WithInnerScroll.tsx#WithInnerScrollComponent"})}catch(__react_docgen_typescript_loader_error){}const WithDefaultComponent=()=>((0,react.useEffect)((()=>{const scrollBar=new ScrollBar;return()=>scrollBar.destroy()}),[]),(0,jsx_runtime.jsx)("div",{children:(0,times.H)((index=>(0,jsx_runtime.jsx)("div",{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quibusdam fugit at quos. Quod repellendus placeat provident. Iste saepe veniam iure, reiciendis a dolor in commodi dolores placeat mollitia illum?"},index)),200)}));WithDefaultComponent.displayName="WithDefaultComponent";try{WithDefaultComponent.displayName="WithDefaultComponent",WithDefaultComponent.__docgenInfo={description:"",displayName:"WithDefaultComponent",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ScrollBar/stories/Default.tsx#WithDefaultComponent"]={docgenInfo:WithDefaultComponent.__docgenInfo,name:"WithDefaultComponent",path:"src/components/ScrollBar/stories/Default.tsx#WithDefaultComponent"})}catch(__react_docgen_typescript_loader_error){}const index_stories={title:"Components/ScrollBar"},Default=props=>(0,jsx_runtime.jsx)(WithDefaultComponent,{...props});Default.displayName="Default";const WithSmoothScroll=props=>(0,jsx_runtime.jsx)(WithSmoothScrollComponent,{...props});WithSmoothScroll.displayName="WithSmoothScroll";const WithInnerScroll=props=>(0,jsx_runtime.jsx)(WithInnerScrollComponent,{...props});WithInnerScroll.displayName="WithInnerScroll",Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"props => <WithDefaultComponent {...props} />",...Default.parameters?.docs?.source}}},WithSmoothScroll.parameters={...WithSmoothScroll.parameters,docs:{...WithSmoothScroll.parameters?.docs,source:{originalSource:"props => <WithSmoothScrollComponent {...props} />",...WithSmoothScroll.parameters?.docs?.source}}},WithInnerScroll.parameters={...WithInnerScroll.parameters,docs:{...WithInnerScroll.parameters?.docs,source:{originalSource:"props => <WithInnerScrollComponent {...props} />",...WithInnerScroll.parameters?.docs?.source}}};const __namedExportsOrder=["Default","WithSmoothScroll","WithInnerScroll"]},"./src/components/DraggerBase/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>DraggerBase});var vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/vevet-dom/dist/es/isWindow.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_base_Component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/base/Component/index.ts"),_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/utils/internal/getApp.ts");class DraggerBase extends _base_Component__WEBPACK_IMPORTED_MODULE_0__.u{_getDefaultProps(){return{...super._getDefaultProps(),container:`#${this.prefix}`,isPassive:!1,isEnabled:!0}}get prefix(){return`${(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_1__.S)().prefix}dragger`}get container(){return this._container}get isDragging(){return this._runtimeListeners.length>0}get pointerID(){return this._pointerID}get coords(){return this._coords}set coords(value){this._coords=value}get prevCoords(){return this._prevCoords}set prevCoords(value){this._prevCoords=value}get startCoords(){return this._startCoords}get type(){return this._type}constructor(initialProps,canInit=!0){if(super(initialProps,!1),this._container=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.J)(this.props.container),!(0,vevet_dom__WEBPACK_IMPORTED_MODULE_3__.v)(this._container)&&!(0,vevet_dom__WEBPACK_IMPORTED_MODULE_4__.l)(this._container))throw new Error("No container");this._runtimeListeners=[],this._pointerID=null,this._coords={x:0,y:0},this._prevCoords={x:0,y:0},this._startCoords={x:0,y:0},this._fixStyles=document.createElement("style"),this._fixStyles.innerHTML="\n      * { user-select: none !important; }\n    ",canInit&&this.init()}_init(){super._init(),this._setEvents()}_setEvents(){this.addEventListener(this.container,"mousedown",(event=>this._handleStart(event)),{passive:this.props.isPassive}),this.addEventListener(this.container,"touchstart",(event=>this._handleStart(event)),{passive:this.props.isPassive})}_addRuntimeEvents(){const{isPassive}=this.props;this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_5__.q)(window,"mouseup",(event=>this.handleEnd(event)),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_5__.q)(window,"touchend",(event=>this.handleEnd(event)),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_5__.q)(window,"touchcancel",(()=>this.cancel()),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_5__.q)(window,"blur",(()=>this.cancel()),{passive:isPassive}))}_removeRuntimeEvents(){this._runtimeListeners.forEach((listener=>listener.remove())),this._runtimeListeners=[]}_getEventCoords(event){if(event.type.includes("touch")){const evt=event,touch=evt.targetTouches[0]||evt.changedTouches[0];return{x:touch.clientX,y:touch.clientY,pointerId:touch.identifier}}const evt=event;return{x:evt.clientX,y:evt.clientY,pointerId:null}}_handleStart(event){if(!this.props.isEnabled||this.isDragging)return!1;if("touchstart"===event.type?this._type="touch":this._type="mouse","mousedown"===event.type){if(1!==event.which)return!1;event.stopPropagation()}const{x,y,pointerId}=this._getEventCoords(event);return this._coords={x,y},this._prevCoords={x,y},this._startCoords={x,y},this._pointerID=pointerId,this._addRuntimeEvents(),(0,_utils_internal_getApp__WEBPACK_IMPORTED_MODULE_1__.S)().body.append(this._fixStyles),this.callbacks.tbt("start",{event,start:this.startCoords,coords:this.coords}),!0}handleEnd(event){this._handleEndTimeout||(this._handleEndTimeout=setTimeout((()=>{const{pointerId}=this._getEventCoords(event);this.isDragging&&pointerId===this.pointerID&&(this._handleEnd(event),this._handleEndTimeout=void 0)}),1))}_handleEnd(event){this.cancel()}cancel(){this._removeRuntimeEvents(),this._fixStyles.remove(),this.callbacks.tbt("end",void 0)}_destroy(){this.cancel(),super._destroy(),this._removeRuntimeEvents(),this._handleEndTimeout&&clearTimeout(this._handleEndTimeout)}}},"./src/components/DraggerMove/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>DraggerMove});var vevet_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_DraggerBase__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/DraggerBase/index.ts");class DraggerMove extends _DraggerBase__WEBPACK_IMPORTED_MODULE_0__.O{_getDefaultProps(){return{...super._getDefaultProps(),disablePointerEventsAt:!1}}get stepCoords(){return{x:this.coords.x-this.prevCoords.x,y:this.coords.y-this.prevCoords.y}}get diffCoords(){return{x:this.coords.x-this.startCoords.x,y:this.coords.y-this.startCoords.y}}_absDiff={x:0,y:0};get absDiff(){return this._absDiff}_addRuntimeEvents(){super._addRuntimeEvents();const{isPassive}=this.props;this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.q)(window,"mousemove",(event=>{"mouse"===this.type&&this._handleMove(event)}),{passive:isPassive})),this._runtimeListeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.q)(window,"touchmove",(event=>{"touch"===this.type&&this._handleMove(event)}),{passive:isPassive}))}_handleMove(event){const{x,y,pointerId}=this._getEventCoords(event);return!(!this.isDragging||pointerId!==this.pointerID)&&(this.prevCoords={x:this.coords.x,y:this.coords.y},this.coords={x,y},this._absDiff.x+=Math.abs(this.stepCoords.x),this._absDiff.y+=Math.abs(this.stepCoords.y),this._togglePointerEvents(!1),this.callbacks.tbt("move",{event,start:this.startCoords,coords:this.coords,step:this.stepCoords,diff:this.diffCoords,absDiff:this.absDiff}),!0)}_handleEnd(event){super._handleEnd(event),this._absDiff={x:0,y:0},this._togglePointerEvents(!0)}_togglePointerEvents(isEnabledProp){if("number"!=typeof this.props.disablePointerEventsAt)return;if(!(this.container instanceof HTMLElement))return;const isEnabled=Math.abs(this.diffCoords.x)<this.props.disablePointerEventsAt&&Math.abs(this.diffCoords.y)<this.props.disablePointerEventsAt||isEnabledProp;this.container.style.pointerEvents=isEnabled?"":"none"}_destroy(){super._destroy()}}},"./src/utils/common/times.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function times(callback,count){let index=0;const list=[];for(;index<count;)list.push(callback(index,count)),index+=1;return list}__webpack_require__.d(__webpack_exports__,{H:()=>times})},"./src/utils/scroll/getScrollValues.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function getScrollValues(selector=window){if(!selector)return;return{scrollTop:selector instanceof Window?selector.pageYOffset:selector.scrollTop,scrollLeft:selector instanceof Window?selector.pageXOffset:selector.scrollLeft}}__webpack_require__.d(__webpack_exports__,{Q:()=>getScrollValues})},"./src/utils/scroll/onScroll.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{n:()=>onScroll});var vevet_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js"),vevet_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/vevet-dom/dist/es/listeners.js"),_common__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils/common/uid.ts"),_getScrollValues__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/scroll/getScrollValues.ts");let instances=[];function onScroll({container,callback,isPassive=!1}){let instance=instances.find((data=>data.container===container&&data.isPassive===isPassive));const callbackId=(0,_common__WEBPACK_IMPORTED_MODULE_0__.L)("scroll-event");if(instance)instance.callbacks.push({id:callbackId,callback});else if(instance={id:(0,_common__WEBPACK_IMPORTED_MODULE_0__.L)("scroll-event-instance"),container,callbacks:[{id:callbackId,callback}],isPassive,listeners:[]},instances.push(instance),"object"==typeof container&&"isSmoothScroll"in container)instance.listeners.push(container.addCallback("render",(()=>{const{scrollTop,scrollLeft}=container;instance.callbacks.forEach((item=>item.callback({scrollTop,scrollLeft})))}),{name:"onScroll"}));else{const domContainer=(0,vevet_dom__WEBPACK_IMPORTED_MODULE_1__.J)(container);instance.listeners.push((0,vevet_dom__WEBPACK_IMPORTED_MODULE_2__.q)(domContainer,"scroll",(()=>{const data=(0,_getScrollValues__WEBPACK_IMPORTED_MODULE_3__.Q)(domContainer);data&&instance.callbacks.forEach((item=>item.callback(data)))}),{passive:isPassive}))}return{remove:()=>{const newCallbacks=instance.callbacks.filter((item=>item.id!==callbackId));instance.callbacks=newCallbacks,0===newCallbacks.length&&(instance.listeners.forEach((listener=>listener.remove())),instances=instances.filter((item=>item.id!==instance.id)))}}}}}]);