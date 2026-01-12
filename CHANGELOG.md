# Changelog

# [5.5.0](https://github.com/antonbobrov/vevet/compare/v5.4.0...v5.5.0) (2026-01-12)


### Cursor

* add default path styles ([15bf466](https://github.com/antonbobrov/vevet/commit/15bf46656690f614a0cb0e65c4d1550fae966bf2))
* additional check for finite numbers in path calculation ([cd009ca](https://github.com/antonbobrov/vevet/commit/cd009ca8663d43600c8f84654083a9aaa92386b6))

### Marquee

* avoid infinite loop when removing marquee children from DOM ([a84810e](https://github.com/antonbobrov/vevet/commit/a84810e322284fabf0d6ba6a1e8700583d7d8d49))
* improve nodes wrapping ([0e43620](https://github.com/antonbobrov/vevet/commit/0e43620d21a1cea1073624294379d43b91325751))

### Snap

* add `containerSize` & deprecate `domSize` ([10381d8](https://github.com/antonbobrov/vevet/commit/10381d85c2d71e71f648ee0df679e0e953aa8dcc))

# [5.4.0](https://github.com/antonbobrov/vevet/compare/v5.3.0...v5.4.0) (2025-12-19)


### Cursor

* add `hoverEnter` and `hoverLeave` callbacks ([7faa1d4](https://github.com/antonbobrov/vevet/commit/7faa1d4e28714c1c0596304eb5fe0d9eeff72b99))
* add `sticky`, `stickyLerp`, `stickyAmplitude` and allow CSS units for hoverable elements ([7f0bb67](https://github.com/antonbobrov/vevet/commit/7f0bb67a3d351bcdfbba7c714fe2511214704fe5))
* add `transformModifier`, `coords.angle` and `coords.velocity` ([4c3c467](https://github.com/antonbobrov/vevet/commit/4c3c46774f32810acf9767c320aba0a5185959ae))
* add `typeShow`, `typeHide` and `noType` callbacks ([e270ce3](https://github.com/antonbobrov/vevet/commit/e270ce38f0f52302dc316b87b56f986ce6083197))
* add CSS units suport for `width` & `height` ([fc72e12](https://github.com/antonbobrov/vevet/commit/fc72e12e54bca61c58b8ec67e45f313034eb5048))
* fix inner styles ([b8b7ec2](https://github.com/antonbobrov/vevet/commit/b8b7ec269cdc1e430e018714c2e53f3077a3db28))
* rename `attachElement` -> `attachHover` ([b6aa08e](https://github.com/antonbobrov/vevet/commit/b6aa08e6a8023b41b6f909c07a16a07ab523bcfa))
* update inner element animation ([13f6e3a](https://github.com/antonbobrov/vevet/commit/13f6e3ae240cf14354a38eb8c9854b8133923dec))

### Global

* avoid styles overriding ([1080e50](https://github.com/antonbobrov/vevet/commit/1080e506f12580c71f80931ac309f57cd3c1e1e5))

### ProgressPreloader

* add `resourceContainer` ([ab5955d](https://github.com/antonbobrov/vevet/commit/ab5955d2cdc640d3e96efb18559e872898781d05))

### Snap

* add `data-snap-parallax-scope="const"` ([2f70c6d](https://github.com/antonbobrov/vevet/commit/2f70c6d332ca995b0fb22db5f2eb8b66a8414dfd))
* parallax - add `min` and `max` values ([647183f](https://github.com/antonbobrov/vevet/commit/647183f643dc6d122742bef123c76855e720732b))

# [5.3.0](https://github.com/antonbobrov/vevet/compare/v5.2.1...v5.3.0) (2025-12-16)


### Callbacks

* use try/catch in actions ([7507d8f](https://github.com/antonbobrov/vevet/commit/7507d8fae5482a02ece16f27dcaa20f4d0289204))

### Core

* remove viewport breakpoints ([c56b86b](https://github.com/antonbobrov/vevet/commit/c56b86b0265222b6e1b6696f82e450be1aae3de9))

### Cursor

* add `behavior` & `path` ([bc2a7fe](https://github.com/antonbobrov/vevet/commit/bc2a7fe4bb0998d14d1b03d6470e656da4174e94))
* rename `sticky` to `snap` ([374f564](https://github.com/antonbobrov/vevet/commit/374f5645032198d618d71d459b0a04648dafd0c7))

### InView

* respect RTL ([9badca6](https://github.com/antonbobrov/vevet/commit/9badca6acfa12ed14ffa6b6323f521123736891c))

### Marquee

* fix negative gap ([653e8a5](https://github.com/antonbobrov/vevet/commit/653e8a53c93c992bea46f492755530e37a5c6f16))
* fix RTL for vertical mode ([202dd2a](https://github.com/antonbobrov/vevet/commit/202dd2a78f3198816265d245e8e35c015390af98))
* reverse speed for RTL ([9efad4f](https://github.com/antonbobrov/vevet/commit/9efad4fb823972a57868bbe50703d30933c13232))

### ProgressPreloader

* clamp lerp ([1b6a45e](https://github.com/antonbobrov/vevet/commit/1b6a45e32cb4990b2d9a192fdc8a78014562ed1e))

### Snap

* add `rewind` ([70d032f](https://github.com/antonbobrov/vevet/commit/70d032f2d0b110f0f401536f8b185744d84becd8))
* add `slidesToScroll` ([e573e87](https://github.com/antonbobrov/vevet/commit/e573e8770749bf9d1015f81f4399a4831f52f530))
* add offset parallax ([c5f3e47](https://github.com/antonbobrov/vevet/commit/c5f3e47701fa248f30b12288ebea60e3617e6e1c))
* disable resize debounce by default ([0bef1d7](https://github.com/antonbobrov/vevet/commit/0bef1d760166d50e55bccdd6dce509d0349211a5))
* make `container` required ([4283ca0](https://github.com/antonbobrov/vevet/commit/4283ca0ed2fc143242a3adae37af7315a16b38b1))

### Swipe

* add `pointerdown`, `pointermove` & `pointerup` callbacks ([896e5d9](https://github.com/antonbobrov/vevet/commit/896e5d9798dbeb5588ca077baab1e70c987ebb66))

## [5.2.1](https://github.com/antonbobrov/vevet/compare/v5.2.0...v5.2.1) (2025-12-04)


### Component

* move on-callbacks outside props ([435cc15](https://github.com/antonbobrov/vevet/commit/435cc159748fdecf855dbc5dce0483308a53e98c))

### Swipe

* add `thumb` ([a69b0fe](https://github.com/antonbobrov/vevet/commit/a69b0feea263871b80a7ea0cd05135aa5038374a))

# [5.2.0](https://github.com/antonbobrov/vevet/compare/v5.1.4...v5.2.0) (2025-12-03)


### Components

* allow callbacks in props ([ea3639c](https://github.com/antonbobrov/vevet/commit/ea3639cc5e21fa61ce3a21c6e50d5b94de022a11))
* better destroyal logic ([7bfedf7](https://github.com/antonbobrov/vevet/commit/7bfedf7ef13d407873fbd2c01122ea8e706b7943))

### Core

* add `inAppBrowser` ([f26499d](https://github.com/antonbobrov/vevet/commit/f26499d8b2917e7170ed385da4e5a39f7463b1b5))
* update `svh` calculation, use native svh for classic browsers ([140d57c](https://github.com/antonbobrov/vevet/commit/140d57cd97668f41563358b7262b6226f5b8b268))

### Cursor

* support RTL ([0f92260](https://github.com/antonbobrov/vevet/commit/0f9226033df76660b7562893e2321fe49e5237e2))

### Marquee

* support RTL ([235e666](https://github.com/antonbobrov/vevet/commit/235e666add69712e3df399b93cc8fb69f75e747a))

### Scrollbar

* support RTL ([1183a5b](https://github.com/antonbobrov/vevet/commit/1183a5b12d6643288bad683636353fcf8e7b13bf))

### Snap

* `swipeInertiaRatio` defaults to 0.5 ([3d6c725](https://github.com/antonbobrov/vevet/commit/3d6c7254481d0d8c6daad7c47e369902c7a5c490))
* add `track.influence` ([5efa107](https://github.com/antonbobrov/vevet/commit/5efa10710d3201bbed1839340251e877dee02170))
* add parallax ([7446dac](https://github.com/antonbobrov/vevet/commit/7446dac11926c53dfb923e1bddc9f5669ce4fd70))
* fix swipe inertia with negative speed ([527199a](https://github.com/antonbobrov/vevet/commit/527199acd3adda510188500b9dc127ae1c5378ed))
* remove `swipeLerp` ([df0f5ae](https://github.com/antonbobrov/vevet/commit/df0f5aefef0a753a65e183b2fe323226c71c9d1c))
* respect `swipeSpeed` for short swipes & no-follow swipes ([6e5de09](https://github.com/antonbobrov/vevet/commit/6e5de091246234bb6379a803280adab21916dd84))

### SplitText

* add `prepareText` ([c941af2](https://github.com/antonbobrov/vevet/commit/c941af29d889b07252e2bc787afdb69b9c6506f7))
* add `wordDelimiter` and `wordDelimiterOutput` ([203c93d](https://github.com/antonbobrov/vevet/commit/203c93dd154c361ccf6a0e6dd23fe95d6ef234f3))

### Swipe

* add `ratio` (multiplier) ([d7c408d](https://github.com/antonbobrov/vevet/commit/d7c408da0c325f3c35fff846dc817dbb9e80b11e))
* respect `ratio` when detecting swipe start ([98bd49d](https://github.com/antonbobrov/vevet/commit/98bd49dba2b61bf35cf14c57969320cc7ac64bef))

## [5.1.4](https://github.com/antonbobrov/vevet/compare/v5.1.3...v5.1.4) (2025-11-07)


### SplitText

* fix line splitting for center alignment ([73260fd](https://github.com/antonbobrov/vevet/commit/73260fd0d331492aa2fd3c99ddac78205e5fccf1))

## [5.1.3](https://github.com/antonbobrov/vevet/compare/v5.1.2...v5.1.3) (2025-11-07)


### SplitText

* better support of text direction and alignment ([8919519](https://github.com/antonbobrov/vevet/commit/8919519b7530645f525ee7ee783c2b6e9d49cca1))

## [5.1.2](https://github.com/antonbobrov/vevet/compare/v5.1.1...v5.1.2) (2025-10-21)


### Marquee

* add `direction`, `totalSize` & `coord`. Allow vertial animation ([79c7b1a](https://github.com/antonbobrov/vevet/commit/79c7b1a9061ddae5f4dba9eb0578be41e2a0344b))

## [5.1.1](https://github.com/antonbobrov/vevet/compare/v5.1.0...v5.1.1) (2025-10-17)


### closest

* return target if values are empty ([9b7eed3](https://github.com/antonbobrov/vevet/commit/9b7eed3e3a67ce6afd272c352e7b704bf9e57138))

### Swipe

* fix velocity calculations ([f017013](https://github.com/antonbobrov/vevet/commit/f017013951df11536f33019b63716cf21792b192))

### Timeline

* make duration always finite ([c0cfc35](https://github.com/antonbobrov/vevet/commit/c0cfc35184cd202f6e09446ff0ff807406ec4a61))

# [5.1.0](https://github.com/antonbobrov/vevet/compare/v5.0.11...v5.1.0) (2025-10-15)


### Cursor

* fix animation start on `enter` & `leave` ([8427330](https://github.com/antonbobrov/vevet/commit/8427330c681607a11af6bdced2447ad41ab97ed0))

### inRange

* fix docs ([c1c4b00](https://github.com/antonbobrov/vevet/commit/c1c4b00c6583ba15f08356e254d583dda4d522e5))

### Module

* skip undefined when merging props ([c27d1d0](https://github.com/antonbobrov/vevet/commit/c27d1d003cbdf3d0b7d1a5a85758e7898d1b2409))

### onResize

* use width viewport target by default ([66f72fb](https://github.com/antonbobrov/vevet/commit/66f72fb95fd33211fcab5adde16565d7455f49fd))

### Pointers

* fix `diff` calculation ([2ff30de](https://github.com/antonbobrov/vevet/commit/2ff30dea7ad4d80bcded9e5cb2ad3c6130dead39))

### Snap

* `friction` default value is `0` ([1344ee7](https://github.com/antonbobrov/vevet/commit/1344ee72425fd696df35c3c1e57ddda2a53eafbd))
* add `freemode: sticky` ([eef91d8](https://github.com/antonbobrov/vevet/commit/eef91d88e465d26057dbf5e7098332b6ed187813))
* add `getNearestMagnet` method ([9503c8e](https://github.com/antonbobrov/vevet/commit/9503c8ef8bb4a2c04367ccd9a4102a4af4dae465))
* add `isSwiping` state ([801894c](https://github.com/antonbobrov/vevet/commit/801894cfe551abda1901542b78848f6213430497))
* add `swipeInertiaStart`, `swipeInertiaEnd`, `swipeInertiaCancel` & `swipeInertiaFail` callbacks ([13081d9](https://github.com/antonbobrov/vevet/commit/13081d967f9e61db752375886c261889534821ea))
* better interpolation of track values ([1abde41](https://github.com/antonbobrov/vevet/commit/1abde417427ffb197d24a1a83410b2a207d5d37f))
* better wheel logic; remove `wheelNoFollowThreshold` & add `stickOnWheelEndThreshold` ([e38dc2d](https://github.com/antonbobrov/vevet/commit/e38dc2d453cb8807cc900b7bbceb3fe19b2bae40))
* end short swipe without inertia when freemode is sticky ([89ec054](https://github.com/antonbobrov/vevet/commit/89ec054198efed451669bfae2862167e0b7dfc5a))
* reveal `render` method ([1034c7e](https://github.com/antonbobrov/vevet/commit/1034c7e85e18b57df9a386944bff54ad14dcae35))
* update transition props, add `easing`, `onStart`, `onUpdate`, `onEnd` ([f28d5c4](https://github.com/antonbobrov/vevet/commit/f28d5c474b792f4bd3635f83ac039f99dc875bbc))

### Swipe

* add `inertiaDistanceThreshold` ([ac00113](https://github.com/antonbobrov/vevet/commit/ac001138ffea16d234b22892859e4306ad3b7b91))
* add `inertiaFail` & `inertiaCancel` callbacks ([1fae9b6](https://github.com/antonbobrov/vevet/commit/1fae9b6870454c8677d2f5cbf656ecbd1bb1a71a))

### toPixels

* fix `px` value ([036fcf8](https://github.com/antonbobrov/vevet/commit/036fcf877824309a1dcae99477a5a68c8fa23ddb))

## [5.0.11](https://github.com/antonbobrov/vevet/compare/v5.0.10...v5.0.11) (2025-07-15)


### clamp

* use real min-max values ([b35331c](https://github.com/antonbobrov/vevet/commit/b35331cfd80b6b697cd31dd31e54d1bec4635298))

### Snap

* add `swipeInertiaDuration` ([cfeacee](https://github.com/antonbobrov/vevet/commit/cfeaceeb305c2279c9fda37a5b51bd81a774f65a))
* add `swipeInertiaRatio` ([d63b420](https://github.com/antonbobrov/vevet/commit/d63b420ee40787a0a6ce2d40640d6ec651402007))
* better logic when `followWheel` is false; add `wheelNoFollowThreshold` ([077e8db](https://github.com/antonbobrov/vevet/commit/077e8db4340461987a1614987850b9b87717e8a3))
* better magnets ([56c5974](https://github.com/antonbobrov/vevet/commit/56c597408916d9bd91cf9aa3c5a504481d5f5daf))
* use inertia for scrollbale slides ([47d387c](https://github.com/antonbobrov/vevet/commit/47d387c426faae14324dfc292b1534f20cb481bb))

### Swipe

* add `velocityModifier` & refactor inertia calculations ([d17e5e8](https://github.com/antonbobrov/vevet/commit/d17e5e8a24648af4cd49646312f249c33e57b979))
* respect `inertiaRatio` when `velocityModifier` is used ([5152f2f](https://github.com/antonbobrov/vevet/commit/5152f2f0396a3d9d84abc766b678e120ffda3773))
* update default `inertiaDuration` ([678131d](https://github.com/antonbobrov/vevet/commit/678131d307ad1004465bb7a0819a00bd2d830943))
* update default `inertiaRatio` ([a99e8f7](https://github.com/antonbobrov/vevet/commit/a99e8f704707076ca01a73ef01196bee05600723))

## [5.0.10](https://github.com/antonbobrov/vevet/compare/v5.0.9...v5.0.10) (2025-06-07)


### Snap

* add `stickOnWheelEnd` ([7a07bc6](https://github.com/antonbobrov/vevet/commit/7a07bc67ac1cfc585613cabf99a098624f875898))

## [5.0.9](https://github.com/antonbobrov/vevet/compare/v5.0.8...v5.0.9) (2025-05-30)


### Scrollbar

* hide before initialization ([054252c](https://github.com/antonbobrov/vevet/commit/054252c7ec16389215e5dfa43f6329f677177d54))
* track children sizes ([4dd742f](https://github.com/antonbobrov/vevet/commit/4dd742f63b4a02d6c117f0c02578dbea89b27c68))

### Snap

* add `wheelThrottle` ([30a610b](https://github.com/antonbobrov/vevet/commit/30a610b6f81c8425e0cfb23080025408cc92bf50))

## [5.0.8](https://github.com/antonbobrov/vevet/compare/v5.0.7...v5.0.8) (2025-05-27)


### Marquee

* fix resize events ([ef60cb4](https://github.com/antonbobrov/vevet/commit/ef60cb491633b8e4c4db487df4c80c0d641c0df4))

## [5.0.7](https://github.com/antonbobrov/vevet/compare/v5.0.6...v5.0.7) (2025-05-16)


### Core

* remove css presets duplicates ([a320de1](https://github.com/antonbobrov/vevet/commit/a320de1af0382bf04da924103e365b97a9197b82))

## [5.0.6](https://github.com/antonbobrov/vevet/compare/v5.0.5...v5.0.6) (2025-05-14)


### Snap

* fix closest magnets detection for non-loop sliders ([78e7529](https://github.com/antonbobrov/vevet/commit/78e7529573648e3c64fd21faca1b9a5539a19a77))
* reset `targetIndex` on timeline animation end, fix `activeSlide` callback triggering ([e3b5f1f](https://github.com/antonbobrov/vevet/commit/e3b5f1f743beb42f79495e9a3e5dfc4c3ee55de6))

### SplitText

* add `ignore` prop ([17f7b78](https://github.com/antonbobrov/vevet/commit/17f7b785ab0cc887b666fa02601c8da464047d78))
* better line splitting, respect `rtl` direction ([a0652bf](https://github.com/antonbobrov/vevet/commit/a0652bfeade029f16bf4d067a21324093dc453aa))
* restore node styles on destroy ([78a8799](https://github.com/antonbobrov/vevet/commit/78a8799bd0c43a295a937b852a3d28cda545763f))

## [5.0.5](https://github.com/antonbobrov/vevet/compare/v5.0.4...v5.0.5) (2025-05-12)

* Snap: optimize `activeSlide` calling ([ead0cb6](https://github.com/antonbobrov/vevet/commit/ead0cb67c19e984a454ccdd8e1d6dae98b706195))
* Rename `getClosest` to `closest` ([1184214](https://github.com/antonbobrov/vevet/commit/11842149d91c4791db032be2d2bb748496ac1774))

## [5.0.4](https://github.com/antonbobrov/vevet/compare/v5.0.3...v5.0.4) (2025-05-12)

* Snap: better prev/next logic ([8553bb3](https://github.com/antonbobrov/vevet/commit/8553bb39cd642648b89a6c01c35ef8598bffd842))
* Utils: add `getClosest` ([20a056e](https://github.com/antonbobrov/vevet/commit/20a056ebc06dbdf55d8e2565017b5df41fbe45f5))
* Snap/Track: add `offset` & `loopCount` ([bbe58dc](https://github.com/antonbobrov/vevet/commit/bbe58dc2f84e2adecdc34a2031cf4d0b070593c0))

## [5.0.3](https://github.com/antonbobrov/vevet/compare/v5.0.2...v5.0.3) (2025-05-02)

* Update docs ([f349786](https://github.com/antonbobrov/vevet/commit/f3497860737a99c7176e4c68a909ba523f046562))
* Update docs ([cd2aa91](https://github.com/antonbobrov/vevet/commit/cd2aa91df76c92a56ce7ed0acdb2f846d1a8b25f))
* Add `CreativeScale` story ([31e5c2e](https://github.com/antonbobrov/vevet/commit/31e5c2e6acce9250336dac097ca6c805f261ae0f))

## [5.0.2](https://github.com/antonbobrov/vevet/compare/v5.0.1...v5.0.2) (2025-04-14)

* Snap: move magnets inside slides ([3700358](https://github.com/antonbobrov/vevet/commit/3700358edc352cc8125aac3644ac1c61c283ba54))
* Add CDN ([add51b4](https://github.com/antonbobrov/vevet/commit/add51b4a2768d7464e3546951b911154def7a365))
* Update stories ([5f1d059](https://github.com/antonbobrov/vevet/commit/5f1d05987f461028d2946cf0ce38ed725ee95f0c))

## [5.0.1](https://github.com/antonbobrov/vevet/compare/v5.0.0...v5.0.1) (2025-03-13)

* Version 5 ([#31](https://github.com/antonbobrov/vevet/pull/31))
