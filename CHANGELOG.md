# Changelog

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
