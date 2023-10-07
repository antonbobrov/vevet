/*! For license information please see 567.a4e004eb.iframe.bundle.js.LICENSE.txt */
(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[567],{"./node_modules/normalize-wheel/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/normalize-wheel/src/normalizeWheel.js")},"./node_modules/normalize-wheel/src/ExecutionEnvironment.js":module=>{"use strict";var canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),ExecutionEnvironment={canUseDOM,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:canUseDOM&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:canUseDOM&&!!window.screen,isInWorker:!canUseDOM};module.exports=ExecutionEnvironment},"./node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js":module=>{var _ie,_firefox,_opera,_webkit,_chrome,_ie_real_version,_osx,_windows,_linux,_android,_win64,_iphone,_ipad,_native,_mobile,_populated=!1;function _populate(){if(!_populated){_populated=!0;var uas=navigator.userAgent,agent=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas),os=/(Mac OS X)|(Windows)|(Linux)/.exec(uas);if(_iphone=/\b(iPhone|iP[ao]d)/.exec(uas),_ipad=/\b(iP[ao]d)/.exec(uas),_android=/Android/i.exec(uas),_native=/FBAN\/\w+;/i.exec(uas),_mobile=/Mobile/i.exec(uas),_win64=!!/Win64/.exec(uas),agent){(_ie=agent[1]?parseFloat(agent[1]):agent[5]?parseFloat(agent[5]):NaN)&&document&&document.documentMode&&(_ie=document.documentMode);var trident=/(?:Trident\/(\d+.\d+))/.exec(uas);_ie_real_version=trident?parseFloat(trident[1])+4:_ie,_firefox=agent[2]?parseFloat(agent[2]):NaN,_opera=agent[3]?parseFloat(agent[3]):NaN,(_webkit=agent[4]?parseFloat(agent[4]):NaN)?(agent=/(?:Chrome\/(\d+\.\d+))/.exec(uas),_chrome=agent&&agent[1]?parseFloat(agent[1]):NaN):_chrome=NaN}else _ie=_firefox=_opera=_chrome=_webkit=NaN;if(os){if(os[1]){var ver=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);_osx=!ver||parseFloat(ver[1].replace("_","."))}else _osx=!1;_windows=!!os[2],_linux=!!os[3]}else _osx=_windows=_linux=!1}}var UserAgent_DEPRECATED={ie:function(){return _populate()||_ie},ieCompatibilityMode:function(){return _populate()||_ie_real_version>_ie},ie64:function(){return UserAgent_DEPRECATED.ie()&&_win64},firefox:function(){return _populate()||_firefox},opera:function(){return _populate()||_opera},webkit:function(){return _populate()||_webkit},safari:function(){return UserAgent_DEPRECATED.webkit()},chrome:function(){return _populate()||_chrome},windows:function(){return _populate()||_windows},osx:function(){return _populate()||_osx},linux:function(){return _populate()||_linux},iphone:function(){return _populate()||_iphone},mobile:function(){return _populate()||_iphone||_ipad||_android||_mobile},nativeApp:function(){return _populate()||_native},android:function(){return _populate()||_android},ipad:function(){return _populate()||_ipad}};module.exports=UserAgent_DEPRECATED},"./node_modules/normalize-wheel/src/isEventSupported.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var useHasFeature,ExecutionEnvironment=__webpack_require__("./node_modules/normalize-wheel/src/ExecutionEnvironment.js");ExecutionEnvironment.canUseDOM&&(useHasFeature=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature("","")),module.exports=function isEventSupported(eventNameSuffix,capture){if(!ExecutionEnvironment.canUseDOM||capture&&!("addEventListener"in document))return!1;var eventName="on"+eventNameSuffix,isSupported=eventName in document;if(!isSupported){var element=document.createElement("div");element.setAttribute(eventName,"return;"),isSupported="function"==typeof element[eventName]}return!isSupported&&useHasFeature&&"wheel"===eventNameSuffix&&(isSupported=document.implementation.hasFeature("Events.wheel","3.0")),isSupported}},"./node_modules/normalize-wheel/src/normalizeWheel.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var UserAgent_DEPRECATED=__webpack_require__("./node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js"),isEventSupported=__webpack_require__("./node_modules/normalize-wheel/src/isEventSupported.js");function normalizeWheel(event){var sX=0,sY=0,pX=0,pY=0;return"detail"in event&&(sY=event.detail),"wheelDelta"in event&&(sY=-event.wheelDelta/120),"wheelDeltaY"in event&&(sY=-event.wheelDeltaY/120),"wheelDeltaX"in event&&(sX=-event.wheelDeltaX/120),"axis"in event&&event.axis===event.HORIZONTAL_AXIS&&(sX=sY,sY=0),pX=10*sX,pY=10*sY,"deltaY"in event&&(pY=event.deltaY),"deltaX"in event&&(pX=event.deltaX),(pX||pY)&&event.deltaMode&&(1==event.deltaMode?(pX*=40,pY*=40):(pX*=800,pY*=800)),pX&&!sX&&(sX=pX<1?-1:1),pY&&!sY&&(sY=pY<1?-1:1),{spinX:sX,spinY:sY,pixelX:pX,pixelY:pY}}normalizeWheel.getEventType=function(){return UserAgent_DEPRECATED.firefox()?"DOMMouseScroll":isEventSupported("wheel")?"wheel":"mousewheel"},module.exports=normalizeWheel},"./node_modules/vevet-dom/dist/es/createElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function setElClass(e,classNames,action){const names=classNames.split(" ");for(let i=0;i<names.length;i++)void 0===action?e.classList.toggle(names[i]):action?e.classList.add(names[i]):e.classList.remove(names[i])}function createElement(selector,prop={}){const el=document.createElement(selector);if(prop.class&&function addClass(el,classNames){if(el instanceof Element)setElClass(el,classNames,!0);else for(let i=0;i<el.length;i++)setElClass(el[i],classNames,!0)}(el,prop.class),prop.id&&el.setAttribute("id",prop.id),prop.attr)for(let i=0,l=prop.attr.length;i<l;i++){const attrInfo=prop.attr[i];el.setAttribute(attrInfo[0],attrInfo[1])}if(prop.parent&&prop.parent.appendChild(el),prop.html&&(el.innerHTML=prop.html),prop.children)for(let i=0,l=prop.children.length;i<l;i++)el.appendChild(prop.children[i]);return el}__webpack_require__.d(__webpack_exports__,{a:()=>createElement})},"./node_modules/vevet-dom/dist/es/isElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function isElement(el){return el instanceof HTMLElement||el instanceof Element}__webpack_require__.d(__webpack_exports__,{k:()=>isElement})},"./node_modules/vevet-dom/dist/es/isWindow.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function isWindow(el){return el instanceof Window}__webpack_require__.d(__webpack_exports__,{F:()=>isWindow})},"./node_modules/vevet-dom/dist/es/selectAll.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{t:()=>selectAll});var _isElement__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),_selectOne__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/selectOne.js");function selectAll(selector,parent){if(selector instanceof NodeList)return selector;if((0,_isElement__WEBPACK_IMPORTED_MODULE_0__.k)(selector))return[selector];if(Array.isArray(selector))return selector;if(void 0!==parent){const parenEl=(0,_selectOne__WEBPACK_IMPORTED_MODULE_1__.z)(parent);if(parenEl)return parenEl.querySelectorAll(selector)}return document.querySelectorAll(selector)}},"./node_modules/vevet-dom/dist/es/selectOne.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{z:()=>selectOne});var _isElement__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/vevet-dom/dist/es/isElement.js"),_isWindow__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/vevet-dom/dist/es/isWindow.js");function selectOne(selector,parent){if((0,_isWindow__WEBPACK_IMPORTED_MODULE_0__.F)(selector))return selector;if((0,_isElement__WEBPACK_IMPORTED_MODULE_1__.k)(selector))return selector;if(void 0!==parent){const parenEl=selectOne(parent);if(parenEl)return parenEl.querySelector(selector)}return document.querySelector(selector)}}}]);